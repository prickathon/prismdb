<script setup>
useHead({
  title: 'PrismDB',
  meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'prismdb は プリティーシリーズの二次創作です' }
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
