// Settings popup logic

document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('api-key');
  const saveBtn = document.getElementById('save-btn');
  const status = document.getElementById('status');

  // Load existing API key
  const { apiKey } = await chrome.storage.local.get('apiKey');
  if (apiKey) {
    apiKeyInput.value = apiKey;
    showStatus('API key configured', 'success');
  }

  // Save API key
  saveBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();

    if (!key) {
      showStatus('Please enter an API key', 'error');
      return;
    }

    if (!key.startsWith('sk-ant-')) {
      showStatus('API key should start with sk-ant-', 'error');
      return;
    }

    try {
      await chrome.storage.local.set({ apiKey: key });
      showStatus('API key saved successfully', 'success');
    } catch (error) {
      showStatus('Failed to save: ' + error.message, 'error');
    }
  });

  // Save on Enter key
  apiKeyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  });

  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'status ' + type;
  }
});
