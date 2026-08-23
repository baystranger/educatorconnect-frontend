<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  LogIn,
  ArrowRight,
  Sparkles,
  BriefcaseBusiness,
  Users,
  MessageCircle,
  Search,
  UserRound,
  Settings,
  TrendingUp,
  CheckCircle2,
} from "lucide-vue-next";

import { useAuthStore } from "../stores/auth.store.js";
import AppHeader from "./LandingPageCompoent/AppHeader.vue";
import educatorLogo from "../assets/educatorlogo.png";
import { roleNavItems } from "../config/navigation.js";

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
*/

const route = useRoute();
const router = useRouter();

/*
|--------------------------------------------------------------------------
| Auth Store
|--------------------------------------------------------------------------
*/

const authStore = useAuthStore();

/*
|--------------------------------------------------------------------------
| Current Role
|--------------------------------------------------------------------------
*/

const role = computed(() => {
  return authStore.role || "educator";
});

const userName = computed(() => {
  return (
    authStore.user?.name ||
    authStore.user?.email ||
    "Member"
  );
});

/*
|--------------------------------------------------------------------------
| Role Details
|--------------------------------------------------------------------------
*/

const roleDetails = {
  childcare: {
    label: "Childcare Centre",
    shortLabel: "Centre",
    description:
      "Manage your centre, recruitment, applicants and family enquiries from one place.",

    welcome:
      "Everything you need to build a stronger early learning team.",

    stats: [
      {
        label: "Open positions",
        value: "4",
        icon: BriefcaseBusiness,
        description: "Currently active",
      },
      {
        label: "New applicants",
        value: "12",
        icon: Users,
        description: "Waiting for review",
      },
      {
        label: "Parent inquiries",
        value: "8",
        icon: MessageCircle,
        description: "Need your attention",
      },
      {
        label: "Profile views",
        value: "246",
        icon: TrendingUp,
        description: "This month",
      },
    ],
  },

  educator: {
    label: "Educator",
    shortLabel: "Educator",
    description:
      "Build your professional profile and discover the right opportunities in early childhood education.",

    welcome:
      "Your next opportunity could be closer than you think.",

    stats: [
      {
        label: "Profile strength",
        value: "72%",
        icon: UserRound,
        description: "Almost complete",
      },
      {
        label: "New matches",
        value: "18",
        icon: Sparkles,
        description: "Jobs matching you",
      },
      {
        label: "Applications",
        value: "6",
        icon: BriefcaseBusiness,
        description: "Submitted applications",
      },
      {
        label: "Saved jobs",
        value: "9",
        icon: CheckCircle2,
        description: "Saved opportunities",
      },
    ],
  },

  professional: {
    label: "Early Childhood Professional",
    shortLabel: "Professional",
    description:
      "Keep your directory profile current and connect with the early learning community.",

    welcome:
      "Make your professional experience easier to discover.",

    stats: [
      {
        label: "Profile status",
        value: "Draft",
        icon: UserRound,
        description: "Complete your profile",
      },
      {
        label: "Profile views",
        value: "0",
        icon: TrendingUp,
        description: "This month",
      },
      {
        label: "Messages",
        value: "0",
        icon: MessageCircle,
        description: "No new messages",
      },
      {
        label: "Directory searches",
        value: "0",
        icon: Search,
        description: "Profile discoveries",
      },
    ],
  },

  admin: {
    label: "Administrator",
    shortLabel: "Administrator",
    description:
      "Review, monitor and manage the Educator Connect platform.",

    welcome:
      "Keep the Educator Connect community running smoothly.",

    stats: [
      {
        label: "Registered users",
        value: "5,240",
        icon: Users,
        description: "Total platform users",
      },
      {
        label: "Active centres",
        value: "184",
        icon: BriefcaseBusiness,
        description: "Active centres",
      },
      {
        label: "Active jobs",
        value: "120",
        icon: TrendingUp,
        description: "Live opportunities",
      },
      {
        label: "Inquiries",
        value: "96",
        icon: MessageCircle,
        description: "Platform inquiries",
      },
    ],
  },
};

/*
|--------------------------------------------------------------------------
| Current Role Details
|--------------------------------------------------------------------------
*/

const details = computed(() => {
  return (
    roleDetails[role.value] ||
    roleDetails.educator
  );
});

/*
|--------------------------------------------------------------------------
| Current Role Navigation
|--------------------------------------------------------------------------
*/

const currentNavItems = computed(() => {
  return (
    roleNavItems[role.value] ||
    roleNavItems.educator
  );
});

/*
|--------------------------------------------------------------------------
| Header Navigation
|--------------------------------------------------------------------------
*/

const navItems = computed(() => {
  return [
    ...currentNavItems.value,
    {
      label: "Log out",
      href: "#",
      icon: LogIn,
      action: "logout",
    },
  ];
});

/*
|--------------------------------------------------------------------------
| Current Navigation Item
|--------------------------------------------------------------------------
*/

const currentItem = computed(() => {
  return (
    currentNavItems.value.find(
      (item) => item.href === route.path
    ) ||
    currentNavItems.value[0]
  );
});

/*
|--------------------------------------------------------------------------
| Current Section
|--------------------------------------------------------------------------
*/

const sectionTitle = computed(() => {
  return currentItem.value?.label || "Dashboard";
});

/*
|--------------------------------------------------------------------------
| Dashboard Page
|--------------------------------------------------------------------------
*/

const isDashboard = computed(() => {
  return sectionTitle.value === "Dashboard";
});

/*
|--------------------------------------------------------------------------
| Primary Action
|--------------------------------------------------------------------------
*/

const primaryAction = computed(() => {
  switch (sectionTitle.value) {
    case "Post a Job":
      return {
        label: "Create job posting",
        path: "/childcare/jobs/new",
        icon: BriefcaseBusiness,
      };

    case "Update Profile":
      return {
        label: "Edit profile",
        path: "/educator/profile",
        icon: UserRound,
      };

    case "Centre Profile":
      return {
        label: "Edit profile",
        path: "/childcare/profile",
        icon: UserRound,
      };

    case "Directory Profile":
      return {
        label: "Edit profile",
        path: "/professional/profile",
        icon: UserRound,
      };

    case "Browse Jobs":
      return {
        label: "Start searching",
        path: "/jobs",
        icon: Search,
      };

    case "Find Professionals":
      return {
        label: "Start searching",
        path: "/professionals",
        icon: Search,
      };

    case "Applicants":
      return {
        label: "View applicants",
        path: "/childcare/applications",
        icon: Users,
      };

    case "Parent Inquiries":
      return {
        label: "View inquiries",
        path: "/childcare/inquiries",
        icon: MessageCircle,
      };

    case "Applications":
      return {
        label: "View applications",
        path: "/educator/applications",
        icon: BriefcaseBusiness,
      };

    case "Saved Jobs":
      return {
        label: "View saved jobs",
        path: "/educator/saved-jobs",
        icon: CheckCircle2,
      };

    case "Practicum":
      return {
        label: "Open practicum",
        path:
          role.value === "educator"
            ? "/educator/practicum"
            : "/childcare/practicum",
        icon: BriefcaseBusiness,
      };

    case "Claim a Profile":
      return {
        label: "Claim profile",
        path: "/professionals/claim",
        icon: UserRound,
      };

    case "Users":
      return {
        label: "Manage users",
        path: "/admin/users",
        icon: Users,
      };

    case "Centres":
      return {
        label: "Manage centres",
        path: "/admin/centres",
        icon: BriefcaseBusiness,
      };

    case "Educators":
      return {
        label: "Manage educators",
        path: "/admin/educators",
        icon: Users,
      };

    case "Jobs":
      return {
        label: "Manage jobs",
        path: "/admin/jobs",
        icon: BriefcaseBusiness,
      };

    case "Directory":
      return {
        label: "Manage directory",
        path: "/admin/directory",
        icon: Search,
      };

    case "Inquiries":
      return {
        label: "View inquiries",
        path: "/admin/inquiries",
        icon: MessageCircle,
      };

    case "Reports":
      return {
        label: "View reports",
        path: "/admin/reports",
        icon: TrendingUp,
      };

    case "Account Settings":
      return {
        label: "Open settings",
        path: "/account/settings",
        icon: Settings,
      };

    default:
      return {
        label: `Open ${sectionTitle.value.toLowerCase()}`,
        path: null,
        icon: ArrowRight,
      };
  }
});

/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/

function navigate(path) {
  if (!path) {
    return;
  }

  router.push(path);
}

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

async function logout() {
  try {
    await authStore.logout();
    await router.push("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

/*
|--------------------------------------------------------------------------
| Primary Action
|--------------------------------------------------------------------------
*/

function handlePrimaryAction() {
  if (!primaryAction.value.path) {
    return;
  }

  navigate(primaryAction.value.path);
}

/*
|--------------------------------------------------------------------------
| Quick Actions
|--------------------------------------------------------------------------
*/

const quickActions = computed(() => {
  const actions = {
    childcare: [
      {
        label: "Post a Job",
        description: "Find your next educator",
        path: "/childcare/jobs/new",
        icon: BriefcaseBusiness,
      },
      {
        label: "View Applicants",
        description: "Review applications",
        path: "/childcare/applications",
        icon: Users,
      },
      {
        label: "Find Professionals",
        description: "Explore the directory",
        path: "/professionals",
        icon: Search,
      },
    ],

    educator: [
      {
        label: "Browse Jobs",
        description: "Discover opportunities",
        path: "/jobs",
        icon: Search,
      },
      {
        label: "My Applications",
        description: "Track your applications",
        path: "/educator/applications",
        icon: BriefcaseBusiness,
      },
      {
        label: "Update Profile",
        description: "Improve your profile",
        path: "/educator/profile",
        icon: UserRound,
      },
    ],

    professional: [
      {
        label: "Update Profile",
        description: "Complete your directory profile",
        path: "/professional/profile",
        icon: UserRound,
      },
      {
        label: "Find Opportunities",
        description: "Explore available roles",
        path: "/jobs",
        icon: Search,
      },
      {
        label: "Claim Profile",
        description: "Claim your directory listing",
        path: "/professionals/claim",
        icon: CheckCircle2,
      },
    ],

    admin: [
      {
        label: "Manage Users",
        description: "View platform users",
        path: "/admin/users",
        icon: Users,
      },
      {
        label: "Manage Centres",
        description: "Review registered centres",
        path: "/admin/centres",
        icon: BriefcaseBusiness,
      },
      {
        label: "View Reports",
        description: "Platform analytics",
        path: "/admin/reports",
        icon: TrendingUp,
      },
    ],
  };

  return actions[role.value] || actions.educator;
});
</script>

<template>
  <div class="role-dashboard">
    <!-- =========================================================
         HEADER
    ========================================================== -->

    <AppHeader
      :logo="educatorLogo"
      :nav-items="navItems"
      @logout="logout"
    />

    <!-- =========================================================
         DASHBOARD WRAPPER
    ========================================================== -->

    <main class="dashboard-container">

      <!-- =======================================================
           WELCOME HERO
      ======================================================== -->

      <section class="welcome-card">

        <div class="welcome-content">

          <div class="welcome-badge">
            <Sparkles :size="16" />
            <span>{{ details.label }}</span>
          </div>

          <p class="welcome-small">
            Welcome back, {{ userName }}
          </p>

          <h1>
            {{ details.welcome }}
          </h1>

          <p class="welcome-description">
            {{ details.description }}
          </p>

          <div class="welcome-actions">

            <button
              v-if="primaryAction.path"
              type="button"
              class="btn btn-light rounded-pill px-4"
              @click="handlePrimaryAction"
            >
              <component
                :is="primaryAction.icon"
                :size="18"
              />

              {{ primaryAction.label }}

              <ArrowRight :size="17" />
            </button>

            <button
              type="button"
              class="btn btn-outline-light rounded-pill px-4 text-white"
              @click="navigate('/account/settings')"
            >
              <Settings :size="17" />

              Settings
            </button>

          </div>
        </div>

        <!-- Decorative graphic -->

        <div class="welcome-decoration">
          <div class="decoration-circle circle-one"></div>
          <div class="decoration-circle circle-two"></div>

          <div class="decoration-icon">
            <component
              :is="currentItem?.icon || UserRound"
              :size="55"
              stroke-width="1.5"
            />
          </div>
        </div>

      </section>

      <!-- =======================================================
           PAGE LABEL
      ======================================================== -->

      <div class="page-heading">

        <div>
          <span class="eyebrow">
            <span></span>
            Your workspace
          </span>

          <h2>
            {{ sectionTitle }}
          </h2>

          <p>
            Manage your {{ sectionTitle.toLowerCase() }}
            and stay connected with the community.
          </p>
        </div>

        <div class="role-pill">
          <UserRound :size="16" />
          {{ details.shortLabel }}
        </div>

      </div>

      <!-- =======================================================
           STATISTICS
      ======================================================== -->

      <section
        v-if="isDashboard"
        class="stats-grid"
      >

        <div
          v-for="stat in details.stats"
          :key="stat.label"
          class="stat-card"
        >

          <div class="stat-top">

            <div class="stat-icon">
              <component
                :is="stat.icon"
                :size="21"
              />
            </div>

            <span class="stat-status">
              <TrendingUp :size="13" />
            </span>

          </div>

          <div class="stat-value">
            {{ stat.value }}
          </div>

          <div class="stat-label">
            {{ stat.label }}
          </div>

          <div class="stat-description">
            {{ stat.description }}
          </div>

        </div>

      </section>

      <!-- =======================================================
           CURRENT SECTION CARD
      ======================================================== -->

      <section class="content-card">

        <div class="content-card-header">

          <div class="content-icon">
            <component
              :is="currentItem?.icon || UserRound"
              :size="27"
            />
          </div>

          <div>

            <span class="content-eyebrow">
              Current section
            </span>

            <h3>
              {{ sectionTitle }}
            </h3>

            <p>
              Your
              {{ sectionTitle.toLowerCase() }}
              tools and information will appear here.
            </p>

          </div>

        </div>

        <div class="content-divider"></div>

        <div class="content-card-body">

          <div class="empty-state-icon">
            <component
              :is="currentItem?.icon || UserRound"
              :size="32"
            />
          </div>

          <div class="empty-state-content">

            <h4>
              Ready to get started?
            </h4>

            <p>
              Use the action below to continue working with
              your {{ sectionTitle.toLowerCase() }}.
            </p>

          </div>

          <button
            v-if="primaryAction.path"
            type="button"
            class="primary-action"
            @click="handlePrimaryAction"
          >
            <component
              :is="primaryAction.icon"
              :size="18"
            />

            {{ primaryAction.label }}

            <ArrowRight :size="17" />
          </button>

        </div>

      </section>

      <!-- =======================================================
           QUICK ACTIONS
      ======================================================== -->

      <section class="quick-section">

        <div class="quick-heading">

          <div>
            <span class="eyebrow">
              <span></span>
              Quick access
            </span>

            <h3>
              Explore your workspace
            </h3>
          </div>

        </div>

        <div class="quick-grid">

          <button
            v-for="action in quickActions"
            :key="action.label"
            type="button"
            class="quick-card"
            @click="navigate(action.path)"
          >

            <div class="quick-icon">
              <component
                :is="action.icon"
                :size="22"
              />
            </div>

            <div class="quick-content">
              <strong>
                {{ action.label }}
              </strong>

              <span>
                {{ action.description }}
              </span>
            </div>

            <ArrowRight
              class="quick-arrow"
              :size="18"
            />

          </button>

        </div>

      </section>

    </main>
  </div>
</template>

<style scoped>
/*
|--------------------------------------------------------------------------
| Main Layout
|--------------------------------------------------------------------------
*/

.role-dashboard {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at top left,
      rgba(49, 106, 255, 0.06),
      transparent 35%
    ),
    #f7f9fc;
}

.dashboard-container {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 38px 0 70px;
}

/*
|--------------------------------------------------------------------------
| Welcome Card
|--------------------------------------------------------------------------
*/

.welcome-card {
  position: relative;
  overflow: hidden;
  min-height: 330px;
  margin-top: 70px;
  display: flex;
  align-items: center;
  padding: 48px;
  border-radius: 30px;
  background: linear-gradient(135deg, #4e0077 0%, #4e0077 55%, #4e0077 100%);
  box-shadow: 0 25px 60px rgba(78, 0, 119, 0.20);
  color: #fff;
}

.welcome-content {
  position: relative;
  z-index: 3;

  max-width: 720px;
}

.welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding: 7px 13px;

  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.12);

  font-size: 13px;
  font-weight: 600;

  margin-bottom: 20px;
}

.welcome-small {
  margin-bottom: 7px;

  color: rgba(255, 255, 255, 0.72);

  font-size: 14px;
}

.welcome-card h1 {
  max-width: 680px;

  margin: 0 0 15px;

  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.08;
  font-weight: 750;
  letter-spacing: -1.5px;
}

.welcome-description {
  max-width: 650px;

  margin: 0;

  color: rgba(255, 255, 255, 0.82);

  font-size: 16px;
  line-height: 1.7;
}

.welcome-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  margin-top: 28px;
}

.welcome-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/*
|--------------------------------------------------------------------------
| Decorative Welcome Graphic
|--------------------------------------------------------------------------
*/

.welcome-decoration {
  position: absolute;

  right: 15px;
  top: 50%;

  width: 370px;
  height: 370px;

  transform: translateY(-50%);

  pointer-events: none;
}

.decoration-circle {
  position: absolute;

  border-radius: 50%;

  border: 1px solid rgba(255, 255, 255, 0.12);
}

.circle-one {
  width: 360px;
  height: 360px;

  right: 0;
  top: 0;
}

.circle-two {
  width: 240px;
  height: 240px;

  right: 60px;
  top: 60px;
}

.decoration-icon {
  position: absolute;

  right: 130px;
  top: 130px;

  width: 110px;
  height: 110px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 30px;

  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.18);

  backdrop-filter: blur(10px);
}

/*
|--------------------------------------------------------------------------
| Page Heading
|--------------------------------------------------------------------------
*/

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;

  margin: 42px 0 20px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  margin-bottom: 8px;

  color: #4e0077;

  font-size: 12px;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.eyebrow > span {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #4e0077;
}

.page-heading h2 {
  margin: 0 0 5px;

  color: #172033;

  font-size: 27px;
  font-weight: 750;
}

.page-heading p {
  margin: 0;

  color: #778197;

  font-size: 14px;
}

.role-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding: 8px 13px;

  border: 1px solid #e5eaf2;
  border-radius: 999px;

  background: #fff;

  color: #4d5870;

  font-size: 13px;
  font-weight: 650;

  white-space: nowrap;
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

.stats-grid {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 16px;

  margin-bottom: 22px;
}

.stat-card {
  position: relative;

  padding: 22px;

  border: 1px solid #e9edf4;
  border-radius: 20px;

  background: #fff;

  box-shadow:
    0 8px 25px rgba(20, 31, 56, 0.045);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);

  box-shadow:
    0 15px 35px rgba(20, 31, 56, 0.08);
}

.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 18px;
}

.stat-icon {
  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  background: #edf3ff;
  color: #4e0077;
}

.stat-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 25px;
  height: 25px;

  border-radius: 50%;

  background: #effaf5;
  color: #12a66b;
}

.stat-value {
  margin-bottom: 3px;

  color: #172033;

  font-size: 28px;
  line-height: 1.1;
  font-weight: 750;
}

.stat-label {
  color: #303a50;

  font-size: 14px;
  font-weight: 700;
}

.stat-description {
  margin-top: 5px;

  color: #8992a5;

  font-size: 12px;
}

/*
|--------------------------------------------------------------------------
| Main Content Card
|--------------------------------------------------------------------------
*/

.content-card {
  overflow: hidden;

  border: 1px solid #e9edf4;
  border-radius: 24px;

  background: #fff;

  box-shadow:
    0 10px 30px rgba(20, 31, 56, 0.05);
}

.content-card-header {
  display: flex;
  align-items: center;
  gap: 15px;

  padding: 26px 28px;
}

.content-icon {
  width: 55px;
  height: 55px;

  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 16px;

  background: #edf3ff;
  color: #4e0077;
}

.content-eyebrow {
  display: block;

  margin-bottom: 3px;

  color: #8a93a5;

  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
}

.content-card-header h3 {
  margin: 0 0 4px;

  color: #172033;

  font-size: 21px;
  font-weight: 750;
}

.content-card-header p {
  margin: 0;

  color: #7e8799;

  font-size: 13px;
}

.content-divider {
  height: 1px;

  background: #edf0f5;
}

.content-card-body {
  min-height: 145px;

  display: flex;
  align-items: center;
  gap: 16px;

  padding: 28px;
}

.empty-state-icon {
  width: 58px;
  height: 58px;

  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 17px;

  background:
    linear-gradient(
      135deg,
      #f0f5ff,
      #e8f0ff
    );

  color: #4e0077;
}

.empty-state-content {
  flex: 1;
}

.empty-state-content h4 {
  margin: 0 0 5px;

  color: #202a3e;

  font-size: 16px;
  font-weight: 700;
}

.empty-state-content p {
  max-width: 600px;

  margin: 0;

  color: #808a9d;

  font-size: 13px;
  line-height: 1.6;
}

.primary-action {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 11px 17px;

  border: 0;
  border-radius: 999px;

  background: #4e0077;
  color: #fff;

  font-size: 13px;
  font-weight: 700;

  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.primary-action:hover {
  background: #2454db;

  transform: translateY(-2px);
}

/*
|--------------------------------------------------------------------------
| Quick Actions
|--------------------------------------------------------------------------
*/

.quick-section {
  margin-top: 38px;
}

.quick-heading {
  margin-bottom: 17px;
}

.quick-heading h3 {
  margin: 0;

  color: #172033;

  font-size: 21px;
  font-weight: 750;
}

.quick-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 15px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 13px;

  width: 100%;

  padding: 17px;

  border: 1px solid #e9edf4;
  border-radius: 18px;

  background: #fff;

  text-align: left;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.quick-card:hover {
  transform: translateY(-3px);

  border-color: #d8e3ff;

  box-shadow:
    0 12px 28px rgba(20, 31, 56, 0.07);
}

.quick-icon {
  width: 45px;
  height: 45px;

  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  background: #f0f4ff;
  color: #4e0077;
}

.quick-content {
  display: flex;
  flex-direction: column;

  min-width: 0;
  flex: 1;
}

.quick-content strong {
  color: #202a3e;

  font-size: 14px;
  font-weight: 700;
}

.quick-content span {
  margin-top: 3px;

  overflow: hidden;

  color: #8992a5;

  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-arrow {
  flex: 0 0 auto;

  color: #9ca5b5;

  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.quick-card:hover .quick-arrow {
  color: #4e0077;

  transform: translateX(3px);
}

/*
|--------------------------------------------------------------------------
| Tablet
|--------------------------------------------------------------------------
*/

@media (max-width: 991px) {
  .dashboard-container {
    width: min(100% - 24px, 760px);
    padding-top: 25px;
  }

  .welcome-card {
    padding: 36px;
  }

  .welcome-decoration {
    right: -130px;
    opacity: 0.7;
  }

  .stats-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .quick-grid {
    grid-template-columns:
      1fr;
  }
}

/*
|--------------------------------------------------------------------------
| Mobile
|--------------------------------------------------------------------------
*/

@media (max-width: 767px) {
  .dashboard-container {
    width: calc(100% - 20px);

    padding: 18px 0 45px;
  }

  .welcome-card {
    min-height: auto;

    padding: 28px 22px;

    border-radius: 22px;
  }

  .welcome-card h1 {
    font-size: 30px;
    letter-spacing: -0.8px;
  }

  .welcome-description {
    font-size: 14px;
  }

  .welcome-decoration {
    display: none;
  }

  .welcome-actions {
    width: 100%;

    flex-direction: column;
  }

  .welcome-actions button {
    width: 100%;
  }

  .page-heading {
    align-items: flex-start;
    flex-direction: column;

    margin-top: 30px;
  }

  .page-heading h2 {
    font-size: 23px;
  }

  .stats-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 10px;
  }

  .stat-card {
    padding: 16px;

    border-radius: 17px;
  }

  .stat-icon {
    width: 39px;
    height: 39px;
  }

  .stat-value {
    font-size: 24px;
  }

  .content-card {
    border-radius: 19px;
  }

  .content-card-header {
    padding: 20px;
  }

  .content-card-body {
    align-items: flex-start;
    flex-direction: column;

    padding: 20px;
  }

  .primary-action {
    width: 100%;
  }

  .quick-grid {
    gap: 10px;
  }
}

/*
|--------------------------------------------------------------------------
| Small Mobile
|--------------------------------------------------------------------------
*/

@media (max-width: 430px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    display: grid;

    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;

    column-gap: 13px;
    align-items: center;
  }

  .stat-top {
    grid-row: 1 / span 2;
    margin: 0;
  }

  .stat-status {
    display: none;
  }

  .stat-value {
    grid-column: 2;

    margin: 0;
  }

  .stat-label {
    grid-column: 2;
  }

  .stat-description {
    grid-column: 3;
    grid-row: 1 / span 2;

    margin: 0;
  }

  .role-pill {
    align-self: flex-start;
  }
}


</style>