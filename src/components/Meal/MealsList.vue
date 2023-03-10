<script async setup>
    import { ref } from 'vue';
    import { useMenusStore } from '../../stores/menus';
    import { useRouter } from 'vue-router';
    import Modal from '../Modal.vue';

    const menuStore = useMenusStore();
    const router = useRouter();

    const props = defineProps({
        id: {
            required: true,
            type: String
        }
    });

    const {menu, errorMenu} = await menuStore.getMenu(props.id);
    const {meals, errorMeals} = await menuStore.getMeals(menu.value.meals);

</script>

<template>
    <div class="py-8 px-10 w-full flex flex-col justify-center items-center space-y-8 bg-white bg-opacity-20 backdrop-blur-md drop-shadow-sm rounded-lg shadow-lg">
        <h1 class="font-signika-negative font-semibold text-xl md:text-3xl text-center text-slate-700 w-full pb-2 border-b-2 border-slate-500">
            Listado de comidas
        </h1>
        <p class="font-medium font-signika-negative text-slate-700 text-lg">
            {{ "Meals list" }}
        </p>
        <span v-for="meal in meals" :key="meal.id">
            <div class="flex justify-between items-center">
                <p class="mr-0 sm:mr-6 font-normal font-signika-negative text-slate-700 text-sm sm:text-lg">
                    {{ meal.name }}
                </p>
                <div class="flex justify-center space-x-1 sm:space-x-2">
                    <button class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-sky-600 rounded-3xl ease-in-out hover:bg-sky-700 drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 16 16"> <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/> </svg>
                    </button>
                    <button class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-rose-600 rounded-3xl ease-in-out hover:bg-rose-700 drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>
                    </button>
                </div>
            </div>
        </span>
        <router-link :to="{name: 'MenuIndex', props: {id: props.id}}" class="absolute -top-0.5 sm:-top-1 left-8 p-2 hover:ease-in-out hover:duration-200 hover:-translate-x-2 hover:drop-shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-5 w-5 sm:h-7 sm:w-7 text-slate-700" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/> </svg>
        </router-link>
    </div>
</template>

<style scoped>

</style>