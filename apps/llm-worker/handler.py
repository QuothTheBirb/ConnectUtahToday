import base64
import io
import os

import runpod
import torch
from PIL import Image
from runpod import RunPodLogger
from transformers import AutoModel, AutoTokenizer

logger = RunPodLogger()

# Model and resource configuration
MODEL_NAME = "openbmb/MiniCPM-o-2_6"
EXAMPLES_PATH = "./examples"
SYSTEM_PROMPT_PATH = "./prompt.txt"
MAX_DIM = 1280

# Initialize model and tokenizer once at startup
logger.info("Initializing model and tokenizer at startup...")


def load_system_prompt():
	"""
	Load and return the system prompt from a text file.
	"""
	if not os.path.exists(SYSTEM_PROMPT_PATH):
		logger.warn(f"System prompt file not found at {SYSTEM_PROMPT_PATH}, using default.")
		return "You are a helpful assistant that extracts event details from posters."
	with open(SYSTEM_PROMPT_PATH, "r") as f:
		return f.read().strip()


def initialize_model():
	"""
	Initialize the pretrained model, set it to evaluation mode, and move it to the GPU.
	"""
	torch.cuda.empty_cache()

	model = AutoModel.from_pretrained(
		MODEL_NAME,
		trust_remote_code=True,
		attn_implementation="sdpa",
		torch_dtype=torch.float16,
		init_vision=True,
		init_audio=False,
		init_tts=False,
		device_map="cuda",
		local_files_only=True,
	)

	model = model.eval()

	return model


def initialize_tokenizer():
	"""
	Initialize and return the processor for the model.
	"""
	return AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True, local_files_only=True)


# Global instances
try:
	MODEL = initialize_model()
	TOKENIZER = initialize_tokenizer()
	SYSTEM_PROMPT = load_system_prompt()
except Exception as e:
	logger.error(f"Failed to initialize model/tokenizer: {e}")
	MODEL = None
	TOKENIZER = None
	SYSTEM_PROMPT = ""


def handle_inference(event):
	"""
	RunPod handler that expects an array of base64-encoded images and returns an array of JSON objects (one per image).
	- Input:
	  - job["input"]["images"]: list of base64 strings (non-empty)
	- Output:
	  - A list of JSON objects (one per image)
	"""
	logger.info(f"Received event: {event}")

	if MODEL is None or TOKENIZER is None:
		return {"error": "Model not initialized correctly."}

	input_data = event.get("input")
	if not input_data:
		return {"error": "No input provided"}

	parsed_event_results = []
	images_b64 = input_data.get("images", [])

	if not images_b64:
		logger.error("No images provided in input")
		return {"error": "No images provided"}

	logger.info(f"Processing {len(images_b64)} images from PayloadCMS")

	try:
		images = []
		for idx, img_b64 in enumerate(images_b64):
			logger.info(f"Decoding image {idx + 1}/{len(images_b64)}")
			img_bytes = base64.b64decode(img_b64)
			image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
			image.thumbnail((MAX_DIM, MAX_DIM))
			images.append(image)
	except Exception as e:
		logger.error(f"Error decoding images: {e}")
		return {"error": f"Error decoding images: {e}"}

	# Prepare the chat messages with few-shot examples and current prompt.
	# For MiniCPM-V models, images are usually passed in the content list
	msgs = [
		{"role": "user", "content": [*images, SYSTEM_PROMPT]},
	]

	# Execute the chat and return the answer.
	logger.info("Running model...")

	try:
		answer = MODEL.chat(msgs=msgs, tokenizer=TOKENIZER)
		logger.info(f"Model response: {answer}")
		return answer
	except Exception as e:
		logger.error(f"Error running model: {e}")
		return {"error": f"Error running model: {e}"}


if __name__ == "__main__":
	# Payload should be JSON that looks like:
	# {
	#   "input": {
	#     "images": ["base64_image1", "base64_image2", ...]
	#   }
	# }

	try:
		runpod.serverless.start({"handler": handle_inference})
	except Exception as e:
		logger.error(f"Failed to start serverless worker: {e}")
		raise
