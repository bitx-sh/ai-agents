
#!/usr/bin/env bash

# Base configuration
BASE_DIR="${PWD}/discourse-conversion"
DISCOURSE_VERSION="3.1.0"
DISCOURSE_REPO="https://github.com/discourse/discourse.git"

# User configuration
DISCOURSE_UID=2000
DISCOURSE_GID=2000

# Ruby configuration
RUBY_VERSION="3.2.2"
BUNDLER_VERSION="2.4.22"

# Resource limits
MAX_MEMORY="3G"
MAX_TASKS="4096"
MAX_CPU_WEIGHT="100"

# Discourse plugins to install
DISCOURSE_PLUGINS=(
    "discourse-solved"
    "discourse-voting"
    "discourse-math"
    "discourse-chat-integration"
)

# Persistent directories
DISCOURSE_PERSISTENT_DIRS=(
    "/var/www/discourse/public/uploads"
    "/var/www/discourse/public/backups"
    "/var/www/discourse/tmp"
    "/var/log/discourse"
)
