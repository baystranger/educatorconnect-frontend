<script setup>
import { reactive } from 'vue';
const task = reactive({ title:'', priority:'default' });
</script>

<template>
<div aria-hidden="true" class="modal fade" id="todoTaskModal" tabindex="-1">
<div class="modal-dialog modal-dialog-centered">
<div class="modal-content">
<div class="modal-header py-3">
<h5 class="modal-title">Add New Task</h5>
<button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
</div>
<div class="modal-body">
<form id="taskForm">
<div class="row">
<div class="col-12 mb-3">
<input class="form-control" id="todoInput" placeholder="Add a new task" type="text"/>
</div>
<div class="col-12 mb-3">
<select class="form-select" id="todoPriority">
<option value="default">Default</option>
<option value="success">Completed</option>
<option value="danger">High Priority</option>
<option value="info">Info</option>
</select>
</div>
<div class="col-12 text-end">
<button class="btn btn-light waves-effect waves-light me-2" data-bs-dismiss="modal" type="button">Close</button>
<button class="btn btn-primary waves-effect waves-light" data-bs-dismiss="modal" id="todoAdd" type="button">Add Task</button>
</div>
</div>
</form>
</div>
</div>
</div>
</div>
</template>
