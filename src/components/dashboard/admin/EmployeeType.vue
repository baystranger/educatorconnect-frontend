<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // The original GXON dashboard uses ApexCharts/Chart.js.
  // Keep the theme libraries loaded in index.html/main.js, then initialize
  // the chart here or replace this with your API-driven chart config.
});
</script>

<template>
<div class="col-xxl-3 col-md-6">
<div class="card">
<div class="card-header d-flex align-items-center justify-content-between border-0 pb-0">
<h6 class="card-title mb-0">Employee Type </h6>
<div class="btn-group">
<button aria-expanded="false" class="btn btn-white btn-sm btn-shadow btn-icon waves-effect dropdown-toggle" data-bs-toggle="dropdown" type="button">
<i class="fi fi-rr-menu-dots"></i>
</button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" href="#">Onsite</a>
</li>
<li>
<a class="dropdown-item" href="#">Remote</a>
</li>
<li>
<a class="dropdown-item" href="#">Hybrid</a>
</li>
</ul>
</div>
</div>
<div class="card-body py-0 px-3 d-flex align-items-center justify-content-center">
<div class="maxw-250px ratio ratio-1x1">
<canvas id="employeeTypeChart"></canvas>
</div>
</div>
<div class="card-footer pt-0 border-0">
<div class="d-flex flex-wrap gap-2 justify-content-center">
<div class="d-flex gap-1 align-items-center mx-1">
<i class="fa fa-circle text-primary text-2xs"></i>
<strong class="text-dark fw-semibold">800</strong> Onsite
                  </div>
<div class="d-flex gap-1 align-items-center mx-1">
<i class="fa fa-circle text-secondary text-2xs"></i>
<strong class="text-dark fw-semibold">105</strong> Remote
                  </div>
<div class="d-flex gap-1 align-items-center mx-1">
<i class="fa fa-circle text-info text-2xs"></i>
<strong class="text-dark fw-semibold">301</strong> Hybrid
                  </div>
</div>
</div>
</div>
</div>
</template>
