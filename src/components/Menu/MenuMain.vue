<script setup>
    import { ref, computed } from 'vue';
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
    const ingredientsData = ref([]);
    const mealsSuggestionsData = ref([]);
    const showAlert = ref(true);  
    const errorModalMessage = ref('');
    const showModalConfirm = ref(false);
    const statusMessage = ref('');
    const target = ref({});
    const action = ref('');
    const showModalIngredients = ref(false);
    const searchInput = ref('');

    const ingredientsFilter = computed(() => ingredientsData.value.filter(item => item.name.toUpperCase().includes(searchInput.value.toUpperCase())));

    await initData();

    function todayDate() {
        let temp = new Date().toLocaleDateString().split('/');
        return temp[2] + "-" + (temp[1] < 10 ? '0'.concat(temp[1]) : temp[1]) + "-" + (temp[0] < 10 ? '0'.concat(temp[0]) : temp[0]);
    }

    async function initData() {
        const {menu, errorMenu} = await menuStore.getMenu(props.id);
        menuData.value = menu.value;
        const {requests, errorRequests} = await menuStore.getRequests(menuData.value.requests);
        requestsData.value = requests.value;
        const {meals, errorMeals} = await menuStore.getMeals(menuData.value.meals);
        mealsData.value = meals.value;
        const {ingredients, errorIngredients} = await menuStore.getIngredients(menuData.value.ingredients);
        ingredientsData.value = ingredients.value;

        const outdatedMeals = mealsData.value.filter(meal => meal.scheduledDate < todayDate() && meal.scheduledDate.length > 0);

        if(outdatedMeals.length != 0) {
            outdatedMeals.forEach(async (item) => {
                await menuStore.updateMeal(item.id, {scheduledDate: ''});
            });
        }

        mealsSuggestionsData.value = menuStore.getSuggestionsList(mealsData.value, menuData.value.variety);
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
        const data = action.value == 'cooked' ? {scheduledDate: '', lastDate: todayDate()} : {scheduledDate: ''} ;

        const { error } = await menuStore.updateMeal(target.value.id, data);
        if(error.value != ''){
            errorModalMessage.value = error.value;
            return;
        }

        showModalConfirm.value = false;
        await initData();
    }

    function filterMealsSuggestions() {
        mealsSuggestionsData.value = menuStore.getSuggestionsList(mealsData.value, menuData.value.variety, ingredientsFilter.value.filter(e => e.check == true).map(f => f.id));
        showModalIngredients.value = false;
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

        <div v-if="mealsData.filter(meal => meal.scheduledDate == todayDate()).length != 0" class="overflow-auto h-auto max-h-48 w-full flex flex-col justify-center items-center py-2 px-4 space-y-2 bg-white rounded-xl border border-slate-300 shadow-sm">
            <p class="font-medium font-signika-negative text-slate-700 text-base sm:text-xl">
                Agendado para hoy
            </p>
            <div v-for="meal in mealsData.filter(meal => meal.scheduledDate == todayDate())" :key="meal.id" class="w-full flex justify-between items-center py-1 px-3 bg-white rounded-xl border border-slate-300 shadow-sm">
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

        <div class="overflow-auto h-auto max-h-96 w-full flex flex-col justify-center items-center py-2 px-4 space-y-2 bg-white rounded-xl border border-slate-300 shadow-sm">
            <p class="font-medium font-signika-negative text-slate-700 text-base sm:text-xl">
                Sugerencias para cocinar
            </p>
            <template v-if="mealsSuggestionsData.length != 0">
                <div v-for="meal in mealsSuggestionsData" :key="meal.id" class="w-full flex justify-between items-center py-1 px-3 bg-white rounded-xl border border-slate-300 shadow-sm">
                    <p class="font-medium font-signika-negative text-slate-600 text-sm sm:text-lg">
                        {{ meal.name }}
                    </p>
                    <div class="flex justify-center">
                        <router-link :to="{name: 'MealsEdit', params: {id: props.id, mealId: meal.id}}" class="p-2 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-sky-600 rounded-3xl ease-in-out hover:bg-sky-700 drop-shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-3 w-3 sm:h-5 sm:w-5 text-white" viewBox="0 0 16 16"> <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/> <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/> </svg>
                        </router-link>
                    </div>
                </div>
            </template>
            <template v-else>
                <p class="font-normal font-signika-negative text-slate-600 text-sm sm:text-lg text-center">
                    No hay sugerencias para este menu
                </p>
            </template>
            <button @click="showModalIngredients = true" class="py-1 px-3 w-fit font-signika-negative font-medium text-sm sm:text-xl text-slate-100 bg-sky-600 rounded-xl ease-in-out hover:bg-sky-700 drop-shadow-md">
                Filtrar por ingredientes
            </button>
        </div>

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

        <Teleport to="body">
            <Modal :show="showModalIngredients" @close="showModalIngredients = false; searchInput = '';">
                <template #header>
                    <h3 class="font-signika-negative font-medium text-base md:text-xl text-center text-slate-600">
                        Ingredientes
                    </h3>
                </template>
                <template #body>
                    <div class="flex justify-center">
                        <router-link :to="{name: 'IngredientsIndex', params: {id: props.id}}" class="font-medium font-signika-negative text-sky-600 text-center text-base sm:text-lg underline hover:text-sky-800">
                            Gestionar ingredientes
                        </router-link>
                    </div>
                    <div class="relative w-full">
                        <input type="text" autocomplete="off" id="search" placeholder="search" v-model="searchInput" class="peer mt-0 w-full bg-white border border-slate-300 px-2.5 py-1 rounded-xl placeholder:text-transparent focus:border-sky-600 focus:ring-2 focus:ring-offset-0 focus:ring-offset-sky-600 focus:ring-opacity-60">
                        <label for="search" class="absolute -top-[0.3rem] bg-slate-100 leading-none left-2.5 origin-left px-0.5 -translate-y-1/2 transform text-sm text-center text-slate-700 transition-all duration-100 ease-in-out font-signika-negative peer-placeholder-shown:bg-white peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-focus:bg-slate-100 peer-focus:leading-none peer-focus:-top-[0.3rem] peer-focus:px-0.5 peer-focus:text-sm peer-focus:text-slate-800">
                            Buscar
                        </label>
                    </div>
                    <div v-if="ingredientsFilter.length != 0" class="overflow-auto h-60 space-y-3">
                        <fieldset>
                            <div class="mb-6" v-for="ingredient in ingredientsFilter" :key="ingredient.id">
                                <div class="flex items-center">
                                    <input type="checkbox" :id="ingredient.id" v-model="ingredient.check" class="h-4 w-4 text-sky-500 bg-gray-100 border-gray-300 rounded-lg transition ease-in-out duration-200 cursor-pointer" />
                                    <label :for="ingredient.id" class="ml-3 font-medium font-signika-negative text-slate-600">{{ ingredient.name }}</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </template>
                <template #footer>
                    <div class="flex justify-between w-full">
                        <button @click="filterMealsSuggestions()" class="text-slate-100 font-medium font-signika-negative bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm sm:text-lg px-3 py-1.5 text-center">
                            Aceptar
                        </button>
                        <button @click="showModalIngredients = false; searchInput = '';" class="text-slate-100 font-medium font-signika-negative bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm sm:text-lg px-3 py-1.5 text-center">
                            Cancelar
                        </button>
                    </div>
                </template>
            </Modal>
        </Teleport>
    </div>
</template>