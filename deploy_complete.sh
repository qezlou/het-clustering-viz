#!/bin/bash

# Cosmic Clustering Visualization - Complete Deployment Script
# This script prepares both versions for GitHub Pages deployment

echo "🌌 Cosmic Clustering Visualization - Complete Deployment"
echo "======================================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the main directory containing index.html"
    exit 1
fi

# Check if required directories exist
if [ ! -d "change_all" ] || [ ! -d "change_one" ]; then
    echo "❌ Error: Required directories 'change_all' and 'change_one' not found."
    exit 1
fi

echo "✅ Directory structure verified."

# Generate data for both versions
echo "📊 Generating data files..."

# Change all version
echo "   📈 Generating change_all data..."
cd change_all
if [ -f "gen_data.py" ]; then
    python3 gen_data.py
    python3 convert_data.py
    echo "   ✅ change_all data generated"
else
    echo "   ⚠️  gen_data.py not found in change_all/"
fi
cd ..

# Change one version
echo "   📊 Generating change_one data..."
cd change_one
if [ -f "gen_data_one.py" ]; then
    python3 gen_data_one.py
    python3 convert_data_one.py
    echo "   ✅ change_one data generated"
else
    echo "   ⚠️  gen_data_one.py not found in change_one/"
fi
cd ..

# Check git status
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run 'git init' first."
    exit 1
fi

echo "🔍 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected."
    echo "   Files to be committed:"
    git status --porcelain | head -10
    
    read -p "   Do you want to commit these changes? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   📋 Staging files..."
        git add .
        echo "   💾 Committing changes..."
        git commit -m "Deploy cosmic clustering visualization with dual approaches - $(date '+%Y-%m-%d %H:%M')"
    else
        echo "   ⏭️  Skipping commit. Note: Uncommitted changes won't be deployed."
    fi
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
if git push origin main 2>/dev/null || git push origin master 2>/dev/null; then
    echo "✅ Successfully pushed to GitHub"
else
    echo "❌ Error pushing to GitHub. Please check your remote configuration."
    exit 1
fi

# Get repository info for URL construction
REPO_URL=$(git config --get remote.origin.url)
if [[ $REPO_URL == *"github.com"* ]]; then
    # Extract username and repo name from URL
    if [[ $REPO_URL == *".git" ]]; then
        REPO_URL=${REPO_URL%.git}
    fi
    
    if [[ $REPO_URL == *"https://github.com/"* ]]; then
        GITHUB_PATH=${REPO_URL#https://github.com/}
    elif [[ $REPO_URL == *"git@github.com:"* ]]; then
        GITHUB_PATH=${REPO_URL#git@github.com:}
    fi
    
    USERNAME=$(echo $GITHUB_PATH | cut -d'/' -f1)
    REPO_NAME=$(echo $GITHUB_PATH | cut -d'/' -f2)
    
    BASE_URL="https://${USERNAME}.github.io/${REPO_NAME}"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps for GitHub Pages:"
echo "   1. Go to your GitHub repository: https://github.com/${GITHUB_PATH}"
echo "   2. Click on 'Settings' tab"
echo "   3. Scroll to 'Pages' section"
echo "   4. Under 'Source', select 'Deploy from a branch'"
echo "   5. Choose 'main' branch and '/ (root)' folder"
echo "   6. Click 'Save'"
echo ""
echo "🌐 Your sites will be available at:"
echo "   🏠 Main Hub: ${BASE_URL}/"
echo "   🔄 Change All: ${BASE_URL}/change_all/"
echo "   📊 Change One: ${BASE_URL}/change_one/"
echo ""
echo "⏱️  It may take 5-10 minutes for changes to appear on GitHub Pages."
echo ""
echo "📱 Both versions are fully mobile-optimized!"
echo "🔬 Ready for scientific exploration!"
