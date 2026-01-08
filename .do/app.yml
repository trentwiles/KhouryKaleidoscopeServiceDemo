name: kaleidoscope-service-demo

services:
  # fastapi backend
  - name: backend
    source_dir: /backend
    dockerfile_path: Dockerfile
    http_port: 8000
    instance_count: 1
    instance_size_slug: basic-xxs
    routes:
      - path: /api
    envs:
      - key: DATABASE_URL
        scope: RUN_TIME
        value: ${db.DATABASE_URL}
      - key: ALLOWED_ORIGINS
        scope: RUN_TIME
        value: ${APP_URL}
      - key: ENVIRONMENT
        scope: RUN_TIME
        value: production

static_sites:
  # react frontend
  - name: frontend
    source_dir: /frontend
    build_command: npm run build
    output_dir: dist
    index_document: index.html
    error_document: index.html
    envs:
      - key: VITE_API_URL
        scope: BUILD_TIME
        value: ${APP_URL}/api

databases:
  # managed postgresql
  - name: db
    engine: PG
    production: false
    cluster_name: taskdb
    db_name: taskdb
    db_user: taskdb