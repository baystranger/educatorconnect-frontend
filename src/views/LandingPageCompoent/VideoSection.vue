<template>
  <section id="video" class="py-3 py-lg-4">
    <div class="card border-0 shadow-sm rounded-4 p-4 p-lg-5 section-panel">
      <div class="row g-4 align-items-center">
        <div class="col-lg-7">
          <p class="text-2xs fw-semibold text-uppercase text-primary mb-2">Video profile</p>
          <h2 class="h3 mb-3 text-dark">How to film a video resume that gets you hired</h2>
          <p class="text-muted mb-4">
            A strong introduction helps centres understand your teaching style,
            professionalism, and personality before the first conversation even begins.
          </p>
          <div class="d-grid gap-3">
            <div v-for="tip in tips" :key="tip.title" class="d-flex align-items-start gap-3">
              <span class="avatar avatar-xs rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-semibold">✓</span>
              <div>
                <h3 class="h6 mb-1 text-dark">{{ tip.title }}</h3>
                <p class="small text-muted mb-0">{{ tip.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="card border-0 rounded-4 p-4 bg-primary-subtle">
            <p class="text-2xs fw-semibold text-uppercase text-primary mb-2">Why it matters</p>
            <h3 class="h5 text-dark mb-3">Stand out with a polished profile and short introduction.</h3>
            <p class="text-muted mb-4">
              Candidates who share a clear video resume make a stronger first
              impression and connect faster with hiring centres.
            </p>
            <a href="https://educatorconnect.ca/sign-up" class="btn btn-primary rounded-pill px-4">Create an account</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  tips: { type: Array, required: true }
});
</script>