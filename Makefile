# Variables
IMAGE_NAME = gxit-query-builder
CONTAINER_NAME = GXITQB
PORT = 4173
DOCKER_USERNAME = tibex
TAG = 20250624-184132
FULL_IMAGE_NAME = $(DOCKER_USERNAME)/$(IMAGE_NAME):$(TAG)

# Default target
.PHONY: help
help:
	@echo "Usage:"
	@echo "  make build       - Build the Docker image"
	@echo "  make run         - Run the Docker container"
	@echo "  make dev         - Run the container in detached mode"
	@echo "  make stop        - Stop the running container"
	@echo "  make clean       - Remove the image and container"

start:
	npm run dev

# Build the Docker image
build:
	docker build --no-cache -t $(FULL_IMAGE_NAME) .

# Run the container in foreground
run:
	docker run -p $(PORT):$(PORT) --name $(CONTAINER_NAME) $(FULL_IMAGE_NAME)

# Run the container in detached mode
dev:
	docker run -d -p $(PORT):$(PORT) --name $(CONTAINER_NAME) $(FULL_IMAGE_NAME)

# Stop and remove the container
stop:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

# Remove container and image
clean: stop
	docker rmi $(FULL_IMAGE_NAME) || true

# Push the image to Docker Hub
push: build
	docker push $(FULL_IMAGE_NAME)

# Open bash inside the running container
bash:
	docker exec -it $(CONTAINER_NAME) sh

.PHONY: build run dev stop clean push bash
