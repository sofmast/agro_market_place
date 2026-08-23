/* =========================================================
   ZYACO FOOD MARKET
   PARTNERSHIP APPLICATION ENGINE

   Architecture:

   UI
    ↓
   Form Controller
    ↓
   Application Service
    ↓
   Storage Adapter
    ↓
   localStorage (development)

   Future:

   Application Service
    ↓
   API Client
    ↓
   Backend
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const PARTNERSHIP_CONFIG = {

    storageKey:
        "zyaco_partnership_applications",

    applicationPrefix:
        "ZYM-P",

    totalSteps:
        4

};


/* =========================================================
   APPLICATION SERVICE
========================================================= */

const ApplicationService = {


    /* =========================================
       GET ALL APPLICATIONS
    ========================================= */

    getAll(){

        try{

            const stored =
                localStorage.getItem(
                    PARTNERSHIP_CONFIG.storageKey
                );

            if(!stored){

                return [];

            }

            const applications =
                JSON.parse(stored);

            return Array.isArray(applications)
                ? applications
                : [];

        }catch(error){

            console.error(
                "Unable to load applications:",
                error
            );

            return [];

        }

    },


    /* =========================================
       SAVE APPLICATION
    ========================================= */

    save(application){

        const applications =
            this.getAll();


        applications.push(application);


        localStorage.setItem(

            PARTNERSHIP_CONFIG.storageKey,

            JSON.stringify(
                applications
            )

        );


        return application;

    },


    /* =========================================
       FIND APPLICATION
    ========================================= */

    findById(id){

        return this
            .getAll()
            .find(
                application =>
                    application.id === id
            );

    },


    /* =========================================
       SUBMIT

       IMPORTANT:

       Currently uses localStorage.

       Later this function becomes:

       return ApiClient.post(
           "/api/applications/partnership",
           application
       );

       The UI does NOT need to change.
    ========================================= */

    async submit(application){

        /*
         * Simulate a small network delay.
         * This helps us test loading states now.
         */

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    500
                )
        );


        return this.save(
            application
        );

    }

};


/* =========================================================
   APPLICATION STATE
========================================================= */

const applicationState = {

    currentStep:1,

    totalSteps:
        PARTNERSHIP_CONFIG.totalSteps,

    submitting:false

};


/* =========================================================
   DOM REFERENCES
========================================================= */

const form =
    document.getElementById(
        "partnershipForm"
    );


const steps =
    document.querySelectorAll(
        ".form-step"
    );


const progressSteps =
    document.querySelectorAll(
        ".progress-step"
    );


const progressLines =
    document.querySelectorAll(
        ".progress-line"
    );


const previousButton =
    document.getElementById(
        "previousButton"
    );


const nextButton =
    document.getElementById(
        "nextButton"
    );


const submitButton =
    document.getElementById(
        "submitButton"
    );


const reviewContainer =
    document.getElementById(
        "applicationReview"
    );


/* =========================================================
   FORM FIELDS
========================================================= */

const fields = {

    businessType:
        document.getElementById(
            "businessType"
        ),

    businessName:
        document.getElementById(
            "businessName"
        ),

    contactPerson:
        document.getElementById(
            "contactPerson"
        ),

    phone:
        document.getElementById(
            "phone"
        ),

    email:
        document.getElementById(
            "email"
        ),

    location:
        document.getElementById(
            "location"
        ),

    partnershipType:
        document.getElementById(
            "partnershipType"
        ),

    businessDescription:
        document.getElementById(
            "businessDescription"
        ),

    partnershipMessage:
        document.getElementById(
            "partnershipMessage"
        )

};


/* =========================================================
   UTILITY
========================================================= */

function generateApplicationId(){

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
        PARTNERSHIP_CONFIG.applicationPrefix
    }-${timestamp}-${random}`;

}


/* =========================================================
   GET FORM DATA
========================================================= */

function getFormData(){

    return {

        businessType:
            fields.businessType.value.trim(),

        businessName:
            fields.businessName.value.trim(),

        contactPerson:
            fields.contactPerson.value.trim(),

        phone:
            fields.phone.value.trim(),

        email:
            fields.email.value.trim(),

        location:
            fields.location.value.trim(),

        partnershipType:
            fields.partnershipType.value.trim(),

        businessDescription:
            fields.businessDescription.value.trim(),

        partnershipMessage:
            fields.partnershipMessage.value.trim()

    };

}


/* =========================================================
   VALIDATION HELPERS
========================================================= */

function setFieldError(
    field,
    message
){

    if(!field){

        return false;

    }


    const wrapper =
        field.closest(
            ".form-field"
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
            ".field-error"
        );


    if(error){

        error.textContent =
            message;

    }


    return false;

}


function setFieldValid(
    field
){

    if(!field){

        return true;

    }


    const wrapper =
        field.closest(
            ".form-field"
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
            ".field-error"
        );


    if(error){

        error.textContent =
            "";

    }


    return true;

}


/* =========================================================
   VALIDATE ONE FIELD
========================================================= */

function validateField(
    field
){

    if(!field){

        return true;

    }


    const value =
        field.value.trim();


    /*
     * Required validation
     */

    if(
        field.hasAttribute("required") &&
        !value
    ){

        return setFieldError(
            field,
            "This field is required."
        );

    }


    /*
     * Phone validation
     */

    if(
        field === fields.phone &&
        value
    ){

        const phonePattern =
            /^[+]?[0-9\s()-]{7,20}$/;


        if(
            !phonePattern.test(
                value
            )
        ){

            return setFieldError(
                field,
                "Enter a valid phone number."
            );

        }

    }


    /*
     * Email validation
     */

    if(
        field === fields.email &&
        value
    ){

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if(
            !emailPattern.test(
                value
            )
        ){

            return setFieldError(
                field,
                "Enter a valid email address."
            );

        }

    }


    /*
     * Business description
     */

    if(
        field ===
        fields.businessDescription &&
        value.length < 20
    ){

        return setFieldError(
            field,
            "Please provide at least 20 characters."
        );

    }


    return setFieldValid(
        field
    );

}


/* =========================================================
   STEP FIELD MAP
========================================================= */

function getStepFields(
    step
){

    const map = {

        1: [

            fields.businessType,

            fields.businessName,

            fields.contactPerson

        ],

        2: [

            fields.phone,

            fields.email,

            fields.location

        ],

        3: [

            fields.partnershipType,

            fields.businessDescription,

            fields.partnershipMessage

        ],

        4: []

    };


    return map[step] || [];

}


/* =========================================================
   VALIDATE STEP
========================================================= */

function validateStep(
    step
){

    const stepFields =
        getStepFields(
            step
        );


    let valid = true;


    stepFields.forEach(
        field => {

            if(
                !validateField(
                    field
                )
            ){

                valid = false;

            }

        }
    );


    /*
     * Focus first invalid field
     */

    if(!valid){

        const firstInvalid =
            stepFields.find(
                field =>
                    field
                    ?.closest(
                        ".form-field"
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

function showStep(
    step
){

    applicationState.currentStep =
        step;


    /*
     * Form sections
     */

    steps.forEach(
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


    /*
     * Progress indicators
     */

    progressSteps.forEach(
        (item, index) => {

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


    /*
     * Progress lines
     */

    progressLines.forEach(
        (line, index) => {

            line.classList.toggle(
                "completed",
                index < step - 1
            );

        }
    );


    /*
     * Navigation
     */

    previousButton.classList.toggle(
        "hidden",
        step === 1
    );


    nextButton.classList.toggle(
        "hidden",
        step ===
        applicationState.totalSteps
    );


    submitButton.classList.toggle(
        "hidden",
        step !==
        applicationState.totalSteps
    );


    /*
     * Build review when entering
     * final step.
     */

    if(
        step ===
        applicationState.totalSteps
    ){

        buildReview();

    }


    /*
     * Scroll to top of form.
     */

    form?.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

}


/* =========================================================
   BUILD REVIEW
========================================================= */

function buildReview(){

    if(!reviewContainer){

        return;

    }


    const data =
        getFormData();


    const businessTypeText =
        fields.businessType
            .selectedOptions[0]
            ?.textContent
            ?.trim()
            || data.businessType;


    const partnershipTypeText =
        fields.partnershipType
            .selectedOptions[0]
            ?.textContent
            ?.trim()
            || data.partnershipType;


    reviewContainer.innerHTML = `

        <div class="review-group">

            <div class="review-group-title">
                Applicant
            </div>

            <div class="review-row">

                <span class="review-label">
                    Business type
                </span>

                <span class="review-value">
                    ${escapeHtml(
                        businessTypeText
                    )}
                </span>

            </div>


            <div class="review-row">

                <span class="review-label">
                    Business
                </span>

                <span class="review-value">
                    ${escapeHtml(
                        data.businessName
                    )}
                </span>

            </div>


            <div class="review-row">

                <span class="review-label">
                    Contact person
                </span>

                <span class="review-value">
                    ${escapeHtml(
                        data.contactPerson
                    )}
                </span>

            </div>

        </div>


        <div class="review-group">

            <div class="review-group-title">
                Contact
            </div>

            <div class="review-row">

                <span class="review-label">
                    Phone
                </span>

                <span class="review-value">
                    ${escapeHtml(
                        data.phone
                    )}
                </span>

            </div>


            <div class="review-row">

                <span class="review-label">
                    Email
                </span>

                <span class="review-value">
                    ${escapeHtml(
                        data.email ||
                        "Not provided"
                    )}
                </span>

            </div>


            <div class="review-row">

                <span class="review-label">
                    Location
                </span>

                <span class="review-value">
                    ${escapeHtml(
                        data.location
                    )}
                </span>

            </div>

        </div>


        <div class="review-group">

            <div class="review-group-title">
                Partnership
            </div>

            <div class="review-row">

                <span class="review-label">
                    Type
                </span>

                <span class="review-value">
                    ${escapeHtml(
                        partnershipTypeText
                    )}
                </span>

            </div>


            <div class="review-row">

                <span class="review-label">
                    Description
                </span>

                <span class="review-value">
                    ${escapeHtml(
                        data.businessDescription
                    )}
                </span>

            </div>


            ${
                data.partnershipMessage
                ? `

                <div class="review-row">

                    <span class="review-label">
                        Proposal
                    </span>

                    <span class="review-value">
                        ${escapeHtml(
                            data.partnershipMessage
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
   HTML ESCAPING

   Important because review content is user input.
========================================================= */

function escapeHtml(
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
   BUILD APPLICATION OBJECT
========================================================= */

function buildApplication(){

    const data =
        getFormData();


    const now =
        new Date();


    return {

        /*
         * Stable identifier
         */

        id:
            generateApplicationId(),


        /*
         * Application classification
         */

        applicationType:
            "partnership",


        applicationVersion:
            1,


        /*
         * Current workflow state
         */

        status:
            "pending_review",


        /*
         * Applicant data
         */

        applicant: {

            businessType:
                data.businessType,

            businessName:
                data.businessName,

            contactPerson:
                data.contactPerson

        },


        /*
         * Contact data
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
         * Partnership data
         */

        partnership: {

            type:
                data.partnershipType,

            businessDescription:
                data.businessDescription,

            message:
                data.partnershipMessage

        },


        /*
         * Metadata

         * This becomes useful when we
         * connect the application to
         * the backend.
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
   SUBMIT APPLICATION
========================================================= */

async function submitApplication(){

    if(
        applicationState.submitting
    ){

        return;

    }


    /*
     * Validate the entire form
     * before submission.
     */

    for(
        let step = 1;
        step <= 3;
        step++
    ){

        if(
            !validateStep(
                step
            )
        ){

            showStep(step);

            return;

        }

    }


    applicationState.submitting =
        true;


    submitButton.classList.add(
        "submitting"
    );


    submitButton.disabled =
        true;


    try{

        const application =
            buildApplication();


        const savedApplication =
            await ApplicationService.submit(
                application
            );


        showSubmissionSuccess(
            savedApplication
        );


    }catch(error){

        console.error(
            "Application submission failed:",
            error
        );


        alert(
            "We could not submit your application. Please try again."
        );


    }finally{

        applicationState.submitting =
            false;

        submitButton.classList.remove(
            "submitting"
        );

        submitButton.disabled =
            false;

    }

}


/* =========================================================
   SUCCESS SCREEN
========================================================= */

function showSubmissionSuccess(
    application
){

    const container =
        form;


    container.innerHTML = `

        <section class="application-success">

            <div class="success-icon">
                ✓
            </div>


            <h2>
                Application received
            </h2>


            <p>
                Thank you for your interest
                in partnering with Zyaco Food Market.
                Our team will review your application.
            </p>


            <div class="application-reference">

                <span>
                    Application reference
                </span>

                <strong>
                    ${escapeHtml(
                        application.id
                    )}
                </strong>

            </div>


            <button
                type="button"
                class="form-button primary"
                id="returnHomeButton"
                style="width:100%;margin-top:14px;"
            >
                Return Home
            </button>

        </section>

    `;


    document
        .getElementById(
            "returnHomeButton"
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

nextButton?.addEventListener(
    "click",
    () => {

        const current =
            applicationState.currentStep;


        if(
            !validateStep(
                current
            )
        ){

            return;

        }


        if(
            current <
            applicationState.totalSteps
        ){

            showStep(
                current + 1
            );

        }

    }
);


/* =========================================================
   PREVIOUS
========================================================= */

previousButton?.addEventListener(
    "click",
    () => {

        const current =
            applicationState.currentStep;


        if(
            current > 1
        ){

            showStep(
                current - 1
            );

        }

    }
);


/* =========================================================
   FORM SUBMISSION
========================================================= */

form?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        submitApplication();

    }
);


/* =========================================================
   LIVE FIELD VALIDATION
========================================================= */

Object
    .values(fields)
    .forEach(
        field => {

            if(!field){

                return;

            }


            field.addEventListener(
                "blur",
                () => {

                    /*
                     * Only validate a field
                     * after the user has interacted
                     * with it.
                     */

                    if(
                        field.value.trim()
                    ){

                        validateField(
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
                            ".form-field"
                        );


                    /*
                     * Remove the invalid
                     * state while editing.
                     */

                    if(
                        wrapper?.classList
                            .contains(
                                "invalid"
                            )
                    ){

                        wrapper.classList.remove(
                            "invalid"
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   CHARACTER COUNTERS
========================================================= */

function setupCounter(
    field,
    counter
){

    if(
        !field ||
        !counter
    ){

        return;

    }


    const update = () => {

        counter.textContent =
            `${field.value.length} / ${field.maxLength}`;

    };


    field.addEventListener(
        "input",
        update
    );


    update();

}


setupCounter(

    fields.businessDescription,

    document.getElementById(
        "descriptionCount"
    )

);


setupCounter(

    fields.partnershipMessage,

    document.getElementById(
        "messageCount"
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

showStep(1);