// AI Media Feed - Main JavaScript
// Website: jimisdebest.github.io/tiktok/

// ==================== JOUW AI MEDIA DATABASE ====================
// HIER KUN JIJ JOUW EIGEN AI FILMPJES EN FOTO'S TOEVOEGEN!
// Geef elk item een uniek ID (1,2,3,4,5...)
// type: 'video' of 'image'
// url: JOUW DIRECTE LINK NAAR HET BESTAND
// weight: hoe vaker het getoond wordt (1 = normaal, 2 = vaker, 3 = nog vaker)
// =================================================================
const mediaDatabase = [
    {
        id: 1,
        type: 'video',
        url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        title: '🌸 AI gegenereerde bloemen',
        description: 'Prachtige bloemen gemaakt met Stable Diffusion',
        weight: 1
    },
    {
        id: 2,
        type: 'video',
        url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        title: '🎨 Abstracte kunst',
        description: 'AI kunst in beweging - generatieve animatie',
        weight: 1
    },
    {
        id: 3,
        type: 'image',
        url: 'https://picsum.photos/800/1200?random=1',
        title: '🏔️ Digitale landschappen',
        description: 'Fantastische werelden gegenereerd door AI',
        weight: 1
    },
    {
        id: 4,
        type: 'image',
        url: 'https://picsum.photos/800/1200?random=2',
        title: '🌌 Ruimte kunst',
        description: 'AI interpretatie van het universum',
        weight: 1
    },
    {
        id: 5,
        type: 'video',
        url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        title: '💧 Vloeibare dromen',
        description: 'Abstracte AI animatie met vloeiende vormen',
        weight: 1
    },
    {
        id: 6,
        type: 'image',
        url: 'https://picsum.photos/800/1200?random=3',
        title: '🦋 Fantasie wezens',
        description: 'AI gegenereerde mythische dieren',
        weight: 1
    },
    {
        id: 7,
        type: 'video',
        url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        title: '🌀 Cyberpunk stad',
        description: 'AI visie op de toekomst',
        weight: 1
    }
];

// ==================== WEBSITE INSTELLINGEN ====================
const WEBSITE_URL = 'https://jimisdebest.github.io/tiktok/'; // JOUW WEBSITE URL
// ===============================================================

// App state
let feedItems = [];
let currentUserId = 'user_' + Math.random().toString(36).substr(2, 9);
let savedItems = [];
let userPreferences = {
    likes: [],
    dislikes: []
};

// Initialize localStorage
function initStorage() {
    // Load saved items
    const saved = localStorage.getItem(`saved_${currentUserId}`);
    if (saved) {
        savedItems = JSON.parse(saved);
    }
    
    // Load preferences
    const prefs = localStorage.getItem(`prefs_${currentUserId}`);
    if (prefs) {
        userPreferences = JSON.parse(prefs);
    }
    
    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem(`saved_${currentUserId}`, JSON.stringify(savedItems));
    localStorage.setItem(`prefs_${currentUserId}`, JSON.stringify(userPreferences));
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
            // Clear feed en voeg specifieke video toe
            const feed = document.getElementById('feed');
            feed.innerHTML = '';
            
            // Voeg de specifieke video toe
            feed.appendChild(createMediaElement({ 
                ...media, 
                uniqueId: `${media.id}_${Date.now()}_${Math.random()}` 
            }));
            
            // Voeg nog 4 random videos toe om verder te scrollen
            for (let i = 0; i < 4; i++) {
                feed.appendChild(createMediaElement(getRandomMedia()));
            }
            
            // Scroll naar de eerste video
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
    
    const isSaved = savedItems.some(item => item.id === media.id);
    const isLiked = userPreferences.likes.includes(media.id);
    const isDisliked = userPreferences.dislikes.includes(media.id);
    
    // Genereer share URL
    const shareUrl = `${WEBSITE_URL}?v=${media.id}`;
    
    mediaItem.innerHTML = `
        <div class="media-content">
            <div class="media-id-badge">
                🎬 Video #${media.id}
                <span>AI</span>
            </div>
            ${media.type === 'video' 
                ? `<video src="${media.url}" loop autoplay muted playsinline></video>`
                : `<img src="${media.url}" alt="${media.title}" loading="lazy">`
            }
            <div class="media-info">
                <div class="media-title">${media.title}</div>
                <div class="media-description">${media.description}</div>
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
    
    // Set share URL text
    shareUrlText.textContent = shareUrl;
    
    // Set WhatsApp share link
    whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(mediaTitle + ' - Bekijk deze AI video: ' + shareUrl)}`;
    
    // Set Email share link
    emailLink.href = `mailto:?subject=${encodeURIComponent('AI Video: ' + mediaTitle)}&body=${encodeURIComponent('Bekijk deze AI gegenereerde video: ' + shareUrl)}`;
    
    // Copy link functionality
    const copyBtn = document.getElementById('copyShareLink');
    copyBtn.onclick = function() {
        navigator.clipboard.writeText(shareUrl).then(function() {
            // Show feedback
            const feedback = document.createElement('div');
            feedback.className = 'copy-feedback';
            feedback.textContent = '✅ Link gekopieerd naar klembord!';
            document.body.appendChild(feedback);
            
            setTimeout(() => {
                feedback.remove();
            }, 2000);
        }).catch(function() {
            alert('Kon link niet kopiëren. Selecteer en kopieer handmatig.');
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
        
        // Verwijder dislike als die er was
        const dislikeIndex = userPreferences.dislikes.indexOf(mediaId);
        if (dislikeIndex !== -1) {
            userPreferences.dislikes.splice(dislikeIndex, 1);
            // Update dislike button
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
        
        // Verwijder like als die er was
        const likeIndex = userPreferences.likes.indexOf(mediaId);
        if (likeIndex !== -1) {
            userPreferences.likes.splice(likeIndex, 1);
            // Update like button
            const likeBtn = document.querySelector(`.media-item[data-id="${mediaId}"] .like`);
            if (likeBtn) likeBtn.classList.remove('active');
        }
    } else {
        userPreferences.dislikes.splice(index, 1);
        btn.classList.remove('active');
    }
    saveToStorage();
    
    // Refresh feed
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
    feed.innerHTML = '';
    
    // Probeer te navigeren naar video uit URL
    const navigated = navigateToVideoFromUrl();
    
    if (!navigated) {
        // Voeg 5 random items toe
        for (let i = 0; i < 5; i++) {
            const media = getRandomMedia();
            feed.appendChild(createMediaElement(media));
        }
    }
}

// Load more items
function loadMoreItems() {
    const feed = document.getElementById('feed');
    const media = getRandomMedia();
    feed.appendChild(createMediaElement(media));
}

// Show saved items popup
function showSavedItems() {
    const popup = document.getElementById('savedPopup');
    const list = document.getElementById('savedItemsList');
    
    if (savedItems.length === 0) {
        list.innerHTML = '<div class="empty-state">📭 Nog geen opgeslagen items</div>';
    } else {
        list.innerHTML = savedItems.map(item => `
            <div class="saved-item">
                <div class="saved-item-thumb-container">
                    ${item.type === 'video' 
                        ? `<video src="${item.url}" class="saved-item-thumb"></video>`
                        : `<img src="${item.url}" class="saved-item-thumb">`
                    }
                    <span class="saved-item-id">#${item.id}</span>
                </div>
                <div class="saved-item-info">
                    <div class="saved-item-title">${item.title}</div>
                    <div class="saved-item-description">${item.description}</div>
                </div>
                <div class="saved-item-actions">
                    <button class="saved-item-share" onclick="handleShare(${item.id}, '${item.title}')">🔗</button>
                    <button class="saved-item-remove" onclick="removeSavedItem(${item.id})">❌</button>
                </div>
            </div>
        `).join('');
    }
    
    popup.classList.add('show');
}

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

// Update URL in browser without reload
function updateUrlWithVideoId(videoId) {
    const url = new URL(window.location);
    url.searchParams.set('v', videoId);
    window.history.pushState({}, '', url);
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initStorage();
    
    const feed = document.getElementById('feed');
    const savedBtn = document.getElementById('savedBtn');
    const closePopup = document.getElementById('closePopup');
    const closeSharePopup = document.getElementById('closeSharePopup');
    const popup = document.getElementById('savedPopup');
    const sharePopup = document.getElementById('sharePopup');
    
    // Initial feed
    refreshFeed();
    
    // Update URL when scrolling to new video
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
    
    // Auto-play/pause videos on scroll
    feed.addEventListener('scroll', function() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            const rect = video.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible) {
                video.play().catch(e => {});
            } else {
                video.pause();
            }
        });
    });
    
    // Saved button click
    savedBtn.addEventListener('click', showSavedItems);
    
    // Close popups
    closePopup.addEventListener('click', function() {
        popup.classList.remove('show');
    });
    
    closeSharePopup.addEventListener('click', function() {
        sharePopup.classList.remove('show');
    });
    
    // Close popups when clicking outside
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            popup.classList.remove('show');
        }
    });
    
    sharePopup.addEventListener('click', function(e) {
        if (e.target === sharePopup) {
            sharePopup.classList.remove('show');
        }
    });
});

// Export for use in console
window.getState = function() {
    return {
        savedItems,
        userPreferences,
        currentUserId
    };
};

// Handle browser back/forward
window.addEventListener('popstate', function() {
    refreshFeed();
});
