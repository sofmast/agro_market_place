/* =========================================================
   ZYACO FOOD MARKET
   JOIN PAGE
========================================================= */


const joinOptions =
    document.querySelectorAll(
        ".join-option"
    );


joinOptions.forEach(option => {

    option.addEventListener(
        "click",
        () => {

            const type =
                option.dataset.joinType;


            if(type === "partner"){

                window.location.href =
                    "partnership.html";

            }


            if(type === "supplier"){

                window.location.href =
                    "supplier.html";

            }

        }
    );

});


/* =========================================================
   BACK BUTTON
========================================================= */

const backButton =
    document.getElementById(
        "backButton"
    );


backButton?.addEventListener(
    "click",
    () => {

        if(
            window.history.length > 1
        ){

            window.history.back();

        }else{

            window.location.href =
                "index.html";

        }

    }
);