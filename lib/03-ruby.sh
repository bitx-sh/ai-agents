
#!/usr/bin/env bash

setup_ruby_environment() {
    log "Setting up Ruby environment..."

    # Install Ruby build dependencies
    mkdir -p "${BASE_DIR}/build/ruby"
    cd "${BASE_DIR}/build/ruby" || exit 1

    # Set Ruby version from environment or default
    RUBY_VERSION="${RUBY_VERSION:-3.2.2}"
    BUNDLER_VERSION="${BUNDLER_VERSION:-2.4.22}"

    # Clone Discourse repository
    log "Cloning Discourse repository..."
    git clone --branch "v${DISCOURSE_VERSION}" "${DISCOURSE_REPO}" "${BASE_DIR}/build/discourse"
    cd "${BASE_DIR}/build/discourse" || exit 1

    # Install gem dependencies
    log "Installing gem dependencies..."
    bundle config set --local deployment true
    bundle config set --local without 'development test'
    bundle install --jobs=$(nproc)

    # Install node modules
    log "Installing node modules..."
    yarn install --production

    # Build assets
    log "Building assets..."
    RAILS_ENV=production bundle exec rake assets:precompile

    # Copy built application
    log "Copying application files..."
    mkdir -p "${BASE_DIR}/rootfs/base/var/www/discourse"
    cp -r . "${BASE_DIR}/rootfs/base/var/www/discourse"

    # Set up config directory
    mkdir -p "${BASE_DIR}/rootfs/base/etc/discourse"

    # Set up application directories
    for dir in tmp public/uploads public/backups; do
        mkdir -p "${BASE_DIR}/rootfs/base/var/www/discourse/$dir"
        chown -R "${DISCOURSE_UID}:${DISCOURSE_GID}" "${BASE_DIR}/rootfs/base/var/www/discourse/$dir"
    done

    success "Ruby environment setup completed"
}

setup_plugins() {
    log "Setting up Discourse plugins..."
    
    cd "${BASE_DIR}/rootfs/base/var/www/discourse" || exit 1

    # Install official plugins
    for plugin in "${DISCOURSE_PLUGINS[@]}"; do
        log "Installing plugin: $plugin"
        git clone "https://github.com/discourse/$plugin.git" plugins/$plugin
    done

    # Build plugin assets
    RAILS_ENV=production bundle exec rake plugin:install_all_gems
    RAILS_ENV=production bundle exec rake plugin:assets:precompile

    success "Plugin setup completed"
}
