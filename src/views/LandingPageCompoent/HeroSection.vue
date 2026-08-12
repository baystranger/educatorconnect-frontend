<template>
  <section class="row align-items-center g-4 py-3 py-lg-4 hero-section mt-4">
    <!-- LEFT -->
    <div class="col-lg-7 position-relative">
      <div class="hero-glow"></div>

      <div class="position-relative">
        <span class="rounded-pill bg-primary-subtle text-primary fw-semibold">
          Where Canada's early years come together
        </span>

        <h1 class="display-4 fw-bold text-dark">
          One hub for childcare centres, educators, and families
        </h1>

        <p class="lead text-muted mb-4">
          Post your openings or your program, find a role that fits your life, or find the right daycare for your child — all in the same place.
        </p>

        <SearchPanel
          :active-section="activeMenu"
          @update:activeSection="changeSection"
        />

      </div>
    </div>

    <!-- RIGHT CARD -->
    <div class="col-lg-5">
      <div
        class="card border-0 shadow-lg rounded-4 p-4 position-relative
               overflow-hidden mt-4 mt-lg-5 hero-panel"
        style="background: linear-gradient(145deg, #ffffff 0%, #f8fbff 100%);"
      >
        <div class="hero-glow"></div>

        <div class="position-relative">

          <!-- CARD HEADER -->
          <div
            class="d-flex justify-content-between align-items-start
                   gap-3 mb-3"
          >
            <div>
              <p
                class="text-2xs fw-semibold text-uppercase text-primary mb-1"
              >
                {{ activeContent.label }}
              </p>

              <h3 class="h5 mb-2 text-dark">
                {{ activeContent.cardTitle }}
              </h3>

              <p class="small text-muted mb-0">
                {{ activeContent.cardDescription }}
              </p>
            </div>

            <div class="d-flex flex-column align-items-end gap-2">
              <span
                class="badge rounded-pill bg-success-subtle text-success fw-semibold"
              >
                {{ activeContent.status }}
              </span>

              <span
                class="badge rounded-pill bg-primary-subtle text-primary fw-semibold"
              >
                {{ activeContent.highlights.length }} matches
              </span>
            </div>
          </div>

          <!-- INFO BADGE -->
          <div
            class="d-flex align-items-center gap-2 rounded-pill
                   border border-primary-subtle bg-primary-subtle
                   px-2 py-1 mb-2 w-fit"
          >
            <span
              class="avatar avatar-xs rounded-circle bg-primary text-white
                     d-flex align-items-center justify-content-center"
            >
              <i :class="activeContent.icon"></i>
            </span>

            <span class="small fw-semibold text-primary">
              {{ activeContent.infoText }}
            </span>
          </div>

          <!-- ITEMS -->
          <div class="d-grid gap-2">
            <article
              v-for="item in activeContent.highlights"
              :key="item.title"
              class="card border-0 rounded-3 p-2 shadow-none
                     transition-all hover-shadow-sm"
              style="
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid rgba(49, 106, 255, 0.12);
              "
            >
              <div
                class="d-flex justify-content-between
                       align-items-start gap-2"
              >
                <div class="flex-grow-1">

                  <div class="d-flex align-items-center gap-2 mb-1">
                    <span
                      class="avatar avatar-xs rounded-circle bg-light
                             text-primary d-flex align-items-center
                             justify-content-center"
                    >
                      <i :class="item.icon || activeContent.icon"></i>
                    </span>

                    <h4 class="small fw-semibold mb-0 text-dark">
                      {{ item.title }}
                    </h4>
                  </div>

                  <p class="small text-muted mb-1">
                    {{ item.meta }}
                  </p>

                  <p
                    v-if="item.description"
                    class="small text-muted mb-0"
                  >
                    {{ item.description }}
                  </p>

                </div>

                <span
                  class="badge side-badge rounded-pill bg-primary-subtle
                         text-primary fw-semibold w-25"
                >
                  {{ item.badge }}
                </span>
              </div>

              <div
                class="d-flex justify-content-between
                       align-items-center mt-2 pt-2 border-top"
              >
                <span class="small text-muted">
                  {{ item.location }}
                </span>

                <a
                  href="#"
                  class="btn btn-link btn-sm p-0 text-primary fw-semibold"
                  @click.prevent="handleItemAction(item)"
                >
                  {{ activeContent.itemAction }}
                </a>
              </div>
            </article>
          </div>

          <!-- BOTTOM CTA -->
          <div
            class="mt-3 d-flex justify-content-between
                   align-items-center gap-2"
          >
            <div>
              <p class="small text-muted mb-0">
                {{ activeContent.bottomLabel }}
              </p>

              <p class="small fw-semibold text-dark mb-0">
                {{ activeContent.bottomTitle }}
              </p>
            </div>

            <button
              type="button"
              class="btn btn-primary btn-sm rounded-pill px-3"
              @click="handleExplore"
            >
              {{ activeContent.exploreText }}
            </button>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import SearchPanel from './SearchPanel.vue';

const emit = defineEmits([
  'change-section',
  'item-action',
  'explore'
]);

const activeMenu = ref('educators');

const menus = [
  {
    key: 'educators',
    label: 'For Educators'
  },
  {
    key: 'centres',
    label: 'For Centres'
  },
  {
    key: 'parents',
    label: 'For Parents'
  }
];

const sections = {
  parents: {
    label: 'Featured Centres',
    cardTitle: 'Popular childcare options',
    cardDescription: 'Find trusted centres, compare programs, and book a tour with confidence.',
    status: 'Open today',
    infoText: 'Licensed childcare listings',
    icon: 'fi fi-rr-home',
    itemAction: 'View centre',
    bottomLabel: 'Looking for childcare?',
    bottomTitle: 'Find the right place for your family.',
    exploreText: 'Search now',
    heroTitle: 'One hub for childcare centres, educators, and families',
    heroDescription:
      'Search licensed centres, compare programs, and connect with childcare providers who meet your needs.',

    highlights: [
      {
        title: 'Little Sprouts Daycare',
        meta: 'Licensed Childcare · 6 months – 5 years',
        description:
          'A warm and nurturing early learning centre focused on play-based learning.',
        badge: 'Open',
        location: '2.4 km away',
        icon: 'fi fi-rr-home'
      },
      {
        title: 'Happy Hearts Early Learning',
        meta: 'Preschool & Daycare · 1 – 5 years',
        description:
          'A welcoming environment focused on creativity, learning and development.',
        badge: 'Tours',
        location: '3.1 km away',
        icon: 'fi fi-rr-home'
      }
    ]
  },

  centres: {
    label: 'Featured Services',
    cardTitle: 'Build your centre presence',
    cardDescription: 'Attract families and qualified educators with a strong childcare profile.',
    status: 'For centres',
    infoText: 'Trusted by childcare leaders',
    icon: 'fi fi-rr-building',
    itemAction: 'View profile',
    bottomLabel: 'Want more visibility?',
    bottomTitle: 'Create your centre profile and grow your reach.',
    exploreText: 'Get started',
    heroTitle: 'Give your childcare centre a profile people can trust.',
    heroDescription:
      'Show families what makes your centre special, recruit educators, receive inquiries, and manage your centre from one place.',

    highlights: [
      {
        title: 'Create Centre Profile',
        meta: 'Programs · Gallery · Team · Video',
        description:
          'Show parents and educators everything they need to know about your centre.',
        badge: 'Profile',
        location: 'Get started',
        icon: 'fi fi-rr-building'
      },
      {
        title: 'Post a Job',
        meta: 'Full time · Part time · Casual',
        description:
          'Reach educators looking for their next early childhood opportunity.',
        badge: 'Recruit',
        location: 'Post opportunity',
        icon: 'fi fi-rr-briefcase'
      }
    ]
  },

  educators: {
    label: 'Featured Roles',
    cardTitle: 'Top opportunities for educators',
    cardDescription: 'Discover meaningful roles in early childhood education that match your experience.',
    status: 'Hiring now',
    infoText: 'New positions available',
    icon: 'fi fi-rr-briefcase',
    itemAction: 'View job',
    bottomLabel: 'Ready for your next opportunity?',
    bottomTitle: 'Build your educator profile and connect with hiring centres.',
    exploreText: 'Browse roles',
    heroTitle: 'Find meaningful opportunities in early childhood education',
    heroDescription:
      'Discover roles that fit your schedule, values and experience, then connect directly with childcare centres.',

    highlights: [
      {
        title: 'Early Childhood Educator',
        meta: 'Full time · Early Learning',
        description:
          'Support children through play-based learning and meaningful daily experiences.',
        badge: 'Full time',
        location: '2.8 km away',
        icon: 'fi fi-rr-briefcase'
      },
      {
        title: 'ECE Preschool Teacher',
        meta: 'Full time · Preschool',
        description:
          'Create a nurturing classroom environment that encourages learning and creativity.',
        badge: 'New',
        location: '5.4 km away',
        icon: 'fi fi-rr-briefcase'
      }
    ]
  }
};

const activeContent = computed(() => {
  return sections[activeMenu.value];
});

function changeSection(section) {
  activeMenu.value = section;

  emit('change-section', section);
}

function handleItemAction(item) {
  emit('item-action', {
    section: activeMenu.value,
    item
  });
}

function handleExplore() {
  emit('explore', activeMenu.value);
}
</script>

<style scoped>
.hero-section {
  position: relative;
}

.hero-section .hero-glow {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top left, rgba(78, 0, 119, 0.12), transparent 36%),
    radial-gradient(circle at bottom right, rgba(79, 130, 255, 0.1), transparent 28%);
  pointer-events: none;
  filter: blur(16px);
  z-index: 0;
}

.hero-action-buttons {
  z-index: 1;
}

.hero-action-buttons .btn {
  min-width: 170px;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.hero-action-buttons .btn:hover {
  transform: translateY(-1px);
}

.hero-stats {
  gap: 16px;
  z-index: 1;
}

.stat-card {
  min-width: 150px;
  flex: 1 1 160px;
  border: 1px solid rgba(78, 0, 119, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

.side-badge {
  min-inline-size: auto !important;
}

.tip-pill {
  min-width: 240px;
  flex: 1 1 240px;
  padding: 18px;
  border-radius: 24px;
  border: 1px solid rgba(78, 0, 119, 0.08);
  background: rgba(255, 255, 255, 0.97);
  z-index: 1;
}

.hero-tips .avatar-xs {
  width: 30px;
  height: 30px;
  font-size: 13px;
}

@media (max-width: 991px) {
  .hero-stats,
  .hero-tips {
    flex-direction: column;
  }
}

@media (max-width: 767px) {
  .hero-action-buttons .btn {
    width: 100%;
  }
}
</style>