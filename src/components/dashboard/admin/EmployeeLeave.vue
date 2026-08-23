<script setup>
import { ref } from 'vue';
const statuses = ref({});
const setStatus = (key, value) => { statuses.value[key] = value; };
</script>

<template>
<div class="col-xxl-8 col-lg-7">
<div class="card overflow-hidden">
<div class="card-header d-flex flex-wrap gap-3 align-items-center justify-content-between border-0 pb-0">
<h6 class="card-title mb-0">Employee&rsquo;s Leave</h6>
<div id="dt_EmployeeLeave_Search"></div>
</div>
<div class="card-body px-3 pt-2 pb-0 gradient-layer">
<table class="table display table-row-rounded" id="dt_EmployeeLeave">
<thead class="table-light">
<tr>
<th class="minw-150px">Name</th>
<th class="minw-200px">Department</th>
<th class="minw-150px">Days</th>
<th class="minw-150px">Date</th>
<th>Status</th>
</tr>
</thead>
<tbody>
<tr>
<td>William Johnson</td>
<td>Back-End Developer</td>
<td>2 Days</td>
<td>12 July 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" data-selected="true" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Benjamin Martinez</td>
<td>Full-Stack Developer</td>
<td>1st Half Day</td>
<td>03 July 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" data-selected="true" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Alexander Brown</td>
<td>Mobile App Developer</td>
<td>4 Days</td>
<td>27 July 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" data-selected="true" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Michael Davis</td>
<td>UI/UX Designer</td>
<td>2nd Half Day</td>
<td>05 June 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" data-selected="true" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>David Wilson</td>
<td>DevOps Engineer</td>
<td>1 Days</td>
<td>04 Aug 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" data-selected="true" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Brielle Williamson</td>
<td>Back-End Developer</td>
<td>2 Days</td>
<td>12 July 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" data-selected="true" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Herrod Chandler</td>
<td>Full-Stack Developer</td>
<td>1st Half Day</td>
<td>03 July 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" data-selected="true" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Rhona Davidson</td>
<td>Mobile App Developer</td>
<td>4 Days</td>
<td>27 July 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" data-selected="true" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Colleen Hurst</td>
<td>UI/UX Designer</td>
<td>2nd Half Day</td>
<td>27 July 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" data-selected="true" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Sonya Frost</td>
<td>DevOps Engineer</td>
<td>1 Days</td>
<td>04 Aug 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" data-selected="true" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Jena Gaines</td>
<td>Back-End Developer</td>
<td>2 Days</td>
<td>12 July 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" data-selected="true" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Quinn Flynn</td>
<td>Full-Stack Developer</td>
<td>1st Half Day</td>
<td>03 July 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" data-selected="true" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Charde Marshall</td>
<td>Mobile App Developer</td>
<td>4 Days</td>
<td>27 July 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" data-selected="true" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Haley Kennedy</td>
<td>UI/UX Designer</td>
<td>2nd Half Day</td>
<td>05 June 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" data-selected="true" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Tatyana Fitzpatrick</td>
<td>DevOps Engineer</td>
<td>1 Days</td>
<td>04 Aug 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" data-selected="true" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Michael Silva</td>
<td>Back-End Developer</td>
<td>2 Days</td>
<td>12 July 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" data-selected="true" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Paul Byrd</td>
<td>Full-Stack Developer</td>
<td>1st Half Day</td>
<td>03 July 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" data-selected="true" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Gloria Little</td>
<td>Mobile App Developer</td>
<td>4 Days</td>
<td>27 July 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" data-selected="true" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Bradley Greer</td>
<td>UI/UX Designer</td>
<td>2nd Half Day</td>
<td>05 June 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" data-selected="true" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
<tr>
<td>Dai Rios</td>
<td>DevOps Engineer</td>
<td>1 Days</td>
<td>04 Aug 2024</td>
<td>
<div class="dropdown select-status">
<button aria-expanded="false" class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" type="button">
                            Select Status
                          </button>
<ul class="dropdown-menu dropdown-menu-end">
<li>
<a class="dropdown-item" data-class="btn-outline-light" href="#">Pending</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-primary" data-selected="true" href="#">Approved</a>
</li>
<li>
<a class="dropdown-item" data-class="btn-subtle-secondary" href="#">Rejected</a>
</li>
</ul>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</template>
