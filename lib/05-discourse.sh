#!/usr/bin/env bash

setup_discourse() {
    log "Setting up Discourse..."
    
    mkdir -p "${BASE_DIR}/build/discourse"
    cd "${BASE_DIR}/build/discourse"
    
    # Clone Discourse
    git clone --branch "v${DISCOURSE_VERSION}" "${DISCOURSE_REPO}" .
    
    # Install dependencies
    bundle install --deployment --without development test
    yarn install --production
    
    # Prepare directories
    mkdir -p "${BASE_DIR}/rootfs/base/var/www/discourse"
    cp -r . "${BASE_DIR}/rootfs/base/var/www/discourse"
    
    # Set permissions
    chown -R "${DISCOURSE_UID}:${DISCOURSE_GID}" "${BASE_DIR}/rootfs/base/var/www/discourse"
}