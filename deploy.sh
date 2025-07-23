#!/bin/bash

# Galaxy Clustering Visualization - GitHub Pages Deployment Script
# This script helps prepare and deploy the visualization to GitHub Pages

echo "🌌 Galaxy Clustering Visualization - Deployment Script"
echo "=================================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run 'git init' first."
    exit 1
fi

# Check if required files exist
required_files=("index.html" "app.js" "styles.css" "data.json")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: Required file '$file' not found."
        exit 1
    fi
done

echo "✅ All required files found."

# Generate data if needed
if [ ! -f "data.json" ]; then
    echo "📊 Generating data..."
    python3 gen_data.py
    python3 convert_data.py
fi

# Check git status
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected."
    echo "   Files to be committed:"
    git status --porcelain | head -10
    
    read -p "   Do you want to commit these changes? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   Staging files..."
        git add .
        echo "   Committing changes..."
        git commit -m "Update galaxy clustering visualization - $(date '+%Y-%m-%d %H:%M')"
    else
        echo "   Skipping commit. Note: Uncommitted changes won't be deployed."
    fi
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main || git push origin master

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps for GitHub Pages:"
echo "   1. Go to your GitHub repository"
echo "   2. Click on 'Settings' tab"
echo "   3. Scroll to 'Pages' section"
echo "   4. Under 'Source', select 'Deploy from a branch'"
echo "   5. Choose 'main' branch and '/ (root)' folder"
echo "   6. Click 'Save'"
echo ""
echo "🌐 Your site will be available at:"
echo "   https://$(git config user.name | tr '[:upper:]' '[:lower:]').github.io/$(basename $(pwd))/"
echo ""
echo "⏱️  It may take a few minutes for changes to appear on GitHub Pages."
