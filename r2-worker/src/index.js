const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Detailed GET logging
    if (request.method === "GET" && url.pathname !== "/upload") {
      try {
        console.log(`[GET] Request for: ${url.pathname}`);
        const key = url.pathname.slice(1); // Remove leading '/'
        if (!key) {
          console.log("[GET] No key provided");
          return new Response("Missing key", { status: 400, headers: corsHeaders });
        }

        // Check binding
        if (!env["cut-images-worker"]) {
          console.error("[GET] R2 binding (cut-images-worker) missing");
          return new Response("R2 binding missing", { status: 500, headers: corsHeaders });
        }

        // Fetch object from R2
        const object = await env["cut-images-worker"].get(key);
        if (!object) {
          console.warn(`[GET] Object not found for key: ${key}`);
          return new Response("Not found", { status: 404, headers: corsHeaders });
        }

        // Log success and metadata
        console.log(`[GET] Object found: ${key} (${object.body?.length || "stream"})`);
        const contentType = object.httpMetadata?.contentType || "application/octet-stream";
        return new Response(object.body, {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": contentType
          }
        });
      } catch (e) {
        console.error(`[GET] Exception for key ${url.pathname}: ${e.message}`);
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // POST /upload handler
    if (request.method === "POST" && url.pathname === "/upload") {
      try {
        const formData = await request.formData();

        // Find the first File in the FormData, regardless of field name
        let file, fieldName;
        for (const [name, value] of formData.entries()) {
          if (value instanceof File) {
            file = value;
            fieldName = name;
            break;
          }
        }

        if (!file) {
          return new Response(JSON.stringify({ error: "No file found in form data." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // Generate unique key
        const timestamp = Date.now();
        const key = `${timestamp}-${file.name}`;
        await env["cut-images-worker"].put(key, file.stream(), {
          httpMetadata: { contentType: file.type }
        });

        // Construct image URL
        const imageUrl = `https://cut-images-worker.cutproject.workers.dev/${key}`;
        return new Response(JSON.stringify({ url: imageUrl, message: "Upload received." }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // 404 fallback
    return new Response("Not found", { status: 404, headers: corsHeaders });
  }
}