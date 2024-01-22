import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/Home.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    name: 'OAuth',
    path: '/oauth',
    component: () => import('@/views/OAuth.vue')
  },
  {
    name: '404',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    const authStore = useAuthStore()
    if (authStore.authenticated) {
      next()
    } else {
      next({
        path: '/oauth',
        query: { target: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router
