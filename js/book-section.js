// Book Section Generator - Loads books from JSON and generates modern cards

async function loadBooksSection() {
    try {
        // Fetch books data from JSON
        const response = await fetch('./data/books.json');
        if (!response.ok) {
            throw new Error('Failed to load books data: ' + response.statusText);
        }
        const data = await response.json();
        
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
                            <a href="mailto:vilaygyan@gmail.com?subject=Inquiry about ${encodeURIComponent(book.title)}" class="btn btn-outline-light btn-sm">
                                <i class="fas fa-envelope"></i> Inquire
                            </a>
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
function openBookLightbox(imagePath, title) {
    // Prefer the central openLightbox when available so navigation/counter stays consistent
    if (typeof openLightbox === 'function') {
        try {
            openLightbox({ src: imagePath, title: title });
            // ensure galleryImages/currentImageIndex reflect a single-image context
            if (window.galleryImages && Array.isArray(window.galleryImages)) {
                window.galleryImages = [{ src: imagePath, title: title }];
                window.currentImageIndex = 0;
            }
            return;
        } catch (e) {
            console.warn('openLightbox failed, falling back to local lightbox:', e);
        }
    }

    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    
    if (lightboxImage && lightboxOverlay) {
        lightboxImage.src = imagePath;
        lightboxTitle.textContent = title;
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
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
    window.navigateTo = function(page) {
        originalNavigateToBook(page);
        if (page === 'activities') {
            setTimeout(() => {
                loadBooksSection();
                setTimeout(addBookHoverEffect, 100);
            }, 100);
        }
    };
}
