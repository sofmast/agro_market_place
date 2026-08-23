/* =========================================
   VIZA V
   PRODUCT MANAGER
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeProductForm
);


function initializeProductForm(){

    const form =
        document.getElementById(
            "productForm"
        );

    const imageInput =
        document.getElementById(
            "productImage"
        );


    form.addEventListener(
        "submit",
        saveProduct
    );


    imageInput.addEventListener(
        "change",
        previewImage
    );

}


/* =========================================
   IMAGE PREVIEW
========================================= */

function previewImage(event){

    const file =
        event.target.files[0];


    if(!file){

        return;

    }


    if(!file.type.startsWith("image/")){

        alert(
            "Please select an image file."
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload = function(){

        const preview =
            document.getElementById(
                "imagePreview"
            );


        preview.innerHTML = `

            <img
                src="${reader.result}"
                alt="Product preview"
            >

        `;


        preview.querySelector(
            "img"
        ).style.cssText = `
            width:100%;
            height:100%;
            object-fit:cover;
        `;

    };


    reader.readAsDataURL(file);

}


/* =========================================
   SAVE PRODUCT
========================================= */

function saveProduct(event){

    event.preventDefault();


    const name =
        document
            .getElementById(
                "productName"
            )
            .value
            .trim();


    const category =
        document
            .getElementById(
                "productCategory"
            )
            .value
            .trim();


    const description =
        document
            .getElementById(
                "productDescription"
            )
            .value
            .trim();


    const price =
        Number(
            document
                .getElementById(
                    "productPrice"
                )
                .value
        );


    const stock =
        Number(
            document
                .getElementById(
                    "productStock"
                )
                .value
        );


    const featured =
        document
            .getElementById(
                "productFeatured"
            )
            .checked;


    const active =
        document
            .getElementById(
                "productActive"
            )
            .checked;


    /* ================================
       VALIDATION
    ================================= */

    if(!name){

        alert(
            "Product name is required."
        );

        return;

    }


    if(!category){

        alert(
            "Product category is required."
        );

        return;

    }


    if(!Number.isFinite(price) || price < 0){

        alert(
            "Enter a valid product price."
        );

        return;

    }


    if(!Number.isInteger(stock) || stock < 0){

        alert(
            "Enter a valid stock quantity."
        );

        return;

    }


    /* ================================
       IMAGE
    ================================= */

    const image =
        document.querySelector(
            "#imagePreview img"
        );


    const imageData =
        image
        ? image.src
        : "";


    /* ================================
       PRODUCT OBJECT
    ================================= */

    const product = {

        id:
            generateProductId(),

        name,

        category,

        description,

        price,

        stock,

        image:
            imageData,

        featured,

        active,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    /* ================================
       SAVE
    ================================= */

    const products =
        Storage.getProducts();


    products.push(
        product
    );


    Storage.saveProducts(
        products
    );


    /* ================================
       SUCCESS
    ================================= */

    alert(
        "Product added successfully."
    );


    window.location.href =
        "products.html";

}


/* =========================================
   PRODUCT ID
========================================= */

function generateProductId(){

    return "VV-" +
        Date.now().toString(36)
        .toUpperCase();

}