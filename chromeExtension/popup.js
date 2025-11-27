// Base64 Decoder Popup Script

document.addEventListener('DOMContentLoaded', () => {
  const base64Input = document.getElementById('base64Input');
  const decodeBtn = document.getElementById('decodeBtn');
  const clearBtn = document.getElementById('clearBtn');
  const output = document.getElementById('output');
  const copyBtn = document.getElementById('copyBtn');
  const status = document.getElementById('status');

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
    output.textContent = 'Decoded text will appear here...';
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

  // Allow Enter key to decode (Ctrl+Enter or Cmd+Enter)
  base64Input.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      decodeBtn.click();
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
    if (response && response.text) {
      base64Input.value = response.text;
      const result = decodeBase64(response.text);
      displayResult(result);
    }
  });

  // Focus input on load
  base64Input.focus();
});
