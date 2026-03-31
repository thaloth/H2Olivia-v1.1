// ========== MOBILE MENU TOGGLE ==========
const hamburger = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

function closeMenu() {
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
}

function toggleMenu() {
    navMenu.classList.toggle('active');
}

if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
}

// Close menu when clicking outside (optional)
document.addEventListener('click', function(event) {
    if (navMenu && navMenu.classList.contains('active')) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger && hamburger.contains(event.target);
        if (!isClickInsideNav && !isClickOnHamburger) {
            closeMenu();
        }
    }
});

// ========== ACTIVE NAVIGATION LINK ON SCROLL ==========
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link:not(.btn-nav)');

function changeActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 120;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    // Home fallback
    if (current === '' && window.scrollY < 100) {
        const homeLink = document.querySelector('.nav-link[href="#home"]');
        if (homeLink) homeLink.classList.add('active');
    }
}

window.addEventListener('scroll', changeActiveLink);
window.addEventListener('load', changeActiveLink);

// ========== SMOOTH SCROLL FOR NAVIGATION LINKS ==========
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const hash = link.getAttribute('href');
        if (hash && hash.startsWith('#')) {
            e.preventDefault();
            const targetId = hash.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                // Close mobile menu after clicking
                if (window.innerWidth <= 850) {
                    closeMenu();
                }
            }
        }
    });
});

// ========== ORDER FORM SUBMISSION ==========
const submitBtn = document.getElementById('submitOrderBtn');
const orderMsg = document.getElementById('orderMsg');
const nameInput = document.getElementById('nameInput');
const contactInput = document.getElementById('contactInput');
const addressInput = document.getElementById('addressInput');
const productSelect = document.getElementById('productSelect');

if (submitBtn) {
    submitBtn.addEventListener('click', function() {
        // Validate inputs
        if (!nameInput || nameInput.value.trim() === '') {
            showOrderMessage('⚠️ Please enter your full name.', '#e67e22');
            return;
        }
        
        if (!contactInput || contactInput.value.trim() === '') {
            showOrderMessage('⚠️ Please enter your contact number.', '#e67e22');
            return;
        }
        
        const name = nameInput.value.trim();
        const product = productSelect ? productSelect.value : 'Purified Gallon';
        
        // Success message
        showOrderMessage(
            `✅ Thank you ${name}! Your order for ${product} has been received. Our team will contact you within 15 minutes. 💧`,
            '#27ae60'
        );
        
        // Optional: Clear form after successful submission
        // (commented out to allow multiple orders)
        // if (nameInput) nameInput.value = '';
        // if (contactInput) contactInput.value = '';
        // if (addressInput) addressInput.value = '';
        // if (messageInput) messageInput.value = '';
    });
}

function showOrderMessage(message, color) {
    if (orderMsg) {
        orderMsg.textContent = message;
        orderMsg.style.color = color;
        setTimeout(() => {
            if (orderMsg) orderMsg.textContent = '';
        }, 5000);
    }
}

// ========== ADD HOVER EFFECT FOR PRODUCT CARDS ==========
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// ========== WELCOME CONSOLE MESSAGE ==========
console.log('💧 H2OLivia Water Refilling Station — Pure hydration, naturally! 💧');