// LimTray Manufacturing - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initSearch();
    initCart();
    initHeroSlider();
    initScrollEffects();
    initForms();
    initProductFilter();
    initQuantityControls();
    initPaymentTabs();
});

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
                nav.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    }
}

// ============================================
// Search Functionality
// ============================================
function initSearch() {
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        const input = searchBox.querySelector('input');
        const btn = searchBox.querySelector('button');
        
        btn.addEventListener('click', function() {
            performSearch(input.value);
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(input.value);
            }
        });
    }
}

function performSearch(query) {
    if (query.trim()) {
        // In a real application, this would redirect to search results
        console.log('Searching for:', query);
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

// ============================================
// Shopping Cart
// ============================================
let cart = JSON.parse(localStorage.getItem('limtray_cart')) || [];

function initCart() {
    updateCartCount();
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const btn = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                quantity: parseInt(btn.dataset.quantity) || 1
            };
            addToCart(product);
        }
    });
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    saveCart();
    updateCartCount();
    showNotification('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('limtray_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => {
        const priceInfo = getVolumeDiscountPrice(item.quantity, item.price);
        return sum + priceInfo.totalPrice;
    }, 0);
}

// Volume Discount Calculator
// Fixed pricing tiers for 30-Cell Egg Tray:
// 1-50 trays: ₱480 per tray
// 51-100 trays: ₱450 per tray  
// 101-200 trays: ₱450 per tray
function getVolumeDiscountPrice(quantity, basePrice) {
    // Price is already set at time of adding to cart based on quantity tier
    // No additional calculation needed - just return as-is
    return {
        discountedPrice: basePrice,
        totalPrice: basePrice * quantity,
        savings: 0,
        discountPercent: 0
    };
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total-amount');
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="price">₱${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn minus" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn plus" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <div class="cart-item-total">
                        ₱${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">&times;</button>
                </div>
            `).join('');
        }
    }
    
    if (cartTotal) {
        cartTotal.textContent = `₱${getCartTotal().toFixed(2)}`;
    }
}

// ============================================
// Hero Slider
// ============================================
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;
    
    let currentSlide = 0;
    
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

// ============================================
// Scroll Effects
// ============================================
function initScrollEffects() {
    // Header shadow on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.feature-card, .product-category-card, .step, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(el => observer.observe(el));
}

// ============================================
// Form Handling
// ============================================
function initForms() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Order Form
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderForm);
    }
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginForm);
    }
    
    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterForm);
    }
    
    // Quote Request Form
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleQuoteForm);
    }
}

function handleContactForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    e.target.reset();
}

function handleOrderForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Generate order number
    const orderNumber = 'LT-' + Date.now().toString().slice(-8);
    
    // Simulate order submission
    showNotification(`Order ${orderNumber} placed successfully! Check your email for confirmation.`, 'success');
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    
    // Redirect to order confirmation
    setTimeout(() => {
        window.location.href = `order-confirmation.html?order=${orderNumber}`;
    }, 2000);
}

function handleLoginForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simulate login
    localStorage.setItem('limtray_user', JSON.stringify({ email: data.email }));
    showNotification('Login successful! Redirecting...', 'success');
    
    setTimeout(() => {
        window.location.href = 'account.html';
    }, 1500);
}

function handleRegisterForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (data.password !== data.confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // Simulate registration
    localStorage.setItem('limtray_user', JSON.stringify({ 
        email: data.email,
        name: data.name,
        company: data.company
    }));
    
    showNotification('Registration successful! Redirecting...', 'success');
    
    setTimeout(() => {
        window.location.href = 'account.html';
    }, 1500);
}

function handleQuoteForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Generate quote reference
    const quoteRef = 'QT-' + Date.now().toString().slice(-8);
    
    showNotification(`Quote request ${quoteRef} submitted! We will contact you within 24 hours.`, 'success');
    e.target.reset();
}

// ============================================
// Product Filter
// ============================================
function initProductFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter products
            products.forEach(product => {
                if (filter === 'all' || product.dataset.category === filter) {
                    product.style.display = 'block';
                    setTimeout(() => product.classList.add('show'), 10);
                } else {
                    product.classList.remove('show');
                    setTimeout(() => product.style.display = 'none', 300);
                }
            });
        });
    });
}

// ============================================
// Quantity Controls
// ============================================
function initQuantityControls() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('qty-btn')) {
            const input = e.target.parentElement.querySelector('input, span');
            let value = parseInt(input.value || input.textContent);
            
            if (e.target.classList.contains('minus') && value > 1) {
                value--;
            } else if (e.target.classList.contains('plus')) {
                value++;
            }
            
            if (input.tagName === 'INPUT') {
                input.value = value;
            } else {
                input.textContent = value;
            }
            
            // Update price if on product page
            updateProductPrice();
        }
    });
}

function updateProductPrice() {
    const qtyInput = document.querySelector('.quantity-selector input');
    const priceDisplay = document.querySelector('.product-total-price');
    const unitPrice = document.querySelector('.product-unit-price');
    
    if (qtyInput && priceDisplay && unitPrice) {
        const price = parseFloat(unitPrice.dataset.price);
        const qty = parseInt(qtyInput.value);
        priceDisplay.textContent = `₱${(price * qty).toFixed(2)}`;
    }
}

// ============================================
// Payment Tabs
// ============================================
function initPaymentTabs() {
    const tabs = document.querySelectorAll('.payment-tab');
    const contents = document.querySelectorAll('.payment-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
}

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ============================================
// Utility Functions
// ============================================
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('limtray_user') !== null;
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('limtray_user');
    return user ? JSON.parse(user) : null;
}

// Logout
function logout() {
    localStorage.removeItem('limtray_user');
    window.location.href = 'index.html';
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-success .notification-content i { color: #4CAF50; }
    .notification-error .notification-content i { color: #F44336; }
    .notification-warning .notification-content i { color: #FF9800; }
    .notification-info .notification-content i { color: #2196F3; }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #999;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        color: #333;
    }
`;
document.head.appendChild(notificationStyles);
