.PHONY: help setup dev lint format typecheck test build check openapi

help:             ## Lista los comandos
	@grep -E '^[a-z-]+:.*##' $(MAKEFILE_LIST) | sed -E 's/:.*## /\t/'

setup:            ## Instala dependencias, hooks de git y .env (usa Node 24: `nvm use`)
	npm ci
	uvx pre-commit install
	test -f .env || cp .env.example .env

-include .env
export

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

test:             ## Pruebas con Jest (ARGS="-t nombre" para filtrar)
	npx jest $(ARGS)

build:            ## Build de producción
	npx next build

check: lint typecheck test build   ## Lo que debe pasar antes de un PR

OPENAPI_URL ?= $(API_URL)/openapi.json
openapi:          ## Regenera los tipos de la API (OPENAPI_URL=... para apuntar a dev)
	npx openapi-typescript $(OPENAPI_URL) -o src/shared/infrastructure/api/schema.d.ts
