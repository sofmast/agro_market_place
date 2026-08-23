/* =========================================
   VIZA V
   STORAGE LAYER
========================================= */

const Storage = {

    PRODUCTS_KEY: "viza_v_products",

    CART_KEY: "viza_v_cart",


    getProducts(){

        try{

            const data =
                localStorage.getItem(
                    this.PRODUCTS_KEY
                );

            return data
                ? JSON.parse(data)
                : [];

        }catch(error){

            console.error(
                "Unable to read products:",
                error
            );

            return [];

        }

    },


    saveProducts(products){

        localStorage.setItem(

            this.PRODUCTS_KEY,

            JSON.stringify(products)

        );

    },


    getCart(){

        try{

            const data =
                localStorage.getItem(
                    this.CART_KEY
                );

            return data
                ? JSON.parse(data)
                : [];

        }catch(error){

            console.error(
                "Unable to read cart:",
                error
            );

            return [];

        }

    },


    saveCart(cart){

        localStorage.setItem(

            this.CART_KEY,

            JSON.stringify(cart)

        );

    }

};