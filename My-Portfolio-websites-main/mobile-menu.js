// Mobile Menu Functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log("Mobile menu script loaded");
    
    // Get DOM elements
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.menu-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');
    const socialLinks = document.querySelectorAll('.mobile-social-links a');
    const navItems = document.querySelectorAll('.nav-links li');
    const body = document.body;
    
    // Debug log to check if elements are found
    console.log("Menu toggle found:", menuToggle);
    console.log("Mobile menu found:", mobileMenu);
    console.log("Overlay found:", overlay);
    console.log("Nav links found:", navLinks.length);
    
    // Set item indices for staggered animations
    navItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
    
    socialLinks.forEach((link, index) => {
        link.style.setProperty('--item-index', index);
    });
    
    // Function to open the mobile menu
    function openMobileMenu() {
        console.log("Opening mobile menu");
        menuToggle.classList.add('active');
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        body.classList.add('menu-open');
    }
    
    // Function to close the mobile menu
    function closeMobileMenu() {
        console.log("Closing mobile menu");
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('menu-open');
    }
    
    // Toggle menu when clicking the hamburger/cross button
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            console.log("Menu toggle clicked");
            e.preventDefault();
            e.stopPropagation();
            
            if (menuToggle.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }
    
    // Close menu when clicking on the overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            console.log("Overlay clicked");
            closeMobileMenu();
        });
    }
    
    // Close menu when clicking navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log("Nav link clicked");
            closeMobileMenu();
        });
    });
    
    // Close menu when clicking social links
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log("Social link clicked");
            // Don't close if it's an external link that opens in a new tab
            if (!this.getAttribute('target') || this.getAttribute('target') !== '_blank') {
                closeMobileMenu();
            }
        });
    });
    
    // Close menu when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            console.log("Escape key pressed");
            closeMobileMenu();
        }
    });
    
    // Close menu when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && mobileMenu.classList.contains('active')) {
            console.log("Window resized to desktop");
            closeMobileMenu();
        }
    });
    
    // Fix for mobile menu not working in some browsers
    // Force a small delay to ensure DOM is fully processed
    setTimeout(function() {
        console.log("Initializing mobile menu after delay");
        // Ensure the menu toggle is clickable by adding a specific height/width if needed
        if (menuToggle) {
            menuToggle.style.cursor = 'pointer';
            // Re-attach event listener to be sure
            menuToggle.addEventListener('click', function(e) {
                console.log("Menu toggle clicked (delayed init)");
                e.preventDefault();
                e.stopPropagation();
                
                if (menuToggle.classList.contains('active')) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });
        }
    }, 500);
}); 