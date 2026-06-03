/* ============================
   EPOWER ADMIN DASHBOARD JS
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Credentials helpers ───────────────────────────────
    const CRED_KEY = 'epower_admin_creds';

    function getCreds() {
        try {
            const stored = JSON.parse(localStorage.getItem(CRED_KEY));
            if (stored && stored.username && stored.password) return stored;
        } catch {}
        return { username: 'admin', password: '12345' };
    }

    function saveCreds(creds) {
        localStorage.setItem(CRED_KEY, JSON.stringify(creds));
    }

    // ─── Auth ──────────────────────────────────────────────
    const loginModal    = document.getElementById('adminLoginModal');
    const loginBtn      = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('adminUsername');
    const passwordInput = document.getElementById('adminPassword');
    const loginError    = document.getElementById('loginError');
    const loginHint     = document.getElementById('loginHint');
    const logoutBtn     = document.getElementById('logoutBtn');

    function updateLoginHint() {
        const c = getCreds();
        loginHint.textContent = `Default: ${c.username} / ${'•'.repeat(c.password.length)}`;
    }
    updateLoginHint();

    function checkAuth() {
        const ok = sessionStorage.getItem('epower_admin') === 'true';
        loginModal.style.display = ok ? 'none' : 'flex';
        if (ok) updateTopbarUser();
    }

    function updateTopbarUser() {
        const span = document.getElementById('topbarUsername');
        if (span) span.textContent = getCreds().username;
        const dispEl = document.getElementById('displayUsername');
        if (dispEl) dispEl.textContent = getCreds().username;
    }

    loginBtn.addEventListener('click', () => {
        const u = usernameInput.value.trim();
        const p = passwordInput.value.trim();
        const creds = getCreds();
        if (u === creds.username && p === creds.password) {
            sessionStorage.setItem('epower_admin', 'true');
            loginModal.style.display = 'none';
            loginError.style.display = 'none';
            renderAll();
            updateTopbarUser();
        } else {
            loginError.textContent = '❌ Invalid username or password.';
            loginError.style.display = 'block';
            passwordInput.value = '';
        }
    });

    [usernameInput, passwordInput].forEach(el => {
        el.addEventListener('keydown', e => { if (e.key === 'Enter') loginBtn.click(); });
    });

    logoutBtn?.addEventListener('click', e => {
        e.preventDefault();
        sessionStorage.removeItem('epower_admin');
        checkAuth();
    });

    checkAuth();

    // ─── Tab Switching ─────────────────────────────────────
    const navItems    = document.querySelectorAll('.nav-item[data-tab]');
    const tabPanels   = {
        products: document.getElementById('tab-products'),
        offers:   document.getElementById('tab-offers'),
        orders:   document.getElementById('tab-orders'),
        users:    document.getElementById('tab-users'),
        settings: document.getElementById('tab-settings')
    };
    const topbarTitle = document.getElementById('topbarTitle');
    const tabTitles   = {
        products: 'Products Management',
        offers:   'Header Offers Management',
        orders:   'Call Center — Orders',
        users:    'Registered Accounts',
        settings: 'Account Settings'
    };

    navItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const tab = item.dataset.tab;
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            Object.values(tabPanels).forEach(p => { if(p) p.style.display = 'none'; });
            if (tabPanels[tab]) tabPanels[tab].style.display = 'block';
            topbarTitle.textContent = tabTitles[tab] || '';
            if (tab === 'settings') updateTopbarUser();
            if (tab === 'orders')   renderOrdersTable();
            if (tab === 'users')    renderUsersTable();
            if (window.innerWidth <= 900 && typeof closeAdminSidebar === 'function') closeAdminSidebar();
        });
    });

    document.getElementById('menuToggle').addEventListener('click', () => {
        const sidebar = document.getElementById('adminSidebar');
        const isOpen  = sidebar.classList.toggle('open');
        adminOverlay.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // ─── Mobile Sidebar Overlay (click outside to close) ───
    let adminOverlay = document.getElementById('adminSidebarOverlay');
    if (!adminOverlay) {
        adminOverlay = document.createElement('div');
        adminOverlay.id = 'adminSidebarOverlay';
        adminOverlay.className = 'admin-sidebar-overlay';
        document.body.appendChild(adminOverlay);
    }

    function closeAdminSidebar() {
        document.getElementById('adminSidebar').classList.remove('open');
        adminOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    adminOverlay.addEventListener('click', closeAdminSidebar);

    // Escape key also closes it
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeAdminSidebar();
    });

    // ─── Image Compression (Canvas) ───────────────────────
    /**
     * Compresses any image file to JPEG using Canvas.
     * Max dimension: 700px — quality: 0.78
     * Returns a compact Base64 string safe for localStorage.
     */
    function compressImage(file, maxDim = 700, quality = 0.78) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = e => {
                const img = new Image();
                img.onerror = reject;
                img.onload = () => {
                    let { naturalWidth: w, naturalHeight: h } = img;
                    // Scale down if larger than maxDim
                    if (w > maxDim || h > maxDim) {
                        const ratio = Math.min(maxDim / w, maxDim / h);
                        w = Math.round(w * ratio);
                        h = Math.round(h * ratio);
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width  = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    // White background for transparent PNGs
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, w, h);
                    ctx.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // ─── Image Source Tabs (URL / File upload) ─────────────
    // Shared state for base64 images
    const base64Store = { add: null, offer: null, edit: null };

    function setupImageTabs(formKey, urlPaneId, filePaneId, urlInputId, fileInputId, previewWrapId, previewImgId) {
        const urlPane   = document.getElementById(urlPaneId);
        const filePane  = document.getElementById(filePaneId);
        const urlInput  = document.getElementById(urlInputId);
        const fileInput = document.getElementById(fileInputId);
        const prevWrap  = document.getElementById(previewWrapId);
        const prevImg   = document.getElementById(previewImgId);

        // Tab buttons for this form
        document.querySelectorAll(`.img-src-tab[data-form="${formKey}"]`).forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll(`.img-src-tab[data-form="${formKey}"]`).forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const src = tab.dataset.src;
                if (src === 'url') {
                    urlPane.style.display = 'block';
                    filePane.style.display = 'none';
                    base64Store[formKey] = null;
                } else {
                    urlPane.style.display = 'none';
                    filePane.style.display = 'block';
                }
            });
        });

        // Live preview from URL
        urlInput?.addEventListener('input', () => {
            const url = urlInput.value.trim();
            base64Store[formKey] = null;
            if (url) { prevImg.src = url; prevWrap.style.display = 'block'; }
            else { prevWrap.style.display = 'none'; }
        });

        // File upload → Compress → Base64
        fileInput?.addEventListener('change', async () => {
            const file = fileInput.files[0];
            if (!file) return;

            // Show loading state
            const lbl = filePane.querySelector('span');
            if (lbl) lbl.textContent = '⏳ Compressing...';

            try {
                const compressed = await compressImage(file);
                base64Store[formKey] = compressed;
                prevImg.src = compressed;
                prevWrap.style.display = 'block';
                if (lbl) lbl.textContent = `✅ ${file.name} (compressed)`;
            } catch (err) {
                console.error('Compression failed:', err);
                if (lbl) lbl.textContent = '❌ Failed to load image. Try another file.';
            }
        });
    }

    // Setup tabs for all 3 forms
    setupImageTabs('add',   'addUrlPane',   'addFilePane',   'pImage',      'pImageFile',   'imgPreviewWrap',      'imgPreview');
    setupImageTabs('offer', 'offerUrlPane', 'offerFilePane', 'offerImage',  'offerImageFile','offerImgPreviewWrap', 'offerImgPreview');
    setupImageTabs('edit',  'editUrlPane',  'editFilePane',  'editPImageUrl','editPImageFile','editImgPreviewWrap',  'editImgPreview');

    // ─── Helpers ───────────────────────────────────────────
    function getOffers() {
        try { return JSON.parse(localStorage.getItem('epower_offers')) || []; } catch { return []; }
    }
    function saveOffers(offers) { localStorage.setItem('epower_offers', JSON.stringify(offers)); }

    function getOrders() {
        try { return JSON.parse(localStorage.getItem('epower_orders')) || []; } catch { return []; }
    }
    function saveOrders(orders) { localStorage.setItem('epower_orders', JSON.stringify(orders)); }

    function getUsers() {
        try { return JSON.parse(localStorage.getItem('epower_users')) || []; } catch { return []; }
    }

    function showAlert(el, msg, type) {
        el.textContent = msg;
        el.className = `alert-msg ${type}`;
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 4000);
    }

    // ─── Stats ─────────────────────────────────────────────
    function updateStats() {
        const all    = typeof getAllProducts === 'function' ? getAllProducts() : [];
        const custom = JSON.parse(localStorage.getItem('epower_custom_products') || '[]');
        const offers = getOffers();
        document.getElementById('totalProductsCount').textContent  = all.length;
        document.getElementById('customProductsCount').textContent = custom.length;
        document.getElementById('totalOffersCount').textContent    = offers.length;
    }

    // ─── Orders Badge (Call Center Notification) ──────────
    function updateOrdersBadge() {
        const badge = document.getElementById('ordersBadge');
        if (!badge) return;
        const orders = getOrders();
        // Count orders that are 'new' (not yet opened by call center)
        const newCount = orders.filter(o => o.status === 'new').length;
        if (newCount > 0) {
            badge.textContent = newCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }

    // ─── PRODUCTS ──────────────────────────────────────────
    const productForm  = document.getElementById('addProductForm');
    const productAlert = document.getElementById('productAlert');

    // Reset add form image state
    function resetAddImageState() {
        base64Store['add'] = null;
        document.getElementById('pImage').value = '';
        document.getElementById('pImageFile').value = '';
        document.getElementById('imgPreviewWrap').style.display = 'none';
        // Switch back to URL tab
        document.querySelectorAll('.img-src-tab[data-form="add"]').forEach(t => t.classList.remove('active'));
        document.querySelector('.img-src-tab[data-form="add"][data-src="url"]').classList.add('active');
        document.getElementById('addUrlPane').style.display = 'block';
        document.getElementById('addFilePane').style.display = 'none';
        const lbl = document.querySelector('#addFilePane span');
        if (lbl) lbl.textContent = 'Click to choose image from your device';
    }

    productForm?.addEventListener('submit', e => {
        e.preventDefault();
        const name     = document.getElementById('pName').value.trim();
        const price    = parseFloat(document.getElementById('pPrice').value);
        const category = document.getElementById('pCategory').value;
        let   image    = base64Store['add'] || document.getElementById('pImage').value.trim();
        if (!image) image = 'imgs/Image-compressed_Webpifier.webp';

        if (!name || isNaN(price) || !category) {
            showAlert(productAlert, '⚠️ Please fill in all required fields.', 'error');
            return;
        }

        if (typeof addCustomProduct === 'function') {
            addCustomProduct({ name, price, category, image, reviews: 0 });
            showAlert(productAlert, `✅ "${name}" added successfully!`, 'success');
            productForm.reset();
            resetAddImageState();
            renderProductsTable();
            updateStats();
        } else {
            showAlert(productAlert, '❌ Error: products.js not loaded.', 'error');
        }
    });

    // ─── Products Table ────────────────────────────────────
    function renderProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;
        const all    = typeof getAllProducts === 'function' ? getAllProducts() : [];
        const custom = new Set((JSON.parse(localStorage.getItem('epower_custom_products') || '[]')).map(p => p.id));

        if (all.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-sub);">No products found.</td></tr>`;
            return;
        }

        tbody.innerHTML = all.map(p => {
            const isCustom = custom.has(p.id);
            const imgSrc   = p.image && p.image.length > 200 ? p.image : p.image; // base64 or path
            return `
            <tr>
                <td><img class="table-thumb" src="${imgSrc}" alt="${p.name}" onerror="this.src='imgs/Image-compressed_Webpifier.webp'"></td>
                <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${p.name}">${p.name}</td>
                <td><span style="font-size:0.8rem;color:var(--text-sub);">${p.category}</span></td>
                <td><strong>$${Number(p.price).toFixed(2)}</strong></td>
                <td><span class="badge ${isCustom ? 'custom' : 'default'}">${isCustom ? 'Admin' : 'Default'}</span></td>
                <td class="action-cell">
                    <button class="btn-edit-row" title="${isCustom ? 'Edit product' : 'Cannot edit default products'}"
                        data-id="${p.id}" ${!isCustom ? 'disabled' : ''}>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-delete-row" title="${isCustom ? 'Delete product' : 'Cannot delete default products'}"
                        data-id="${p.id}" ${!isCustom ? 'disabled' : ''}>
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`;
        }).join('');

        // Delete handlers
        tbody.querySelectorAll('.btn-delete-row:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (!confirm('Delete this product?')) return;
                let stored = JSON.parse(localStorage.getItem('epower_custom_products') || '[]');
                stored = stored.filter(p => p.id !== id);
                localStorage.setItem('epower_custom_products', JSON.stringify(stored));
                renderProductsTable();
                updateStats();
            });
        });

        // Edit handlers
        tbody.querySelectorAll('.btn-edit-row:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                openEditModal(id);
            });
        });
    }

    document.getElementById('clearAllProducts')?.addEventListener('click', () => {
        if (!confirm('Delete ALL admin-added products? Default products will remain.')) return;
        localStorage.removeItem('epower_custom_products');
        renderProductsTable();
        updateStats();
    });

    // ─── Edit Product Modal ────────────────────────────────
    const editModal   = document.getElementById('editProductModal');
    const editForm    = document.getElementById('editProductForm');
    const editAlert   = document.getElementById('editProductAlert');
    const closeEdit   = document.getElementById('closeEditModal');
    const cancelEdit  = document.getElementById('cancelEditModal');

    function openEditModal(productId) {
        const stored = JSON.parse(localStorage.getItem('epower_custom_products') || '[]');
        const product = stored.find(p => p.id === productId);
        if (!product) return;

        // Fill form
        document.getElementById('editProductId').value  = product.id;
        document.getElementById('editPName').value      = product.name;
        document.getElementById('editPPrice').value     = product.price;
        document.getElementById('editPCategory').value  = product.category;
        document.getElementById('editPImageUrl').value  = product.image && !product.image.startsWith('data:') ? product.image : '';

        // Handle preview
        const prevWrap = document.getElementById('editImgPreviewWrap');
        const prevImg  = document.getElementById('editImgPreview');
        if (product.image) {
            prevImg.src = product.image;
            prevWrap.style.display = 'block';
        } else {
            prevWrap.style.display = 'none';
        }

        // Reset to URL tab
        base64Store['edit'] = null;
        document.querySelectorAll('.img-src-tab[data-form="edit"]').forEach(t => t.classList.remove('active'));
        document.querySelector('.img-src-tab[data-form="edit"][data-src="url"]').classList.add('active');
        document.getElementById('editUrlPane').style.display = 'block';
        document.getElementById('editFilePane').style.display = 'none';

        editModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeEditModal() {
        editModal.style.display = 'none';
        document.body.style.overflow = '';
        editAlert.style.display = 'none';
    }

    closeEdit?.addEventListener('click', closeEditModal);
    cancelEdit?.addEventListener('click', closeEditModal);
    editModal?.addEventListener('click', e => { if (e.target === editModal) closeEditModal(); });

    editForm?.addEventListener('submit', e => {
        e.preventDefault();
        const id       = document.getElementById('editProductId').value;
        const name     = document.getElementById('editPName').value.trim();
        const price    = parseFloat(document.getElementById('editPPrice').value);
        const category = document.getElementById('editPCategory').value;
        let   image    = base64Store['edit'] || document.getElementById('editPImageUrl').value.trim();

        if (!name || isNaN(price) || !category) {
            showAlert(editAlert, '⚠️ Please fill in all required fields.', 'error');
            return;
        }

        let stored = JSON.parse(localStorage.getItem('epower_custom_products') || '[]');
        const idx  = stored.findIndex(p => p.id === id);
        if (idx === -1) {
            showAlert(editAlert, '❌ Product not found.', 'error');
            return;
        }

        if (!image) image = stored[idx].image || 'imgs/Image-compressed_Webpifier.webp';
        stored[idx] = { ...stored[idx], name, price, category, image };
        localStorage.setItem('epower_custom_products', JSON.stringify(stored));

        closeEditModal();
        renderProductsTable();
        updateStats();

        // Show success in products tab
        showAlert(productAlert, `✅ "${name}" updated successfully!`, 'success');
    });

    // ─── OFFERS ───────────────────────────────────────────
    const offerForm  = document.getElementById('addOfferForm');
    const offerAlert = document.getElementById('offerAlert');

    function resetOfferImageState() {
        base64Store['offer'] = null;
        document.getElementById('offerImage').value = '';
        document.getElementById('offerImageFile').value = '';
        document.getElementById('offerImgPreviewWrap').style.display = 'none';
        document.querySelectorAll('.img-src-tab[data-form="offer"]').forEach(t => t.classList.remove('active'));
        document.querySelector('.img-src-tab[data-form="offer"][data-src="url"]').classList.add('active');
        document.getElementById('offerUrlPane').style.display = 'block';
        document.getElementById('offerFilePane').style.display = 'none';
        const lbl = document.querySelector('#offerFilePane span');
        if (lbl) lbl.textContent = 'Click to choose image from your device';
    }

    // ─── FIX #1 & #2: Discount Logic (Full Smart Calculation) ──
    const offerOldPrice        = document.getElementById('offerOldPrice');
    const offerPrice           = document.getElementById('offerPrice');
    const offerDiscountPercent = document.getElementById('offerDiscountPercent');
    const offerHasDiscount     = document.getElementById('offerHasDiscount');
    const discountRow          = document.getElementById('offerDiscountRow');

    // Show/hide discount percent field based on checkbox
    offerHasDiscount?.addEventListener('change', (e) => {
        if (discountRow) discountRow.style.display = e.target.checked ? 'block' : 'none';
        else if (offerDiscountPercent) offerDiscountPercent.style.display = e.target.checked ? 'block' : 'none';

        // Auto-calculate % if both prices are filled
        if (e.target.checked && offerOldPrice?.value && offerPrice?.value) {
            const oldP = parseFloat(offerOldPrice.value);
            const newP = parseFloat(offerPrice.value);
            if (oldP > 0 && newP < oldP) {
                offerDiscountPercent.value = (((oldP - newP) / oldP) * 100).toFixed(0);
            }
        }
    });

    // Scenario A: User types new price → auto-calculate % discount
    offerPrice?.addEventListener('input', () => {
        if (offerHasDiscount?.checked && offerOldPrice?.value) {
            const oldP = parseFloat(offerOldPrice.value);
            const newP = parseFloat(offerPrice.value);
            if (oldP > 0 && newP >= 0 && newP <= oldP) {
                offerDiscountPercent.value = (((oldP - newP) / oldP) * 100).toFixed(0);
            }
        }
    });

    // Scenario B: User types % → auto-calculate new price from old price
    offerDiscountPercent?.addEventListener('input', () => {
        if (offerHasDiscount?.checked && offerOldPrice?.value) {
            const oldP = parseFloat(offerOldPrice.value);
            const pct  = parseFloat(offerDiscountPercent.value);
            if (oldP > 0 && pct >= 0 && pct <= 100) {
                offerPrice.value = (oldP - (oldP * pct / 100)).toFixed(2);
            }
        }
    });

    // Scenario C: User types old price → re-calculate % if new price already exists
    offerOldPrice?.addEventListener('input', () => {
        if (offerHasDiscount?.checked && offerPrice?.value) {
            const oldP = parseFloat(offerOldPrice.value);
            const newP = parseFloat(offerPrice.value);
            if (oldP > 0 && newP >= 0 && newP <= oldP) {
                offerDiscountPercent.value = (((oldP - newP) / oldP) * 100).toFixed(0);
            }
        } else if (offerHasDiscount?.checked && offerDiscountPercent?.value) {
            // If % is already set, recalculate new price
            const oldP = parseFloat(offerOldPrice.value);
            const pct  = parseFloat(offerDiscountPercent.value);
            if (oldP > 0 && pct >= 0 && pct <= 100) {
                offerPrice.value = (oldP - (oldP * pct / 100)).toFixed(2);
            }
        }
    });

    offerForm?.addEventListener('submit', e => {
        e.preventDefault();
        const title   = document.getElementById('offerTitle').value.trim();
        const price   = parseFloat(offerPrice.value);
        const oldPrice= parseFloat(offerOldPrice.value);
        const btnText = document.getElementById('offerBtnText').value.trim() || 'Buy Now';
        const tag     = document.getElementById('offerTag').value.trim();
        const desc    = document.getElementById('offerDesc').value.trim();
        const image   = base64Store['offer'] || document.getElementById('offerImage').value.trim();

        const hasDiscount     = offerHasDiscount?.checked || false;
        const discountPercent = hasDiscount ? (parseInt(offerDiscountPercent.value) || 0) : 0;

        if (!title || isNaN(price) || !image) {
            showAlert(offerAlert, '⚠️ Title, price, and image are required.', 'error');
            return;
        }

        // Validate: old price must be greater than new price if set
        if (!isNaN(oldPrice) && oldPrice > 0 && oldPrice <= price) {
            showAlert(offerAlert, '⚠️ Old price must be greater than the discounted price.', 'error');
            return;
        }

        const offers = getOffers();
        offers.push({
            id: 'off_' + Date.now(),
            title,
            price,
            oldPrice: isNaN(oldPrice) || oldPrice <= 0 ? null : oldPrice,
            btnText,
            tag,
            desc,
            image,
            hasDiscount,
            discountPercent
        });
        saveOffers(offers);

        showAlert(offerAlert, `✅ Offer "${title}" added!`, 'success');
        offerForm.reset();
        resetOfferImageState();
        // Hide discount row after reset
        if (discountRow) discountRow.style.display = 'none';
        else if (offerDiscountPercent) offerDiscountPercent.style.display = 'none';
        renderOffersGrid();
        updateStats();
    });

    function renderOffersGrid() {
        const grid = document.getElementById('offersGrid');
        if (!grid) return;
        const offers = getOffers();

        if (offers.length === 0) {
            grid.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-megaphone"></i>
                <p>No offers yet. Add your first offer above.</p>
            </div>`;
            return;
        }

        grid.innerHTML = offers.map(o => `
        <div class="offer-card">
            <img src="${o.image}" alt="${o.title}" onerror="this.style.background='#f0e6ff';this.src=''">
            <button class="offer-card-delete" data-id="${o.id}" title="Delete offer">
                <i class="bi bi-trash"></i>
            </button>
            <div class="offer-card-body">
                <div class="offer-card-title">${o.title}</div>
                <div class="offer-card-price">
                    ${o.oldPrice ? `<span style="text-decoration:line-through;color:red;margin-right:8px;font-size:0.9em;font-weight:600;">$${Number(o.oldPrice).toFixed(2)}</span>` : ''}
                    <span style="color:var(--primary);font-weight:700;">$${Number(o.price).toFixed(2)}</span>
                    ${o.hasDiscount && o.discountPercent ? `<span style="background:red;color:white;border-radius:20px;padding:2px 8px;font-size:0.75em;font-weight:700;margin-left:6px;">-${o.discountPercent}%</span>` : ''}
                </div>
                ${o.tag  ? `<div class="offer-card-tag"><i class="bi bi-tag"></i> ${o.tag}</div>` : ''}
                ${o.desc ? `<div class="offer-card-tag" style="margin-top:4px;"><i class="bi bi-info-circle"></i> ${o.desc}</div>` : ''}
                <div style="margin-top:10px;">
                    <span style="font-size:0.78rem;background:rgba(143,18,215,0.1);color:var(--primary);padding:3px 10px;border-radius:20px;font-weight:600;">
                        ${o.btnText}
                    </span>
                </div>
            </div>
        </div>`).join('');

        grid.querySelectorAll('.offer-card-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (!confirm('Delete this offer?')) return;
                const updated = getOffers().filter(o => o.id !== id);
                saveOffers(updated);
                renderOffersGrid();
                updateStats();
            });
        });
    }

    document.getElementById('clearAllOffers')?.addEventListener('click', () => {
        if (!confirm('Delete ALL offers?')) return;
        saveOffers([]);
        renderOffersGrid();
        updateStats();
    });

    // ─── FIX #3: USERS TABLE ───────────────────────────────
    function renderUsersTable() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;
        const users = getUsers();

        if (users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-sub);">
                <i class="bi bi-people" style="font-size:2rem;display:block;margin-bottom:8px;opacity:0.4;"></i>
                No registered accounts yet.
            </td></tr>`;
            return;
        }

        tbody.innerHTML = users.map(u => `
            <tr>
                <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--primary),#7c3aed);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.85rem;flex-shrink:0;">
                            ${(u.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <span>${u.name || '—'}</span>
                    </div>
                </td>
                <td>${u.email || '—'}</td>
                <td>${u.phone || '—'}</td>
                <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${u.address || ''}">${u.address || '—'}</td>
                <td style="color:var(--text-sub);font-size:0.82rem;">${u.registeredAt ? new Date(u.registeredAt).toLocaleDateString('ar-EG') : '—'}</td>
            </tr>
        `).join('');
    }

    // ─── FIX #4: ORDERS TABLE (Call Center) ───────────────
    function renderOrdersTable() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;
        const orders = getOrders();

        // Mark all 'new' orders as 'seen' when tab is opened
        let changed = false;
        const updated = orders.map(o => {
            if (o.status === 'new') {
                changed = true;
                return { ...o, status: 'pending' }; // Seen by call center, awaiting processing
            }
            return o;
        });
        if (changed) {
            saveOrders(updated);
            updateOrdersBadge();
        }

        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-sub);">
                <i class="bi bi-headset" style="font-size:2rem;display:block;margin-bottom:8px;opacity:0.4;"></i>
                No orders yet.
            </td></tr>`;
            return;
        }

        // Show newest first
        const sorted = [...orders].reverse();

        tbody.innerHTML = sorted.map(o => {
            const statusConfig = {
                new:       { label: (window.t ? window.t('new_orders') : 'New') + ' 🔴',       cls: 'status-new'       },
                pending:   { label: window.t ? window.t('pending') : 'Pending',   cls: 'status-pending'   },
                confirmed: { label: (window.t ? window.t('delivered') : 'Confirmed') + ' ✅',        cls: 'status-confirmed' },
                cancelled: { label: (window.t ? window.t('cancelled') : 'Cancelled') + ' ❌',        cls: 'status-cancelled' }
            };
            const sc = statusConfig[o.status] || statusConfig['pending'];
            const dateStr = o.date ? new Date(o.date).toLocaleString(window.currentLang === 'ar' ? 'ar-EG' : 'en-US') : '—';

            return `
            <tr data-order-id="${o.id}">
                <td style="font-family:monospace;font-size:0.78rem;color:var(--text-sub);">#${o.id.replace('ord_','')}</td>
                <td>
                    <div style="font-weight:600;">${o.user || '—'}</div>
                    <div style="font-size:0.78rem;color:var(--text-sub);">${o.email || ''}</div>
                </td>
                <td><strong style="color:var(--primary);">$${Number(o.total || 0).toFixed(2)}</strong></td>
                <td><span class="order-status-badge ${sc.cls}">${sc.label}</span></td>
                <td style="font-size:0.8rem;color:var(--text-sub);">${dateStr}</td>
                <td class="action-cell">
                    <button class="btn-view-order btn-edit-row" data-id="${o.id}" title="${window.t ? window.t('view_details') : 'View Details'}">
                        <i class="bi bi-eye"></i> <span data-i18n="view_details">${window.t ? window.t('view_details') : 'View'}</span>
                    </button>
                </td>
            </tr>`;
        }).join('');

        tbody.querySelectorAll('.btn-view-order').forEach(btn => {
            btn.addEventListener('click', () => openOrderDetails(btn.dataset.id));
        });
    }

    // ─── Order Details Modal ───────────────────────────────
    function openOrderDetails(orderId) {
        const orders = getOrders();
        const order  = orders.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.getElementById('orderDetailsModal');
        const body  = document.getElementById('orderDetailsBody');
        if (!modal || !body) return;

        const itemsHtml = (order.items || []).map(item => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid #eee;border-radius:8px;margin-bottom:8px;">
                <img src="${item.image}" alt="${item.name}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;"
                     onerror="this.src='imgs/Image-compressed_Webpifier.webp'">
                <div style="flex:1;">
                    <div style="font-weight:600;">${item.name}</div>
                    <div style="color:#888;font-size:0.85rem;">Qty: ${item.quantity} × $${Number(item.price).toFixed(2)}</div>
                </div>
                <div style="font-weight:700;color:var(--primary);">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        body.innerHTML = `
            <div style="display:grid;gap:16px;">
                <!-- Customer Info -->
                <div style="background:#f8f6ff;border-radius:10px;padding:16px;border-right:4px solid var(--primary);">
                    <h4 style="margin:0 0 12px;color:var(--primary);"><i class="bi bi-person-circle"></i> <span data-i18n="customer">${window.t ? window.t('customer') : 'Customer'}</span></h4>
                    <div style="display:grid;gap:8px;font-size:0.92rem;">
                        <div><strong>${window.t ? window.t('user_name') : 'Name'}:</strong> ${order.user || '—'}</div>
                        <div><strong>${window.t ? window.t('user_email') : 'Email'}:</strong> ${order.email || '—'}</div>
                        <div><strong>${window.t ? window.t('admin_address') : '📍 Delivery Address:'}</strong> <span style="color:#333;font-weight:600;">${order.address || '—'}</span></div>
                        <div><strong>${window.t ? window.t('admin_phone') : '📞 Phone:'}</strong> <span style="color:#333;font-weight:600;">${order.phone || '—'}</span></div>
                        <div><strong>${window.t ? window.t('date') : 'Date'}:</strong> ${order.date ? new Date(order.date).toLocaleString(window.currentLang === 'ar' ? 'ar-EG' : 'en-US') : '—'}</div>
                    </div>
                </div>

                <!-- Order Items -->
                <div>
                    <h4 style="margin:0 0 12px;"><i class="bi bi-box-seam"></i> ${window.t ? window.t('orders') : 'Order Items'}</h4>
                    ${itemsHtml}
                </div>

                <!-- Total -->
                <div style="background:#f0fdf4;border-radius:10px;padding:14px;display:flex;justify-content:space-between;align-items:center;border:1px solid #86efac;">
                    <span style="font-weight:700;font-size:1rem;" data-i18n="total">${window.t ? window.t('total') : 'Total'}</span>
                    <span style="font-weight:800;font-size:1.2rem;color:#16a34a;">$${Number(order.total || 0).toFixed(2)}</span>
                </div>

                <!-- Status Update -->
                <div>
                    <label style="font-weight:600;margin-bottom:8px;display:block;"><i class="bi bi-arrow-repeat"></i> <span data-i18n="status">${window.t ? window.t('status') : 'Status'}</span>:</label>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <button class="update-order-status btn-primary" data-id="${order.id}" data-status="confirmed"
                            style="padding:8px 16px;font-size:0.85rem;background:#16a34a;border:none;border-radius:6px;color:white;cursor:pointer;font-weight:600;">
                            ✅ ${window.t ? window.t('confirm_order') : 'Confirm'}
                        </button>
                        <button class="update-order-status" data-id="${order.id}" data-status="cancelled"
                            style="padding:8px 16px;font-size:0.85rem;background:#dc2626;border:none;border-radius:6px;color:white;cursor:pointer;font-weight:600;">
                            ❌ ${window.t ? window.t('cancelled') : 'Cancel'}
                        </button>
                        <button class="update-order-status" data-id="${order.id}" data-status="pending"
                            style="padding:8px 16px;font-size:0.85rem;background:#d97706;border:none;border-radius:6px;color:white;cursor:pointer;font-weight:600;">
                            🔄 ${window.t ? window.t('pending') : 'Pending'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Status update handlers
        body.querySelectorAll('.update-order-status').forEach(btn => {
            btn.addEventListener('click', () => {
                const id     = btn.dataset.id;
                const status = btn.dataset.status;
                const ords   = getOrders();
                const idx    = ords.findIndex(o => o.id === id);
                if (idx === -1) return;
                ords[idx].status = status;
                saveOrders(ords);
                modal.style.display = 'none';
                renderOrdersTable();
                updateOrdersBadge();
            });
        });

        modal.style.display = 'flex';
    }

    // Close order details modal
    document.getElementById('orderDetailsModal')?.addEventListener('click', e => {
        if (e.target === document.getElementById('orderDetailsModal')) {
            document.getElementById('orderDetailsModal').style.display = 'none';
        }
    });

    // ─── ACCOUNT SETTINGS ──────────────────────────────────
    const changeUsernameForm = document.getElementById('changeUsernameForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const usernameAlert      = document.getElementById('usernameAlert');
    const passwordAlert      = document.getElementById('passwordAlert');

    changeUsernameForm?.addEventListener('submit', e => {
        e.preventDefault();
        const current = document.getElementById('currentUsername').value.trim();
        const newName = document.getElementById('newUsername').value.trim();
        const creds   = getCreds();

        if (current !== creds.username) {
            showAlert(usernameAlert, '❌ Current username is incorrect.', 'error');
            return;
        }
        if (!newName || newName.length < 3) {
            showAlert(usernameAlert, '⚠️ New username must be at least 3 characters.', 'error');
            return;
        }

        saveCreds({ ...creds, username: newName });
        updateTopbarUser();
        updateLoginHint();
        showAlert(usernameAlert, `✅ Username changed to "${newName}" successfully!`, 'success');
        changeUsernameForm.reset();
    });

    changePasswordForm?.addEventListener('submit', e => {
        e.preventDefault();
        const current  = document.getElementById('currentPassword').value;
        const newPass  = document.getElementById('newPassword').value;
        const confirm  = document.getElementById('confirmPassword').value;
        const creds    = getCreds();

        if (current !== creds.password) {
            showAlert(passwordAlert, '❌ Current password is incorrect.', 'error');
            return;
        }
        if (!newPass || newPass.length < 4) {
            showAlert(passwordAlert, '⚠️ New password must be at least 4 characters.', 'error');
            return;
        }
        if (newPass !== confirm) {
            showAlert(passwordAlert, '❌ Passwords do not match.', 'error');
            return;
        }

        saveCreds({ ...creds, password: newPass });
        updateLoginHint();
        showAlert(passwordAlert, '✅ Password changed successfully!', 'success');
        changePasswordForm.reset();
    });

    // ─── Initial Render ────────────────────────────────────
    function renderAll() {
        renderProductsTable();
        renderOffersGrid();
        updateStats();
        updateOrdersBadge(); // Show badge on load if new orders exist
    }

    if (sessionStorage.getItem('epower_admin') === 'true') {
        renderAll();
    }
});
