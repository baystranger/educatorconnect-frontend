<template>
  <div class="mb-8">
    <p class="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">{{ eyebrow }}</p>
    <h2 class="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">{{ title }}</h2>
    <p v-if="description" class="mt-4 max-w-2xl text-lg text-slate-600">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>
