<template>
  <div class="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
    <div class="text-lg font-semibold">Page not found</div>
    <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">
      The page you’re looking for doesn’t exist. Head back to your dashboard.
    </div>

    <RouterLink
      to="/app/dashboard"
      class="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
    >
      Go to dashboard
    </RouterLink>
  </div>
</template>

<script setup lang="ts"></script>
