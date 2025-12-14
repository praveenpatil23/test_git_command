/**
 * Carousel Manager
 * Handles dynamic loading of books and videos for carousels
 */

/**
 * Initialize Books Carousel
 * Loads book images from images/books folder
 */
function initBooksCarousel() {
    // Array of book images - customize with your actual book image paths
    var bookImages = [
        { src: 'images/books/aise-hain-mere-bhagwaan.jpeg', title: 'Divine Knowledge Vol. 1' },
        { src: 'images/books/Bhagwaan-se-aikakar.jpeg', title: 'Path of Prem' },
        { src: 'images/books/Maa-ke-geet.jpeg', title: 'Vilay Gyan' },
        { src: 'images/books/Avtar-katha.jpeg', title: 'Spiritual Wisdom' }
    ];

    var carouselInner = document.querySelector('#booksCarousel .carousel-inner');
    
    if (carouselInner) {
        // Clear placeholder items
        carouselInner.innerHTML = '';
        
        bookImages.forEach(function(book, index) {
            var isActive = index === 0 ? 'active' : '';
            var carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item ' + isActive;
            
            carouselItem.innerHTML = `
                <div class="d-flex justify-content-center align-items-center" style="min-height: 400px; background-color: #f9f9f9;">
                    <div class="text-center">
                        <img src="${book.src}" alt="${book.title}" class="img-fluid" style="max-height: 350px; object-fit: contain;">
                        <p class="mt-3 fw-bold">${book.title}</p>
                    </div>
                </div>
            `;
            
            carouselInner.appendChild(carouselItem);
        });

        // Reinitialize carousel after updating items
        var carouselElement = document.getElementById('booksCarousel');
        if (carouselElement) {
            var carousel = new bootstrap.Carousel(carouselElement);
        }
    }
}

/**
 * Initialize Videos Carousel
 * Loads videos from videos folder or YouTube links
 */
function initVideosCarousel() {
    // Array of videos - can be local video files or YouTube links
    var videos = [
        { 
            type: 'youtube',  // 'youtube' or 'local'
            src: 'dQw4w9WgXcQ',  // YouTube video ID
            title: 'Spiritual Discourse 1'
        },
        { 
            type: 'youtube',
            src: 'jNQXAC9IVRw',  // YouTube video ID (Rickroll - replace with actual)
            title: 'Divine Teaching Session'
        },
        { 
            type: 'local',
            src: 'videos/video3.mp4',
            title: 'Community Gathering'
        },
        { 
            type: 'local',
            src: 'videos/video4.mp4',
            title: 'Spiritual Practice Guide'
        }
    ];

    var carouselInner = document.querySelector('#videosCarousel .carousel-inner');
    
    if (carouselInner) {
        // Clear placeholder items
        carouselInner.innerHTML = '';
        
        videos.forEach(function(video, index) {
            var isActive = index === 0 ? 'active' : '';
            var carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item ' + isActive;
            
            var videoHTML = '';
            
            if (video.type === 'youtube') {
                videoHTML = `
                    <div class="d-flex justify-content-center align-items-center" style="min-height: 500px; background-color: #000;">
                        <div class="w-100 h-100" style="max-width: 100%;">
                            <iframe 
                                width="100%" 
                                height="500" 
                                src="https://www.youtube.com/embed/${video.src}" 
                                title="${video.title}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                            <p class="text-center mt-3 text-light fw-bold">${video.title}</p>
                        </div>
                    </div>
                `;
            } else {
                // Local video
                videoHTML = `
                    <div class="d-flex justify-content-center align-items-center" style="min-height: 500px; background-color: #000;">
                        <div class="w-100" style="max-width: 100%;">
                            <video width="100%" height="500" controls style="background-color: #000;">
                                <source src="${video.src}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                            <p class="text-center mt-3 text-light fw-bold">${video.title}</p>
                        </div>
                    </div>
                `;
            }
            
            carouselItem.innerHTML = videoHTML;
            carouselInner.appendChild(carouselItem);
        });

        // Reinitialize carousel after updating items
        var carouselElement = document.getElementById('videosCarousel');
        if (carouselElement) {
            var carousel = new bootstrap.Carousel(carouselElement);
        }
    }
}

/**
 * Initialize all carousels
 * Called when Activities page is loaded
 */
function initializeCarousels() {
    initBooksCarousel();
    initVideosCarousel();
}

// Initialize carousels when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousels();
});
