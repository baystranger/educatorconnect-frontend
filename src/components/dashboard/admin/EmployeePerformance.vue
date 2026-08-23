<script setup>
import { onMounted } from "vue";

import userAvatar from "../../../assets/images/avatar/avatar1.webp";
import userAvatar2 from "../../../assets/images/avatar/avatar2.webp";
import userAvatar3 from "../../../assets/images/avatar/avatar3.webp";
import userAvatar4 from "../../../assets/images/avatar/avatar4.webp";

onMounted(() => {
  // The original GXON dashboard uses ApexCharts/Chart.js.
  // Keep the theme libraries loaded in index.html/main.js, then initialize
  // the chart here or replace this with your API-driven chart config.
});
</script>

<template>
  <div class="col-lg-5">
    <div class="card">
      <div
        class="card-header d-flex align-items-center justify-content-between border-0"
      >
        <h6 class="card-title mb-0">Employee Performance</h6>
        <div class="dropdown">
          <button
            aria-expanded="false"
            class="btn dropdown-toggle btn-white btn-shadow waves-effect btn-sm"
            data-bs-toggle="dropdown"
            type="button"
          >
            Last Month
          </button>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="#">Last Month</a>
            </li>
            <li>
              <a class="dropdown-item" href="#">Category</a>
            </li>
            <li>
              <a class="dropdown-item" href="#">Published</a>
            </li>
            <li>
              <a class="dropdown-item" href="#">Date Modifed</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="card-body px-2 pb-2 pt-0">
        <table class="table table-sm table-borderless table-row-rounded mb-0">
          <thead class="table-light">
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th class="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar rounded-circle">
                    <img alt="" :src="userAvatar" />
                  </div>
                  <div class="ms-2 me-auto">
                    <h6 class="mb-0">Olivia Clark</h6>
                    <small class="text-body">UI/UX Designer</small>
                  </div>
                </div>
              </td>
              <td>
                <div id="employeeScore1"></div>
              </td>
              <td>
                <div class="btn-group float-end">
                  <button
                    aria-expanded="false"
                    class="btn btn-white btn-sm btn-shadow btn-icon waves-effect dropdown-toggle"
                    data-bs-toggle="dropdown"
                    type="button"
                  >
                    <i class="fi fi-rr-menu-dots"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item" href="#">Edit</a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">Delete</a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar rounded-circle">
                    <img alt="" :src="userAvatar2" />
                  </div>
                  <div class="ms-2 me-auto">
                    <h6 class="mb-0">Michael Davis</h6>
                    <small class="text-body">Full-Stack Developer</small>
                  </div>
                </div>
              </td>
              <td>
                <div id="employeeScore2"></div>
              </td>
              <td>
                <div class="btn-group float-end">
                  <button
                    aria-expanded="false"
                    class="btn btn-white btn-sm btn-shadow btn-icon waves-effect dropdown-toggle"
                    data-bs-toggle="dropdown"
                    type="button"
                  >
                    <i class="fi fi-rr-menu-dots"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item" href="#">Edit</a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">Delete</a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar rounded-circle">
                    <img alt="" :src="userAvatar3" />
                  </div>
                  <div class="ms-2 me-auto">
                    <h6 class="mb-0">Michael Davis</h6>
                    <small class="text-body">Web Designer</small>
                  </div>
                </div>
              </td>
              <td>
                <div id="employeeScore3"></div>
              </td>
              <td>
                <div class="btn-group float-end">
                  <button
                    aria-expanded="false"
                    class="btn btn-white btn-sm btn-shadow btn-icon waves-effect dropdown-toggle"
                    data-bs-toggle="dropdown"
                    type="button"
                  >
                    <i class="fi fi-rr-menu-dots"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item" href="#">Edit</a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">Delete</a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar rounded-circle">
                    <img alt="" :src="userAvatar4" />
                  </div>
                  <div class="ms-2 me-auto">
                    <h6 class="mb-0">David Wilson</h6>
                    <small class="text-body">Back-End Developer</small>
                  </div>
                </div>
              </td>
              <td>
                <div id="employeeScore4"></div>
              </td>
              <td>
                <div class="btn-group float-end">
                  <button
                    aria-expanded="false"
                    class="btn btn-white btn-sm btn-shadow btn-icon waves-effect dropdown-toggle"
                    data-bs-toggle="dropdown"
                    type="button"
                  >
                    <i class="fi fi-rr-menu-dots"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item" href="#">Edit</a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">Delete</a>
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
