/**
 * Street Bites Single Page Application Engine
 * Architecture: Vanilla JS Client-Side Router with Component Views & State Management
 */

// Global Application State Store
const state = {
  cart: new Map(),
  selectedCategory: "All",
  searchQuery: "",
  foods: [
    { id: 1, name: "Classic Burger", category: "Burger", price: 99, description: "Juicy patty, fresh veggies & special sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "Cheese Burger", category: "Burger", price: 129, description: "Loaded with double melted cheddar cheese.", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "Margherita Pizza", category: "Pizza", price: 149, description: "Classic mozzarella cheese and fresh basil.", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" },
    { id: 4, name: "Veggie Pizza", category: "Pizza", price: 179, description: "Loaded with bell peppers, olives & corn.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80" },
    { id: 5, name: "French Fries", category: "Snacks", price: 69, description: "Golden, crispy and salted to perfection.", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80" },
    { id: 6, name: "Steamed Momos", category: "Snacks", price: 79, description: "Served with hot spicy red chilli chutney.", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80" },
    { id: 7, name: "Cold Coffee", category: "Drinks", price: 79, description: "Chilled rich coffee topped with ice cream.", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80" },
    { id: 8, name: "Fresh Lemonade", category: "Drinks", price: 49, description: "Refreshing lemon mint drink served chilled.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=600&q=80" }
  ]
};

// Utilities
const formatPrice = (amount) => "₹" + amount.toLocaleString("en-IN");

const showToast = (message) => {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
};

// View Components
const Views = {
  Home: () => `
    <div class="view-container">
      <section class="hero">
        <div class="hero-content">
          <p class="eyebrow">Fresh • Tasty • Affordable</p>
          <h1>Your Favorite Street Food, <span>Made Fresh!</span></h1>
          <p class="hero-description">Delicious bites, bold street flavors, and unforgettable tastes delivered fast to your table.</p>
          <a href="/menu" class="btn" data-link>Explore Our Menu →</a>
          <div class="hero-stats">
            <div><strong>20+</strong><small>Food Options</small></div>
            <div><strong>Fresh</strong><small>Every Day</small></div>
            <div><strong>₹49+</strong><small>Starting Price</small></div>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85" alt="Delicious Burger">
          <div class="floating-card">
            <span>⭐ 4.9/5 Rating</span>
            <small>Over 1,000+ Happy Customers</small>
          </div>
        </div>
      </section>
    </div>
  `,

  Menu: () => `
    <div class="view-container">
      <section class="menu-section">
        <div class="section-heading">
          <p class="eyebrow">What's Cooking?</p>
          <h2>Explore Our Delicious Menu</h2>
        </div>

        <div class="menu-tools">
          <input type="search" id="searchInput" placeholder="🔍 Search menu items..." value="${state.searchQuery}">
          <div class="filters" id="filters">
            ${["All", "Burger", "Pizza", "Snacks", "Drinks"].map(cat => `
              <button class="filter ${state.selectedCategory === cat ? 'active' : ''}" data-category="${cat}">${cat}</button>
            `).join('')}
          </div>
        </div>

        <div class="menu-layout">
          <div class="food-grid" id="foodGrid"></div>
          <aside class="cart-panel">
            <h3>🛒 Your Order</h3>
            <div id="cartItems"></div>
            <div class="cart-total">
              <span>Total Amount:</span>
              <strong id="cartTotal">₹0</strong>
            </div>
            <button class="btn checkout-btn" id="checkoutBtn">Proceed to Order</button>
          </aside>
        </div>
      </section>
    </div>
  `,

  About: () => `
    <div class="view-container">
      <section class="about-section">
        <p class="eyebrow">Our Story</p>
        <h2>Small Stall, <span>Big Flavors!</span></h2>
        <p style="margin-top: 15px; max-width: 600px; color: var(--muted);">Street Bites started with a simple vision: serving restaurant-quality street delicacies made with fresh ingredients at student-friendly prices.</p>
      </section>
    </div>
  `,

  Contact: () => `
    <div class="view-container">
      <section class="contact-section">
        <p class="eyebrow" style="text-align: center;">Get in Touch</p>
        <h2 style="text-align: center;">Visit Street Bites</h2>
        <div class="contact-cards">
          <div class="contact-card"><span>📍</span><h3>Location</h3><p>College Road, Food Street</p></div>
          <div class="contact-card"><span>🕒</span><h3>Hours</h3><p>11:00 AM - 10:00 PM</p></div>
          <div class="contact-card"><span>📞</span><h3>Call Us</h3><p>+91 98765 43210</p></div>
        </div>
      </section>
    </div>
  `,

  NotFound: () => `
    <div class="view-container">
      <section class="error-section" style="text-align:center;">
        <h2>404 - Page Not Found</h2>
        <p style="margin: 15px 0;">Oops! The page you are looking for does not exist.</p>
        <a href="/" class="btn" data-link>Return Home</a>
      </section>
    </div>
  `
};

// Client-Side Router
const routes = {
  "/": { title: "Street Bites | Home", view: Views.Home },
  "/menu": { title: "Street Bites | Our Menu", view: Views.Menu, init: initMenuView },
  "/about": { title: "Street Bites | About Us", view: Views.About },
  "/contact": { title: "Street Bites | Contact Us", view: Views.Contact }
};

function router() {
  const path = window.location.pathname;
  const route = routes[path] || { title: "404 Not Found", view: Views.NotFound };

  document.title = route.title;
  const appContainer = document.getElementById("app");
  appContainer.innerHTML = route.view();

  updateActiveNavLinks(path);

  if (route.init) {
    route.init();
  }

  window.scrollTo(0, 0);
}

function navigateTo(url) {
  window.history.pushState(null, null, url);
  router();
}

function updateActiveNavLinks(currentPath) {
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Menu Controller Logic
function initMenuView() {
  renderFoodCards();
  renderCart();

  // Search Listener
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderFoodCards();
    });
  }

  // Category Filter Listener
  const filtersContainer = document.getElementById("filters");
  if (filtersContainer) {
    filtersContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter")) {
        document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        state.selectedCategory = e.target.dataset.category;
        renderFoodCards();
      }
    });
  }

  // Food Grid Add to Cart Listener
  const foodGrid = document.getElementById("foodGrid");
  if (foodGrid) {
    foodGrid.addEventListener("click", (e) => {
      const addBtn = e.target.closest("[data-add]");
      if (addBtn) {
        addToCart(Number(addBtn.dataset.add));
      }
    });
  }

  // Cart Actions Listener
  const cartItems = document.getElementById("cartItems");
  if (cartItems) {
    cartItems.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;

      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;

      if (action === "increase") changeCartQuantity(id, 1);
      if (action === "decrease") changeCartQuantity(id, -1);
      if (action === "remove") removeFromCart(id);
    });
  }

  // Checkout Listener
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (state.cart.size === 0) {
        showToast("Your cart is empty!");
        return;
      }
      alert("Order placed successfully! Thank you for ordering from Street Bites.");
      state.cart.clear();
      renderCart();
      updateCartHeaderCount();
    });
  }
}

function renderFoodCards() {
  const foodGrid = document.getElementById("foodGrid");
  if (!foodGrid) return;

  const filtered = state.foods.filter(item => {
    const matchesCategory = state.selectedCategory === "All" || item.category === state.selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(state.searchQuery) || item.description.toLowerCase().includes(state.searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    foodGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--muted);">No food items match your criteria.</div>`;
    return;
  }

  foodGrid.innerHTML = filtered.map(item => `
    <article class="food-card">
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <div class="food-info">
        <span class="food-category">${item.category}</span>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="food-bottom">
          <span class="food-price">${formatPrice(item.price)}</span>
          <button class="add-btn" data-add="${item.id}">+ Add</button>
        </div>
      </div>
    </article>
  `).join('');
}

function addToCart(id) {
  const current = state.cart.get(id) || 0;
  state.cart.set(id, current + 1);
  const food = state.foods.find(f => f.id === id);
  showToast(`${food.name} added to cart!`);
  renderCart();
  updateCartHeaderCount();
}

function changeCartQuantity(id, delta) {
  const current = state.cart.get(id) || 0;
  const updated = current + delta;
  if (updated <= 0) {
    state.cart.delete(id);
  } else {
    state.cart.set(id, updated);
  }
  renderCart();
  updateCartHeaderCount();
}

function removeFromCart(id) {
  state.cart.delete(id);
  renderCart();
  updateCartHeaderCount();
  showToast("Item removed from cart.");
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  if (!cartItems || !cartTotal) return;

  if (state.cart.size === 0) {
    cartItems.innerHTML = `<p style="color: var(--muted); padding: 15px 0;">Your cart is empty.</p>`;
    cartTotal.textContent = formatPrice(0);
    return;
  }

  let grandTotal = 0;
  let itemsHTML = "";

  state.cart.forEach((qty, id) => {
    const food = state.foods.find(f => f.id === id);
    if (!food) return;

    const subtotal = food.price * qty;
    grandTotal += subtotal;

    itemsHTML += `
      <div class="cart-item">
        <div>
          <h4 style="font-size: 0.9rem;">${food.name}</h4>
          <small style="color: var(--muted);">${formatPrice(food.price)} x ${qty}</small>
          <div class="quantity-controls">
            <button data-action="decrease" data-id="${id}">-</button>
            <span>${qty}</span>
            <button data-action="increase" data-id="${id}">+</button>
          </div>
        </div>
        <div style="text-align: right;">
          <strong>${formatPrice(subtotal)}</strong><br>
          <button style="border:none; background:none; color:var(--primary); font-size:0.75rem;" data-action="remove" data-id="${id}">Remove</button>
        </div>
      </div>
    `;
  });

  cartItems.innerHTML = itemsHTML;
  cartTotal.textContent = formatPrice(grandTotal);
}

function updateCartHeaderCount() {
  let count = 0;
  state.cart.forEach(qty => count += qty);
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) cartCountEl.textContent = count;
}

// Global Event Delegation & Setup
document.addEventListener("DOMContentLoaded", () => {
  // Intercept navigation link clicks for SPA routing
  document.body.addEventListener("click", (e) => {
    const linkAnchor = e.target.closest("[data-link]");
    if (linkAnchor) {
      e.preventDefault();
      navigateTo(linkAnchor.getAttribute("href"));
      
      // Close mobile drawer if open
      const navMenu = document.getElementById("navMenu");
      if (navMenu) navMenu.classList.remove("open");
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener("popstate", router);

  // Mobile drawer toggle
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }

  // Set dynamic footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initial routing call
  router();
});