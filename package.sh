#!/bin/bash

# Package Outlook Alt Text extension for Chrome Web Store

echo "Packaging Outlook Alt Text extension..."

# Check if icons exist
if [ ! -f "icons/icon16.png" ] || [ ! -f "icons/icon48.png" ] || [ ! -f "icons/icon128.png" ]; then
    echo "ERROR: Icons not found!"
    echo "Please create icons in the icons/ folder:"
    echo "  - icons/icon16.png"
    echo "  - icons/icon48.png"
    echo "  - icons/icon128.png"
    echo ""
    echo "See PUBLISHING_GUIDE.md for instructions."
    exit 1
fi

# Create package
zip -r outlook-alt-text.zip \
    manifest.json \
    background.js \
    content.js \
    popup.js \
    popup.html \
    styles.css \
    icons/ \
    LICENSE \
    README.md \
    PRIVACY.md \
    -x "*.git*" -x "*.DS_Store" -x "*node_modules*" -x "PUBLISHING_GUIDE.md" -x "package.sh"

echo "✓ Package created: outlook-alt-text.zip"
echo ""
echo "Next steps:"
echo "1. Go to https://chrome.google.com/webstore/devconsole"
echo "2. Click 'New Item'"
echo "3. Upload outlook-alt-text.zip"
echo "4. Fill out the store listing (see PUBLISHING_GUIDE.md)"
echo ""
echo "File size:"
ls -lh outlook-alt-text.zip
