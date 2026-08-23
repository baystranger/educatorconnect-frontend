<script setup>
import { reactive, ref } from 'vue';

const form = reactive({ fullName:'', email:'', phone:'', department:'', designation:'', joiningDate:'', status:'Active', address:'', photo:null });
const submitting = ref(false);
const onFile = e => { form.photo = e.target.files?.[0] || null; };
const submit = async () => { submitting.value = true; try { /* connect your API here */ } finally { submitting.value = false; } };
</script>

<template>
<div aria-hidden="true" class="modal fade" id="addEmployeeModal" tabindex="-1">
<div class="modal-dialog modal-dialog-centered">
<div class="modal-content">
<div class="modal-header py-3">
<h5 class="modal-title">Add Employee</h5>
<button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
</div>
<div class="modal-body">
<form>
<div class="mb-3">
<label class="form-label" for="fullName">Full Name</label>
<input class="form-control" id="fullName" placeholder="Enter full name" type="text"/>
</div>
<div class="row">
<div class="col-md-6 mb-3">
<label class="form-label" for="email">Email Address</label>
<input class="form-control" id="email" placeholder="example@email.com" type="email"/>
</div>
<div class="col-md-6 mb-3">
<label class="form-label" for="phone">Phone Number</label>
<input class="form-control" id="phone" placeholder="+91 9876543210" type="tel"/>
</div>
</div>
<div class="row">
<div class="col-md-6 mb-3">
<label class="form-label" for="department">Department</label>
<select class="form-select" id="department">
<option disabled="" selected="">Select Department</option>
<option>HR</option>
<option>Development</option>
<option>Sales</option>
<option>Marketing</option>
</select>
</div>
<div class="col-md-6 mb-3">
<label class="form-label" for="designation">Designation</label>
<input class="form-control" id="designation" placeholder="e.g. Software Engineer" type="text"/>
</div>
</div>
<div class="row">
<div class="col-md-6 mb-3">
<label class="form-label" for="joiningDate">Joining Date</label>
<input class="form-control flatpickr-date" id="joiningDate" type="date"/>
</div>
<div class="col-md-6 mb-3">
<label class="form-label" for="status">Employment Status</label>
<select class="form-select" id="status">
<option>Active</option>
<option>Inactive</option>
<option>Probation</option>
</select>
</div>
</div>
<div class="mb-3">
<label class="form-label" for="address">Address</label>
<textarea class="form-control" id="address" placeholder="Enter address" rows="2"></textarea>
</div>
<div class="mb-3">
<label class="form-label" for="photo">Profile Photo</label>
<input class="form-control" id="photo" type="file"/>
</div>
<div class="text-end">
<button class="btn btn-success" type="submit">Add Employee</button>
</div>
</form>
</div>
</div>
</div>
</div>
</template>
