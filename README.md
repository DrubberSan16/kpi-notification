# kpi-notification-main

Microservicio NestJS para el esquema `kpi_notification`.

## Variables de entorno
Crea un archivo `.env` con valores similares a estos:

```env
PORT=3000
BASE_PATH=/kpi_notification
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=justice_kpi
DB_SSL=false
```

## Scripts
```bash
npm install
npm run start:dev
npm run build
```

## Swagger
Si defines `BASE_PATH`, Swagger queda disponible en:
- `/<prefix>/docs`
- `/<prefix>/docs-json`

## Cobertura inicial
Este proyecto cubre las tablas del esquema `kpi_notification`:
- tb_notification_channel
- tb_notification_log
- tb_notification_outbox
- tb_notification_template

## Alcance actual
Se dejó la base CRUD y Swagger para poder conectar el frontend y luego implementar la lógica transaccional de renderizado, despacho, reintentos y procesamiento de outbox.

