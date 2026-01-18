# Chrome Web Store Publishing Guide

This guide walks you through publishing Outlook Alt Text to the Chrome Web Store.

## Prerequisites Checklist

### 1. Create Extension Icons (REQUIRED)

You need three icon sizes. Options:

**Option A: Use an online icon generator**
- Go to https://favicon.io or https://www.canva.com
- Create a simple icon (suggestions: "Alt" text, accessibility symbol, or image icon)
- Export as PNG in these sizes:
  - 16x16 pixels → save as `icons/icon16.png`
  - 48x48 pixels → save as `icons/icon48.png`
  - 128x128 pixels → save as `icons/icon128.png`

**Option B: Use AI to generate**
- Ask ChatGPT/DALL-E or another AI to create an icon
- Request: "Create a simple, flat icon for an accessibility tool that adds alt text to images"
- Download and resize to the three sizes above

**Icon Design Tips:**
- Keep it simple and recognizable at small sizes
- Use accessibility-friendly colors (high contrast)
- Consider: "A" letter, image/photo symbol, or eye/accessibility icon

### 2. Take Screenshots (REQUIRED)

Chrome Web Store requires at least 1 screenshot (1280x800 or 640x400):

1. Open Outlook web in Chrome
2. Load your extension
3. Paste an image to trigger the alt text modal
4. Take a screenshot showing:
   - The modal with suggested alt text
   - The Outlook compose window
   - Make it look clean and professional

You'll need 1-5 screenshots total.

### 3. Prepare Promotional Materials (OPTIONAL but recommended)

- **Promotional tile**: 440x280 pixels (shown in search results)
- **Marquee promo tile**: 1400x560 pixels (featured placement)

## Step-by-Step Publishing Process

### Step 1: Create Chrome Web Store Developer Account

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Pay the **$5 one-time registration fee**
4. Accept the developer agreement

### Step 2: Package Your Extension

Run these commands to create a clean ZIP file:

```bash
cd /home/user/outlook-alt-text
zip -r outlook-alt-text.zip . -x "*.git*" -x "*node_modules*" -x "*.DS_Store" -x "PUBLISHING_GUIDE.md"
```

**What to include in ZIP:**
- All .js files (background.js, content.js, popup.js)
- manifest.json
- popup.html
- styles.css
- icons/ folder with all icons
- LICENSE
- README.md (optional but recommended)
- PRIVACY.md

**What to exclude:**
- .git folder
- .gitignore
- node_modules (if any)
- PUBLISHING_GUIDE.md
- Any development/testing files

### Step 3: Upload to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **"New Item"**
3. Upload your `outlook-alt-text.zip` file
4. Wait for upload to complete

### Step 4: Fill Out Store Listing

You'll need to complete these sections:

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
- You'll need to host PRIVACY.md somewhere public
- Options:
  - GitHub: `https://github.com/JCMexplains/outlook-alt-text/blob/main/PRIVACY.md`
  - Or create a simple webpage

**Single purpose description (brief):**
```
This extension analyzes images pasted in Outlook and suggests alt text using AI to improve email accessibility.
```

**Permission justifications:**

For **"storage"** permission:
```
Required to securely store the user's Claude API key locally in Chrome's storage for authenticating API requests.
```

For **"activeTab"** permission:
```
Required to detect when images are pasted into Outlook compose windows and to apply alt text to those images.
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
   - 1280x800 or 640x400 pixels
   - Show the extension in action

2. **Upload icons**
   - Small tile: 128x128 (your icon128.png)

3. **Optional promotional images**
   - Promotional tile: 440x280
   - Marquee: 1400x560

#### Distribution

**Visibility:** Public

**Regions:** All regions (or select specific countries)

**Pricing:** Free

### Step 5: Submit for Review

1. Click **"Submit for Review"**
2. Review will typically take **1-5 business days**
3. You'll receive an email when:
   - Review is complete (approved/rejected)
   - Extension is published

### Step 6: After Approval

Once approved:
- Extension will be live on Chrome Web Store
- Users can install it directly
- No more developer mode warnings
- You'll get a public URL like: `https://chrome.google.com/webstore/detail/[your-extension-id]`

## Common Rejection Reasons (And How to Avoid)

1. **Missing privacy policy** → We created PRIVACY.md for you
2. **Poor screenshots** → Make sure they're high quality and show the extension working
3. **Unclear description** → Our description is detailed and clear
4. **Missing icons** → Make sure you create all three icon sizes
5. **Permission issues** → We've provided justifications above

## Updating Your Extension

When you make changes:
1. Update version in manifest.json (e.g., 1.0.0 → 1.0.1)
2. Create new ZIP file
3. Go to Developer Dashboard → Your Extension → "Package"
4. Upload new ZIP
5. Click "Submit for Review"

## Tips for Success

- **Response time:** Respond quickly to any review feedback
- **Support email:** Add a support email in your listing
- **Keywords:** Use relevant keywords in your description (accessibility, alt text, Outlook, AI)
- **Updates:** Keep your extension updated and respond to user reviews

## Resources

- [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [Extension Publishing Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Best Practices](https://developer.chrome.com/docs/webstore/best_practices/)

## Need Help?

- Check the Chrome Web Store Developer Dashboard for review status
- Review rejection emails will include specific issues to fix
- GitHub issues: https://github.com/JCMexplains/outlook-alt-text/issues
