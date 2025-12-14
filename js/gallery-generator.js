// Gallery Generator - Loads gallery data from JSON and generates dynamic HTML

async function loadMahaYagyaGallery() {
    try {
        // Fetch gallery data from JSON - try relative and absolute paths as fallback
        let response = null;
        const pathsToTry = ['./data/mahayagya-gallery.json', '/data/mahayagya-gallery.json', 'data/mahayagya-gallery.json'];
        let lastError = null;
        const attempts = [];
        for (const p of pathsToTry) {
            try {
                response = await fetch(p);
                attempts.push({ path: p, ok: !!(response && response.ok), status: response ? response.status : null });
                if (response && response.ok) break;
                lastError = new Error('HTTP ' + (response ? response.status : 'no response') + ' for ' + p);
            } catch (err) {
                attempts.push({ path: p, ok: false, error: err.message || String(err) });
                lastError = err;
            }
        }

        if (!response || !response.ok) {
            // attach attempts details to lastError for better diagnostics
            lastError = lastError || new Error('Failed to fetch gallery JSON');
            lastError.attempts = attempts;
            throw lastError;
        }

        const data = await response.json();

        // Validate JSON structure
        if (!data || !Array.isArray(data.gallery)) {
            throw new Error('Invalid gallery data format');
        }

        // Generate and render gallery HTML
        const galleryHTML = generateGalleryHTML(data.gallery);
        
        // Insert into the gallery container
        const galleryContainer = document.getElementById('mahayagya-gallery-container');
        if (galleryContainer) {
            galleryContainer.innerHTML = galleryHTML;
        }
        
        // Re-initialize lightbox after gallery loads
        callInitializeLightboxSafely();
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        const container = document.getElementById('mahayagya-gallery-container');
        if (container) {
            const msg = (error && error.message) ? error.message : 'Error loading gallery. Please try again later.';
            let details = '';
            if (error && error.attempts && Array.isArray(error.attempts)) {
                details = '<ul style="margin-top:8px;">' + error.attempts.map(a => {
                    if (a.error) return `<li>${escapeHTML(a.path)} - error: ${escapeHTML(a.error)}</li>`;
                    return `<li>${escapeHTML(a.path)} - status: ${escapeHTML(String(a.status))}</li>`;
                }).join('') + '</ul>';
            }
            container.innerHTML = `<div class="alert alert-danger">${escapeHTML(msg)}${details}</div>`;
        }
    }
}

function generateGalleryHTML(galleryItems) {
    let html = '<div class="row g-4">';
    
    galleryItems.forEach((item, index) => {
        const carouselId = `carousel-${item.id}`;
        const hasMultipleMedia = item.media.length > 1;
        
        let mediaHTML = '';
        
        if (hasMultipleMedia) {
            // Generate carousel for items with multiple media
            mediaHTML = generateCarouselHTML(item, carouselId);
        } else {
            // Single media (image or video)
            mediaHTML = generateSingleMediaHTML(item.media[0]);
        }
        
        // Create gallery card
        html += `
            <div class="col-md-6 col-lg-4">
                <div class="gallery-card card h-100 shadow-sm">
                    <div class="gallery-media position-relative">
                        ${mediaHTML}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${escapeHTML(item.title)}</h5>
                        <p class="card-text small">${escapeHTML(item.text)}</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function generateSingleMediaHTML(media) {
    if (media.type === 'image') {
        return `<img src="${media.src}" alt="Gallery Item" class="card-img-top" style="height: 250px; object-fit: cover; border-radius: 8px 8px 0 0;">`;
    } else if (media.type === 'video') {
        return `
            <video width="100%" height="250" controls style="background-color: #000; border-radius: 8px 8px 0 0;">
                <source src="${media.src}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    }
    return '';
}

function generateCarouselHTML(item, carouselId) {
    let html = `
        <div id="${carouselId}" class="carousel slide" data-bs-interval="false">
            <div class="carousel-inner">
    `;
    
    // Generate carousel items
    item.media.forEach((media, index) => {
        const activeClass = index === 0 ? 'active' : '';
        let mediaElement = '';
        
        if (media.type === 'image') {
            mediaElement = `<img src="${media.src}" alt="Gallery Item ${index + 1}" class="card-img-top" style="height: 250px; object-fit: cover; border-radius: 8px 8px 0 0;">`;
        } else if (media.type === 'video') {
            mediaElement = `
                <video width="100%" height="250" controls style="background-color: #000; border-radius: 8px 8px 0 0;">
                    <source src="${media.src}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
        }
        
        html += `
                <div class="carousel-item ${activeClass}">
                    ${mediaElement}
                </div>
        `;
    });
    
    html += `
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev" style="width: 30px; height: 30px; top: 50%; transform: translateY(-50%); left: 5px;">
                <i class="fas fa-chevron-left text-white"></i>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next" style="width: 30px; height: 30px; top: 50%; transform: translateY(-50%); right: 5px;">
                <i class="fas fa-chevron-right text-white"></i>
            </button>
            <div style="position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">1 / ${item.media.length}</div>
        </div>
    `;
    
    return html;
}

function escapeHTML(text) {
    if (text === null || text === undefined) return '';
    text = String(text);
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Load gallery when DOM is ready
document.addEventListener('DOMContentLoaded', loadMahaYagyaGallery);

// Safely call initializeLightbox when it's available.
function callInitializeLightboxSafely() {
    try {
        if (typeof initializeLightbox === 'function') {
            initializeLightbox();
            return;
        }
    } catch (e) {
        // ignore and fall through to polling
    }

    let attempts = 0;
    const maxAttempts = 30; // ~3 seconds
    const interval = setInterval(() => {
        if (typeof initializeLightbox === 'function') {
            clearInterval(interval);
            try { initializeLightbox(); } catch (e) { console.error('Error calling initializeLightbox:', e); }
            return;
        }
        attempts++;
        if (attempts >= maxAttempts) {
            clearInterval(interval);
            console.warn('initializeLightbox was not available after waiting.');
        }
    }, 100);
}

// ============================================================================
// LIGHTBOX FUNCTIONALITY - Manages full-screen image viewing with navigation
// ============================================================================

let currentImageIndex = 0;
let galleryImages = [];

// Initialize lightbox: build image list and attach delegated handlers once
function initializeLightbox() {
    // Build the current gallery image list
    galleryImages = Array.from(document.querySelectorAll('.gallery-card img')).map((img, index) => ({
        src: img.src,
        title: (img.closest('.gallery-card') && img.closest('.gallery-card').querySelector('.card-title')) ? img.closest('.gallery-card').querySelector('.card-title').textContent.trim() : (img.alt || 'Image ' + (index + 1))
    }));
    // Expose for other scripts (backwards compatibility)
    try { window.galleryImages = galleryImages; } catch (e) {}

    // Guard: ensure we only bind delegated click handler once
    if (!initializeLightbox._bound) {
        // Delegated click handler for gallery images
        document.body.addEventListener('click', function (e) {
            const t = e.target;
            if (t && t.matches && t.matches('.gallery-card img')) {
                e.preventDefault();
                // Rebuild galleryImages to ensure index matches current DOM
                galleryImages = Array.from(document.querySelectorAll('.gallery-card img')).map((img, index) => ({ src: img.src, title: (img.closest('.gallery-card') && img.closest('.gallery-card').querySelector('.card-title')) ? img.closest('.gallery-card').querySelector('.card-title').textContent.trim() : (img.alt || 'Image ' + (index + 1)) }));
                try { window.galleryImages = galleryImages; } catch (e) {}
                const imgs = Array.from(document.querySelectorAll('.gallery-card img'));
                currentImageIndex = imgs.indexOf(t);
                try { window.currentImageIndex = currentImageIndex; } catch (e) {}
                if (typeof openLightbox === 'function') {
                    openLightbox(galleryImages[currentImageIndex] || { src: t.src, title: t.alt });
                }
            }
        });

        // Close on overlay click
        const overlay = document.getElementById('lightbox-overlay');
        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === this) closeLightbox();
            });
        }

        // Prev/Next/Close bindings
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
        if (nextBtn) nextBtn.addEventListener('click', showNextImage);

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            const overlayEl = document.getElementById('lightbox-overlay');
            if (overlayEl && overlayEl.classList.contains('active')) {
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'Escape') closeLightbox();
            }
        });

        initializeLightbox._bound = true;
    }
}

function openLightbox(image) {
    if (!image || !image.src) return;
    const imgEl = document.getElementById('lightbox-image');
    const titleEl = document.getElementById('lightbox-title');
    const overlay = document.getElementById('lightbox-overlay');
    if (imgEl && titleEl && overlay) {
        imgEl.src = image.src;
        titleEl.textContent = image.title || '';
        updateCounter();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        try { window.currentImageIndex = currentImageIndex; } catch (e) {}
        try { window.galleryImages = galleryImages; } catch (e) {}
    }
}

function closeLightbox() {
    const overlay = document.getElementById('lightbox-overlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showNextImage() {
    if (!galleryImages || galleryImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    try { window.currentImageIndex = currentImageIndex; } catch (e) {}
    openLightbox(galleryImages[currentImageIndex]);
}

function showPrevImage() {
    if (!galleryImages || galleryImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    try { window.currentImageIndex = currentImageIndex; } catch (e) {}
    openLightbox(galleryImages[currentImageIndex]);
}

function updateCounter() {
    const counterEl = document.getElementById('lightbox-counter');
    if (!counterEl) return;
    const total = (galleryImages && galleryImages.length) ? galleryImages.length : 1;
    const current = (typeof currentImageIndex === 'number') ? (currentImageIndex + 1) : 1;
    counterEl.textContent = `${current} / ${total}`;
}

// Initialize when page loads and when Activities page is opened
document.addEventListener('DOMContentLoaded', initializeLightbox);

// Reinitialize lightbox when navigating to activities page (safe call)
const originalNavigateTo = typeof navigateTo !== 'undefined' ? navigateTo : null;
if (originalNavigateTo) {
    window.navigateTo = function (page) {
        originalNavigateTo(page);
        setTimeout(() => {
            try { initializeLightbox(); } catch (e) { console.error('init lightbox:', e); }
        }, 100);
    };
}
