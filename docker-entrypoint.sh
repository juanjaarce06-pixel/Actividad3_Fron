#!/usr/bin/env sh
set -e
: "${BACKEND_URL:=https://actividad3-backend-537174375411.us-central1.run.app}"
cat >/usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__ = { BACKEND_URL: "${BACKEND_URL}" };
EOF
exec nginx -g 'daemon off;'
