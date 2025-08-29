up:
	docker compose up -d

down:
	docker compose down

db-import:
	mysql -h 127.0.0.1 -P 3307 -u root -p base_dest < docs/sql/base_destinatarios_import_final.sql

serve:
	php -S localhost:8000 backend/router.php
