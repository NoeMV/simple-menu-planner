<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useMenusStore } from '../../stores/menus';
    import { useUsersStore } from '../../stores/users';

    const menuStore = useMenusStore();
    const userStore = useUsersStore();

    const router = useRouter();

    const props = defineProps({
        id: {
            required: true,
            type: String
        }
    });

    const {menu, errorMenu} = await menuStore.getMenu(props.id);
    const {requests, errorRequests} = await menuStore.getRequests(menu.value.requests);
    const {meals, errorMeals} = await menuStore.getMeals(menu.value.meals);

    const showAlert = ref(true);

</script>

<template>
    <div class="relative py-8 px-10 w-full flex flex-col justify-center items-center space-y-8 bg-slate-100 rounded-xl shadow-xl">
        <h1 class="font-signika-negative font-semibold text-xl md:text-3xl text-center text-slate-600 w-full pb-2 border-b-2 border-slate-600">
            {{ menu.name }}
        </h1>
        <div v-if="(requests.length > 0 && showAlert)" class="py-2 px-4 w-full flex justify-between items-center bg-teal-500 bg-opacity-40 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="hidden sm:block h-7 w-7 text-white" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/> </svg>
            <router-link :to="{name: 'MenuSettings', props: {id: props.id}}" class="font-medium font-signika-negative text-slate-600 text-center text-base sm:text-lg hover:drop-shadow-lg">
                Hay nuevas solicitudes
            </router-link>
            <button @click="showAlert = false" class="w-fit ease-in-out hover:drop-shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-7 w-7 text-slate-600" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>
            </button>
        </div>
        <router-link :to="{name: 'MenuWeeklySchedule', params: {id: props.id}}" class="py-1 px-4 w-fit font-signika-negative font-medium text-lg rounded-xl text-slate-100 bg-sky-600 ease-in-out hover:bg-sky-700 hover:drop-shadow-md">
            Plan semanal
        </router-link>
        <router-link :to="{name: 'Dashboard'}" class="absolute -top-2 sm:-top-1 left-8 p-2 hover:ease-in-out hover:duration-200 hover:-translate-x-2 hover:drop-shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-7 w-7 text-slate-600" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/> </svg>
        </router-link>
    </div>
</template>