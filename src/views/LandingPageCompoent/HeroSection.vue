<template>
  <section class="row align-items-center g-4 py-3 py-lg-4">
    <!-- LEFT -->
    <div class="col-lg-7 position-relative">
      <div class="hero-glow"></div>

      <div class="position-relative">
        <span class="badge rounded-pill bg-primary-subtle text-primary fw-semibold">
          One trusted early childhood ecosystem
        </span>

        <h1 class="display-4 fw-bold mt-4 mb-3 text-dark">
          {{ activeContent.heroTitle }}
        </h1>

        <p class="lead text-muted mb-4">
          {{ activeContent.heroDescription }}
        </p>

        <!-- MENU BUTTONS -->
        <div class="d-flex gap-3 flex-wrap">
          <button
            v-for="menu in menus"
            :key="menu.key"
            type="button"
            class="btn"
            :class="activeMenu === menu.key ? 'btn-primary' : 'btn-light'"
            @click="changeSection(menu.key)"
          >
            {{ menu.label }}
            <span v-if="menu.key === 'daycares'"> →</span>
          </button>
        </div>

        <!-- FILTER TIPS -->
        <div class="d-flex flex-wrap gap-3 mt-4">
          <div
            v-for="tip in activeContent.filterTips"
            :key="tip.title"
            class="d-flex align-items-start gap-3"
          >
            <span
              class="avatar avatar-xs rounded-circle bg-primary-subtle text-primary
                     d-flex align-items-center justify-content-center fw-semibold"
            >
              ✓
            </span>

            <div>
              <h3 class="h6 mb-1 text-dark">
                {{ tip.title }}
              </h3>

              <p
                v-if="tip.description"
                class="small text-muted mb-0"
              >
                {{ tip.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT CARD -->
    <div class="col-lg-5">
      <div
        class="card border-0 shadow-lg rounded-4 p-2 position-relative
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

              <h3 class="h6 mb-1 text-dark">
                {{ activeContent.cardTitle }}
              </h3>

              <p class="small text-muted mb-0">
                {{ activeContent.cardDescription }}
              </p>
            </div>

            <div class="d-flex flex-column align-items-end gap-1">
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
                  class="badge rounded-pill bg-primary-subtle
                         text-primary fw-semibold"
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

const emit = defineEmits([
  'change-section',
  'item-action',
  'explore'
]);

const activeMenu = ref('daycares');

const menus = [
  {
    key: 'daycares',
    label: 'Find Daycares'
  },
  {
    key: 'centers',
    label: 'For Centers'
  },
  {
    key: 'jobs',
    label: 'Explore Jobs'
  }
];

const sections = {
  daycares: {
    label: 'Featured',
    cardTitle: 'Nearby daycares',
    cardDescription: 'Find trusted childcare centres near you.',
    status: 'Live now',
    infoText: 'Daycares available near you',
    icon: 'fi fi-rr-home',
    itemAction: 'View daycare',
    bottomLabel: 'Looking for childcare?',
    bottomTitle: 'Find the right place for your family.',
    exploreText: 'Explore',
    heroTitle: 'Where families, educators & centres connect.',
    heroDescription:
      'Discover childcare, compare daycare centres, explore programs, and connect with trusted early childhood professionals — all in one place.',

    filterTips: [
      {
        title: 'Search nearby daycares',
        description: 'Find centres using your city or postal code.'
      },
      {
        title: 'Compare childcare',
        description: 'Explore programs, ages, availability and more.'
      }
    ],

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
      },    
    ]
  },

  centers: {
    label: 'For childcare centres',
    cardTitle: 'Grow your centre',
    cardDescription: 'Connect with families and qualified educators.',
    status: 'For centres',
    infoText: 'Build your centre presence',
    icon: 'fi fi-rr-building',
    itemAction: 'View profile',
    bottomLabel: 'Want more visibility?',
    bottomTitle: 'Create your centre profile.',
    exploreText: 'Get started',
    heroTitle: 'Give your childcare centre a profile people can trust.',
    heroDescription:
      'Show families what makes your centre special, recruit educators, receive inquiries, and manage your childcare presence from one place.',

    filterTips: [
      {
        title: 'Showcase your centre',
        description: 'Add programs, photos, team information and videos.'
      },
      {
        title: 'Recruit educators',
        description: 'Post jobs and manage applications in one place.'
      }
    ],

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
      },     
    ]
  },

  jobs: {
    label: 'Featured jobs',
    cardTitle: 'Latest opportunities',
    cardDescription: 'Discover your next early childhood opportunity.',
    status: 'Hiring now',
    infoText: 'New roles available today',
    icon: 'fi fi-rr-briefcase',
    itemAction: 'View job',
    bottomLabel: 'Ready for your next opportunity?',
    bottomTitle: 'Build your educator profile.',
    exploreText: 'Explore',
    heroTitle: 'Find meaningful opportunities in early childhood education.',
    heroDescription:
      'Discover childcare jobs, create a professional profile, find nearby opportunities, and connect with centres looking for educators.',

    filterTips: [
      {
        title: 'Find nearby jobs',
        description: 'Search by city, postal code and distance.'
      },
      {
        title: 'Create your profile',
        description: 'Showcase your experience beyond a traditional résumé.'
      }
    ],

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
      },     
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