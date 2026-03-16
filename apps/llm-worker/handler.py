import base64
import io
import json
import os

import runpod
import torch
from PIL import Image
from runpod import RunPodLogger
from transformers import AutoModel, AutoProcessor, AutoTokenizer

logger = RunPodLogger()

# Model and resource configuration
MODEL_NAME = "openbmb/MiniCPM-o-2_6"
EXAMPLES_PATH = "./examples"
SYSTEM_PROMPT_PATH = "./prompt.txt"
MAX_DIM = 1280

# Initialize model and tokenizer once at startup
logger.info("Initializing model and tokenizer at startup...")
MODEL = None
TOKENIZER = None
SYSTEM_PROMPT = None


def load_system_prompt():
	"""
	Load and return the system prompt from a text file.
	"""
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
	)

	model = model.eval().cuda()  # Add if device_map="auto" is unset

	return model


def initialize_tokenizer():
	"""
	Initialize and return the processor for the model.
	"""
	return AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)


def handle_inference(event):
	"""
	RunPod handler that expects an array of base64-encoded images and returns an array of JSON objects (one per image).
	- Input:
	  - job["input"]["images"]: list of base64 strings (non-empty)
	- Output:
	  - A list of JSON objects (one per image)
	"""
	logger.info(f"Received event: {event}")

	input = event.get("input")

	try:
		model = initialize_model()
		tokenizer = initialize_tokenizer()
	except Exception as e:
		msg = f"Error initializing model: {e}"
		logger.error(msg)
		return {"error": msg}

	try:
		system_prompt = load_system_prompt()
		few_shot_examples = []
	except Exception as e:
		msg = f"Error loading system prompt: {e}"
		logger.error(msg)
		return {"error": msg}

	parsed_event_results = []
	images_b64 = input.get("images", [])

	if not images_b64:
		logger.error("No images provided in input")
		return {"error": "No images provided"}

	logger.info(f"Processing {len(images_b64)} images from PayloadCMS")

	try:
		images = []
		for idx, img_b64 in enumerate(images_b64):
			logger.info(f"Decoding image {idx + 1}/{len(images_b64)}")
			img_bytes = base64.b64decode(img_b64)
			image = Image.open(io.BytesIO(img_bytes))
			image.thumbnail((MAX_DIM, MAX_DIM))
			images.append(image)
	except Exception as e:
		logger.error(f"Error decoding images: {e}")
		return {"error": f"Error decoding images: {e}"}

	# Prepare the chat messages with few-shot examples and current prompt.
	msgs = [
		*few_shot_examples,
		{"role": "user", "content": [*images, SYSTEM_PROMPT]},
	]

	# Execute the chat and return the answer.
	logger.info("Running model...")

	try:
		answer = MODEL.chat(msgs=msgs, tokenizer=TOKENIZER)
		parsed_event_results.append(answer)
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
