// ---------- PERFECTE DIRECTE SCROLL SNAP - GEEN VERTRAGING! ----------
function setupScrollSnap() {
    let isSnapping = false;
    let lastScrollY = window.scrollY;
    let scrollDirection = 0; // -1 = omhoog, 1 = omlaag, 0 = geen
    
    // Gebruik requestAnimationFrame voor vloeiende, directe snaps
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
        
        // Bepaal scroll richting
        if (scrollDelta > 5) scrollDirection = 1; // Omlaag
        else if (scrollDelta < -5) scrollDirection = -1; // Omhoog
        else scrollDirection = 0;
        
        lastScrollY = currentScrollY;
        
        // Vind de beste video om naar te snappen
        let targetItem = null;
        let bestMatch = 0;
        
        feedItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const itemTop = rect.top;
            const itemBottom = rect.bottom;
            const itemHeight = rect.height;
            
            // Hoeveel pixels zijn zichtbaar?
            const visibleTop = Math.max(0, itemTop);
            const visibleBottom = Math.min(viewportHeight, itemBottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibleRatio = visibleHeight / itemHeight;
            
            // SCROLL OMLAAG: pak de video die het meeste onderin beeld is
            if (scrollDirection === 1) {
                // Als we omlaag scrollen, kijk naar video's die onderin beeld komen
                if (itemTop < viewportHeight * 0.3 && itemBottom > viewportHeight * 0.3) {
                    const score = (viewportHeight - itemTop) / viewportHeight;
                    if (score > bestMatch) {
                        bestMatch = score;
                        targetItem = item;
                    }
                }
            } 
            // SCROLL OMHOOG: pak de video die het meeste bovenin beeld is
            else if (scrollDirection === -1) {
                // Als we omhoog scrollen, kijk naar video's die bovenin beeld komen
                if (itemBottom > 0 && itemTop < viewportHeight * 0.7) {
                    const score = itemBottom / viewportHeight;
                    if (score > bestMatch) {
                        bestMatch = score;
                        targetItem = item;
                    }
                }
            }
            // GEEN DUIDELIJKE RICHTING: pak de video met meeste zichtbaarheid
            else {
                if (visibleRatio > bestMatch) {
                    bestMatch = visibleRatio;
                    targetItem = item;
                }
            }
        });
        
        // SNAP! - maar alleen als we een goede kandidaat hebben
        if (targetItem && bestMatch > 0.3) { // 30% zichtbaar is genoeg voor snap
            isSnapping = true;
            
            targetItem.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Reset snap flag na animatie
            setTimeout(() => {
                isSnapping = false;
            }, 200);
        }
        
        requestAnimationFrame(checkAndSnap);
    }
    
    // Start de animation frame loop
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
    
    // SUPER PRECIEZE INTERSECTION OBSERVER
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const ratio = entry.intersectionRatio;
            const isFullyVisible = ratio > 0.7; // 70% of meer in beeld
            
            if (isFullyVisible) {
                // Video is genoeg in beeld - STARTEN MAAR!
                if (!isPlaying && !playAttempted) {
                    playAttempted = true;
                    video.play()
                        .then(() => {
                            isPlaying = true;
                            console.log(`▶️ Video ${mediaItem.id} speelt af (${Math.round(ratio*100)}% in beeld)`);
                        })
                        .catch(e => {
                            console.log('🔇 Autoplay geblokkeerd, wacht op interactie');
                            // Eénmalige click listener
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
                // Video is niet genoeg in beeld - PAUZEREN
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
    
    // Error handling
    video.onerror = () => {
        console.warn(`❌ Video ${video.src} niet geladen - overslaan`);
        itemDiv.remove();
        maybeLoadMore();
    };
    
    // Sla observer op voor cleanup
    itemDiv._videoObserver = videoObserver;
}

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
}, { passive: true });
