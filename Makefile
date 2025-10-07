SHELL := /bin/bash

.PHONY: setup

NODE_VERSION := $(shell cat .nvmrc)

setup:
	@echo "✔ Starting initial setup..."
	@set -e; \
	if [ -s "$$HOME/.nvm/nvm.sh" ]; then \
		. "$$HOME/.nvm/nvm.sh"; \
		nvm use $(NODE_VERSION); \
	else \
		echo "✘ NVM not found. Install NVM before running make setup."; \
		exit 1; \
	fi; \
	npm install; \
	npm run docker; \
	npm run prisma generate; \
	npm run prisma:db:push; \
	npm run seed
	@echo "✔ Initial setup complete."
