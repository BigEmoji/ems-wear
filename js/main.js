// let cart = [];
let cart = JSON.parse(localStorage.getItem("emsWearCart")) || [];


const productContainer = document.getElementById(
    "featured-products-container"
);

const cartButton = document.getElementById("cart-button");
const cartPanel = document.getElementById("cart-panel");
const closeCartButton = document.getElementById("close-cart");

const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total"); 

const checkoutButton = document.getElementById("checkout-button");
const themeToggle = document.getElementById("theme-toggle");

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

function saveCart() {
    localStorage.setItem("emsWearCart", JSON.stringify(cart));
}

function toggleTheme() {

    document.body.classList.toggle("dark-mode");


    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("emsWearTheme", "dark");

        themeToggle.textContent = "☀️";

    } else {

        localStorage.setItem("emsWearTheme", "light");

        themeToggle.textContent = "🌙";
    }
}

themeToggle.addEventListener("click", function() {
    toggleTheme();
});

menuToggle.addEventListener("click", function() {

    navLinks.classList.toggle("active");


    if (navLinks.classList.contains("active")) {

        menuToggle.textContent = "✕";

    } else {

        menuToggle.textContent = "☰";
    }

});

function loadTheme() {

    const savedTheme =
        localStorage.getItem("emsWearTheme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeToggle.textContent = "☀️";
    }
}

cartButton.addEventListener("click", function() {
    cartPanel.classList.add("active");
});

closeCartButton.addEventListener("click", function() {
    cartPanel.classList.remove("active");
});


function displayProducts(productList = products) {

    productContainer.innerHTML = "";

    productList.forEach(function(product) {

        const productCard = document.createElement("article");

        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <div class="product-image">
               <img 
                src="${window.location.pathname.includes("/pages/") ? "../" : ""}${product.image}" 
                alt="${product.name}"
               >
            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>
                    ${product.name}
                </h3>

                <p class="product-price">
                    ₦${product.price.toLocaleString()}
                </p>

                <label for="size-${product.id}">
                    Size:
                </label>

                <select 
                    class="size-select"
                    id="size-${product.id}"
                    data-id="${product.id}"
                >
                    <option value="">
                        Select size
                    </option>

                    ${product.sizes.map(function(size) {
                        return `
                            <option value="${size}">
                                ${size}
                            </option>
                        `;
                    }).join("")}

                </select>

                <button 
                    class="add-to-cart" 
                    data-id="${product.id}">
                    Add to Cart
                </button>

            </div>
        `;

        productContainer.appendChild(productCard);
    });
}

function filterProducts() {

    const searchTerm = searchInput.value.toLowerCase();

    const selectedCategory = categoryFilter.value;


    const filteredProducts = products.filter(function(product) {

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm);


        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;


        return matchesSearch && matchesCategory;
    });


    displayProducts(filteredProducts);
}

searchInput.addEventListener("input", function() {
    filterProducts();
});

categoryFilter.addEventListener("change", function() {
    filterProducts();
});

function addToCart(productId, selectedSize) {

    const product = products.find(function(product) {
        return product.id === productId;
    });


    if (!product) {
        return;
    }


    const existingItem = cart.find(function(item) {

        return (
            item.id === productId &&
            item.size === selectedSize
        );

    });


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            ...product,

            size: selectedSize,

            quantity: 1

        });

    }


    saveCart();
    updateCart();
}

// displayProducts();

productContainer.addEventListener("click", function(event) {

    if (event.target.classList.contains("add-to-cart")) {

        const productId = Number(
            event.target.dataset.id
        );


        const sizeSelect = document.querySelector(
            `.size-select[data-id="${productId}"]`
        );


        const selectedSize = sizeSelect.value;


        if (selectedSize === "") {

            alert("Please select a size.");

            return;
        }


        addToCart(
            productId,
            Number(selectedSize)
        );
    }

});

function updateCart() {

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        cartCount.textContent = "0";
        cartTotal.textContent = "₦0";

        return;
    }


    cart.forEach(function(product) {

    const cartItem = document.createElement("div");

    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
    <div>
        <h3>${product.name}</h3>
        <p>
        Size: ${product.size}
        </p>

        <p>
        ₦${product.price.toLocaleString()} × ${product.quantity}
        </p>

        <p class="cart-item-subtotal">
        Subtotal: ₦${(
        product.price * product.quantity
        ).toLocaleString()}
        </p>

        <div class="quantity-controls">

            <button
                class="quantity-btn decrease"
                data-id="${product.id}">
                −
            </button>

            <span>${product.quantity}</span>

            <button
                class="quantity-btn increase"
                data-id="${product.id}">
                +
            </button>

        </div>

        <button
            class="remove-item"
            data-id="${product.id}">
            Remove
        </button>

    </div>
`;

    cartItemsContainer.appendChild(cartItem);

});


    const totalQuantity = cart.reduce(function(sum, product) {

    return sum + product.quantity;

}, 0);

cartCount.textContent = totalQuantity;


    const total = cart.reduce(function(sum, product) {
    return sum + (product.price * product.quantity);
    }, 0);


    cartTotal.textContent = `₦${total.toLocaleString()}`;
}

    cartItemsContainer.addEventListener("click", function(event) {

    const productId = Number(event.target.dataset.id);

    if (event.target.classList.contains("increase")) {
        changeQuantity(productId, 1);
    }

    if (event.target.classList.contains("decrease")) {
        changeQuantity(productId, -1);
    }

    if (event.target.classList.contains("remove-item")) {
        removeFromCart(productId);
    }

});


function changeQuantity(productId, change) {

    const item = cart.find(function(product) {

        return product.id === productId;

    });

    // If product doesn't exist

    if (!item) {

        return;

    }

    // Change quantity

    item.quantity += change;

    // If quantity becomes 0

    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }

    // updateCart();
    saveCart();
    updateCart();

}

// ==============================

// REMOVE FROM CART

// ==============================

function removeFromCart(productId) {

    cart = cart.filter(function(product) {

        return product.id !== productId;

    });

        // updateCart();
        saveCart();
        updateCart();

}

    function checkout() {

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }


    let message = "Hello Em's Wear! 👋\n\n";
    message += "I would like to place an order:\n\n";


    cart.forEach(function(product) {

        message += `${product.name}\n`;
        message += `Size: ${product.size}\n`;
        message += `Quantity: ${product.quantity}\n`;
        message += `Price: ₦${product.price.toLocaleString()}\n\n`;

    });


    const total = cart.reduce(function(sum, product) {

        return sum + (
            product.price * product.quantity
        );

    }, 0);


    message += `Total: ₦${total.toLocaleString()}\n\n`;

    message += "Please let me know the next steps. Thank you!";


    const whatsappNumber = "2349067287592";

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


    window.open(whatsappURL, "_blank");
}

checkoutButton.addEventListener("click", function() {
    checkout();
});



// ==============================

// START WEBSITE

// ==============================

// displayProducts();
if (window.location.pathname.includes("/pages/")) {
    displayProducts();
} else {
    const featuredProducts = products.filter(function(product) {
        return product.featured === true;
    });

    displayProducts(featuredProducts);
}
updateCart();
loadTheme();