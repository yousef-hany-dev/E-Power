/* ============================
   EPOWER CUSTOMER RATING SYSTEM
   ============================ */

const RATINGS_KEY = 'epower_ratings';

// ─── Storage helpers ────────────────────────────────────────
function getRatingsStore() {
    try { return JSON.parse(localStorage.getItem(RATINGS_KEY)) || {}; } catch { return {}; }
}
function saveRatingsStore(data) {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(data));
}

function getRatingData(productId) {
    const store = getRatingsStore();
    return store[productId] || { total: 0, count: 0 };
}

function submitRating(productId, stars) {
    const store = getRatingsStore();
    if (!store[productId]) store[productId] = { total: 0, count: 0 };
    store[productId].total += stars;
    store[productId].count += 1;
    saveRatingsStore(store);
    return store[productId];
}

function getAverage(productId) {
    const d = getRatingData(productId);
    return d.count === 0 ? 0 : d.total / d.count;
}

// ─── Render interactive star widget ─────────────────────────
function renderStarWidget(productId, wrapperEl) {
    const avg   = getAverage(productId);
    const count = getRatingData(productId).count;
    const round = Math.round(avg);

    wrapperEl.innerHTML = `
        <div class="star-widget" data-pid="${productId}">
            <div class="stars-row">
                ${[1,2,3,4,5].map(i =>
                    `<span class="star-icon${i <= round ? ' lit' : ''}" data-val="${i}" title="Rate ${i} star${i>1?'s':''}">★</span>`
                ).join('')}
            </div>
            <span class="star-count">${count > 0 ? `(${count} review${count>1?'s':''})` : 'Be the first to rate!'}</span>
        </div>
    `;

    const widget = wrapperEl.querySelector('.star-widget');
    const icons  = widget.querySelectorAll('.star-icon');

    // Hover effects
    icons.forEach(icon => {
        icon.addEventListener('mouseover', () => {
            const val = parseInt(icon.dataset.val);
            icons.forEach(s => {
                s.classList.toggle('hover-lit', parseInt(s.dataset.val) <= val);
            });
        });
        icon.addEventListener('mouseout', () => {
            icons.forEach(s => s.classList.remove('hover-lit'));
        });
        // Click to rate
        icon.addEventListener('click', () => {
            const val = parseInt(icon.dataset.val);
            submitRating(productId, val);
            // Animate then re-render
            widget.classList.add('rated-flash');
            setTimeout(() => renderStarWidget(productId, wrapperEl), 350);
        });
    });
}

// ─── Auto-init: inject stars into all static product cards ──
document.addEventListener('DOMContentLoaded', () => {
    // Find every card that has an add-to-cart button with data-id
    document.querySelectorAll('.add-to-cart-btn[data-id]').forEach(btn => {
        const pid  = btn.dataset.id;
        const card = btn.closest('.crt');
        if (!card || card.querySelector('.star-widget-wrap')) return; // skip if already has one

        const wrap = document.createElement('div');
        wrap.className = 'star-widget-wrap';
        // Insert before the button
        card.insertBefore(wrap, btn);
        renderStarWidget(pid, wrap);
    });
});
