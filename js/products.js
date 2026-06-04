const defaultProducts = [
  {
    id: "p1",
    name: "TOZO T6 True Wireless Earbuds",
    price: 70,
    image: "imgs/Image-compressed_Webpifier.webp",
    category: "Headphone",
    rating: 5,
    reviews: 738,
  },
  {
    id: "p2",
    name: "Samsung Galaxy S21 5G",
    price: 2300,
    image: "imgs/Image (1)-compressed_Webpifier.webp",
    category: "SmartPhone",
    rating: 5,
    reviews: 738,
  },
  {
    id: "p3",
    name: "Amazon Basics High-Speed HDMI Cable",
    price: 360,
    image: "imgs/Image (2)-compressed_Webpifier.webp",
    category: "Computer Accessories",
    rating: 5,
    reviews: 738,
  },
  {
    id: "p4",
    name: "Portable Washing Machine, 11lbs capacity",
    price: 80,
    image: "imgs/Image (3)-compressed_Webpifier.webp",
    category: "TV & Appliances",
    rating: 5,
    reviews: 738,
  },
  {
    id: "p5",
    name: "Wired Over-Ear Gaming Headphones",
    price: 1500,
    image: "imgs/Image (4)-compressed_Webpifier.webp",
    category: "Headphone",
    rating: 5,
    reviews: 738,
  },
  {
    id: "p6",
    name: "Dell Optiplex 7000x7480 All-in-One",
    price: 250,
    image: "imgs/Image (21)-compressed_Webpifier.webp",
    category: "Computer & Laptop",
    rating: 5,
    reviews: 738,
  },
  {
    id: "p7",
    name: "4K UHD LED Smart TV",
    price: 220,
    image: "imgs/Image (7)-compressed_Webpifier.webp",
    category: "TV & Appliances",
    rating: 5,
    reviews: 738,
  },
];

function getAllProducts() {
  let customProducts = [];
  const stored = localStorage.getItem("epower_custom_products");
  if (stored) {
    try {
      customProducts = JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing custom products", e);
    }
  }
  return [...defaultProducts, ...customProducts];
}

function addCustomProduct(product) {
  let customProducts = [];
  const stored = localStorage.getItem("epower_custom_products");
  if (stored) {
    customProducts = JSON.parse(stored);
  }

  const newProduct = {
    ...product,
    id: "cp_" + Date.now(), // Generate unique ID
    reviews: 0,
  };

  customProducts.push(newProduct);
  localStorage.setItem(
    "epower_custom_products",
    JSON.stringify(customProducts),
  );
  return newProduct;
}

function renderProducts() {
  const container = document.getElementById("shop-products-container");
  if (!container) return;

  let products = getAllProducts();
  const isMobile = window.innerWidth <= 767;

  // Apply Filters
  // 1. Category
  let selectedCategory;
  if (isMobile) {
    selectedCategory = window.mobileFilters?.category || "all";
  } else {
    selectedCategory = document.querySelector('input[name="type"]:checked')?.value;
  }
  if (selectedCategory && selectedCategory !== "all") {
    products = products.filter((p) => p.category === selectedCategory);
  }

  // 2. Brands
  let checkedBrands = [];
  if (isMobile) {
    const mobileBrand = window.mobileFilters?.brand || "all";
    if (mobileBrand && mobileBrand !== "all") {
      checkedBrands = [mobileBrand];
    }
  } else {
    checkedBrands = Array.from(
      document.querySelectorAll('input[name="brand"]:checked')
    ).map((cb) => cb.value);
  }
  if (checkedBrands.length > 0) {
    products = products.filter((p) =>
      checkedBrands.some((brand) =>
        p.name.toLowerCase().includes(brand.toLowerCase())
      )
    );
  }

  // 3. Price
  const minPriceInput = document.querySelector(".min-input");
  const maxPriceInput = document.querySelector(".max-input");
  if (minPriceInput && maxPriceInput) {
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
    products = products.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    );
  }

  let html = "";

  if (products.length === 0) {
    html =
      '<p style="grid-column: 1/-1; text-align: center; padding: 50px;">No products match your filters.</p>';
  } else {
    products.forEach((p) => {
      html += `
            <div class="crt fade-in-up appear">
                <a href="pd.html" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; flex:1;">
                    <figure style="overflow:hidden; border-radius:10px; flex-shrink:0;">
                        <img src="${p.image}" alt="${p.name}" style="width:100%; aspect-ratio:1/1; object-fit:contain; display:block; background:#f6f0ff; padding:6px; border-radius:10px; transition:transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='none'">
                    </figure>
                    <div class="text">
                        <p class="product-name-text">${p.name}</p>
                        <p class="product-price-text">$${p.price.toFixed(2)}</p>
                    </div>
                </a>
                <div class="star-widget-wrap shop-star-wrap" data-init-pid="${p.id}"></div>
                <button class="add-to-cart-btn" style="margin-top:10px; padding:10px; background:var(--mincolor); color:white; border:none; border-radius:8px; cursor:pointer; transition:opacity 0.3s; font-weight:600; width:100%;" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'"
                    data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-image="${p.image}">
                    <i class="bi bi-cart-plus"></i> Add to Cart
                </button>
            </div>
            `;
    });
  }

  container.innerHTML = html;

  // Initialize interactive star widgets for each product card
  if (typeof renderStarWidget === 'function') {
    container.querySelectorAll('.star-widget-wrap[data-init-pid]').forEach(wrap => {
      const pid = wrap.dataset.initPid;
      renderStarWidget(pid, wrap);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Check for URL category parameter
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  if (catParam) {
    // Select desktop radio
    const radioToSelect = document.querySelector(`input[name="type"][value="${catParam}"]`);
    if (radioToSelect) {
      radioToSelect.checked = true;
    }
    // Update mobile select if present
    window.mobileFilters = window.mobileFilters || {};
    window.mobileFilters.category = catParam;
    
    const mobileCatSelect = document.getElementById('mobile-category-select');
    if (mobileCatSelect) {
      const selectedDiv = mobileCatSelect.querySelector('.selected');
      if (selectedDiv) {
        selectedDiv.textContent = catParam;
      }
    }
  }

  // Initial Render
  renderProducts();

  // Hook listeners
  const categoryRadios = document.querySelectorAll('input[name="type"]');
  const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
  const priceInputs = document.querySelectorAll(".min-input, .max-input");
  const rangeInputs = document.querySelectorAll(".min-range, .max-range");

  const triggerRender = () => renderProducts();

  categoryRadios.forEach((el) => el.addEventListener("change", triggerRender));
  brandCheckboxes.forEach((el) => el.addEventListener("change", triggerRender));
  priceInputs.forEach((el) => el.addEventListener("input", triggerRender));
  rangeInputs.forEach((el) => el.addEventListener("input", triggerRender));
});
