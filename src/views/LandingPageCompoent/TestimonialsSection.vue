<template>
  <section id="testimonials" class="py-3 py-lg-4">
    <div class="text-center mb-4">
      <p class="text-2xs fw-semibold text-uppercase text-primary mb-2">Testimonials</p>
      <h2 class="h3 mb-2 text-dark">Testimonials from Educators!</h2>
      <p class="text-muted">
        Educators share how the platform helped them get noticed and hired faster.
      </p>
    </div>

    <div class="row g-4">
      <div v-for="item in testimonials" :key="item.name" class="col-md-6 col-xl-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="avatar avatar-md rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-semibold">
              {{ item.initials }}
            </div>
            <div>
              <h3 class="h6 mb-0 text-dark">{{ item.name }}</h3>
              <p class="small text-muted mb-0">{{ item.location }}</p>
            </div>
          </div>
          <p class="text-muted mb-0">“{{ item.quote }}”</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  testimonials: { type: Array, required: true }
});
</script>