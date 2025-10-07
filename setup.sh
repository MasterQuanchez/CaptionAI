#!/bin/bash

echo "🚀 Setting up Caption AI Desktop App..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check if Yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "📦 Installing Yarn..."
    npm install -g yarn
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ Yarn version: $(yarn --version)"

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build shared package
echo "🔨 Building shared package..."
yarn workspace @caption-ai/shared build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Setup completed successfully!"
    echo ""
    echo "🎯 To start the application, run:"
    echo "   yarn dev"
    echo ""
    echo "📖 For more information, see README.md"
else
    echo "❌ Setup failed. Please check the error messages above."
    exit 1
fi