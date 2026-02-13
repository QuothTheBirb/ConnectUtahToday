import {getPayload} from "payload";
import config from "@payload-config";
import {NextResponse} from "next/server";

export const POST = async () => {
  try {
    const payload = await getPayload({ config });

    const manualSync = await payload.jobs.queue({
      workflow: 'syncEvents',
      input: {},
      queue: 'sync-events',
    });

    const res = await payload.jobs.runByID({
      id: manualSync.id
    });

    // const res = await payload.jobs.run({
    //   queue: 'manual-sync:events',
    //   // where: {
    //   //   status: {
    //   //     equals: 'pending'
    //   //   }
    //   // }
    // });

    return NextResponse.json(res);
  } catch (error) {
    console.error('Error queuing SyncEvents task:', error);
    return NextResponse.json({ error: 'Failed to queue task' }, { status: 500 });
  }
};
