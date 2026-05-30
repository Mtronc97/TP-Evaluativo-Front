import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HomeView from './views/home.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/client/:id',
        name: 'client',
        component: () => import('./views/client.vue')
    },
    {
        // Layout del admin con sidebar — rutas hijas se renderizan dentro
        path: '/admin/:id',
        component: () => import('./views/AdminLayout.vue'),
        children: [
            {
                path: '',
                name: 'admin-dashboard',
                component: () => import('./views/AdminDashboard.vue')
            },
            {
                path: 'users',
                name: 'admin-users',
                component: () => import('./views/UserList.vue')
            }
        ]
    },
    {
        // Vista detalle de usuario (ruta independiente)
        path: '/users/:id',
        name: 'user-detail',
        component: () => import('./views/UserDetail.vue')
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router