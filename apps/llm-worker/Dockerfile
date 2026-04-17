FROM nvidia/cuda:12.1.1-devel-ubuntu22.04

# Override the default huggingface cache directory.
ENV HF_HOME="/runpod-volume/.cache/huggingface/"
ENV HF_DATASETS_CACHE="/runpod-volume/.cache/huggingface/datasets/"
ENV DEFAULT_HF_METRICS_CACHE="/runpod-volume/.cache/huggingface/metrics/"
ENV DEFAULT_HF_MODULES_CACHE="/runpod-volume/.cache/huggingface/modules/"
ENV HUGGINGFACE_HUB_CACHE="/runpod-volume/.cache/huggingface/hub/"
ENV HUGGINGFACE_ASSETS_CACHE="/runpod-volume/.cache/huggingface/assets/"

# Faster transfer of models from the hub to the container
ENV HF_HUB_ENABLE_HF_TRANSFER="1"

# Environment variables for PyTorch memory management
ENV PYTORCH_CUDA_ALLOC_CONF="expandable_segments:True"

# This is not scary and it does not actually break system packages. This is a container, we're allowed to install things globally.
ENV PIP_ROOT_USER_ACTION=ignore
ENV PIP_BREAK_SYSTEM_PACKAGES=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3-pip \
    python3-dev \
    git \
    g++ \
    ffmpeg \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN ldconfig /usr/local/cuda-12.1.1/compat/

WORKDIR /

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade -r requirements.txt --no-cache-dir

# Apparently, this thing does in fact thinks it's special and needs to be here.
# If this breaks in the future? No, we shant humor such a grim possibility.
RUN FLASH_ATTENTION_SKIP_CUDA_BUILD=TRUE pip install flash-attn==2.7.3 --no-cache-dir --no-build-isolation

# Copy the application code and assets
COPY handler.py .
COPY prompt.txt .
COPY examples/ ./examples/

# Start the handler
EXPOSE 8000
CMD ["python3", "-u", "handler.py"]
#CMD ["python3", "-u", "handler.py", "--rp_serve_api", "--rp_debugger", "--rp_api_port=8080", "--rp_api_host 0.0.0.0"]
