# Base64 Decoder Chrome Extension

A powerful Chrome extension to decode Base64 strings from input or selected text on web pages with multiple convenient methods.

## Features

- **Multiple Decoding Methods:**
  - Direct input in the extension popup
  - Right-click context menu on selected text
  - Floating decode button that appears when text is selected
  
- **Smart Detection:**
  - Automatic detection of text vs binary data
  - JSON detection and pretty-printing
  - Handles data URI prefixes automatically (e.g., `data:text/plain;base64,`)
  
- **User Experience:**
  - In-page popup for quick decoding without opening extension popup
  - Copy decoded results to clipboard with one click
  - Keyboard shortcuts (Ctrl+Enter or Cmd+Enter to decode)
  - Website allowlist to control where floating button appears
  - Clean, modern UI

## Installation

1. Download or clone this extension folder
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" button
5. Select the extension folder
6. The extension is now installed!

## Usage

### Method 1: Direct Input (Extension Popup)
1. Click the extension icon in the Chrome toolbar
2. Paste your Base64 string into the input box
3. Click "Decode" button (or press Ctrl+Enter / Cmd+Enter)
4. View the decoded result in the output area
5. Click "Copy to Clipboard" to copy the decoded text

### Method 2: Context Menu
1. Select any Base64 text on a webpage
2. Right-click on the selected text
3. Choose "Decode Base64" from the context menu
4. An in-page popup will appear with the decoded result
5. Click "Copy" to copy the result, or click outside to close

### Method 3: Floating Button
1. Select any Base64 text on a webpage
2. A floating "🔓 Decode Base64" button will appear near the selection
3. Click the button to decode
4. An in-page popup will appear with the decoded result

**Note:** The floating button can be configured to appear only on specific websites (see Settings below).

## Settings

### Website Allowlist

Control which websites show the floating decode button:

1. Open the extension popup
2. Click "Show" in the Settings section
3. Add website domains (e.g., `example.com` or `*.example.com` for wildcards)
4. Click "Add" or use the "+ Current" button to add the current website
5. Remove websites by clicking "Remove" next to any entry

**Behavior:**
- If no websites are configured, the floating button appears on all websites
- If websites are configured, the button only appears on matching domains
- Wildcard patterns (e.g., `*.example.com`) match subdomains

## How It Works

The extension:
1. Accepts Base64 strings from the popup input, context menu, or floating button
2. Automatically removes data URI prefixes (e.g., `data:text/plain;base64,`)
3. Cleans whitespace from the input
4. Decodes the Base64 string using the browser's built-in `atob()` function
5. Detects whether the result is text or binary data
6. Automatically detects and pretty-prints JSON if applicable
7. Displays the decoded result in the popup or in-page popup

## Files

- `manifest.json` - Extension configuration and permissions
- `popup.html` - Extension popup interface
- `popup.js` - Popup logic, decoding functionality, and settings management
- `content.js` - Content script for floating button, in-page popup, and context menu handling
- `content.css` - Styles for in-page popup and floating button
- `background.js` - Service worker for context menu and message handling
- `icon16.png`, `icon48.png`, `icon128.png` - Extension icons

## Permissions

- `activeTab` - To access the current tab's content
- `contextMenus` - To add "Decode Base64" option to right-click menu
- `storage` - To save website allowlist settings

## Keyboard Shortcuts

- **Ctrl+Enter** (Windows/Linux) or **Cmd+Enter** (Mac) - Decode text in the popup input field

## Notes

- The extension works on any webpage
- Supports both text and binary Base64 data
- Automatically handles common Base64 formats including data URIs
- JSON content is automatically detected and formatted for readability
- Invalid Base64 strings will show an error message
- The floating button hides automatically when scrolling or clicking elsewhere

## Troubleshooting

**Decoding fails:**
- Make sure the input is valid Base64 (only A-Z, a-z, 0-9, +, /, and = characters)
- Check that the Base64 string is complete (not truncated)
- Ensure there are no extra characters or invalid encoding

**Context menu doesn't appear:**
- Make sure the extension is enabled in `chrome://extensions/`
- Try reloading the extension
- Right-click on selected text (not empty space)
- Some pages (like `chrome://` pages) don't support content scripts

**Floating button doesn't appear:**
- Check if the current website is in your allowlist (if configured)
- Make sure you've selected text (not just clicked)
- Try refreshing the page
- Check Settings to see if websites are configured

**Can't install extension:**
- Make sure Developer mode is enabled in `chrome://extensions/`
- Make sure all files are in the same folder
- Try reloading the extension after making changes
- Check the browser console for any error messages
