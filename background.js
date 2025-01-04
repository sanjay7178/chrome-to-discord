
// background.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'shareToDiscord',
        title: 'Share to Discord',
        contexts: ['image', 'link', 'selection']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.storage.sync.get('webhooks', async function (data) {
        const webhooks = data.webhooks || [];

        if (webhooks.length === 0) {
            alert('Please set up Discord webhooks in the extension settings first.');
            return;
        }

        const webhook = webhooks[0]; // You could add a submenu to select specific channels
        let content = '';

        if (info.selectionText) {
            content = info.selectionText;
        } else if (info.linkUrl) {
            content = info.linkUrl;
        } else if (info.srcUrl) {
            content = info.srcUrl;
        }

        try {
            const response = await fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send to Discord');
            }

            alert('Successfully shared to Discord!');
        } catch (error) {
            alert('Error sharing to Discord: ' + error.message);
        }
    });
});