/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton =
    document.getElementById("menuButton");

const closeMenuButton =
    document.getElementById("closeMenuButton");

const mobileMenu =
    document.getElementById("mobileMenu");

const menuBackdrop =
    document.getElementById("menuBackdrop");


/* =========================================
   OPEN MENU
========================================= */

function openMobileMenu(){

    if(!mobileMenu) return;

    mobileMenu.classList.add("open");

    mobileMenu.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "menu-open"
    );

}


/* =========================================
   CLOSE MENU
========================================= */

function closeMobileMenu(){

    if(!mobileMenu) return;

    mobileMenu.classList.remove("open");

    mobileMenu.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "menu-open"
    );

}


/* =========================================
   BUTTON EVENTS
========================================= */

menuButton?.addEventListener(
    "click",
    openMobileMenu
);


closeMenuButton?.addEventListener(
    "click",
    closeMobileMenu
);


menuBackdrop?.addEventListener(
    "click",
    closeMobileMenu
);


/* =========================================
   NAVIGATION
========================================= */

document
    .querySelectorAll(
        ".mobile-nav-item, .mobile-business-link"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const destination =
                    button.dataset.link;

                if(!destination) return;

                closeMobileMenu();


                /*
                 * Small delay allows the closing
                 * animation to begin before navigation.
                 */

                setTimeout(() => {

                    window.location.href =
                        destination;

                }, 180);

            }
        );

    });


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Escape" &&
            mobileMenu?.classList.contains("open")
        ){

            closeMobileMenu();

        }

    }
);