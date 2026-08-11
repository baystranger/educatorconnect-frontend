<template>
  <div class="center-page container-xxl py-4">
    <h1 class="mb-3">Center dashboard</h1>

    <div class="row g-4">
      <div class="col-lg-6">
        <div class="card p-4">
          <h2 class="h5">Register as a Centre</h2>
          <p class="text-muted small">Create your centre profile before posting jobs.</p>

          <form @submit.prevent="registerCenter">
            <div class="mb-3">
              <label class="form-label">Centre name</label>
              <input v-model="center.name" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Contact email</label>
              <input v-model="center.email" type="email" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Location</label>
              <input v-model="center.location" class="form-control" />
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-primary" type="submit">Register as Centre</button>
              <button type="button" class="btn btn-outline-secondary" @click="clearRegistration">Clear</button>
            </div>

            <div v-if="registered" class="alert alert-success mt-3">Registered successfully as <strong>{{ registered.name }}</strong>.</div>
          </form>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card p-4">
          <h2 class="h5">Post a Job</h2>
          <p class="text-muted small">Only registered centres can post jobs. If you haven't registered yet, please register first.</p>

          <div v-if="!registered">
            <div class="alert alert-warning">You must register your centre before posting jobs.</div>
            <button class="btn btn-primary" @click="scrollToRegister">Register now</button>
          </div>

          <form v-else @submit.prevent="postJob">
            <div class="mb-3">
              <label class="form-label">Job title</label>
              <input v-model="job.title" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Type</label>
              <input v-model="job.type" class="form-control" placeholder="Full time / Part time" />
            </div>

            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea v-model="job.description" class="form-control" rows="4" required></textarea>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-primary" type="submit">Post job</button>
              <button type="button" class="btn btn-outline-secondary" @click="clearJob">Clear</button>
            </div>

            <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
          </form>

          <hr />
          <h3 class="h6">Your posted jobs</h3>
          <ul class="list-group mt-2">
            <li v-for="(j, idx) in postedJobs" :key="idx" class="list-group-item">
              <strong>{{ j.title }}</strong> — <span class="text-muted">{{ j.type }}</span>
              <div class="small text-muted">{{ j.description }}</div>
            </li>
            <li v-if="postedJobs.length === 0" class="list-group-item text-muted">No jobs posted yet.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const center = ref({ name: '', email: '', location: '' })
const registered = ref(null)
const job = ref({ title: '', type: '', description: '' })
const successMessage = ref('')
const postedJobs = ref([])

function loadFromStorage() {
  try {
    const c = localStorage.getItem('registeredCenter')
    if (c) registered.value = JSON.parse(c)
    const jobs = localStorage.getItem('centerJobs')
    postedJobs.value = jobs ? JSON.parse(jobs) : []
  } catch (e) {
    console.warn('Failed to read localStorage', e)
  }
}

onMounted(() => {
  loadFromStorage()
})

function registerCenter() {
  // simple registration — persist to localStorage
  registered.value = { ...center.value }
  localStorage.setItem('registeredCenter', JSON.stringify(registered.value))
  successMessage.value = 'Centre registered successfully.'
  setTimeout(() => (successMessage.value = ''), 3000)
}

function clearRegistration() {
  center.value = { name: '', email: '', location: '' }
  registered.value = null
  localStorage.removeItem('registeredCenter')
}

function postJob() {
  if (!registered.value) {
    successMessage.value = 'Please register the centre first.'
    return
  }
  const newJob = { ...job.value, postedBy: registered.value.name, postedAt: new Date().toISOString() }
  postedJobs.value.unshift(newJob)
  localStorage.setItem('centerJobs', JSON.stringify(postedJobs.value))
  successMessage.value = 'Job posted successfully.'
  job.value = { title: '', type: '', description: '' }
  setTimeout(() => (successMessage.value = ''), 3000)
}

function clearJob() {
  job.value = { title: '', type: '', description: '' }
}

function scrollToRegister() {
  // try to scroll to register form (first column)
  const el = document.querySelector('.center-page')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.center-page .card { border-radius: 12px; box-shadow: 0 10px 30px rgba(15,23,42,0.06); }
</style>
