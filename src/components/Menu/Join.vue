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

        let index = userStore.user.menus.map(e => e.code).indexOf(code.value);
        if (index != -1) {
            switch (userStore.user.menus[index].status){
                case "participant":
                    menuStore.errorMessage = "Ya estás participando en este menu";
                break;
                case "pending":
                    menuStore.errorMessage = "Tu solicitud para unirte al menu sigue en espera";
                break;
                case "blocked":
                    menuStore.errorMessage = "Has sido bloqueado de este menu";
                break;
                default:
                    menuStore.errorMessage = "Ha ocurrido un error";
                break;
            }
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
            <h1 class="font-signika-negative font-semibold text-3xl text-center text-slate-700">Unirse a un menu</h1>
            <form class="flex flex-col items-center justify-center w-full px-6 mt-8" @submit.prevent="handleJoin()">
                <div class="mb-6 relative w-full">
                    <input type="text" autocomplete="off" id="code" placeholder="code" v-model="code" class="peer mt-1 w-full bg-opacity-0 bg-white border-b-2 border-slate-50 px-0 py-2 placeholder:text-transparent focus:border-slate-500 focus:outline-none">
                    <label for="code" class="font-signika-negative pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-slate-700 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-placeholder-shown:font-signika-negative peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-slate-800">
                        Código del menu
                    </label>
                </div>
                <div class="mb-6 w-full">
                    <p class="font-signika-negative font-normal text-base text-slate-600 text-justify">
                        Debes esperar a que algún participante del menu acepte tu solicitud para unirte.
                    </p>
                </div>
                <div v-if="menuStore.errorMessage" class="mb-6 relative w-full">
                    <p class="font-signika-negative font-medium text-lg text-rose-500 text-center">{{ menuStore.errorMessage }}</p>
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