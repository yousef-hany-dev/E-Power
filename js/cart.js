class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('epower_cart')) || [];
        this.initUI();
        this.bindEvents();
        this.updateCart();
    }

    initUI() {
        if (!document.getElementById('cartSidebar')) {
            const cartHTML = `
                <div class="cart-overlay" id="cartOverlay"></div>
                <div class="cart-sidebar" id="cartSidebar">
                    <div class="cart-header">
                        <h2>Your Cart</h2>
                        <button class="close-cart" id="closeCart"><i class="bi bi-x-lg"></i></button>
                    </div>
                    <div class="cart-items-container" id="cartItemsContainer"></div>
                    <div class="cart-footer">
                        <div class="cart-total">
                            <span>Total</span>
                            <span id="cartTotalPrice">$0.00</span>
                        </div>
                        <button class="checkout-btn" id="checkoutBtn">
                            <i class="bi bi-bag-check"></i> Checkout
                        </button>
                    </div>
                </div>
            `;

            // ── Checkout Modal (Styled) ──────────────────────────────────
            const checkoutModalHTML = `
                <div id="checkoutModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);z-index:10000;justify-content:center;align-items:center;">
                    <div id="checkoutCard" style="background:#fff;border-radius:16px;max-width:460px;width:92%;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.25);overflow:hidden;max-height:90vh;overflow-y:auto;">

                        <!-- Header -->
                        <div style="background:linear-gradient(135deg,#6f42c1,#8f12d7);padding:20px 24px;display:flex;justify-content:space-between;align-items:center;">
                            <h3 style="margin:0;color:#fff;font-size:1.1rem;" data-i18n="confirm_order"><i class="bi bi-cart-check"></i> Confirm Order</h3>
                            <button id="closeCheckoutModal" style="background:rgba(255,255,255,0.2);border:none;border-radius:8px;color:#fff;width:32px;height:32px;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div style="padding:24px;" id="checkoutModalBody">

                            <!-- User Info Banner -->
                            <div id="userInfoBanner" style="background:#f3f0ff;border-radius:10px;padding:14px;margin-bottom:20px;display:flex;align-items:center;gap:12px;border:1px solid #ddd6fe;">
                                <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#6f42c1,#8f12d7);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1rem;flex-shrink:0;" id="userAvatar">?</div>
                                <div>
                                    <div style="font-weight:700;color:#1e1b4b;" id="userDisplayName">—</div>
                                    <div style="font-size:0.8rem;color:#6b7280;" id="userDisplayEmail">—</div>
                                </div>
                            </div>

                            <!-- Delivery Option -->
                            <p style="font-weight:700;margin:0 0 14px;color:#111;font-size:0.95rem;" data-i18n="choose_address">
                                <i class="bi bi-geo-alt"></i> Choose Delivery Address:
                            </p>

                            <!-- Option 1: Registered Address -->
                            <label id="labelRegistered" style="display:block;padding:14px;border:2px solid #ddd6fe;border-radius:10px;cursor:pointer;margin-bottom:10px;transition:all 0.2s;">
                                <div style="display:flex;align-items:center;gap:10px;">
                                    <input type="radio" name="deliveryAddress" value="registered" id="radioRegistered" checked style="accent-color:#8f12d7;width:18px;height:18px;">
                                    <div>
                                        <div style="font-weight:600;color:#111;" data-i18n="registered_address">Registered Address</div>
                                        <div style="font-size:0.82rem;color:#6b7280;margin-top:2px;" id="registeredAddressDisplay">—</div>
                                        <div style="font-size:0.82rem;color:#6b7280;" id="registeredPhoneDisplay">—</div>
                                    </div>
                                </div>
                            </label>

                            <!-- Option 2: Different Address -->
                            <label id="labelDifferent" style="display:block;padding:14px;border:2px solid #e5e7eb;border-radius:10px;cursor:pointer;margin-bottom:16px;transition:all 0.2s;">
                                <div style="display:flex;align-items:center;gap:10px;">
                                    <input type="radio" name="deliveryAddress" value="new" id="radioDifferent" style="accent-color:#8f12d7;width:18px;height:18px;">
                                    <div style="font-weight:600;color:#111;" data-i18n="different_address">Different Address</div>
                                </div>
                            </label>

                            <!-- New Address Fields -->
                            <div id="newAddressFields" style="display:none;margin-bottom:16px;animation:fadeInDown 0.25s ease;">
                                <div style="position:relative;margin-bottom:10px;">
                                    <i class="bi bi-geo-alt" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#8f12d7;"></i>
                                    <input type="text" id="newAddressInput" data-i18n-placeholder="address_detail" placeholder="Detailed Address..."
                                        style="width:100%;padding:11px 40px 11px 12px;border:1.5px solid #ddd;border-radius:8px;font-size:0.9rem;box-sizing:border-box;outline:none;transition:border 0.2s;"
                                        onfocus="this.style.borderColor='#8f12d7'" onblur="this.style.borderColor='#ddd'">
                                </div>
                                <div style="position:relative;">
                                    <i class="bi bi-telephone" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#8f12d7;"></i>
                                    <input type="tel" id="newPhoneInput" data-i18n-placeholder="phone_number" placeholder="Phone Number..."
                                        style="width:100%;padding:11px 40px 11px 12px;border:1.5px solid #ddd;border-radius:8px;font-size:0.9rem;box-sizing:border-box;outline:none;transition:border 0.2s;"
                                        onfocus="this.style.borderColor='#8f12d7'" onblur="this.style.borderColor='#ddd'">
                                </div>
                            </div>

                            <!-- Order Summary -->
                            <div id="checkoutOrderSummary" style="background:#f9fafb;border-radius:10px;padding:14px;margin-bottom:20px;border:1px solid #e5e7eb;">
                                <div style="font-weight:700;margin-bottom:10px;font-size:0.9rem;" data-i18n="order_summary"><i class="bi bi-receipt"></i> Order Summary</div>
                                <div id="checkoutItemsList" style="max-height:120px;overflow-y:auto;"></div>
                                <div style="border-top:1px solid #e5e7eb;margin-top:10px;padding-top:10px;display:flex;justify-content:space-between;font-weight:700;">
                                    <span data-i18n="total">Total</span>
                                    <span id="checkoutTotal" style="color:#8f12d7;">$0.00</span>
                                </div>
                            </div>

                            <!-- Confirm Button -->
                            <button id="confirmOrderBtn"
                                style="width:100%;background:linear-gradient(135deg,#6f42c1,#8f12d7);color:#fff;padding:14px;border:none;border-radius:10px;cursor:pointer;font-size:1rem;font-weight:700;letter-spacing:0.3px;transition:opacity 0.2s;display:flex;align-items:center;justify-content:center;gap:8px;" data-i18n="confirm_order">
                                <i class="bi bi-check-circle"></i> Confirm Order
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Order Success Toast -->
                <div id="orderSuccessToast" data-i18n="order_success_html" style="display:none;position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;padding:16px 28px;border-radius:50px;z-index:99999;font-weight:600;font-size:0.95rem;box-shadow:0 8px 30px rgba(22,163,74,0.4);text-align:center;max-width:90%;animation:slideUpFade 0.4s ease;">
                    <i class="bi bi-check-circle-fill" style="margin-left:8px;"></i> Your order has been received! We will contact you soon 🎉
                </div>

                <!-- Must Login Modal -->
                <div id="mustLoginModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);z-index:10001;justify-content:center;align-items:center;">
                    <div style="background:#fff;border-radius:16px;max-width:380px;width:92%;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.25);">
                        <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:20px 24px;">
                            <h3 style="margin:0;color:#fff;" data-i18n="login_required"><i class="bi bi-lock-fill"></i> Login Required</h3>
                        </div>
                        <div style="padding:24px;text-align:center;">
                            <div style="font-size:3rem;margin-bottom:12px;">🔐</div>
                            <p style="color:#374151;margin:0 0 20px;font-size:0.95rem;line-height:1.6;">
                                <span data-i18n="login_required_desc">You must be logged in to complete the purchase.</span><br>
                                <span style="color:#6b7280;font-size:0.85rem;" data-i18n="login_required_sub">Login or create a free account now</span>
                            </p>
                            <div style="display:flex;gap:10px;justify-content:center;">
                                <a href="login.html" style="background:linear-gradient(135deg,#6f42c1,#8f12d7);color:#fff;padding:11px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:0.9rem;" data-i18n="login_btn_html">
                                    <i class="bi bi-box-arrow-in-right"></i> Sign In
                                </a>
                                <button id="closeMustLoginModal" style="background:#f3f4f6;border:none;padding:11px 20px;border-radius:8px;cursor:pointer;font-weight:600;color:#374151;font-size:0.9rem;" data-i18n="cancel">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <style>
                @keyframes slideUpFade {
                    from { opacity:0; transform:translateX(-50%) translateY(20px); }
                    to   { opacity:1; transform:translateX(-50%) translateY(0); }
                }
                @keyframes fadeInDown {
                    from { opacity:0; transform:translateY(-8px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                #labelRegistered:has(input:checked) { border-color:#8f12d7; background:#faf5ff; }
                #labelDifferent:has(input:checked)  { border-color:#8f12d7; background:#faf5ff; }
                </style>
            `;

            document.body.insertAdjacentHTML('beforeend', cartHTML + checkoutModalHTML);
        }

        // Initialize UI Elements
        this.overlay      = document.getElementById('cartOverlay');
        this.sidebar      = document.getElementById('cartSidebar');
        this.closeBtn     = document.getElementById('closeCart');
        this.itemsContainer = document.getElementById('cartItemsContainer');
        this.totalPriceEl = document.getElementById('cartTotalPrice');

        // Setup Header Icons (add badges)
        const cartIcons = document.querySelectorAll('.bi-bag-fill');
        cartIcons.forEach(icon => {
            const parent = icon.parentElement;
            parent.classList.add('cart-icon-wrapper');
            parent.id = parent.id || ('openCartBtn_' + Math.random().toString(36).substr(2, 9));
            if (!parent.querySelector('.cart-badge')) {
                parent.insertAdjacentHTML('beforeend', '<span class="cart-badge" style="display:none;">0</span>');
            }
            parent.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCart();
            });
        });
    }

    bindEvents() {
        this.closeBtn.addEventListener('click', () => this.closeCart());
        this.overlay.addEventListener('click', () => this.closeCart());

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) checkoutBtn.addEventListener('click', () => this.handleCheckoutClick());

        // Radio change → show/hide new address fields + update border style
        document.querySelectorAll('input[name="deliveryAddress"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const newFields = document.getElementById('newAddressFields');
                if (newFields) newFields.style.display = e.target.value === 'new' ? 'block' : 'none';
            });
        });

        // Confirm order
        const confirmBtn = document.getElementById('confirmOrderBtn');
        if (confirmBtn) confirmBtn.addEventListener('click', () => this.confirmOrder());

        // Close checkout modal
        const closeCheckout = document.getElementById('closeCheckoutModal');
        if (closeCheckout) closeCheckout.addEventListener('click', () => {
            document.getElementById('checkoutModal').style.display = 'none';
        });

        // Close must-login modal
        const closeMustLogin = document.getElementById('closeMustLoginModal');
        if (closeMustLogin) closeMustLogin.addEventListener('click', () => {
            document.getElementById('mustLoginModal').style.display = 'none';
        });

        // Backdrop click closes checkout
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) checkoutModal.style.display = 'none';
        });

        // Delegate events from cart items container
        this.itemsContainer.addEventListener('click', (e) => {
            const itemEl = e.target.closest('.cart-item');
            if (!itemEl) return;
            const id = itemEl.dataset.id;

            if (e.target.closest('.cart-item-remove')) {
                this.removeItem(id);
            } else if (e.target.closest('.qty-minus')) {
                this.updateQuantity(id, -1);
            } else if (e.target.closest('.qty-plus')) {
                this.updateQuantity(id, 1);
            }
        });

        // Event Delegation for "Add to Cart" buttons
        document.body.addEventListener('click', (e) => {
            const addBtn = e.target.closest('.add-to-cart-btn');
            if (addBtn) {
                e.preventDefault();
                const product = {
                    id:    addBtn.dataset.id,
                    name:  addBtn.dataset.name,
                    price: parseFloat(addBtn.dataset.price),
                    image: addBtn.dataset.image
                };
                this.addItem(product);
            }
        });
    }

    openCart() {
        this.sidebar.classList.add('open');
        this.overlay.classList.add('show');
    }

    closeCart() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('show');
    }

    handleCheckoutClick() {
        // 1. Check cart is not empty
        if (this.cart.length === 0) {
            this.showCartToast(window.t ? window.t('cart_empty_toast') : 'Your cart is empty! Add products first 🛒', '#d97706');
            return;
        }

        // 2. Check if user is logged in
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            // Show styled "must login" modal
            const mustLoginModal = document.getElementById('mustLoginModal');
            if (mustLoginModal) mustLoginModal.style.display = 'flex';
            return;
        }

        // 3. User is logged in → populate checkout modal and show it
        this.populateCheckoutModal(currentUser);
        document.getElementById('checkoutModal').style.display = 'flex';
    }

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('epower_currentUser'));
        } catch { return null; }
    }

    populateCheckoutModal(user) {
        // User Info Banner
        const avatar    = document.getElementById('userAvatar');
        const nameEl    = document.getElementById('userDisplayName');
        const emailEl   = document.getElementById('userDisplayEmail');
        const addrEl    = document.getElementById('registeredAddressDisplay');
        const phoneEl   = document.getElementById('registeredPhoneDisplay');

        if (avatar)  avatar.textContent  = (user.name || '?').charAt(0).toUpperCase();
        if (nameEl)  nameEl.textContent  = user.name  || '—';
        if (emailEl) emailEl.textContent = user.email || '—';

        const hasAddress = user.address && user.phone;
        if (addrEl)  addrEl.textContent  = user.address ? `📍 ${user.address}` : (window.t ? window.t('no_registered_address_badge') : '⚠️ No registered address');
        if (phoneEl) phoneEl.textContent = user.phone   ? `📞 ${user.phone}`   : '';

        // If no registered address → force "different address" option
        const radioRegistered = document.getElementById('radioRegistered');
        const radioDifferent  = document.getElementById('radioDifferent');
        const newFields       = document.getElementById('newAddressFields');
        const labelRegistered = document.getElementById('labelRegistered');

        if (!hasAddress) {
            if (radioRegistered) radioRegistered.disabled = true;
            if (labelRegistered) labelRegistered.style.opacity = '0.5';
            if (radioDifferent)  { radioDifferent.checked = true; }
            if (newFields)       newFields.style.display = 'block';
        } else {
            if (radioRegistered) { radioRegistered.disabled = false; radioRegistered.checked = true; }
            if (labelRegistered) labelRegistered.style.opacity = '1';
            if (newFields)       newFields.style.display = 'none';
        }

        // Reset new address inputs
        const newAddr  = document.getElementById('newAddressInput');
        const newPhone = document.getElementById('newPhoneInput');
        if (newAddr)  newAddr.value  = '';
        if (newPhone) newPhone.value = '';

        // Order Summary
        const itemsList = document.getElementById('checkoutItemsList');
        const totalEl   = document.getElementById('checkoutTotal');
        if (itemsList) {
            itemsList.innerHTML = this.cart.map(item => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #f3f4f6;font-size:0.85rem;">
                    <span style="color:#374151;">${item.name} <span style="color:#9ca3af;">×${item.quantity}</span></span>
                    <span style="font-weight:600;color:#111;">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
        }
        if (totalEl) {
            const total = this.cart.reduce((s, i) => s + i.price * i.quantity, 0);
            totalEl.textContent = '$' + total.toFixed(2);
        }
    }

    confirmOrder() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        const addressType = document.querySelector('input[name="deliveryAddress"]:checked')?.value;
        let deliveryAddress = currentUser.address || '';
        let deliveryPhone   = currentUser.phone   || '';

        if (addressType === 'new') {
            deliveryAddress = (document.getElementById('newAddressInput')?.value || '').trim();
            deliveryPhone   = (document.getElementById('newPhoneInput')?.value  || '').trim();
            if (!deliveryAddress || !deliveryPhone) {
                this.shakeField(!deliveryAddress ? 'newAddressInput' : 'newPhoneInput');
                this.showCartToast(window.t ? window.t('enter_address_toast') : '⚠️ Please enter the address and phone number', '#dc2626');
                return;
            }
        } else {
            if (!deliveryAddress || !deliveryPhone) {
                this.showCartToast(window.t ? window.t('no_registered_address_toast') : '⚠️ No registered address. Choose "Different Address"', '#dc2626');
                return;
            }
        }

        const total = this.cart.reduce((s, i) => s + i.price * i.quantity, 0);
        const orders = JSON.parse(localStorage.getItem('epower_orders')) || [];
        const newOrder = {
            id:      'ord_' + Date.now(),
            user:    currentUser.name,
            email:   currentUser.email,
            address: deliveryAddress,
            phone:   deliveryPhone,
            items:   [...this.cart],
            total:   total,
            status:  'new',   // 'new' → triggers badge in admin
            date:    new Date().toISOString()
        };
        orders.push(newOrder);
        localStorage.setItem('epower_orders', JSON.stringify(orders));

        // Clear cart
        this.cart = [];
        this.saveCart();

        // Close modals
        document.getElementById('checkoutModal').style.display = 'none';
        this.closeCart();

        // Show success toast
        this.showOrderSuccessToast();
    }

    showOrderSuccessToast() {
        const toast = document.getElementById('orderSuccessToast');
        if (!toast) return;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.animation = 'none';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                toast.style.display = 'none';
                toast.style.opacity = '1';
                toast.style.animation = '';
            }, 500);
        }, 5000);
    }

    showCartToast(message, bgColor = '#374151') {
        let toast = document.getElementById('cartMiniToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cartMiniToast';
            toast.style.cssText = `
                position:fixed;top:80px;left:50%;transform:translateX(-50%);
                padding:12px 24px;border-radius:50px;z-index:99998;
                font-weight:600;font-size:0.9rem;color:#fff;text-align:center;
                box-shadow:0 4px 20px rgba(0,0,0,0.2);transition:opacity 0.3s;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.background = bgColor;
        toast.style.opacity = '1';
        toast.style.display = 'block';
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => { toast.style.display = 'none'; }, 300); }, 3000);
    }

    shakeField(fieldId) {
        const el = document.getElementById(fieldId);
        if (!el) return;
        el.style.animation = 'none';
        el.style.borderColor = '#dc2626';
        el.style.transition = 'none';
        let pos = 0;
        const shake = setInterval(() => {
            el.style.marginLeft = (pos % 2 === 0 ? '6px' : '-6px');
            pos++;
            if (pos > 6) { clearInterval(shake); el.style.marginLeft = '0'; }
        }, 60);
    }

    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        if (typeof window.showToast === 'function') {
            window.showToast(`${product.name} added to cart!`);
        }
    }

    removeItem(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
    }

    updateQuantity(id, change) {
        const item = this.cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.saveCart();
            }
        }
    }

    saveCart() {
        localStorage.setItem('epower_cart', JSON.stringify(this.cart));
        this.updateCart();
    }

    updateCart() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-badge').forEach(badge => {
            if (totalItems > 0) {
                badge.innerText = totalItems;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        });

        if (this.cart.length === 0) {
            this.itemsContainer.innerHTML = `
                <div style="text-align:center;padding:40px 20px;color:#9ca3af;">
                    <i class="bi bi-cart-x" style="font-size:3rem;display:block;margin-bottom:12px;"></i>
                    <span data-i18n="cart_empty_msg">${window.t ? window.t('cart_empty_msg') : 'Your cart is empty!'}</span>
                </div>`;
            this.totalPriceEl.innerText = '$0.00';
            return;
        }

        let html  = '';
        let total = 0;

        this.cart.forEach(item => {
            total += item.price * item.quantity;
            html  += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='imgs/Image-compressed_Webpifier.webp'">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-qty">
                            <button class="qty-minus">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-plus">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove"><i class="bi bi-trash"></i></button>
                </div>
            `;
        });

        this.itemsContainer.innerHTML = html;
        this.totalPriceEl.innerText   = '$' + total.toFixed(2);
    }
}

// Initialize Cart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
});
