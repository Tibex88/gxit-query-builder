# #!/bin/bash

# # If GALAXY_PARAM_API_TOKEN is not passed in, fallback to ENV
# API_TOKEN=${GALAXY_PARAM_API_TOKEN:-$MY_API_TOKEN}

# # Write it to a file your app can read
# echo "$API_TOKEN" > /usr/share/nginx/html/api_token.txt

# # Start nginx
# exec nginx -g "daemon off;"

# #!/bin/sh

# # Extract GALAXY_PARAM_API_TOKEN (or fall back to a default)
# echo "${GALAXY_PARAM_API_TOKEN:-default_token}" > /usr/share/nginx/html/api_token.txt

# # Optional: add others if needed
# # echo "${GALAXY_PARAM_OTHER_INPUT}" > /usr/share/nginx/html/other_input.txt

# # Start Nginx
# exec nginx -g "daemon off;"


#!/bin/sh

# Inject environment variable into nginx.conf from template
envsubst '$NODE_ENV' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.temp
mv /etc/nginx/conf.d/default.conf.temp /etc/nginx/conf.d/default.conf

# Start nginx in foreground
exec nginx -g "daemon off;"
