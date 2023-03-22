import {createRouter, createWebHistory} from 'vue-router';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { useUsersStore } from '../stores/users';

const routes = [
    { path: '/', name: 'Home', component: () => import('../components/Home.vue')},
    { path: '/login', name: 'Login', component: () => import('../components/Login.vue')},
    { path: '/register', name: 'Register', component: () => import('../components/Register.vue')},
    { path: '/dashboard', name: 'Dashboard', component: () => import('../components/Dashboard.vue'), meta: {requiresAuth: true}},
    { path: '/menu/create', name: 'MenuCreate', component: () => import('../components/Menu/Create.vue'), meta: {requiresAuth: true}},
    { path: '/menu/join', name: 'MenuJoin', component: () => import('../components/Menu/Join.vue'), meta: {requiresAuth: true}},
    { path: '/menu/:id', name: 'MenuIndex', component: () => import('../components/Menu/MenuIndex.vue'), meta: {requiresAuth: true, participant: true}, props: true},
    { path: '/menu/:id/meals', name: 'MealsIndex', component: () => import('../components/Meal/MealsIndex.vue'), meta: {requiresAuth: true, participant: true}, props: true},
    { path: '/menu/:id/meals/create', name: 'MealsCreate', component: () => import('../components/Meal/Create.vue'), meta: {requiresAuth: true, participant: true}, props: true},
    { path: '/menu/:id/meals/:mealId/edit', name: 'MealsEdit', component: () => import('../components/Meal/Edit.vue'), meta: {requiresAuth: true, participant: true}, props: true},
    { path: '/menu/:id/ingredients', name: 'IngredientsIndex', component: () => import('../components/Ingredient/IngredientsIndex.vue'), meta: {requiresAuth: true, participant: true}, props: true},
    { path: '/menu/:id/weekly-schedule', name: 'MenuWeeklySchedule', component: () => import('../components/Menu/WeeklySchedule.vue'), meta: {requiresAuth: true, participant: true}, props: true},
    { path: '/menu/:id/settings', name: 'MenuSettings', component: () => import('../components/Menu/Settings.vue'), meta: {requiresAuth: true, participant: true}, props: true},
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
    const userStore = useUsersStore();
    const currentUser = await getCurrentUser();

    if(!currentUser){
        userStore.user = null;
    } else {
        await userStore.getUser(currentUser.uid);
    }

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if(userStore.user){
            if(to.params.id){
                if(userStore.user.menus.some((record) => record.code == to.params.id && record.status == 'participant')){
                    next();
                } else {
                    alert('you dont have access to this menu');
                    next('/dashboard');
                }
            } else {
                next();
            }
        } else {
            alert('you dont have access to the app');
            next('/login');
        }
    } else if ((to.name == 'Login' || to.name == 'Register' || to.name == 'Home') && userStore.user){
        next({ name: 'Dashboard' });
    } else {
        next();
    }

});

export default router;