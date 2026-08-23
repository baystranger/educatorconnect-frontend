<script setup>
import media1 from '../../../assets/images/media/svg/media1.svg';
</script>

<template>
  <div class="col-xxl-3">
    <div class="card overflow-hidden z-1">
      <div class="card-body">
        <div class="w-75">
          <h6 class="card-title">Create Announcement</h6>
          <p>Make a announcement to your employee</p>
        </div>
        <img
          alt=""
          class="position-absolute bottom-0 end-0 z-n1"
          :src="media1"
        />
      </div>
      <div class="card-footer border-0 pt-0">
        <a
          class="btn btn-outline-light waves-effect btn-shadow"
          href="calendar.html"
          >Create Now</a
        >
      </div>
    </div>
  </div>
</template>
