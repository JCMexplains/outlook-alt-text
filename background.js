// Background service worker - handles Claude API calls for alt text generation

const ALT_TEXT_PROMPT = `Generate alt text for this image.
- If it's a simple photo or graphic: be concise (1-2 sentences).
- If it contains text, schedules, tables, charts, or structured information: transcribe ALL the text and data completely so a screen reader user gets the full information.
Be factual and accurate. Return only the alt text, no quotes or prefixes.`;

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateAltText') {
    generateAltText(request.imageData)
      .then(altText => sendResponse({ success: true, altText }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
});

async function generateAltText(imageBase64) {
  // Get API key from storage
  const { apiKey } = await chrome.storage.local.get('apiKey');

  if (!apiKey) {
    throw new Error('No API key configured. Click the extension icon to add your Claude API key.');
  }

  // Extract base64 data and media type
  let mediaType = 'image/png';
  let base64Data = imageBase64;

  if (imageBase64.startsWith('data:')) {
    const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      mediaType = match[1];
      base64Data = match[2];
    }
  }

  // Call Claude API with vision
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data
              }
            },
            {
              type: 'text',
              text: ALT_TEXT_PROMPT
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text.trim();
}
