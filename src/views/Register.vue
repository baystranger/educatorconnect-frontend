<template>
    <div class="page-layout">
        <div class="auth-cover-wrapper">
            <div class="row g-0">
                <div class="col-lg-6">
                    <div class="auth-cover" :style="{ backgroundImage:  `url(${authCoverBg})` }">
                        <div class="clearfix">
                            <img :src="auth" alt="" class="img-fluid cover-img ms-5" />
                            <div class="auth-content">
                                <h1 class="display-6 fw-bold">Welcome!</h1>
                                <p>
                                    Our HR Management & Administration ensure your organization
                                    runs smoothly, focusing on people, compliance, and efficiency
                                    to drive growth and employee satisfaction.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 align-self-center">
                    <div class="p-3 p-sm-5 maxw-450px m-auto auth-inner" data-simplebar>
                        <div class="text-center">
                            <a class="d-flex justify-content-center align-items-center gap-3 text-decoration-none mb-2" href="#">
                                <img :src="educatorLogo" alt="EducatorConnect" class="app-logo" />
                            </a>
                        </div>
                        <div class="text-center mb-5">
                            <h5 class="mb-1">Welcome to GXON</h5>
                            <p>Sign up to create your secure admin.</p>
                        </div>
                        <form action="index.html">
                            <div class="mb-4">
                                <label class="form-label" for="registerName">Name</label>
                                <input type="text" class="form-control" id="registerName" placeholder="Full Name" />
                            </div>
                            <div class="mb-4">
                                <label class="form-label" for="registerEmail">Email Address</label>
                                <input type="email" class="form-control" id="registerEmail"
                                    placeholder="info@example.com" />
                            </div>
                            <div class="mb-4">
                                <label class="form-label" for="registerPassword">Password</label>
                                <input type="password" class="form-control" id="registerPassword"
                                    placeholder="********" />
                            </div>
                            <div class="mb-4">
                                <div class="form-check mb-0">
                                    <input class="form-check-input" type="checkbox" id="termsConditions" name="terms" />
                                    <label class="form-check-label" for="termsConditions">
                                        I agree to
                                        <a href="javascript:void(0);">privacy policy & terms</a>
                                    </label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <button type="submit" value="Submit"
                                    class="btn btn-primary waves-effect waves-light w-100">
                                    Sign up
                                </button>
                            </div>
                            <p class="mb-5 text-center">
                                Have any account?
                                <a href="authentication/login-cover.html">Sign In here</a>
                            </p>
                            <div class="border-bottom position-relative my-3 text-center">
                                <span class="px-3 position-absolute translate-middle top-50 start-50 bg-body">Or
                                    Continue With</span>
                            </div>
                            <div class="d-flex gap-2 justify-content-center mt-5">
                                <a href="javascript:void(0);"
                                    class="btn btn-icon btn-subtle-facebook rounded-circle waves-effect waves-light">
                                    <i class="fa-brands fa-facebook-f"></i>
                                </a>
                                <a href="javascript:void(0);"
                                    class="btn btn-icon btn-subtle-twitter rounded-circle waves-effect waves-light">
                                    <i class="fa-brands fa-x-twitter"></i>
                                </a>
                                <a href="javascript:void(0);"
                                    class="btn btn-icon btn-subtle-github rounded-circle waves-effect waves-light">
                                    <i class="fa-brands fa-github"></i>
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
import { ref } from "vue";
import authCoverBg from "../assets/images/auth/auth-cover-bg.png"
import auth from "../assets/images/auth/auth.png"
import educatorLogo from "../assets/educatorlogo.png"

</script>