
// popup.js
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('webhooks-container');
    const addButton = document.getElementById('add-webhook');
    const saveButton = document.getElementById('save');

    // Load saved webhooks
    chrome.storage.sync.get('webhooks', function (data) {
        const webhooks = data.webhooks || [];
        webhooks.forEach(webhook => addWebhookEntry(webhook));
    });

    addButton.addEventListener('click', () => {
        addWebhookEntry();
    });

    saveButton.addEventListener('click', () => {
        const entries = document.querySelectorAll('.webhook-entry');
        const webhooks = Array.from(entries).map(entry => ({
            name: entry.querySelector('.webhook-name').value,
            url: entry.querySelector('.webhook-url').value
        }));

        chrome.storage.sync.set({ webhooks }, () => {
            alert('Settings saved!');
        });
    });

    function addWebhookEntry(webhook = { name: '', url: '' }) {
        const entry = document.createElement('div');
        entry.className = 'webhook-entry';
        entry.innerHTML = `
        <input type="text" class="webhook-name" placeholder="Channel Name" value="${webhook.name}">
        <input type="text" class="webhook-url" placeholder="Webhook URL" value="${webhook.url}">
        <button class="remove">Remove</button>
      `;

        entry.querySelector('.remove').addEventListener('click', () => {
            entry.remove();
        });

        container.appendChild(entry);
    }
});
