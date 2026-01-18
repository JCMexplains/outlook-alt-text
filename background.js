// Background service worker - handles Claude API calls for alt text generation

// Model selection constants
const MODELS = {
  HAIKU: 'claude-3-5-haiku-20241022',    // Fast and cheap for simple images
  SONNET: 'claude-sonnet-4-20250514'      // Powerful for complex images
};

const COMPLEXITY_PROMPT = `Analyze this image and classify its complexity level.

Respond with ONLY one word:
- "SIMPLE" if the image is a simple photo, graphic, logo, icon, or basic illustration
- "COMPLEX" if the image contains text, tables, charts, diagrams, schedules, data visualizations, or structured information that requires detailed transcription

One word response:`;

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

  // Step 1: Determine image complexity using Haiku (fast and cheap)
  const complexity = await classifyImageComplexity(apiKey, mediaType, base64Data);

  // Step 2: Choose appropriate model based on complexity
  const model = complexity === 'COMPLEX' ? MODELS.SONNET : MODELS.HAIKU;

  console.log(`Image classified as ${complexity}, using ${model}`);

  // Step 3: Generate alt text with the selected model
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: model,
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

async function classifyImageComplexity(apiKey, mediaType, base64Data) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: MODELS.HAIKU,
      max_tokens: 10,
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
              text: COMPLEXITY_PROMPT
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    // If classification fails, default to COMPLEX to ensure quality
    console.warn('Complexity classification failed, defaulting to COMPLEX');
    return 'COMPLEX';
  }

  const data = await response.json();
  const classification = data.content[0].text.trim().toUpperCase();

  // Return SIMPLE or COMPLEX, defaulting to COMPLEX if unclear
  return classification.includes('SIMPLE') ? 'SIMPLE' : 'COMPLEX';
}
