import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { findStore, isOrderable } from '@/order/lib/catalog'
import { useOrder } from '@/order/useOrder'

const BRAND = 'Guacado Mexican Grill'

// BRAND.md §2: Menu, Catering and Locations get their own routes; Order, Jobs and
// Franchise stay external (see src/data/site.js).
export const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: BRAND } },
  { path: '/menu', name: 'menu', component: () => import('@/views/MenuView.vue'), meta: { title: `Menu · ${BRAND}` } },
  { path: '/catering', name: 'catering', component: () => import('@/views/CateringView.vue'), meta: { title: `Catering · ${BRAND}` } },
  { path: '/locations', name: 'locations', component: () => import('@/views/LocationsView.vue'), meta: { title: `Locations · ${BRAND}` } },
  {
    // Mobile-first pickup ordering. Own shell (no marketing header/footer): meta.order hides them in App.vue.
    path: '/order',
    component: () => import('@/order/views/OrderShell.vue'),
    meta: { order: true },
    children: [
      {
        path: '',
        name: 'order',
        component: () => import('@/order/views/OrderLocationView.vue'),
        meta: { title: `Order pickup · ${BRAND}` },
        // A remembered, orderable store skips the picker (LOC-03). "?change" forces it.
        beforeEnter: (to) => {
          const slug = useOrder().state.storeSlug
          if (slug && !to.query.change) return { path: `/order/${slug}`, replace: true }
        },
      },
      { path: 'checkout', name: 'order-checkout', component: () => import('@/order/views/OrderCheckoutView.vue'), meta: { title: `Checkout · ${BRAND}` } },
      { path: ':store', name: 'order-menu', component: () => import('@/order/views/OrderMenuView.vue'), props: true, meta: { title: `Order · ${BRAND}` } },
      { path: ':store/build', name: 'order-build', component: () => import('@/order/views/OrderBuilderView.vue'), props: true, meta: { title: `Build your own · ${BRAND}` } },
      { path: ':store/item/:slug', name: 'order-item', component: () => import('@/order/views/OrderItemView.vue'), props: true, meta: { title: `Order · ${BRAND}` } },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export function createAppRouter(history = createWebHistory()) {
  const router = createRouter({
    history,
    routes,
    scrollBehavior(to, from, saved) {
      if (saved) return saved
      if (to.hash) return { el: to.hash, top: 88, behavior: 'smooth' }
      return { top: 0, behavior: 'instant' }
    },
  })
  // Only OPEN stores are orderable; a stale or "coming soon" link goes back to the picker.
  router.beforeEach((to) => {
    if (!to.params.store) return
    if (!isOrderable(findStore(to.params.store))) return { path: '/order', query: { change: 1 } }
    useOrder().chooseStore(to.params.store)
  })
  router.afterEach((to) => {
    document.title = to.meta.title ?? BRAND
  })
  return router
}

export default createAppRouter()
