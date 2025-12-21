document.addEventListener("DOMContentLoaded", () => {
  const customSelects = document.querySelectorAll(".custom-select");
  if (customSelects.length === 0) return;

  customSelects.forEach(select => {
    const selected = select.querySelector(".selected");
    const options = select.querySelector(".options");

    selected.addEventListener("click", () => {
      document.querySelectorAll(".custom-select").forEach(s => {
        if (s !== select) s.classList.remove("active");
      });
      select.classList.toggle("active");
    });

    options.querySelectorAll(".option").forEach(option => {
      option.addEventListener("click", () => {
        selected.textContent = option.textContent;
        select.classList.remove("active");
      });
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".custom-select")) {
      document.querySelectorAll(".custom-select").forEach(s => s.classList.remove("active"));
    }
  });
});
