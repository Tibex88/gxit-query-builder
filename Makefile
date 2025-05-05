start:
	npm run dev

# Variables
IMAGE_NAME = gxit-query-builder
CONTAINER_NAME = GXITQB
PORT = 4173

# Default target
.PHONY: help
help:
	@echo "Usage:"
	@echo "  make build       - Build the Docker image"
	@echo "  make run         - Run the Docker container"
	@echo "  make dev         - Run the container in detached mode"
	@echo "  make stop        - Stop the running container"
	@echo "  make clean       - Remove the image and container"

# Build the Docker image
build:
	docker build --no-cache -t $(IMAGE_NAME) .

# Run the container in foreground
run:
	docker run -p $(PORT):$(PORT) --name $(CONTAINER_NAME) $(IMAGE_NAME)

# Run the container in detached mode
dev:
	docker run -d -p $(PORT):$(PORT) --name $(CONTAINER_NAME) $(IMAGE_NAME)

# Stop and remove the container
stop:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

# Remove container and image
clean: stop
	docker rmi $(IMAGE_NAME) || true

# Open bash inside the running container
bash:
	docker exec -it $(CONTAINER_NAME) sh

.PHONY: build run dev stop clean bash