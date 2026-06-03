// js/favorites.js

document.addEventListener('DOMContentLoaded', () => {
    const favoritesPageContainer = document.getElementById('favoritesPageContainer');
    
    // Load favorites from local storage
    const loadFavorites = () => {
        return JSON.parse(localStorage.getItem('epower_favorites')) || [];
    };

    const saveFavorites = (favs) => {
        localStorage.setItem('epower_favorites', JSON.stringify(favs));
    };

    // Render favorites on the dedicated favorites page
    const renderFavoritesPage = () => {
        if (!favoritesPageContainer) return;
        const favs = loadFavorites();
        
        if (favs.length === 0) {
            favoritesPageContainer.style.display = 'block';
            favoritesPageContainer.innerHTML = `
                <div class="empty-fav-page">
                    <i class="bi bi-heartbreak"></i>
                    <h3>Your favorites list is empty</h3>
                    <p>Go explore our products and save your favorite items here!</p>
                    <a href="shop.html" style="display:inline-block; margin-top:20px; background:var(--primary, #8f12d7); color:#fff; padding:10px 24px; border-radius:8px; font-weight:bold; text-decoration:none;">Go to Shop</a>
                </div>
            `;
            return;
        }

        favoritesPageContainer.style.display = 'grid';
        favoritesPageContainer.innerHTML = favs.map(f => `
            <div class="crt">
                <div class="heart">
                    <i class="bi bi-heart-fill active heart-btn" data-id="${f.id}"></i>
                </div>
                <div class="photo">
                    <img src="${f.image}" alt="${f.name}">
                </div>
                <div class="text">
                    <h3>${f.name}</h3>
                    <p class="price">$${parseFloat(f.price).toFixed(2)}</p>
                    <a href="#" class="add-to-cart-btn" data-id="${f.id}" data-name="${f.name}" data-price="${f.price}" data-image="${f.image}">
                        <i class="bi bi-cart-plus"></i> Add to Cart
                    </a>
                </div>
            </div>
        `).join('');
    };

    // Toggle favorite state
    const toggleFavorite = (id, name, price, image) => {
        let favs = loadFavorites();
        const index = favs.findIndex(f => f.id === id);

        if (index > -1) {
            // Remove from favorites
            favs.splice(index, 1);
        } else if (name && price && image) {
            // Add to favorites
            favs.push({ id, name, price, image });
        }

        saveFavorites(favs);
        updateHeartIcons();
        renderFavoritesPage();
    };

    // Update heart icons on the page based on current favorites
    const updateHeartIcons = () => {
        const favs = loadFavorites();
        const favIds = favs.map(f => f.id);

        document.querySelectorAll('.heart-btn').forEach(btn => {
            if (favIds.includes(btn.dataset.id)) {
                btn.classList.remove('bi-heart');
                btn.classList.add('bi-heart-fill');
                btn.classList.add('active');
            } else {
                btn.classList.remove('bi-heart-fill');
                btn.classList.add('bi-heart');
                btn.classList.remove('active');
            }
        });
    };

    // Listen for clicks on heart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('heart-btn')) {
            const btn = e.target;
            // Safely find the container
            const container = btn.closest('.crt') || btn.closest('.box') || btn.closest('.d1') || btn.closest('.text') || btn.parentElement;
            
            const id = btn.dataset.id;
            // Try to find the associated add-to-cart btn to get product details
            const cartBtn = container ? container.querySelector('.add-to-cart-btn') : null;
            
            let name = "Favorite Item";
            let price = "0.00";
            let image = "";

            if (cartBtn) {
                name = cartBtn.dataset.name || name;
                price = cartBtn.dataset.price || price;
                image = cartBtn.dataset.image || image;
            } else if (container) {
                // Fallback: look for image and title inside container
                const imgEl = container.closest('.d1') ? container.closest('.d1').querySelector('img') : container.querySelector('img');
                const titleEl = container.querySelector('h2') || container.querySelector('h3');
                if (imgEl) image = imgEl.src;
                if (titleEl) name = titleEl.textContent.trim();
            }

            toggleFavorite(id, name, price, image);
        }
    });

    // Initial render
    updateHeartIcons();
    renderFavoritesPage();

    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'epower_favorites') {
            updateHeartIcons();
            renderFavoritesPage();
        }
    });
});
