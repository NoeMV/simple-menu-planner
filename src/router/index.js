import {createRouter, createWebHistory} from 'vue-router';
import { getAuth, onAuthStateChanged } from '@firebase/auth';

const routes = [
    { path: '/', name: 'Home', component: () => import('../components/Home.vue')},
    { path: '/login', name: 'Login', component: () => import('../components/Login.vue')},
    { path: '/register', name: 'Register', component: () => import('../components/Register.vue')},
    { path: '/dashboard', name: 'Dashboard', component: () => import('../components/Dashboard.vue'), meta: {requiresAuth: true}},
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        );
    });
}

router.beforeEach(async (to, from, next) => {
    const user = await getCurrentUser();

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if(user){
            next();
        } else {
            alert('you dont have access');
            next('/login');
        }
    } else if ((to.name == 'Login' || to.name == 'Register') && user){
        next({ name: 'Dashboard' });
    } else {
        next();
    }

});

export default router;