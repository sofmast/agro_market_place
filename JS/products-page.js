/* =========================================
   VIZA V
   PRODUCTS MANAGEMENT
========================================= */

let managementProducts = [];

let selectedFilter = "All";

let sortNewest = true;


document.addEventListener(
    "DOMContentLoaded",
    initializeProductsPage
);


function initializeProductsPage(){

    managementProducts =
        Storage.getProducts();

    renderFilters();

    renderManagementProducts();

    setupSearch();

    setupSort();

}


/* =========================================
   FILTERS
========================================= */

function renderFilters(){

    const container =
        document.getElementById(
            "productsFilters"
        );


    const categories = [

        "All",

        ...new Set(
            managementProducts.map(
                product =>
                    product.category
            )
        )

    ];


    container.innerHTML =
        categories
            .map(category => `

                <button
                    class="filter-button
                    ${
                        category === "All"
                        ? "active"
                        : ""
                    }"
                    data-filter="${category}"
                    type="button"
                >
                    ${category}
                </button>

            `)
            .join("");


    container
        .querySelectorAll(
            ".filter-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectedFilter =
                        button.dataset.filter;


                    container
                        .querySelectorAll(
                            ".filter-button"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    renderManagementProducts();

                }
            );

        });

}


/* =========================================
   RENDER
========================================= */

function renderManagementProducts(
    filtered = null
){

    const container =
        document.getElementById(
            "managementGrid"
        );


    let list =
        filtered ||
        managementProducts;


    if(
        !filtered &&
        selectedFilter !== "All"
    ){

        list =
            managementProducts.filter(
                product =>
                    product.category ===
                    selectedFilter
            );

    }


    list = [...list];


    if(sortNewest){

        list.sort(
            (a,b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        );

    }


    document
        .getElementById(
            "productCount"
        )
        .textContent =
        list.length;


    if(list.length === 0){

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📦
                </div>

                <h3>
                    No products found
                </h3>

                <p>
                    Add a product or change your search.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        list
            .map(
                createManagementCard
            )
            .join("");


    setupManagementActions();

}


/* =========================================
   CARD
========================================= */

function createManagementCard(product){

    const image =
        product.image ||
        "images/products/placeholder.jpg";


    return `

        <article
            class="management-card"
            data-product-id="${product.id}"
        >

            <div class="management-image">

                <img
                    src="${image}"
                    alt="${product.name}"
                    loading="lazy"
                >


                <span
                    class="management-status
                    ${
                        product.active === false
                        ? "inactive"
                        : ""
                    }"
                >

                    ${
                        product.active === false
                        ? "INACTIVE"
                        : "ACTIVE"
                    }

                </span>

            </div>


            <div class="management-content">

                <div class="management-name">

                    ${product.name}

                </div>


                <div class="management-category">

                    ${product.category}

                </div>


                <div class="management-price">

                    K${Number(
                        product.price
                    ).toFixed(2)}

                </div>


                <div class="management-stock">

                    Stock:
                    ${product.stock ?? 0}

                </div>


                <div class="management-actions">

                    <button
                        class="edit-product"
                        data-action="edit"
                        data-id="${product.id}"
                        type="button"
                    >
                        Edit
                    </button>


                    <button
                        class="delete-product"
                        data-action="delete"
                        data-id="${product.id}"
                        type="button"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================
   ACTIONS
========================================= */

function setupManagementActions(){

    document
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.action;

                    const id =
                        button.dataset.id;


                    if(action === "edit"){

                        editProduct(id);

                    }


                    if(action === "delete"){

                        deleteProduct(id);

                    }

                }
            );

        });

}


/* =========================================
   EDIT
========================================= */

function editProduct(id){

    /*
        We will build the proper
        edit-product screen next.
    */

    window.location.href =
        `add-product.html?edit=${encodeURIComponent(id)}`;

}


/* =========================================
   DELETE
========================================= */

function deleteProduct(id){

    const product =
        managementProducts.find(
            item =>
                item.id === id
        );


    if(!product){

        return;

    }


    const confirmed =
        confirm(
            `Delete "${product.name}"?`
        );


    if(!confirmed){

        return;

    }


    managementProducts =
        managementProducts.filter(
            item =>
                item.id !== id
        );


    Storage.saveProducts(
        managementProducts
    );


    renderFilters();

    renderManagementProducts();

}


/* =========================================
   SEARCH
========================================= */

function setupSearch(){

    const input =
        document.getElementById(
            "productsSearch"
        );


    input.addEventListener(
        "input",
        () => {

            const query =
                input.value
                    .trim()
                    .toLowerCase();


            if(!query){

                renderManagementProducts();

                return;

            }


            const results =
                managementProducts.filter(
                    product =>

                        product.name
                            .toLowerCase()
                            .includes(query)

                        ||

                        product.category
                            .toLowerCase()
                            .includes(query)

                        ||

                        product.id
                            .toLowerCase()
                            .includes(query)

                );


            renderManagementProducts(
                results
            );

        }
    );

}


/* =========================================
   SORT
========================================= */

function setupSort(){

    const button =
        document.getElementById(
            "sortButton"
        );


    button.addEventListener(
        "click",
        () => {

            sortNewest =
                !sortNewest;


            button.textContent =
                sortNewest
                ? "Newest ↓"
                : "Oldest ↑";


            renderManagementProducts();

        }
    );

}