// Funcionalidades principales del sitio web NCA
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initMobileMenu();
    initSmoothScrolling();
    initTestimonialsCarousel();
    initContactForm();
    initScrollAnimations();
    initHeaderScroll();
});

// ===========================================
// MENÚ MÓVIL
// ===========================================
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        // Toggle del menú móvil
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Cerrar menú al hacer click fuera de él
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// ===========================================
// SCROLL SUAVE
// ===========================================
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===========================================
// CARRUSEL DE TESTIMONIOS
// ===========================================
function initTestimonialsCarousel() {
    const carousel = document.getElementById('testimonials-carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!carousel) return;
    
    const testimonials = carousel.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let autoSlideInterval;
    
    // Crear dots de navegación
    createDots();
    
    // Inicializar carousel
    showTestimonial(currentIndex);
    startAutoSlide();
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            previousTestimonial();
            startAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextTestimonial();
            startAutoSlide();
        });
    }
    
    // Pause al hacer hover
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    
    function createDots() {
        if (!dotsContainer) return;
        
        testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                stopAutoSlide();
                showTestimonial(index);
                startAutoSlide();
            });
            
            dotsContainer.appendChild(dot);
        });
    }
    
    function showTestimonial(index) {
        // Ocultar todos los testimonios
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Mostrar testimonial actual
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
        }
        
        // Actualizar dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentIndex = index;
    }
    
    function nextTestimonial() {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(nextIndex);
    }
    
    function previousTestimonial() {
        const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(prevIndex);
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextTestimonial, 5000);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
}

// ===========================================
// FORMULARIO DE CONTACTO
// ===========================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
        };
        
        // Validar formulario
        if (validateForm(data)) {
            submitForm(data);
        }
    });
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateForm(data) {
        let isValid = true;
        
        // Validar nombre
        if (!data.name || data.name.trim().length < 2) {
            showFieldError('name', 'Por favor ingresa tu nombre completo');
            isValid = false;
        } else {
            clearFieldError('name');
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showFieldError('email', 'Por favor ingresa un email válido');
            isValid = false;
        } else {
            clearFieldError('email');
        }
        
        // Validar teléfono
        const phoneRegex = /^[+]?[\d\s\-()]{8,}$/;
        if (!data.phone || !phoneRegex.test(data.phone)) {
            showFieldError('phone', 'Por favor ingresa un teléfono válido');
            isValid = false;
        } else {
            clearFieldError('phone');
        }
        
        // Validar mensaje
        if (!data.message || data.message.trim().length < 10) {
            showFieldError('message', 'Por favor ingresa un mensaje de al menos 10 caracteres');
            isValid = false;
        } else {
            clearFieldError('message');
        }
        
        return isValid;
    }
    
    function validateField(field) {
        const fieldName = field.name;
        const value = field.value;
        
        switch (fieldName) {
            case 'name':
                if (!value || value.trim().length < 2) {
                    showFieldError(fieldName, 'Nombre requerido');
                } else {
                    clearFieldError(fieldName);
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || !emailRegex.test(value)) {
                    showFieldError(fieldName, 'Email válido requerido');
                } else {
                    clearFieldError(fieldName);
                }
                break;
            case 'phone':
                const phoneRegex = /^[+]?[\d\s\-()]{8,}$/;
                if (!value || !phoneRegex.test(value)) {
                    showFieldError(fieldName, 'Teléfono válido requerido');
                } else {
                    clearFieldError(fieldName);
                }
                break;
            case 'message':
                if (!value || value.trim().length < 10) {
                    showFieldError(fieldName, 'Mensaje de al menos 10 caracteres');
                } else {
                    clearFieldError(fieldName);
                }
                break;
        }
    }
    
    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        field.classList.add('error');
        field.style.borderColor = '#ff6b6b';
        
        // Remover error previo
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Agregar mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        field.classList.remove('error');
        field.style.borderColor = '';
        
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    function submitForm(data) {
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;
        
        // Mostrar estado de carga
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simular envío (aquí iría la integración real)
        setTimeout(() => {
            // Mostrar mensaje de éxito
            showSuccessMessage();
            
            // Resetear formulario
            form.reset();
            
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Opcional: redireccionar a WhatsApp con el mensaje
            const whatsappMessage = `Hola! Soy ${data.name}. ${data.message}. Mi email es ${data.email} y mi teléfono ${data.phone}.`;
            const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(whatsappMessage)}`;
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 2000);
            
        }, 1500);
    }
    
    function showSuccessMessage() {
        // Crear mensaje de éxito
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background: linear-gradient(135deg, #c8a8d8, #f8b5c4);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
            animation: slideInDown 0.5s ease;
        `;
        successDiv.innerHTML = `
            <i class="fas fa-check-circle" style="margin-right: 10px;"></i>
            ¡Mensaje enviado exitosamente! Te contactaremos pronto.
        `;
        
        // Insertar antes del formulario
        form.parentNode.insertBefore(successDiv, form);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// ===========================================
// ANIMACIONES EN SCROLL
// ===========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Elementos a animar
    const elementsToAnimate = [
        '.service-card',
        '.testimonial-card',
        '.location-card',
        '.blog-card',
        '.about-img',
        '.contact-method'
    ];
    
    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('animate-on-scroll');
            observer.observe(element);
        });
    });
}

// ===========================================
// HEADER CON SCROLL
// ===========================================
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Agregar fondo sólido al hacer scroll
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = 'none';
        }
        
        // Ocultar/mostrar header al hacer scroll (opcional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// ===========================================
// UTILIDADES ADICIONALES
// ===========================================

// Función para lazy loading de imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Función para manejar el modo oscuro (opcional)
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (!darkModeToggle) return;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Función para analytics y tracking (placeholder)
function initAnalytics() {
    // Aquí se puede integrar Google Analytics, Facebook Pixel, etc.
    console.log('Analytics initialized');
    
    // Ejemplo: tracking de clics en botones importantes
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Enviar evento a analytics
            console.log('CTA clicked:', e.target.textContent);
        });
    });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Función para detectar dispositivo móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para formatear números de teléfono
function formatPhoneNumber(phone) {
    // Remover caracteres no numéricos excepto +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Formato para números chilenos
    if (cleaned.startsWith('+56')) {
        return cleaned.replace(/(\+56)(\d)(\d{4})(\d{4})/, '$1 $2 $3 $4');
    }
    
    return phone;
}

// Manejo de errores globales
window.addEventListener('error', function(e) {
    console.error('Error detectado:', e.error);
    // Aquí se puede enviar el error a un servicio de tracking
});

// Optimización de rendimiento: debounce para eventos de scroll y resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce a eventos costosos
const debouncedResize = debounce(() => {
    // Lógica para manejar resize
    console.log('Window resized');
}, 250);

window.addEventListener('resize', debouncedResize);