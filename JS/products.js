/* =========================================
   VIZA V
   PRODUCT DATA
========================================= */

const DEFAULT_PRODUCTS = [

    {
        id:"VV001",
        name:"Carrots",
        category:"roots",
        price:26,
        image:"images/Carrot.jpg",
        featured:true,
        badge:"POPULAR",
        description:
           "Fresh carrots available for the bettement of your health",
        unitCost:0,
        unit:"Kg"
    },

    {
        id:"VV002",
        name:"Beatroot",
        category:"roots",
        price:15,
        image:"images/beatroot2.jpg",
        featured:true,
        description:
            "A convenient natural multi purpose remedy.",
        unitCost:0,
        unit:"Kg"           
    },

    {
        id:"VV003",
        name:"Zyaco Cooking oil",
        category:"Cooking essentials",
        price:50,
        image:"images/cooking-oil.jpeg",
        featured:true,
        description:
            "A classic health cooking oil 1L",
        unitCost:0,
        unit:"Kg"            
    },

    {
        id:"VV004",
        name:"Galic",
        category:"Cooking essentials",
        price:17,
        image:"images/galic3.jpg",
        featured:true,
        description:
            "Fresh Galic",
         unitCost:0,
        unit:"Kg"           
    },
        {
        id:"VV004",
        name:"Onion White",
        category:"Cooking essentials",
        price:17,
        image:"images/onion.webp",
        featured:true,
        description:
            "White onion fresh from the farm per Kg",
         unitCost:0,
        unit:"Kg"           
    },

    {
        id:"VV005",
        name:"Cabbage",
        category:"Vegetables",
        price:15,
        image:"images/originalcabbage.jpg",
        featured:true,
        description:
            "Fresh cabbage experience real taste.",
        unitCost:0,
        unit:"Kg"
    },

    {
        id:"VV006",
        name:"Tomatoes",
        category:"Cooking essentials",
        price:10,
        image:"images/tomato.jpg",
        featured:true,
        description:
            "Fresh tomato adding real taste.",
        unitCost:0,
        unit:"Kg"
    }, 
    
        {
        id:"VV007",
        name:"Fresh Impwa",
        category:"Vegetables",
        price:15,
        image:"images/impwa.jpg",
        featured:false,
        description:
            "Fresh impwa farm tasty vegetable.",
        unitCost:0,
        unit:"Kg"
    },

        {
        id:"VV008",
        name:"Zyaco Delele Okra",
        category:"Vegetables",
        price:30,
        image:"images/okra2.jpg",
        featured:true,
        description:
            "Clean and fresh delele Okra.",
        unitCost:0,
        unit:"Kg"
    },

    {
        id:"VV009",
        name:"Irish potatoes",
        category:"roots",
        price:15,
        image:"images/potato.jpg",
        featured:false,
        description:
            "Fresh irish potatoes.",
        unitCost:0,
        unit:"Kg"
    },

    {
        id:"VV0010",
        name:"Cherry Tomato",
        category:"Cooking essentials",
        price:25,
        image:"images/Cherry.webp",
        featured:false,
        description:
            "Fresh cherry tomatoes per kg.",
        unitCost:0,
        unit:"Kg"
    },

    {
        id:"VV0011",
        name:"Zyaco premium rice",
        category:"Grains",
        price:25,
        image:"images/rice500g.jpeg",
        featured:true,
        description:
            "Clean extra long grain premium Nakonde rice 500g.",
        unitCost:0,
        unit:"500g"
    },
    
    {
        id:"VV0012",
        name:"premium rice",
        category:"Grains",
        price:85,
        image:"images/zrice.jpeg",
        featured:false,
        description:
            "Clean extra long grain premium Nakonde rice 2kg.",
        unitCost:0,
        unit:"2kg"
    }

];


function initializeProducts(){

    const existing =
        Storage.getProducts();

    if(existing.length === 0){

        Storage.saveProducts(
            DEFAULT_PRODUCTS
        );

    }

}


function getProducts(){

    return Storage.getProducts();

}