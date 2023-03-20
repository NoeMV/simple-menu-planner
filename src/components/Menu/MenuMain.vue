<script setup>
    import { ref } from 'vue';
    import { useMenusStore } from '../../stores/menus';
    import { useUsersStore } from '../../stores/users';
    import Modal from '../Modal.vue';

    const menuStore = useMenusStore();
    const userStore = useUsersStore();

    const props = defineProps({
        id: {
            required: true,
            type: String
        }
    });

    const menuData = ref({});
    const requestsData = ref([]);
    const mealsData = ref([]);
    const showAlert = ref(true);
    const todayDate = new Date().toISOString().slice(0, 10);
    const errorModalMessage = ref('');
    const showModalConfirm = ref(false);
    const statusMessage = ref('');
    const target = ref({});
    const action = ref('');

    await initData();

    async function initData() {
        const {menu, errorMenu} = await menuStore.getMenu(props.id);
        menuData.value = menu.value;
        const {requests, errorRequests} = await menuStore.getRequests(menuData.value.requests);
        requestsData.value = requests.value;
        const {meals, errorMeals} = await menuStore.getMeals(menuData.value.meals);
        mealsData.value = meals.value;

        const outdatedMeals = mealsData.value.filter(meal => meal.scheduledDate < todayDate);

        if(outdatedMeals.length != 0) {
            outdatedMeals.forEach(async (item) => {
                await menuStore.updateMeal(item.id, {scheduledDate: ''});
            });
        }
    }

    function showScheduleModal(targetOption, actionOption) {
        target.value = targetOption;
        action.value = actionOption;
        errorModalMessage.value = '';
        statusMessage.value = action.value == 'cooked' 
            ? '¿Quieres actualizar "' + target.value.name + '" como cocinado el día de hoy?' 
            : '¿Quieres actualizar "' + target.value.name + '" como no cocinado hoy?';

        showModalConfirm.value = true;
    }

    async function manageScheduledMeal() {
        const data = action.value == 'cooked' ? {scheduledDate: '', lastDate: todayDate} : {scheduledDate: ''} ;

        const { error } = await menuStore.updateMeal(target.value.id, data);
        if(error.value != ''){
            errorModalMessage.value = error.value;
            return;
        }

        showModalConfirm.value = false;
        await initData();
    }

</script>

<template>
    <div class="relative py-8 px-10 w-full flex flex-col justify-center items-center space-y-8 bg-slate-100 rounded-xl shadow-xl">
        <h1 class="font-signika-negative font-semibold text-xl md:text-3xl text-center text-slate-600 w-full pb-2 border-b-2 border-slate-600">
            {{ menuData.name }}
        </h1>
        <div v-if="(requestsData.length > 0 && showAlert)" class="py-2 px-4 w-full flex justify-between items-center bg-teal-500 bg-opacity-40 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="hidden sm:block h-7 w-7 text-white" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/> </svg>
            <router-link :to="{name: 'MenuSettings', props: {id: props.id}}" class="font-medium font-signika-negative text-slate-600 text-center text-base sm:text-lg hover:drop-shadow-lg">
                Hay nuevas solicitudes
            </router-link>
            <button @click="showAlert = false" class="w-fit ease-in-out hover:drop-shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-7 w-7 text-slate-600" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>
            </button>
        </div>

        <div v-if="mealsData.filter(meal => meal.scheduledDate == todayDate).length != 0" class="overflow-auto h-auto max-h-48 w-full flex flex-col justify-center items-center py-2 px-4 space-y-2 bg-white rounded-xl border border-slate-300 shadow-sm">
            <p class="font-medium font-signika-negative text-slate-700 text-base sm:text-xl">
                Agendado para hoy
            </p>
            <div v-for="meal in mealsData.filter(meal => meal.scheduledDate == todayDate)" :key="meal.id" class="w-full flex justify-between items-center py-1 px-3 bg-white rounded-xl border border-slate-300 shadow-sm">
                <p class="font-medium font-signika-negative text-slate-600 text-sm sm:text-lg">
                    {{ meal.name }}
                </p>
                <div class="flex justify-center space-x-2">
                    <button @click="showScheduleModal(meal, 'cooked')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-teal-600 rounded-3xl ease-in-out hover:bg-teal-700 drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-5 w-5 text-white" viewBox="0 0 16 16"> <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/> </svg>
                    </button>
                    <button @click="showScheduleModal(meal, 'not cooked')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-rose-600 rounded-3xl ease-in-out hover:bg-rose-700 drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-5 w-5 text-white" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>
                    </button>
                </div>
            </div>
        </div>

        <router-link :to="{name: 'MenuWeeklySchedule', params: {id: props.id}}" class="py-1 px-4 w-fit font-signika-negative font-medium text-lg rounded-xl text-slate-100 bg-sky-600 ease-in-out hover:bg-sky-700 hover:drop-shadow-md">
            Plan semanal
        </router-link>
        <router-link :to="{name: 'Dashboard'}" class="absolute -top-2 sm:-top-1 left-8 p-2 hover:ease-in-out hover:duration-200 hover:-translate-x-2 hover:drop-shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-7 w-7 text-slate-600" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/> </svg>
        </router-link>

        <Teleport to="body">
            <Modal :show="showModalConfirm" @close="showModalConfirm = false">
                <template #header>
                    <h3 class="font-signika-negative font-medium text-base md:text-xl text-center text-slate-600">
                        Comidas agendadas
                    </h3>
                </template>
                <template #body>
                    <p class="font-medium font-signika-negative text-slate-600 text-lg">
                        {{ statusMessage }}
                    </p>
                    <div v-if="errorModalMessage" class="mb-8 relative w-full">
                        <p class="font-signika-negative font-medium text-lg text-rose-500 text-center">{{ errorModalMessage }}</p>
                    </div>
                </template>
                <template #footer>
                    <div class="flex justify-between w-full">
                        <button @click="manageScheduledMeal()" class="text-slate-100 font-medium font-signika-negative bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm sm:text-lg px-3 py-1.5 text-center">
                            Aceptar
                        </button>
                        <button @click="showModalConfirm = false" class="text-slate-100 font-medium font-signika-negative bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm sm:text-lg px-3 py-1.5 text-center">
                            Cancelar
                        </button>
                    </div>
                </template>
            </Modal>
        </Teleport>
    </div>
</template>