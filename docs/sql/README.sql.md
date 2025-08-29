# SQL Assets

## Importar dump completo
```bash
mariadb -uroot -pBermudez2020* --host 127.0.0.1 --port 3307 < docs/sql/base_destinatarios_import_final.sql
```

## Migraciones + seeds
```bash
mariadb -uroot -pBermudez2020* --host 127.0.0.1 --port 3307 base_dest < docs/sql/migrations/0001_init.sql
mariadb -uroot -pBermudez2020* --host 127.0.0.1 --port 3307 base_dest < docs/sql/seeds/0001_bootstrap.sql
```
