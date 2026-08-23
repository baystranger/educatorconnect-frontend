<script setup>
import DashboardStats from "../admin/DashboardStats.vue";
import CreateAnnouncement from "../admin/CreateAnnouncement.vue";
import EmployeeStructure from "../admin/EmployeeStructure.vue";
import CompanyPay from "../admin/CompanyPay.vue";
import RecentJobApplications from "../admin/RecentJobApplications.vue";
import EmployeeLeave from "../admin/EmployeeLeave.vue";
import EmployeeType from "../admin/EmployeeType.vue";
import TeamOverview from "../admin/TeamOverview.vue";
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
      <div class="clearfix">
        <h1 class="app-page-title">Dashboard</h1>
        <span>Mon, Aug 01, 2024 - Sep 01, 2024 </span>
      </div>
      <button
        class="btn btn-primary waves-effect waves-light"
        data-bs-target="#addEmployeeModal"
        data-bs-toggle="modal"
        type="button"
      >
        <i class="fi fi-rr-plus me-1"></i> Add Employee
      </button>
    </div>

    <div class="row">
      <DashboardStats />

      <CreateAnnouncement />

      <EmployeeStructure />

      <CompanyPay />

      <RecentJobApplications />

      <EmployeeLeave />

      <EmployeeType />

      <TeamOverview />

      <Schedule />

      <EmployeePerformance />

      <AttendanceRate />

      <InterviewSchedule />

      <TaskUpdate />
    </div>
  </div>
</template>
