// Content script - detects image pastes in Outlook and prompts for alt text

(function() {
  'use strict';

  let processingImage = null;
  let modal = null;

  // Listen for paste events on the entire document
  document.addEventListener('paste', handlePaste, true);

  function handlePaste(event) {
    // Check if we're in a compose area
    const target = event.target;
    const isEditable = target.isContentEditable ||
                       target.tagName === 'TEXTAREA' ||
                       target.tagName === 'INPUT' ||
                       target.closest('[contenteditable="true"]');

    if (!isEditable) return;

    // Check clipboard for images
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        if (blob) {
          // Watch for the image to appear in the editable area
          watchForPastedImage(target);
        }
        break;
      }
    }
  }

  function watchForPastedImage(target) {
    const editableArea = target.closest('[contenteditable="true"]') || target;

    // Take a snapshot of current images
    const existingImages = new Set();
    editableArea.querySelectorAll('img').forEach(img => existingImages.add(img));

    // Watch for new images being added
    const observer = new MutationObserver((mutations, obs) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node is a new image
            const newImages = node.tagName === 'IMG' ? [node] : node.querySelectorAll?.('img') || [];
            for (const img of newImages) {
              if (!existingImages.has(img) && !img.dataset.altTextProcessed) {
                obs.disconnect(); // Stop watching
                processImage(img);
                return;
              }
            }
          }
        }
      }
    });

    observer.observe(editableArea, { childList: true, subtree: true });

    // Stop watching after 3 seconds if no image found
    setTimeout(() => observer.disconnect(), 3000);
  }

  async function processImage(img) {
    // Prevent duplicate processing
    if (processingImage === img || img.dataset.altTextProcessed) return;
    processingImage = img;
    img.dataset.altTextProcessed = 'pending';

    try {
      // Get image as base64
      const imageData = await getImageAsBase64(img);
      if (!imageData) {
        img.dataset.altTextProcessed = '';
        processingImage = null;
        return;
      }

      // Show loading modal
      showModal(img, null, true);

      // Request alt text from background script
      const response = await chrome.runtime.sendMessage({
        action: 'generateAltText',
        imageData: imageData
      });

      if (response.success) {
        showModal(img, response.altText, false);
      } else {
        showModal(img, '', false, response.error);
      }
    } catch (error) {
      console.error('Alt text extension error:', error);
      showModal(img, '', false, error.message);
    }
  }

  async function getImageAsBase64(img) {
    // If image has a data URL, use it directly
    if (img.src.startsWith('data:')) {
      return img.src;
    }

    // If blob URL, fetch and convert
    if (img.src.startsWith('blob:')) {
      try {
        const response = await fetch(img.src);
        const blob = await response.blob();
        return await blobToBase64(blob);
      } catch (e) {
        console.error('Failed to fetch blob:', e);
        return null;
      }
    }

    // For regular URLs, use canvas
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      return canvas.toDataURL('image/png');
    } catch (e) {
      console.error('Failed to convert image:', e);
      return null;
    }
  }

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function showModal(img, suggestedAltText, isLoading, error = null) {
    // Remove existing modal
    if (modal) {
      modal.remove();
    }

    modal = document.createElement('div');
    modal.className = 'outlook-alt-text-modal-overlay';

    const content = document.createElement('div');
    content.className = 'outlook-alt-text-modal';

    if (isLoading) {
      content.innerHTML = `
        <div class="outlook-alt-text-header">
          <h2>Generating Alt Text...</h2>
        </div>
        <div class="outlook-alt-text-body">
          <div class="outlook-alt-text-preview">
            <img src="${img.src}" alt="Preview">
          </div>
          <div class="outlook-alt-text-loading">
            <div class="outlook-alt-text-spinner"></div>
            <p>Analyzing image with AI...</p>
          </div>
        </div>
      `;
    } else {
      content.innerHTML = `
        <div class="outlook-alt-text-header">
          <h2>Add Alt Text</h2>
          ${error ? `<p class="outlook-alt-text-error">Error: ${escapeHtml(error)}</p>` : ''}
        </div>
        <div class="outlook-alt-text-body">
          <div class="outlook-alt-text-preview">
            <img src="${img.src}" alt="Preview">
          </div>
          <label for="outlook-alt-text-input">Alt text (editable):</label>
          <textarea id="outlook-alt-text-input" rows="4" placeholder="Describe this image...">${escapeHtml(suggestedAltText || '')}</textarea>
        </div>
        <div class="outlook-alt-text-footer">
          <button class="outlook-alt-text-btn outlook-alt-text-btn-secondary" id="outlook-alt-text-skip">Skip</button>
          <button class="outlook-alt-text-btn outlook-alt-text-btn-primary" id="outlook-alt-text-apply">Apply Alt Text</button>
        </div>
      `;

      // Set up event listeners after adding to DOM
      setTimeout(() => {
        const applyBtn = document.getElementById('outlook-alt-text-apply');
        const skipBtn = document.getElementById('outlook-alt-text-skip');
        const textarea = document.getElementById('outlook-alt-text-input');

        if (applyBtn) {
          applyBtn.addEventListener('click', () => {
            const altText = textarea.value.trim();
            if (altText) {
              img.alt = altText;
              img.setAttribute('alt', altText);
            }
            img.dataset.altTextProcessed = 'done';
            processingImage = null;
            modal.remove();
            modal = null;
          });
        }

        if (skipBtn) {
          skipBtn.addEventListener('click', () => {
            img.dataset.altTextProcessed = 'skipped';
            processingImage = null;
            modal.remove();
            modal = null;
          });
        }

        // Focus the textarea
        if (textarea) {
          textarea.focus();
          textarea.select();
        }
      }, 0);
    }

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        img.dataset.altTextProcessed = 'skipped';
        processingImage = null;
        modal.remove();
        modal = null;
      }
    });

    // Close on Escape key
    const escHandler = (e) => {
      if (e.key === 'Escape' && modal) {
        img.dataset.altTextProcessed = 'skipped';
        processingImage = null;
        modal.remove();
        modal = null;
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

})();
