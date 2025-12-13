#!/usr/bin/with-contenv bashio

# Get configuration from add-on options
HA_URL=$(bashio::config 'ha_url')
HA_TOKEN=$(bashio::config 'ha_token')

# If no token provided, use the Supervisor token
if [ -z "$HA_TOKEN" ]; then
    HA_TOKEN="${SUPERVISOR_TOKEN}"
fi

# Export environment variables for the Next.js API routes
export HA_WEBSOCKET_URL="${HA_URL}"
export HA_ACCESS_TOKEN="${HA_TOKEN}"

bashio::log.info "Starting Light Controller..."
bashio::log.info "Home Assistant URL: ${HA_URL}"

# Change to app directory
cd /app

# Start the Next.js application
exec npm start
