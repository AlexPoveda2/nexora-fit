.PHONY: help setup dev lint format typecheck build check

help:             ## Lista los comandos
	@grep -E '^[a-z-]+:.*##' $(MAKEFILE_LIST) | sed -E 's/:.*## /\t/'

setup:            ## Instala dependencias y hooks de git (usa Node 24: `nvm use`)
	npm ci
	uvx pre-commit install

PORT ?= 3000
dev:              ## Front con recarga (PORT=3010 si el 3000 está ocupado)
	npx next dev --port $(PORT)

lint:             ## ESLint (incluye las capas) + Prettier
	npx eslint . --max-warnings=0
	npx prettier --check .

format:           ## Formatea y corrige lo automático
	npx eslint . --fix
	npx prettier --write .

typecheck:        ## tsc
	npx tsc --noEmit

build:            ## Build de producción
	npx next build

check: lint typecheck build   ## Lo que debe pasar antes de un PR (Jest se suma con TF-3)
