#!/usr/bin/env bash

setup_node_environment() {
    log "Setting up Node.js environment..."
    
    mkdir -p "${BASE_DIR}/build/node"
    cd "${BASE_DIR}/build/node"
    
    # Download and install Node.js
    curl -o node.tar.gz "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz"
    tar -xzf node.tar.gz --strip-components=1
    
    # Install Yarn
    npm install -g yarn@${YARN_VERSION}
    
    # Configure npm/yarn for global installs
    mkdir -p "${BASE_DIR}/rootfs/base/usr/local/lib/node_modules"
    npm config set prefix "${BASE_DIR}/rootfs/base/usr/local"
}