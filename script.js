// ---------- BOBTOP 5.0 - MET FUNNYAI-IK-GA-JE-PAKKEN.mp4 ----------
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
        weight: 1,
        baseLikes: 12400,
        baseDislikes: 320
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
        weight: 1,
        baseLikes: 8900,
        baseDislikes: 450
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
        weight: 1,
        baseLikes: 15600,
        baseDislikes: 210
    },
    // 🔥 NIEUW FUNNYAI FILMPJE - IK GA JE PAKKEN! 🔥
    {
        id: 4,
        type: 'video',
        url: 'FUNNYAI-ik-ga-je-pakken.mp4',
        channel: 'FunnyAI',
        channelId: 'funnyai',
        title: 'IK GA JE PAKKEN! 👻',
        description: 'Hilarische AI video - niet alleen kijken voor het slapen gaan',
        contentType: 'AI',
        weight: 1.8, // Vaker tonen want grappig!
        baseLikes: 34200,
        baseDislikes: 89
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
            "Dit verdient meer views",
            "IK GA JE PAKKEN! 👻",
            "FunnyAI is de beste!",
            "Niet slapen vannacht 😱",
            "Hahaha geniaal dit",
            "Echt AI? Niet te geloven",
            "Team FunnyAI! 💪"
        ];
    }
}

// Genereer random reacties voor een video
function getRandomComments() {
    if (commentsDatabase.length === 0) return [];
    
    // Random aantal tussen 1 en 45
    const numberOfComments = Math.floor(Math.random() * 45) + 1;
    
    // Maak kopie en shuffle voor unieke selectie
    const shuffled = [...commentsDatabase].sort(() => 0.5 - Math.random());
    
    // Pak unieke reacties (geen duplicates binnen 1 video)
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
    const prefixes = ['@bob', '@ai', '@video', '@tiktok', '@user', '@filmpje', '@bobtop', '@creative', '@maker', '@fan', '@funnyai', '@pakkend'];
    const suffixes = ['123', 'fan', 'lover', 'nl', 'official', 'xd', '4life', '_', '00', '69', '👻', '😂'];
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
let lastPlayedVideoId = null; // Voorkomt directe repeats
let videoPlayCount = new Map(); // Houdt bij hoe vaak video is getoond voor variatie

// Comment state per video
const videoCommentsCache = new Map();

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

// Genereer random likes (tussen 5k en 25k + eigen like)
function getRandomLikeCount(item, userLiked) {
    const base = item.baseLikes || 10000;
    const variation = Math.floor(Math.random() * 5000) - 2500;
    let count = Math.max(0, base + variation);
    if (userLiked) count += 1;
    return count.toLocaleString();
}

// Genereer random dislikes
function getRandomDislikeCount(item, userDisliked) {
    const base = item.baseDislikes || 500;
    const variation = Math.floor(Math.random() * 200) - 100;
    let count = Math.max(0, base + variation);
    if (userDisliked) count += 1;
    return count.toLocaleString();
}

// ---------- FILTER OP KANAAL ----------
function filterByChannel(channelId) {
    currentFilterChannel = channelId;
    feedEl.innerHTML = '';
    currentRenderedIds.clear();
    lastPlayedVideoId = null;
    
    showToast(`📺 Alleen @${channelId}`);
    
    for (let i = 0; i < 3; i++) {
        addItemToFeed();
    }
}

// ---------- GEWOGEN RANDOM MET DUBBELCHECK ----------
function getWeightedRandomItem() {
    let available = currentFilterChannel 
        ? videoDatabase.filter(item => item.channelId === currentFilterChannel)
        : [...videoDatabase];
    
    if (available.length === 0) {
        currentFilterChannel = null;
        available = [...videoDatabase];
    }
    
    // Als er maar 1 video is, toon die gewoon
    if (available.length === 1) {
        return available[0];
    }
    
    const prefs = getPreferences();
    const playCounts = videoPlayCount;
    
    let candidates = available.map(item => {
        let baseWeight = item.weight || 1;
        
        // Dislike = bijna nooit tonen
        const pref = prefs[item.id];
        if (pref === 'dislike') baseWeight = 0.02;
        else if (pref === 'like') baseWeight *= 2.2;
        
        // Minder kans als net gespeeld
        if (item.id === lastPlayedVideoId) {
            baseWeight *= 0.1; // 90% minder kans direct erna
        }
        
        // Minder kans als al vaak gespeeld
        const playCount = playCounts.get(item.id) || 0;
        if (playCount > 2) {
            baseWeight *= 0.7;
        }
        
        return { item, weight: Math.max(0.01, baseWeight) };
    });
    
    const total = candidates.reduce((sum, c) => sum + c.weight, 0);
    let rand = Math.random() * total;
    
    for (let c of candidates) {
        if (rand < c.weight) {
            // Update play count
            const currentCount = videoPlayCount.get(c.item.id) || 0;
            videoPlayCount.set(c.item.id, currentCount + 1);
            lastPlayedVideoId = c.item.id;
            return c.item;
        }
        rand -= c.weight;
    }
    
    // Fallback
    const fallback = available[0];
    videoPlayCount.set(fallback.id, (videoPlayCount.get(fallback.id) || 0) + 1);
    lastPlayedVideoId = fallback.id;
    return fallback;
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

// ---------- PERFECTE DIRECTE SCROLL SNAP - GEEN VERTRAGING! ----------
function setupScrollSnap() {
    let isSnapping = false;
    let lastScrollY = window.scrollY;
    let scrollDirection = 0;
    
    function checkAndSnap() {
        if (isSnapping) {
            requestAnimationFrame(checkAndSnap);
            return;
        }
        
        const feedItems = document.querySelectorAll('.feed-item');
        if (feedItems.length === 0) {
            requestAnimationFrame(checkAndSnap);
            return;
        }
        
        const viewportHeight = window.innerHeight;
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        
        if (scrollDelta > 5) scrollDirection = 1;
        else if (scrollDelta < -5) scrollDirection = -1;
        else scrollDirection = 0;
        
        lastScrollY = currentScrollY;
        
        let targetItem = null;
        let bestMatch = 0;
        
        feedItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemTop = rect.top;
            const itemBottom = rect.bottom;
            const itemHeight = rect.height;
            
            const visibleTop = Math.max(0, itemTop);
            const visibleBottom = Math.min(viewportHeight, itemBottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibleRatio = visibleHeight / itemHeight;
            
            if (scrollDirection === 1) {
                if (itemTop < viewportHeight * 0.3 && itemBottom > viewportHeight * 0.3) {
                    const score = (viewportHeight - itemTop) / viewportHeight;
                    if (score > bestMatch) {
                        bestMatch = score;
                        targetItem = item;
                    }
                }
            } else if (scrollDirection === -1) {
                if (itemBottom > 0 && itemTop < viewportHeight * 0.7) {
                    const score = itemBottom / viewportHeight;
                    if (score > bestMatch) {
                        bestMatch = score;
                        targetItem = item;
                    }
                }
            } else {
                if (visibleRatio > bestMatch) {
                    bestMatch = visibleRatio;
                    targetItem = item;
                }
            }
        });
        
        if (targetItem && bestMatch > 0.3) {
            isSnapping = true;
            
            targetItem.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            setTimeout(() => {
                isSnapping = false;
            }, 200);
        }
        
        requestAnimationFrame(checkAndSnap);
    }
    
    requestAnimationFrame(checkAndSnap);
}

// ---------- VIDEO SETUP - NOG PRECIEZER ----------
function setupVideo(video, itemDiv, mediaItem) {
    video.loop = true;
    video.muted = false;
    video.playsInline = true;
    video.preload = 'auto';
    
    let isPlaying = false;
    let playAttempted = false;
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const ratio = entry.intersectionRatio;
            const isFullyVisible = ratio > 0.7;
            
            if (isFullyVisible) {
                if (!isPlaying && !playAttempted) {
                    playAttempted = true;
                    video.play()
                        .then(() => {
                            isPlaying = true;
                            console.log(`▶️ Video ${mediaItem.id} speelt af (${Math.round(ratio*100)}% in beeld)`);
                        })
                        .catch(e => {
                            console.log('🔇 Autoplay geblokkeerd, wacht op interactie');
                            const playOnInteraction = () => {
                                video.play();
                                document.removeEventListener('click', playOnInteraction);
                                document.removeEventListener('touchstart', playOnInteraction);
                            };
                            document.addEventListener('click', playOnInteraction, { once: true });
                            document.addEventListener('touchstart', playOnInteraction, { once: true });
                        });
                }
            } else {
                if (isPlaying) {
                    video.pause();
                    isPlaying = false;
                    playAttempted = false;
                    console.log(`⏸️ Video ${mediaItem.id} gepauzeerd (${Math.round(ratio*100)}% in beeld)`);
                }
            }
        });
    }, { 
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px'
    });
    
    videoObserver.observe(video);
    
    video.onerror = () => {
        console.warn(`❌ Video ${video.src} niet geladen - overslaan`);
        itemDiv.remove();
        maybeLoadMore();
    };
    
    itemDiv._videoObserver = videoObserver;
}

// Minimale scroll listener
window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
}, { passive: true });

// ---------- COMMENTS MODAL ----------
function openCommentsModal(mediaItem) {
    if (!videoCommentsCache.has(mediaItem.id)) {
        videoCommentsCache.set(mediaItem.id, getRandomComments());
    }
    
    const comments = videoCommentsCache.get(mediaItem.id);
    const commentsList = document.getElementById('comments-list');
    
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
    
    const headerTitle = commentsModal.querySelector('h2');
    headerTitle.innerHTML = `💬 Reacties <span style="color: #999; font-size: 0.9rem;">(${comments.length})</span>`;
    
    commentsModal.classList.add('active');
    currentCommentItemId = mediaItem.id;
    
    const commentBtn = document.querySelector(`.feed-item[data-item-id="${mediaItem.id}"] .comment-btn`);
    if (commentBtn) {
        commentBtn.classList.add('active');
    }
    
    document.body.style.overflow = 'hidden';
}

// ---------- CLOSE MODALS ----------
function closeCommentsModal() {
    commentsModal.classList.remove('active');
    document.querySelectorAll('.comment-btn.active').forEach(btn => {
        btn.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
    currentCommentItemId = null;
}

function closeShareMenu() {
    shareMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ---------- FEED ITEM CREATIE ----------
function createFeedItem(mediaItem) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'feed-item';
    itemDiv.dataset.itemId = mediaItem.id;
    itemDiv.dataset.type = mediaItem.type;
    itemDiv.dataset.url = mediaItem.url;

    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'media-container';

    let mediaEl;
    if (mediaItem.type === 'video') {
        mediaEl = document.createElement('video');
        mediaEl.src = mediaItem.url;
        setupVideo(mediaEl, itemDiv, mediaItem);
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

    const channelLink = infoDiv.querySelector('.channel-link');
    channelLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        filterByChannel(mediaItem.channelId);
    });

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

    const pref = getPreference(mediaItem.id);
    const userLiked = pref === 'like';
    const userDisliked = pref === 'dislike';
    const saved = isItemSaved(mediaItem.id);
    
    const likeCountSpan = likeBtn.querySelector('.like-count');
    const dislikeCountSpan = dislikeBtn.querySelector('.dislike-count');
    const saveCountSpan = saveBtn.querySelector('.save-count');
    const commentCountSpan = commentBtn.querySelector('.comment-count');
    
    const commentCount = Math.floor(Math.random() * 45) + 1;
    commentCountSpan.textContent = commentCount;
    
    likeCountSpan.textContent = getRandomLikeCount(mediaItem, userLiked);
    dislikeCountSpan.textContent = getRandomDislikeCount(mediaItem, userDisliked);
    
    if (saved) {
        saveBtn.classList.add('saved');
        saveCountSpan.textContent = '1';
    } else {
        saveCountSpan.textContent = '0';
    }
    
    if (userLiked) {
        likeBtn.classList.add('liked');
    }
    if (userDisliked) {
        dislikeBtn.classList.add('disliked');
    }

    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        const id = Number(likeBtn.dataset.id);
        const current = getPreference(id);
        const item = videoDatabase.find(v => v.id === id);
        
        if (current === 'like') {
            setPreference(id, null);
            likeBtn.classList.remove('liked');
            likeCountSpan.textContent = getRandomLikeCount(item, false);
            showToast('❤️ Like verwijderd');
        } else {
            setPreference(id, 'like');
            likeBtn.classList.add('liked');
            likeCountSpan.textContent = getRandomLikeCount(item, true);
            
            if (current === 'dislike') {
                dislikeBtn.classList.remove('disliked');
                dislikeCountSpan.textContent = getRandomDislikeCount(item, false);
            }
            showToast('❤️ Video geliked!');
        }
    });

    dislikeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        const id = Number(dislikeBtn.dataset.id);
        const current = getPreference(id);
        const item = videoDatabase.find(v => v.id === id);
        
        if (current === 'dislike') {
            setPreference(id, null);
            dislikeBtn.classList.remove('disliked');
            dislikeCountSpan.textContent = getRandomDislikeCount(item, false);
            showToast('👎 Dislike verwijderd');
        } else {
            setPreference(id, 'dislike');
            dislikeBtn.classList.add('disliked');
            dislikeCountSpan.textContent = getRandomDislikeCount(item, true);
            
            if (current === 'like') {
                likeBtn.classList.remove('liked');
                likeCountSpan.textContent = getRandomLikeCount(item, false);
            }
            showToast('👎 Dislike geplaatst');
        }
    });

    saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
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

    commentBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        openCommentsModal(mediaItem);
    });

    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        currentShareItemId = mediaItem.id;
        openShareMenu(mediaItem);
    });

    itemDiv.appendChild(actionButtons);
    return itemDiv;
}

// ---------- SHARE MENU ----------
function openShareMenu(mediaItem) {
    shareMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    
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
        closeShareMenu();
        showToast('📤 Gedeeld via WhatsApp');
    });
    
    newCopy.addEventListener('click', async () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}?video=${mediaItem.id}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            showToast('🔗 Link gekopieerd naar klembord');
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = shareUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('🔗 Link gekopieerd');
        }
        closeShareMenu();
    });
    
    newClose.addEventListener('click', closeShareMenu);
}

// ---------- MODAL EVENT LISTENERS ----------
shareMenu.addEventListener('click', (e) => {
    if (e.target === shareMenu) {
        closeShareMenu();
    }
});

commentsModal.addEventListener('click', (e) => {
    if (e.target === commentsModal) {
        closeCommentsModal();
    }
});

document.querySelector('.close-comments')?.addEventListener('click', closeCommentsModal);
document.querySelector('.close-comments-btn')?.addEventListener('click', closeCommentsModal);

// ---------- INFINITE SCROLL ----------
let isLoading = false;
let pendingLoad = false;

function addItemToFeed() {
    if (isLoading) return;
    isLoading = true;
    
    const item = getWeightedRandomItem();
    
    const lastItem = feedEl.lastChild;
    if (lastItem && lastItem.dataset.itemId == item.id) {
        console.log('⚠️ Dubbele video voorkomen, probeer opnieuw');
        isLoading = false;
        setTimeout(() => addItemToFeed(), 50);
        return;
    }

    const feedItem = createFeedItem(item);
    feedEl.appendChild(feedItem);
    currentRenderedIds.add(item.id);
    loadedItemCount++;
    
    setTimeout(() => {
        isLoading = false;
        if (pendingLoad) {
            pendingLoad = false;
            maybeLoadMore();
        }
    }, 300);
}

function maybeLoadMore() {
    if (isLoading) {
        pendingLoad = true;
        return;
    }
    addItemToFeed();
}

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        maybeLoadMore();
    }
}, { 
    threshold: 0.1,
    rootMargin: '100px'
});
observer.observe(sentinel);

// ---------- CLEANUP ----------
function cleanupObservers() {
    document.querySelectorAll('.feed-item').forEach(item => {
        if (item._videoObserver) {
            item._videoObserver.disconnect();
        }
    });
}

// ---------- INIT ----------
async function initFeed() {
    await loadComments();
    setupScrollSnap();
    
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video');
    
    if (videoId) {
        const found = videoDatabase.find(v => v.id === Number(videoId));
        if (found) {
            const feedItem = createFeedItem(found);
            feedEl.appendChild(feedItem);
            currentRenderedIds.add(found.id);
            loadedItemCount++;
            
            setTimeout(() => {
                feedItem.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
    
    for (let i = 0; i < 3; i++) {
        addItemToFeed();
    }
}

initFeed();

window.addEventListener('beforeunload', cleanupObservers);
