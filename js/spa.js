/**
 * Single Page Application (SPA) Router
 * Bhagwan Shailja Narayan Website
 * Features: Testimonial loading, dynamic rendering, hash-based routing, navigation
 */

/**
 * Load Testimonials from JSON
 */
function loadTestimonials() {
    $.ajax({
        url: 'data/testimonials.json',
        method: 'GET',
        dataType: 'json',
        success: function (testimonials) {
            renderTestimonials(testimonials);
        },
        error: function () {
            console.error('Failed to load testimonials');
        }
    });
}

/**
 * Render testimonials dynamically from JSON data
 * @param {Array} testimonials - Array of testimonial objects
 */
function renderTestimonials(testimonials) {
    var container = $('#testimonials-container');
    var html = '';

    testimonials.forEach(function (testimonial) {
        var stars = '';
        for (var i = 0; i < testimonial.rating; i++) {
            stars += '<i class="fas fa-star text-warning"></i>';
        }

        var subtitle = testimonial.title;
        if (testimonial.company) {
            subtitle += ', ' + testimonial.company;
        }
        if (testimonial.location) {
            subtitle += '<br>' + testimonial.location;
        }
        if (testimonial.email) {
            subtitle += '<br><a href="mailto:' + testimonial.email + '" class="text-decoration-none">' + testimonial.email + '</a>';
        }

        html += `
            <div class="testimonial-card mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="testimonial-avatar">
                                <i class="fas fa-user-circle fa-3x text-${testimonial.avatar_color}"></i>
                            </div>
                            <div class="ms-3">
                                <h5 class="card-title mb-1">${testimonial.name}</h5>
                                <p class="card-text text-muted small">${subtitle}</p>
                            </div>
                        </div>
                        <div class="testimonial-stars mb-2">
                            ${stars}
                        </div>
                        <p class="card-text">
                            "${testimonial.comment}"
                        </p>
                    </div>
                </div>
            </div>
        `;
    });

    container.html(html);
}

/**
 * Navigate to a specific page section
 * @param {string} page - Page name (home, vilay, opinion, news, contact)
 */
function navigateTo(page) {
    // Hide all pages
    $('.page-section').removeClass('active').hide();

    // Show the selected page
    $('#' + page + '-page').addClass('active').show();

    // Scroll to top
    window.scrollTo(0, 0);

    // Update URL hash
    window.location.hash = page;

    // Update active nav link
    updateActiveNavigation(page);

    // Initialize carousels if activities page is shown
    if (page === 'activities' && typeof initializeCarousels !== 'undefined') {
        setTimeout(function () {
            initializeCarousels();
        }, 100);
    }

    return false;
}

/**
 * Update active navigation link based on current page
 * @param {string} page - Current page name
 */
function updateActiveNavigation(page) {
    // Page to nav mapping
    var navMapping = {
        'home': 'home',
        'vilay': 'vilay',
        'opinion': 'opinion',
        'activities': 'activities',
        'events': 'events',
        'event-details': 'events',
        'books': 'books',
        'news': 'news',
        'contact': 'contact'
    };

    // Remove active from all nav links
    $('.navbar-nav .nav-link').removeClass('active');

    // Add active to current page nav link
    $('.navbar-nav .nav-link[data-page="' + navMapping[page] + '"]').addClass('active');
}

/**
 * Initialize SPA Router
 * Called when document is ready
 */
function initializeSPA() {
    // Load testimonials
    loadTestimonials();

    // Update header navigation links to use SPA routing
    $(document).on('click', '.navbar-nav .nav-link[data-page]', function (e) {
        e.preventDefault();
        var page = $(this).data('page');
        if (page === 'home') {
            navigateTo('home');
        } else {
            navigateTo(page);
        }
    });

    // Handle clicks on any element with `data-page` outside the navbar
    $(document).on('click', '[data-page]', function (e) {
        var $el = $(this);
        // If this element is inside the navbar, let the navbar handler handle it
        if ($el.closest('.navbar-nav').length) return;
        e.preventDefault();
        var page = $el.data('page');
        if (page === 'home') {
            navigateTo('home');
        } else {
            navigateTo(page);
        }
    });

    // Load initial page from hash or default to home
    var initialPage = window.location.hash.slice(1) || 'home';
    navigateTo(initialPage);
}

// Handle back/forward browser buttons
window.addEventListener('hashchange', function () {
    var page = window.location.hash.slice(1) || 'home';
    navigateTo(page);
});

// Initialize SPA when document is ready
$(document).ready(function () {
    initializeSPA();
});
