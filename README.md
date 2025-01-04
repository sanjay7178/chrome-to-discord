# Discord Share Chrome Extension

## Overview

The Discord Share Chrome Extension allows users to share content from any webpage directly to their Discord channels using webhooks. This extension provides a floating button on the webpage for easy access and a settings popup to manage webhooks.

## Features

- Floating share button that can be dragged around the screen.
- Share selected text, links, or images directly to Discord.
- Manage multiple webhooks through the extension settings.
- Notifications for successful or failed shares.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/sanjay7178/chrome-to-discord.git
    ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle in the top right corner.
4. Click "Load unpacked" and select the cloned repository folder.

## Usage

1. Click the floating Discord share button on any webpage.
2. Select the content you want to share (text, link, or image).
3. Choose the Discord channel from the menu.
4. The content will be shared to the selected Discord channel.

## Managing Webhooks

1. Click the extension icon in the Chrome toolbar.
2. In the popup, add or remove webhooks as needed.
3. Click "Save Settings" to store the webhooks.

## Development

### File Structure

- `floatingButton.js`: Handles the floating button functionality and sharing logic.
- `floatingButton.css`: Styles for the floating button and menu.
- `popup.js`: Manages the popup settings for adding/removing webhooks.
- `popup.html`: HTML for the popup settings interface.
- `background.js`: Handles context menu interactions and background tasks.
- `manifest.json`: Chrome extension manifest file.

### Running Locally

1. Make changes to the code as needed.
2. Reload the extension in Chrome by navigating to `chrome://extensions/` and clicking the reload button for the Discord Share extension.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
