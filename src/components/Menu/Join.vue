<script setup>
    import { ref } from 'vue';
    import { useMenusStore } from '../../stores/menus';
    import { useUsersStore } from '../../stores/users';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const menuStore = useMenusStore();
    const userStore = useUsersStore();

    const code = ref('');

    async function handleJoin() {
        // get menu and check if exists
        await menuStore.getMenu(code.value);
        if(menuStore.errorMessage){
            return;
        }

        // get menu requests array and add user id
        const menuRequests = menuStore.menu.requests;
        menuRequests.push(userStore.user.id);
        await menuStore.updateMenu(menuStore.menu.id, {requests: menuRequests});

        // get user menus and add new menu info (pending which means waiting for approval)
        const userMenus = userStore.user.menus;
        userMenus.push({
            code: menuStore.menu.id,
            name: menuStore.menu.name,
            status: 'pending',
            creator: false
        });
        await userStore.updateUser(userStore.user.id, {menus: userMenus});

        router.push({name: 'Dashboard'});
    }

</script>

<template>
    <div class="mx-auto max-w-7xl h-full flex justify-center items-center">
        <div class="py-14 px-10 w-fit flex flex-col justify-center bg-white bg-opacity-50 backdrop-blur-lg drop-shadow-md rounded-lg shadow-lg">
            <h1 class="font-signika-negative font-semibold text-3xl text-center text-slate-700">Crear menu</h1>
            <form class="flex flex-col items-center justify-center w-full px-6 mt-8" @submit.prevent="handleJoin()">
                <div class="mb-6 relative w-full">
                    <input type="text" autocomplete="off" id="code" placeholder="code" v-model="code" class="peer mt-1 w-full bg-opacity-0 bg-white border-b-2 border-slate-50 px-0 py-1 placeholder:text-transparent focus:border-slate-500 focus:outline-none">
                    <label for="code" class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-slate-700 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-placeholder-shown:font-signika-negative peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-slate-800">
                        Código del menu
                    </label>
                </div>
                <div v-if="menuStore.errorMessage" class="mb-6 relative w-full">
                    <p class="font-signika-negative font-medium text-lg text-rose-500 text-center">{{ menuStore.errorMessage }}</p>
                </div>
                <button type="submit" class="py-2 px-5 w-fit mb-4 font-signika-negative font-medium text-lg rounded-3xl text-slate-100 bg-sky-600 ease-in-out hover:bg-sky-700 hover:drop-shadow-md">
                    Continuar
                </button>
            </form>
        </div>
    </div>
</template>