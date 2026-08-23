<script setup>
import { computed } from 'vue';

import DashboardHeader from '../../components/dashboard/shared/DashboardHeader.vue';
import SearchModal from '../../components/dashboard/shared/SearchModal.vue';
import DashboardSidebar from '../../components/dashboard/shared/DashboardSidebar.vue';
import DashboardQuickSidebar from '../../components/dashboard/shared/DashboardQuickSidebar.vue';
import DashboardFooter from '../../components/dashboard/shared/DashboardFooter.vue';
import AddEmployeeModal from '../../components/dashboard/shared/AddEmployeeModal.vue';
import TodoTaskModal from '../../components/dashboard/shared/TodoTaskModal.vue';
import AdminDashboard from '../../components/dashboard/admin/AdminDashboard.vue';
import ManagerDashboard from '../../components/dashboard/manager/ManagerDashboard.vue';
import EmployeeDashboard from '../../components/dashboard/employee/EmployeeDashboard.vue';

const props = defineProps({ user: { type: Object, default: null }, role: { type: String, default: '' } });
const currentRole = computed(() => String(props.role || props.user?.role || 'admin').toLowerCase());
const dashboardComponent = computed(() => {
  if (['admin','administrator'].includes(currentRole.value)) return AdminDashboard;
  if (currentRole.value === 'manager') return ManagerDashboard;
  return EmployeeDashboard;
});
</script>

<template>
<div class="page-layout">
  <DashboardHeader :user="user" />
  <SearchModal />
  <DashboardSidebar :user="user" />
  <DashboardQuickSidebar />
  <main class="app-wrapper">
    <component :is="dashboardComponent" :user="user" />
  </main>
  <DashboardFooter />
  <AddEmployeeModal />
  <TodoTaskModal />
</div>
</template>
