// ADD TO CART FUNCTION
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const mainClick = document.getElementById("main");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", function () {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    navLinks.classList.toggle("active", !isExpanded);
  });
}


mainClick.addEventListener("click", function () {
  if (navLinks.classList.contains("active")) {
    navLinks.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

let cart;
try {
  cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (!Array.isArray(cart)) cart = [];
} catch (error) {
  cart = [];
}
// alert(localStorage.getItem("cart"));

const buttons = document.querySelectorAll(".add-to-cart");

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const product = button.closest("[data-name]") || button.parentElement;
    const name = product.getAttribute("data-name");
    const price = Number(product.getAttribute("data-price"));
    if (!name || Number.isNaN(price)) return;
    const existingProduct = cart.find(function (item) {
      return item.name === name;
    });
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({
        name: name,
        price: price,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    let notification = document.getElementById("cart-notification");
    if (!notification) {
      notification = document.createElement("div");
      notification.id = "cart-notification";
      notification.setAttribute("role", "status");
      notification.setAttribute("aria-live", "polite");
      notification.style.cssText =
        "position:fixed;top:70px;right:20px;z-index:10000;padding:14px 20px;background:#723717;color:#fff;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,.2);font:16px Arial,sans-serif;opacity:0;transform:translateY(-10px);transition:opacity .2s ease,transform .2s ease;";
      document.body.appendChild(notification);
    }
    notification.textContent = name + " added to cart!";
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";
    clearTimeout(notification.hideTimer);
    notification.hideTimer = setTimeout(function () {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-10px)";
    }, 2000);
  });
});

// CART.HTML cart display
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

if (cartItems) {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(function (item) {
    let itemTotal = item.price * item.quantity;
    total = total + itemTotal;
    cartItems.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>Price: ₦${item.price.toLocaleString()}</p>
                <div class="quantity-controls">
                <button class="decrease-quantity" type="button" aria-label="Decrease quantity"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11h14v2H5z"/></svg></button>
                <span>${item.quantity}</span>
                <button class="increase-quantity" type="button" aria-label="Increase quantity"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg></button>
                </div>
                <p>Total: ₦${itemTotal.toLocaleString()}</p>
                <button class="remove-item">Remove</button>
            </div>
        `;
  });
  cartTotal.textContent = total.toLocaleString();
}

// FUNCTIONING OF INCREASE AND DECREASE QUANTITY BUTTONS
// INCREASE BTN
const increaseButtons = document.querySelectorAll(".increase-quantity");
increaseButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const index = Array.from(increaseButtons).indexOf(button);
    cart[index].quantity++;
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
  });
});
// DECREASE BTN
const decreaseButtons = document.querySelectorAll(".decrease-quantity");
decreaseButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const index = Array.from(decreaseButtons).indexOf(button);
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
  });
});
// REMOVE BTN
const removeButtons = document.querySelectorAll(".remove-item");
removeButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const index = Array.from(removeButtons).indexOf(button);
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
  });
});

// CLEAR CART
const clearCart = document.getElementById("clearCart");
const checkCart = document.getElementById("checkCart");
const emptyCartState = document.getElementById("empty-cart-state");
const cartSummary = document.querySelector(".cart-total");
const customerDetails = document.querySelector(".customer-details");

function updateEmptyCartState() {
  const isEmpty = cart.length === 0;
  if (emptyCartState) emptyCartState.hidden = !isEmpty;
  if (cartSummary) cartSummary.hidden = isEmpty;
  if (customerDetails) customerDetails.hidden = isEmpty;
}

function clearAll() {
  cart = [];
  localStorage.removeItem("cart");
  if (cartTotal) cartTotal.textContent = "0";
  if (cartItems) cartItems.innerHTML = "";
  updateCartCount();
  updateEmptyCartState();
}

updateEmptyCartState();

if (clearCart) {
  clearCart.addEventListener("click", function () {
    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;";

    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "clear-cart-title");
    dialog.style.cssText =
      "width:100%;max-width:360px;background:#fff;border-radius:12px;padding:24px;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,.25);font-family:Arial,sans-serif;";

    const title = document.createElement("h2");
    title.id = "clear-cart-title";
    title.textContent = "Clear your cart?";
    title.style.cssText = "margin:0 0 10px;color:#222;";

    const message = document.createElement("p");
    message.textContent =
      "Are you sure you want to remove all items from your cart?";
    message.style.cssText = "margin:0 0 22px;color:#555;line-height:1.5;";

    const actions = document.createElement("div");
    actions.style.cssText = "display:flex;justify-content:center;gap:12px;";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "No, keep cart";
    cancelButton.style.cssText =
      "padding:10px 16px;border:1px solid #bbb;border-radius:6px;background:#fff;cursor:pointer;";

    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.textContent = "Yes, clear cart";
    confirmButton.style.cssText =
      "padding:10px 16px;border:0;border-radius:6px;background:#c62828;color:#fff;cursor:pointer;";

    cancelButton.addEventListener("click", function () {
      overlay.remove();
    });
    confirmButton.addEventListener("click", function () {
      overlay.remove();
      clearAll();
    });
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) overlay.remove();
    });

    actions.append(cancelButton, confirmButton);
    dialog.append(title, message, actions);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    confirmButton.focus();
  });
}

// UPDATE CART COUNT
const cartCount = document.getElementById("cart-count");

function updateCartCount() {
  const count = cart.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);
  if (cartCount) cartCount.textContent = count;
}

updateCartCount();

// PLACE ORDER VIA WHATSAPP
const whatsappButton = document.getElementById("whatsapp-order");
if (whatsappButton) {
  whatsappButton.addEventListener("click", function () {
    const name = document.getElementById("customer-name").value;
    const phone = document.getElementById("customer-phone").value;
    const address = document.getElementById("customer-address").value;

    if (name === "" || phone === "" || address === "") {
      alert("Please fill in all your details before placing an order.");
      return;
    }
    let message = "NEW BUSJIL ENTERPRISES ORDER\n\n";
    message += "CUSTOMER DETAILS\n ";
    message += "Customer Name: " + name + "\n";
    message += "Phone Number: " + phone + "\n";
    message += "Delivery Address: " + address + "\n\n";
    message += "ORDER DETAILS:\n";

    cart.forEach(function (item) {
      const itemTotal = item.price * item.quantity;

      message += ". " + item.name + " x " + item.quantity;
      message += " - ₦" + itemTotal.toLocaleString() + "\n";
    });
    const orderTotal = cart.reduce(function (total, item) {
      return total + item.price * item.quantity;
    }, 0);
    message += "\nTOTAL: ₦" + orderTotal.toLocaleString();
    const whatsappNumber = "2348060618853";
    const whatsappURL =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(message);
    window.open(whatsappURL, "_blank");
  });
}

const currentYearSpan = document.getElementById("current-year");
if (currentYearSpan) {
  const currentYear = new Date().getFullYear();
  currentYearSpan.textContent = currentYear;
}
