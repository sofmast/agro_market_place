/* =========================================================
   ZYACO FOOD MARKET
   SUPPLIER APPLICATION ENGINE
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const SUPPLIER_CONFIG = {

    storageKey:
        "zyaco_supplier_applications",

    applicationPrefix:
        "ZYM-S",

    totalSteps:
        4

};


/* =========================================================
   STORAGE / APPLICATION SERVICE
========================================================= */

const SupplierApplicationService = {

    getAll(){

        try{

            const stored =
                localStorage.getItem(
                    SUPPLIER_CONFIG.storageKey
                );


            if(!stored){

                return [];

            }


            const data =
                JSON.parse(stored);


            return Array.isArray(data)
                ? data
                : [];

        }catch(error){

            console.error(
                "Unable to read supplier applications:",
                error
            );

            return [];

        }

    },


    save(application){

        const applications =
            this.getAll();


        applications.push(
            application
        );


        localStorage.setItem(

            SUPPLIER_CONFIG.storageKey,

            JSON.stringify(
                applications
            )

        );


        return application;

    },


    findById(id){

        return this
            .getAll()
            .find(
                item =>
                    item.id === id
            );

    },


    async submit(application){

        /*
         * Development-only network simulation.
         *
         * Replace this service implementation
         * with an API request when the backend
         * is available.
         */

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    600
                )
        );


        return this.save(
            application
        );

    }

};


/* =========================================================
   STATE
========================================================= */

const supplierState = {

    currentStep:1,

    totalSteps:
        SUPPLIER_CONFIG.totalSteps,

    submitting:false

};


/* =========================================================
   DOM
========================================================= */

const supplierForm =
    document.getElementById(
        "supplierForm"
    );


const supplierSteps =
    document.querySelectorAll(
        ".supplier-step"
    );


const supplierProgressSteps =
    document.querySelectorAll(
        ".supplier-progress-step"
    );


const supplierProgressLines =
    document.querySelectorAll(
        ".supplier-progress-line"
    );


const supplierPreviousButton =
    document.getElementById(
        "supplierPreviousButton"
    );


const supplierNextButton =
    document.getElementById(
        "supplierNextButton"
    );


const supplierSubmitButton =
    document.getElementById(
        "supplierSubmitButton"
    );


const supplierReview =
    document.getElementById(
        "supplierReview"
    );


/* =========================================================
   FIELDS
========================================================= */

const supplierFields = {

    businessType:
        document.getElementById(
            "supplierBusinessType"
        ),

    businessName:
        document.getElementById(
            "supplierBusinessName"
        ),

    contactPerson:
        document.getElementById(
            "supplierContactPerson"
        ),

    phone:
        document.getElementById(
            "supplierPhone"
        ),

    email:
        document.getElementById(
            "supplierEmail"
        ),

    location:
        document.getElementById(
            "supplierLocation"
        ),

    productCategory:
        document.getElementById(
            "supplierCategory"
        ),

    productsSupplied:
        document.getElementById(
            "supplierProducts"
        ),

    supplyCapacity:
        document.getElementById(
            "supplierCapacity"
        ),

    deliveryCapability:
        document.getElementById(
            "deliveryCapability"
        ),

    supplyDescription:
        document.getElementById(
            "supplierDescription"
        )

};


/* =========================================================
   APPLICATION ID
========================================================= */

function generateSupplierApplicationId(){

    const timestamp =
        Date.now()
            .toString()
            .slice(-8);


    const random =
        Math.floor(
            100 +
            Math.random() * 900
        );


    return `${
        SUPPLIER_CONFIG.applicationPrefix
    }-${timestamp}-${random}`;

}


/* =========================================================
   FORM DATA
========================================================= */

function getSupplierFormData(){

    return {

        businessType:
            supplierFields
                .businessType
                .value
                .trim(),

        businessName:
            supplierFields
                .businessName
                .value
                .trim(),

        contactPerson:
            supplierFields
                .contactPerson
                .value
                .trim(),

        phone:
            supplierFields
                .phone
                .value
                .trim(),

        email:
            supplierFields
                .email
                .value
                .trim(),

        location:
            supplierFields
                .location
                .value
                .trim(),

        productCategory:
            supplierFields
                .productCategory
                .value
                .trim(),

        productsSupplied:
            supplierFields
                .productsSupplied
                .value
                .trim(),

        supplyCapacity:
            supplierFields
                .supplyCapacity
                .value
                .trim(),

        deliveryCapability:
            supplierFields
                .deliveryCapability
                .value
                .trim(),

        supplyDescription:
            supplierFields
                .supplyDescription
                .value
                .trim()

    };

}


/* =========================================================
   STEP MAP
========================================================= */

function getSupplierStepFields(
    step
){

    const map = {

        1: [

            supplierFields.businessType,

            supplierFields.businessName,

            supplierFields.contactPerson

        ],

        2: [

            supplierFields.phone,

            supplierFields.email,

            supplierFields.location

        ],

        3: [

            supplierFields.productCategory,

            supplierFields.productsSupplied,

            supplierFields.supplyCapacity,

            supplierFields.deliveryCapability,

            supplierFields.supplyDescription

        ],

        4: []

    };


    return map[step] || [];

}


/* =========================================================
   FIELD ERROR
========================================================= */

function supplierFieldError(
    field,
    message
){

    const wrapper =
        field?.closest(
            ".supplier-field"
        );


    if(!wrapper){

        return false;

    }


    wrapper.classList.add(
        "invalid"
    );

    wrapper.classList.remove(
        "valid"
    );


    const error =
        wrapper.querySelector(
            ".supplier-error"
        );


    if(error){

        error.textContent =
            message;

    }


    return false;

}


/* =========================================================
   FIELD VALID
========================================================= */

function supplierFieldValid(
    field
){

    const wrapper =
        field?.closest(
            ".supplier-field"
        );


    if(!wrapper){

        return true;

    }


    wrapper.classList.remove(
        "invalid"
    );

    wrapper.classList.add(
        "valid"
    );


    const error =
        wrapper.querySelector(
            ".supplier-error"
        );


    if(error){

        error.textContent =
            "";

    }


    return true;

}


/* =========================================================
   VALIDATE FIELD
========================================================= */

function validateSupplierField(
    field
){

    if(!field){

        return true;

    }


    const value =
        field.value.trim();


    /*
     * Required
     */

    if(
        field.hasAttribute("required") &&
        !value
    ){

        return supplierFieldError(
            field,
            "This field is required."
        );

    }


    /*
     * Phone
     */

    if(
        field === supplierFields.phone &&
        value
    ){

        const pattern =
            /^[+]?[0-9\s()-]{7,20}$/;


        if(
            !pattern.test(
                value
            )
        ){

            return supplierFieldError(
                field,
                "Enter a valid phone number."
            );

        }

    }


    /*
     * Email
     */

    if(
        field === supplierFields.email &&
        value
    ){

        const pattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if(
            !pattern.test(
                value
            )
        ){

            return supplierFieldError(
                field,
                "Enter a valid email address."
            );

        }

    }


    /*
     * Products
     */

    if(
        field ===
        supplierFields.productsSupplied &&
        value.length < 3
    ){

        return supplierFieldError(
            field,
            "Please list the products you supply."
        );

    }


    /*
     * Supply capacity
     */

    if(
        field ===
        supplierFields.supplyCapacity &&
        value.length < 2
    ){

        return supplierFieldError(
            field,
            "Please provide your estimated capacity."
        );

    }


    return supplierFieldValid(
        field
    );

}


/* =========================================================
   VALIDATE STEP
========================================================= */

function validateSupplierStep(
    step
){

    const fields =
        getSupplierStepFields(
            step
        );


    let valid = true;


    fields.forEach(
        field => {

            if(
                !validateSupplierField(
                    field
                )
            ){

                valid = false;

            }

        }
    );


    if(!valid){

        const firstInvalid =
            fields.find(
                field =>
                    field
                    ?.closest(
                        ".supplier-field"
                    )
                    ?.classList
                    .contains(
                        "invalid"
                    )
            );


        firstInvalid?.focus();

    }


    return valid;

}


/* =========================================================
   SHOW STEP
========================================================= */

function showSupplierStep(
    step
){

    supplierState.currentStep =
        step;


    supplierSteps.forEach(
        section => {

            const sectionStep =
                Number(
                    section.dataset.step
                );


            section.classList.toggle(
                "active",
                sectionStep === step
            );

        }
    );


    supplierProgressSteps.forEach(
        (item,index) => {

            const itemStep =
                index + 1;


            item.classList.toggle(
                "active",
                itemStep === step
            );


            item.classList.toggle(
                "completed",
                itemStep < step
            );

        }
    );


    supplierProgressLines.forEach(
        (line,index) => {

            line.classList.toggle(
                "completed",
                index < step - 1
            );

        }
    );


    supplierPreviousButton.classList.toggle(
        "hidden",
        step === 1
    );


    supplierNextButton.classList.toggle(
        "hidden",
        step === supplierState.totalSteps
    );


    supplierSubmitButton.classList.toggle(
        "hidden",
        step !== supplierState.totalSteps
    );


    if(
        step === supplierState.totalSteps
    ){

        buildSupplierReview();

    }


    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeSupplierHtml(
    value
){

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   SELECT LABEL
========================================================= */

function selectedText(
    field,
    fallback
){

    return (
        field
            ?.selectedOptions[0]
            ?.textContent
            ?.trim()
    ) || fallback;

}


/* =========================================================
   REVIEW
========================================================= */

function buildSupplierReview(){

    if(!supplierReview){

        return;

    }


    const data =
        getSupplierFormData();


    const businessType =
        selectedText(
            supplierFields.businessType,
            data.businessType
        );


    const category =
        selectedText(
            supplierFields.productCategory,
            data.productCategory
        );


    const delivery =
        selectedText(
            supplierFields.deliveryCapability,
            data.deliveryCapability
        );


    supplierReview.innerHTML = `

        <div class="supplier-review-group">

            <div class="supplier-review-title">
                Business
            </div>


            <div class="supplier-review-row">

                <span class="supplier-review-label">
                    Business type
                </span>

                <span class="supplier-review-value">
                    ${escapeSupplierHtml(
                        businessType
                    )}
                </span>

            </div>


            <div class="supplier-review-row">

                <span class="supplier-review-label">
                    Business
                </span>

                <span class="supplier-review-value">
                    ${escapeSupplierHtml(
                        data.businessName
                    )}
                </span>

            </div>


            <div class="supplier-review-row">

                <span class="supplier-review-label">
                    Contact
                </span>

                <span class="supplier-review-value">
                    ${escapeSupplierHtml(
                        data.contactPerson
                    )}
                </span>

            </div>

        </div>


        <div class="supplier-review-group">

            <div class="supplier-review-title">
                Contact
            </div>


            <div class="supplier-review-row">

                <span class="supplier-review-label">
                    Phone
                </span>

                <span class="supplier-review-value">
                    ${escapeSupplierHtml(
                        data.phone
                    )}
                </span>

            </div>


            <div class="supplier-review-row">

                <span class="supplier-review-label">
                    Email
                </span>

                <span class="supplier-review-value">
                    ${escapeSupplierHtml(
                        data.email ||
                        "Not provided"
                    )}
                </span>

            </div>


            <div class="supplier-review-row">

                <span class="supplier-review-label">
                    Location
                </span>

                <span class="supplier-review-value">
                    ${escapeSupplierHtml(
                        data.location
                    )}
                </span>

            </div>

        </div>


        <div class="supplier-review-group">

            <div class="supplier-review-title">
                Supply
            </div>


            <div class="supplier-review-row">

                <span class="supplier-review-label">
                    Category
                </span>

                <span class="supplier-review-value">
                    ${escapeSupplierHtml(
                        category
                    )}
                </span>

            </div>


            <div class="supplier-review-row">

                <span class="supplier-review-label">
                    Products
                </span>

                <span class="supplier-review-value">
                    ${escapeSupplierHtml(
                        data.productsSupplied
                    )}
                </span>

            </div>


            <div class="supplier-review-row">

                <span class="supplier-review-label">
                    Capacity
                </span>

                <span class="supplier-review-value">
                    ${escapeSupplierHtml(
                        data.supplyCapacity
                    )}
                </span>

            </div>


            <div class="supplier-review-row">

                <span class="supplier-review-label">
                    Delivery
                </span>

                <span class="supplier-review-value">
                    ${escapeSupplierHtml(
                        delivery
                    )}
                </span>

            </div>


            ${
                data.supplyDescription
                ? `

                <div class="supplier-review-row">

                    <span class="supplier-review-label">
                        Description
                    </span>

                    <span class="supplier-review-value">
                        ${escapeSupplierHtml(
                            data.supplyDescription
                        )}
                    </span>

                </div>

                `
                : ""
            }

        </div>

    `;

}


/* =========================================================
   BUILD BACKEND-READY OBJECT
========================================================= */

function buildSupplierApplication(){

    const data =
        getSupplierFormData();


    const now =
        new Date();


    return {

        /*
         * Identification
         */

        id:
            generateSupplierApplicationId(),

        applicationType:
            "supplier",

        applicationVersion:
            1,


        /*
         * Workflow
         */

        status:
            "pending_review",


        /*
         * Business
         */

        supplier: {

            businessType:
                data.businessType,

            businessName:
                data.businessName,

            contactPerson:
                data.contactPerson

        },


        /*
         * Contact
         */

        contact: {

            phone:
                data.phone,

            email:
                data.email,

            location:
                data.location

        },


        /*
         * Supply information
         */

        supply: {

            productCategory:
                data.productCategory,

            productsSupplied:
                data.productsSupplied,

            supplyCapacity:
                data.supplyCapacity,

            deliveryCapability:
                data.deliveryCapability,

            description:
                data.supplyDescription

        },


        /*
         * System metadata
         */

        metadata: {

            createdAt:
                now.toISOString(),

            updatedAt:
                now.toISOString(),

            source:
                "web",

            platform:
                "mobile_web",

            submittedFrom:
                window.location.href

        }

    };

}


/* =========================================================
   SUBMIT
========================================================= */

async function submitSupplierApplication(){

    if(
        supplierState.submitting
    ){

        return;

    }


    /*
     * Validate steps 1-3.
     */

    for(
        let step = 1;
        step <= 3;
        step++
    ){

        if(
            !validateSupplierStep(
                step
            )
        ){

            showSupplierStep(
                step
            );

            return;

        }

    }


    supplierState.submitting =
        true;


    supplierSubmitButton.classList.add(
        "submitting"
    );


    supplierSubmitButton.disabled =
        true;


    try{

        const application =
            buildSupplierApplication();


        const saved =
            await SupplierApplicationService.submit(
                application
            );


        showSupplierSuccess(
            saved
        );


    }catch(error){

        console.error(
            "Supplier application failed:",
            error
        );


        alert(
            "We could not submit your application. Please try again."
        );


    }finally{

        supplierState.submitting =
            false;

        supplierSubmitButton.classList.remove(
            "submitting"
        );

        supplierSubmitButton.disabled =
            false;

    }

}


/* =========================================================
   SUCCESS
========================================================= */

function showSupplierSuccess(
    application
){

    supplierForm.innerHTML = `

        <section class="supplier-success">

            <div class="supplier-success-icon">
                ✓
            </div>


            <h2>
                Application received
            </h2>


            <p>
                Thank you for your interest in
                becoming a Zyaco Food Market supplier.
                Our team will review your application
                and contact you.
            </p>


            <div class="supplier-reference">

                <span>
                    Application reference
                </span>

                <strong>
                    ${escapeSupplierHtml(
                        application.id
                    )}
                </strong>

            </div>


            <button
                type="button"
                class="supplier-button primary"
                id="supplierReturnHome"
                style="width:100%;margin-top:14px;"
            >
                Return Home
            </button>

        </section>

    `;


    document
        .getElementById(
            "supplierReturnHome"
        )
        ?.addEventListener(
            "click",
            () => {

                window.location.href =
                    "index.html";

            }
        );

}


/* =========================================================
   NEXT
========================================================= */

supplierNextButton?.addEventListener(
    "click",
    () => {

        const current =
            supplierState.currentStep;


        if(
            !validateSupplierStep(
                current
            )
        ){

            return;

        }


        if(
            current <
            supplierState.totalSteps
        ){

            showSupplierStep(
                current + 1
            );

        }

    }
);


/* =========================================================
   PREVIOUS
========================================================= */

supplierPreviousButton?.addEventListener(
    "click",
    () => {

        const current =
            supplierState.currentStep;


        if(
            current > 1
        ){

            showSupplierStep(
                current - 1
            );

        }

    }
);


/* =========================================================
   SUBMIT EVENT
========================================================= */

supplierForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        submitSupplierApplication();

    }
);


/* =========================================================
   LIVE VALIDATION
========================================================= */

Object
    .values(supplierFields)
    .forEach(
        field => {

            if(!field){

                return;

            }


            field.addEventListener(
                "blur",
                () => {

                    if(
                        field.value.trim()
                    ){

                        validateSupplierField(
                            field
                        );

                    }

                }
            );


            field.addEventListener(
                "input",
                () => {

                    const wrapper =
                        field.closest(
                            ".supplier-field"
                        );


                    wrapper?.classList.remove(
                        "invalid"
                    );

                }
            );

        }
    );


/* =========================================================
   CHARACTER COUNTERS
========================================================= */

function setupSupplierCounter(
    field,
    counter
){

    if(
        !field ||
        !counter
    ){

        return;

    }


    function update(){

        counter.textContent =
            `${field.value.length} / ${field.maxLength}`;

    }


    field.addEventListener(
        "input",
        update
    );


    update();

}


setupSupplierCounter(

    supplierFields.productsSupplied,

    document.getElementById(
        "productsCount"
    )

);


setupSupplierCounter(

    supplierFields.supplyDescription,

    document.getElementById(
        "descriptionCount"
    )

);


/* =========================================================
   BACK BUTTON
========================================================= */

document
    .getElementById(
        "backButton"
    )
    ?.addEventListener(
        "click",
        () => {

            if(
                window.history.length > 1
            ){

                window.history.back();

            }else{

                window.location.href =
                    "join.html";

            }

        }
    );


/* =========================================================
   INITIALIZE
========================================================= */

showSupplierStep(1);