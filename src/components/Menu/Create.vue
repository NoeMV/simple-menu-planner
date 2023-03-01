<script setup>
    import { ref } from 'vue';
    import { useMenusStore } from '../../stores/menus';
    import { useUsersStore } from '../../stores/users';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const menuStore = useMenusStore();
    const userStore = useUsersStore();

    const name = ref('');
    const variety = ref('');

    async function handleCreate() {
        const obj = {
            name: name.value,
            variety: variety.value,
            meals: [],
            ingredients: [],
            participants: [userStore.user.id],
            requests: [],
            blocked: []
        }

        await menuStore.createMenu(obj);

        const aux = userStore.user.menus;
        aux.push({
            code: menuStore.menu.id,
            name: menuStore.menu.name,
            status: 'participant',
            creator: true
        });

        await userStore.updateUser(userStore.user.id, {menus: aux});

        router.push({name: 'MenuIndex', params: {id: menuStore.menu.id}});
    }

</script>

<template>
    <div class="mx-auto max-w-7xl h-full flex justify-center items-center">
        <div class="py-14 px-10 w-fit flex flex-col justify-center bg-white bg-opacity-50 backdrop-blur-lg drop-shadow-md rounded-lg shadow-lg">
            <h1 class="font-signika-negative font-semibold text-3xl text-center text-slate-700">Crear menu</h1>
            <form class="flex flex-col items-center justify-center w-full px-6 mt-8" @submit.prevent="handleCreate()">
                <div class="mb-6 relative w-full">
                    <input type="text" autocomplete="off" id="name" placeholder="name" v-model="name" class="peer mt-1 w-full bg-opacity-0 bg-white border-b-2 border-slate-50 px-0 py-2 placeholder:text-transparent focus:border-slate-500 focus:outline-none">
                    <label for="name" class="font-signika-negative pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-slate-700 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-placeholder-shown:font-signika-negative peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-slate-800">
                        Nombre
                    </label>
                </div>
                <div class="mb-6 relative w-full">
                    <select v-model="variety" id="variety" class="mt-2 w-full bg-transparent border-b-2 border-slate-50 p-2.5 text-sm text-gray-700 transition ease-in-out focus:border-slate-500 focus:outline-none">
                        <option value="true">{{ "Si" }}</option>
                        <option value="false">{{ "No" }}</option>
                    </select>
                    <label for="variety" class="absolute top-0 left-0 origin-left pl-0 -translate-y-1/2 opacity-75 transform text-sm text-slate-700 font-signika-negative">
                        Opciones variadas
                    </label>
                </div>
                <button type="submit" class="py-1 px-4 w-fit font-signika-negative font-medium text-lg rounded-3xl text-slate-100 bg-sky-600 ease-in-out hover:bg-sky-700 hover:drop-shadow-md">
                    Continuar
                </button>
            </form>
            <router-link :to="{name: 'Dashboard'}" class="absolute top-2 left-3 p-2 hover:ease-in-out hover:duration-200 hover:-translate-x-2 hover:drop-shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-7 w-7 text-slate-700" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/> </svg>
            </router-link>
        </div>
    </div>
</template>