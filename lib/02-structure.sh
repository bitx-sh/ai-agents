
#!/usr/bin/env bash

create_directory_structure() {
    log "Creating directory structure..."
    
    # Create base directories
    mkdir -p "${BASE_DIR}/rootfs/base/usr/"{bin,lib,share}
    mkdir -p "${BASE_DIR}/rootfs/base/etc"/{discourse,systemd,nginx}
    mkdir -p "${BASE_DIR}/rootfs/base/var"/{lib,log,run}/discourse
    
    # Create distribution-specific directories
    for dist in "${DISTRIBUTIONS[@]}"; do
        mkdir -p "${BASE_DIR}/rootfs/extensions/${dist}"
    done
    
    # Create build directories
    mkdir -p "${BASE_DIR}/build"/{gems,assets,plugins}
    
    # Set up correct permissions
    chown -R root:root "${BASE_DIR}/rootfs"
    chmod 755 "${BASE_DIR}/rootfs"
    
    # Set up discourse directories with correct permissions
    chown -R "${DISCOURSE_UID}:${DISCOURSE_GID}" \
        "${BASE_DIR}/rootfs/base/var"/{lib,log,run}/discourse
}
