// Contact Form Handler - Validates and processes contact form submissions

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset message
        const formMessage = document.getElementById('formMessage');
        if (formMessage) {
            formMessage.classList.add('d-none');
            formMessage.innerHTML = '';
        }

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const subscribe = document.getElementById('subscribe').checked;

        // Validation
        const validation = validateForm(name, email, subject, message);
        if (!validation.valid) {
            showMessage(validation.error, 'danger');
            return;
        }

        // Prepare form data
        const formData = {
            name: name,
            email: email,
            phone: phone,
            subject: subject,
            message: message,
            subscribe: subscribe,
            timestamp: new Date().toISOString()
        };

        // Submit form (in a real application, this would send to a backend)
        submitForm(formData);
    });
}

function validateForm(name, email, subject, message) {
    const errors = [];

    // Check required fields
    if (!name) {
        errors.push('Full Name is required.');
    }

    if (!email) {
        errors.push('Email Address is required.');
    } else if (!isValidEmail(email)) {
        errors.push('Please enter a valid email address.');
    }

    if (!subject) {
        errors.push('Subject is required.');
    }

    if (!message) {
        errors.push('Message cannot be blank.');
    }

    if (errors.length > 0) {
        return {
            valid: false,
            error: errors.join(' ')
        };
    }

    return { valid: true };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitForm(formData) {
    // Disable submit button to prevent multiple submissions
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }

    // Simulate form submission (replace with actual API call if needed)
    // In production, send to your backend: fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
    setTimeout(() => {
        // For now, just store locally and show success message
        const submissions = JSON.parse(localStorage.getItem('contactFormSubmissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('contactFormSubmissions', JSON.stringify(submissions));

        // Show success message
        showMessage(
            'Thank you! Your message has been received. We will get back to you soon.',
            'success'
        );

        // Reset form
        document.getElementById('contactForm').reset();

        // Re-enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }

        console.log('Form submitted:', formData);
    }, 500);
}

function showMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;

    formMessage.className = `alert alert-${type}`;
    formMessage.innerHTML = message;
    formMessage.classList.remove('d-none');

    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.classList.add('d-none');
        }, 5000);
    }
}

// Initialize form when DOM is ready
document.addEventListener('DOMContentLoaded', initializeContactForm);

// Re-initialize form when navigating to contact page
const originalNavigateToContact = typeof navigateTo !== 'undefined' ? navigateTo : null;
if (originalNavigateToContact) {
    window.navigateTo = function(page) {
        originalNavigateToContact(page);
        if (page === 'contact') {
            setTimeout(initializeContactForm, 100);
        }
    };
}
