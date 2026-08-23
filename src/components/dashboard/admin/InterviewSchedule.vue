<script setup>
import userAvatar from "../../../assets/images/avatar/avatar1.webp";
import userAvatar2 from "../../../assets/images/avatar/avatar2.webp";
import userAvatar3 from "../../../assets/images/avatar/avatar3.webp";
import userAvatar4 from "../../../assets/images/avatar/avatar4.webp";

</script>

<template>
  <div class="col-xxl-7">
    <div class="card bg-gray bg-opacity-10 border-0 shadow-none">
      <div
        class="card-header d-flex flex-wrap gap-3 align-items-center justify-content-between border-0 pb-0"
      >
        <h6 class="card-title mb-0">Interview Schedule</h6>
        <div class="clearfix d-flex align-items-center">
          <a class="btn-link me-4" href="#">View All</a>
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
      </div>
      <div class="card-body px-3 pb-2">
        <div class="row gy-2">
          <div class="col-md-6">
            <ul class="list-group list-group-smooth list-group-unlined">
              <li
                class="list-group-item d-flex justify-content-between align-items-center mb-2"
              >
                <div class="avatar rounded-circle me-1">
                  <img alt="" :src="userAvatar" />
                </div>
                <div class="ms-2 me-auto">
                  <h6 class="mb-0">William Johnson</h6>
                  <small class="text-body">Web Designer</small>
                </div>
                <span class="badge badge-lg bg-danger-subtle text-danger"
                  >12.30 PM</span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center mb-2"
              >
                <div class="avatar rounded-circle me-1">
                  <img alt="" :src="userAvatar2" />
                </div>
                <div class="ms-2 me-auto">
                  <h6 class="mb-0">Alexander Brown</h6>
                  <small class="text-body">Front-End Developer</small>
                </div>
                <span class="badge badge-lg bg-primary-subtle text-primary"
                  >24 July 2024</span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center mb-2"
              >
                <div class="avatar rounded-circle me-1">
                  <img alt="" :src="userAvatar3" />
                </div>
                <div class="ms-2 me-auto">
                  <h6 class="mb-0">Michael Davis</h6>
                  <small class="text-body">UI/UX Designer</small>
                </div>
                <span class="badge badge-lg bg-secondary-subtle text-secondary"
                  >11.00 AM</span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center mb-2"
              >
                <div class="avatar rounded-circle me-1">
                  <img alt="" :src="userAvatar4" />
                </div>
                <div class="ms-2 me-auto">
                  <h6 class="mb-0">David Wilson</h6>
                  <small class="text-body">Back-End Developer</small>
                </div>
                <span class="badge badge-lg bg-success-subtle text-success"
                  >12.30 PM</span
                >
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <ul class="list-group list-group-smooth list-group-unlined">
              <li
                class="list-group-item d-flex justify-content-between align-items-center mb-2"
              >
                <div class="avatar rounded-circle me-1">
                  <img alt="" :src="userAvatar4" />
                </div>
                <div class="ms-2 me-auto">
                  <h6 class="mb-0">David Wilson</h6>
                  <small class="text-body">Back-End Developer</small>
                </div>
                <span class="badge badge-lg bg-success-subtle text-success"
                  >12.30 - 02.30</span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center mb-2"
              >
                <div class="avatar rounded-circle me-1">
                  <img alt="" :src="userAvatar" />
                </div>
                <div class="ms-2 me-auto">
                  <h6 class="mb-0">William Johnson</h6>
                  <small class="text-body">Web Designer</small>
                </div>
                <span class="badge badge-lg bg-secondary-subtle text-secondary"
                  >10.30 AM</span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center mb-2"
              >
                <div class="avatar rounded-circle me-1">
                  <img alt="" :src="userAvatar2" />
                </div>
                <div class="ms-2 me-auto">
                  <h6 class="mb-0">Alexander Brown</h6>
                  <small class="text-body">Front-End Developer</small>
                </div>
                <span class="badge badge-lg bg-primary-subtle text-primary"
                  >24 July 2024</span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center mb-2"
              >
                <div class="avatar rounded-circle me-1">
                  <img alt="" :src="userAvatar3" />
                </div>
                <div class="ms-2 me-auto">
                  <h6 class="mb-0">Michael Davis</h6>
                  <small class="text-body">UI/UX Designer</small>
                </div>
                <span class="badge badge-lg bg-secondary-subtle text-secondary"
                  >25 Dec 2024</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
