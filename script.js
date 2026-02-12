// ==================== BOBTOP - ALLEEN VOOR INDEX.HTML ====================
console.log("script.js GELADEN - index.html pagina");

// ==================== VIDEO DATABASE ====================
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

const WEBSITE_URL = 'https://jimisdebest.github.io/bobtop/';

// App state
let currentUserId = 'user_' + Math.random().toString(36).substr(2, 9);
let savedItems = [];
let subscriptions = [];
let userPreferences = {
    likes: [],
    dislikes: []
};

// Initialize localStorage
function initStorage() {
    const saved = localStorage.getItem(`saved_${currentUserId}`);
    if (saved) {
        savedItems = JSON.parse(saved);
    }
    
    const prefs = localStorage.getItem(`prefs_${currentUserId}`);
    if (prefs) {
        userPreferences = JSON.parse(prefs);
    }
    
    const subs = localStorage.getItem(`subs_${currentUserId}`);
    if (subs) {
        subscriptions = JSON.parse(subs);
    }
    
    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem(`saved_${currentUserId}`, JSON.stringify(savedItems));
    localStorage.setItem(`prefs_${currentUserId}`, JSON.stringify(userPreferences));
    localStorage.setItem(`subs_${currentUserId}`, JSON.stringify(subscriptions));
}

// Get media by ID
function getMediaById(id) {
    return mediaDatabase.find(item => item.id === parseInt(id));
}

// Weighted random selection
function getRandomMedia() {
    let availableMedia = mediaDatabase.filter(item => 
        !userPreferences.dislikes.includes(item.id)
    );
    
    if (availableMedia.length === 0) {
        availableMedia = mediaDatabase;
    }
    
    const totalWeight = availableMedia.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of availableMedia) {
        if (random < item.weight) {
            return { ...item, uniqueId: `${item.id}_${Date.now()}_${Math.random()}` };
        }
        random -= item.weight;
    }
    
    return { ...availableMedia[0], uniqueId: `${availableMedia[0].id}_${Date.now()}_${Math.random()}` };
}

// Navigeer naar specifieke video op basis van URL
function navigateToVideoFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');
    
    if (videoId) {
        const media = getMediaById(videoId);
        if (media) {
            const feed = document.getElementById('feed');
            if (!feed) return false;
            
            feed.innerHTML = '';
            
            feed.appendChild(createMediaElement({ 
                ...media, 
                uniqueId: `${media.id}_${Date.now()}_${Math.random()}` 
            }));
            
            for (let i = 0; i < 4; i++) {
                feed.appendChild(createMediaElement(getRandomMedia()));
            }
            
            setTimeout(() => {
                feed.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
            
            return true;
        }
    }
    return false;
}

// Create media element
function createMediaElement(media) {
    const mediaItem = document.createElement('div');
    mediaItem.className = 'media-item';
    mediaItem.dataset.id = media.id;
    mediaItem.dataset.uniqueId = media.uniqueId;
    mediaItem.dataset.channel = media.channelId;
    
    const isSaved = savedItems.some(item => item.id === media.id);
    const isLiked = userPreferences.likes.includes(media.id);
    const isDisliked = userPreferences.dislikes.includes(media.id);
    const channelInitial = media.channel.charAt(0).toUpperCase();
    
    const shareUrl = `${WEBSITE_URL}?v=${media.id}`;
    
    mediaItem.innerHTML = `
        <div class="media-content">
            ${media.type === 'video' 
                ? `<video src="${media.url}" loop autoplay playsinline></video>`
                : `<img src="${media.url}" alt="${media.title}" loading="lazy">`
            }
            <div class="channel-info-overlay">
                <a href="kanaal.html?channel=${media.channelId}" class="channel-name-link">
                    <div class="channel-avatar-small">${channelInitial}</div>
                    <span class="channel-name-text">${media.channel}</span>
                    <span class="content-type-badge">${media.contentType || 'Real'}</span>
                </a>
                <div class="video-title">${media.title}</div>
                <div class="video-description">${media.description}</div>
            </div>
            <div class="action-buttons">
                <button class="action-btn like ${isLiked ? 'active' : ''}" onclick="handleLike(${media.id}, this)">👍</button>
                <button class="action-btn dislike ${isDisliked ? 'active' : ''}" onclick="handleDislike(${media.id}, this)">👎</button>
                <button class="action-btn save ${isSaved ? 'active' : ''}" onclick="handleSave(${JSON.stringify(media).replace(/"/g, '&quot;')}, this)">💾</button>
                <button class="action-btn share" onclick="handleShare(${media.id}, '${media.title}')">🔗</button>
            </div>
        </div>
    `;
    
    return mediaItem;
}

// Handle share
window.handleShare = function(mediaId, mediaTitle) {
    const shareUrl = `${WEBSITE_URL}?v=${mediaId}`;
    const sharePopup = document.getElementById('sharePopup');
    const shareUrlText = document.getElementById('shareUrlText');
    const whatsappLink = document.getElementById('whatsappShareLink');
    const emailLink = document.getElementById('emailShareLink');
    
    if (!sharePopup || !shareUrlText || !whatsappLink || !emailLink) return;
    
    shareUrlText.textContent = shareUrl;
    whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(mediaTitle + ' - Bekijk op Bobtop: ' + shareUrl)}`;
    emailLink.href = `mailto:?subject=${encodeURIComponent('Bobtop: ' + mediaTitle)}&body=${encodeURIComponent('Bekijk deze video op Bobtop: ' + shareUrl)}`;
    
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
};

// Handle like
window.handleLike = function(mediaId, btn) {
    const index = userPreferences.likes.indexOf(mediaId);
    if (index === -1) {
        userPreferences.likes.push(mediaId);
        btn.classList.add('active');
        
        const dislikeIndex = userPreferences.dislikes.indexOf(mediaId);
        if (dislikeIndex !== -1) {
            userPreferences.dislikes.splice(dislikeIndex, 1);
            const dislikeBtn = document.querySelector(`.media-item[data-id="${mediaId}"] .dislike`);
            if (dislikeBtn) dislikeBtn.classList.remove('active');
        }
    } else {
        userPreferences.likes.splice(index, 1);
        btn.classList.remove('active');
    }
    saveToStorage();
};

// Handle dislike
window.handleDislike = function(mediaId, btn) {
    const index = userPreferences.dislikes.indexOf(mediaId);
    if (index === -1) {
        userPreferences.dislikes.push(mediaId);
        btn.classList.add('active');
        
        const likeIndex = userPreferences.likes.indexOf(mediaId);
        if (likeIndex !== -1) {
            userPreferences.likes.splice(likeIndex, 1);
            const likeBtn = document.querySelector(`.media-item[data-id="${mediaId}"] .like`);
            if (likeBtn) likeBtn.classList.remove('active');
        }
    } else {
        userPreferences.dislikes.splice(index, 1);
        btn.classList.remove('active');
    }
    saveToStorage();
    refreshFeed();
};

// Handle save
window.handleSave = function(media, btn) {
    const index = savedItems.findIndex(item => item.id === media.id);
    if (index === -1) {
        savedItems.push(media);
        btn.classList.add('active');
    } else {
        savedItems.splice(index, 1);
        btn.classList.remove('active');
    }
    saveToStorage();
};

// Refresh feed
function refreshFeed() {
    const feed = document.getElementById('feed');
    if (!feed) return;
    
    feed.innerHTML = '';
    
    const navigated = navigateToVideoFromUrl();
    
    if (!navigated) {
        for (let i = 0; i < 5; i++) {
            const media = getRandomMedia();
            feed.appendChild(createMediaElement(media));
        }
    }
}

// Load more items
function loadMoreItems() {
    const feed = document.getElementById('feed');
    if (!feed) return;
    const media = getRandomMedia();
    feed.appendChild(createMediaElement(media));
}

// Show saved items popup
window.showSavedItems = function() {
    const popup = document.getElementById('savedPopup');
    const list = document.getElementById('savedItemsList');
    
    if (!popup || !list) return;
    
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
    const index = savedItems.findIndex(item => item.id === mediaId);
    if (index !== -1) {
        savedItems.splice(index, 1);
        saveToStorage();
        showSavedItems();
        refreshFeed();
    }
};

// Search functionality
window.searchVideos = function(query) {
    const feed = document.getElementById('feed');
    if (!feed) return;
    
    if (!query.trim()) {
        refreshFeed();
        return;
    }
    
    const filtered = mediaDatabase.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.channel.toLowerCase().includes(query.toLowerCase())
    );
    
    feed.innerHTML = '';
    
    if (filtered.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'media-item';
        emptyDiv.style.display = 'flex';
        emptyDiv.style.justifyContent = 'center';
        emptyDiv.style.alignItems = 'center';
        emptyDiv.innerHTML = '<div style="color: white; font-size: 18px;">🔍 Geen resultaten gevonden</div>';
        feed.appendChild(emptyDiv);
    } else {
        filtered.forEach(media => {
            feed.appendChild(createMediaElement({ 
                ...media, 
                uniqueId: `${media.id}_${Date.now()}_${Math.random()}` 
            }));
        });
    }
};

// Update URL
function updateUrlWithVideoId(videoId) {
    const url = new URL(window.location);
    url.searchParams.set('v', videoId);
    window.history.pushState({}, '', url);
}

// Initialize app - ALLEEN VOOR INDEX.HTML
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded - index.html pagina");
    
    // Check of we op index.html zijn
    if (!document.getElementById('feed')) {
        console.log("Geen feed element - waarschijnlijk op kanaal.html, script.js stopt hier");
        return; // Stop als we niet op index.html zijn
    }
    
    initStorage();
    
    const feed = document.getElementById('feed');
    const savedBtn = document.getElementById('savedBtn');
    const searchBtn = document.getElementById('searchBtn');
    const searchBar = document.getElementById('searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchCloseBtn = document.getElementById('searchCloseBtn');
    const closePopup = document.getElementById('closePopup');
    const closeSharePopup = document.getElementById('closeSharePopup');
    const popup = document.getElementById('savedPopup');
    const sharePopup = document.getElementById('sharePopup');
    
    // Initial feed
    refreshFeed();
    
    // Update URL when scrolling
    if (feed) {
        feed.addEventListener('scroll', function() {
            const mediaItems = document.querySelectorAll('.media-item');
            for (const item of mediaItems) {
                const rect = item.getBoundingClientRect();
                if (rect.top < 100 && rect.bottom > 100) {
                    const videoId = item.dataset.id;
                    updateUrlWithVideoId(videoId);
                    break;
            }
        }
    });
        
        // Infinite scroll
        feed.addEventListener('scroll', function() {
            if (feed.scrollTop + feed.clientHeight >= feed.scrollHeight - 100) {
                loadMoreItems();
            }
        });
        
        // Auto-play videos with sound
        feed.addEventListener('scroll', function() {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                const rect = video.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                if (isVisible) {
                    video.muted = false;
                    video.play().catch(e => {});
                } else {
                    video.pause();
                }
            });
        });
    }
    
    // Search button
    if (searchBtn && searchBar) {
        searchBtn.addEventListener('click', function() {
            searchBar.classList.toggle('hidden');
            if (!searchBar.classList.contains('hidden')) {
                searchInput.focus();
            }
        });
    }
    
    // Search close button
    if (searchCloseBtn && searchBar) {
        searchCloseBtn.addEventListener('click', function() {
            searchBar.classList.add('hidden');
            searchInput.value = '';
            refreshFeed();
        });
    }
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchVideos(e.target.value);
        });
    }
    
    // Saved button
    if (savedBtn) {
        savedBtn.addEventListener('click', showSavedItems);
    }
    
    // Close popups
    if (closePopup && popup) {
        closePopup.addEventListener('click', function() {
            popup.classList.remove('show');
        });
    }
    
    if (closeSharePopup && sharePopup) {
        closeSharePopup.addEventListener('click', function() {
            sharePopup.classList.remove('show');
        });
    }
    
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                popup.classList.remove('show');
            }
        });
    }
    
    if (sharePopup) {
        sharePopup.addEventListener('click', function(e) {
            if (e.target === sharePopup) {
                sharePopup.classList.remove('show');
            }
        });
    }
});

// Popstate handler
window.addEventListener('popstate', function(event) {
    if (document.getElementById('feed')) {
        refreshFeed();
    }
});
