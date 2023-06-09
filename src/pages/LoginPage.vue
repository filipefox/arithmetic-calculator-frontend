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
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const request = ref({ username: undefined, password: undefined })
const authStore = useAuthStore()
const $q = useQuasar()

async function login () {
  try {
    const response = await api.post('/v1/auth/login', request.value)
    authStore.setToken(response.data.access_token)
  } catch (e) {
    $q.notify({
      message: 'Invalid credentials.',
      position: 'center',
      timeout: 1000
    })
  }
}
</script>
