#!/bin/bash

# Build the NEXUS project for production
echo "Starting the build process for NEXUS..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the Vite application
echo "Building the Vite application..."
npm run build

echo "Build process completed successfully!"