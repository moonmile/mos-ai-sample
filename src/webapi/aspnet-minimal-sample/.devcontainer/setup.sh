#!/bin/bash

# DevContainer initialization script
echo "🚀 Starting DevContainer setup..."

# Check if we're in the correct directory
echo "📁 Current directory: $(pwd)"
echo "📄 Files in current directory:"
ls -la

# Check if project file exists
if [ -f "aspnet-minimal-sample.csproj" ]; then
    echo "✅ Found aspnet-minimal-sample.csproj"
    echo "📦 Restoring NuGet packages..."
    dotnet restore aspnet-minimal-sample.csproj
    if [ $? -eq 0 ]; then
        echo "✅ NuGet packages restored successfully"
    else
        echo "❌ Failed to restore NuGet packages"
        exit 1
    fi
else
    echo "❌ aspnet-minimal-sample.csproj not found in current directory"
    exit 1
fi

# Check if solution file exists
if [ -f "aspnet-minimal-sample.sln" ]; then
    echo "✅ Found aspnet-minimal-sample.sln"
else
    echo "⚠️  aspnet-minimal-sample.sln not found"
fi

echo "🎉 DevContainer setup completed successfully!"
