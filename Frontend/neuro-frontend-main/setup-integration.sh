#!/bin/bash

# NeuroVerse Frontend Integration Setup Script

echo "🎨 Setting up NeuroVerse Frontend Integration..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Install required dependencies
echo "📦 Installing Chart.js and React Chart.js 2..."
npm install chart.js react-chartjs-2

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cat > .env << EOL
VITE_API_URL=http://localhost:8000/api/v1
EOL
    echo "✅ Created .env file with default backend URL"
else
    echo "ℹ️  .env file already exists, skipping creation"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Make sure the backend is running: cd ../../Backend && ./start.sh"
echo "   2. Start the frontend: npm run dev"
echo "   3. Visit http://localhost:5173/datasets"
echo "   4. Click 'Sync New Dataset' and try syncing ds000224"
echo ""
echo "📚 For more information, see INTEGRATION_GUIDE.md"
