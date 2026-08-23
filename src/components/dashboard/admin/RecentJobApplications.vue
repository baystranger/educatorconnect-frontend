<script setup>
import { ref } from "vue";
import userAvatar from '../../../assets/images/avatar/avatar1.webp';
import userAvatar2 from '../../../assets/images/avatar/avatar2.webp';
import userAvatar3 from '../../../assets/images/avatar/avatar3.webp';
import userAvatar4 from '../../../assets/images/avatar/avatar4.webp';
import userAvatar5 from '../../../assets/images/avatar/avatar5.webp';

const statuses = ref({});
const setStatus = (key, value) => {
  statuses.value[key] = value;
};
</script>

<template>
  <div class="col-xxl-4 col-lg-5">
    <div class="card">
      <div
        class="card-header d-flex align-items-center justify-content-between border-0 pb-0"
      >
        <h6 class="card-title mb-0">Recent Job Application</h6>
        <a class="btn-link" href="recruitment.html">View All</a>
      </div>
      <div class="card-body pb-3">
        <ul
          class="list-group list-group-hover list-group-smooth list-group-unlined list-group-outer"
        >
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="avatar rounded-circle me-1">
              <img alt="" :src="userAvatar" />
            </div>
            <div class="ms-2 me-auto">
              <h6 class="mb-0">Sophia Hall</h6>
              <small>Front-End Developer</small>
            </div>
            <div class="dropdown select-status">
              <button
                aria-expanded="false"
                class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light"
                data-bs-toggle="dropdown"
                type="button"
              >
                Select Status
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-outline-light"
                    data-selected="true"
                    href="#"
                    >Pending</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-subtle-primary"
                    href="#"
                    >Approved</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-subtle-secondary"
                    href="#"
                    >Rejected</a
                  >
                </li>
              </ul>
            </div>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="avatar rounded-circle me-1">
              <img alt="" :src="userAvatar2" />
            </div>
            <div class="ms-2 me-auto">
              <h6 class="mb-0">Emma Smith</h6>
              <small>Back-End Developer</small>
            </div>
            <div class="dropdown select-status">
              <button
                aria-expanded="false"
                class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light"
                data-bs-toggle="dropdown"
                type="button"
              >
                Select Status
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-outline-light"
                    href="#"
                    >Pending</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-subtle-primary"
                    data-selected="true"
                    href="#"
                    >Approved</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-subtle-secondary"
                    href="#"
                    >Rejected</a
                  >
                </li>
              </ul>
            </div>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="avatar rounded-circle me-1">
              <img alt="" :src="userAvatar3" />
            </div>
            <div class="ms-2 me-auto">
              <h6 class="mb-0">Olivia Clark</h6>
              <small>UI/UX Designer</small>
            </div>
            <div class="dropdown select-status">
              <button
                aria-expanded="false"
                class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light"
                data-bs-toggle="dropdown"
                type="button"
              >
                Select Status
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-outline-light"
                    href="#"
                    >Pending</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-subtle-primary"
                    href="#"
                    >Approved</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-subtle-secondary"
                    data-selected="true"
                    href="#"
                    >Rejected</a
                  >
                </li>
              </ul>
            </div>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="avatar rounded-circle me-1">
              <img alt="" :src="userAvatar4" />
            </div>
            <div class="ms-2 me-auto">
              <h6 class="mb-0">Ava Lewis</h6>
              <small>Web Designer</small>
            </div>
            <div class="dropdown select-status">
              <button
                aria-expanded="false"
                class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light"
                data-bs-toggle="dropdown"
                type="button"
              >
                Select Status
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-outline-light"
                    data-selected="true"
                    href="#"
                    >Pending</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-subtle-primary"
                    href="#"
                    >Approved</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-subtle-secondary"
                    href="#"
                    >Rejected</a
                  >
                </li>
              </ul>
            </div>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="avatar rounded-circle me-1">
              <img alt="" :src="userAvatar5" />
            </div>
            <div class="ms-2 me-auto">
              <h6 class="mb-0">Isabella Walker</h6>
              <small>Full-Stack Developer</small>
            </div>
            <div class="dropdown select-status">
              <button
                aria-expanded="false"
                class="btn btn-sm btn-secondary btn-sm dropdown-toggle waves-effect waves-light"
                data-bs-toggle="dropdown"
                type="button"
              >
                Select Status
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-outline-light"
                    href="#"
                    >Pending</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-subtle-primary"
                    data-selected="true"
                    href="#"
                    >Approved</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    data-class="btn-subtle-secondary"
                    href="#"
                    >Rejected</a
                  >
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
