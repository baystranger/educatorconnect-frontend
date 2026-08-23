<script setup>
import { ref } from 'vue';
const tasks = ref([
  { title: 'Prepare monthly financial report', time: '04:25PM', done: false },
  { title: 'Develop new marketing strategy', time: '04:25PM', done: true },
  { title: 'Reply to customer emails', time: '04:25PM', done: false },
  { title: 'Update website content', time: '04:25PM', done: false },
  { title: 'Review employee performance', time: '04:25PM', done: true },
  { title: 'Reply to customer emails', time: '04:25PM', done: true }
]);
const removeTask = index => tasks.value.splice(index,1);
</script>

<template>
<div class="col-xxl-5">
<div class="card">
<div class="card-header d-flex align-items-center justify-content-between border-0 pb-0">
<h6 class="card-title mb-0">Task Update</h6>
<div class="clearfix">
<a class="btn-link" href="#">View All</a>
<button class="btn btn-sm btn-outline-light btn-shadow text-primary waves-effect ms-3" data-bs-target="#todoTaskModal" data-bs-toggle="modal" type="button">
<i class="fi fi-rr-plus text-2xs me-1"></i> New Task
                  </button>
</div>
</div>
<div class="card-body pb-1 px-2 pt-3 overflow-auto" data-simplebar="" style="height: 325px;">
<ul class="list-group list-group-smooth list-group-unlined todo-nav" id="todoList">
<li class="list-group-item d-flex gap-2 align-items-center todo-item mb-1 ps-3 pe-2 py-2">
<span class="sortable-handle">
<svg fill="none" height="17" viewbox="0 0 16 17" width="16" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9998 3.16667C12.7362 3.16667 13.3332 2.56971 13.3332 1.83333C13.3332 1.09695 12.7362 0.5 11.9998 0.5C11.2635 0.5 10.6665 1.09695 10.6665 1.83333C10.6665 2.56971 11.2635 3.16667 11.9998 3.16667Z" fill="var(--bs-body-color)"></path>
<path d="M11.9998 9.26237C12.7362 9.26237 13.3332 8.66542 13.3332 7.92904C13.3332 7.19266 12.7362 6.5957 11.9998 6.5957C11.2635 6.5957 10.6665 7.19266 10.6665 7.92904C10.6665 8.66542 11.2635 9.26237 11.9998 9.26237Z" fill="var(--bs-body-color)"></path>
<path d="M11.9998 15.3571C12.7362 15.3571 13.3332 14.7601 13.3332 14.0238C13.3332 13.2874 12.7362 12.6904 11.9998 12.6904C11.2635 12.6904 10.6665 13.2874 10.6665 14.0238C10.6665 14.7601 11.2635 15.3571 11.9998 15.3571Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 3.16667C5.49818 3.16667 6.09513 2.56971 6.09513 1.83333C6.09513 1.09695 5.49818 0.5 4.7618 0.5C4.02542 0.5 3.42847 1.09695 3.42847 1.83333C3.42847 2.56971 4.02542 3.16667 4.7618 3.16667Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 9.26237C5.49818 9.26237 6.09513 8.66542 6.09513 7.92904C6.09513 7.19266 5.49818 6.5957 4.7618 6.5957C4.02542 6.5957 3.42847 7.19266 3.42847 7.92904C3.42847 8.66542 4.02542 9.26237 4.7618 9.26237Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 15.3571C5.49818 15.3571 6.09513 14.7601 6.09513 14.0238C6.09513 13.2874 5.49818 12.6904 4.7618 12.6904C4.02542 12.6904 3.42847 13.2874 3.42847 14.0238C3.42847 14.7601 4.02542 15.3571 4.7618 15.3571Z" fill="var(--bs-body-color)"></path>
</svg>
</span>
<input class="form-check-input todo-checkbox check-dark" type="checkbox"/>
<span class="form-label mb-0">Prepare monthly financial report</span>
<span class="todo-time text-body">04:25PM</span>
<button class="btn btn-action-gray btn-sm btn-icon waves-effect waves-light item-delete ms-auto" type="button">
<i class="fi fi-rr-trash"></i>
</button>
</li>
<li class="list-group-item d-flex gap-2 align-items-center todo-item mb-1 ps-3 pe-2 py-2">
<span class="sortable-handle">
<svg fill="none" height="17" viewbox="0 0 16 17" width="16" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9998 3.16667C12.7362 3.16667 13.3332 2.56971 13.3332 1.83333C13.3332 1.09695 12.7362 0.5 11.9998 0.5C11.2635 0.5 10.6665 1.09695 10.6665 1.83333C10.6665 2.56971 11.2635 3.16667 11.9998 3.16667Z" fill="var(--bs-body-color)"></path>
<path d="M11.9998 9.26237C12.7362 9.26237 13.3332 8.66542 13.3332 7.92904C13.3332 7.19266 12.7362 6.5957 11.9998 6.5957C11.2635 6.5957 10.6665 7.19266 10.6665 7.92904C10.6665 8.66542 11.2635 9.26237 11.9998 9.26237Z" fill="var(--bs-body-color)"></path>
<path d="M11.9998 15.3571C12.7362 15.3571 13.3332 14.7601 13.3332 14.0238C13.3332 13.2874 12.7362 12.6904 11.9998 12.6904C11.2635 12.6904 10.6665 13.2874 10.6665 14.0238C10.6665 14.7601 11.2635 15.3571 11.9998 15.3571Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 3.16667C5.49818 3.16667 6.09513 2.56971 6.09513 1.83333C6.09513 1.09695 5.49818 0.5 4.7618 0.5C4.02542 0.5 3.42847 1.09695 3.42847 1.83333C3.42847 2.56971 4.02542 3.16667 4.7618 3.16667Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 9.26237C5.49818 9.26237 6.09513 8.66542 6.09513 7.92904C6.09513 7.19266 5.49818 6.5957 4.7618 6.5957C4.02542 6.5957 3.42847 7.19266 3.42847 7.92904C3.42847 8.66542 4.02542 9.26237 4.7618 9.26237Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 15.3571C5.49818 15.3571 6.09513 14.7601 6.09513 14.0238C6.09513 13.2874 5.49818 12.6904 4.7618 12.6904C4.02542 12.6904 3.42847 13.2874 3.42847 14.0238C3.42847 14.7601 4.02542 15.3571 4.7618 15.3571Z" fill="var(--bs-body-color)"></path>
</svg>
</span>
<input checked="" class="form-check-input todo-checkbox check-dark" type="checkbox"/>
<span class="form-label mb-0">Develop new marketing strategy</span>
<span class="todo-time text-body">04:25PM</span>
<button class="btn btn-action-gray btn-sm btn-icon waves-effect waves-light item-delete ms-auto" type="button">
<i class="fi fi-rr-trash"></i>
</button>
</li>
<li class="list-group-item d-flex gap-2 align-items-center todo-item mb-1 ps-3 pe-2 py-2">
<span class="sortable-handle">
<svg fill="none" height="17" viewbox="0 0 16 17" width="16" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9998 3.16667C12.7362 3.16667 13.3332 2.56971 13.3332 1.83333C13.3332 1.09695 12.7362 0.5 11.9998 0.5C11.2635 0.5 10.6665 1.09695 10.6665 1.83333C10.6665 2.56971 11.2635 3.16667 11.9998 3.16667Z" fill="var(--bs-body-color)"></path>
<path d="M11.9998 9.26237C12.7362 9.26237 13.3332 8.66542 13.3332 7.92904C13.3332 7.19266 12.7362 6.5957 11.9998 6.5957C11.2635 6.5957 10.6665 7.19266 10.6665 7.92904C10.6665 8.66542 11.2635 9.26237 11.9998 9.26237Z" fill="var(--bs-body-color)"></path>
<path d="M11.9998 15.3571C12.7362 15.3571 13.3332 14.7601 13.3332 14.0238C13.3332 13.2874 12.7362 12.6904 11.9998 12.6904C11.2635 12.6904 10.6665 13.2874 10.6665 14.0238C10.6665 14.7601 11.2635 15.3571 11.9998 15.3571Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 3.16667C5.49818 3.16667 6.09513 2.56971 6.09513 1.83333C6.09513 1.09695 5.49818 0.5 4.7618 0.5C4.02542 0.5 3.42847 1.09695 3.42847 1.83333C3.42847 2.56971 4.02542 3.16667 4.7618 3.16667Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 9.26237C5.49818 9.26237 6.09513 8.66542 6.09513 7.92904C6.09513 7.19266 5.49818 6.5957 4.7618 6.5957C4.02542 6.5957 3.42847 7.19266 3.42847 7.92904C3.42847 8.66542 4.02542 9.26237 4.7618 9.26237Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 15.3571C5.49818 15.3571 6.09513 14.7601 6.09513 14.0238C6.09513 13.2874 5.49818 12.6904 4.7618 12.6904C4.02542 12.6904 3.42847 13.2874 3.42847 14.0238C3.42847 14.7601 4.02542 15.3571 4.7618 15.3571Z" fill="var(--bs-body-color)"></path>
</svg>
</span>
<input class="form-check-input todo-checkbox check-dark" type="checkbox"/>
<span class="form-label mb-0">Reply to customer emails</span>
<span class="todo-time text-body">04:25PM</span>
<button class="btn btn-action-gray btn-sm btn-icon waves-effect waves-light item-delete ms-auto" type="button">
<i class="fi fi-rr-trash"></i>
</button>
</li>
<li class="list-group-item d-flex gap-2 align-items-center todo-item mb-1 ps-3 pe-2 py-2">
<span class="sortable-handle">
<svg fill="none" height="17" viewbox="0 0 16 17" width="16" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9998 3.16667C12.7362 3.16667 13.3332 2.56971 13.3332 1.83333C13.3332 1.09695 12.7362 0.5 11.9998 0.5C11.2635 0.5 10.6665 1.09695 10.6665 1.83333C10.6665 2.56971 11.2635 3.16667 11.9998 3.16667Z" fill="var(--bs-body-color)"></path>
<path d="M11.9998 9.26237C12.7362 9.26237 13.3332 8.66542 13.3332 7.92904C13.3332 7.19266 12.7362 6.5957 11.9998 6.5957C11.2635 6.5957 10.6665 7.19266 10.6665 7.92904C10.6665 8.66542 11.2635 9.26237 11.9998 9.26237Z" fill="var(--bs-body-color)"></path>
<path d="M11.9998 15.3571C12.7362 15.3571 13.3332 14.7601 13.3332 14.0238C13.3332 13.2874 12.7362 12.6904 11.9998 12.6904C11.2635 12.6904 10.6665 13.2874 10.6665 14.0238C10.6665 14.7601 11.2635 15.3571 11.9998 15.3571Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 3.16667C5.49818 3.16667 6.09513 2.56971 6.09513 1.83333C6.09513 1.09695 5.49818 0.5 4.7618 0.5C4.02542 0.5 3.42847 1.09695 3.42847 1.83333C3.42847 2.56971 4.02542 3.16667 4.7618 3.16667Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 9.26237C5.49818 9.26237 6.09513 8.66542 6.09513 7.92904C6.09513 7.19266 5.49818 6.5957 4.7618 6.5957C4.02542 6.5957 3.42847 7.19266 3.42847 7.92904C3.42847 8.66542 4.02542 9.26237 4.7618 9.26237Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 15.3571C5.49818 15.3571 6.09513 14.7601 6.09513 14.0238C6.09513 13.2874 5.49818 12.6904 4.7618 12.6904C4.02542 12.6904 3.42847 13.2874 3.42847 14.0238C3.42847 14.7601 4.02542 15.3571 4.7618 15.3571Z" fill="var(--bs-body-color)"></path>
</svg>
</span>
<input class="form-check-input todo-checkbox check-dark" type="checkbox"/>
<span class="form-label mb-0">Update website content</span>
<span class="todo-time text-body">04:25PM</span>
<button class="btn btn-action-gray btn-sm btn-icon waves-effect waves-light item-delete ms-auto" type="button">
<i class="fi fi-rr-trash"></i>
</button>
</li>
<li class="list-group-item d-flex gap-2 align-items-center todo-item mb-1 ps-3 pe-2 py-2">
<span class="sortable-handle">
<svg fill="none" height="17" viewbox="0 0 16 17" width="16" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9998 3.16667C12.7362 3.16667 13.3332 2.56971 13.3332 1.83333C13.3332 1.09695 12.7362 0.5 11.9998 0.5C11.2635 0.5 10.6665 1.09695 10.6665 1.83333C10.6665 2.56971 11.2635 3.16667 11.9998 3.16667Z" fill="var(--bs-body-color)"></path>
<path d="M11.9998 9.26237C12.7362 9.26237 13.3332 8.66542 13.3332 7.92904C13.3332 7.19266 12.7362 6.5957 11.9998 6.5957C11.2635 6.5957 10.6665 7.19266 10.6665 7.92904C10.6665 8.66542 11.2635 9.26237 11.9998 9.26237Z" fill="var(--bs-body-color)"></path>
<path d="M11.9998 15.3571C12.7362 15.3571 13.3332 14.7601 13.3332 14.0238C13.3332 13.2874 12.7362 12.6904 11.9998 12.6904C11.2635 12.6904 10.6665 13.2874 10.6665 14.0238C10.6665 14.7601 11.2635 15.3571 11.9998 15.3571Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 3.16667C5.49818 3.16667 6.09513 2.56971 6.09513 1.83333C6.09513 1.09695 5.49818 0.5 4.7618 0.5C4.02542 0.5 3.42847 1.09695 3.42847 1.83333C3.42847 2.56971 4.02542 3.16667 4.7618 3.16667Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 9.26237C5.49818 9.26237 6.09513 8.66542 6.09513 7.92904C6.09513 7.19266 5.49818 6.5957 4.7618 6.5957C4.02542 6.5957 3.42847 7.19266 3.42847 7.92904C3.42847 8.66542 4.02542 9.26237 4.7618 9.26237Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 15.3571C5.49818 15.3571 6.09513 14.7601 6.09513 14.0238C6.09513 13.2874 5.49818 12.6904 4.7618 12.6904C4.02542 12.6904 3.42847 13.2874 3.42847 14.0238C3.42847 14.7601 4.02542 15.3571 4.7618 15.3571Z" fill="var(--bs-body-color)"></path>
</svg>
</span>
<input checked="" class="form-check-input todo-checkbox" type="checkbox"/>
<span class="form-label mb-0">Review employee performance</span>
<span class="todo-time text-body text-body">04:25PM</span>
<button class="btn btn-action-gray btn-sm btn-icon waves-effect waves-light item-delete ms-auto" type="button">
<i class="fi fi-rr-trash"></i>
</button>
</li>
<li class="list-group-item d-flex gap-2 align-items-center todo-item mb-1 ps-3 pe-2 py-2">
<span class="sortable-handle">
<svg fill="none" height="17" viewbox="0 0 16 17" width="16" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9998 3.16667C12.7362 3.16667 13.3332 2.56971 13.3332 1.83333C13.3332 1.09695 12.7362 0.5 11.9998 0.5C11.2635 0.5 10.6665 1.09695 10.6665 1.83333C10.6665 2.56971 11.2635 3.16667 11.9998 3.16667Z" fill="var(--bs-body-color)"></path>
<path d="M11.9998 9.26237C12.7362 9.26237 13.3332 8.66542 13.3332 7.92904C13.3332 7.19266 12.7362 6.5957 11.9998 6.5957C11.2635 6.5957 10.6665 7.19266 10.6665 7.92904C10.6665 8.66542 11.2635 9.26237 11.9998 9.26237Z" fill="var(--bs-body-color)"></path>
<path d="M11.9998 15.3571C12.7362 15.3571 13.3332 14.7601 13.3332 14.0238C13.3332 13.2874 12.7362 12.6904 11.9998 12.6904C11.2635 12.6904 10.6665 13.2874 10.6665 14.0238C10.6665 14.7601 11.2635 15.3571 11.9998 15.3571Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 3.16667C5.49818 3.16667 6.09513 2.56971 6.09513 1.83333C6.09513 1.09695 5.49818 0.5 4.7618 0.5C4.02542 0.5 3.42847 1.09695 3.42847 1.83333C3.42847 2.56971 4.02542 3.16667 4.7618 3.16667Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 9.26237C5.49818 9.26237 6.09513 8.66542 6.09513 7.92904C6.09513 7.19266 5.49818 6.5957 4.7618 6.5957C4.02542 6.5957 3.42847 7.19266 3.42847 7.92904C3.42847 8.66542 4.02542 9.26237 4.7618 9.26237Z" fill="var(--bs-body-color)"></path>
<path d="M4.7618 15.3571C5.49818 15.3571 6.09513 14.7601 6.09513 14.0238C6.09513 13.2874 5.49818 12.6904 4.7618 12.6904C4.02542 12.6904 3.42847 13.2874 3.42847 14.0238C3.42847 14.7601 4.02542 15.3571 4.7618 15.3571Z" fill="var(--bs-body-color)"></path>
</svg>
</span>
<input checked="" class="form-check-input todo-checkbox check-success" type="checkbox"/>
<span class="form-label mb-0">Reply to customer emails</span>
<span class="todo-time text-body">04:25PM</span>
<button class="btn btn-action-gray btn-sm btn-icon waves-effect waves-light item-delete ms-auto" type="button">
<i class="fi fi-rr-trash"></i>
</button>
</li>
</ul>
</div>
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
</div>
</div>
</template>
