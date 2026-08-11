<template>
  <section id="steps" class="py-2 py-lg-3">
    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-2 mb-3">
      <div>
        <p class="text-2xs fw-semibold text-uppercase text-primary mb-1">How it works</p>
        <h2 class="h3 mb-0 text-dark">4 easy steps to get set up!</h2>
      </div>
      <a href="#subscribe" class="btn btn-outline-primary rounded-pill">Join our community</a>
    </div>

    <div class="row g-3">
      <div v-for="(step, index) in steps" :key="step.title" class="col-md-6 col-xl-3">
        <div class="card border-0 shadow-sm h-100 rounded-4 p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="avatar avatar-sm rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
              <component :is="step.icon" class="icon-sm" />
            </div>
            <span class="text-2xs fw-semibold text-uppercase text-muted">Step {{ index + 1 }}</span>
          </div>
          <h3 class="h6 text-dark">{{ step.title }}</h3>
          <p class="text-muted mb-0">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  steps: { type: Array, required: true }
});
</script>