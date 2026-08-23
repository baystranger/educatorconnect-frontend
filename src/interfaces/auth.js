export const USER_ROLES = {
    ADMIN: "admin",
    CHILDCARE: "childcare",
    EDUCATOR: "educator",
    PROFESSIONAL: "professional",
};

export const PUBLIC_REGISTRATION_ROLES = [
    USER_ROLES.CHILDCARE,
    USER_ROLES.EDUCATOR,
    USER_ROLES.PROFESSIONAL,
];

export const createRegisterForm = () => ({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "",
    terms: false,
});

export const createLoginForm = () => ({
    email: "",
    password: "",
    remember: false,
});

export const authResponse = {
    access_token: null,
    token_type: "Bearer",
    expires_in: 0,
    refresh_token: null,
    refresh_expires_in: 0,
    user: null,
};