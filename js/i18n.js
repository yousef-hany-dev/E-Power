// js/i18n.js
const dictionary = {
    en: {
        // General
        "lang_name": "the language",
        "home": "Home",
        "products": "Products",
        "blog": "Blog",
        "faq": "FAQ",
        "about_us": "About us",
        "sign_in": "Sign In",
        "shop": "shop",
        "favorites": "Favorites",

        // Cart & Checkout
        "your_cart": "Your Cart",
        "total": "Total",
        "checkout": "Checkout",
        "confirm_order": '<i class="bi bi-cart-check"></i> Confirm Order',
        "choose_address": '<i class="bi bi-geo-alt"></i> Choose Delivery Address:',
        "registered_address": "Registered Address",
        "different_address": "Different Address",
        "address_detail": "Detailed Address...",
        "phone_number": "Phone Number...",
        "order_summary": '<i class="bi bi-receipt"></i> Order Summary',
        "order_success_html": '<i class="bi bi-check-circle-fill" style="margin-left:8px;"></i> Your order has been received! We will contact you soon 🎉',
        "login_required": '<i class="bi bi-lock-fill"></i> Login Required',
        "login_required_desc": "You must be logged in to complete the purchase.",
        "login_required_sub": "Login or create a free account now",
        "login_btn_html": '<i class="bi bi-box-arrow-in-right"></i> Sign In',
        "cancel": "Cancel",
        "cart_empty_toast": "Your cart is empty! Add products first 🛒",
        "enter_address_toast": "⚠️ Please enter the address and phone number",
        "no_registered_address_toast": "⚠️ No registered address. Choose 'Different Address'",
        "no_registered_address_badge": "⚠️ No registered address",
        "cart_empty_msg": "Your cart is empty!",
        
        // Favorites
        "fav_empty_title": "Your favorites list is empty",
        "fav_empty_desc": "Go explore our products and save your favorite items here!",
        "go_to_shop": "Go to Shop",
        "add_to_cart_html": '<i class="bi bi-cart-plus"></i> Add to Cart',
        "my_favorites_html": '<i class="bi bi-heart-fill" style="color:#e53e3e;"></i> My Favorites',

        // Shop/Products
        "search_placeholder": "Search for anything...",
        "category": "Category",
        "popular_brands": "popular Brands",
        "price_range": "Price Range",
        
        // Login
        "welcome_back": "Welcome Back!",
        "login_desc": "Please login to access your account",
        "email": "Email Address",
        "password": "Password",
        "forgot_password": "Forgot Password?",
        "sign_in_btn": "Sign In",
        "sign_in_google": "Sign In via Google",
        "sign_in_facebook": "Sign In via Facebook",
        "no_account": "Don't have an account?",
        "create_account": "Create Account",
        "coming_soon": "This service will be available soon!",
        "invalid_credentials": "❌ Incorrect email or password",
        "or_register_with": "Or you can register with",
        
        // Register
        "create_new_account": "Create New Account",
        "register_desc": "Join us today and enjoy exclusive offers",
        "full_name": "Full Name",
        "confirm_password": "Confirm Password",
        "phone_optional": "Phone Number (Optional)",
        "address_optional": "Delivery Address (Optional)",
        "agree_terms": "I agree to the terms and conditions",
        "sign_up_btn": "Sign Up",
        "have_account": "Already have an account?",
        "passwords_not_match": "❌ Passwords do not match",
        "accept_terms": "❌ You must accept the terms",
        "email_used": "❌ This email is already registered",
        "register_success": "✅ Account created successfully! Redirecting...",
        
        // Admin
        "admin_dashboard": "Admin Dashboard",
        "overview": "Overview",
        "orders": "Orders",
        "users": "Users",
        "settings": "Settings",
        "logout": "Logout",
        "total_sales": "Total Sales",
        "total_orders": "Total Orders",
        "active_users": "Active Users",
        "recent_orders": "Recent Orders",
        "order_id": "Order ID",
        "customer": "Customer",
        "date": "Date",
        "amount": "Amount",
        "status": "Status",
        "actions": "Actions",
        "pending": "Pending",
        "delivered": "Delivered",
        "cancelled": "Cancelled",
        "view_details": "View Details",
        "admin_address": "📍 Delivery Address:",
        "admin_phone": "📞 Phone:",
        "no_orders": "There are no orders yet.",
        "call_center_panel": "Call Center Panel",
        "new_orders": "New Orders",
        
        // Admin Users
        "users_list": "Registered Users",
        "user_name": "Name",
        "user_email": "Email",
        "user_phone": "Phone",
        "user_address": "Address",
        "no_users": "There are no registered users yet."
    },
    ar: {
        // General
        "lang_name": "اللغة",
        "home": "الرئيسية",
        "products": "المنتجات",
        "blog": "المدونة",
        "faq": "الأسئلة الشائعة",
        "about_us": "من نحن",
        "sign_in": "تسجيل الدخول",
        "shop": "المتجر",
        "favorites": "المفضلة",

        // Cart & Checkout
        "your_cart": "سلة المشتريات",
        "total": "الإجمالي",
        "checkout": "إتمام الطلب",
        "confirm_order": '<i class="bi bi-cart-check"></i> تأكيد الطلب',
        "choose_address": '<i class="bi bi-geo-alt"></i> اختر عنوان التوصيل:',
        "registered_address": "عنواني المسجل",
        "different_address": "عنوان توصيل مختلف",
        "address_detail": "العنوان بالتفصيل...",
        "phone_number": "رقم التواصل...",
        "order_summary": '<i class="bi bi-receipt"></i> ملخص الطلب',
        "order_success_html": '<i class="bi bi-check-circle-fill" style="margin-left:8px;"></i> تم استلام طلبك! سيتم التواصل معك في أسرع وقت لتأكيد الطلب 🎉',
        "login_required": '<i class="bi bi-lock-fill"></i> تسجيل الدخول مطلوب',
        "login_required_desc": "يجب أن تكون مسجلاً لإتمام عملية الشراء.",
        "login_required_sub": "سجّل الدخول أو أنشئ حساباً مجانياً الآن",
        "login_btn_html": '<i class="bi bi-box-arrow-in-right"></i> تسجيل الدخول',
        "cancel": "إلغاء",
        "cart_empty_toast": "سلتك فارغة! أضف منتجات أولاً 🛒",
        "enter_address_toast": "⚠️ يرجى إدخال العنوان ورقم التواصل",
        "no_registered_address_toast": "⚠️ لا يوجد عنوان مسجل. اختر 'عنوان مختلف'",
        "no_registered_address_badge": "⚠️ لا يوجد عنوان مسجل",
        "cart_empty_msg": "سلتك فارغة!",

        // Favorites
        "fav_empty_title": "قائمة المفضلة فارغة",
        "fav_empty_desc": "تصفح منتجاتنا واحفظ عناصرك المفضلة هنا!",
        "go_to_shop": "الذهاب للمتجر",
        "add_to_cart_html": '<i class="bi bi-cart-plus"></i> إضافة للسلة',
        "my_favorites_html": '<i class="bi bi-heart-fill" style="color:#e53e3e;"></i> المفضلة',

        // Shop/Products
        "search_placeholder": "ابحث عن أي شيء...",
        "category": "الأقسام",
        "popular_brands": "أشهر الماركات",
        "price_range": "نطاق السعر",

        // Login
        "welcome_back": "مرحباً بك مجدداً!",
        "login_desc": "يرجى تسجيل الدخول للوصول لحسابك",
        "email": "البريد الإلكتروني",
        "password": "كلمة المرور",
        "forgot_password": "نسيت كلمة المرور؟",
        "sign_in_btn": "تسجيل الدخول",
        "sign_in_google": "الدخول بواسطة جوجل",
        "sign_in_facebook": "الدخول بواسطة فيسبوك",
        "no_account": "ليس لديك حساب؟",
        "create_account": "إنشاء حساب",
        "coming_soon": "هذه الخدمة ستتوفر قريباً!",
        "invalid_credentials": "❌ البريد الإلكتروني أو كلمة المرور غير صحيحة",
        "or_register_with": "أو يمكنك التسجيل عبر",

        // Register
        "create_new_account": "إنشاء حساب جديد",
        "register_desc": "انضم إلينا اليوم واستمتع بعروض حصرية",
        "full_name": "الاسم الكامل",
        "confirm_password": "تأكيد كلمة المرور",
        "phone_optional": "رقم الهاتف (اختياري)",
        "address_optional": "عنوان التوصيل (اختياري)",
        "agree_terms": "أوافق على الشروط والأحكام",
        "sign_up_btn": "إنشاء الحساب",
        "have_account": "لديك حساب بالفعل؟",
        "passwords_not_match": "❌ كلمتا المرور غير متطابقتين",
        "accept_terms": "❌ يجب الموافقة على الشروط",
        "email_used": "❌ هذا البريد مسجل مسبقاً",
        "register_success": "✅ تم إنشاء الحساب بنجاح! جاري التحويل...",

        // Admin
        "admin_dashboard": "لوحة تحكم الإدارة",
        "overview": "نظرة عامة",
        "orders": "الطلبات",
        "users": "المستخدمين",
        "settings": "الإعدادات",
        "logout": "تسجيل الخروج",
        "total_sales": "إجمالي المبيعات",
        "total_orders": "إجمالي الطلبات",
        "active_users": "المستخدمين النشطين",
        "recent_orders": "أحدث الطلبات",
        "order_id": "رقم الطلب",
        "customer": "العميل",
        "date": "التاريخ",
        "amount": "المبلغ",
        "status": "الحالة",
        "actions": "إجراءات",
        "pending": "قيد المراجعة",
        "delivered": "مكتمل",
        "cancelled": "ملغي",
        "view_details": "عرض التفاصيل",
        "admin_address": "📍 عنوان التوصيل:",
        "admin_phone": "📞 رقم الهاتف:",
        "no_orders": "لا توجد طلبات حتى الآن.",
        "call_center_panel": "لوحة الكول سنتر",
        "new_orders": "طلبات جديدة",

        // Admin Users
        "users_list": "المستخدمين المسجلين",
        "user_name": "الاسم",
        "user_email": "البريد الإلكتروني",
        "user_phone": "الهاتف",
        "user_address": "العنوان",
        "no_users": "لا يوجد مستخدمين مسجلين حتى الآن."
    }
};

// State
let currentLang = localStorage.getItem('epower_lang') || 'en';

// Translate function for JS
window.t = function(key) {
    return dictionary[currentLang][key] || key;
};

// Apply language to DOM
function applyLanguage() {
    // 1. Set HTML dir and lang
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    // 2. Add class for specific CSS adjustments without breaking the main design
    if (currentLang === 'ar') {
        document.body.classList.add('rtl-mode');
    } else {
        document.body.classList.remove('rtl-mode');
    }

    // 3. Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dictionary[currentLang][key]) {
            el.innerHTML = dictionary[currentLang][key];
        }
    });

    // 4. Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dictionary[currentLang][key]) {
            el.placeholder = dictionary[currentLang][key];
        }
    });

    // Dispatch event so other JS scripts know language changed and can re-render
    window.dispatchEvent(new Event('languageChanged'));
}

// Toggle language
function toggleLanguage(e) {
    if (e) e.preventDefault();
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('epower_lang', currentLang);
    applyLanguage();
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();

    // Bind all elements with id="open-language"
    const langBtns = document.querySelectorAll('#open-language');
    langBtns.forEach(btn => {
        btn.addEventListener('click', toggleLanguage);
    });
});
