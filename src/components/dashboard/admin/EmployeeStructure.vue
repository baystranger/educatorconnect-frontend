<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // The original GXON dashboard uses ApexCharts/Chart.js.
  // Keep the theme libraries loaded in index.html/main.js, then initialize
  // the chart here or replace this with your API-driven chart config.
});
</script>

<template>
<div class="col-xxl-7 col-lg-6">
<div class="card">
<div class="card-header d-flex align-items-center justify-content-between border-0 pb-0">
<h6 class="card-title mb-0">Employee Structure</h6>
<button class="btn btn-sm btn-outline-light btn-shadow waves-effect" type="button">Download Report</button>
</div>
<div class="card-body p-2">
<div id="chartEmployee"></div>
</div>
</div>
</div>
</template>
