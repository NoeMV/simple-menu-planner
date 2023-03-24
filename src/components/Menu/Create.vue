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

        const { menuCreated } = await menuStore.createMenu(obj);

        router.push({name: 'MenuIndex', params: {id: menuCreated.value.id}});
    }

</script>

<template>
    <div class="mx-auto max-w-7xl px-10 h-full w-full flex justify-center items-center">
        <div class="relative py-14 px-10 w-fit flex flex-col justify-center bg-slate-100 rounded-xl shadow-xl">
            <h1 class="font-signika-negative font-semibold text-xl sm:text-3xl text-center text-slate-600">Crear menu</h1>
            <form class="flex flex-col items-center justify-center w-full px-6 mt-8" @submit.prevent="handleCreate()">
                <div class="mb-6 relative w-full">
                    <input required type="text" id="name" placeholder="Nombre" v-model="name" class="peer mt-0 w-full bg-white border border-slate-300 px-2.5 py-1 rounded-xl placeholder:text-transparent focus:border-sky-600 focus:ring-2 focus:ring-offset-0 focus:ring-offset-sky-600 focus:ring-opacity-60">
                    <label for="name" class="absolute -top-[0.3rem] bg-slate-100 leading-none left-2.5 origin-left px-0.5 -translate-y-1/2 transform text-sm text-center text-slate-700 transition-all duration-100 ease-in-out font-signika-negative peer-placeholder-shown:bg-white peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-focus:bg-slate-100 peer-focus:leading-none peer-focus:-top-[0.3rem] peer-focus:px-0.5 peer-focus:text-sm peer-focus:text-slate-800">
                        Nombre
                    </label>
                </div>
                <div class="mb-6 relative w-full">
                    <select required v-model="variety" id="variety" class="peer mt-0 w-full bg-white border border-slate-300 px-2.5 py-1 rounded-xl placeholder:text-transparent focus:border-sky-600 focus:ring-2 focus:ring-offset-0 focus:ring-offset-sky-600 focus:ring-opacity-60">
                        <option value="true">{{ "Si" }}</option>
                        <option value="false">{{ "No" }}</option>
                    </select>
                    <label for="variety" class="absolute -top-[0.3rem] bg-slate-100 leading-none left-2.5 origin-left px-0.5 -translate-y-1/2 transform text-sm text-center text-slate-700 transition-all duration-100 ease-in-out font-signika-negative peer-placeholder-shown:bg-white peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-focus:bg-slate-100 peer-focus:leading-none peer-focus:-top-[0.3rem] peer-focus:px-0.5 peer-focus:text-sm peer-focus:text-slate-800">
                        Opciones variadas
                    </label>
                </div>
                <button type="submit" class="py-1 px-4 w-fit font-signika-negative font-medium text-lg rounded-xl text-slate-100 bg-sky-600 ease-in-out hover:bg-sky-700 hover:drop-shadow-md">
                    Continuar
                </button>
            </form>
            <router-link :to="{name: 'Dashboard'}" class="absolute top-2 left-3 p-2 hover:ease-in-out hover:duration-200 hover:-translate-x-2 hover:drop-shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-7 w-7 text-slate-600" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/> </svg>
            </router-link>
        </div>
    </div>
</template>