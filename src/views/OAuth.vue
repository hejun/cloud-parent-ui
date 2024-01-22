<template>
  <div v-if="error">
    <div>{{ error }}</div>
    <div>{{ error_description }}</div>
  </div>
  <div v-else>加载中...</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store'
import { enc } from 'crypto-js'
import { generateAuthorizationUrl, obtainAccessToken } from '@/api/Auth'

const router = useRouter()
const route = useRoute()

let { target, code, state, error, error_description } = route.query

if (target) {
  window.location.href = generateAuthorizationUrl(target as string)
}

if (code) {
  obtainAccessToken(code as string)
    .then(authorization => {
      const authStore = useAuthStore()
      authStore.updateAuthorization(authorization)
    })
    .then(() => {
      const target = state ? decodeURIComponent(enc.Utf8.stringify(enc.Base64.parse(state as string))) : '/'
      router.replace(target)
    })
}
</script>

<style scoped lang="scss"></style>
