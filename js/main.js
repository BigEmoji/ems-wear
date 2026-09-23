const productContainer = document.getElementById(
    "featured-products-container"
);

function displayProducts() {

    products.forEach(function(product) {

        const productCard = document.createElement("article");

        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="product-info">
                <p class="product-category">${product.category}</p>

                <h3>${product.name}</h3>

                <p class="product-price">
                    ₦${product.price.toLocaleString()}
                </p>

                <button class="add-to-cart" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;

        productContainer.appendChild(productCard);
    });
}

displayProducts();