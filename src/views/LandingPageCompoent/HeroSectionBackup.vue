<template>
  <section class="row align-items-center g-4 py-3 py-lg-4">
    <div class="col-lg-7 position-relative">
      <div class="hero-glow"></div>
      <div class="position-relative">
        <span class="badge rounded-pill bg-primary-subtle text-primary fw-semibold">
          One trusted early childhood ecosystem
        </span>
        <h1 class="display-4 fw-bold mt-4 mb-3 text-dark">
          Where families, educators &amp; centres <em>connect.</em>
        </h1>
        <p class="lead text-muted mb-4">
          Discover childcare, find meaningful education careers, explore
          practicum opportunities, and connect with early childhood
          professionals — all in one place.
        </p>

        <div class="d-flex gap-3">
          <a class="btn btn-primary" href="#childcare">Find dayCares →</a>
          <a class="btn btn-light" href="#centers">For centers</a>
          <a class="btn btn-primary" href="#jobs">Explore jobs</a>
        </div>

        <div class="d-flex flex-wrap gap-3 mt-4">
          <div v-for="tip in filterTips" :key="tip.title" class="d-flex align-items-start gap-3">
            <span class="avatar avatar-xs rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-semibold">✓</span>
            <div>
              <h3 class="h6 mb-1 text-dark">{{ tip.title }}</h3>
              <p v-if="tip.description" class="small text-muted mb-0">{{ tip.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-5">
      <div
        class="card border-0 shadow-lg rounded-4 p-2 p-lg-2 position-relative overflow-hidden mt-4 mt-lg-5 hero-panel"
        style="background: linear-gradient(145deg, #ffffff 0%, #f8fbff 100%);"
      >
        <div class="hero-glow"></div>
        <div class="position-relative">
          <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div>
              <p class="text-2xs fw-semibold text-uppercase text-primary mb-1">Featured</p>
              <h3 class="h6 mb-1 text-dark">Upcoming opportunities</h3>
              <p class="small text-muted mb-0">Fresh roles opening now.</p>
            </div>
            <div class="d-flex flex-column align-items-end gap-1">
              <span class="badge rounded-pill bg-success-subtle text-success fw-semibold">Live now</span>
              <span class="badge rounded-pill bg-primary-subtle text-primary fw-semibold">3 matches</span>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2 rounded-pill border border-primary-subtle bg-primary-subtle px-2 py-1 mb-2 w-fit">
            <span class="avatar avatar-xs rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
              <i class="fi fi-rr-bolt"></i>
            </span>
            <span class="small fw-semibold text-primary">Priority roles available today</span>
          </div>

          <div class="d-grid gap-2">
            <article
              v-for="item in highlights"
              :key="item.title"
              class="card border-0 rounded-3 p-2 shadow-none transition-all hover-shadow-sm"
              style="background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(49, 106, 255, 0.12);"
            >
              <div class="d-flex justify-content-between align-items-start gap-2">
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <span class="avatar avatar-xs rounded-circle bg-light text-primary d-flex align-items-center justify-content-center">
                      <i class="fi fi-rr-briefcase"></i>
                    </span>
                    <h4 class="small fw-semibold mb-0 text-dark">{{ item.title }}</h4>
                  </div>
                  <p class="small text-muted mb-1">{{ item.meta }}</p>
                  <p v-if="item.description" class="small text-muted mb-0">{{ item.description }}</p>
                </div>
                <span class="badge rounded-pill bg-primary-subtle text-primary fw-semibold">{{ item.badge }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                <span class="small text-muted">{{ item.location }}</span>
                <a href="#subscribe" class="btn btn-link btn-sm p-0 text-primary fw-semibold">Apply</a>
              </div>
            </article>
          </div>

          <div class="mt-3 d-flex justify-content-between align-items-center gap-2">
            <div>
              <p class="small text-muted mb-0">Stronger profile?</p>
              <p class="small fw-semibold text-dark mb-0">Stand out in seconds.</p>
            </div>
            <a href="#subscribe" class="btn btn-primary btn-sm rounded-pill px-3">Explore</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  filterTips: { type: Array, required: true },
  highlights: { type: Array, required: true }
});
</script>