
#!/usr/bin/env bash

setup_ruby_environment() {
    log "Setting up Ruby environment..."
    
    # Install Ruby build dependencies
    mkdir -p "${BASE_DIR}/build/ruby"
    cd "${BASE_DIR}/build/ruby"
    
    # Install rbenv
    git clone https://github.com/rbenv/rbenv.git .rbenv
    git clone https://github.com/rbenv/ruby-build.git .rbenv/plugins/ruby-build
    
    # Configure rbenv
    export PATH="${BASE_DIR}/build/ruby/.rbenv/bin:$PATH"
    eval "$(rbenv init -)"
    
    # Install Ruby
    rbenv install ${RUBY_VERSION}
    rbenv global ${RUBY_VERSION}
    
    # Install Bundler
    gem install bundler:${BUNDLER_VERSION}
}
