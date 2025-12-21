document.addEventListener("DOMContentLoaded", () => {
  const countryBtn = document.getElementById("open-country");
  const langBtn = document.getElementById("open-language");

  const countryPopup = document.getElementById("country-popup");
  const langPopup = document.getElementById("language-popup");

  // ✅ فتح النوافذ
  countryBtn.addEventListener("click", (e) => {
    e.preventDefault();
    countryPopup.style.display = "flex";
  });

  langBtn.addEventListener("click", (e) => {
    e.preventDefault();
    langPopup.style.display = "flex";
  });

  // ✅ إغلاق عند الضغط خارج المربع
  [countryPopup, langPopup].forEach(popup => {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) popup.style.display = "none";
    });
  });

  // ✅ عند اختيار دولة أو لغة
  document.querySelectorAll(".custom-popup-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
      alert(`تم اختيار: ${btn.textContent}`);
      btn.closest(".custom-popup").style.display = "none";
    });
  });
});
