<template>
  <div class="card border-0 shadow-sm rounded-4 p-4 p-lg-5">
    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
      <div>
        <p class="text-2xs fw-semibold text-uppercase text-primary mb-2">Recent jobs</p>
        <h2 class="h3 mb-0 text-dark">{{ title }}</h2>
      </div>
      <a href="https://educatorconnect.ca/jobs" class="btn btn-outline-primary rounded-pill">Browse all jobs</a>
    </div>

    <div class="row g-3">
      <div v-for="job in jobs" :key="job.title" :class="columnClass">
        <div class="card border shadow-none rounded-4 h-100 p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="badge rounded-pill bg-primary-subtle text-primary">{{ job.type }}</span>
            <span class="small text-muted">{{ job.published }}</span>
          </div>
          <h3 class="h6 text-dark">{{ job.title }}</h3>
          <p class="text-muted small mb-0">{{ job.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '5+ Recently Added Jobs' },
  jobs: { type: Array, required: true },
  columnClass: { type: String, default: 'col-md-6' }
});
</script>