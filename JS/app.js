/* =========================================
   VIZA V
   APPLICATION ENGINE
========================================= */

let products = [];

let cart = [];

let activeCategory = "All";

let selectedProduct = null;

let selectedQuantity = 1;






/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


function initializeApp(){

    initializeProducts();

    products =
        getProducts();

    cart =
        Storage.getCart();

    renderCategories();

    renderFeaturedProducts();

    renderProducts();

    updateCartBadge();

    setupSearch();

    setupNavigation();

    setupProductSheet();

    setupCartSheet();

}


/* =========================================
   CATEGORIES
========================================= */

function renderCategories(){

    const container =
        document.getElementById(
            "categoryScroller"
        );

    const categories = [

        "All",

        ...new Set(
            products.map(
                product => product.category
            )
        )

    ];


    container.innerHTML = categories
        .map((category,index) => `

            <button
                class="category-button
                ${index === 0 ? "active" : ""}"
                type="button"
                data-category="${category}"
            >

                ${category}

            </button>

        `)
        .join("");


    container
        .querySelectorAll(
            ".category-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    activeCategory =
                        button.dataset.category;

                    container
                        .querySelectorAll(
                            ".category-button"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });

                    button.classList.add(
                        "active"
                    );

                    renderProducts();

                }
            );

        });

}


/* =========================================
   FEATURED
========================================= */

function renderFeaturedProducts(){

    const container =
        document.getElementById(
            "featuredProducts"
        );


    const featured =
        products.filter(
            product =>
                product.featured
        );


    container.innerHTML =
        featured
            .map(
                createProductCard
            )
            .join("");


    attachProductEvents(
        container
    );

}


/* =========================================
   ALL PRODUCTS
========================================= */

function renderProducts(
    filteredProducts = null
){

    const container =
        document.getElementById(
            "productGrid"
        );


    let list =
        filteredProducts ||
        products;


    if(
        !filteredProducts &&
        activeCategory !== "All"
    ){

        list =
            products.filter(
                product =>
                    product.category ===
                    activeCategory
            );

    }


    container.innerHTML =
        list
            .map(
                createProductCard
            )
            .join("");


    attachProductEvents(
        container
    );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if(list.length === 0){

        emptyState.classList.remove(
            "hidden"
        );

    }else{

        emptyState.classList.add(
            "hidden"
        );

    }

}


/* =========================================
   PRODUCT CARD
========================================= */

function createProductCard(product){

    return `

        <article
            class="product-card"
            data-product-id="${product.id}"
        >

            ${
                product.badge
                ?
                `
                <span class="product-badge">
                    ${product.badge}
                </span>
                `
                :
                ""
            }

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </div>


            <div class="product-info">

                <div class="product-name">
                    ${product.name}
                </div>

                <div class="product-price">
                    K${Number(product.price).toFixed(2)}
                </div>

            </div>

        </article>

    `;

}


/* =========================================
   PRODUCT EVENTS
========================================= */

function attachProductEvents(
    container
){

    container
        .querySelectorAll(
            ".product-card"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const id =
                        card.dataset.productId;

                    openProduct(id);

                }
            );

        });

}


/* =========================================
   PRODUCT OPEN
========================================= */

function openProduct(id){

    const product =
        products.find(
            item =>
                item.id === id
        );


    if(!product){

        return;

    }


    console.log(
        "Selected product:",
        product
    );

    /*
        Future:

        openProductModal(product)

        or

        navigateToProduct(product.id)
    */

}


/* =========================================
   SEARCH
========================================= */

function setupSearch(){

    const input =
        document.getElementById(
            "searchInput"
        );

    const clear =
        document.getElementById(
            "searchClear"
        );


    input.addEventListener(
        "input",
        event => {

            const query =
                event.target.value
                    .trim()
                    .toLowerCase();


            if(query){

                clear.classList.add(
                    "visible"
                );

            }else{

                clear.classList.remove(
                    "visible"
                );

            }


            const results =
                products.filter(
                    product => {

                        return (

                            product.name
                                .toLowerCase()
                                .includes(query)

                            ||

                            product.category
                                .toLowerCase()
                                .includes(query)

                        );

                    }
                );


            renderProducts(
                results
            );

        }
    );


    clear.addEventListener(
        "click",
        () => {

            input.value = "";

            clear.classList.remove(
                "visible"
            );

            activeCategory = "All";

            renderProducts();

            input.focus();

        }
    );

}


/* =========================================
   CART
========================================= */

function updateCartBadge(){

    const badge =
        document.getElementById(
            "cartBadge"
        );


    const count =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                item.quantity,

            0
        );


    badge.textContent =
        count > 99
        ? "99+"
        : count;

}


/* =========================================
   NAVIGATION
========================================= */

function setupNavigation(){

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset.page;


                    if(page === "cart"){

                        openCartSheet();

                        return;

                    }


                    document
                        .querySelectorAll(
                            ".nav-item"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    if(page === "home"){

                        window.scrollTo({
                            top:0,
                            behavior:"smooth"
                        });

                    }


                    if(page === "products"){

                        document
                            .getElementById(
                                "productGrid"
                            )
                            .scrollIntoView({
                                behavior:"smooth"
                            });

                    }


                    if(page === "account"){

                        console.log(
                            "Account screen coming next"
                        );

                    }

                }
            );

        });

}


/* =========================================
   PRODUCT SHEET
========================================= */

function setupProductSheet(){

    const overlay =
        document.getElementById(
            "productSheetOverlay"
        );

    const closeButton =
        document.getElementById(
            "closeProductSheet"
        );

    const decreaseButton =
        document.getElementById(
            "decreaseQuantity"
        );

    const increaseButton =
        document.getElementById(
            "increaseQuantity"
        );

    const addButton =
        document.getElementById(
            "addToCartButton"
        );


    closeButton.addEventListener(
        "click",
        closeProductSheet
    );


    overlay.addEventListener(
        "click",
        event => {

            if(
                event.target === overlay
            ){

                closeProductSheet();

            }

        }
    );


    decreaseButton.addEventListener(
        "click",
        () => {

            if(
                selectedQuantity > 1
            ){

                selectedQuantity--;

                updateQuantityDisplay();

            }

        }
    );


    increaseButton.addEventListener(
        "click",
        () => {

            if(
                selectedQuantity < 99
            ){

                selectedQuantity++;

                updateQuantityDisplay();

            }

        }
    );


    addButton.addEventListener(
        "click",
        addSelectedProductToCart
    );


    document.addEventListener(
        "keydown",
        event => {

            if(
                event.key === "Escape"
            ){

                closeProductSheet();

            }

        }
    );

}


/* =========================================
   OPEN PRODUCT
========================================= */

function openProduct(id){

    const product =
        products.find(
            item =>
                item.id === id
        );


    if(!product){

        return;

    }


    selectedProduct =
        product;

    selectedQuantity = 1;


    const image =
        document.getElementById(
            "sheetProductImage"
        );

    const category =
        document.getElementById(
            "sheetProductCategory"
        );

    const name =
        document.getElementById(
            "sheetProductName"
        );

    const price =
        document.getElementById(
            "sheetProductPrice"
        );

    const description =
        document.getElementById(
            "sheetProductDescription"
        );


    image.src =
        product.image;

    image.alt =
        product.name;

    category.textContent =
        product.category;

    name.textContent =
        product.name;

    price.textContent =
        formatCurrency(
            product.price
        );

    description.textContent =
        product.description ||
        "A quality product available from Viza V.";


    updateQuantityDisplay();


    const overlay =
        document.getElementById(
            "productSheetOverlay"
        );


    overlay.classList.add(
        "open"
    );

    overlay.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE
========================================= */

function closeProductSheet(){

    const overlay =
        document.getElementById(
            "productSheetOverlay"
        );


    overlay.classList.remove(
        "open"
    );

    overlay.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================
   QUANTITY DISPLAY
========================================= */

function updateQuantityDisplay(){

    const quantity =
        document.getElementById(
            "productQuantity"
        );

    const total =
        document.getElementById(
            "addToCartTotal"
        );


    quantity.textContent =
        selectedQuantity;


    if(selectedProduct){

        const value =
            selectedProduct.price *
            selectedQuantity;


        total.textContent =
            formatCurrency(value);

    }

}


/* =========================================
   ADD TO CART
========================================= */

function addSelectedProductToCart(){

    if(!selectedProduct){

        return;

    }


    const existing =
        cart.find(
            item =>
                item.productId ===
                selectedProduct.id
        );


    if(existing){

        existing.quantity +=
            selectedQuantity;

    }else{

        cart.push({

            productId:
                selectedProduct.id,

            quantity:
                selectedQuantity

        });

    }


    Storage.saveCart(cart);


    updateCartBadge();


    closeProductSheet();


    showCartFeedback();

}


/* =========================================
   CART FEEDBACK
========================================= */

function showCartFeedback(){

    const button =
        document.getElementById(
            "cartButton"
        );


    button.animate(

        [
            {
                transform:"scale(1)"
            },

            {
                transform:"scale(1.15)"
            },

            {
                transform:"scale(1)"
            }

        ],

        {

            duration:300

        }

    );

}


/* =========================================
   CURRENCY
========================================= */

function formatCurrency(value){

    return `K${Number(value).toFixed(2)}`;

}

/* =========================================
   CART SHEET
========================================= */

function setupCartSheet(){

    const overlay =
        document.getElementById(
            "cartSheetOverlay"
        );

    const closeButton =
        document.getElementById(
            "closeCartSheet"
        );

    const cartButton =
        document.getElementById(
            "cartButton"
        );

    const continueButton =
        document.getElementById(
            "continueShopping"
        );

    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );


    cartButton.addEventListener(
        "click",
        openCartSheet
    );


    closeButton.addEventListener(
        "click",
        closeCartSheet
    );


    overlay.addEventListener(
        "click",
        event => {

            if(
                event.target === overlay
            ){

                closeCartSheet();

            }

        }
    );


    continueButton.addEventListener(
        "click",
        closeCartSheet
    );


    checkoutButton.addEventListener(
        "click",
        () => {

            console.log(
                "Checkout started"
            );

        }
    );

}


/* =========================================
   OPEN CART
========================================= */

function openCartSheet(){

    renderCart();


    const overlay =
        document.getElementById(
            "cartSheetOverlay"
        );


    overlay.classList.add(
        "open"
    );


    overlay.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE CART
========================================= */

function closeCartSheet(){

    const overlay =
        document.getElementById(
            "cartSheetOverlay"
        );


    overlay.classList.remove(
        "open"
    );


    overlay.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}

/* =========================================
   RENDER CART
========================================= */

function renderCart(){

    const container =
        document.getElementById(
            "cartItems"
        );

    const empty =
        document.getElementById(
            "cartEmpty"
        );

    const summary =
        document.getElementById(
            "cartSummary"
        );


    if(cart.length === 0){

        container.innerHTML = "";

        empty.classList.remove(
            "hidden"
        );

        summary.classList.add(
            "hidden"
        );

        return;

    }


    empty.classList.add(
        "hidden"
    );

    summary.classList.remove(
        "hidden"
    );


    let subtotal = 0;

    let totalItems = 0;


    container.innerHTML =
        cart
            .map(item => {

                const product =
                    products.find(
                        product =>
                            product.id ===
                            item.productId
                    );


                if(!product){

                    return "";

                }


                const lineTotal =
                    product.price *
                    item.quantity;


                subtotal +=
                    lineTotal;


                totalItems +=
                    item.quantity;


                return `

                    <article
                        class="cart-item"
                        data-cart-id="${product.id}"
                    >

                        <div
                            class="cart-item-image"
                        >

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >

                        </div>


                        <div
                            class="cart-item-info"
                        >

                            <div
                                class="cart-item-name"
                            >
                                ${product.name}
                            </div>


                            <div
                                class="cart-item-price"
                            >
                                ${formatCurrency(
                                    product.price
                                )}
                            </div>


                            <div
                                class="cart-item-total"
                            >
                                ${formatCurrency(
                                    lineTotal
                                )}
                            </div>


                            <div
                                class="cart-quantity"
                            >

                                <button
                                    type="button"
                                    data-cart-action="decrease"
                                    data-product-id="${product.id}"
                                >
                                    −
                                </button>


                                <span>
                                    ${item.quantity}
                                </span>


                                <button
                                    type="button"
                                    data-cart-action="increase"
                                    data-product-id="${product.id}"
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <button
                            class="cart-remove"
                            type="button"
                            aria-label="Remove ${product.name}"
                            data-cart-action="remove"
                            data-product-id="${product.id}"
                        >
                            ×
                        </button>

                    </article>

                `;

            })
            .join("");


    document
        .getElementById(
            "cartItemCount"
        )
        .textContent =
        totalItems;


    document
        .getElementById(
            "cartSubtotal"
        )
        .textContent =
        formatCurrency(subtotal);


    document
        .getElementById(
            "cartTotal"
        )
        .textContent =
        formatCurrency(subtotal);


    document
        .getElementById(
            "checkoutTotal"
        )
        .textContent =
        formatCurrency(subtotal);


    setupCartItemEvents();

}

/* =========================================
   CART ITEM EVENTS
========================================= */

function setupCartItemEvents(){

    document
        .querySelectorAll(
            "[data-cart-action]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.cartAction;

                    const productId =
                        button.dataset.productId;


                    if(action === "increase"){

                        changeCartQuantity(
                            productId,
                            1
                        );

                    }


                    if(action === "decrease"){

                        changeCartQuantity(
                            productId,
                            -1
                        );

                    }


                    if(action === "remove"){

                        removeFromCart(
                            productId
                        );

                    }

                }
            );

        });

}


/* =========================================
   CHANGE QUANTITY
========================================= */

function changeCartQuantity(
    productId,
    amount
){

    const item =
        cart.find(
            item =>
                item.productId ===
                productId
        );


    if(!item){

        return;

    }


    item.quantity += amount;


    if(item.quantity <= 0){

        cart =
            cart.filter(
                cartItem =>
                    cartItem.productId !==
                    productId
            );

    }


    if(item.quantity > 99){

        item.quantity = 99;

    }


    Storage.saveCart(cart);

    updateCartBadge();

    renderCart();

}


/* =========================================
   REMOVE
========================================= */

function removeFromCart(
    productId
){

    cart =
        cart.filter(
            item =>
                item.productId !==
                productId
        );


    Storage.saveCart(cart);

    updateCartBadge();

    renderCart();

}