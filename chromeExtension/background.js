// Base64 Decoder Background Service Worker

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'decodeBase64',
    title: 'Decode Base64',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'decodeBase64') {
    const selectedText = info.selectionText.trim();
    
    if (selectedText && tab && tab.id && tab.id >= 0) {
      // Send message to content script to decode and show popup
      chrome.tabs.sendMessage(tab.id, {
        action: 'decodeSelectedText',
        text: selectedText
      }, (response) => {
        if (chrome.runtime.lastError) {
          // Silently ignore errors for tabs where content script isn't loaded
          // (e.g., chrome:// pages, extension pages, etc.)
        }
      });
    }
  }
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'decodeText') {
    // Store text for popup to retrieve
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ pendingDecode: request.text }, () => {
        sendResponse({ success: true });
      });
    } else {
      sendResponse({ success: false, error: 'Storage not available' });
    }
    return true;
  }
  
  if (request.action === 'getPendingDecode') {
    // Popup is requesting pending decode text
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['pendingDecode'], (result) => {
        if (result.pendingDecode) {
          chrome.storage.local.remove(['pendingDecode']);
          sendResponse({ text: result.pendingDecode });
        } else {
          sendResponse({ text: null });
        }
      });
    } else {
      sendResponse({ text: null });
    }
    return true;
  }
  
  return true;
});
