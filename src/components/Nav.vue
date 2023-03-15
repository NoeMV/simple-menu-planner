<script setup>
    import { useMenusStore } from '../stores/menus';

    const menuStore = useMenusStore();
</script>

<template>
    <nav class="absolute z-50 top-16 left-20 px-4 py-5 bg-white bg-opacity-50 backdrop-blur-md drop-shadow-sm rounded-lg shadow-lg">
        <div class="flex flex-col justify-center text-center items-center">
            <template v-if="!!menuStore.currentMenuId">
                <router-link :to="{name: 'MenuIndex', props: {id: menuStore.currentMenuId}}" class="py-2 px-3 font-signika-negative font-medium text-lg text-slate-700 ease-in-out duration-75 hover:text-slate-900 hover:drop-shadow-lg hover:scale-105">
                    Inicio
                </router-link>
                <router-link :to="{name: 'MealsIndex', props: {id: menuStore.currentMenuId}}" class="py-2 px-3 font-signika-negative font-medium text-lg text-slate-700 ease-in-out duration-75 hover:text-slate-900 hover:drop-shadow-lg hover:scale-105">
                    Comidas
                </router-link>
                <router-link :to="{name: 'IngredientsIndex', props: {id: menuStore.currentMenuId}}" class="py-2 px-3 font-signika-negative font-medium text-lg text-slate-700 ease-in-out duration-75 hover:text-slate-900 hover:drop-shadow-lg hover:scale-105">
                    Ingredientes
                </router-link>
                <router-link :to="{name: 'MenuIndex', props: {id: menuStore.currentMenuId}}" class="py-2 px-3 font-signika-negative font-medium text-lg text-slate-700 ease-in-out duration-75 hover:text-slate-900 hover:drop-shadow-lg hover:scale-105">
                    Plan semanal
                </router-link>
                <router-link :to="{name: 'MenuSettings', props: {id: menuStore.currentMenuId}}" class="py-2 px-3 font-signika-negative font-medium text-lg text-slate-700 ease-in-out duration-75 hover:text-slate-900 hover:drop-shadow-lg hover:scale-105">
                    Ajustes del menu
                </router-link>
            </template>
            <router-link :to="{name: 'Dashboard'}" class="py-2 px-3 font-signika-negative font-medium text-lg text-slate-700 ease-in-out duration-75 hover:text-slate-900 hover:drop-shadow-lg hover:scale-105">
                Ver mis menus
            </router-link>
        </div>
    </nav>
</template>

<style scoped>

</style>