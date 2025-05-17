import { createRouter, createWebHistory } from 'vue-router'
import {
    NoPermission,
    NotFound,
    Listen,
    Home,
    Cluster,
    Route,
    Sni
} from './page';

const routes: any[] = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/listen',
        name: 'listen',
        component: Listen,
    },
    {
        path: '/cluster',
        name: 'cluster',
        component: Cluster,
    },
    {
        path: '/route',
        name: 'route',
        component: Route,
    },
    {
        path: '/sni',
        name: 'sni',
        component: Sni,
    },
    {
        path: '/401',
        name: '401',
        component: NoPermission,
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: NotFound,
    },
]

export const router = createRouter({
    history: createWebHistory('/'),
    routes,
})

router.beforeEach(async (to: any, from: any, next: any) => {
    if (['404', '401'].indexOf((to.name || '').toString()) !== -1) return next()
    //if (to.meta.needAdmin === true && !store.getters.IsAdmin) return next('401')
    return next()
})
