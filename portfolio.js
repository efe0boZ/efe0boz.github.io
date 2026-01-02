// Custom Animated Cursor
const cursor = document.createElement('div');
const cursorFollower = document.createElement('div');
cursor.className = 'custom-cursor';
cursorFollower.className = 'custom-cursor-follower';
document.body.appendChild(cursor);
document.body.appendChild(cursorFollower);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor hover effects
document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursor.style.background = 'var(--primary-color)';
        cursor.style.borderColor = 'white';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = 'transparent';
        cursor.style.borderColor = 'var(--primary-color)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') 
            ? 'rotate(45deg) translate(5px, 5px)' 
            : 'none';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') 
            ? 'rotate(-45deg) translate(7px, -6px)' 
            : 'none';
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// Smooth Scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll - Enhanced
const navbar = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations - Enhanced
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe all sections and cards
const animateElements = document.querySelectorAll('.skill-card, .project-card, .about-text, .contact-content, .section-title');
animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
    observer.observe(el);
});

// Contact Form Handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (name && email && message) {
            // Show success message
            alert('Mesajınız için teşekkürler! En kısa sürede size dönüş yapacağım.');
            
            // Reset form
            contactForm.reset();
        } else {
            alert('Lütfen tüm alanları doldurunuz.');
        }
    });
}

// Dynamic typing effect for hero section
const heroTitle = document.querySelector('.hero h1');
if (heroTitle && !heroTitle.classList.contains('glitch')) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing after page load
    window.addEventListener('load', () => {
        setTimeout(typeWriter, 500);
    });
}

// Skill bars animation on scroll
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.style.width;
            entry.target.style.width = '0';
            setTimeout(() => {
                entry.target.style.width = width;
            }, 100);
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Add parallax effect to hero section
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        hero.style.transform = `translateY(${parallax}px)`;
    });
}

// Add active class to current nav link based on scroll position
const sections = document.querySelectorAll('section[id]');

const updateActiveNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
};

window.addEventListener('scroll', updateActiveNav);

// Preloader (optional)
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Gallery lightbox functionality
const galleryItems = document.querySelectorAll('.gallery-item');
let currentImageIndex = 0;

// Create lightbox
const createLightbox = () => {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="" alt="">
            <div class="lightbox-caption"></div>
            <button class="lightbox-prev">&#10094;</button>
            <button class="lightbox-next">&#10095;</button>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    // Add lightbox styles
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            animation: fadeIn 0.3s ease;
        }
        
        .lightbox.active {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            animation: zoomIn 0.3s ease;
        }
        
        .lightbox-content img {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 10px;
            box-shadow: 0 0 50px rgba(102, 126, 234, 0.5);
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            font-size: 40px;
            color: white;
            cursor: pointer;
            transition: color 0.3s;
        }
        
        .lightbox-close:hover {
            color: var(--primary-color);
        }
        
        .lightbox-caption {
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 1.2rem;
        }
        
        .lightbox-prev, .lightbox-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(102, 126, 234, 0.8);
            color: white;
            border: none;
            padding: 15px 20px;
            font-size: 24px;
            cursor: pointer;
            border-radius: 5px;
            transition: background 0.3s;
        }
        
        .lightbox-prev {
            left: -60px;
        }
        
        .lightbox-next {
            right: -60px;
        }
        
        .lightbox-prev:hover, .lightbox-next:hover {
            background: var(--primary-color);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes zoomIn {
            from { transform: scale(0.7); }
            to { transform: scale(1); }
        }
        
        @media (max-width: 768px) {
            .lightbox-prev, .lightbox-next {
                font-size: 18px;
                padding: 10px 15px;
            }
            .lightbox-prev {
                left: 10px;
            }
            .lightbox-next {
                right: 10px;
            }
        }
    `;
    document.head.appendChild(style);
    
    return lightbox;
};

const lightbox = createLightbox();
const lightboxImg = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');

const openLightbox = (index) => {
    currentImageIndex = index;
    const item = galleryItems[index];
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-overlay');
    
    lightboxImg.src = img.src;
    lightboxCaption.innerHTML = `<h3>${overlay.querySelector('h3').textContent}</h3><p>${overlay.querySelector('p').textContent}</p>`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
};

const showPrevImage = () => {
    currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentImageIndex);
};

const showNextImage = () => {
    currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
    openLightbox(currentImageIndex);
};

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
});

// Enhanced scroll animations
const observeGallery = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = `scaleIn 0.6s ease forwards`;
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

galleryItems.forEach(item => {
    item.style.opacity = '0';
    observeGallery.observe(item);
});

// Parallax effect for sections
const parallaxSections = document.querySelectorAll('.skills, .projects, .gallery');
window.addEventListener('scroll', () => {
    parallaxSections.forEach(section => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        section.style.transform = `translateY(${rate}px)`;
    });
});

// Cursor trail effect
let coords = { x: 0, y: 0 };
let circles = [];

const colors = [
    'rgba(102, 126, 234, 0.5)',
    'rgba(118, 75, 162, 0.5)',
    'rgba(240, 147, 251, 0.5)'
];

for (let i = 0; i < 12; i++) {
    let circle = document.createElement('div');
    circle.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s;
        background: ${colors[i % colors.length]};
    `;
    circles.push(circle);
    document.body.appendChild(circle);
}

window.addEventListener('mousemove', (e) => {
    coords.x = e.clientX;
    coords.y = e.clientY;
});

function animateCircles() {
    let x = coords.x;
    let y = coords.y;
    
    circles.forEach((circle, index) => {
        circle.style.left = x - 10 + 'px';
        circle.style.top = y - 10 + 'px';
        circle.style.transform = `scale(${(circles.length - index) / circles.length})`;
        
        const nextCircle = circles[index + 1] || circles[0];
        x += (nextCircle.offsetLeft - circle.offsetLeft) * 0.3;
        y += (nextCircle.offsetTop - circle.offsetTop) * 0.3;
    });
    
    requestAnimationFrame(animateCircles);
}

animateCircles();

// Smooth reveal for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(section);
});

console.log('Portfolio loaded successfully! ✨');
console.log('Developed by Efe Boza');
