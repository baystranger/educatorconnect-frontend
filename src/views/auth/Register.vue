<template>
    <div class="page-layout">
        <div class="auth-cover-wrapper">
            <div class="row g-0">

                <!-- LEFT SIDE -->
                <div class="col-lg-6">
                    <div
                        class="auth-cover"
                        :style="{
                            backgroundImage: `url(${authCoverBg})`
                        }"
                    >
                        <div class="clearfix">

                            <img
                                :src="auth"
                                alt="Authentication"
                                class="img-fluid cover-img ms-5"
                            />

                            <div class="auth-content">
                                <h1 class="display-6 fw-bold">
                                    Welcome!
                                </h1>

                                <p>
                                    Join EducatorConnect and
                                    connect with the early
                                    childhood community.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- RIGHT SIDE -->
                <div class="col-lg-6 align-self-center">

                    <div
                        class="maxw-450px m-auto auth-inner"
                        data-simplebar
                    >

                        <!-- LOGO -->
                        <div class="text-center">

                            <a
                                class="d-flex justify-content-center align-items-center gap-3 text-decoration-none mb-2"
                                href="/"
                            >
                                <img
                                    :src="educatorLogo"
                                    alt="EducatorConnect"
                                    class="app-logo"
                                />
                            </a>

                        </div>


                        <!-- TITLE -->
                        <div class="text-center mb-5">

                            <h5 class="mb-1">
                                Create your account
                            </h5>

                            <p>
                                Join the EducatorConnect community.
                            </p>

                        </div>


                        <!-- SUCCESS -->
                        <div
                            v-if="successMessage"
                            class="alert alert-success"
                        >
                            {{ successMessage }}
                        </div>


                        <!-- ERROR -->
                        <div
                            v-if="generalError"
                            class="alert alert-danger"
                        >
                            {{ generalError }}
                        </div>


                        <!-- FORM -->
                        <form
                            @submit.prevent="handleSubmit"
                            novalidate
                        >

                            <!-- NAME -->
                            <div class="mb-4">

                                <label
                                    class="form-label"
                                    for="registerName"
                                >
                                    Name
                                </label>

                                <input
                                    id="registerName"
                                    v-model="form.name"
                                    type="text"
                                    class="form-control"
                                    :class="{
                                        'is-invalid':
                                            errors.name
                                    }"
                                    placeholder="Full Name"
                                    autocomplete="name"
                                />

                                <div
                                    v-if="errors.name"
                                    class="invalid-feedback"
                                >
                                    {{ errors.name[0] }}
                                </div>

                            </div>


                            <!-- EMAIL -->
                            <div class="mb-4">

                                <label
                                    class="form-label"
                                    for="registerEmail"
                                >
                                    Email Address
                                </label>

                                <input
                                    id="registerEmail"
                                    v-model="form.email"
                                    type="email"
                                    class="form-control"
                                    :class="{
                                        'is-invalid':
                                            errors.email
                                    }"
                                    placeholder="info@example.com"
                                    autocomplete="email"
                                />

                                <div
                                    v-if="errors.email"
                                    class="invalid-feedback"
                                >
                                    {{ errors.email[0] }}
                                </div>

                            </div>


                            <!-- PHONE -->
                            <div class="mb-4">

                                <label
                                    class="form-label"
                                    for="registerPhone"
                                >
                                    Phone Number
                                </label>

                                <input
                                    id="registerPhone"
                                    v-model="form.phone"
                                    type="tel"
                                    class="form-control"
                                    :class="{
                                        'is-invalid':
                                            errors.phone
                                    }"
                                    placeholder="+61 400 000 000"
                                    autocomplete="tel"
                                />

                                <div
                                    v-if="errors.phone"
                                    class="invalid-feedback"
                                >
                                   {{ errors.phone[0] }}
                                </div>

                            </div>


                            <!-- ROLE -->
                            <div class="mb-4">

                                <label
                                    class="form-label"
                                    for="registerRole"
                                >
                                    I am registering as
                                </label>

                                <select
                                    id="registerRole"
                                    v-model="form.role"
                                    class="form-select"
                                    :class="{
                                        'is-invalid':
                                            errors.role
                                    }"
                                >
                                    <option value="">
                                        Select account type
                                    </option>

                                    <option value="educator">
                                        Educator
                                    </option>

                                    <option value="childcare">
                                        Childcare Centre
                                    </option>

                                    <option value="professional">
                                        Early Childhood Professional
                                    </option>
                                </select>

                                <div
                                    v-if="errors.role"
                                    class="invalid-feedback"
                                >
                                    {{ errors.role[0] }}
                                </div>

                            </div>


                            <!-- PASSWORD -->
                            <div class="mb-4">

                                <label
                                    class="form-label"
                                    for="registerPassword"
                                >
                                    Password
                                </label>

                                <input
                                    id="registerPassword"
                                    v-model="form.password"
                                    type="password"
                                    class="form-control"
                                    :class="{
                                        'is-invalid':
                                            errors.password
                                    }"
                                    placeholder="********"
                                    autocomplete="new-password"
                                />

                                <div
                                    v-if="errors.password"
                                    class="invalid-feedback"
                                >
                                    {{ errors.password[0] }}
                                </div>

                            </div>


                            <!-- CONFIRM PASSWORD -->
                            <div class="mb-4">

                                <label
                                    class="form-label"
                                    for="registerPasswordConfirmation"
                                >
                                    Confirm Password
                                </label>

                                <input
                                    id="registerPasswordConfirmation"
                                    v-model="
                                        form.password_confirmation
                                    "
                                    type="password"
                                    class="form-control"
                                    :class="{
                                        'is-invalid':
                                            errors.password_confirmation
                                    }"
                                    placeholder="********"
                                    autocomplete="new-password"
                                />

                                <div
                                    v-if="
                                        errors.password_confirmation
                                    "
                                    class="invalid-feedback"
                                >
                                    {{
                                        errors
                                            .password_confirmation[0]
                                    }}
                                </div>

                            </div>


                            <!-- TERMS -->
                            <div class="mb-4">

                                <div
                                    class="form-check"
                                    :class="{
                                        'is-invalid':
                                            errors.terms
                                    }"
                                >

                                    <input
                                        id="termsConditions"
                                        v-model="form.terms"
                                        class="form-check-input"
                                        type="checkbox"
                                    />

                                    <label
                                        class="form-check-label"
                                        for="termsConditions"
                                    >
                                        I agree to
                                        <a
                                            href="/privacy-policy"
                                        >
                                            privacy policy & terms
                                        </a>
                                    </label>

                                </div>                                

                            </div>


                            <!-- SUBMIT -->
                            <div class="mb-3">

                                <button
                                    type="submit"
                                    class="btn btn-primary waves-effect waves-light w-100"
                                    :disabled="loading"
                                >

                                    <span
                                        v-if="loading"
                                        class="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>

                                    <span v-if="loading">
                                        Creating account...
                                    </span>

                                    <span v-else>
                                        Sign up
                                    </span>

                                </button>

                            </div>


                            <!-- LOGIN -->
                            <p class="mb-5 text-center">

                                Already have an account?

                                <a href="/login">
                                    Sign In here
                                </a>

                            </p>


                            <!-- SOCIAL -->
                            <div
                                class="border-bottom position-relative my-3 text-center"
                            >
                                <span
                                    class="px-3 position-absolute translate-middle top-50 start-50 bg-body"
                                >
                                    Or Continue With
                                </span>
                            </div>


                            <div
                                class="d-flex gap-2 justify-content-center mt-5"
                            >

                                <a
                                    href="javascript:void(0);"
                                    class="btn btn-icon btn-subtle-facebook rounded-circle waves-effect waves-light"
                                >
                                    <i
                                        class="fa-brands fa-facebook-f"
                                    ></i>
                                </a>

                                <a
                                    href="javascript:void(0);"
                                    class="btn btn-icon btn-subtle-twitter rounded-circle waves-effect waves-light"
                                >
                                    <i
                                        class="fa-brands fa-x-twitter"
                                    ></i>
                                </a>

                                <a
                                    href="javascript:void(0);"
                                    class="btn btn-icon btn-subtle-github rounded-circle waves-effect waves-light"
                                >
                                    <i
                                        class="fa-brands fa-github"
                                    ></i>
                                </a>

                            </div>

                        </form>

                    </div>

                </div>

            </div>
        </div>
    </div>
</template>


<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import authCoverBg from "../../assets/images/auth/auth-cover-bg.png";
import auth from "../../assets/images/auth/auth.png";
import educatorLogo from "../../assets/educatorlogo.png";

import { useAuth } from "../../composables/useAuth";

const router = useRouter();

const {
    register,
    loading,
} = useAuth();


/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

const form = reactive({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "",
    terms: false,
});


/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const errors = ref({});
const generalError = ref("");
const successMessage = ref("");


/*
|--------------------------------------------------------------------------
| Submit
|--------------------------------------------------------------------------
*/

const handleSubmit = async () => {
    errors.value = {};
    generalError.value = "";
    successMessage.value = "";    
    

    /*
    |--------------------------------------------------------------------------
    | Frontend validation
    |--------------------------------------------------------------------------
    */

    if (!form.name.trim()) {
        errors.value.name = [
            "Please enter your name.",
        ];
    }

    if (!form.email.trim()) {
        errors.value.email = [
            "Please enter your email address.",
        ];
    }

    if(!form.phone) {
        errors.value.phone = [
            "Please enter your phone number.",
        ];
    }

    if (!form.role) {
        errors.value.role = [
            "Please select an account type.",
        ];
    }

    if (!form.password) {
        errors.value.password = [
            "Please enter a password.",
        ];
    }

    if (
        form.password !==
        form.password_confirmation
    ) {
        errors.value.password_confirmation = [
            "Passwords do not match.",
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Stop if frontend validation fails
    |--------------------------------------------------------------------------
    */

    if (Object.keys(errors.value).length > 0) {
        console.log(errors.value, 'inside this');
        
        return;
    }


    /*
    |--------------------------------------------------------------------------
    | API request
    |--------------------------------------------------------------------------
    */

    try {

        console.log('all valiation passed');
        

        await register({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone,
            password: form.password,
            password_confirmation: form.password_confirmation,
            role: form.role,
        });


        successMessage.value =
            "Your account has been created successfully.";


        /*
        |--------------------------------------------------------------------------
        | Redirect based on role
        |--------------------------------------------------------------------------
        */

        router.push({ name: "home" });

    } catch (error) {

        /*
        |--------------------------------------------------------------------------
        | Laravel validation errors
        |--------------------------------------------------------------------------
        */

        if (
            error.response?.status === 422
        ) {
            errors.value =
                error.response.data.errors || {};

            generalError.value =
                error.response.data.message ||
                "Please check the form.";
        }

        /*
        |--------------------------------------------------------------------------
        | Unauthorized
        |--------------------------------------------------------------------------
        */

        else if (
            error.response?.status === 401
        ) {
            generalError.value =
                "Authentication failed.";
        }

        /*
        |--------------------------------------------------------------------------
        | Server error
        |--------------------------------------------------------------------------
        */

        else if (
            error.response?.status >= 500
        ) {
            generalError.value =
                "Something went wrong on the server. Please try again later.";
        }

        /*
        |--------------------------------------------------------------------------
        | Network error
        |--------------------------------------------------------------------------
        */

        else if (!error.response) {
            generalError.value =
                "Unable to connect to the server. Please check your internet connection.";
        }

        else {
            generalError.value =
                error.response?.data?.message ||
                "Registration failed. Please try again.";
        }

        console.error(
            "Registration error:",
            error
        );
    }
};
</script>