
#!/bin/sh

# Inject environment variable into nginx.conf from template
envsubst '$NODE_ENV' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.temp
mv /etc/nginx/conf.d/default.conf.temp /etc/nginx/conf.d/default.conf

# Start nginx in foreground
exec nginx -g "daemon off;"
