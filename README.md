# Outlook Alt Text

A Chrome extension that automatically suggests alt text for images you paste into Outlook web emails. Uses Claude AI to generate accurate, accessibility-friendly descriptions.

## Features

- Detects images pasted into Outlook compose
- Generates alt text using Claude AI vision
- Conditional model selection: uses Haiku (cheaper) for simple images, Sonnet (more powerful) for complex images
- Smart prompting: concise for simple images, detailed for schedules/tables/text
- Edit suggestions before applying
- Skip option if you don't want alt text

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `outlook-alt-text` folder

## Setup

1. Get a Claude API key from [console.anthropic.com](https://console.anthropic.com/settings/keys)
2. Click the extension icon in Chrome toolbar
3. Enter your API key and click Save

## Usage

1. Open Outlook in your browser (outlook.office.com, outlook.live.com)
2. Compose a new email
3. Paste an image (screenshot, copied image, etc.)
4. If the image doesn't already have alt text, a modal will appear with AI-generated alt text
5. Edit if needed and click "Apply Alt Text"

## Supported Outlook Domains

- outlook.office.com
- outlook.office365.com
- outlook.live.com

## Privacy & Security

- Your API key is stored locally in Chrome's secure storage
- Images are sent only to Claude API for analysis
- No data is stored on external servers
- No tracking or analytics

## Cost

This extension uses the Claude API which has per-request costs. To optimize costs, the extension:
1. First uses Claude Haiku to classify image complexity (very low cost)
2. For simple images (photos, graphics, icons): uses Haiku for alt text generation (lower cost)
3. For complex images (charts, tables, text-heavy images): uses Sonnet for accurate transcription (higher cost)

Approximate costs per image:
- Simple images: ~$0.001-0.003 USD (Haiku classification + Haiku generation)
- Complex images: ~$0.01-0.05 USD (Haiku classification + Sonnet generation)

This conditional approach can reduce costs by 10-50x for simple images while maintaining quality for complex ones.

See [Anthropic's pricing](https://www.anthropic.com/pricing) for current rates.

## License

MIT License - see LICENSE file for details.

## Contributing

Pull requests welcome! Please open an issue first to discuss proposed changes.
