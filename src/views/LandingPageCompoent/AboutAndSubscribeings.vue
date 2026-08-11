<template>
  <div>
    <!-- About Section -->
    <section id="about" class="py-3 py-lg-4">
      <div class="card border-0 shadow-sm rounded-4 p-4 p-lg-5">
        <div class="row g-4 align-items-center">
          <div class="col-lg-7">
            <p class="text-2xs fw-semibold text-uppercase text-primary mb-2">About EducatorConnect</p>
            <h2 class="h3 mb-3 text-dark">
              A trusted place for educators, centres, and professional development.
            </h2>
            <p class="text-muted mb-0">
              From job discovery and professional growth to industry events and networking,
              the platform brings the early learning community together in one welcoming space.
            </p>
          </div>
          <div class="col-lg-5">
            <div class="row g-3">
              <div v-for="stat in stats" :key="stat.label" class="col-6">
                <div class="card border shadow-none rounded-4 p-3 h-100">
                  <h3 class="h4 mb-1 text-dark">{{ stat.value }}</h3>
                  <p class="small text-muted mb-0">{{ stat.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Subscribe Section -->
    <section id="subscribe" class="py-3 py-lg-4">
      <div class="card border-0 shadow-lg rounded-5 bg-primary text-white p-4 p-lg-5">
        <div class="row g-4 align-items-center">
          <div class="col-lg-7">
            <p class="text-2xs fw-semibold text-uppercase text-white mb-2">Subscribe</p>
            <h2 class="h3 mb-3 text-white">Subscribe for early access and exclusive benefits</h2>
            <p class="text-white mb-0">
              Stay updated on the latest jobs, events, and professional development opportunities.
            </p>
          </div>
          <div class="col-lg-5">
            <form class="row g-3">
              <div class="col-12">
                <input type="text" class="form-control rounded-pill" placeholder="Your first name" />
              </div>
              <div class="col-12">
                <input type="email" class="form-control rounded-pill" placeholder="Email address" />
              </div>
              <div class="col-12">
                <button type="button" class="btn btn-light rounded-pill px-4">Subscribe</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
defineProps({
  stats: { type: Array, required: true }
});
</script>