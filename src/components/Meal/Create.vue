<script setup>
    import { onBeforeMount, ref, reactive } from 'vue';
    import { useMenusStore } from '../../stores/menus';
    import ModalVue from '../Modal.vue';

    const menuStore = useMenusStore();

    const props = defineProps({
        id: {
            required: true,
            type: String
        }
    });

    const showModalIngredients = ref(false);
    const ingredientsData = ref({});
    const meal = reactive({
        name: '',
        description: '',
        ingredients: [],
        duration: '',
        lastDate: '',
        scheduledDate: ''
    });

    onBeforeMount(async () => {
        const {menu, errorMenu} = await menuStore.getMenu(props.id);
        const {ingredients, errorIngredients} = await menuStore.getIngredients(menu.value.ingredients);
        ingredientsData.value = ingredients.value;
    });

</script>

<template>
    <div class="mx-auto max-w-7xl h-full flex justify-center items-center">
        <div class="relative py-14 px-10 w-3/4 flex flex-col justify-center bg-slate-100 rounded-xl shadow-xl">
            <h1 class="font-signika-negative font-semibold text-3xl text-center text-slate-600">Nueva comida</h1>
            <form class="flex flex-col items-center justify-center w-full px-6 mt-8">
                <div class="mb-6 relative w-full">
                    <input type="text" id="name" placeholder="Nombre" v-model="meal.name" class="peer mt-1 w-full bg-opacity-0 bg-slate-100 border-b-2 border-slate-600 px-0 py-2 placeholder:text-transparent focus:border-slate-800 focus:outline-none">
                    <label for="name" class="font-signika-negative pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-slate-600 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-placeholder-shown:font-signika-negative peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-slate-800">
                        Nombre
                    </label>
                </div>
                <div class="mb-6 relative w-full">
                    <textarea id="description" v-model="meal.description" class="peer mt-1 w-full bg-opacity-0 bg-slate-100 border-b-2 border-slate-600 px-0 py-2 placeholder:text-transparent focus:border-slate-800 focus:outline-none"></textarea>
                    <label for="description" class="font-signika-negative pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-slate-600 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-placeholder-shown:font-signika-negative peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-slate-800">
                        Descripción
                    </label>
                </div>
                <div class="mb-6 relative w-full">
                    <select v-model="meal.duration" id="duration" class="mt-2 w-full bg-slate-100 border-b-2 border-slate-600 p-2.5 text-sm text-slate-600 transition ease-in-out focus:border-slate-800 focus:outline-none">
                        <option value="corta">{{ "Corta" }}</option>
                        <option value="media">{{ "Media" }}</option>
                        <option value="larga">{{ "Larga" }}</option>
                    </select>
                    <label for="duration" class="absolute top-0 left-0 origin-left pl-0 -translate-y-1/2 opacity-75 transform text-sm text-slate-600 font-signika-negative">
                        Duración
                    </label>
                </div>
                <div class="mb-6 relative w-full">
                    <input type="date" id="lastDate" v-model="meal.lastDate" class="peer mt-1 w-full bg-opacity-0 bg-slate-100 border-b-2 border-slate-600 px-0 py-2 placeholder:text-transparent focus:border-slate-800 focus:outline-none">
                    <label for="lastDate" class="font-signika-negative pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-slate-600 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-placeholder-shown:font-signika-negative peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-slate-800">
                        Última vez cocinado
                    </label>
                </div>
                <div class="mb-6 relative w-full">
                    <input type="date" id="scheduledDate" v-model="meal.scheduledDate" class="peer mt-1 w-full bg-opacity-0 bg-slate-100 border-b-2 border-slate-600 px-0 py-2 placeholder:text-transparent focus:border-slate-800 focus:outline-none">
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
                        <div class="overflow-auto h-60 space-y-3">
                            <fieldset>
                                <div class="mb-6" v-for="ingredient in ingredientsData" :key="ingredient.id">
                                    <div class="flex items-center">
                                        <input type="checkbox" :id="ingredient.id" v-model="meal.ingredients" class="h-4 w-4 text-sky-500 bg-gray-100 border-gray-300 rounded-lg transition ease-in-out duration-200 cursor-pointer" />
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