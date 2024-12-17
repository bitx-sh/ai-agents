
#!/usr/bin/env bash

setup_systemd_services() {
    log "Setting up SystemD services..."
    
    # Create SystemD directories
    mkdir -p "${BASE_DIR}/rootfs/base/usr/lib/systemd/system"
    mkdir -p "${BASE_DIR}/rootfs/base/etc/systemd/system/discourse.service.d"
    
    # Generate main service
    cat > "${BASE_DIR}/rootfs/base/usr/lib/systemd/system/discourse.service" << 'EOF'
[Unit]
Description=Discourse Discussion Platform
After=network.target postgresql.service redis.service
Requires=discourse.socket

[Service]
Type=notify
User=discourse
Group=discourse
Slice=discourse.slice

WorkingDirectory=/var/www/discourse
Environment=RAILS_ENV=production
EnvironmentFile=/etc/discourse/discourse.env

ExecStart=/usr/bin/discourse-server
ExecReload=/bin/kill -USR2 $MAINPID
Restart=always
RestartSec=5
TimeoutStartSec=0

# Security
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
PrivateTmp=yes
PrivateDevices=yes
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectControlGroups=yes
ReadOnlyPaths=/
ReadWritePaths=/var/lib/discourse /var/log/discourse /var/run/discourse

# Resource Limits
MemoryHigh=2G
MemoryMax=${MAX_MEMORY}
TasksMax=${MAX_TASKS}
CPUWeight=${MAX_CPU_WEIGHT}

[Install]
WantedBy=multi-user.target
EOF

    # Generate socket unit
    cat > "${BASE_DIR}/rootfs/base/usr/lib/systemd/system/discourse.socket" << 'EOF'
[Unit]
Description=Discourse Server Socket

[Socket]
ListenStream=0.0.0.0:3000
NoDelay=true
ReusePort=true

[Install]
WantedBy=sockets.target
EOF

    success "SystemD services configured"
}
