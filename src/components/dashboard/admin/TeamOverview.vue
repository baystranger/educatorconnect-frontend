<script setup>
// /assets/images/avatar/avatar1.webp

import userAvatar from "../../../assets/images/avatar/avatar1.webp";
import userAvatar2 from "../../../assets/images/avatar/avatar2.webp";
import userAvatar3 from "../../../assets/images/avatar/avatar3.webp";
import userAvatar4 from "../../../assets/images/avatar/avatar4.webp";
import userAvatar5 from "../../../assets/images/avatar/avatar5.webp";


</script>

<template>
  <div class="col-xxl-3 col-md-6">
    <div class="card">
      <div
        class="card-header d-flex align-items-center justify-content-between border-0 pb-0"
      >
        <h6 class="card-title mb-0">Team</h6>
        <div class="clearfix">
          <a class="btn-link" href="extended-ui/team.html">View All</a>
        </div>
      </div>
      <div class="card-body px-3 pb-3">
        <ul
          class="list-group list-group-hover list-group-smooth list-group-space-sm"
        >
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="me-auto">
              <h6 class="mb-0">Marketing</h6>
              <small class="fw-medium text-body d-block"
                >Member <span class="text-primary">03</span>
              </small>
            </div>
            <div class="avatar-group">
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar" />
              </div>
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar2" />
              </div>
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar3" />
              </div>
            </div>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="me-auto">
              <h6 class="mb-0">Development</h6>
              <small class="fw-medium text-body d-block"
                >Member <span class="text-secondary">40</span>
              </small>
            </div>
            <div class="avatar-group">
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar4" />
              </div>
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar5" />
              </div>
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar" />
              </div>
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar2" />
              </div>
            </div>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="me-auto">
              <h6 class="mb-0">Designing Team</h6>
              <small class="fw-medium text-body d-block"
                >Member <span class="text-suc">03</span>
              </small>
            </div>
            <div class="avatar-group">
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar3" />
              </div>
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar4" />
              </div>
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar5" />
              </div>
            </div>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="me-auto">
              <h6 class="mb-0">Management</h6>
              <small class="fw-medium text-body d-block"
                >Member <span class="text-primary">02</span>
              </small>
            </div>
            <div class="avatar-group">
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar" />
              </div>
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar2" />
              </div>
            </div>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="me-auto">
              <h6 class="mb-0">Finance</h6>
              <small class="fw-medium text-body d-block"
                >Member <span class="text-primary">12</span>
              </small>
            </div>
            <div class="avatar-group">
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar5" />
              </div>
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar4" />
              </div>
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar3" />
              </div>
              <div
                class="avatar avatar-xs rounded-circle border border-2 border-white"
              >
                <img alt="" :src="userAvatar2" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
