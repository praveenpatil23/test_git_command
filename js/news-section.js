// News Section Generator - Loads news and programs from JSON and generates dynamic HTML

async function loadNewsSection() {
    try {
        // Fetch news data from JSON
        const response = await fetch('./data/news.json');
        if (!response.ok) {
            throw new Error('Failed to load news data: ' + response.statusText);
        }
        const data = await response.json();

        // Generate and render news HTML
        const newsHTML = generateNewsHTML(data);

        // Insert into the news container
        const newsContainer = document.getElementById('news-container');
        if (newsContainer) {
            newsContainer.innerHTML = newsHTML;
        }

    } catch (error) {
        console.error('Error loading news:', error);
        const container = document.getElementById('news-container');
        if (container) {
            container.innerHTML = '<div class="alert alert-danger">Error loading news. Please try again later.</div>';
        }
    }
}

function generateNewsHTML(data) {
    let html = '';

    // Generate newsletter cards and program tables
    if (data.newsletters && Array.isArray(data.newsletters)) {
        html += '<section class="news-section">';
        data.newsletters.forEach((newsletter, index) => {
            const bgColorClass = `bg-${newsletter.color}`;
            const collapseId = `news-collapse-${index}`;

            // Newsletter card header
            const isFirst = index === 0;
            html += `
                <article class="news-item mb-4">
                    <div class="card h-100">
                        <div class="card-header ${bgColorClass} ${newsletter.color === 'warning' || newsletter.color === 'info' ? 'text-dark' : 'text-white'}" 
                             data-bs-toggle="collapse" 
                             data-bs-target="#${collapseId}" 
                             aria-expanded="${isFirst ? 'true' : 'false'}" 
                             aria-controls="${collapseId}"
                             style="cursor: pointer;">
                            <div class="d-flex justify-content-between align-items-center">
                                <h4 class="card-title mb-0">
                                    <i class="fas ${newsletter.icon}"></i> ${escapeHTML(newsletter.title)}
                                </h4>
                                <div>
                                    <small class="badge ${newsletter.color === 'warning' || newsletter.color === 'info' ? 'bg-light text-dark' : 'bg-light text-dark'} me-2">${escapeHTML(newsletter.date)}</small>
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                            </div>
                        </div>
                        <div id="${collapseId}" class="collapse ${isFirst ? 'show' : ''}">
                            <div class="card-body">
                                <p class="card-text">
                                    ${escapeHTML(newsletter.content)}
                                </p>
            `;

            // If newsletter has events (programs), render them as a table
            if (newsletter.events && Array.isArray(newsletter.events) && newsletter.events.length > 0) {
                html += `
                            <hr />
                            <p style="color: #0000ff; font-size: 0.9rem; font-weight: bold; text-align: center; margin-bottom: 15px;">
                                ${escapeHTML(newsletter.note)}
                            </p>
                            
                            <div style="overflow-x: auto;">
                                <table class="table table-sm table-bordered table-hover" style="background-color: #ffffff; font-size: 0.9rem;">
                                    <thead class="table-light">
                                        <tr>
                                            <th class="text-center">Particulars</th>
                                            <th class="text-center">Date</th>
                                            <th class="text-center">Time/Place</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                `;

                newsletter.events.forEach((event) => {
                    html += `
                                        <tr>
                                            <td class="text-center">${escapeHTML(event.particulars)}</td>
                                            <td class="text-center">${escapeHTML(event.date)}</td>
                                            <td class="text-center">${escapeHTML(event.time || '-')}</td>
                                        </tr>
                    `;
                });

                html += `
                                    </tbody>
                                </table>
                            </div>
                `;
            }

            html += `
                            </div>
                        </div>
                    </div>
                </article>
            `;
        });
        html += '</section>';
    }

    // Add location info
    html += `
        <section class="location-info mt-5 p-5 rounded text-center" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
            <h4 class="mb-3" style="font-weight: bold; font-size: 1.4rem;">
                <i class="fas fa-map-marker-alt"></i> Location
            </h4>
            <h5 class="mb-3" style="font-weight: 600; font-size: 1.1rem;">Shri Narayan Bhawan</h5>
            <p class="mb-2" style="font-size: 1rem;">Siddharth Nagar, Near Hartman College</p>
            <p class="mb-0" style="font-size: 1rem;">Hanuman Mandir Road, Bareilly, India</p>
        </section>
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

// Load news when DOM is ready
document.addEventListener('DOMContentLoaded', loadNewsSection);

// Re-load news when navigating to news page
const originalNavigateToNews = typeof navigateTo !== 'undefined' ? navigateTo : null;
if (originalNavigateToNews) {
    window.navigateTo = function (page) {
        originalNavigateToNews(page);
        if (page === 'news') {
            setTimeout(loadNewsSection, 100);
        }
    };
}
