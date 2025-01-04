class DiscordShareButton {
    constructor() {
        this.createButton();
        this.createMenu();
        this.loadWebhooks();
        this.isDragging = false;
        this.currentX = 0;
        this.currentY = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.xOffset = 0;
        this.yOffset = 0;
    }

    createButton() {
        this.button = document.createElement('div');
        this.button.id = 'discord-share-button';
        this.button.innerHTML = `
        <img src="data:image/svg+xml,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <path d="M19.952,5.672c-1.904-1.531-4.916-1.79-5.044-1.801c-0.201-0.017-0.392,0.097-0.474,0.281 c-0.006,0.012-0.072,0.163-0.145,0.398c1.259,0.212,2.806,0.64,4.206,1.509c0.224,0.139,0.293,0.434,0.154,0.659 c-0.09,0.146-0.247,0.226-0.408,0.226c-0.086,0-0.173-0.023-0.252-0.072C15.584,5.38,12.578,5.305,12,5.305S8.415,5.38,6.011,6.872 c-0.225,0.14-0.519,0.07-0.659-0.154c-0.14-0.225-0.07-0.519,0.154-0.659c1.4-0.868,2.946-1.297,4.206-1.509 c-0.074-0.236-0.14-0.386-0.145-0.398C9.484,3.968,9.294,3.852,9.092,3.872c-0.127,0.01-3.139,0.269-5.069,1.822 C3.015,6.625,1,12.073,1,16.783c0,0.083,0.022,0.165,0.063,0.237c1.391,2.443,5.185,3.083,6.05,3.111c0.005,0,0.01,0,0.015,0 c0.153,0,0.297-0.073,0.387-0.197l0.875-1.202c-2.359-0.61-3.564-1.645-3.634-1.706c-0.198-0.175-0.217-0.477-0.042-0.675 c0.175-0.198,0.476-0.217,0.674-0.043c0.029,0.026,2.248,1.909,6.612,1.909c4.372,0,6.591-1.891,6.613-1.91 c0.198-0.172,0.5-0.154,0.674,0.045c0.174,0.198,0.155,0.499-0.042,0.673c-0.07,0.062-1.275,1.096-3.634,1.706l0.875,1.202 c0.09,0.124,0.234,0.197,0.387,0.197c0.005,0,0.01,0,0.015,0c0.865-0.027,4.659-0.667,6.05-3.111 C22.978,16.947,23,16.866,23,16.783C23,12.073,20.985,6.625,19.952,5.672z M8.891,14.87c-0.924,0-1.674-0.857-1.674-1.913 s0.749-1.913,1.674-1.913s1.674,0.857,1.674,1.913S9.816,14.87,8.891,14.87z M15.109,14.87c-0.924,0-1.674-0.857-1.674-1.913 s0.749-1.913,1.674-1.913c0.924,0,1.674,0.857,1.674,1.913S16.033,14.87,15.109,14.87z"/>
          </svg>
        `)}"/>
      `;

        document.body.appendChild(this.button);
        this.addDragListeners();
    }

    createMenu() {
        this.menu = document.createElement('div');
        this.menu.className = 'discord-share-menu';
        document.body.appendChild(this.menu);
    }

    addDragListeners() {
        this.button.addEventListener('mousedown', (e) => this.dragStart(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.dragEnd());

        this.button.addEventListener('touchstart', (e) => this.dragStart(e));
        document.addEventListener('touchmove', (e) => this.drag(e));
        document.addEventListener('touchend', () => this.dragEnd());

        this.button.addEventListener('click', (e) => this.showMenu(e));
    }

    dragStart(e) {
        if (e.type === 'touchstart') {
            this.initialX = e.touches[0].clientX - this.xOffset;
            this.initialY = e.touches[0].clientY - this.yOffset;
        } else {
            this.initialX = e.clientX - this.xOffset;
            this.initialY = e.clientY - this.yOffset;
        }

        if (e.target === this.button) {
            this.isDragging = true;
        }
    }

    drag(e) {
        if (this.isDragging) {
            e.preventDefault();

            if (e.type === 'touchmove') {
                this.currentX = e.touches[0].clientX - this.initialX;
                this.currentY = e.touches[0].clientY - this.initialY;
            } else {
                this.currentX = e.clientX - this.initialX;
                this.currentY = e.clientY - this.initialY;
            }

            this.xOffset = this.currentX;
            this.yOffset = this.currentY;

            this.setTranslate(this.currentX, this.currentY, this.button);
        }
    }

    dragEnd() {
        this.isDragging = false;
    }

    setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    async loadWebhooks() {
        const result = await chrome.storage.sync.get('webhooks');
        this.webhooks = result.webhooks || [];
    }

    showMenu(e) {
        if (!this.isDragging) {
            e.stopPropagation();

            const selection = window.getSelection().toString();
            this.menu.innerHTML = '';

            if (this.webhooks.length === 0) {
                const item = document.createElement('div');
                item.className = 'discord-share-menu-item';
                item.textContent = 'Please set up webhooks in extension settings';
                this.menu.appendChild(item);
            } else {
                this.webhooks.forEach(webhook => {
                    const item = document.createElement('div');
                    item.className = 'discord-share-menu-item';
                    item.textContent = `Share to ${webhook.name}`;
                    item.addEventListener('click', () => this.shareContent(webhook, selection));
                    this.menu.appendChild(item);
                });
            }

            this.menu.style.display = 'block';
            const rect = this.button.getBoundingClientRect();
            this.menu.style.left = `${rect.left}px`;
            this.menu.style.top = `${rect.top - this.menu.offsetHeight}px`;
        }
    }

    async shareContent(webhook, content) {
        try {
            const response = await fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content || 'No content selected'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send to Discord');
            }

            this.showNotification('Successfully shared to Discord!');
        } catch (error) {
            this.showNotification('Error sharing to Discord: ' + error.message);
        }

        this.menu.style.display = 'none';
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        z-index: 10002;
        animation: fadeOut 3s forwards;
      `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}

// Initialize the floating button
new DiscordShareButton();

document.addEventListener('click', (e) => {
    const menu = document.querySelector('.discord-share-menu');
    if (menu && !e.target.closest('#discord-share-button')) {
        menu.style.display = 'none';
    }
});