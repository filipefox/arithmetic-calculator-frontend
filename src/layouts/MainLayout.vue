<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered>
      <q-toolbar>
        <q-toolbar-title>
          Arithmetic Calculator
        </q-toolbar-title>
        <div>
          <q-btn @click="logout()" icon="logout" dense flat round></q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from 'stores/auth-store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function logout () {
  authStore.clearToken()
  await router.push('/login')
}
</script>
