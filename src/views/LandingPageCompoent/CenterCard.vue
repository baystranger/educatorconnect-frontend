<template>   
      <div class="row g-4 align-items-center">
        
        <!-- Left Column: Marketing / Content -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-lg rounded-4 p-4 p-lg-5 bg-white text-dark">
            <span class="badge rounded-pill bg-primary-subtle text-primary fw-semibold w-fit mb-3">
              For childcare centres
            </span>
            
            <h2 class="display-6 fw-bold mb-3">
              Turn your centre profile into a place people can trust.
            </h2>
            
            <p class="text-muted lead fs-6 mb-4">
              Show families and educators what makes your centre special while managing recruitment and incoming interest from one unified dashboard.
            </p>

            <!-- Feature List -->
            <div class="d-flex flex-column gap-3 mb-4">
              <div 
                v-for="(feature, index) in features" 
                :key="index" 
                class="d-flex align-items-start gap-3"
              >
                <span class="avatar avatar-xs rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-semibold flex-shrink-0 mt-1">
                  ✓
                </span>
                <div>
                  <strong class="d-block text-dark fw-bold mb-1">{{ feature.title }}</strong>
                  <p class="text-muted small mb-0">{{ feature.description }}</p>
                </div>
              </div>
            </div>

            <!-- CTA Button -->
            <div>
              <a class="btn btn-primary btn-lg rounded-pill px-4 fw-semibold fs-6" href="#join">
                Create your centre profile →
              </a>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Dashboard Mockup -->
        <div class="col-lg-6">
          <div class="dashboard-preview card border-0 shadow-lg rounded-4 p-4 text-white">
            
            <!-- Dashboard Header -->
            <div class="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom border-primary border-opacity-25">
              <div>
                <span class="badge rounded-pill bg-success-subtle text-success small mb-1">Live Dashboard</span>
                <h3 class="h5 fw-bold mb-0 text-white">Centre Overview</h3>
              </div>
              <div class="text-end">
                <span class="small text-muted d-block">Today</span>
                <span class="badge bg-primary text-balck rounded-pill">Sunshine Early Learning</span>
              </div>
            </div>

            <!-- Dashboard Stats Cards -->
            <div class="row g-3 mb-4">
              <!-- Views Stat -->
              <div class="col-12">
                <div class="p-3 rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-10">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="small text-muted fw-medium">Profile Views</span>
                    <span class="small text-success fw-semibold">↑ +18.4% this month</span>
                  </div>
                  <div class="fs-2 fw-bold text-black mb-2">{{ dashboardStats.views.toLocaleString() }}</div>
                  <div class="progress" style="height: 6px;">
                    <div class="progress-bar bg-primary" role="progressbar" style="width: 78%;" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              </div>

              <!-- Quick Metrics -->
              <div class="col-6">
                <div class="p-3 rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-10 text-center">
                  <span class="small text-muted d-block mb-1">Open Positions</span>
                  <span class="fs-3 fw-bold text-black">{{ dashboardStats.openPositions }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-10 text-center">
                  <span class="small text-muted d-block mb-1">Parent Inquiries</span>
                  <span class="fs-3 fw-bold text-warning">{{ dashboardStats.parentInquiries }}</span>
                </div>
              </div>
            </div>

            <!-- Recent Activity Tabs & List -->
            <div class="rounded-3 p-3 bg-primary bg-opacity-10 border border-primary border-opacity-10">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="small fw-bold text-uppercase text-muted mb-0">Recent Applications</h4>
                <a href="#applications" class="small text-primary text-decoration-none">View All</a>
              </div>

              <!-- Job Application Rows -->
              <div class="d-flex flex-column gap-2">
                <div 
                  v-for="(app, idx) in recentApplications" 
                  :key="idx"
                  class="d-flex justify-content-between align-items-center p-2 rounded bg-dark bg-opacity-50 border border-secondary border-opacity-10"
                >
                  <div class="d-flex align-items-center gap-2">
                    <span class="avatar avatar-xs rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold small">
                      {{ app.candidate[0] }}
                    </span>
                    <div>
                      <p class="small fw-semibold text-white mb-0">{{ app.role }}</p>
                      <span class="text-2xs text-primary">{{ app.candidate }} • {{ app.time }}</span>
                    </div>
                  </div>
                  <span class="badge rounded-pill" :class="app.statusClass">
                    {{ app.status }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>      
</template>

<script setup>
import { ref } from 'vue';

// Marketing features
const features = ref([
  {
    title: 'Tell your story',
    description: 'Programs, philosophy, facilities, team, gallery, and a welcome video.'
  },
  {
    title: 'Recruit with confidence',
    description: 'Post jobs, review educator profiles, and track applicants through the hiring process.'
  },
  {
    title: 'Connect with families',
    description: 'Receive inquiries, tour requests, and waitlist requests directly in your dashboard.'
  },
  {
    title: 'Support practicum placements',
    description: 'Advertise practicum opportunities and specify programs, institutions, and intake details.'
  }
]);

// Dashboard Data Metrics
const dashboardStats = ref({
  views: 1284,
  openPositions: '06',
  parentInquiries: 24
});

// Recent Applications Stream
const recentApplications = ref([
  {
    role: 'ECE Lead Educator',
    candidate: 'Sarah M.',
    time: '2h ago',
    status: 'New',
    statusClass: 'bg-primary-subtle text-primary'
  },
  {
    role: 'Assistant Educator',
    candidate: 'David L.',
    time: '5h ago',
    status: 'Reviewed',
    statusClass: 'bg-info-subtle text-info'
  },
  {
    role: 'Practicum Student',
    candidate: 'Emma W.',
    time: '1d ago',
    status: 'Scheduled',
    statusClass: 'bg-success-subtle text-success'
  }
]);
</script>

<style scoped>
.w-fit {
  width: fit-content;
}

.text-2xs {
  font-size: 0.75rem;
}

.avatar-xs {
  width: 28px;
  height: 28px;
  font-size: 12px;
}

.dashboard-preview {
  box-shadow: 0 20px 40px rgba(9, 4, 12, 0.863);
}
</style>