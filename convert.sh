
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source library files
for lib in "${SCRIPT_DIR}/lib"/*.sh; do
    source "$lib"
done

# Main execution
main() {
    log "Starting Discourse conversion setup..."
    
    validate_environment
    create_directory_structure
    setup_ruby_environment
    setup_node_environment
    setup_discourse
    
    success "Initial setup completed successfully!"
}

main "$@"
