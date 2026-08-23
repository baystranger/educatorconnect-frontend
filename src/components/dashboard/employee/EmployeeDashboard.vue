<script setup>
import Schedule from "../admin/Schedule.vue";
import EmployeePerformance from "../admin/EmployeePerformance.vue";
import AttendanceRate from "../admin/AttendanceRate.vue";
import InterviewSchedule from "../admin/InterviewSchedule.vue";
import TaskUpdate from "../admin/TaskUpdate.vue";
</script>

<template>
  <div class="container">
    <div
      class="app-page-head d-flex flex-wrap gap-3 align-items-center justify-content-between"
    >
      <div>
        <h1 class="app-page-title">My Dashboard</h1>
        <span>My schedule, performance and tasks</span>
      </div>
    </div>
    <div class="row">
      <Schedule />

      <EmployeePerformance />

      <AttendanceRate />

      <InterviewSchedule />

      <TaskUpdate />
    </div>
  </div>
</template>
