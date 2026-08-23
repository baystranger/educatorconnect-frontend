<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // The original GXON dashboard uses ApexCharts/Chart.js.
  // Keep the theme libraries loaded in index.html/main.js, then initialize
  // the chart here or replace this with your API-driven chart config.
});
</script>

<template>
<div class="col-lg-7">
<div class="card">
<div class="card-header d-flex align-items-center justify-content-between border-0 pb-0">
<h6 class="card-title mb-0">Attendance Rate</h6>
<a class="btn btn-sm btn-outline-light waves-effect btn-shadow" href="#">Download Report</a>
</div>
<div class="card-body px-1 py-2">
<div id="chartAttendanceRate"></div>
</div>
</div>
</div>
</template>
