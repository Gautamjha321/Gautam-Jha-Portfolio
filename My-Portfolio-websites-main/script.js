// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    
    // Force preloader to hide after a maximum time (3 seconds)
    setTimeout(function() {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 3000);
    
    // Hide preloader when page is loaded
    window.addEventListener('load', function() {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // Mobile Menu Toggle - Enhanced functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navItems = document.querySelectorAll('.nav-links li');
    const socialLinks = document.querySelectorAll('.mobile-social-links a');
    const body = document.body;
    
    if (menuToggle && nav) {
        // Set item index for staggered animations
        navItems.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
        });
        
        socialLinks.forEach((link, index) => {
            link.style.setProperty('--item-index', index);
        });
        
        // Function to open mobile menu
        function openMobileMenu() {
            menuToggle.classList.add('active');
            nav.classList.add('active');
            body.classList.add('menu-open');
            
            // Add active class to body with small delay for smooth overlay animation
            setTimeout(() => {
                body.classList.add('active');
            }, 10);
        }
        
        // Function to close mobile menu
        function closeMobileMenu() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            body.classList.remove('active');
            
            // Small delay before removing menu-open class for smooth overlay fade-out
            setTimeout(() => {
                body.classList.remove('menu-open');
            }, 300);
        }
        
        // Toggle menu when clicking the menu button/cross
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            
            if (menuToggle.classList.contains('active')) {
                // Cross button clicked - close menu
                closeMobileMenu();
            } else {
                // Hamburger button clicked - open menu
                openMobileMenu();
            }
        });
        
        // Close menu when clicking outside the menu (on the overlay)
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                e.target !== menuToggle && 
                !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu when clicking on a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Close menu when clicking on social links
        socialLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Close menu when screen size changes to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                closeMobileMenu();
            }
        });
        
        // Close menu with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // Enhanced Particle Background
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Mouse position tracking
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Particle settings - OPTIMIZED FOR PERFORMANCE
    const particlesArray = [];
    const numberOfParticles = 100; // Reduced from 150 for better performance
    const colors = ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#10b981'];

    // Create particles
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.distance = 0;
        }

        update() {
            // Only update particles that are visible
            if (this.x > -50 && this.x < canvas.width + 50 && 
                this.y > -50 && this.y < canvas.height + 50) {
                
                // Calculate distance between mouse and particle
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                this.distance = Math.sqrt(dx * dx + dy * dy);
                
                // Mouse repulsion effect - only if mouse is on screen
                if (mouse.x !== null && mouse.y !== null) {
                    const forceDirectionX = dx / this.distance;
                    const forceDirectionY = dy / this.distance;
                    const maxDistance = mouse.radius;
                    const force = (maxDistance - this.distance) / maxDistance;
                    
                    if (this.distance < mouse.radius) {
                        const directionX = forceDirectionX * force * this.density;
                        const directionY = forceDirectionY * force * this.density;
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
                
                // Return to original position with easing
                let dx2 = this.baseX - this.x;
                let dy2 = this.baseY - this.y;
                this.x += dx2 * 0.05;
                this.y += dy2 * 0.05;
            }
        }

        draw() {
            // Only draw particles that are visible
            if (this.x > -50 && this.x < canvas.width + 50 && 
                this.y > -50 && this.y < canvas.height + 50) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    // Initialize particles
    function init() {
        particlesArray.length = 0;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    // Connect particles with lines
    function connect() {
        const maxDistance = 200;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                // Skip unnecessary calculations for particles that are far apart
                const dx = Math.abs(particlesArray[a].x - particlesArray[b].x);
                const dy = Math.abs(particlesArray[a].y - particlesArray[b].y);
                
                // Quick distance check before doing the more expensive sqrt
                if (dx < maxDistance && dy < maxDistance) {
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        const opacity = 1 - (distance / maxDistance);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    // Animation loop with performance optimization
    let lastTime = 0;
    const fpsLimit = 60; // Limit FPS for better performance
    const fpsInterval = 1000 / fpsLimit;
    
    function animate(timestamp = 0) {
        // Throttle the frame rate
        const elapsed = timestamp - lastTime;
        
        if (elapsed > fpsInterval) {
            lastTime = timestamp - (elapsed % fpsInterval);
            
            // Only clear and redraw when the page is visible
            if (!document.hidden) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Only update and draw particles when scrolling is not happening
                if (!window.smoothScroll || !window.smoothScroll.isScrolling) {
                    for (let i = 0; i < particlesArray.length; i++) {
                        particlesArray[i].update();
                        particlesArray[i].draw();
                    }
                    connect();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        // Throttle resize events
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        }, 200);
    });
    
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Tab is hidden, no need to animate
            mouse.x = null;
            mouse.y = null;
        }
    });

    // Initialize particles
    init();
    animate();

    // Dynamic text animation with improved transitions
    const dynamicTexts = document.querySelectorAll('.dynamic-text .text');
    let currentTextIndex = 0;

    function changeText() {
        // Fade out current text
        dynamicTexts[currentTextIndex].classList.remove('active');
        
        // Wait for fade out transition
        setTimeout(() => {
            // Update index
            currentTextIndex = (currentTextIndex + 1) % dynamicTexts.length;
            
            // Fade in new text
            dynamicTexts[currentTextIndex].classList.add('active');
            
            // Set timeout for next text change
            setTimeout(changeText, 3000);
        }, 500);
    }
    
    // Start the text animation after a delay
    if (dynamicTexts.length > 0) {
        setTimeout(changeText, 2000);
    }

    // Enhanced typing effect with smooth erase and type animation
    const typingText = document.querySelector('.typing-text');
    const phrases = [
        "Turning Ideas into Reality",
        "Building Modern Web Experiences",
        "Creating Innovative Solutions",
        "Developing Responsive Designs"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        // Set typing speed based on whether we're typing or deleting
        if (isDeleting) {
            typingSpeed = 50; // Faster when deleting
        } else {
            typingSpeed = 100 + Math.random() * 50; // Slightly random typing speed
        }
        
        // If typing
        if (!isDeleting && charIndex < currentPhrase.length) {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeEffect, typingSpeed);
        } 
        // If we need to start deleting
        else if (!isDeleting && charIndex >= currentPhrase.length) {
            // Pause at the end of the phrase
            setTimeout(() => {
                isDeleting = true;
                typeEffect();
            }, 1500);
        }
        // If deleting
        else if (isDeleting && charIndex > 0) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(typeEffect, typingSpeed);
        }
        // If we've deleted everything
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            // Small pause before typing next phrase
            setTimeout(typeEffect, 500);
        }
    }
    
    // Start typing effect with a delay
    setTimeout(typeEffect, 1500);

    // Enhanced tilt effect for project cards and hero image
    const tiltElements = document.querySelectorAll('.tilt-effect');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = x / rect.width;
            const yPercent = y / rect.height;
            
            const maxTilt = 15;
            const tiltX = (maxTilt * 2) * (yPercent - 0.5);
            const tiltY = (maxTilt * 2) * (xPercent - 0.5) * -1;
            
            // Add a subtle glow effect on hover
            const glowX = (xPercent - 0.5) * 50;
            const glowY = (yPercent - 0.5) * 50;
            
            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
            this.style.boxShadow = `${glowX}px ${glowY}px 30px rgba(99, 102, 241, 0.3)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            
            // Add a smooth transition back
            this.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                this.style.transition = '';
            }, 500);
        });
    });

    // Scroll event for header
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Contact form submission
    // const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const message = this.querySelector('textarea[name="message"]').value;
            
            // Form validation
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual form submission)
            showFormMessage('Thank you for your message! I will get back to you soon.', 'success');
            this.reset();
        });
    }
    
    // Show form message
    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Add message to form
        contactForm.appendChild(messageElement);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Add active class to navigation based on scroll position
    const sections = document.querySelectorAll('section');
    
    function setActiveNavOnScroll() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavOnScroll);

    // Enhanced About and Skills sections
    function enhanceSections() {
        // 3D tilt effect for about image
        const aboutImg = document.querySelector('.about-img');
        if (aboutImg) {
            aboutImg.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xPercent = x / rect.width;
                const yPercent = y / rect.height;
                
                const maxTilt = 10;
                const tiltX = (maxTilt * 2) * (yPercent - 0.5);
                const tiltY = (maxTilt * 2) * (xPercent - 0.5) * -1;
                
                const img = this.querySelector('img');
                if (img) {
                    img.style.transform = `translateZ(20px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                }
            });
            
            aboutImg.addEventListener('mouseleave', function() {
                const img = this.querySelector('img');
                if (img) {
                    img.style.transform = 'translateZ(0) rotateX(0) rotateY(0)';
                    img.style.transition = 'all 0.5s ease';
                }
            });
        }
        
        // Animate skill bars on scroll
        const skillBars = document.querySelectorAll('.skill-progress');
        const animateSkillBars = () => {
            skillBars.forEach(bar => {
                const rect = bar.getBoundingClientRect();
                const isVisible = (rect.top <= window.innerHeight * 0.8);
                
                if (isVisible) {
                    const width = bar.getAttribute('style').split('width: ')[1].split(';')[0];
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                }
            });
        };
        
        // Initial animation
        setTimeout(animateSkillBars, 500);
        
        // Animate on scroll
        window.addEventListener('scroll', function() {
            animateSkillBars();
        });
        
        // Add interactive hover effects to skill cards
        const skillCards = document.querySelectorAll('.skill');
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Add a subtle pulse animation to the icon
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.animation = 'pulse 0.5s ease';
                    setTimeout(() => {
                        icon.style.animation = '';
                    }, 500);
                }
            });
        });
    }
    
    // Initialize enhanced sections
    enhanceSections();

    // Enhanced Projects Section
    function enhanceProjects() {
        // 3D tilt effect for project cards
        const projectCards = document.querySelectorAll('.project.tilt-effect');
        
        projectCards.forEach(card => {
            // Add floating animation to some cards for visual interest
            if (Math.random() > 0.5) {
                card.style.animation = `floatProject ${5 + Math.random() * 3}s ease-in-out infinite`;
            }
            
            // 3D tilt effect on mouse move
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xPercent = x / rect.width;
                const yPercent = y / rect.height;
                
                const maxTilt = 15; // Maximum tilt angle
                const tiltX = (maxTilt * 2) * (yPercent - 0.5);
                const tiltY = (maxTilt * 2) * (xPercent - 0.5) * -1;
                
                // Apply the 3D transform
                this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02) translateY(-15px)`;
                
                // Dynamic shadow based on tilt
                const shadowX = (xPercent - 0.5) * 20;
                const shadowY = (yPercent - 0.5) * 20;
                this.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.3)`;
                
                // Dynamic highlight effect
                const glowElement = document.createElement('div');
                glowElement.classList.add('dynamic-glow');
                glowElement.style.position = 'absolute';
                glowElement.style.top = `${y}px`;
                glowElement.style.left = `${x}px`;
                glowElement.style.transform = 'translate(-50%, -50%)';
                glowElement.style.width = '100px';
                glowElement.style.height = '100px';
                glowElement.style.borderRadius = '50%';
                glowElement.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)';
                glowElement.style.pointerEvents = 'none';
                glowElement.style.opacity = '0';
                glowElement.style.transition = 'opacity 0.3s ease';
                
                // Remove any existing glow elements
                const existingGlow = this.querySelector('.dynamic-glow');
                if (existingGlow) {
                    existingGlow.remove();
                }
                
                this.appendChild(glowElement);
                
                // Fade in the glow
                setTimeout(() => {
                    glowElement.style.opacity = '1';
                }, 10);
                
                // Remove the glow after a short delay
                setTimeout(() => {
                    glowElement.style.opacity = '0';
                    setTimeout(() => {
                        glowElement.remove();
                    }, 300);
                }, 300);
            });
            
            // Reset transform on mouse leave
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
                
                // Add a smooth transition back
                this.style.transition = 'all 0.5s ease';
                setTimeout(() => {
                    this.style.transition = '';
                }, 500);
                
                // Remove any dynamic glow elements
                const glowElements = this.querySelectorAll('.dynamic-glow');
                glowElements.forEach(el => el.remove());
            });
        });
        
        // Animate project cards on scroll
        const animateProjectCards = () => {
            projectCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const isVisible = (rect.top <= window.innerHeight * 0.8);
                
                if (isVisible && !card.classList.contains('animated')) {
                    card.classList.add('animated');
                    card.style.animation = 'fadeInUp 0.8s ease forwards';
                    
                    // Add a slight delay for each card
                    const delay = parseFloat(card.getAttribute('data-aos-delay')) / 1000 || 0;
                    card.style.animationDelay = `${delay}s`;
                }
            });
        };
        
        // Initial animation
        setTimeout(animateProjectCards, 500);
        
        // Animate on scroll
        window.addEventListener('scroll', animateProjectCards);
        
        // Add interactive effects to project links
        const projectLinks = document.querySelectorAll('.project-links a');
        projectLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.classList.add('btn-ripple');
                ripple.style.position = 'absolute';
                ripple.style.top = '50%';
                ripple.style.left = '50%';
                ripple.style.transform = 'translate(-50%, -50%)';
                ripple.style.width = '0';
                ripple.style.height = '0';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                ripple.style.pointerEvents = 'none';
                
                this.appendChild(ripple);
                
                // Animate ripple
                ripple.animate(
                    [
                        { width: '0', height: '0', opacity: 1 },
                        { width: '200px', height: '200px', opacity: 0 }
                    ],
                    {
                        duration: 600,
                        easing: 'ease-out'
                    }
                );
                
                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    // Initialize enhanced projects
    enhanceProjects();

    // Skills section interactive effects
    function initSkillsInteraction() {
        const skills = document.querySelectorAll('.skill');
        
        skills.forEach(skill => {
            skill.addEventListener('mousemove', e => {
                const rect = skill.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                skill.style.setProperty('--mouse-x', `${x}px`);
                skill.style.setProperty('--mouse-y', `${y}px`);
            });
        });

        // Animate skill bars on scroll
        const animateSkillBars = () => {
            skills.forEach(skill => {
                const progressBar = skill.querySelector('.skill-progress-bar');
                if (!progressBar) return;

                const rect = skill.getBoundingClientRect();
                const isVisible = rect.top <= window.innerHeight * 0.8;

                if (isVisible) {
                    const progress = progressBar.style.getPropertyValue('--progress');
                    progressBar.style.width = progress;
                }
            });
        };

        // Initial animation
        setTimeout(animateSkillBars, 500);

        // Animate on scroll
        window.addEventListener('scroll', () => {
            requestAnimationFrame(animateSkillBars);
        });

        // Add hover animations
        skills.forEach(skill => {
            skill.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.skill-icon i');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });

            skill.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.skill-icon i');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    // Initialize skills interaction
    initSkillsInteraction();

    // Modern Project Cards - Initialize
    initModernProjectCards();
});

// Modern Project Cards - Initialize
function initModernProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    // Add subtle hover effect
    projectCards.forEach(card => {
        // Mouse move effect for glassy hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate percentage positions
            const xPercent = x / rect.width;
            const yPercent = y / rect.height;
            
            // Apply subtle transform based on mouse position
            const maxTilt = 10; // Maximum tilt angle
            const tiltX = (maxTilt * 2) * (yPercent - 0.5);
            const tiltY = (maxTilt * 2) * (xPercent - 0.5) * -1;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
            
            // Dynamic glow based on mouse position
            const glowElement = document.createElement('div');
            glowElement.classList.add('card-glow');
            glowElement.style.background = `radial-gradient(circle at ${x}px ${y}px, 
                                          rgba(99, 102, 241, 0.15), 
                                          transparent 50%)`;
            
            // Only add if not already present
            if (!card.querySelector('.card-glow')) {
                card.appendChild(glowElement);
            } else {
                card.querySelector('.card-glow').style.background = 
                `radial-gradient(circle at ${x}px ${y}px, 
                               rgba(99, 102, 241, 0.15), 
                               transparent 50%)`;
            }
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
            
            // Remove glow element
            const glowElement = card.querySelector('.card-glow');
            if (glowElement) {
                glowElement.remove();
            }
        });
        
        // Apply animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    card.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);
    });
}
