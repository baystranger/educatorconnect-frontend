<template>
    <section class="search-section">
        <div class="container">
            <div class="search-panel">
                <!-- =========================
                     CENTRES
                ========================== -->
                <div v-if="activeTab === 'centres'" class="search-card">
                    <div class="search-card-header">
                        <div class="search-card-icon">
                            <Building2 :size="22" :stroke-width="2" />
                        </div>

                        <div class="search-card-heading">
                            <h3>
                                Post a role or list your programs
                            </h3>

                            <p>
                                Connect with qualified educators and grow your centre.
                            </p>
                        </div>
                    </div>

                    <form class="search-form" @submit.prevent="handleCentreSearch">
                        <!-- Search -->
                        <div class="form-field input-field">
                            <label for="centre-search">
                                Job title or keyword
                            </label>

                            <div class="input-wrapper">
                                <Search class="input-icon" :size="17" :stroke-width="2" />

                                <input id="centre-search" v-model="centreForm.search" type="text"
                                    placeholder="e.g. Lead ECE, Infant & Toddler Educator" />
                            </div>
                        </div>

                        <!-- Employment Type -->
                        <div class="form-field">
                            <label for="centre-employment">
                                Employment type
                            </label>

                            <div class="select-wrapper">
                                <select id="centre-employment" v-model="centreForm.employmentType">
                                    <option value="Full time">
                                        Full time
                                    </option>

                                    <option value="Part time">
                                        Part time
                                    </option>

                                    <option value="Casual / on-call">
                                        Casual / on-call
                                    </option>
                                </select>

                                <ChevronDown class="select-icon" :size="17" :stroke-width="2" />
                            </div>
                        </div>

                        <!-- Button -->
                        <div class="form-action">
                            <button type="submit" class="search-btn">
                                <span>
                                    Post a job
                                </span>

                                <ArrowRight :size="17" :stroke-width="2" />
                            </button>
                        </div>
                    </form>

                    <!-- Meta -->
                    <div class="search-meta">
                        <div class="meta-item">
                            <CheckCircle2 :size="15" :stroke-width="2" />

                            <span>
                                312 centres are actively hiring
                            </span>
                        </div>

                        <span class="meta-separator">
                            •
                        </span>

                        <div class="meta-item">
                            <Clock3 :size="15" :stroke-width="2" />

                            <span>
                                Average time to first applicant: 36 hours
                            </span>
                        </div>
                    </div>
                </div>

                <!-- =========================
                     EDUCATORS
                ========================== -->
                <div v-else-if="activeTab === 'educators'" class="search-card">
                    <div class="search-card-header">
                        <div class="search-card-icon">
                            <UserRound :size="22" :stroke-width="2" />
                        </div>

                        <div class="search-card-heading">
                            <h3>
                                Find a role near you
                            </h3>

                            <p>
                                Discover opportunities that match your experience and preferences.
                            </p>
                        </div>
                    </div>

                    <form class="search-form" @submit.prevent="handleEducatorSearch">
                        <!-- Search -->
                        <div class="form-field input-field">
                            <label for="educator-search">
                                Search jobs
                            </label>

                            <div class="input-wrapper">
                                <Search class="input-icon" :size="17" :stroke-width="2" />

                                <input id="educator-search" v-model="educatorForm.search" type="text"
                                    placeholder="Job title, keywords, or phrase" />
                            </div>
                        </div>

                        <!-- Role -->
                        <div class="form-field">
                            <label for="educator-role">
                                Job role
                            </label>

                            <div class="select-wrapper">
                                <select id="educator-role" v-model="educatorForm.role">
                                    <option value="All roles">
                                        All roles
                                    </option>

                                    <option value="ECE Assistant">
                                        ECE Assistant
                                    </option>

                                    <option value="Early Childhood Educator">
                                        Early Childhood Educator
                                    </option>

                                    <option value="Infant & Toddler Educator">
                                        Infant & Toddler Educator
                                    </option>

                                    <option value="Special Needs Educator">
                                        Special Needs Educator
                                    </option>

                                    <option value="Centre Manager / Director">
                                        Centre Manager / Director
                                    </option>
                                </select>

                                <ChevronDown class="select-icon" :size="17" :stroke-width="2" />
                            </div>
                        </div>

                        <!-- Button -->
                        <div class="form-action">
                            <button type="submit" class="search-btn">
                                <span>
                                    Find a job
                                </span>

                                <ArrowRight :size="17" :stroke-width="2" />
                            </button>
                        </div>
                    </form>

                    <!-- Meta -->
                    <div class="search-meta">
                        <div class="meta-item">
                            <BriefcaseBusiness :size="15" :stroke-width="2" />

                            <span>
                                312 open positions across BC, AB and ON
                            </span>
                        </div>
                    </div>
                </div>

                <!-- =========================
                     PARENTS
                ========================== -->
                <div v-else-if="activeTab === 'parents'" class="search-card">
                    <div class="search-card-header">
                        <div class="search-card-icon">
                            <Heart :size="22" :stroke-width="2" />
                        </div>

                        <div class="search-card-heading">
                            <h3>
                                Search licensed daycares near you
                            </h3>

                            <p>
                                Find childcare that fits your family's needs and location.
                            </p>
                        </div>
                    </div>

                    <form class="search-form" @submit.prevent="handleParentSearch">
                        <!-- Location -->
                        <div class="form-field input-field">
                            <label for="parent-location">
                                Location
                            </label>

                            <div class="input-wrapper">
                                <MapPin class="input-icon" :size="17" :stroke-width="2" />

                                <input id="parent-location" v-model="parentForm.location" type="text"
                                    placeholder="Enter your city or postal code" />
                            </div>
                        </div>

                        <!-- Age -->
                        <div class="form-field">
                            <label for="parent-age">
                                Age group
                            </label>

                            <div class="select-wrapper">
                                <select id="parent-age" v-model="parentForm.ageGroup">
                                    <option value="Any age group">
                                        Any age group
                                    </option>

                                    <option value="Infant (0–18 mo)">
                                        Infant (0–18 mo)
                                    </option>

                                    <option value="Toddler">
                                        Toddler
                                    </option>

                                    <option value="Preschool">
                                        Preschool
                                    </option>

                                    <option value="School age">
                                        School age
                                    </option>
                                </select>

                                <ChevronDown class="select-icon" :size="17" :stroke-width="2" />
                            </div>
                        </div>

                        <!-- Button -->
                        <div class="form-action">
                            <button type="submit" class="search-btn">
                                <span>
                                    Search daycares
                                </span>

                                <ArrowRight :size="17" :stroke-width="2" />
                            </button>
                        </div>
                    </form>

                    <!-- Meta -->
                    <div class="search-meta">
                        <div class="meta-item">
                            <ShieldCheck :size="15" :stroke-width="2" />

                            <span>
                                Licensed centres near your location
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import {
    Building2,
    UserRound,
    Heart,
    Search,
    ChevronDown,
    ArrowRight,
    CheckCircle2,
    Clock3,
    BriefcaseBusiness,
    MapPin,
    ShieldCheck,
    BadgeCheck,
} from "lucide-vue-next";

/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
*/

const props = defineProps({
    activeSection: {
        type: String,
        default: "centres",
    },
});

/*
|--------------------------------------------------------------------------
| Emits
|--------------------------------------------------------------------------
*/

const emit = defineEmits([
    "update:activeSection",
]);

/*
|--------------------------------------------------------------------------
| Active Tab
|--------------------------------------------------------------------------
*/

const activeTab = ref(
    props.activeSection
);

watch(
    () => props.activeSection,
    (value) => {
        if (
            value &&
            value !== activeTab.value
        ) {
            activeTab.value = value;
        }
    }
);

watch(
    activeTab,
    (tab) => {
        emit(
            "update:activeSection",
            tab
        );
    }
);

/*
|--------------------------------------------------------------------------
| Tabs
|--------------------------------------------------------------------------
*/

const tabs = [
    {
        id: "educators",
        title: "For Educators",
        description: "Find your next role",
        icon: UserRound,
    },
    {
        id: "centres",
        title: "For Centres",
        description: "Post jobs & programs",
        icon: Building2,
    },
    {
        id: "parents",
        title: "For Parents",
        description: "Find childcare",
        icon: Heart,
    },
];

/*
|--------------------------------------------------------------------------
| Centre Form
|--------------------------------------------------------------------------
*/

const centreForm = ref({
    search: "",
    employmentType: "Full time",
});

/*
|--------------------------------------------------------------------------
| Educator Form
|--------------------------------------------------------------------------
*/

const educatorForm = ref({
    search: "",
    role: "All roles",
});

/*
|--------------------------------------------------------------------------
| Parent Form
|--------------------------------------------------------------------------
*/

const parentForm = ref({
    location: "",
    ageGroup: "Any age group",
});

/*
|--------------------------------------------------------------------------
| Results
|--------------------------------------------------------------------------
*/

const centreResults = ref([
    {
        title: "Sunshine Family Daycare",
        subtitle: "East Vancouver · Infant to preschool",
        badge: "Hiring",
        availability: "4 roles open",
        action: "Post profile",
        icon: Building2,
    },
    {
        title: "Maple Grove Childcare",
        subtitle: "Surrey · Toddler & preschool",
        badge: "Trusted",
        availability: "More inquiries",
        action: "See details",
        icon: Building2,
    },
]);

const educatorResults = ref([
    {
        title: "Early Childhood Educator",
        subtitle: "Full time · Vancouver, BC",
        badge: "New",
        availability: "Apply today",
        action: "View job",
        icon: BriefcaseBusiness,
    },
    {
        title: "ECE Assistant",
        subtitle: "Part time · Burnaby, BC",
        badge: "Open",
        availability: "20 applicants",
        action: "View job",
        icon: BriefcaseBusiness,
    },
]);

const parentResults = ref([
    {
        title: "Sunnyvale Early Learning Centre",
        subtitle: "Burnaby, BC · Infant to preschool",
        badge: "Licensed",
        availability: "Spots open",
        action: "View centre",
        icon: BadgeCheck,
    },
    {
        title: "Little Maple Daycare",
        subtitle: "Coquitlam, BC · Toddler to school age",
        badge: "Licensed",
        availability: "Waitlist",
        action: "View centre",
        icon: BadgeCheck,
    },
]);

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const currentResults = computed(() => {
    if (activeTab.value === "centres") {
        return centreResults.value;
    }

    if (activeTab.value === "educators") {
        return educatorResults.value;
    }

    return parentResults.value;
});

const currentResultTitle = computed(() => {
    if (activeTab.value === "centres") {
        return "Top centres hiring now";
    }

    if (activeTab.value === "educators") {
        return "Featured roles near you";
    }

    return "Popular childcare options";
});

const currentResultLabel = computed(() => {
    if (activeTab.value === "centres") {
        return "For Centres";
    }

    if (activeTab.value === "educators") {
        return "For Educators";
    }

    return "For Parents";
});

/*
|--------------------------------------------------------------------------
| Change Tab
|--------------------------------------------------------------------------
*/

const setActiveTab = (tab) => {
    activeTab.value = tab;
};

/*
|--------------------------------------------------------------------------
| Centre Search
|--------------------------------------------------------------------------
*/

const handleCentreSearch = () => {
    console.log(
        "Centre search:",
        centreForm.value
    );
};

/*
|--------------------------------------------------------------------------
| Educator Search
|--------------------------------------------------------------------------
*/

const handleEducatorSearch = () => {
    console.log(
        "Educator search:",
        educatorForm.value
    );
};

/*
|--------------------------------------------------------------------------
| Parent Search
|--------------------------------------------------------------------------
*/

const handleParentSearch = () => {
    console.log(
        "Parent search:",
        parentForm.value
    );
};
</script>

<style scoped>
/* =========================================================
   MAIN SECTION
========================================================= */

.search-section {
    width: 100%;
    padding: 20px 0;
}


/* =========================================================
   TABS
========================================================= */

.search-tabs-wrapper {
    width: 100%;
    margin-bottom: 14px;
}

.search-tabs {
    display: flex;
    align-items: stretch;
    justify-content: start;
    gap: 8px;
    width: 100%;
}

.search-tab {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
    padding: 14px 18px;
    border: 1px solid transparent;
    border-radius: 14px;
    background: transparent;
    color: #777784;
    text-align: left;
    cursor: pointer;
    transition:
        background-color 0.2s ease,
        color 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.search-tab:hover {
    background: #faf8fc;
    color: #4e0077;
}

.search-tab.active {
    border-color: #e6d9ec;
    background: #ffffff;
    color: #4e0077;
    box-shadow: 0 5px 20px rgba(25, 20, 50, 0.05);
}


/* =========================================================
   TAB ICON
========================================================= */

.tab-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    min-width: 42px;
    height: 42px;
    border-radius: 11px;
    background: #f5f2f7;
    color: #777784;
    transition: 0.2s ease;
}

.search-tab.active .tab-icon {
    background: #f0e7f5;
    color: #4e0077;
}

.tab-content {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.tab-title {
    color: inherit;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.3;
}

.tab-description {
    margin-top: 3px;
    color: #9999a4;
    font-size: 11px;
    line-height: 1.3;
}


/* =========================================================
   SEARCH PANEL
========================================================= */

.search-panel {
    width: 100%;
}


/* =========================================================
   SEARCH CARD
========================================================= */

.search-card {
    position: relative;
    width: 100%;
    overflow: hidden;
    padding: 28px;
    border: 1px solid #e8e8ef;
    border-radius: 22px;
    background: #ffffff;
    box-shadow: 0 15px 45px rgba(25, 20, 50, 0.08);
}

.search-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: #4e0077;
}


/* =========================================================
   CARD HEADER
========================================================= */

.search-card-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 22px;
}

.search-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    min-width: 48px;
    height: 48px;
    border-radius: 14px;
    background: #f4edfa;
    color: #4e0077;
}

.search-card-heading {
    min-width: 0;
}

.search-card-heading h3 {
    margin: 0 0 4px;
    color: #20202a;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.35;
}

.search-card-heading p {
    margin: 0;
    color: #777784;
    font-size: 13px;
    line-height: 1.5;
}


/* =========================================================
   SEARCH FORM
========================================================= */

.search-form {
    display: grid;
    grid-template-columns:
        minmax(0, 1.5fr) minmax(180px, 0.8fr) auto;
    gap: 12px;
    width: 100%;
}


/* =========================================================
   FORM FIELD
========================================================= */

.form-field {
    min-width: 0;
}

.form-field label {
    display: block;
    margin-bottom: 7px;
    color: #555560;
    font-size: 11px;
    font-weight: 600;
}


/* =========================================================
   INPUT
========================================================= */

.input-wrapper {
    position: relative;
    width: 100%;
}

.input-icon {
    position: absolute;
    top: 50%;
    left: 16px;
    z-index: 2;
    color: #888894;
    pointer-events: none;
    transform: translateY(-50%);
}

.input-wrapper input {
    display: block;
    width: 100%;
    height: 52px;
    min-width: 0;
    padding: 0 16px 0 44px;
    border: 1px solid #dedee7;
    border-radius: 12px;
    outline: none;
    background: #ffffff;
    color: #292934;
    font-family: inherit;
    font-size: 14px;
    transition: 0.2s ease;
}

.input-wrapper input::placeholder {
    color: #a2a2ad;
}

.input-wrapper input:hover {
    border-color: #cbcbd6;
}

.input-wrapper input:focus {
    border-color: #4e0077;
    box-shadow: 0 0 0 3px rgba(78, 0, 119, 0.08);
}


/* =========================================================
   SELECT
========================================================= */

.select-wrapper {
    position: relative;
    width: 100%;
}

.select-wrapper select {
    display: block;
    width: 100%;
    height: 52px;
    min-width: 0;
    padding: 0 42px 0 16px;
    border: 1px solid #dedee7;
    border-radius: 12px;
    outline: none;
    appearance: none;
    background: #ffffff;
    color: #292934;
    font-family: inherit;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s ease;
}

.select-wrapper select:hover {
    border-color: #cbcbd6;
}

.select-wrapper select:focus {
    border-color: #4e0077;
    box-shadow: 0 0 0 3px rgba(78, 0, 119, 0.08);
}

.select-icon {
    position: absolute;
    top: 50%;
    right: 15px;
    color: #858591;
    pointer-events: none;
    transform: translateY(-50%);
}


/* =========================================================
   SEARCH BUTTON
========================================================= */

.form-action {
    display: flex;
    align-items: flex-end;
}

.search-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    width: 100%;
    min-width: 140px;
    height: 52px;
    padding: 0 22px;
    border: 0;
    border-radius: 12px;
    background: #4e0077;
    color: #ffffff;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease;
}

.search-btn:hover {
    background: #390058;
    box-shadow: 0 8px 20px rgba(78, 0, 119, 0.2);
    transform: translateY(-1px);
}

.search-btn:active {
    box-shadow: none;
    transform: translateY(0);
}


/* =========================================================
   SEARCH META
========================================================= */

.search-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 15px;
    color: #777784;
    font-size: 12px;
    line-height: 1.5;
}

.meta-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.meta-item svg {
    color: #2e9b61;
    flex-shrink: 0;
}

.meta-separator {
    color: #c2c2ca;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 991px) {

    .search-tabs {
        gap: 6px;
    }

    .search-tab {
        padding: 12px 14px;
    }

    .tab-icon {
        width: 38px;
        min-width: 38px;
        height: 38px;
    }

    .tab-title {
        font-size: 13px;
    }

    .tab-description {
        font-size: 10px;
    }

    .search-card {
        padding: 24px;
    }

    .search-form {
        grid-template-columns:
            minmax(0, 1fr) minmax(180px, 0.7fr);
    }

    .form-action {
        grid-column: 1 / -1;
    }
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 767px) {

    .search-section {
        padding: 15px 0;
    }

    .search-tabs-wrapper {
        overflow-x: auto;
        padding-bottom: 5px;
        scrollbar-width: none;
    }

    .search-tabs-wrapper::-webkit-scrollbar {
        display: none;
    }

    .search-tabs {
        justify-content: flex-start;
        width: max-content;
        min-width: 100%;
    }

    .search-tab {
        flex: 0 0 auto;
        min-width: 145px;
        padding: 11px 13px;
        border-radius: 12px;
    }

    .tab-icon {
        width: 36px;
        min-width: 36px;
        height: 36px;
        border-radius: 10px;
    }

    .tab-title {
        font-size: 12px;
    }

    .tab-description {
        font-size: 9px;
    }

    .search-card {
        padding: 20px;
        border-radius: 18px;
    }

    .search-card::before {
        height: 3px;
    }

    .search-card-header {
        align-items: flex-start;
        gap: 11px;
        margin-bottom: 19px;
    }

    .search-card-icon {
        width: 42px;
        min-width: 42px;
        height: 42px;
        border-radius: 12px;
    }

    .search-card-heading h3 {
        font-size: 16px;
    }

    .search-card-heading p {
        font-size: 11px;
    }

    .search-form {
        display: flex;
        flex-direction: column;
        gap: 11px;
    }

    .input-wrapper input,
    .select-wrapper select {
        height: 50px;
        font-size: 13px;
    }

    .input-wrapper input {
        padding-left: 42px;
    }

    .input-icon {
        left: 14px;
    }

    .select-icon {
        right: 14px;
    }

    .form-action {
        width: 100%;
    }

    .search-btn {
        width: 100%;
        min-width: 0;
        height: 50px;
        font-size: 13px;
    }

    .search-meta {
        align-items: flex-start;
        gap: 6px;
        margin-top: 13px;
        font-size: 10px;
    }

    .meta-separator {
        display: none;
    }
}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 480px) {

    .search-card {
        padding: 17px;
        border-radius: 16px;
    }

    .search-tab {
        min-width: 140px;
    }

    .search-card-heading h3 {
        font-size: 15px;
    }

    .search-card-heading p {
        font-size: 10px;
    }

    .input-wrapper input,
    .select-wrapper select,
    .search-btn {
        height: 48px;
        font-size: 12px;
    }

    .search-meta {
        font-size: 9px;
    }
}


/* =========================================================
   VERY SMALL PHONES
========================================================= */

@media (max-width: 360px) {

    .search-section {
        padding: 10px 0;
    }

    .search-tab {
        min-width: 132px;
        padding: 10px;
        gap: 8px;
    }

    .tab-icon {
        width: 32px;
        min-width: 32px;
        height: 32px;
    }

    .tab-title {
        font-size: 11px;
    }

    .tab-description {
        font-size: 8px;
    }

    .search-card {
        padding: 14px;
    }

    .search-card-icon {
        width: 36px;
        min-width: 36px;
        height: 36px;
        border-radius: 9px;
    }

    .search-card-heading h3 {
        font-size: 14px;
    }

    .search-card-heading p {
        font-size: 9px;
    }

    .input-wrapper input,
    .select-wrapper select,
    .search-btn {
        height: 46px;
        font-size: 11px;
    }

    .search-meta {
        font-size: 8px;
    }
}


/* =========================================================
   ACCESSIBILITY
========================================================= */

.search-tab:focus-visible,
.search-btn:focus-visible {
    outline: 3px solid rgba(78, 0, 119, 0.25);
    outline-offset: 3px;
}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

    .search-tab,
    .search-card,
    .search-btn {
        transition: none;
    }
}
</style>
