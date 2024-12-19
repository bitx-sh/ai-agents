# Discourse Container Migration Project

## Overview
Comprehensive toolkit for migrating Discourse from Docker/Bitnami containers to SystemD portable services and system extensions. This project provides a complete framework for converting Discourse deployments to native SystemD services while maintaining security, reliability, and performance.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Core Components](#core-components)
3. [Implementation Details](#implementation-details)
4. [Current State](#current-state)
5. [Planned Features](#planned-features)
6. [Build System](#build-system)
7. [Configuration Management](#configuration-management)
8. [Security Considerations](#security-considerations)
9. [Validation & Testing](#validation--testing)
10. [LLM Recreation Guide](#llm-recreation-guide)

## Project Structure
```
discourse-conversion/
├── convert.sh                 # Main conversion script
├── build.sh                   # Build system script
├── tools/
│   └── patch-manager.sh      # Patch management system
├── lib/
│   ├── 00-config.sh          # Core configuration
│   ├── 01-utils.sh           # Utility functions
│   ├── 02-structure.sh       # Directory structure management
│   ├── backup-manager.sh     # Backup system
│   └── discourse-init.sh     # Initialization system
├── patches/                   # Sequential patch files
│   ├── .applied_patches      # Tracks applied patches
│   ├── 0001-*.patch         # Patch management
│   ├── 0002-*.patch         # Project structure
│   ├── 0003-*.patch         # Paths and volumes
│   └── ...
├── rootfs/
│   ├── base/                 # Common base filesystem
│   │   ├── etc/
│   │   │   ├── discourse/
│   │   │   │   ├── discourse.conf
│   │   │   │   └── discourse.conf.d/
│   │   │   ├── systemd/
│   │   │   └── nginx/
│   │   ├── usr/
│   │   │   ├── bin/
│   │   │   ├── lib/
│   │   │   └── share/
│   │   └── var/
│   │       ├── discourse/
│   │       ├── log/
│   │       └── run/
│   ├── extensions/           # Distribution-specific
│   │   ├── alpine/
│   │   ├── arch/
│   │   ├── debian/
│   │   └── ubuntu/
│   └── overlay/             # Runtime overlays
├── mkosi.defaults.conf      # Base mkosi configuration
├── mkosi.alpine.conf        # Alpine-specific config
├── mkosi.arch.conf          # Arch-specific config
├── mkosi.debian.conf        # Debian-specific config
└── mkosi.ubuntu.conf        # Ubuntu-specific config
```

### Directory Purposes

#### Root Level
- `convert.sh`: Main entry point for conversion process
- `build.sh`: Handles building of root filesystems and images
- `mkosi.*.conf`: Distribution-specific build configurations

#### Tools Directory
- `patch-manager.sh`: Manages sequential application of patches
  - Tracks applied patches
  - Validates patch integrity
  - Handles rollback on failure

#### Library Directory
- `00-config.sh`: Core configuration variables and settings
  ```bash
  # Core paths
  DISCOURSE_HOME="/home/discourse"
  DISCOURSE_ROOT="/var/www/discourse"
  DISCOURSE_DATA="/var/discourse"
  
  # User/Group settings
  DISCOURSE_USER="discourse"
  DISCOURSE_GROUP="discourse"
  DISCOURSE_UID="999"
  DISCOURSE_GID="999"
  ```

- `01-utils.sh`: Utility functions for logging, validation
  ```bash
  log() { echo -e "${BLUE}[INFO]${NC} $1"; }
  error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
  success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
  ```

- `02-structure.sh`: Directory structure and permissions
  - Creates required directories
  - Sets up volume mount points
  - Manages permissions

#### Rootfs Directory
- `base/`: Common filesystem structure
  - Configuration files
  - System binaries
  - Service definitions
  
- `extensions/`: Distribution-specific files
  - Package configurations
  - System optimizations
  - Security policies

- `overlay/`: Runtime modifications
  - Dynamic configurations
  - State data
  - Temporary files

## Core Components

### 1. Patch Management System
- Sequential patch application
- State tracking
- Rollback capability
- Validation checks

### 2. Configuration Management
- Hierarchical configuration
  ```
  /etc/discourse/
  ├── discourse.conf          # Base configuration
  └── discourse.conf.d/       # Overrides
      ├── 10-dist.conf       # Distribution specific
      ├── 50-main.conf      # Main configuration
      ├── 80-env.conf       # Environment specific
      └── 90-local.conf     # Local overrides
  ```

### 3. Volume Management
```bash
DISCOURSE_VOLUMES=(
    "shared:/var/discourse/shared"
    "uploads:/var/discourse/uploads"
    "backups:/var/discourse/backups"
    "assets:/var/discourse/public/assets"
    "plugins:/var/discourse/plugins"
    "configs:/var/discourse/config"
)
```

### 4. SystemD Integration
- Service definitions
- Mount units
- Resource controls
- Security policies

## Implementation Details

### Build Process
1. Base OS layer creation
2. System extensions
3. Application installation
4. Configuration application
5. Security hardening

### Configuration Hierarchy
1. Distribution defaults
2. System configuration
3. Environment overrides
4. Local customizations

### Security Implementation
- Unprivileged execution
- Read-only root filesystem
- Systematic permission management
- Volume isolation

## Current State

### Implemented Features
- [x] Basic project structure
- [x] Patch management system
- [x] Directory structure
- [x] Volume management
- [x] Configuration system
- [x] SystemD integration

### In Progress
- [ ] Build system completion
- [ ] Distribution configurations
- [ ] Security hardening
- [ ] Testing framework

## Planned Features

### High Priority
1. Ruby/rbenv setup
2. Node.js environment
3. Discourse core installation
4. Plugin management
5. Asset compilation

### Future Enhancements
1. Migration tools
2. Backup management
3. Monitoring integration
4. Development environment
5. CI/CD integration

## Build System

### Requirements
- mkosi
- systemd-nspawn
- git
- bash

### Build Process
```bash
# Initialize project
./tools/patch-manager.sh init

# Apply patches
./tools/patch-manager.sh apply-all

# Build root filesystem
./build.sh build

# Test build
./build.sh test alpine
```

## Configuration Management

### Base Configuration
Located at `/etc/discourse/discourse.conf`

### Override Hierarchy
1. Distribution overrides (10-*)
2. Main configuration (50-*)
3. Environment specific (80-*)
4. Local overrides (90-*)

## Security Considerations

### User Management
- Dedicated discourse user/group
- Minimal permissions
- No root execution

### Filesystem Security
- Read-only root
- Isolated volumes
- Controlled write access

### Runtime Security
- SystemD security features
- Resource limitations
- Network isolation

## Validation & Testing

### Basic Tests
```bash
./test/basic-test.sh
```

### Validation Steps
1. Directory structure
2. Permissions
3. Configuration loading
4. Service startup

## LLM Recreation Guide

### System Role
```
You are a Container Migration Engineer specializing in converting Docker-based
containers and images to SystemD portable services and system extensions. Your
expertise includes:

1. Container analysis and conversion
2. SystemD service design
3. Security hardening
4. Configuration management
5. Build system development
```

### Initial Prompt
```
Convert the Bitnami Discourse Docker container (bitnami/discourse:3.2.1) to
SystemD portable services and system extensions. Requirements:

1. Support multiple distributions (Alpine, Arch, Debian, Ubuntu)
2. Maintain security and isolation
3. Support persistent data
4. Enable easy configuration
5. Provide migration path
```

### Validation Steps
1. Check directory structure creation
2. Verify patch application
3. Test build system
4. Validate configurations
5. Verify security controls

### Conversation Flow
1. Project structure setup
2. Configuration system design
3. Volume management implementation
4. Security configuration
5. Build system development

### Implementation Sequence
1. Initialize project structure
2. Set up patch management
3. Create configuration system
4. Implement volume management
5. Add security controls
6. Develop build system
7. Add distribution support
8. Implement testing

## Implementation Sequence Details

### 1. Initialize Project Structure
```bash
# Create base directory structure
mkdir -p discourse-conversion/{lib,tools,patches,rootfs/{base,extensions,overlay}}

# Set up initial configuration
cat > lib/00-config.sh << 'EOF'
#!/usr/bin/env bash

# Project Configuration
PROJECT_NAME="discourse"
BASE_DIR="$(pwd)/${PROJECT_NAME}-conversion"

# Distribution Configuration
DISTRIBUTIONS=(
    "alpine"
    "arch"
    "debian"
    "ubuntu"
)

# Version Configuration
DISCOURSE_VERSION="${DISCOURSE_VERSION:-3.2.1}"
DISCOURSE_REPO="https://github.com/discourse/discourse.git"
RUBY_VERSION="${RUBY_VERSION:-3.2.2}"
NODE_VERSION="${NODE_VERSION:-18.18.0}"
BUNDLER_VERSION="${BUNDLER_VERSION:-2.4.22}"
YARN_VERSION="${YARN_VERSION:-1.22.19}"
EOF
```

### 2. Patch Management System
```bash
# Create patch management tool
cat > tools/patch-manager.sh << 'EOF'
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PATCH_DIR="${SCRIPT_DIR}/../patches"
PATCH_LOG="${PATCH_DIR}/.applied_patches"

# ... [patch management implementation] ...
EOF
chmod +x tools/patch-manager.sh
```

### 3. Configuration System
```bash
# Base configuration structure
mkdir -p rootfs/base/etc/discourse/discourse.conf.d

# Create configuration template
cat > rootfs/base/etc/discourse/discourse.conf << 'EOF'
# Discourse Base Configuration
# Override in discourse.conf.d/*.conf

# Core Settings
DISCOURSE_HOSTNAME="localhost"
DISCOURSE_DEVELOPER_EMAILS="admin@localhost"

# ... [additional configuration options] ...
EOF
```

### 4. Volume Management
```bash
# Create volume mount points
for dir in shared uploads backups assets plugins configs; do
    mkdir -p "rootfs/base/var/discourse/${dir}"
done

# Generate SystemD mount units
for volume in "${DISCOURSE_VOLUMES[@]}"; do
    # ... [mount unit generation] ...
done
```

## Technical Details

### SystemD Service Configuration
```ini
[Unit]
Description=Discourse Discussion Platform
After=network.target postgresql.service redis.service
Requires=discourse.socket

[Service]
Type=notify
User=discourse
Group=discourse
Slice=discourse.slice

Environment=RAILS_ENV=production
EnvironmentFile=/etc/discourse/discourse.conf
EnvironmentFile=/etc/discourse/discourse.conf.d/*.conf

ExecStartPre=/usr/lib/discourse/discourse-init
ExecStart=/usr/bin/discourse-server
ExecReload=/bin/kill -USR2 $MAINPID
Restart=always
RestartSec=10

# Security
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
PrivateTmp=yes
PrivateDevices=yes
ReadOnlyPaths=/

[Install]
WantedBy=multi-user.target
```

### Build Configuration (mkosi)
```ini
[Distribution]
Distribution=@DISTRIBUTION@
Release=@RELEASE@

[Output]
Format=gpt_ext4
Bootable=no
OutputDirectory=output
WorkspaceDirectory=work
BuildDirectory=build

[Content]
MakeInitrd=no
RemoveFiles=/var/cache/apt /var/lib/apt/lists
Environment=
    LANG=C.UTF-8
    LC_ALL=C.UTF-8
```

## Migration Process

### Pre-migration Tasks
1. Backup existing data
2. Document current configuration
3. Export uploads and assets
4. List installed plugins

### Migration Steps
1. Build new system
2. Import configuration
3. Transfer data
4. Verify functionality
5. Switch traffic

## Development Guidelines

### Adding New Features
1. Create feature branch
2. Develop changes
3. Generate patch
4. Test implementation
5. Update documentation

### Patch Creation
```bash
# Create new feature
implement_feature

# Generate patch
git format-patch -1 HEAD --stdout > patches/00XX-feature-name.patch

# Test patch
./tools/patch-manager.sh apply patches/00XX-feature-name.patch
```

## Outstanding Features

### Ruby Environment
- rbenv installation
- Ruby compilation
- Gem management
- Bundler configuration

### Node.js Environment
- Node.js installation
- Yarn/npm setup
- Asset compilation
- Plugin building

### Discourse Installation
- Core installation
- Plugin management
- Asset pipeline
- Cache configuration

### System Integration
- Logging configuration
- Monitoring setup
- Backup management
- Health checks

## Troubleshooting

### Common Issues
1. Permission errors
   - Check user/group IDs
   - Verify directory ownership
   - Review mount permissions

2. Configuration problems
   - Validate configuration syntax
   - Check load order
   - Verify environment variables

3. Build failures
   - Check distribution requirements
   - Verify package availability
   - Review build logs

## Contributing

### Patch Guidelines
1. One feature per patch
2. Clear commit messages
3. Include validation steps
4. Update documentation
5. Add test cases

### Testing Requirements
1. Basic functionality
2. Security compliance
3. Performance impact
4. Migration compatibility

## License
[Insert appropriate license information]

---

This README provides a comprehensive guide for both human developers and AI systems to understand, implement, and extend the Discourse container migration project. For additional details or specific implementation questions, please refer to the individual component documentation or raise an issue in the project repository.
