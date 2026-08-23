<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // The original GXON dashboard uses ApexCharts/Chart.js.
  // Keep the theme libraries loaded in index.html/main.js, then initialize
  // the chart here or replace this with your API-driven chart config.
});
</script>

<template>
<div class="col-xxl-5 col-lg-6">
<div class="card">
<div class="card-header d-flex align-items-center justify-content-between border-0 pb-0">
<h6 class="card-title mb-0">Company Pay</h6>
<select class="selectpicker" data-style="btn-sm btn-outline-light btn-shadow waves-effect">
<option value="pending">2024</option>
<option>2023</option>
<option>2022</option>
<option>2021</option>
</select>
</div>
<div class="card-body">
<div class="row align-items-center">
<div class="col-sm-6">
<div class="maxw-250px ratio ratio-1x1">
<canvas id="companyPayChart"></canvas>
</div>
</div>
<div class="col-sm-6">
<div class="d-grid gap-2">
<div class="d-flex gap-1 align-items-center mx-1">
<i class="fa fa-circle text-danger text-2xs me-1"></i>
<strong class="text-dark fw-semibold">15%</strong> Salary
                      </div>
<div class="d-flex gap-1 align-items-center mx-1">
<i class="fa fa-circle text-success text-2xs me-1"></i>
<strong class="text-dark fw-semibold">08%</strong> Bonus
                      </div>
<div class="d-flex gap-1 align-items-center mx-1">
<i class="fa fa-circle text-info text-2xs me-1"></i>
<strong class="text-dark fw-semibold">20%</strong> Commission
                      </div>
<div class="d-flex gap-1 align-items-center mx-1">
<i class="fa fa-circle text-secondary text-2xs me-1"></i>
<strong class="text-dark fw-semibold">11%</strong> Overtime
                      </div>
<div class="d-flex gap-1 align-items-center mx-1">
<i class="fa fa-circle text-primary text-2xs me-1"></i>
<strong class="text-dark fw-semibold">28%</strong> Reimbursement
                      </div>
<div class="d-flex gap-1 align-items-center mx-1">
<i class="fa fa-circle text-warning text-2xs me-1"></i>
<strong class="text-dark fw-semibold">18%</strong> Benefits
                      </div>
</div>
</div>
</div>
</div>
<div class="card-footer">
<div class="row gy-3 align-items-center">
<div class="col-sm-6">
<p class="mb-0">2024 Download Report Company Trends and Insights</p>
</div>
<div class="col-sm-6 text-sm-end">
<button class="btn btn-primary waves-effect waves-light" type="button">
<i class="fi fi-rr-download me-1"></i> Download Report
                    </button>
</div>
</div>
</div>
</div>
</div>
</template>
