import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HomeView from './views/home.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/client',
        name: 'client',
        component: () => import ('./views/client.vue')
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import ('./views/admin.vue')
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router