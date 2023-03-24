<script async setup>
    import { ref } from 'vue';
    import { useMenusStore } from '../../stores/menus';
    import "vue-select/dist/vue-select.css";
    import Modal from '../Modal.vue';

    const menuStore = useMenusStore();

    const props = defineProps({
        id: {
            required: true,
            type: String
        }
    });

    const dates = ref([]);
    const menuData = ref({});
    const mealsData = ref([]);
    const currentTab = ref('current');
    const selectedMeal = ref([null, null, null, null, null, null, null]);
    const showModalConfirm = ref(false);
    const target = ref({});
    const action = ref('');
    const selectedDate = ref('');
    const statusMessage = ref('');
    const errorMessage = ref('');

    await initData();

    async function initData() {
        const {menu, errorMenu} = await menuStore.getMenu(props.id);
        menuData.value = menu.value;
        const {meals, errorMeals} = await menuStore.getMeals(menuData.value.meals);
        mealsData.value = meals.value;

        calcWeek(currentTab.value);
    }

    function calcWeek(week) {
        dates.value = [];
        selectedMeal.value = [null, null, null, null, null, null, null];

        dates.value = menuStore.calculateWeekDates(week);
        currentTab.value = week;
    }

    function showActionModal(targetAction, dateOption, actionOption){
        if(!targetAction){
            return;
        }

        errorMessage.value = '';
        target.value = targetAction;
        selectedDate.value = dateOption;
        action.value = actionOption;

        let existingDateMessage = '';

        if(target.value.scheduledDate != ''){
            let copyDate = target.value.scheduledDate.slice().split('-');
            let scheduledDate = new Date(copyDate[0], (copyDate[1] - 1), copyDate[2]);
            existingDateMessage = ' Ya no se contará como agendado para el ' + (scheduledDate.getDate() < 10 ? "0".concat(scheduledDate.getDate()) : scheduledDate.getDate()) + "/" + ((scheduledDate.getMonth() + 1) < 10 ? "0".concat((scheduledDate.getMonth() + 1)) : (scheduledDate.getMonth() + 1)) + "/" + scheduledDate.getFullYear() + ".";
        }

        let parsedDate = (selectedDate.value.day < 10 ? "0".concat(selectedDate.value.day) : selectedDate.value.day) + "/" + (selectedDate.value.month < 10 ? "0".concat(selectedDate.value.month) : selectedDate.value.month) + "/" + selectedDate.value.year;

        statusMessage.value = 
            action.value == 'schedule' 
            ? '¿Quieres agendar ' + target.value.name + ' para el ' + parsedDate + '?' + existingDateMessage 
            : '¿Quieres quitar ' + target.value.name + ' para el ' + parsedDate + '?';

        showModalConfirm.value = true;
    }

    async function manageScheduleMeal(){
        const newScheduledDate = action.value == 'schedule' ? selectedDate.value.fullDate : '';
        const { error } = await menuStore.updateMeal(target.value.id, {scheduledDate: newScheduledDate});

        if(error.value != ''){
            errorMessage.value = error.value;
            return;
        }

        showModalConfirm.value = false;
        await initData();
    }

</script>

<template>
    <div class="relative py-8 px-6 w-full items-center space-y-5 bg-slate-100 rounded-xl shadow-xl">
        <h1 class="font-signika-negative font-semibold text-xl md:text-3xl text-center text-slate-600 w-full pb-2 border-b-2 border-slate-600">
            Plan semanal
        </h1>
        <div class="flex justify-center space-x-3">
            <button @click="calcWeek('current')" class="py-1 px-1 sm:px-2 font-signika-negative font-medium text-base sm:text-lg ease-in-out duration-75" :class="currentTab == 'current' ? ['text-sky-600 border-sky-600 border-b-4 hover:text-sky-800 hover:border-sky-800'] : ['text-slate-700 border-b-2 border-slate-700 hover:border-slate-800 hover:text-slate-800 hover:border-b-4']">
                Semana actual
            </button>
            <button @click="calcWeek('next')" class="py-1 px-1 sm:px-2 font-signika-negative font-medium text-base sm:text-lg ease-in-out duration-75" :class="currentTab == 'next' ? ['text-sky-600 border-sky-600 border-b-4 hover:text-sky-800 hover:border-sky-800'] : ['text-slate-700 border-b-2 border-slate-700 hover:border-slate-800 hover:text-slate-800 hover:border-b-4']">
                Siguiente semana
            </button>
            <button @click="calcWeek('two')" class="py-1 px-1 sm:px-2 font-signika-negative font-medium text-base sm:text-lg ease-in-out duration-75" :class="currentTab == 'two' ? ['text-sky-600 border-sky-600 border-b-4 hover:text-sky-800 hover:border-sky-800'] : ['text-slate-700 border-b-2 border-slate-700 hover:border-slate-800 hover:text-slate-800 hover:border-b-4']">
                En 2 semanas
            </button>
        </div>

        <div class="overflow-auto h-[18.5rem] space-y-3">
            <div v-for="(date, index) in dates" :key="date" class="flex flex-col justify-center items-center py-2 px-4 space-y-2 bg-white rounded-xl border border-slate-300 shadow-sm">
                <p class="font-medium font-signika-negative text-slate-700 text-base sm:text-xl">
                    {{ date.weekday + " " + (date.day < 10 ? "0".concat(date.day) : date.day) + "/" + (date.month < 10 ? "0".concat(date.month) : date.month) + "/" + date.year }}
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center sm:justify-between w-full space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
                    <v-select class="w-full font-signika-negative font-medium text-xs sm:text-lg text-slate-600" :options="mealsData" :getOptionLabel="meal => meal.name" :selectable="(meal) => meal.scheduledDate != date.fullDate" v-model="selectedMeal[index]">
                        <template #no-options="{ search, searching }">
                            <template v-if="searching">
                                No se encontraron resultados
                            </template>
                        </template>
                    </v-select>
                    <button @click="showActionModal(selectedMeal[index], date, 'schedule')" class="py-1 px-3 w-fit font-signika-negative font-medium text-sm sm:text-xl text-slate-100 bg-sky-600 rounded-xl ease-in-out hover:bg-sky-700 drop-shadow-md">
                        Agendar
                    </button>
                </div>
                <div v-for="meal in mealsData.filter(e => e.scheduledDate == date.fullDate)" :key="meal.id" class="w-full flex justify-between items-center py-1 px-3 bg-white rounded-xl border border-slate-300 shadow-sm">
                    <p class="font-medium font-signika-negative text-slate-600 text-sm sm:text-lg">
                        {{ meal.name }}
                    </p>
                    <button @click="showActionModal(meal, date, 'remove')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-rose-600 rounded-3xl ease-in-out hover:bg-rose-700 drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-5 w-5 text-white" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>
                    </button>
                </div>
            </div>
        </div>

        <router-link :to="{name: 'MenuIndex', props: {id: props.id}}" class="absolute top-1 sm:top-2 left-8 p-2 hover:ease-in-out hover:duration-200 hover:-translate-x-2 hover:drop-shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-7 w-7 text-slate-600" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/> </svg>
        </router-link>

        <Teleport to="body">
            <Modal :show="showModalConfirm" @close="showModalConfirm = false">
                <template #header>
                    <h3 class="font-signika-negative font-medium text-base md:text-xl text-center text-slate-600">
                        Agendar comida
                    </h3>
                </template>
                <template #body>
                    <p class="font-medium font-signika-negative text-slate-600 text-lg">
                        {{ statusMessage }}
                    </p>
                    <div v-if="errorMessage" class="mb-8 relative w-full">
                        <p class="font-signika-negative font-medium text-base text-rose-500 text-center">{{ errorMessage }}</p>
                    </div>
                </template>
                <template #footer>
                    <div class="flex justify-between w-full">
                        <button @click="manageScheduleMeal()" class="text-slate-100 font-medium font-signika-negative bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm sm:text-lg px-3 py-1.5 text-center">
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

<style scoped>

</style>