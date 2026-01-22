# Chrome Web Store Publishing Guide

This guide walks you through publishing Outlook Alt Text to the Chrome Web Store.

## Step-by-Step Publishing Process

### Step 1: Create Chrome Web Store Developer Account

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Pay the **$5 one-time registration fee**
4. Accept the developer agreement

### Step 2: Package Your Extension

Run the packaging script:

```bash
cd /home/user/outlook-alt-text
chmod +x package.sh
./package.sh
```

This creates `outlook-alt-text.zip` with all necessary files.

**What's included:**
- All .js files (background.js, content.js, popup.js)
- manifest.json
- popup.html
- styles.css
- icons/ folder with all icons
- LICENSE
- README.md
- PRIVACY.md

### Step 3: Upload to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **"New Item"**
3. Upload your `outlook-alt-text.zip` file
4. Wait for upload to complete

### Step 4: Fill Out Store Listing

#### Product Details

**Store listing language:** English (United States)

**Extension name:** Outlook Alt Text

**Summary (132 characters max):**
```
AI-powered alt text suggestions for images pasted into Outlook web. Makes emails more accessible with Claude AI.
```

**Description (detailed):**
```
Outlook Alt Text automatically suggests accessibility-friendly alt text for images you paste into Outlook web emails using Claude AI.

FEATURES
• Detects images pasted into Outlook compose
• AI-generated alt text using Claude vision models
• Smart model selection: Haiku for simple images, Sonnet for complex ones
• Edit suggestions before applying
• Skip option if you don't want alt text
• Privacy-focused: no tracking or data retention

HOW IT WORKS
1. Paste an image into an Outlook email
2. Extension analyzes the image with Claude AI
3. Review and edit the suggested alt text
4. Click "Apply" to add it to your image

SETUP REQUIRED
• Get a Claude API key from console.anthropic.com (free tier available)
• Click the extension icon and enter your API key
• Start pasting images in Outlook!

COST OPTIMIZATION
Uses conditional model selection to minimize API costs:
- Simple images use Claude Haiku (~$0.001-0.003 per image)
- Complex images use Claude Sonnet for accuracy (~$0.01-0.05 per image)

PRIVACY & SECURITY
• Your API key is stored locally in Chrome's secure storage
• Images are sent only to Claude API for analysis
• No data stored on external servers
• No tracking or analytics

SUPPORTED OUTLOOK DOMAINS
• outlook.office.com
• outlook.office365.com
• outlook.live.com

Open source on GitHub: https://github.com/JCMexplains/outlook-alt-text
```

**Category:** Accessibility

**Language:** English

#### Privacy

**Privacy policy URL:**
```
https://github.com/JCMexplains/outlook-alt-text/blob/master/PRIVACY.md
```

**Single purpose description:**
```
This extension analyzes images pasted in Outlook and suggests alt text using AI to improve email accessibility.
```

**Permission justifications:**

For **"storage"** permission:
```
Required to securely store the user's Claude API key locally in Chrome's storage for authenticating API requests.
```

For **host permissions** (outlook.office.com, etc.):
```
Required to run the content script that detects image paste events and applies alt text on Outlook web domains.
```

**Remote code:** No

**Data usage:**
- Select: "The extension does collect user data"
- Check: "Personally identifiable information" (API keys)
- Check: "Website content" (images)
- Purpose: "App functionality"
- Data handling: "Data is not used for other purposes"
- Transferred: "Yes, to Anthropic Claude API for image analysis"
- Sold: "No"

#### Store Listing Assets

1. **Upload screenshots** (at least 1, max 5)
   - Use the included `screenshot.png` file
   - Shows the extension in action with the alt text modal

2. **Upload icons**
   - Chrome will use the icons from your manifest.json
   - Small tile: 128x128 (icon128.png)

3. **Optional promotional images**
   - Can create later if needed

#### Distribution

**Visibility:** Public

**Regions:** All regions

**Pricing:** Free

**Trader/Non-trader:** Select "non-trader" (free hobby project)

### Step 5: Submit for Review

1. Click **"Submit for Review"**
2. Review typically takes **1-5 business days**
3. You'll receive an email when approved

### Step 6: After Approval

Once approved:
- Extension will be live on Chrome Web Store
- Users can install it directly
- No more developer mode warnings
- You'll get a public URL

## Updating Your Extension

When you make changes:
1. Update version in manifest.json (e.g., 1.0.0 → 1.0.1)
2. Run `./package.sh` to create new ZIP
3. Go to Developer Dashboard → Your Extension → "Package"
4. Upload new ZIP
5. Click "Submit for Review"

## Tips for Success

- **Respond quickly** to any review feedback
- **Use relevant keywords** in your description
- **Keep extension updated** and respond to user reviews
- **Monitor reviews** and fix reported issues

## Resources

- [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [Extension Publishing Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Best Practices](https://developer.chrome.com/docs/webstore/best_practices/)
