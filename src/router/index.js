import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const BRAND = 'Guacado Mexican Grill'

// Menu, Catering and Locations get their own routes; Order, Jobs and Franchise stay
// external (see src/data/site.js).
export const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: BRAND } },
  { path: '/menu', name: 'menu', component: () => import('@/views/MenuView.vue'), meta: { title: `Menu · Order Online · ${BRAND}` } },
  { path: '/catering', name: 'catering', component: () => import('@/views/CateringView.vue'), meta: { title: `Catering · ${BRAND}` } },
  { path: '/locations', name: 'locations', component: () => import('@/views/LocationsView.vue'), meta: { title: `Locations · ${BRAND}` } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export function createAppRouter(history = createWebHistory()) {
  const router = createRouter({
    history,
    routes,
    scrollBehavior(to, from, saved) {
      if (saved) return saved
      // Header is 68px; the menu page adds a 56px sticky tab bar.
      if (to.hash) return { el: to.hash, top: to.path === '/menu' ? 132 : 76, behavior: 'smooth' }
      return { top: 0, behavior: 'instant' }
    },
  })
  router.afterEach((to) => {
    document.title = to.meta.title ?? BRAND
  })
  return router
}

export default createAppRouter()
