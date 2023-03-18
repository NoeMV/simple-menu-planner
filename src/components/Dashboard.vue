<script setup>
    import { useUsersStore } from '../stores/users';
    import { useMenusStore } from '../stores/menus';
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { storeToRefs } from 'pinia';
    import Modal from './Modal.vue';

    const userStore = useUsersStore();
    const menuStore = useMenusStore();
    const router = useRouter();

    const {user} = storeToRefs(userStore);
    menuStore.currentMenuId = "";

    const statusText = ref('');
    const showModal = ref(false);

    function menuAction (menuCode, userStatus) {
        if(userStatus == 'blocked'){
            statusText.value = "No puedes ingresar a este menu, tu solicitud ha sido bloqueada";
            showModal.value = true;
            return;
        }

        if(userStatus == 'pending'){
            statusText.value = "Tu solicitud para participar en este menu aún no ha sido aceptada";
            showModal.value = true;
            return;
        }

        router.push({name: 'MenuIndex', params: {id: menuCode}});
    }

</script>

<template>
    <div class="mx-auto max-w-7xl px-10 h-full flex justify-center items-center">
        <div class="py-8 px-10 w-full items-center space-y-8 bg-slate-100 rounded-xl shadow-xl">
            <h1 class="font-signika-negative font-semibold text-xl md:text-3xl text-center text-slate-600 w-full pb-2 border-b-2 border-slate-600">
                {{ "Menus de " + user?.name }}
            </h1>
            <div class="overflow-auto h-96 space-y-3">
                <div @click="menuAction(menu.code, menu.status)" v-for="menu in user?.menus" :key="menu.code" class="group flex justify-between items-center px-4 py-2 rounded-xl border border-slate-300 shadow-sm ease-in-out hover:cursor-pointer" :class="menu.status == 'pending' ? ['bg-amber-200 hover:bg-amber-300'] : menu.status == 'blocked' ? ['bg-rose-300 hover:bg-rose-400'] : ['bg-white hover:bg-slate-200']">
                    <p class="font-medium font-signika-negative text-slate-600 text-lg text-start group-hover:scale-105 ease-in-out">{{ menu.name }}</p>
                    <p class="font-normal font-signika-negative text-slate-500 text-end">{{ menu.status == 'pending' ? "Solicitud pendiente" : menu.status == 'blocked' ? "Bloqueado" : "Participante" }}</p>
                </div>
            </div>
            <div class="flex justify-between w-full">
                <router-link :to="{name: 'MenuCreate'}" class="py-1 px-3 w-fit font-signika-negative font-medium text-sm sm:text-xl text-slate-100 bg-sky-600 rounded-xl ease-in-out hover:bg-sky-700 drop-shadow-md">
                    Crear menu
                </router-link>
                <router-link :to="{name: 'MenuJoin'}" class="py-1 px-3 w-fit font-signika-negative font-medium text-sm sm:text-xl text-slate-100 bg-sky-600 rounded-xl ease-in-out hover:bg-sky-700 drop-shadow-md">
                    Unirse a menu
                </router-link>
            </div>
            <Teleport to="body">
                <Modal :show="showModal" @close="showModal = false">
                    <template #header>
                        <h3 class="font-signika-negative font-medium text-base md:text-xl text-center text-slate-600">
                            Estado del menu
                        </h3>
                    </template>
                    <template #body>
                        <p class="font-medium font-signika-negative text-slate-600 text-lg">{{ statusText }}</p>
                    </template>
                </Modal>
            </Teleport>
        </div>
    </div>
</template>