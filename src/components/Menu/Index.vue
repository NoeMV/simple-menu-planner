<script setup>
    import { onMounted, ref } from 'vue';
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

    const menuData = ref({});
    const requestsData = ref([]);
    const mealsData = ref([]);

    onMounted(async () => {
        const {menu, errorMenu} = await menuStore.getMenu(props.id);
        menuData.value = menu.value;
        const {requests, errorRequests} = await menuStore.getRequests(menuData.value.requests);
        requestsData.value = requests.value;
        const {meals, errorMeals} = await menuStore.getMeals(menuData.value.meals);
        mealsData.value = meals.value;
    });

</script>

<template>
    <div class="mx-auto max-w-7xl px-10 h-full flex justify-center items-center">
        <div class="py-8 px-10 w-full flex flex-col justify-center items-center space-y-8 bg-white bg-opacity-50 backdrop-blur-lg drop-shadow-md rounded-lg shadow-lg">
            <h1 class="font-signika-negative font-semibold text-xl md:text-3xl text-center text-slate-700 w-full pb-2 border-b-2 border-slate-500">
                {{ menuData.name }}
            </h1>
            <div v-if="(requestsData.length > 0)" class="py-2 px-4 w-full font-medium font-signika-negative text-slate-700 text-center bg-teal-500 bg-opacity-40 rounded-lg">
                Hay solicitudes para unirse en espera
            </div>
            <p class="font-medium font-signika-negative text-slate-700 text-lg">
                {{ "Calendar" }}
            </p>
            <p class="font-medium font-signika-negative text-slate-700 text-lg">
                {{ "Week schedule" }}
            </p>
            <p class="font-medium font-signika-negative text-slate-700 text-lg">
                {{ "Meals list" }}
            </p>
            <span v-for="meal in mealsData" :key="meal.id">
                {{ meal.name }}
            </span>
            <div class="flex justify-between w-full">
                <router-link :to="{name: 'Dashboard'}" class="py-1 px-3 w-fit font-signika-negative font-medium text-sm sm:text-xl text-slate-100 bg-sky-600 rounded-3xl ease-in-out hover:bg-sky-700 drop-shadow-md">
                    Volver
                </router-link>
                <router-link :to="{name: 'MenuSettings', params: {id: props.id}}" class="py-1 px-3 w-fit font-signika-negative font-medium text-sm sm:text-xl text-slate-100 bg-sky-600 rounded-3xl ease-in-out hover:bg-sky-700 drop-shadow-md">
                    Ajustes
                </router-link>
            </div>
        </div>
    </div>
</template>