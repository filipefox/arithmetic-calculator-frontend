<template>
  <q-layout class="row items-center justify-evenly">
    <q-form>
      <q-input v-model="request.username" label="Username"></q-input>
      <q-input v-model="request.password" label="Password"></q-input>
      <q-btn @click="login" label="Login"></q-btn>
    </q-form>
  </q-layout>
</template>

<script setup lang="ts">
import { api } from 'boot/axios'
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import { useRouter } from 'vue-router'

const request = ref({ username: undefined, password: undefined })
const authStore = useAuthStore()
const router = useRouter()

async function login () {
  try {
    const response = await api.post('/v1/auth/login', request.value)
    authStore.setToken(response.data.access_token)
    await router.push('/')
  } catch (e) {
    console.log(e)
  }
}
</script>
