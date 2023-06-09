<template>
  <router-view />
</template>

<script setup lang="ts">
import { useAuthStore } from 'stores/auth-store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

authStore.$subscribe(async (mutation, state) => {
  if (state.token) {
    await router.push('/')
  } else {
    await router.push('/login')
  }
}, { detached: true })

</script>
