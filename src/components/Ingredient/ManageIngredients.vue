<script async setup>
    import { ref, computed } from 'vue';
    import { useMenusStore } from '../../stores/menus';
    import Modal from '../Modal.vue';

    const menuStore = useMenusStore();

    const props = defineProps({
        id: {
            required: true,
            type: String
        }
    });

    const menuData = ref({});
    const ingredientsData = ref([]);

    const inputModalIngredient = ref('');
    const showModalConfirm = ref(false);
    const target = ref({});
    const action = ref('');
    const errorModalMessage = ref('');
    const searchInput = ref('');

    const ingredientsFilter = computed(() => ingredientsData.value.filter(item => item.name.toUpperCase().includes(searchInput.value.toUpperCase())));

    await initData();

    async function initData(){
        const {menu, errorMenu} = await menuStore.getMenu(props.id);
        menuData.value = menu.value;
        const {ingredients, errorIngredients} = await menuStore.getIngredients(menuData.value.ingredients);
        ingredientsData.value = ingredients.value;
    }

    function showActionModal(targetIngredient, targetAction){
        action.value = targetAction;
        target.value = targetIngredient;
        showModalConfirm.value = true;
        errorModalMessage.value = '';
        if (action.value == 'edit') inputModalIngredient.value = target.value.name;
    }

    async function addIngredient(){
        action.value = 'add';
        errorModalMessage.value = '';
        inputModalIngredient.value = '';
        showModalConfirm.value = true;
    }

    async function manageIngredient(){
        switch(action.value){
            case 'edit':
                if(inputModalIngredient.value == ''){
                    errorModalMessage.value = 'El nombre no puede estar vacío';
                    return;
                }
                await menuStore.updateIngredient(target.value.id, {name: inputModalIngredient.value});
            break;

            case 'add':
                if(inputModalIngredient.value == ''){
                    errorModalMessage.value = 'El nombre no puede estar vacío';
                    return;
                }
                await menuStore.createIngredient(props.id, {name: inputModalIngredient.value});
            break;

            case 'delete':
                const {error} = await menuStore.deleteIngredient(props.id, target.value.id, menuData.value.meals);
                if(error.value != ''){
                    errorModalMessage.value = error.value;
                    return;
                }
            break;
        }

        showModalConfirm.value = false;
        await initData();
        action.value = '';
        target.value = '';
        inputModalIngredient.value = '';
        errorModalMessage.value = '';
    }

</script>

<template>
    <div class="relative py-8 px-10 w-full items-center space-y-5 bg-slate-100 rounded-xl shadow-xl">
        <h1 class="font-signika-negative font-semibold text-xl md:text-3xl text-center text-slate-600 w-full pb-2 border-b-2 border-slate-600">
            Ingredientes
        </h1>

        <div class="relative w-full">
            <input type="text" autocomplete="off" id="search" placeholder="search" v-model="searchInput" class="peer mt-0 w-full bg-white border border-slate-300 px-2.5 py-1 rounded-xl placeholder:text-transparent focus:border-sky-600 focus:ring-2 focus:ring-offset-0 focus:ring-offset-sky-600 focus:ring-opacity-60">
            <label for="search" class="absolute -top-[0.3rem] bg-slate-100 leading-none left-2.5 origin-left px-0.5 -translate-y-1/2 transform text-sm text-center text-slate-700 transition-all duration-100 ease-in-out font-signika-negative peer-placeholder-shown:bg-white peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-focus:bg-slate-100 peer-focus:leading-none peer-focus:-top-[0.3rem] peer-focus:px-0.5 peer-focus:text-sm peer-focus:text-slate-800">
                Buscar
            </label>
        </div>

        <div v-if="ingredientsData.length != 0" class="overflow-auto h-auto max-h-[18.5rem] space-y-3">
            <div v-for="ingredient in ingredientsFilter" :key="ingredient.id" class="flex justify-between items-center py-2 px-4 bg-white rounded-xl border border-slate-300 shadow-sm">
                <p class="font-normal font-signika-negative text-slate-600 text-sm sm:text-lg">
                    {{ ingredient.name }}
                </p>
                <div class="flex justify-end space-x-1 sm:space-x-2">
                    <button @click="showActionModal(ingredient, 'edit')" class="p-2 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-sky-600 rounded-3xl ease-in-out hover:bg-sky-700 drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-3 w-3 sm:h-5 sm:w-5 text-white" viewBox="0 0 16 16"> <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/> <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/> </svg>
                    </button>
                    <button @click="showActionModal(ingredient, 'delete')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-rose-600 rounded-3xl ease-in-out hover:bg-rose-700 drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>
                    </button>
                </div>
            </div>
            <p v-if="ingredientsFilter.length == 0" class="font-normal font-signika-negative text-slate-600 text-sm sm:text-lg text-center">
                No hay resultados
            </p>
        </div>
        <div class="flex justify-center">
            <button @click="addIngredient()" class="py-1 px-3 w-fit font-signika-negative font-medium text-sm sm:text-xl text-slate-100 bg-sky-600 rounded-xl ease-in-out hover:bg-sky-700 drop-shadow-md">
                Agregar
            </button>
        </div>
        <router-link :to="{name: 'MenuIndex', props: {id: props.id}}" class="absolute top-1 sm:top-2 left-8 p-2 hover:ease-in-out hover:duration-200 hover:-translate-x-2 hover:drop-shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-7 w-7 text-slate-600" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/> </svg>
        </router-link>

        <Teleport to="body">
            <Modal :show="showModalConfirm" @close="showModalConfirm = false">
                <template #header>
                    <h3 class="font-signika-negative font-medium text-base md:text-xl text-center text-slate-600">
                        Ingredientes
                    </h3>
                </template>
                <template #body>
                    <p v-if="action == 'delete'" class="font-medium font-signika-negative text-slate-600 text-lg">
                        {{ "¿Quieres eliminar " + target.name + " del menu?" }}
                    </p>
                    <div v-else class="mb-6 relative w-full">
                        <input required type="text" id="name" placeholder="Nombre" v-model="inputModalIngredient" class="peer mt-0 w-full bg-white border border-slate-300 px-2.5 py-1 rounded-xl placeholder:text-transparent focus:border-sky-600 focus:ring-2 focus:ring-offset-0 focus:ring-offset-sky-600 focus:ring-opacity-60">
                        <label for="name" class="absolute -top-[0.3rem] bg-white leading-none left-2.5 origin-left px-0.5 -translate-y-1/2 transform text-sm text-center text-slate-700 transition-all duration-100 ease-in-out font-signika-negative peer-placeholder-shown:bg-white peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-focus:bg-white peer-focus:leading-none peer-focus:-top-[0.3rem] peer-focus:px-0.5 peer-focus:text-sm peer-focus:text-slate-800">
                            Nombre
                        </label>
                    </div>
                    <div v-if="errorModalMessage" class="mb-8 relative w-full">
                        <p class="font-signika-negative font-medium text-lg text-rose-500 text-center">{{ errorModalMessage }}</p>
                    </div>
                </template>
                <template #footer>
                    <div class="flex justify-between w-full">
                        <button @click="manageIngredient()" class="text-slate-100 font-medium font-signika-negative bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm sm:text-lg px-3 py-1.5 text-center">
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