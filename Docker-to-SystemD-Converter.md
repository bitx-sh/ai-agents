
# Docker to SystemD Conversion Specialist

## Overview
A specialized system for converting Docker containers and images to SystemD portable services and system extensions.

## Project Structure
```
discourse-conversion/
├── convert.sh              # Main script
└── lib/
    ├── 00-config.sh       # Configuration variables
    ├── 01-utils.sh        # Logging and utility functions
    ├── 02-structure.sh    # Directory structure creation
    ├── 03-mkosi.sh        # mkosi configuration
    ├── 04-systemd.sh      # SystemD service configuration
    ├── 05-ruby.sh         # Ruby/rbenv setup
    ├── 06-nodejs.sh       # Node.js/Yarn setup
    ├── 07-discourse.sh    # Discourse setup and configuration
    ├── 08-nginx.sh        # Nginx configuration
    ├── 09-docker.sh       # Dockerfile and compose
    └── 10-build.sh        # Build scripts and procedures
```

## Features
- Converts Docker containers to SystemD services
- Manages persistent volumes and data
- Handles Ruby/Node.js environments
- Configures Nginx and system services
- Supports multiple Linux distributions

## Configuration
Configuration is managed through SystemD-style configuration files:

```
/etc/discourse/
├── discourse.conf         # Base configuration
└── discourse.conf.d/      # Configuration overrides
    ├── 10-*.conf         # Distribution-specific
    ├── 50-*.conf         # Main configuration
    ├── 80-*.conf         # Environment overrides
    └── 90-*.conf         # Site-specific
```

## Volume Management
Persistent data is managed through SystemD mounts:
- `/var/discourse/shared` - Shared data
- `/var/discourse/uploads` - User uploads
- `/var/discourse/backups` - System backups
- `/var/discourse/public/assets` - Public assets
- `/var/discourse/plugins` - Discourse plugins
- `/var/discourse/config` - Configuration files

## Backup System
- Automated S3 backup integration
- Configurable backup retention
- SystemD timer-based scheduling
- Support for custom backup locations

## Build System
The build system supports:
- Multiple distribution targets (Alpine, Arch, Debian, Ubuntu)
- Layered root filesystem
- SystemD portable services
- System extensions

## Usage
```bash
# Build all distributions
./build.sh build

# Test a specific distribution
./build.sh test alpine
```

## Testing
Basic testing is included to verify:
- SystemD integration
- Directory structure
- User permissions
- Configuration management

## Security Features
- Unprivileged operation
- Read-only root filesystem
- SystemD security policies
- Resource constraints

## Requirements
- systemd
- mkosi
- Basic build tools
- Git

## Development
All configuration and customization is done through:
- SystemD unit files
- Configuration overrides
- Build scripts
