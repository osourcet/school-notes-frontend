import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Share from '../views/Share.vue'
import Help from '../views/Help.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {title: 'School Notes'},
    },

    {
        path: '/share',
        name: 'Share',
        component: Share,
        meta: {title: 'School Notes'},
    },
    
    {
        path: '/help',
        name: 'Help',
        component: Help,
        meta: {title: 'School Notes'},
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next()
})

export default router
