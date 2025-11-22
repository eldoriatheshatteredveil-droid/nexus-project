#!/bin/bash

# NEXUS Development Environment Setup Script

# Navigate to the project directory
cd "$(dirname "$0")/.."

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the development server
echo "Starting the development server..."
npm run dev

# Open the application in the default web browser
echo "Opening NEXUS in your default web browser..."
xdg-open http://localhost:3000

# Keep the terminal open
exec bash