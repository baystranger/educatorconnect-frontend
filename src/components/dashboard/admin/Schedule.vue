<script setup>
import GoogleMeet from '../../../assets/images/icons/google-meet.svg';

</script>

<template>
  <div class="col-xxl-6">
    <div class="card-group overflow-hidden">
      <div class="card">
        <div
          class="card-header d-flex align-items-center justify-content-between border-0 pb-0"
        >
          <h6 class="card-title mb-0">Schedule</h6>
          <button
            class="btn btn-sm btn-outline-light btn-shadow waves-effect text-primary ms-3"
            type="button"
          >
            <i class="fi fi-rr-plus text-2xs me-1"></i> Create New
          </button>
        </div>
        <div class="card-body p-3">
          <input
            class="form-control d-none flatpickr-inline-custom"
            id="dateTimeFlatpickr"
            placeholder="Select Date.."
            type="text"
          />
        </div>
      </div>
      <div class="card">
        <div
          class="card-body gradient-layer"
          data-simplebar=""
          style="height: 325px"
        >
          <div class="p-3 bg-light bg-opacity-50 mb-2 rounded">
            <div class="d-flex align-items-center justify-content-between">
              <h6 class="mb-0">Team Stand Up</h6>
              <div class="clearfix d-flex align-items-center">
                <div class="btn-group">
                  <button
                    aria-expanded="false"
                    class="btn btn-action-dark btn-sm btn-icon waves-effect dropdown-toggle"
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
              </div>
            </div>
            <div class="text-2xs d-flex gap-1 align-items-center">
              <img alt="" :src="GoogleMeet" />
              <span>On Google Meet</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="badge bg-white text-black fw-semibold"
                >Marketing</span
              >
              <span
                class="text-primary text-2xs fw-semibold d-flex align-items-center"
              >
                <i class="fi fi-rr-clock-three me-1"></i> 06:00 - 07:00
              </span>
            </div>
          </div>
          <div class="p-3 bg-light bg-opacity-50 mb-2 rounded">
            <div class="d-flex align-items-center justify-content-between">
              <h6 class="mb-0">All Hands Meeting</h6>
              <div class="clearfix d-flex align-items-center">
                <div class="btn-group">
                  <button
                    aria-expanded="false"
                    aria-label="Meeting options menu"
                    class="btn btn-action-dark btn-sm btn-icon waves-effect dropdown-toggle"
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
              </div>
            </div>
            <div class="text-2xs d-flex gap-1 align-items-center">
              <img alt="" :src="GoogleMeet" />
              <span>On Google Meet</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="badge bg-white text-black fw-semibold">Manager</span>
              <span
                class="text-primary text-2xs fw-semibold d-flex align-items-center"
              >
                <i class="fi fi-rr-clock-three me-1"></i> 06:00 - 07:00
              </span>
            </div>
          </div>
          <div class="p-3 bg-light bg-opacity-50 mb-2 rounded">
            <div class="d-flex align-items-center justify-content-between">
              <h6 class="mb-0">Sprint Planning</h6>
              <div class="clearfix d-flex align-items-center">
                <div class="btn-group">
                  <button
                    aria-expanded="false"
                    class="btn btn-action-dark btn-sm btn-icon waves-effect dropdown-toggle"
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
              </div>
            </div>
            <div class="text-2xs d-flex gap-1 align-items-center">
              <img alt="" :src="GoogleMeet" />
              <span>On Google Meet</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="badge bg-white text-black fw-semibold">HR</span>
              <span
                class="text-primary text-2xs fw-semibold d-flex align-items-center"
              >
                <i class="fi fi-rr-clock-three me-1"></i> 06:00 - 07:00
              </span>
            </div>
          </div>
          <div class="p-3 bg-light bg-opacity-50 mb-2 rounded">
            <div class="d-flex align-items-center justify-content-between">
              <h6 class="mb-0">Team Stand Up</h6>
              <div class="clearfix d-flex align-items-center">
                <div class="btn-group">
                  <button
                    aria-expanded="false"
                    class="btn btn-action-dark btn-sm btn-icon waves-effect dropdown-toggle"
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
              </div>
            </div>
            <div class="text-2xs d-flex gap-1 align-items-center">
              <img alt="" :src="GoogleMeet" />
              <span>On Google Meet</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="badge bg-white text-black fw-semibold"
                >Marketing</span
              >
              <span
                class="text-primary text-2xs fw-semibold d-flex align-items-center"
              >
                <i class="fi fi-rr-clock-three me-1"></i> 06:00 - 07:00
              </span>
            </div>
          </div>
          <div class="p-3 bg-light bg-opacity-50 mb-2 rounded">
            <div class="d-flex align-items-center justify-content-between">
              <h6 class="mb-0">All Hands Meeting</h6>
              <div class="clearfix d-flex align-items-center">
                <div class="btn-group">
                  <button
                    aria-expanded="false"
                    class="btn btn-action-dark btn-sm btn-icon waves-effect dropdown-toggle"
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
              </div>
            </div>
            <div class="text-2xs d-flex gap-1 align-items-center">
              <img alt="" :src="GoogleMeet" />
              <span>On Google Meet</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="badge bg-white text-black fw-semibold">Manager</span>
              <span
                class="text-primary text-2xs fw-semibold d-flex align-items-center"
              >
                <i class="fi fi-rr-clock-three me-1"></i> 06:00 - 07:00
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
