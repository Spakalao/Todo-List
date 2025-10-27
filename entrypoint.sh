#!/bin/bash

# Corriger les permissions du socket Docker
chmod 666 /var/run/docker.sock 2>/dev/null || true

# Exécuter le script Jenkins par défaut
exec /usr/local/bin/jenkins.sh

