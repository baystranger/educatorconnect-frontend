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
                        <div class="text-center">

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

                            <!-- EMAIL -->
                            <div class="mb-4">

                                <label
                                    class="form-label"
                                    for="loginEmail"
                                >
                                    Email Address
                                </label>

                                <input
                                    id="loginEmail"
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


                            <!-- PASSWORD -->
                            <div class="mb-4">

                                <label
                                    class="form-label"
                                    for="loginPassword"
                                >
                                    Password
                                </label>

                                <input
                                    id="loginPassword"
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
                                        login account...
                                    </span>

                                    <span v-else>
                                        Sign in
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
    login,
    loading,
} = useAuth();


/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

const form = reactive({    
    email: "",    
    password: "",    
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

    if (!form.email.trim()) {
        errors.value.email = [
            "Please enter your email address.",
        ];
    }

    if (!form.password) {
        errors.value.password = [
            "Please enter a password.",
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
        

        const response =await login({            
            email: form.email.trim(),            
            password: form.password,            
        });

        console.log(response, 'here is the response');
        successMessage.value = "Your account has been Logged In successfully.";


        /*
        |--------------------------------------------------------------------------
        | Redirect based on role
        |--------------------------------------------------------------------------
        */

        router.push({ name: "home" });
        // if (form.role === "childcare") {
        //     router.push("/childcare/profile");
        // } else if (form.role === "educator") {
        //     router.push("/educator/profile");
        // } else if (form.role === "professional") {
        //     router.push("/professional/profile");
        // }

    } catch (error) {

        console.log(error, 'here is the error');

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