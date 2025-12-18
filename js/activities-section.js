// Activities Section Script
// Handles loading and displaying dynamic activities content

async function loadActivities() {
    try {
        const response = await fetch('./data/activities.json');
        if (!response.ok) {
            throw new Error(`Failed to load activities: ${response.statusText}`);
        }
        const data = await response.json();

        if (!data.activities || !Array.isArray(data.activities)) {
            throw new Error('Invalid activities data format');
        }

        let html = '';
        data.activities.forEach((activity, index) => {
            const collapseId = `activity-collapse-${index}`;
            // First item expanded by default
            const isExpanded = index === 0;

            // Generate content using local helper
            const contentHTML = generateActivityGalleryHTML(activity.gallery);

            html += `
                <div class="activity-card ${isExpanded ? '' : 'collapsed'}">
                    <div class="activity-header ${isExpanded ? '' : 'collapsed'}" 
                         data-bs-toggle="collapse" 
                         data-bs-target="#${collapseId}" 
                         aria-expanded="${isExpanded}" 
                         aria-controls="${collapseId}">
                        <div class="activity-title-wrapper">
                            <h4 class="activity-title">
                                ${escapeHTML(activity.title)}
                            </h4>
                        </div>
                        <div class="activity-icon-wrapper">
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                    <div id="${collapseId}" class="collapse ${isExpanded ? 'show' : ''}">
                        <div class="activity-body">
                            ${activity.subtitle ? `<div class="activity-subtitle">${escapeHTML(activity.subtitle)}</div>` : ''}
                            <div class="activity-gallery-wrapper">
                                ${contentHTML}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        const container = document.getElementById('activities-container');
        if (container) {
            container.innerHTML = html;

            // Try to initialize lightbox if available globally
            if (typeof window.initializeLightbox === 'function') {
                window.initializeLightbox();
            } else if (typeof initializeLightbox === 'function') {
                initializeLightbox();
            } else {
                // Poll for it
                callInitializeLightboxSafely();
            }
        }

    } catch (error) {
        console.error('Error loading activities:', error);
        const container = document.getElementById('activities-container');
        if (container) {
            container.innerHTML = `<div class="alert alert-danger">Error loading activities: ${escapeHTML(error.message)}</div>`;
        }
    }
}

// Helper to generate gallery HTML (Duplicate of logic in gallery-generator.js to keep this self-contained)
function generateActivityGalleryHTML(galleryItems) {
    if (!galleryItems || !Array.isArray(galleryItems)) return '';

    let html = '<div class="row g-4">';

    galleryItems.forEach((item, index) => {
        const carouselId = `act-carousel-${item.id}-${Math.floor(Math.random() * 1000)}`;
        const hasMultipleMedia = item.media.length > 1;

        let mediaHTML = '';

        if (hasMultipleMedia) {
            mediaHTML = generateActivityCarouselHTML(item, carouselId);
        } else {
            mediaHTML = generateActivitySingleMediaHTML(item.media[0]);
        }

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

function generateActivitySingleMediaHTML(media) {
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

function generateActivityCarouselHTML(item, carouselId) {
    let html = `
        <div id="${carouselId}" class="carousel slide" data-bs-interval="false">
            <div class="carousel-inner">
    `;

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

function callInitializeLightboxSafely() {
    let attempts = 0;
    const maxAttempts = 30;
    const interval = setInterval(() => {
        if (typeof window.initializeLightbox === 'function') {
            window.initializeLightbox();
            clearInterval(interval);
            return;
        }
        if (typeof initializeLightbox === 'function') {
            initializeLightbox();
            clearInterval(interval);
            return;
        }
        attempts++;
        if (attempts >= maxAttempts) clearInterval(interval);
    }, 100);
}

// Load on DOM Ready
document.addEventListener('DOMContentLoaded', loadActivities);

// Navigation Handler
const originalNavigateToAct = typeof navigateTo !== 'undefined' ? navigateTo : null;
if (originalNavigateToAct) {
    window.navigateTo = function (page) {
        originalNavigateToAct(page);
        if (page === 'activities') {
            setTimeout(loadActivities, 100);
        }
    };
}
