// Animations & UX Logic
document.addEventListener('DOMContentLoaded', () => {

    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Apply animation class to elements
    const sectionsToAnimate = document.querySelectorAll('section, .crt, .bs, .d1, .d2, .d3');
    sectionsToAnimate.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });

    // 2. Toast Notification System Setup
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 11000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    document.body.appendChild(toastContainer);

    window.showToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill';
        let bgColor = type === 'success' ? '#274C5B' : '#7b2cbf'; // matching premium brand colors
        
        toast.style.cssText = `
            background: ${bgColor};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: var(--shadow-md);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateX(-150%);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-family: inherit;
        `;
        
        toast.innerHTML = `<i class="bi ${icon}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(-150%)';
            setTimeout(() => {
                toast.remove();
            }, 300); // Wait for CSS transition to finish 
        }, 3000);
    };

});
