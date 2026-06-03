// Mobile filter state
window.mobileFilters = {
  category: "all",
  brand: "all",
};

document.addEventListener("DOMContentLoaded", () => {
  const customSelects = document.querySelectorAll(".custom-select");
  if (customSelects.length === 0) return;

  customSelects.forEach((select) => {
    const selectedEl = select.querySelector(".selected");
    const options = select.querySelector(".options");
    const isCategorySelect = select.id === "mobile-category-select";
    const isBrandSelect = select.id === "mobile-brand-select";

    // Toggle open/close
    selectedEl.addEventListener("click", (e) => {
      e.stopPropagation();
      // Close all other selects
      document.querySelectorAll(".custom-select").forEach((s) => {
        if (s !== select) s.classList.remove("active");
      });
      select.classList.toggle("active");
    });

    // Handle option click
    options.querySelectorAll(".option").forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.dataset.value || option.textContent.trim();
        const label = option.textContent.trim();

        // Update displayed text
        selectedEl.textContent = label;
        select.classList.remove("active");

        // Update mobile filter state
        if (isCategorySelect) {
          window.mobileFilters.category = value;
        } else if (isBrandSelect) {
          window.mobileFilters.brand = value;
        }

        // Mark selected option visually
        options.querySelectorAll(".option").forEach((o) =>
          o.classList.remove("selected-option")
        );
        option.classList.add("selected-option");

        // Trigger re-render if renderProducts exists
        if (typeof renderProducts === "function") {
          renderProducts();
        }
      });
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-select")) {
      document.querySelectorAll(".custom-select").forEach((s) =>
        s.classList.remove("active")
      );
    }
  });
});
