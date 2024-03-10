.PHONY: buf-generate
buf-generate:
	docker compose run buf-generate

.PHONY: up
up:
	docker compose up

.PHONY: down
down:
	docker compose down
