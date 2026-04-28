document.querySelectorAll(".faq-card").forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("active");
    });
});

// ========== WAIT FOR DOM TO LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== MOBILE MENU TOGGLE (FIXED) ==========
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    
    console.log('Hamburger element:', hamburger); // Debug: check if element exists
    console.log('Nav menu element:', navMenu);    // Debug: check if element exists
    
    function closeMenu() {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (hamburger) {
                hamburger.setAttribute('aria-expanded', 'false');
                // Optional: remove active class if using animation
                hamburger.classList.remove('active');
            }
            console.log('Menu closed'); // Debug
        }
    }
    
    function toggleMenu() {
        if (navMenu) {
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            if (hamburger) {
                hamburger.setAttribute('aria-expanded', isExpanded);
                // Optional: add class for animation
                if (isExpanded) {
                    hamburger.classList.add('active');
                } else {
                    hamburger.classList.remove('active');
                }
            }
            console.log('Menu toggled, active:', isExpanded); // Debug
        }
    }
    
    // Mobile menu toggle event
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        console.log('Hamburger event attached'); // Debug
    } else {
        console.error('Hamburger button not found!');
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active')) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger && hamburger.contains(event.target);
            if (!isClickInsideNav && !isClickOnHamburger) {
                closeMenu();
            }
        }
    });
    
    // Close menu when window is resized above mobile breakpoint
    window.addEventListener('resize', function() {
        if (window.innerWidth > 850 && navMenu && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu when ESC key is pressed
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // ========== ACTIVE NAVIGATION LINK ON SCROLL ==========
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link:not(.btn-nav)');
    
    function changeActiveLink() {
        let current = '';
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Home fallback
        if (current === '' && window.scrollY < 150) {
            const homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }
    
    // Throttle scroll event
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(function() {
            changeActiveLink();
        });
    });
    
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
                    // Close mobile menu first
                    if (window.innerWidth <= 850) {
                        closeMenu();
                    }
                    // Smooth scroll to target
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                    // Update URL hash
                    history.pushState(null, null, hash);
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
    
    function showOrderMessage(message, color, msgElement) {
        if (msgElement) {
            msgElement.textContent = message;
            msgElement.style.color = color;
            msgElement.style.fontWeight = '500';
            msgElement.style.padding = '0.5rem';
            msgElement.style.borderRadius = '12px';
            msgElement.style.backgroundColor = color === '#27ae60' ? '#e8f5e9' : '#fff3e0';
            setTimeout(() => {
                if (msgElement) msgElement.textContent = '';
            }, 5000);
        }
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            if (!nameInput || nameInput.value.trim() === '') {
                showOrderMessage('⚠️ Please enter your full name.', '#e67e22', orderMsg);
                nameInput?.focus();
                return;
            }
            
            if (!contactInput || contactInput.value.trim() === '') {
                showOrderMessage('⚠️ Please enter your contact number.', '#e67e22', orderMsg);
                contactInput?.focus();
                return;
            }
            
            const name = nameInput.value.trim();
            const product = productSelect ? productSelect.value : 'Purified Gallon';
            
            showOrderMessage(
                `✅ Thank you ${name}! Your order for ${product} has been received. Our team will contact you within 15 minutes. 💧`,
                '#27ae60',
                orderMsg
            );
            
            setTimeout(() => {
                if (nameInput) nameInput.value = '';
                if (contactInput) contactInput.value = '';
                if (addressInput) addressInput.value = '';
            }, 1000);
        });
    }
    
    // ========== TESTIMONIAL CAROUSEL ==========
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    
    let currentIndex = 0;
    let slides = [];
    let totalSlides = 0;
    let autoSlideInterval;
    
    function updateSlides() {
        slides = document.querySelectorAll('.carousel-slide');
        totalSlides = slides.length;
        
        if (totalSlides === 0) return;
        
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }
    }
    
    function goToSlide(index) {
        if (totalSlides === 0) return;
        
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        if (track) {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
        resetAutoSlide();
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
        resetAutoSlide();
    }
    
    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }
    
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (totalSlides > 0) {
                goToSlide(currentIndex);
            }
        }, 100);
    });
    
    function initCarousel() {
        updateSlides();
        if (totalSlides > 0) {
            goToSlide(0);
            startAutoSlide();
        }
    }
    
    initCarousel();
    
    // ========== PRODUCT CARD HOVER EFFECT ==========
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    console.log('✅ H2OLivia website fully loaded!');
    
}); // End of DOMContentLoaded