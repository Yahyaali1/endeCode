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
    
    if (selectedText && tab.id) {
      // Send message to content script to decode and show popup
      chrome.tabs.sendMessage(tab.id, {
        action: 'decodeSelectedText',
        text: selectedText
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message to content script:', chrome.runtime.lastError);
        }
      });
    }
  }
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'decodeText') {
    // Store text for popup to retrieve
    chrome.storage.local.set({ pendingDecode: request.text }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'getPendingDecode') {
    // Popup is requesting pending decode text
    chrome.storage.local.get(['pendingDecode'], (result) => {
      if (result.pendingDecode) {
        chrome.storage.local.remove(['pendingDecode']);
        sendResponse({ text: result.pendingDecode });
      } else {
        sendResponse({ text: null });
      }
    });
    return true;
  }
  
  return true;
});
