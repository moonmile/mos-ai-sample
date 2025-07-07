#!/bin/bash

# Fix permissions for .NET build artifacts
echo "🔧 Fixing permissions for .NET development..."

# Remove existing build artifacts that might have incorrect permissions
echo "🧹 Cleaning build artifacts..."
rm -rf obj bin || true

# Ensure vscode user owns the workspace
echo "👤 Setting ownership..."
sudo chown -R vscode:vscode /workspace

# Set appropriate permissions
echo "🔐 Setting permissions..."
sudo chmod -R 755 /workspace

# Create directories with correct permissions
echo "📁 Creating build directories..."
mkdir -p obj bin

# Clean and restore
echo "🏗️  Cleaning and restoring project..."
dotnet clean
dotnet restore aspnet-minimal-sample.csproj

# Test build
echo "🧪 Testing build..."
dotnet build aspnet-minimal-sample.csproj

echo "✅ Setup complete! You can now run 'dotnet run'"
