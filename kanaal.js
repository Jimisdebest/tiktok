// ==================== KANAAL PAGINA ====================

const WEBSITE_URL = 'https://jimisdebest.github.io/bobtop/';

// Video database (zelfde als in script.js)
const mediaDatabase = [
    {
        id: 1,
        type: 'video',
        url: 'video.mp4',
        channel: 'CleanGirlOfficial',
        channelId: 'cleangirl',
        title: 'Cleaning MacDonalds bathroom for free!?',
        description: 'Today i am going to clean MacDonalds bathroom for free!',
        contentType: 'Real',
        weight: 1
    },
    {
        id: 2,
        type: 'video',
        url: 'HEMAregenboogrookworst.mp4',
        channel: 'HEMA',
        channelId: 'hema',
        title: 'HEMA',
        description: 'Koop nu HEMA regenboogrookworst!',
        contentType: 'Real',
        weight: 1
    },
    {
        id: 3,
        type: 'video',
        url: 'MINECRAFTMODS-hoe-je-een-mod-installeerd.mp4',
        channel: 'MINECRAFTMODS',
        channelId: 'minecraftmods',
        title: 'Hoe je een mod installeert',
        description: 'Een eenvoudige uitleg voor how to',
        contentType: 'AI',
        weight: 1
    }
];

// Channel database - ALLE KANALEN HIER!
const channelDatabase = {
    'cleangirl': {
        id: 'cleangirl',
        name: 'CleanGirlOfficial',
        avatar: 'C',
        banner: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
        description: 'Schoonmaken op bijzondere plekken! 🧹✨',
        subscribers: 15200,
        videos: [1]
    },
    'hema': {
        id: 'hema',
        name: 'HEMA',
        avatar: 'H',
        banner: 'linear-gradient(45deg, #e3001b, #ff6b6b)',
        description: 'Officieel HEMA kanaal. Alles voor elkaar! 🛍️',
        subscribers: 8900,
        videos: [2]
    },
    'minecraftmods': {
        id: 'minecraftmods',
        name: 'MINECRAFTMODS',
        avatar: 'M',
        banner: 'linear-gradient(45deg, #3a8520, #5fa84a)',
        description: 'Minecraft mods tutorials en uitleg! ⛏️🎮',
        subscribers: 34500,
        videos: [3]
    }
};

// App state
let currentUserId = 'user_' + Math.random().toString(36).substr(2, 9);
let subscriptions = [];

// Initialize
function initStorage() {
    const subs = localStorage.getItem(`subs_${currentUserId}`);
    if (subs) {
        subscriptions = JSON.parse(subs);
    }
    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem(`subs_${currentUserId}`, JSON.stringify(subscriptions));
}

// Get channel from URL
function getChannelFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('channel');
}

// Load channel data
function loadChannelData() {
    const channelId = getChannelFromUrl();
    if (!channelId) {
        window.location.href = 'index.html';
        return;
    }
    
    const channel = channelDatabase[channelId];
    if (!channel) {
        window.location.href = 'index.html';
        return;
    }
    
    // Set channel header
    document.getElementById('channelName').textContent = channel.name;
    document.getElementById('channelDescription').textContent = channel.description;
    document.getElementById('channelStats').textContent = `${channel.subscribers.toLocaleString()} abonnees`;
    document.getElementById('channelAvatar').textContent = channel.avatar;
    document.querySelector('.channel-banner').style.background = channel.banner;
    
    // Check if subscribed
    const subscribeBtn = document.getElementById('subscribeBtn');
    if (subscriptions.includes(channelId)) {
        subscribeBtn.textContent = 'Geabonneerd';
        subscribeBtn.classList.add('subscribed');
    } else {
        subscribeBtn.textContent = 'Abonneren';
        subscribeBtn.classList.remove('subscribed');
    }
    
    // Load channel videos
    loadChannelVideos(channel.videos);
}

// Load channel videos
function loadChannelVideos(videoIds) {
    const videosContainer = document.getElementById('channelVideos');
    const channelVideos = mediaDatabase.filter(video => videoIds.includes(video.id));
    
    if (channelVideos.length === 0) {
        videosContainer.innerHTML = '<div class="empty-state">📹 Nog geen videos</div>';
        return;
    }
    
    videosContainer.innerHTML = channelVideos.map(video => `
        <a href="index.html?v=${video.id}" class="channel-video-card">
            <video src="${video.url}" class="channel-video-thumb"></video>
            <div class="channel-video-info">
                <div class="channel-video-title">${video.title}</div>
                <div class="channel-video-desc">${video.description}</div>
                <div class="channel-video-meta">${video.contentType || 'Real'}</div>
            </div>
        </a>
    `).join('');
}

// Handle subscribe
function handleSubscribe() {
    const channelId = getChannelFromUrl();
    const btn = document.getElementById('subscribeBtn');
    
    const index = subscriptions.indexOf(channelId);
    if (index === -1) {
        subscriptions.push(channelId);
        btn.textContent = 'Geabonneerd';
        btn.classList.add('subscribed');
    } else {
        subscriptions.splice(index, 1);
        btn.textContent = 'Abonneren';
        btn.classList.remove('subscribed');
    }
    
    saveToStorage();
}

// Handle share channel
function handleShareChannel() {
    const channelId = getChannelFromUrl();
    const channel = channelDatabase[channelId];
    const shareUrl = `${WEBSITE_URL}kanaal.html?channel=${channelId}`;
    
    const sharePopup = document.getElementById('sharePopup');
    const shareUrlText = document.getElementById('shareUrlText');
    const whatsappLink = document.getElementById('whatsappShareLink');
    const emailLink = document.getElementById('emailShareLink');
    
    shareUrlText.textContent = shareUrl;
    whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(channel.name + ' - Kanaal op Bobtop: ' + shareUrl)}`;
    emailLink.href = `mailto:?subject=${encodeURIComponent('Bobtop kanaal: ' + channel.name)}&body=${encodeURIComponent('Bekijk dit kanaal op Bobtop: ' + shareUrl)}`;
    
    const copyBtn = document.getElementById('copyShareLink');
    copyBtn.onclick = function() {
        navigator.clipboard.writeText(shareUrl).then(function() {
            const feedback = document.createElement('div');
            feedback.className = 'copy-feedback';
            feedback.textContent = '✅ Link gekopieerd!';
            document.body.appendChild(feedback);
            setTimeout(() => feedback.remove(), 2000);
        });
    };
    
    sharePopup.classList.add('show');
}

// Show saved items
window.showSavedItems = function() {
    let savedItems = [];
    const saved = localStorage.getItem(`saved_${currentUserId}`);
    if (saved) {
        savedItems = JSON.parse(saved);
    }
    
    const popup = document.getElementById('savedPopup');
    const list = document.getElementById('savedItemsList');
    
    if (savedItems.length === 0) {
        list.innerHTML = '<div class="empty-state">📭 Nog geen opgeslagen videos</div>';
    } else {
        list.innerHTML = savedItems.map(item => `
            <div class="saved-item">
                <video src="${item.url}" class="saved-item-thumb"></video>
                <div class="saved-item-info">
                    <div class="saved-item-title">${item.title}</div>
                    <div class="saved-item-channel">${item.channel}</div>
                </div>
                <div class="saved-item-actions">
                    <button class="saved-item-remove" onclick="removeSavedItem(${item.id})">❌</button>
                </div>
            </div>
        `).join('');
    }
    
    popup.classList.add('show');
};

// Remove saved item
window.removeSavedItem = function(mediaId) {
    let savedItems = [];
    const saved = localStorage.getItem(`saved_${currentUserId}`);
    if (saved) {
        savedItems = JSON.parse(saved);
    }
    
    const index = savedItems.findIndex(item => item.id === mediaId);
    if (index !== -1) {
        savedItems.splice(index, 1);
        localStorage.setItem(`saved_${currentUserId}`, JSON.stringify(savedItems));
        showSavedItems();
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initStorage();
    loadChannelData();
    
    // Event listeners
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    document.getElementById('subscribeBtn').addEventListener('click', handleSubscribe);
    
    document.getElementById('shareChannelBtn').addEventListener('click', handleShareChannel);
    
    document.getElementById('savedBtn').addEventListener('click', showSavedItems);
    
    // Close popups
    document.getElementById('closePopup').addEventListener('click', function() {
        document.getElementById('savedPopup').classList.remove('show');
    });
    
    document.getElementById('closeSharePopup').addEventListener('click', function() {
        document.getElementById('sharePopup').classList.remove('show');
    });
    
    // Click outside popup
    document.getElementById('savedPopup').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
        }
    });
    
    document.getElementById('sharePopup').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
        }
    });
});

// Handle browser back/forward
window.addEventListener('popstate', function(event) {
    loadChannelData();
});
