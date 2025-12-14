# Bhagwan Shailja Narayan - Responsive Website

A modern, fully responsive website built with Bootstrap 5 and jQuery, dedicated to Bhagwan Shailja Narayan and the spiritual teachings of Vilay.

## 📋 Project Structure

```
new_site/
├── index_2.html          # Main homepage
├── pages/
│   ├── vilay.html       # The Aim of Life - Vilay
│   ├── opinion.html     # People's Opinion & Testimonials
│   ├── news.html        # News & Events
│   └── contact.html     # Contact Us
├── css/
│   └── style.css        # Custom responsive styles
├── js/
│   └── script.js        # jQuery functionality
└── images/              # Image directory for assets
```

## 🚀 Features

### 1. **Responsive Design**
- Fully responsive layout that works on mobile, tablet, and desktop
- Bootstrap 5 grid system for flexible layouts
- Mobile-first approach with hamburger menu for small screens
- Touch-friendly interface

### 2. **Header Navigation**
- Left side: "Bhagwan Shailja Narayan" title with subtitle
- Right side: Navigation menu with items:
  - Home
  - The Aim Of Life - Vilay
  - People's Opinion
  - News & Events
  - Contact Us
- Sticky navigation that remains visible while scrolling
- Active page highlighting

### 3. **Image/Video Slider (Carousel)**
- Bootstrap carousel with automatic slide rotation (5 seconds)
- Navigation controls (Previous/Next buttons)
- Indicator dots for direct slide selection
- Responsive image sizing
- Keyboard navigation support (arrow keys)

### 4. **Pages Included**

#### Home Page (index_2.html)
- Featured announcements
- Welcome introduction
- Quick links to all major sections
- Call-to-action buttons

#### The Aim of Life - Vilay (pages/vilay.html)
- Comprehensive information about Vilay
- Spiritual teachings and philosophy
- 9 key points to achieve Vilay
- Teaching cards with icons
- Divine message section

#### People's Opinion (pages/opinion.html)
- Testimonial cards with ratings
- Community experiences and stories
- Call-to-action for sharing experiences
- Structured testimonial layout

#### News & Events (pages/news.html)
- Latest announcements and schedules
- News cards with color-coded headers
- Event information
- Newsletter subscription form

#### Contact Us (pages/contact.html)
- Contact information cards
- Address, email, phone, hours
- Contact form with validation
- Organization information
- Call-to-action buttons

### 5. **Technology Stack**

#### Frontend Frameworks
- **Bootstrap 5.3.0**: Latest version for modern responsive design
- **jQuery 3.6.0**: Latest stable version for DOM manipulation and events
- **Font Awesome 6.4.0**: Icons and visual elements

#### Custom Features
- Responsive CSS with media queries
- jQuery functionality for:
  - Form validation
  - Smooth scrolling
  - Interactive elements
  - Carousel controls
  - Mobile menu handling
  - Newsletter subscription

## 📱 Responsive Breakpoints

- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Medium**: 768px - 992px
- **Desktop**: ≥ 992px

## 🎨 Customization

### Colors (defined in CSS variables)
- Primary Color: `#0000a0` (Dark Blue)
- Secondary Color: `#008000` (Green)
- Accent Color: `#ff0000` (Red)
- Warning Color: `#ff8040` (Orange)

### Fonts
- Headers: Arial, sans-serif
- Body: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- Special text: Bookman Old Style, serif

## 🔧 Setup Instructions

### 1. Basic Setup
- All files are ready to use
- No installation or build process required
- Simply open `index_2.html` in a web browser

### 2. Folder Structure
Ensure the following structure is maintained:
```
new_site/
├── index_2.html
├── pages/
│   ├── vilay.html
│   ├── opinion.html
│   ├── news.html
│   └── contact.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

### 3. Adding Images
- Place image files in the `images/` folder
- Update image paths in HTML files as needed
- Current slider references existing images from parent directory

## 📄 File Descriptions

### HTML Files
- **index_2.html**: Entry point with header, slider, announcements, and quick links
- **pages/vilay.html**: Detailed information about spiritual teachings
- **pages/opinion.html**: Testimonials and community feedback
- **pages/news.html**: Latest news, events, and announcements
- **pages/contact.html**: Contact form and organization information

### CSS (css/style.css)
- **Header Styles**: Navigation and title styling
- **Slider Styles**: Carousel appearance and animations
- **Content Styles**: Text, boxes, and layout
- **Card Styles**: Testimonials, news items, contact cards
- **Footer Styles**: Footer section styling
- **Responsive Design**: Media queries for all screen sizes
- **Accessibility**: Focus states and semantic styles

### JavaScript (js/script.js)
- **Form Validation**: Contact form validation with error messages
- **Carousel Control**: Auto-play and keyboard navigation
- **Smooth Scrolling**: Anchor link animations
- **Navbar Highlighting**: Active page detection
- **Mobile Menu**: Close menu on link click
- **Scroll Effects**: Animations on page scroll
- **Lazy Loading**: Image loading optimization
- **Newsletter Signup**: Subscription functionality

## 🎯 Key Features in Detail

### 1. Contact Form
- Validates required fields (name, email, subject, message)
- Email format validation
- Newsletter subscription checkbox
- Success/error message display
- Auto-clear after submission

### 2. Image Carousel
- Auto-plays every 5 seconds
- Mouse click controls
- Keyboard arrow key navigation
- Indicator dots for quick navigation
- Responsive sizing for all devices

### 3. Navigation
- Sticky header that stays visible
- Hamburger menu for mobile devices
- Active state highlighting
- Smooth transitions and hover effects

### 4. Responsive Layout
- Mobile-first design approach
- Flexible grid system
- Responsive images and media
- Touch-friendly buttons
- Proper spacing and padding

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Content Management

### To Add New Content:
1. Edit the respective HTML page
2. Follow the existing structure
3. Maintain consistent styling with CSS classes
4. Test on mobile devices

### To Modify Colors:
Edit the CSS variables at the top of `css/style.css`:
```css
:root {
    --primary-color: #0000a0;
    --secondary-color: #008000;
    --accent-color: #ff0000;
    --warning-color: #ff8040;
}
```

### To Update Navigation:
Edit the navbar section in each HTML file and update the menu items.

## 🔐 Security Notes

- Contact form currently shows success message locally
- For production, implement backend processing for form submission
- Add CSRF protection for form submission
- Implement email validation on server-side
- Use HTTPS for secure data transmission

## 🚀 Deployment

### Local Testing
1. Open any HTML file directly in browser
2. Or use a local server:
   ```bash
   python -m http.server 8000
   # or
   php -S localhost:8000
   ```

### Web Hosting
1. Upload entire `new_site/` folder to hosting provider
2. Set `index_2.html` as the main/default page
3. Ensure file structure is preserved
4. Test all links and forms after upload

## 📚 Additional Resources

### Bootstrap Documentation
- https://getbootstrap.com/docs/5.3/

### jQuery Documentation
- https://jquery.com/

### Font Awesome Icons
- https://fontawesome.com/icons

## 🤝 Support

For any modifications or customizations needed:
1. Edit HTML for content changes
2. Edit CSS for styling changes
3. Edit JavaScript for functionality changes
4. Test on multiple devices

## 📄 License & Credits

- Created for Vilay Gyan Dharmarth Sansthan
- Built with Bootstrap 5, jQuery, and Font Awesome
- Responsive design for all modern devices

## 🎉 Congratulations!

Your website is ready to use! Visit `index_2.html` to see the complete responsive website with:
- ✅ Modern responsive design
- ✅ Image/Video slider
- ✅ Fully functional navigation
- ✅ Contact form
- ✅ Mobile-friendly menu
- ✅ Professional styling
- ✅ Interactive elements

---

**Last Updated**: December 11, 2025
