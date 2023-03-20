<script setup>
    import { onBeforeMount, ref } from 'vue';
    import { useMenusStore } from '../../stores/menus';
    import { useRouter } from 'vue-router';
    import Modal from '../Modal.vue';

    const router = useRouter();
    const menuStore = useMenusStore();

    const props = defineProps({
        id: {
            required: true,
            type: String
        },
        mealId: {
            required: true,
            type: String
        }
    });

    const errorMessage = ref('');
    const showModalIngredients = ref(false);
    const mealData = ref({});
    const ingredientsData = ref([]);

    onBeforeMount(async () => {
        const {menu, errorMenu} = await menuStore.getMenu(props.id);
        const {meal, errorMeal} = await menuStore.getMeal(props.mealId);
        mealData.value = meal.value;

        const {ingredients, errorIngredients} = await menuStore.getIngredients(menu.value.ingredients);
        ingredientsData.value = ingredients.value.map(menuIngr => ({id: menuIngr.id, name: menuIngr.name, check: meal.value.ingredients.findIndex(mealIngrId => mealIngrId == menuIngr.id) != -1 ? true : false}));
    }); 

    async function editMeal(){
        const {id:_, ...parsedData} = mealData.value;
        parsedData.ingredients = ingredientsData.value.filter(e => e.check == true).map(f => f.id);

        const { error } = await menuStore.updateMeal(props.mealId, parsedData);

        if(error.value != ''){
            errorMessage.value = error.value;
            return;
        }

        router.push({name: 'MealsIndex', params: {id: props.id}});
    }

</script>

<template>
    <div class="mx-auto max-w-7xl h-full flex justify-center items-center">
        <div class="relative py-14 px-10 w-3/4 flex flex-col justify-center bg-slate-100 rounded-xl shadow-xl">
            <h1 class="font-signika-negative font-semibold text-xl md:text-3xl text-center text-slate-600">Editar comida</h1>
            <div v-if="errorMessage" class="py-2 px-4 w-full flex justify-between items-center bg-rose-500 bg-opacity-40 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="hidden sm:block h-7 w-7 text-white" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/> </svg>
                <h2 class="font-medium font-signika-negative text-rose-600 text-center text-base sm:text-lg">
                    {{ errorMessage }}
                </h2>
                <button @click="errorMessage = ''" class="w-fit ease-in-out hover:drop-shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-7 w-7 text-slate-600" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>
                </button>
            </div>
            <form @submit.prevent="editMeal()" class="flex flex-col items-center justify-center w-full px-6 mt-8">
                <div class="mb-6 relative w-full">
                    <input type="text" id="name" placeholder="Nombre" v-model="mealData.name" class="peer mt-1 w-full bg-opacity-0 bg-slate-100 border-b-2 border-slate-600 px-0 py-2 placeholder:text-transparent focus:border-slate-800 focus:outline-none">
                    <label for="name" class="font-signika-negative pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-slate-600 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-placeholder-shown:font-signika-negative peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-slate-800">
                        Nombre
                    </label>
                </div>
                <div class="mb-6 relative w-full">
                    <textarea id="description" v-model="mealData.description" class="peer mt-1 w-full bg-opacity-0 bg-slate-100 border-b-2 border-slate-600 px-0 py-2 placeholder:text-transparent focus:border-slate-800 focus:outline-none"></textarea>
                    <label for="description" class="font-signika-negative pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-slate-600 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-placeholder-shown:font-signika-negative peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-slate-800">
                        Descripción
                    </label>
                </div>
                <div class="mb-6 relative w-full flex justify-center">
                    <button type="button" @click="showModalIngredients = true" class="py-1 px-2 w-fit font-signika-negative font-medium text-base rounded-xl text-slate-100 bg-sky-600 ease-in-out hover:bg-sky-700 hover:drop-shadow-md">
                        Seleccionar ingredientes
                    </button>
                </div>
                <div class="mb-6 relative w-full">
                    <select v-model="mealData.duration" id="duration" class="mt-2 w-full bg-slate-100 border-b-2 border-slate-600 p-2.5 text-sm text-slate-600 transition ease-in-out focus:border-slate-800 focus:outline-none">
                        <option value="corta">{{ "Corta" }}</option>
                        <option value="media">{{ "Media" }}</option>
                        <option value="larga">{{ "Larga" }}</option>
                    </select>
                    <label for="duration" class="absolute top-0 left-0 origin-left pl-0 -translate-y-1/2 opacity-75 transform text-sm text-slate-600 font-signika-negative">
                        Duración
                    </label>
                </div>
                <div class="mb-6 relative w-full">
                    <input type="date" id="lastDate" v-model="mealData.lastDate" class="peer mt-1 w-full bg-opacity-0 bg-slate-100 border-b-2 border-slate-600 px-0 py-2 placeholder:text-transparent focus:border-slate-800 focus:outline-none">
                    <label for="lastDate" class="font-signika-negative pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-slate-600 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-placeholder-shown:font-signika-negative peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-slate-800">
                        Última vez cocinado
                    </label>
                </div>
                <div class="mb-6 relative w-full">
                    <input type="date" id="scheduledDate" v-model="mealData.scheduledDate" class="peer mt-1 w-full bg-opacity-0 bg-slate-100 border-b-2 border-slate-600 px-0 py-2 placeholder:text-transparent focus:border-slate-800 focus:outline-none">
                    <label for="scheduledDate" class="font-signika-negative pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-slate-600 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-placeholder-shown:font-signika-negative peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-slate-800">
                        Agendado para
                    </label>
                </div>
                <button type="submit" class="py-1 px-4 w-fit font-signika-negative font-medium text-lg rounded-xl text-slate-100 bg-sky-600 ease-in-out hover:bg-sky-700 hover:drop-shadow-md">
                    Continuar
                </button>
            </form>
            <router-link :to="{name: 'MealsIndex', params: {id: props.id}}" class="absolute top-2 left-3 p-2 hover:ease-in-out hover:duration-200 hover:-translate-x-2 hover:drop-shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-7 w-7 text-slate-600" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/> </svg>
            </router-link>
            <Teleport to="body">
                <Modal :show="showModalIngredients" @close="showModalIngredients = false">
                    <template #header>
                        <h3 class="font-signika-negative font-medium text-base md:text-xl text-center text-slate-600">
                            Ingredientes
                        </h3>
                    </template>
                    <template #body>
                        <div class="flex justify-center">
                            <router-link :to="{name: 'IngredientsIndex', params: {id: props.id}}" class="font-medium font-signika-negative text-sky-600 text-center text-base sm:text-lg text-center underline hover:text-sky-800">
                                Gestionar ingredientes
                            </router-link>
                        </div>
                        <div v-if="ingredientsData.length != 0" class="overflow-auto h-60 space-y-3">
                            <fieldset>
                                <div class="mb-6" v-for="ingredient in ingredientsData" :key="ingredient.id">
                                    <div class="flex items-center">
                                        <input type="checkbox" :id="ingredient.id" v-model="ingredient.check" class="h-4 w-4 text-sky-500 bg-gray-100 border-gray-300 rounded-lg transition ease-in-out duration-200 cursor-pointer" />
                                        <label :for="ingredient.id" class="ml-3 font-medium font-signika-negative text-slate-600">{{ ingredient.name }}</label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </template>
                </Modal>
            </Teleport>
        </div>
    </div>
</template>

<style scoped>

</style>