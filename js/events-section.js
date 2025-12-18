// Events Section Script
// Handles loading and displaying events collage list

// Cache for events data
let eventsDataCache = null;

async function loadEventsList() {
    try {
        if (!eventsDataCache) {
            const response = await fetch('./data/events.json');
            if (!response.ok) {
                throw new Error(`Failed to load events: ${response.statusText}`);
            }
            eventsDataCache = await response.json();
        }

        const data = eventsDataCache;

        if (!data.events || !Array.isArray(data.events)) {
            throw new Error('Invalid events data format');
        }

        let html = '';
        data.events.forEach(event => {
            // Collage Grid Images (first 5)
            const collageImgs = event.collageImages || [];
            let collageGridHTML = '';

            // Generate grid items
            for (let i = 0; i < Math.min(5, collageImgs.length); i++) {
                const img = collageImgs[i];
                let src = img.type === 'image' ? img.src : 'images/video-placeholder.jpg';

                collageGridHTML += `
                    <div class="collage-item collage-item-${i}">
                        <img src="${src}" alt="Event Highlight" loading="lazy">
                    </div>
                `;
            }

            html += `
                <div class="event-collage-card mb-5">
                    <a href="#" onclick="openEventDetails('${event.id}'); return false;" class="text-decoration-none event-link-wrapper">
                        <div class="event-header d-flex justify-content-between align-items-end mb-3">
                            <div class="event-title-group">
                                <h3 class="event-title mb-1">${escapeHTML(event.title)}</h3>
                                <p class="event-date mb-0 text-muted"><i class="far fa-calendar-alt me-2"></i>${escapeHTML(event.date)}</p>
                            </div>
                            <div class="event-action">
                                <span class="btn btn-outline-primary btn-sm rounded-pill">View Album <i class="fas fa-arrow-right ms-1"></i></span>
                            </div>
                        </div>
                        
                        <div class="collage-grid">
                            ${collageGridHTML}
                        </div>
                    </a>
                </div>
            `;
        });

        const container = document.getElementById('events-container');
        if (container) {
            container.innerHTML = html;
        }

    } catch (error) {
        console.error('Error loading events:', error);
        const container = document.getElementById('events-container');
        if (container) {
            container.innerHTML = `<div class="alert alert-danger">Error loading events: ${escapeHTML(error.message)}</div>`;
        }
    }
}

async function openEventDetails(eventId) {
    // Navigate to the hidden details section
    if (typeof navigateTo === 'function') {
        // We will repurpose a 'custom' page ID or just manually show it
        // However, standard SPA router expects pages in nav. 
        // Let's manually manage the view switch if 'event-details' isn't in standard nav

        // Hide all pages
        $('.page-section').removeClass('active').hide();
        // Show details page
        $('#event-details-page').addClass('active').show();
        window.scrollTo(0, 0);

        // Update navigation active state
        if (typeof updateActiveNavigation === 'function') {
            updateActiveNavigation('events');
        }
    }

    // Show loading state
    document.getElementById('spa-event-title').textContent = 'Loading...';
    document.getElementById('spa-event-gallery-container').innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
        </div>`;

    try {
        // Fetch if not cached
        if (!eventsDataCache) {
            const response = await fetch('./data/events.json');
            eventsDataCache = await response.json();
        }

        const event = eventsDataCache.events.find(e => e.id === eventId);

        if (event) {
            // Populate Details
            document.getElementById('spa-event-title').textContent = event.title;
            document.getElementById('spa-event-subtitle').textContent = event.subtitle;
            document.getElementById('spa-event-date').innerHTML = `<i class="far fa-calendar-alt me-2"></i> ${event.date}`;
            document.getElementById('spa-event-description').textContent = event.description || '';

            // Render Full Gallery
            renderSpaGallery(event.fullGallery);
        } else {
            document.getElementById('spa-event-title').textContent = 'Event Not Found';
            document.getElementById('spa-event-gallery-container').innerHTML = '<div class="alert alert-warning">Event not found.</div>';
        }

    } catch (e) {
        console.error(e);
        document.getElementById('spa-event-title').textContent = 'Error';
    }
}

function renderSpaGallery(galleryItems) {
    const container = document.getElementById('spa-event-gallery-container');
    if (!galleryItems || galleryItems.length === 0) {
        container.innerHTML = '<p class="text-center">No images found.</p>';
        return;
    }

    let html = '<div class="row g-4">';
    galleryItems.forEach(item => {
        const media = item.media[0];
        let mediaHtml = '';

        if (media.type === 'video') {
            mediaHtml = `
                <video class="w-100 rounded" controls style="height: 250px; object-fit: cover; background: #000;">
                    <source src="${media.src}" type="video/mp4">
                </video>
             `;
        } else {
            // Use global openLightbox if available, else fallback
            // We assume openLightbox is globally available from script.js or we define it here if not
            // For now let's assume standard lightbox structure in index.html and write a helper
            mediaHtml = `
                <img src="${media.src}" class="w-100 rounded shadow-sm gallery-item" 
                     style="height: 250px; object-fit: cover; cursor: pointer;"
                     alt="${escapeHTML(item.title)}"
                     onclick="openSpaLightbox('${media.src}', '${escapeHTML(item.title)}');">
            `;
        }

        html += `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-img-top">${mediaHtml}</div>
                    <div class="card-body">
                        <h5 class="card-title h6 fw-bold">${escapeHTML(item.title)}</h5>
                        <p class="card-text small text-muted">${escapeHTML(item.text)}</p>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function openSpaLightbox(src, caption) {
    const overlay = document.getElementById('lightbox-overlay');
    const img = document.getElementById('lightbox-image');
    const title = document.getElementById('lightbox-title');

    if (overlay && img) {
        img.src = src;
        if (title) title.textContent = caption;
        overlay.classList.add('active');

        // Ensure close button works
        const closeBtn = document.getElementById('lightbox-close');
        if (closeBtn) {
            closeBtn.onclick = () => overlay.classList.remove('active');
        }
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        };
    }
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

// Load on DOM Ready if we are on the main page (check for container)
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('events-container')) {
        loadEventsList();
    }
});

// Helper for potentially needed re-init
window.loadEventsList = loadEventsList;
