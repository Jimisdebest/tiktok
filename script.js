// ---------- BOBTOP 3.0 - MET COMMENTS UIT REACTIES.TXT, EMOJIS, GELUID ----------
const videoDatabase = [
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

// ---------- REACTIES UIT REACTIES.TXT ----------
let commentsDatabase = [];

// Laad reacties uit txt bestand
async function loadComments() {
    try {
        const response = await fetch('reacties.txt');
        const text = await response.text();
        commentsDatabase = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        console.log(`📝 ${commentsDatabase.length} reacties geladen`);
    } catch (error) {
        console.warn('⚠️ reacties.txt niet gevonden, gebruik standaard reacties');
        commentsDatabase = [
            "Dit is echt top gemaakt! 🔥",
            "Eerste! 🙋‍♂️",
            "Hoe lang ben je hiermee bezig geweest?",
            "😂😂😂 geweldig",
            "Eindelijk normaal commentaar",
            "Like voor deel 2!",
            "AI wordt steeds beter zeg",
            "Dit verdient meer views"
        ];
    }
}

// Genereer random reacties voor een video
function getRandomComments() {
    if (commentsDatabase.length === 0) return [];
    
    // Random aantal tussen 1 en 45
    const numberOfComments = Math.floor(Math.random() * 45) + 1;
    
    // Maak kopie en shuffle
    const shuffled = [...commentsDatabase].sort(() => 0.5 - Math.random());
    
    // Pak unieke reacties (geen duplicates)
    const selected = shuffled.slice(0, Math.min(numberOfComments, commentsDatabase.length));
    
    // Genereer gebruikers en tijden
    return selected.map((text, index) => ({
        id: index,
        text: text,
        author: generateUsername(),
        avatar: text[0].toUpperCase(),
        time: getRandomTime(),
        likes: Math.floor(Math.random() * 150),
        verified: Math.random() > 0.7
    }));
}

// Genereer random gebruikersnaam
function generateUsername() {
    const prefixes = ['@bob', '@ai', '@video', '@tiktok', '@user', '@filmpje', '@bobtop', '@creative', '@maker', '@fan'];
    const suffixes = ['123', 'fan', 'lover', 'nl', 'official', 'xd', '4life', '_', '00', '69'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return prefix + suffix + Math.floor(Math.random() * 100);
}

// Genereer random tijd
function getRandomTime() {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const days = Math.floor(Math.random() * 7);
    
    if (days === 0) return `${hours}u geleden`;
    if (days === 1) return 'Gisteren';
    return `${days} dagen geleden`;
}

// ---------- STORAGE & STATE ----------
const STORAGE_KEY = 'bobtop_saved_items';
const LIKE_DISLIKE_KEY = 'bobtop_preferences';
let currentFilterChannel = null;
let activeVideos = [];

// Comment state per video
const videoCommentsCache = new Map(); // itemId -> comments array

// ---------- HELPER FUNCTIES ----------
function getSavedItems() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}

function saveItemLocally(itemId) {
    let saved = getSavedItems();
    if (!saved.includes(itemId)) {
        saved.push(itemId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
    return saved;
}

function unsaveItemLocally(itemId) {
    let saved = getSavedItems().filter(id => id !== itemId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return saved;
}

function isItemSaved(itemId) {
    return getSavedItems().includes(itemId);
}

function getPreferences() {
    try { return JSON.parse(localStorage.getItem(LIKE_DISLIKE_KEY)) || {}; } catch { return {}; }
}

function setPreference(itemId, type) {
    const prefs = getPreferences();
    if (type === null) delete prefs[itemId];
    else prefs[itemId] = type;
    localStorage.setItem(LIKE_DISLIKE_KEY, JSON.stringify(prefs));
}

function getPreference(itemId) {
    return getPreferences()[itemId] || null;
}

// ---------- FILTER OP KANAAL ----------
function filterByChannel(channelId) {
    currentFilterChannel = channelId;
    feedEl.innerHTML = '';
    currentRenderedIds.clear();
    loadedItemCount = 0;
    
    showToast(`📺 Alleen @${channelId}`);
    
    for (let i = 0; i < 3; i++) {
        addItemToFeed();
    }
}

// ---------- GEWOGEN RANDOM ----------
function getWeightedRandomItem() {
    let available = currentFilterChannel 
        ? videoDatabase.filter(item => item.channelId === currentFilterChannel)
        : [...videoDatabase];
    
    if (available.length === 0) {
        currentFilterChannel = null;
        available = [...videoDatabase];
    }
    
    const prefs = getPreferences();
    let candidates = available.map(item => {
        let baseWeight = item.weight || 1;
        const pref = prefs[item.id];
        if (pref === 'dislike') baseWeight = 0.02;
        else if (pref === 'like') baseWeight *= 2.2;
        return { item, weight: baseWeight };
    });
    
    const total = candidates.reduce((sum, c) => sum + Math.max(0.01, c.weight), 0);
    let rand = Math.random() * total;
    for (let c of candidates) {
        if (rand < c.weight) return c.item;
        rand -= c.weight;
    }
    return candidates[0]?.item || available[0];
}

// ---------- FEED & SCROLL ----------
let loadedItemCount = 0;
let currentRenderedIds = new Set();
const feedEl = document.getElementById('feed');
const sentinel = document.getElementById('sentinel');
const actionPanelTemplate = document.getElementById('action-panel-template').innerHTML;
const shareMenu = document.getElementById('share-menu');
const commentsModal = document.getElementById('comments-modal');
let currentShareItemId = null;
let currentCommentItemId = null;

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2300);
}

// ---------- VIDEO SETUP ----------
function setupVideo(video, itemDiv) {
    video.loop = true;
    video.muted = false;
    video.playsInline = true;
    video.preload = 'auto';
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.currentTime = 0;
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.6 });
    
    videoObserver.observe(video);
    
    video.onerror = () => {
        console.warn(`Video ${video.src} niet geladen`);
        itemDiv.remove();
        maybeLoadMore();
    };
}

// ---------- COMMENTS MODAL ----------
function openCommentsModal(mediaItem) {
    // Genereer of haal comments uit cache
    if (!videoCommentsCache.has(mediaItem.id)) {
        videoCommentsCache.set(mediaItem.id, getRandomComments());
    }
    
    const comments = videoCommentsCache.get(mediaItem.id);
    const commentsList = document.getElementById('comments-list');
    
    // Bouw comments HTML
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-avatar">${comment.avatar}</div>
            <div class="comment-body">
                <div class="comment-author">
                    ${comment.author}
                    ${comment.verified ? '<span style="color: #3897f0;"> ✓</span>' : ''}
                    <span class="comment-time">${comment.time}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions">
                    <span class="comment-likes">❤️ ${comment.likes}</span>
                    <span>💬 Antwoorden</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update header met aantal comments
    const headerTitle = commentsModal.querySelector('h2');
    headerTitle.innerHTML = `💬 Reacties <span style="color: #999; font-size: 0.9rem;">(${comments.length})</span>`;
    
    // Toon modal
    commentsModal.classList.add('active');
    currentCommentItemId = mediaItem.id;
    
    // Highlight comment button
    const commentBtn = document.querySelector(`.feed-item[data-item-id="${mediaItem.id}"] .comment-btn`);
    if (commentBtn) {
        commentBtn.classList.add('active');
    }
}

// ---------- FEED ITEM CREATIE ----------
function createFeedItem(mediaItem) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'feed-item';
    itemDiv.dataset.itemId = mediaItem.id;
    itemDiv.dataset.type = mediaItem.type;
    itemDiv.dataset.url = mediaItem.url;

    // Media container
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'media-container';

    let mediaEl;
    if (mediaItem.type === 'video') {
        mediaEl = document.createElement('video');
        mediaEl.src = mediaItem.url;
        setupVideo(mediaEl, itemDiv);
    } else {
        mediaEl = document.createElement('img');
        mediaEl.src = mediaItem.url;
        mediaEl.alt = mediaItem.title || 'AI afbeelding';
        mediaEl.loading = 'lazy';
        mediaEl.onerror = () => {
            console.warn(`Afbeelding ${mediaItem.url} niet gevonden`);
            itemDiv.remove();
            maybeLoadMore();
        };
    }

    mediaContainer.appendChild(mediaEl);
    itemDiv.appendChild(mediaContainer);

    // Info + klikbaar kanaal
    const infoDiv = document.createElement('div');
    infoDiv.className = 'item-info';
    infoDiv.innerHTML = `
        <div class="channel-name">
            <a href="#" class="channel-link" data-channel-id="${mediaItem.channelId}">
                @${mediaItem.channelId || mediaItem.channel}
            </a>
            <span class="content-badge">${mediaItem.contentType || 'AI'}</span>
        </div>
        <div class="title-description">
            <strong>${mediaItem.title || ''}</strong> ${mediaItem.description ? '· ' + mediaItem.description : ''}
        </div>
    `;
    itemDiv.appendChild(infoDiv);

    // Kanaal click
    const channelLink = infoDiv.querySelector('.channel-link');
    channelLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        filterByChannel(mediaItem.channelId);
    });

    // Actieknoppen
    const actionsDiv = document.createElement('div');
    actionsDiv.innerHTML = actionPanelTemplate;
    const actionButtons = actionsDiv.firstElementChild.cloneNode(true);
    
    const likeBtn = actionButtons.querySelector('.like-btn');
    const dislikeBtn = actionButtons.querySelector('.dislike-btn');
    const saveBtn = actionButtons.querySelector('.save-btn');
    const commentBtn = actionButtons.querySelector('.comment-btn');
    const shareBtn = actionButtons.querySelector('.share-btn');
    
    likeBtn.dataset.id = mediaItem.id;
    dislikeBtn.dataset.id = mediaItem.id;
    saveBtn.dataset.id = mediaItem.id;
    commentBtn.dataset.id = mediaItem.id;
    shareBtn.dataset.id = mediaItem.id;

    // Counts & states
    const likeCountSpan = likeBtn.querySelector('.like-count');
    const dislikeCountSpan = dislikeBtn.querySelector('.dislike-count');
    const saveCountSpan = saveBtn.querySelector('.save-count');
    const commentCountSpan = commentBtn.querySelector('.comment-count');
    
    // Comment count (random tussen 1-45)
    const commentCount = Math.floor(Math.random() * 45) + 1;
    commentCountSpan.textContent = commentCount;
    
    // Like/dislike states
    const pref = getPreference(mediaItem.id);
    if (pref === 'like') {
        likeBtn.classList.add('liked');
        likeCountSpan.textContent = '1';
    } else likeCountSpan.textContent = '0';
    
    if (pref === 'dislike') {
        dislikeBtn.classList.add('disliked');
        dislikeCountSpan.textContent = '1';
    } else dislikeCountSpan.textContent = '0';
    
    const saved = isItemSaved(mediaItem.id);
    if (saved) {
        saveBtn.classList.add('saved');
        saveCountSpan.textContent = '1';
    } else saveCountSpan.textContent = '0';

    // EVENT LISTENERS
    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(likeBtn.dataset.id);
        const current = getPreference(id);
        if (current === 'like') {
            setPreference(id, null);
            likeBtn.classList.remove('liked');
            likeCountSpan.textContent = '0';
            showToast('❤️ Like verwijderd');
        } else {
            setPreference(id, 'like');
            likeBtn.classList.add('liked');
            likeCountSpan.textContent = '1';
            if (current === 'dislike') {
                dislikeBtn.classList.remove('disliked');
                dislikeCountSpan.textContent = '0';
            }
            showToast('❤️ Video geliked!');
        }
    });

    dislikeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(dislikeBtn.dataset.id);
        const current = getPreference(id);
        if (current === 'dislike') {
            setPreference(id, null);
            dislikeBtn.classList.remove('disliked');
            dislikeCountSpan.textContent = '0';
            showToast('👎 Dislike verwijderd');
        } else {
            setPreference(id, 'dislike');
            dislikeBtn.classList.add('disliked');
            dislikeCountSpan.textContent = '1';
            if (current === 'like') {
                likeBtn.classList.remove('liked');
                likeCountSpan.textContent = '0';
            }
            showToast('👎 Dislike geplaatst');
        }
    });

    saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(saveBtn.dataset.id);
        const isSaved = isItemSaved(id);
        if (isSaved) {
            unsaveItemLocally(id);
            saveBtn.classList.remove('saved');
            saveCountSpan.textContent = '0';
            showToast('❌ Verwijderd uit opgeslagen');
        } else {
            saveItemLocally(id);
            saveBtn.classList.add('saved');
            saveCountSpan.textContent = '1';
            showToast('✅ Opgeslagen in Bobtop-lijst');
        }
    });

    // COMMENT KNOP
    commentBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openCommentsModal(mediaItem);
    });

    // SHARE KNOP
    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentShareItemId = mediaItem.id;
        openShareMenu(mediaItem);
    });

    itemDiv.appendChild(actionButtons);
    return itemDiv;
}

// ---------- SHARE MENU ----------
function openShareMenu(mediaItem) {
    shareMenu.classList.add('active');
    
    const whatsappBtn = document.getElementById('share-whatsapp');
    const copyBtn = document.getElementById('share-copy');
    const closeBtn = shareMenu.querySelector('.share-close');
    
    const newWhatsapp = whatsappBtn.cloneNode(true);
    const newCopy = copyBtn.cloneNode(true);
    const newClose = closeBtn.cloneNode(true);
    whatsappBtn.parentNode.replaceChild(newWhatsapp, whatsappBtn);
    copyBtn.parentNode.replaceChild(newCopy, copyBtn);
    shareMenu.querySelector('.share-close').replaceWith(newClose);
    
    newWhatsapp.addEventListener('click', () => {
        const text = `📱 Check dit filmpje op Bobtop: ${mediaItem.title} door @${mediaItem.channelId}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        shareMenu.classList.remove('active');
        showToast('📤 Gedeeld via WhatsApp');
    });
    
    newCopy.addEventListener('click', () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}?video=${mediaItem.id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast('🔗 Link gekopieerd naar klembord');
            shareMenu.classList.remove('active');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = shareUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('🔗 Link gekopieerd');
            shareMenu.classList.remove('active');
        });
    });
    
    newClose.addEventListener('click', () => {
        shareMenu.classList.remove('active');
    });
}

// ---------- CLOSE MODALS ----------
shareMenu.addEventListener('click', (e) => {
    if (e.target === shareMenu) {
        shareMenu.classList.remove('active');
    }
});

commentsModal.addEventListener('click', (e) => {
    if (e.target === commentsModal) {
        commentsModal.classList.remove('active');
        // Remove active state from comment buttons
        document.querySelectorAll('.comment-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });
    }
});

// Close comments buttons
document.querySelector('.close-comments')?.addEventListener('click', () => {
    commentsModal.classList.remove('active');
    document.querySelectorAll('.comment-btn.active').forEach(btn => {
        btn.classList.remove('active');
    });
});

document.querySelector('.close-comments-btn')?.addEventListener('click', () => {
    commentsModal.classList.remove('active');
    document.querySelectorAll('.comment-btn.active').forEach(btn => {
        btn.classList.remove('active');
    });
});

// ---------- INFINITE SCROLL ----------
let isLoading = false;
function addItemToFeed() {
    let item = getWeightedRandomItem();
    
    const lastTwoIds = Array.from(currentRenderedIds).slice(-2);
    let attempts = 0;
    while (lastTwoIds.includes(item.id) && attempts < 20) {
        item = getWeightedRandomItem();
        attempts++;
    }

    const feedItem = createFeedItem(item);
    feedEl.appendChild(feedItem);
    currentRenderedIds.add(item.id);
    loadedItemCount++;
}

function maybeLoadMore() {
    if (isLoading) return;
    isLoading = true;
    addItemToFeed();
    setTimeout(() => { isLoading = false; }, 300);
}

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        maybeLoadMore();
    }
}, { threshold: 0.1 });
observer.observe(sentinel);

// ---------- SCROLL SNAP ----------
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const feedItems = document.querySelectorAll('.feed-item');
        if (feedItems.length === 0) return;
        
        const viewportHeight = window.innerHeight;
        let bestItem = null;
        let bestVisibility = 0;
        
        feedItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
            if (visibleHeight > bestVisibility) {
                bestVisibility = visibleHeight;
                bestItem = item;
            }
        });
        
        if (bestItem && bestVisibility > viewportHeight * 0.4) {
            bestItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
});

// ---------- INIT ----------
async function initFeed() {
    await loadComments();
    
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video');
    
    if (videoId) {
        const found = videoDatabase.find(v => v.id === Number(videoId));
        if (found) {
            const feedItem = createFeedItem(found);
            feedEl.appendChild(feedItem);
            currentRenderedIds.add(found.id);
            loadedItemCount++;
        }
    }
    
    for (let i = 0; i < 2; i++) {
        addItemToFeed();
    }
}

// Start de applicatie
initFeed();
