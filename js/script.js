/**
 * Bhagwan Shailja Narayan Website
 * Custom jQuery Script
 * Features: Smooth scrolling, form validation, slider controls, animations, SPA routing
 */

// ===================================
// SPA Router Detection
// ===================================

// Check if we're running in SPA mode (app.html) or traditional mode
var isSPA = window.location.pathname.includes('app.html');

// ===================================
// Load Common Header Component
// ===================================

function loadHeader() {
    var headerPath = '';

    // Detect if we're in root or pages directory
    if (window.location.pathname.includes('/pages/')) {
        headerPath = '../includes/header.html';
    } else {
        headerPath = 'includes/header.html';
    }

    return $.ajax({
        url: headerPath,
        method: 'GET',
        dataType: 'html',
        success: function (data) {
            // Insert header into the header container
            $('#header-container').html(data);

            // Set active nav link based on current page
            setActiveNavLink();
        },
        error: function () {
            console.error('Failed to load header from: ' + headerPath);
        }
    });
}

function setActiveNavLink() {
    if (isSPA) {
        // For SPA, use hash-based routing
        var currentHash = window.location.hash.slice(1) || 'home';
        var pageMapping = {
            'home': 'home',
            'vilay': 'vilay',
            'opinion': 'opinion',
            'news': 'news',
            'contact': 'contact'
        };
        var currentPageKey = pageMapping[currentHash] || 'home';
    } else {
        // For traditional pages, use filename
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        var pageMapping = {
            'index.html': 'home',
            'index_2.html': 'home',
            'app.html': 'home',
            // 'vilay.html': 'vilay',
            'opinion.html': 'opinion',
            'news.html': 'news',
            'contact.html': 'contact'
        };
        var currentPageKey = pageMapping[currentPage] || 'home';
    }

    $('.navbar-nav .nav-link').each(function () {
        var pageAttr = $(this).data('page');
        if (pageAttr === currentPageKey) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });


    // Update nav links to point to correct paths
    updateNavLinks();
}

function updateNavLinks() {
    var isInPages = window.location.pathname.includes('/pages/');

    $('.navbar-nav .nav-link').each(function () {
        var pageAttr = $(this).data('page');
        var href = '';

        if (pageAttr === 'home') {
            href = isInPages ? '../index.html' : 'index.html';
        } else {
            href = isInPages ? pageAttr + '.html' : 'pages/' + pageAttr + '.html';
        }

        $(this).attr('href', href);
    });
}

// ===================================
// Load Common Footer Component
// ===================================

function loadFooter() {
    var footerPath = '';

    // Detect if we're in root or pages directory
    if (window.location.pathname.includes('/pages/')) {
        footerPath = '../includes/footer.html';
    } else {
        footerPath = 'includes/footer.html';
    }

    return $.ajax({
        url: footerPath,
        method: 'GET',
        dataType: 'html',
        success: function (data) {
            // Insert footer into the footer container
            $('#footer-container').html(data);

            // Update footer links
            updateFooterLinks();
        },
        error: function () {
            console.error('Failed to load footer from: ' + footerPath);
        }
    });
}

function updateFooterLinks() {
    if (isSPA) {
        // For SPA, use hash-based navigation
        $('#footer-container .footer-links a').each(function () {
            var pageAttr = $(this).data('page');
            if (pageAttr) {
                $(this).attr('href', '#' + pageAttr);
                $(this).off('click').on('click', function (e) {
                    e.preventDefault();
                    if (typeof navigateTo === 'function') {
                        navigateTo(pageAttr);
                    }
                });
            }
        });
    } else {
        // For traditional pages, use file paths
        var isInPages = window.location.pathname.includes('/pages/');

        $('#footer-container .footer-links a').each(function () {
            var pageAttr = $(this).data('page');
            var href = '';

            if (pageAttr === 'home') {
                href = isInPages ? '../index.html' : 'index.html';
            } else {
                href = isInPages ? pageAttr + '.html' : 'pages/' + pageAttr + '.html';
            }

            $(this).attr('href', href);
        });
    }
}

$(document).ready(function () {
    'use strict';

    // Load header and footer, then initialize other components
    $.when(loadHeader(), loadFooter()).done(function () {
        // For SPA, setup navigation handlers
        if (isSPA) {
            setupSPANavigation();
        }
        initializeComponents();
    }).fail(function () {
        console.error('Header/Footer loading failed, but continuing with initialization');
        initializeComponents();
    });
});

// ===================================
// SPA Navigation Setup
// ===================================

function setupSPANavigation() {
    // Update header nav links for SPA
    $(document).on('click', '.navbar-nav .nav-link[data-page], .ticker-item a[data-page]', function (e) {
        e.preventDefault();
        var page = $(this).data('page');
        if (typeof navigateTo === 'function') {
            navigateTo(page);
        }
    });

    // Update footer nav links
    updateFooterLinks();
}

function initializeComponents() {
    // ===================================
    // Initialize Tooltips and Popovers
    // ===================================

    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================

    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();

        var target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });

    // ===================================
    // Navbar Active State on Scroll
    // ===================================

    $(window).on('scroll', function () {
        var scrollPosition = $(window).scrollTop();

        $('nav .nav-link').each(function () {
            var link = $(this);
            var section = $(link.attr('href'));

            if (section.length) {
                if (section.offset().top - 100 <= scrollPosition &&
                    section.offset().top + section.height() - 100 > scrollPosition) {
                    $('.nav-link').removeClass('active');
                    link.addClass('active');
                }
            }
        });
    });





    // ===================================
    // Carousel Auto-play
    // ===================================

    var carousel = document.getElementById('imageSlider');
    if (carousel) {
        var carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 5000, // 5 seconds
            wrap: true,
            keyboard: true
        });

        // Add keyboard controls
        $(document).on('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                carouselInstance.prev();
            } else if (e.key === 'ArrowRight') {
                carouselInstance.next();
            }
        });
    }

    // ===================================
    // Dynamic Alert Dismissal
    // ===================================

    $(document).on('click', '.alert .btn-close', function () {
        $(this).closest('.alert').fadeOut(function () {
            $(this).remove();
        });
    });

    // ===================================
    // Animated Counter (if needed)
    // ===================================

    function animateCounter(element) {
        var target = parseInt(element.data('target'));
        var duration = 2000; // 2 seconds
        var start = 0;
        var increment = target / (duration / 16);

        function update() {
            start += increment;
            if (start < target) {
                element.text(Math.floor(start));
                setTimeout(update, 16);
            } else {
                element.text(target);
            }
        }

        update();
    }

    // Trigger counter animation when visible
    $('.counter').each(function () {
        var element = $(this);
        var position = element.offset().top;
        var screenPosition = $(window).scrollTop() + $(window).height();

        if (screenPosition > position) {
            animateCounter(element);
        }
    });

    // ===================================
    // Lazy Loading Images
    // ===================================

    if ('IntersectionObserver' in window) {
        var imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(function (img) {
            imageObserver.observe(img);
        });
    }

    // ===================================
    // Mobile Menu Close on Link Click
    // ===================================

    $('.navbar-collapse a').on('click', function () {
        var navbarToggle = $('button.navbar-toggler');

        if (navbarToggle.is(':visible') && navbarToggle.attr('aria-expanded') === 'true') {
            navbarToggle.click();
        }
    });

    // ===================================
    // Scroll to Top Button
    // ===================================

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
            if (!$('#scrollToTop').length) {
                $('<button id="scrollToTop" class="btn btn-primary btn-sm" style="position: fixed; bottom: 30px; right: 30px; z-index: 999; display: none;"><i class="fas fa-arrow-up"></i></button>').appendTo('body');
            }
            $('#scrollToTop').fadeIn();
        } else {
            $('#scrollToTop').fadeOut();
        }
    });

    $(document).on('click', '#scrollToTop', function () {
        $('html, body').animate({
            scrollTop: 0
        }, 'slow');
        return false;
    });

    // ===================================
    // Add Active Class to Current Page
    // ===================================

    $(window).on('load', function () {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';

        $('.nav-link').each(function () {
            var href = $(this).attr('href');

            if (href === currentPage || href.endsWith(currentPage)) {
                $(this).addClass('active');
            }
        });
    });

    // ===================================
    // Dynamic Newsletter Subscription
    // ===================================

    $('.subscribe-section form').on('submit', function (e) {
        e.preventDefault();

        var email = $(this).find('input[type="email"]').val().trim();

        if (!email) {
            alert('Please enter a valid email address.');
            return false;
        }

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        // Success message
        var button = $(this).find('button[type="submit"]');
        var originalText = button.html();

        button.html('<i class="fas fa-check"></i> Subscribed!').prop('disabled', true);

        setTimeout(function () {
            button.html(originalText).prop('disabled', false);
            $('input[type="email"]').val('');
        }, 2000);
    });

    // ===================================
    // Add Loading Animation to Buttons
    // ===================================

    $('button[type="submit"]').on('click', function () {
        var button = $(this);

        if (!button.prop('disabled')) {
            var originalContent = button.html();
            button.html('<span class="spinner-border spinner-border-sm me-2"></span>Loading...').prop('disabled', true);

            // Reset after 2 seconds (for demo)
            setTimeout(function () {
                button.html(originalContent).prop('disabled', false);
            }, 2000);
        }
    });

    // ===================================
    // Page Load Animation
    // ===================================

    $('body').css('opacity', '0').animate({
        opacity: 1
    }, 500);

    // ===================================
    // Header Animation on Scroll
    // ===================================

    var lastScrollTop = 0;
    var headerSection = $('.header-section');

    $(window).on('scroll', function () {
        var currentScroll = $(this).scrollTop();

        if (currentScroll > lastScrollTop && currentScroll > 100) {
            // Scroll Down
            headerSection.css({
                'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.15)'
            });
        } else {
            // Scroll Up
            headerSection.css({
                'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.1)'
            });
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });

    // ===================================
    // Print Friendly
    // ===================================

    $('.btn-print').on('click', function () {
        window.print();
    });

    // ===================================
    // Social Share
    // ===================================

    $('.share-button').on('click', function (e) {
        e.preventDefault();

        var platform = $(this).data('platform');
        var url = window.location.href;
        var title = document.title;
        var shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
                break;
            case 'twitter':
                shareUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title);
                break;
            case 'whatsapp':
                shareUrl = 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + url);
                break;
            case 'email':
                shareUrl = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(url);
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    });

    // ===================================
    // Testimonial Slider (if applicable)
    // ===================================

    var testimonialIndex = 0;
    var testimonials = $('.testimonial-card');
    var testimonialCount = testimonials.length;

    function showTestimonial(n) {
        testimonials.hide();
        if (n >= testimonialCount) {
            testimonialIndex = 0;
        }
        if (n < 0) {
            testimonialIndex = testimonialCount - 1;
        }
        $(testimonials[testimonialIndex]).show();
    }

    $('.prev-testimonial').on('click', function () {
        testimonialIndex--;
        showTestimonial(testimonialIndex);
    });

    $('.next-testimonial').on('click', function () {
        testimonialIndex++;
        showTestimonial(testimonialIndex);
    });

    // ===================================
    // Initialization Complete Log
    // ===================================

    console.log('Bhagwan Shailja Narayan Website - jQuery initialized successfully!');
}
