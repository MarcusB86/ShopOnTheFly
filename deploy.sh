#!/bin/bash

# 🚀 Shop On The Fly Deployment Script
# This script helps prepare your app for deployment

echo "🚀 Starting deployment preparation..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
cd client
npm install
npm run build
cd ..

# Check if build was successful
if [ ! -d "client/build" ]; then
    echo "❌ Error: Frontend build failed"
    exit 1
fi

echo "✅ Frontend built successfully"

# Check backend dependencies
echo "🔧 Checking backend..."
cd server
npm install
cd ..

echo "✅ Backend dependencies installed"

# Create production environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.production.example .env
    echo "⚠️  Please edit .env file with your production values"
fi

# Check for required environment variables
echo "🔍 Checking environment variables..."
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    exit 1
fi

echo "✅ Environment file found"

# Display deployment checklist
echo ""
echo "📋 DEPLOYMENT CHECKLIST:"
echo "1. ✅ Frontend built"
echo "2. ✅ Backend dependencies installed"
echo "3. ✅ Environment file created"
echo ""
echo "🚀 NEXT STEPS:"
echo "1. Edit .env file with your production values"
echo "2. Deploy backend to Railway/Render"
echo "3. Deploy frontend to Vercel"
echo "4. Update environment variables in deployment platforms"
echo "5. Test all functionality"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "🎉 Deployment preparation complete!" 