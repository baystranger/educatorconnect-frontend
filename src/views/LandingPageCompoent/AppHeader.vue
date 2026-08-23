<template>
  <header class="app-header border-bottom bg-white">
    <div
      class="app-header-inner d-flex align-items-center justify-content-between px-3 py-2"
    >
      <a class="d-flex align-items-center gap-3 text-decoration-none" href="/">
        <img :src="logo" alt="EducatorConnect" class="app-logo" />
      </a>

      <div class="app-header-end d-flex align-items-center">
        <nav class="nav-link d-none d-lg-flex flex-row me-4 gap-2">
          <a
            v-for="item in navItems"
            :key="item.label"
            :href="item.href"
            class="nav-link fw-semibold d-flex align-items-center gap-2"
            :class="{
              active: activeNav === item.label,
            }"
            @click="onNavClick(item, $event)"
          >
            <component :is="item.icon" :size="18" :stroke-width="2" />

            <span>
              {{ item.label }}
            </span>
          </a>
          <span v-if="user" class="nav-link fw-semibold d-flex align-items-center gap-2">
            <component :is="userIcon" :size="18" :stroke-width="2" />
            <span>
              {{ user.name }}
            </span>
          </span>
        </nav>

        <!-- Mobile Hamburger -->
        <button
          type="button"
          class="btn btn-ghost d-lg-none"
          @click="isOpen = !isOpen"
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- =========================
         MOBILE NAVIGATION
    ========================== -->

    <div
      v-if="isOpen"
      class="mobile-nav d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-white"
      style="z-index: 1050"
    >
      <!-- Mobile Panel -->
      <div
        class="mobile-nav-panel p-4"
        style="
          max-width: 320px;
          background: #fff;
          height: 100%;
          box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
          position: relative;
          z-index: 2;
        "
      >
        <!-- Mobile Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <a href="/" @click="closeMenu">
            <img :src="logo" alt="EducatorConnect" style="height: 36px" />
          </a>

          <button
            type="button"
            class="btn btn-close"
            @click="closeMenu"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <!-- Mobile Links -->
        <nav class="d-flex flex-column gap-3">
          <a
            v-for="item in navItems"
            :key="item.label"
            :href="item.href"
            class="fw-semibold d-flex align-items-center gap-2 text-decoration-none text-primary"
            :class="{
              'text-primary': activeNav === item.label,
            }"
            @click="onNavClick(item, $event)"
          >
            <component :is="item.icon" :size="18" :stroke-width="2" />

            <span>
              {{ item.label }}
            </span>
          </a>
        </nav>
      </div>

      <!-- Backdrop -->
      <div
        class="mobile-nav-backdrop position-absolute top-0 end-0 text-primary"
        style="
          width: calc(100% - 320px);
          height: 100%;
          background: rgba(0, 0, 0, 0.25);
          z-index: 1;
        "
        @click="closeMenu"
      ></div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth.store.js";

/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
*/

const props = defineProps({
  logo: {
    type: String,
    required: true,
  },

  navItems: {
    type: Array,
    required: true,
  }
});

/*
|--------------------------------------------------------------------------
| Active Navigation
|--------------------------------------------------------------------------
*/

const activeNav = ref("Home");

/*
|--------------------------------------------------------------------------
| Mobile Menu
|--------------------------------------------------------------------------
*/

const isOpen = ref(false);
const router = useRouter();
const authStore = useAuthStore();

/*
|--------------------------------------------------------------------------
| Mobile Navigation Click
|--------------------------------------------------------------------------
*/

async function onNavClick(item, event) {
  if (item.action === "logout") {
    event.preventDefault();
    await authStore.logout();
    await router.push("/");
  }

  // Set active menu
  activeNav.value = item.label;

  // Close mobile menu
  isOpen.value = false;
}

/*
|--------------------------------------------------------------------------
| Close Mobile Menu
|--------------------------------------------------------------------------
*/

function closeMenu() {
  isOpen.value = false;
}
</script>
