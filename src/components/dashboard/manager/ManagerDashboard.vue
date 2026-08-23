<script setup>
import DashboardStats from "../admin/DashboardStats.vue";
import CreateAnnouncement from "../admin/CreateAnnouncement.vue";
import EmployeeStructure from "../admin/EmployeeStructure.vue";
import CompanyPay from "../admin/CompanyPay.vue";
import RecentJobApplications from "../admin/RecentJobApplications.vue";
import EmployeeLeave from "../admin/EmployeeLeave.vue";
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
        <h1 class="app-page-title">Manager Dashboard</h1>
        <span>Team overview and daily management</span>
      </div>
    </div>
    <div class="row">
      <DashboardStats />

      <CreateAnnouncement />

      <EmployeeStructure />

      <CompanyPay />

      <RecentJobApplications />

      <EmployeeLeave />

      <Schedule />

      <EmployeePerformance />

      <AttendanceRate />

      <InterviewSchedule />

      <TaskUpdate />
    </div>
  </div>
</template>
