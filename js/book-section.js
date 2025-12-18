// Book Section Generator - Loads books from JSON and generates modern cards

async function loadBooksSection() {
    try {
        // Fetch books data from JSON
        const response = await fetch('./data/books.json');
        if (!response.ok) {
            throw new Error('Failed to load books data: ' + response.statusText);
        }
        const data = await response.json();

        // Populate global book gallery images for lightbox
        if (data.books && Array.isArray(data.books)) {
            window.bookGalleryImages = data.books.map(book => ({
                src: book.fullImage,
                title: book.title
            }));
        }

        // Generate and render books HTML
        const booksHTML = generateBooksHTML(data);

        // Insert into the books container
        const booksContainer = document.getElementById('books-section-container');
        if (booksContainer) {
            booksContainer.innerHTML = booksHTML;
        }

    } catch (error) {
        console.error('Error loading books:', error);
        const container = document.getElementById('books-section-container');
        if (container) {
            container.innerHTML = '<div class="alert alert-danger">Error loading books. Please try again later.</div>';
        }
    }
}

function generateBooksHTML(data) {
    let html = `
        <div class="books-intro mb-5">
            <p class="lead text-center text-muted">${escapeHTML(data.description)}</p>
          
        </div>

        <div class="books-grid row g-4">
    `;

    data.books.forEach((book, index) => {
        const imagePath = book.image;
        const fullImagePath = book.fullImage;

        html += `
            <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="book-card card h-100 shadow-sm book-hover">
                    <div class="book-image-container position-relative overflow-hidden" style="height: 300px; background-color: #f8f9fa;">
                        <img src="${imagePath}" alt="${escapeHTML(book.title)}" class="card-img-top book-image" style="height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                        <div class="book-overlay d-flex flex-column justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100" style="background-color: rgba(0, 0, 0, 0.7); opacity: 0; transition: opacity 0.3s ease;">
                            <button class="btn btn-light btn-sm mb-2" onclick="openBookLightbox('${fullImagePath}', '${escapeHTML(book.title)}')">
                                <i class="fas fa-expand"></i> View Full
                            </button>
                          
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${escapeHTML(book.title)}</h5>
                        <p class="card-text text-muted small">${escapeHTML(book.hindi)}</p>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
        </div>
    `;

    return html;
}

function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Function to open book full image in lightbox
let currentBookIndex = 0;

function openBookLightbox(imagePath, title) {
    if (!window.bookGalleryImages || window.bookGalleryImages.length === 0) {
        // Fallback if no gallery
        openBookLightboxSimple(imagePath, title);
        return;
    }

    // Find index
    const index = window.bookGalleryImages.findIndex(img => img.src === imagePath);
    currentBookIndex = index >= 0 ? index : 0;

    updateBookLightboxContent(window.bookGalleryImages[currentBookIndex]);

    const overlay = document.getElementById('book-lightbox-overlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Ensure events are bound (idempotent)
        bindBookLightboxEvents();
    }
}

function openBookLightboxSimple(imagePath, title) {
    const overlay = document.getElementById('book-lightbox-overlay');
    const imgEl = document.getElementById('book-lightbox-image');
    const titleEl = document.getElementById('book-lightbox-title');

    if (overlay && imgEl && titleEl) {
        imgEl.src = imagePath;
        titleEl.textContent = title;
        document.getElementById('book-lightbox-counter').style.display = 'none';
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        bindBookLightboxEvents();
    }
}

function updateBookLightboxContent(image) {
    if (!image) return;

    const imgEl = document.getElementById('book-lightbox-image');
    const titleEl = document.getElementById('book-lightbox-title');
    const counterEl = document.getElementById('book-lightbox-counter');

    if (imgEl) imgEl.src = image.src;
    if (titleEl) titleEl.textContent = image.title;

    if (counterEl && window.bookGalleryImages.length > 0) {
        counterEl.textContent = `${currentBookIndex + 1} / ${window.bookGalleryImages.length}`;
        counterEl.style.display = 'block';
    }
}

function closeBookLightbox() {
    const overlay = document.getElementById('book-lightbox-overlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showNextBook() {
    if (!window.bookGalleryImages || window.bookGalleryImages.length === 0) return;
    currentBookIndex = (currentBookIndex + 1) % window.bookGalleryImages.length;
    updateBookLightboxContent(window.bookGalleryImages[currentBookIndex]);
}

function showPrevBook() {
    if (!window.bookGalleryImages || window.bookGalleryImages.length === 0) return;
    currentBookIndex = (currentBookIndex - 1 + window.bookGalleryImages.length) % window.bookGalleryImages.length;
    updateBookLightboxContent(window.bookGalleryImages[currentBookIndex]);
}

let bookEventsBound = false;
function bindBookLightboxEvents() {
    if (bookEventsBound) return;

    const overlay = document.getElementById('book-lightbox-overlay');
    const closeBtn = document.getElementById('book-lightbox-close');
    const prevBtn = document.getElementById('book-lightbox-prev');
    const nextBtn = document.getElementById('book-lightbox-next');

    if (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeBookLightbox();
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeBookLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrevBook);
    if (nextBtn) nextBtn.addEventListener('click', showNextBook);

    document.addEventListener('keydown', function (e) {
        if (overlay && overlay.classList.contains('active')) {
            if (e.key === 'ArrowLeft') showPrevBook();
            if (e.key === 'ArrowRight') showNextBook();
            if (e.key === 'Escape') closeBookLightbox();
        }
    });

    bookEventsBound = true;
}

// Add hover effect to book cards
function addBookHoverEffect() {
    const bookCards = document.querySelectorAll('.book-card');

    bookCards.forEach(card => {
        const overlay = card.querySelector('.book-overlay');
        const image = card.querySelector('.book-image');

        card.addEventListener('mouseenter', () => {
            overlay.style.opacity = '1';
            image.style.transform = 'scale(1.1)';
        });

        card.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0';
            image.style.transform = 'scale(1)';
        });
    });
}

// Load books when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadBooksSection();
    // Add hover effects after books are loaded
    setTimeout(addBookHoverEffect, 100);
});

// Re-add hover effects when navigating between pages
const originalNavigateToBook = typeof navigateTo !== 'undefined' ? navigateTo : null;
if (originalNavigateToBook) {
    window.navigateTo = function (page) {
        originalNavigateToBook(page);
        if (page === 'books') {
            setTimeout(() => {
                loadBooksSection();
                setTimeout(addBookHoverEffect, 100);
            }, 100);
        }
    };
}
