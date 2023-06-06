<template>
  <q-layout class="row items-center justify-evenly">
    <div>
      <p class="text-h5">Arithmetic Calculator</p>
      <q-form class="column q-gutter-md">
        <q-input label="Username" v-model="request.username" outlined></q-input>
        <q-input label="Password" v-model="request.password" type="password" outlined></q-input>
        <q-btn  label="Login" @click="login" color="primary"></q-btn>
      </q-form>
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { api } from 'boot/axios'
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const request = ref({
  username: undefined,
  password: undefined
})
const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

async function login () {
  try {
    const response = await api.post('/v1/auth/login', request.value)
    authStore.setToken(response.data.access_token)
    await router.push('/')
  } catch (e) {
    $q.notify({
      message: 'Invalid credentials.',
      position: 'center',
      timeout: 1000
    })
  }
}
</script>
