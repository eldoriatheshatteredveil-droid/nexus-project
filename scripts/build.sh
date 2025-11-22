#!/bin/bash

# Build the NEXUS project for production
echo "Starting the build process for NEXUS..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the Next.js application
echo "Building the Next.js application..."
npm run build

# Export the application for static hosting
echo "Exporting the application..."
npm run export

echo "Build process completed successfully!"