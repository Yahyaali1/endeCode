# Base64 Decoder Chrome Extension

A Chrome extension to decode Base64 strings from input or selected text on web pages.

## Features

- Decode Base64 strings directly from the popup input box
- Right-click context menu to decode selected text on any webpage
- Automatic detection of text vs binary data
- Copy decoded results to clipboard
- Handles data URI prefixes automatically
- Clean, modern UI

## Installation

1. Download or clone this extension folder
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" button
5. Select the extension folder
6. The extension is now installed!

## Usage

### Method 1: Direct Input
1. Click the extension icon in the Chrome toolbar
2. Paste your Base64 string into the input box
3. Click "Decode" button
4. View the decoded result in the output area
5. Click "Copy to Clipboard" to copy the decoded text

### Method 2: Context Menu
1. Select any Base64 text on a webpage
2. Right-click on the selected text
3. Choose "Decode Base64" from the context menu
4. The extension popup will open with the decoded result

## How It Works

The extension:
1. Accepts Base64 strings from the popup input or selected text
2. Automatically removes data URI prefixes (e.g., `data:text/plain;base64,`)
3. Cleans whitespace from the input
4. Decodes the Base64 string using the browser's built-in `atob()` function
5. Detects whether the result is text or binary data
6. Displays the decoded result

## Files

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup interface
- `popup.js` - Popup logic and decoding functionality
- `content.js` - Content script for handling context menu
- `background.js` - Service worker for context menu and message handling
- `icon16.png`, `icon48.png`, `icon128.png` - Extension icons

## Permissions

- `activeTab` - To access the current tab's content
- `contextMenus` - To add "Decode Base64" option to right-click menu

## Notes

- The extension works on any webpage
- Supports both text and binary Base64 data
- Automatically handles common Base64 formats including data URIs
- Invalid Base64 strings will show an error message

## Troubleshooting

**Decoding fails:**
- Make sure the input is valid Base64 (only A-Z, a-z, 0-9, +, /, and = characters)
- Check that the Base64 string is complete (not truncated)

**Context menu doesn't appear:**
- Make sure the extension is enabled in chrome://extensions/
- Try reloading the extension
- Right-click on selected text (not empty space)

**Can't install extension:**
- Make sure Developer mode is enabled in chrome://extensions/
- Make sure all files are in the same folder
- Try reloading the extension after making changes
