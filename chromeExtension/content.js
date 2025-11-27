// Base64 Decoder Content Script

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
    
    // Try to parse as JSON
    let isJSON = false;
    let prettyJSON = null;
    if (isText) {
      try {
        const parsed = JSON.parse(decoded);
        isJSON = true;
        prettyJSON = JSON.stringify(parsed, null, 2);
      } catch (e) {
        // Not valid JSON, continue with regular text
      }
    }
    
    return {
      success: true,
      decoded: decoded,
      isText: isText,
      isJSON: isJSON,
      prettyJSON: prettyJSON
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Show popup next to selected text
function showDecodePopup(result, selection) {
  // Remove any existing popup
  const existingPopup = document.getElementById('base64-decoder-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // Get selection position
  let rect;
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  
  try {
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      rect = range.getBoundingClientRect();
    } else {
      // Fallback: center of viewport
      rect = {
        top: window.innerHeight / 2,
        bottom: window.innerHeight / 2 + 20,
        left: window.innerWidth / 2,
        right: window.innerWidth / 2 + 100
      };
    }
  } catch (e) {
    // Fallback: center of viewport
    rect = {
      top: window.innerHeight / 2,
      bottom: window.innerHeight / 2 + 20,
      left: window.innerWidth / 2,
      right: window.innerWidth / 2 + 100
    };
  }

  // Create popup element
  const popup = document.createElement('div');
  popup.id = 'base64-decoder-popup';
  popup.className = result.success ? 'base64-decoder-popup success' : 'base64-decoder-popup error';
  
  // Prevent click outside from firing when interacting with popup
  let isInteractingWithPopup = false;
  
  // Create content
  const content = document.createElement('div');
  content.className = 'base64-decoder-content';
  
  const header = document.createElement('div');
  header.className = 'base64-decoder-header';
  if (result.success) {
    header.textContent = result.isJSON ? '✓ Decoded JSON' : '✓ Decoded';
  } else {
    header.textContent = '✗ Error';
  }
  
  const body = document.createElement('div');
  body.className = 'base64-decoder-body';
  
  if (result.success) {
    if (result.isJSON && result.prettyJSON) {
      // Show pretty formatted JSON
      body.textContent = result.prettyJSON;
      body.classList.add('json-formatted');
    } else if (result.isText) {
      body.textContent = result.decoded;
    } else {
      body.textContent = `[Binary data - ${result.decoded.length} bytes]\n${result.decoded.substring(0, 200)}${result.decoded.length > 200 ? '...' : ''}`;
    }
  } else {
    body.textContent = result.error;
  }
  
  // Prevent popup from closing when scrolling inside the body
  body.addEventListener('wheel', (e) => {
    e.stopPropagation();
    isInteractingWithPopup = true;
  });
  
  body.addEventListener('mousedown', () => {
    isInteractingWithPopup = true;
  });
  
  body.addEventListener('mouseup', () => {
    isInteractingWithPopup = true;
  });
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'base64-decoder-close';
  closeBtn.textContent = '×';
  closeBtn.onclick = () => popup.remove();
  
  const copyBtn = document.createElement('button');
  copyBtn.className = 'base64-decoder-copy';
  copyBtn.textContent = 'Copy';
  copyBtn.onclick = async () => {
    try {
      // Copy pretty JSON if available, otherwise copy original decoded text
      const textToCopy = result.success 
        ? (result.isJSON && result.prettyJSON ? result.prettyJSON : result.decoded)
        : result.error;
      await navigator.clipboard.writeText(textToCopy);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  
  // Only show copy button on success
  if (result.success) {
    content.appendChild(header);
    content.appendChild(body);
    content.appendChild(copyBtn);
  } else {
    content.appendChild(header);
    content.appendChild(body);
  }
  
  popup.appendChild(content);
  popup.appendChild(closeBtn);
  
  // Position popup
  document.body.appendChild(popup);
  
  // Calculate position (below selection, or above if near bottom of screen)
  const popupRect = popup.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  
  let top = rect.bottom + scrollTop + 10;
  let left = rect.left + scrollLeft;
  
  // If not enough space below, show above
  if (spaceBelow < popupRect.height + 20 && spaceAbove > popupRect.height) {
    top = rect.top + scrollTop - popupRect.height - 10;
  }
  
  // Adjust if popup goes off screen horizontally
  if (left + popupRect.width > window.innerWidth + scrollLeft) {
    left = window.innerWidth + scrollLeft - popupRect.width - 10;
  }
  if (left < scrollLeft) {
    left = scrollLeft + 10;
  }
  
  popup.style.top = top + 'px';
  popup.style.left = left + 'px';
  
  // Prevent popup from closing when interacting with it
  popup.addEventListener('mousedown', () => {
    isInteractingWithPopup = true;
  });
  
  popup.addEventListener('mouseup', () => {
    isInteractingWithPopup = true;
  });
  
  popup.addEventListener('wheel', (e) => {
    e.stopPropagation();
    isInteractingWithPopup = true;
  });
  
  // Click outside to close
  const clickOutside = (e) => {
    // Don't close if user is interacting with popup or if click is inside popup
    if (!isInteractingWithPopup && !popup.contains(e.target)) {
      popup.remove();
      document.removeEventListener('mousedown', clickOutside);
    }
    isInteractingWithPopup = false;
  };
  
  setTimeout(() => {
    document.addEventListener('mousedown', clickOutside);
  }, 100);
}

// Listen for messages from background script (context menu)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'decodeSelectedText') {
    const selectedText = request.text || window.getSelection().toString().trim();
    
    if (selectedText) {
      const result = decodeBase64(selectedText);
      // Get current selection for positioning
      const selection = window.getSelection();
      showDecodePopup(result, selection);
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'No text provided' });
    }
  }
  
  return true;
});

// Also handle context menu clicks directly
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    const selectedText = window.getSelection().toString().trim();
    sendResponse({ text: selectedText });
  }
  return true;
});

// Floating decode button that appears when text is selected
let floatingButton = null;

function showFloatingButton(selection) {
  // Remove existing button
  if (floatingButton) {
    floatingButton.remove();
    floatingButton = null;
  }
  
  if (!selection || selection.rangeCount === 0) {
    return;
  }
  
  try {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Create floating button
    floatingButton = document.createElement('div');
    floatingButton.id = 'base64-decoder-floating-btn';
    floatingButton.className = 'base64-decoder-floating-btn';
    floatingButton.textContent = '🔓 Decode Base64';
    floatingButton.title = 'Click to decode selected Base64 text';
    
    // Position button near selection
    let top = rect.bottom + scrollTop + 5;
    let left = rect.left + scrollLeft;
    
    // Adjust if button goes off screen
    if (left + 150 > window.innerWidth + scrollLeft) {
      left = window.innerWidth + scrollLeft - 150;
    }
    if (left < scrollLeft) {
      left = scrollLeft + 10;
    }
    
    floatingButton.style.top = top + 'px';
    floatingButton.style.left = left + 'px';
    
    // Click handler
    floatingButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const selectedText = selection.toString().trim();
      if (selectedText) {
        const result = decodeBase64(selectedText);
        showDecodePopup(result, selection);
        hideFloatingButton();
      }
    });
    
    document.body.appendChild(floatingButton);
    
    // Animate in
    setTimeout(() => {
      floatingButton.classList.add('visible');
    }, 10);
  } catch (e) {
    console.error('Error showing floating button:', e);
  }
}

function hideFloatingButton() {
  if (floatingButton) {
    floatingButton.classList.remove('visible');
    setTimeout(() => {
      if (floatingButton) {
        floatingButton.remove();
        floatingButton = null;
      }
    }, 200);
  }
}

// Listen for text selection
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText && selectedText.length > 0) {
    // Show floating button after a short delay
    setTimeout(() => {
      const currentSelection = window.getSelection();
      if (currentSelection.toString().trim() === selectedText) {
        showFloatingButton(currentSelection);
      }
    }, 100);
  } else {
    hideFloatingButton();
  }
});

// Hide button when clicking elsewhere
document.addEventListener('mousedown', (e) => {
  if (floatingButton && !floatingButton.contains(e.target)) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (!selectedText) {
      hideFloatingButton();
    }
  }
});

// Hide button on scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (floatingButton) {
    hideFloatingButton();
  }
}, true);
