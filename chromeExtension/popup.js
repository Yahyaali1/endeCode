// Base64 Decoder Popup Script

document.addEventListener('DOMContentLoaded', () => {
  const base64Input = document.getElementById('base64Input');
  const encodeBtn = document.getElementById('encodeBtn');
  const decodeBtn = document.getElementById('decodeBtn');
  const clearBtn = document.getElementById('clearBtn');
  const output = document.getElementById('output');
  const copyBtn = document.getElementById('copyBtn');
  const status = document.getElementById('status');

  // Encode string to Base64
  function encodeBase64(text) {
    try {
      if (!text || !text.trim()) {
        throw new Error('Empty input');
      }
      
      // Encode to Base64
      const encoded = btoa(unescape(encodeURIComponent(text)));
      
      return {
        success: true,
        encoded: encoded
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Decode Base64 string
  function decodeBase64(base64String) {
    try {
      // Clean the input - remove whitespace and common prefixes
      let cleaned = base64String.trim();
      
      // Remove data URI prefix if present (e.g., "data:text/plain;base64,")
      if (cleaned.includes(',')) {
        cleaned = cleaned.split(',')[1];
      }
      
      // Remove any whitespace
      cleaned = cleaned.replace(/\s/g, '');
      
      if (!cleaned) {
        throw new Error('Empty input');
      }
      
      // Decode Base64
      const decoded = atob(cleaned);
      
      // Try to detect if it's binary data or text
      // Check if all characters are printable
      const isText = /^[\x20-\x7E\n\r\t]*$/.test(decoded);
      
      return {
        success: true,
        decoded: decoded,
        isText: isText
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Display encoded result
  function displayEncodedResult(result) {
    if (result.success) {
      output.textContent = result.encoded;
      output.classList.remove('empty');
      output.style.color = '#212529';
      copyBtn.style.display = 'block';
      showStatus('Encoded successfully!', 'success');
    } else {
      output.textContent = '';
      output.classList.add('empty');
      output.textContent = 'Error: ' + result.error;
      copyBtn.style.display = 'none';
      showStatus('Encoding failed: ' + result.error, 'error');
    }
  }

  // Display decoded result
  function displayResult(result) {
    if (result.success) {
      output.textContent = result.decoded;
      output.classList.remove('empty');
      
      if (result.isText) {
        output.style.color = '#212529';
      } else {
        output.style.color = '#dc3545';
        output.textContent = `[Binary data detected - ${result.decoded.length} bytes]\n\n${result.decoded.substring(0, 500)}${result.decoded.length > 500 ? '...' : ''}`;
      }
      
      copyBtn.style.display = 'block';
      showStatus('Decoded successfully!', 'success');
    } else {
      output.textContent = '';
      output.classList.add('empty');
      output.textContent = 'Error: ' + result.error;
      copyBtn.style.display = 'none';
      showStatus('Decoding failed: ' + result.error, 'error');
    }
  }

  // Show status message
  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    
    if (type === 'success') {
      setTimeout(() => {
        status.style.display = 'none';
      }, 3000);
    }
  }

  // Encode button click
  encodeBtn.addEventListener('click', () => {
    const input = base64Input.value;
    if (!input) {
      showStatus('Please enter text to encode', 'error');
      return;
    }
    
    const result = encodeBase64(input);
    displayEncodedResult(result);
  });

  // Decode button click
  decodeBtn.addEventListener('click', () => {
    const input = base64Input.value.trim();
    if (!input) {
      showStatus('Please enter a Base64 string', 'error');
      return;
    }
    
    const result = decodeBase64(input);
    displayResult(result);
  });

  // Clear button click
  clearBtn.addEventListener('click', () => {
    base64Input.value = '';
    output.textContent = 'Encoded or decoded text will appear here...';
    output.classList.add('empty');
    output.style.color = '';
    copyBtn.style.display = 'none';
    status.style.display = 'none';
  });

  // Copy to clipboard
  copyBtn.addEventListener('click', async () => {
    const text = output.textContent;
    try {
      await navigator.clipboard.writeText(text);
      showStatus('Copied to clipboard!', 'success');
    } catch (error) {
      showStatus('Failed to copy: ' + error.message, 'error');
    }
  });

  // Allow Enter key to encode/decode (Ctrl+Enter or Cmd+Enter for decode, Shift+Enter for encode)
  base64Input.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        encodeBtn.click();
      } else {
        decodeBtn.click();
      }
    }
  });

  // Check if there's a message from background script (context menu)
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'decodeSelectedText') {
      base64Input.value = request.text;
      const result = decodeBase64(request.text);
      displayResult(result);
      sendResponse({ success: true });
    }
    return true;
  });

  // Check for pending decode text from context menu
  chrome.runtime.sendMessage({ action: 'getPendingDecode' }, (response) => {
    if (chrome.runtime.lastError) {
      // Ignore errors - this is expected if background script isn't ready
      return;
    }
    if (response && response.text) {
      base64Input.value = response.text;
      const result = decodeBase64(response.text);
      displayResult(result);
    }
  });

  // Focus input on load
  base64Input.focus();

  // Tab functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Remove active class from all tabs and buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const targetContent = document.getElementById(targetTab + 'Tab');
      if (targetContent) {
        targetContent.classList.add('active');
      }
      
      // Focus input when switching to encoder tab
      if (targetTab === 'encoder') {
        base64Input.focus();
      }
    });
  });

  // Settings functionality
  const settingsContent = document.getElementById('settingsContent');
  const websiteInput = document.getElementById('websiteInput');
  const addWebsiteBtn = document.getElementById('addWebsiteBtn');
  const addCurrentWebsiteBtn = document.getElementById('addCurrentWebsiteBtn');
  const websiteList = document.getElementById('websiteList');

  let allowedWebsites = [];
  let currentWebsite = '';
  const websiteIndicator = document.getElementById('websiteIndicator');

  // Check if settings elements exist - but don't return early, just log
  if (!settingsContent || !websiteList) {
    console.error('Settings elements not found', { settingsContent, websiteList });
  }

  // Check if current website matches any allowed website (including wildcards)
  function isCurrentWebsiteAllowed() {
    if (!currentWebsite || allowedWebsites.length === 0) {
      return false;
    }
    
    const normalizedCurrent = currentWebsite.toLowerCase();
    
    return allowedWebsites.some(website => {
      const normalized = website.toLowerCase();
      
      // Exact match
      if (normalized === normalizedCurrent) {
        return true;
      }
      
      // Wildcard match (e.g., *.example.com)
      if (normalized.startsWith('*.')) {
        const domain = normalized.substring(2); // Remove '*.'
        // Check if current website ends with the domain
        if (normalizedCurrent === domain || normalizedCurrent.endsWith('.' + domain)) {
          return true;
        }
      }
      
      return false;
    });
  }

  // Update website indicator visibility
  function updateWebsiteIndicator() {
    if (websiteIndicator && currentWebsite) {
      const isAllowed = isCurrentWebsiteAllowed();
      
      // Always show the indicator if we have a current website
      websiteIndicator.classList.add('visible');
      
      // Update classes based on whether website is in list
      if (isAllowed) {
        websiteIndicator.classList.remove('not-in-list');
        websiteIndicator.classList.add('in-list');
        websiteIndicator.title = 'This website is in your allowed list';
      } else {
        websiteIndicator.classList.remove('in-list');
        websiteIndicator.classList.add('not-in-list');
        websiteIndicator.title = 'Click to add this website to allowed list';
      }
    } else if (websiteIndicator) {
      // Hide if no current website
      websiteIndicator.classList.remove('visible');
    }
  }

  // Add click handler to website indicator
  if (websiteIndicator) {
    websiteIndicator.addEventListener('click', () => {
      if (currentWebsite && !isCurrentWebsiteAllowed()) {
        // Normalize the website
        const normalized = currentWebsite.toLowerCase();
        
        if (!allowedWebsites.includes(normalized)) {
          allowedWebsites.push(normalized);
          saveWebsites();
          renderWebsiteList();
          updateWebsiteIndicator();
          showStatus('Website added!', 'success');
        }
      }
    });
  }

  // Render website list
  function renderWebsiteList() {
    if (!websiteList) {
      console.error('websiteList element not found');
      return;
    }
    
    if (allowedWebsites.length === 0) {
      websiteList.innerHTML = '<div class="empty-list">No websites configured. Button will appear on all websites.</div>';
    } else {
      websiteList.innerHTML = allowedWebsites.map(website => `
        <div class="website-item">
          <span>${website}</span>
          <button class="remove-website" data-website="${website}">Remove</button>
        </div>
      `).join('');
      
      // Add event listeners to remove buttons
      websiteList.querySelectorAll('.remove-website').forEach(btn => {
        btn.addEventListener('click', () => {
          removeWebsite(btn.dataset.website);
        });
      });
    }
  }

  // Load settings from storage
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['allowedWebsites'], (result) => {
      if (result.allowedWebsites && Array.isArray(result.allowedWebsites)) {
        allowedWebsites = result.allowedWebsites;
      }
      // Always render the list, even if empty or if storage doesn't have the key
      renderWebsiteList();
      updateWebsiteIndicator();
    });
  } else {
    // If storage is not available, still render empty list
    renderWebsiteList();
  }

  // Get current website
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url) {
      try {
        const url = new URL(tabs[0].url);
        currentWebsite = url.hostname.replace(/^www\./, '').toLowerCase();
        if (websiteInput) {
          websiteInput.placeholder = `e.g., ${currentWebsite} or *.${currentWebsite.split('.').slice(-2).join('.')}`;
        }
        updateWebsiteIndicator();
      } catch (e) {
        // Ignore errors
      }
    }
  });

  // Add current website button
  if (addCurrentWebsiteBtn) {
    addCurrentWebsiteBtn.addEventListener('click', () => {
      if (currentWebsite) {
        websiteInput.value = currentWebsite;
        addWebsiteBtn.click();
      } else {
        showStatus('Could not detect current website', 'error');
      }
    });
  }


  // Add website
  addWebsiteBtn.addEventListener('click', () => {
    const website = websiteInput.value.trim();
    if (website) {
      // Normalize website (remove protocol, trailing slashes)
      const normalized = website
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '')
        .toLowerCase();
      
      if (normalized && !allowedWebsites.includes(normalized)) {
        allowedWebsites.push(normalized);
        saveWebsites();
        websiteInput.value = '';
        renderWebsiteList();
        updateWebsiteIndicator();
        showStatus('Website added!', 'success');
      } else if (allowedWebsites.includes(normalized)) {
        showStatus('Website already in list', 'error');
      }
    }
  });

  // Add website on Enter key
  websiteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addWebsiteBtn.click();
    }
  });

  // Remove website
  function removeWebsite(website) {
    allowedWebsites = allowedWebsites.filter(w => w !== website);
    saveWebsites();
    renderWebsiteList();
    updateWebsiteIndicator();
    showStatus('Website removed!', 'success');
  }

  // Save websites to storage
  function saveWebsites() {
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ allowedWebsites: allowedWebsites }, () => {
        // Notify content scripts of the change
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            if (tab && tab.id && tab.id >= 0) {
              chrome.tabs.sendMessage(tab.id, { action: 'updateAllowedWebsites', websites: allowedWebsites }).catch(() => {
                // Ignore errors for tabs where content script isn't loaded
              });
            }
          });
        });
      });
    }
  }

});
