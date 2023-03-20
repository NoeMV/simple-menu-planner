<script setup>
    import { ref } from 'vue';
    import { useMenusStore } from '../../stores/menus';
    import { useUsersStore } from '../../stores/users';
    import { useRouter } from 'vue-router';
    import Modal from '../Modal.vue';

    const router = useRouter();
    const menuStore = useMenusStore();
    const userStore = useUsersStore();

    const props = defineProps({
        id: {
            required: true,
            type: String
        }
    });

    const menuData = ref({});
    const requestsData = ref([]);
    const participantsData = ref([]);
    const blockedData = ref([]);

    const statusMessage = ref('');
    const targetId = ref('');
    const action = ref('');
    const showModal = ref(false);
    const clipMessage = ref('');

    await initData();

    async function initData(){
        const {menu, errorMenu} = await menuStore.getMenu(props.id);
        menuData.value = menu.value;
        const {requests, errorRequests} = await menuStore.getRequests(menuData.value.requests);
        requestsData.value = requests.value;
        const {participants, errorParticipants} = await menuStore.getParticipants(menuData.value.participants);
        participantsData.value = participants.value;
        const {blocked, errorBlocked} = await menuStore.getBlocked(menuData.value.blocked);
        blockedData.value = blocked.value;
    }

    function handleAction(target, actionOption) {
        const statusOptions = {
            'acceptRequest': 'aceptar la solicitud de ' + target.name + ' para unirse al menu',
            'cancelRequest': 'cancelar la solicitud de ' + target.name + ' para unirse al menu',
            'blockRequest': 'bloquear esta y futuras solicitudes de ' + target.name + ' para unirse al menu',
            'unblockUser': 'eliminar a ' + target.name + ' de la lista de bloqueados del menu (Podrá solicitar unirse de nuevo)',
            'removeParticipant': 'eliminar a ' + target.name + ' del menu'
        };

        statusMessage.value = statusOptions[actionOption];
        showModal.value = true;
        targetId.value = target.id;
        action.value = actionOption;
    }

    async function manageUserStatus(){
        if(action.value == 'deleteMenu'){
            await menuStore.deleteMenu(props.id, menuData.value.meals, menuData.value.ingredients, menuData.value.participants, menuData.value.blocked, menuData.value.requests);
            router.push({name: 'Dashboard'});
            return;
        }

        const currentUserId = userStore.user.id;

        switch(action.value){
            case 'acceptRequest':
                await menuStore.acceptRequest(props.id, targetId.value);
            break;
            case 'cancelRequest':
                await menuStore.cancelRequest(props.id, targetId.value);
            break;
            case 'blockRequest':
                await menuStore.blockRequest(props.id, targetId.value);
            break;
            case 'unblockUser':
                await menuStore.unblockUser(props.id, targetId.value);
            break;
            case 'removeParticipant':
                await menuStore.removeParticipant(props.id, targetId.value);
            break;
        }

        await userStore.getUser(currentUserId);
        await initData();
        showModal.value = false;
    }

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(menuData.value.id);
            clipMessage.value = 'Se ha copiado al portapapeles';
        } catch (error) {
            clipMessage.value = 'Ha ocurrido un error, inténtalo más tarde';
        }
    }

    function showDeleteMenuModal(actionOption) {
        action.value = actionOption;
        statusMessage.value = 'eliminar el menu "' + menuData.value.name + '" y toda su configuración, así como sus comidas e ingredientes de forma definitiva';
        showModal.value = true;
    }

</script>

<template>
    <div class="relative py-8 px-10 w-full items-center space-y-8 bg-slate-100 rounded-xl shadow-xl">
        <h1 class="font-signika-negative font-semibold text-xl md:text-3xl text-center text-slate-600 w-full pb-2 border-b-2 border-slate-600">
            Ajustes del menu
        </h1>
        <div>
            <p class="mb-1 font-medium font-signika-negative text-center text-slate-700 text-lg sm:text-2xl">
                Código del menu
            </p>
            <div class="flex justify-center space-x-3">
                <input type="text" disabled :value="menuData.id" class="py-1 px-3 w-fit font-signika-negative text-sm sm:text-base text-slate-600 bg-white rounded-xl border border-slate-300 shadow-sm">
                <button @click="copyToClipboard()" class="py-1 px-3 w-fit font-signika-negative font-medium text-xs sm:text-xl text-slate-100 bg-sky-600 rounded-xl ease-in-out hover:bg-sky-700 drop-shadow-md">
                    Copiar
                </button>
            </div>
            <div v-if="clipMessage" class="mt-1 relative w-full">
                <p class="font-signika-negative font-medium text-sm sm:text-base text-slate-600 text-center">{{ clipMessage }}</p>
            </div>
        </div>
        <div class="space-y-3">
            <p class="font-medium font-signika-negative text-slate-700 text-center text-lg sm:text-2xl">
                Participantes
            </p>
            <div v-for="participant in participantsData" :key="participant.id" class="flex justify-between items-center py-2 px-4 bg-white rounded-xl border border-slate-300 shadow-sm">
                <p class="font-normal font-signika-negative text-slate-600 text-sm sm:text-lg">
                    {{ participant.name }}
                </p>
                <button v-if="userStore.user?.menus.find(e => e.code == props.id)?.creator == true && participant.id != userStore.user?.id" @click="handleAction(participant, 'removeParticipant')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-rose-600 rounded-3xl ease-in-out hover:bg-rose-700 drop-shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="p-1 h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg>
                </button>
            </div>
        </div>
        <div class="flex flex-col sm:flex-row justify-between space-y-8 sm:space-y-0 space-x-0 sm:space-x-3">
            <div class="space-y-3 w-full">
                <p class="font-medium font-signika-negative text-center text-slate-700 text-lg sm:text-2xl">
                    Solicitudes
                </p>
                <div v-if="requestsData.length == 0" class="py-2 px-4 bg-white rounded-xl border border-slate-300 shadow-sm">
                    <p class="font-normal font-signika-negative text-slate-600 text-sm sm:text-lg text-center">
                        No hay nuevas solicitudes
                    </p>
                </div>
                <div v-for="request in requestsData" :key="request.id" class="flex justify-between items-center py-2 px-4 bg-white rounded-xl border border-slate-300 shadow-sm">
                    <p class="font-normal font-signika-negative text-slate-600 text-sm sm:text-lg">
                        {{ request.name }}
                    </p>
                    <div class="flex justify-end space-x-1 sm:space-x-2">
                        <button @click="handleAction(request, 'acceptRequest')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-teal-600 rounded-3xl ease-in-out hover:bg-teal-700 drop-shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 16 16"> <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/> </svg>
                        </button>
                        <button @click="handleAction(request, 'cancelRequest')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-amber-600 rounded-3xl ease-in-out hover:bg-amber-700 drop-shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>
                        </button>
                        <button @click="handleAction(request, 'blockRequest')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-rose-600 rounded-3xl ease-in-out hover:bg-rose-700 drop-shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="p-1 h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z"/> </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="space-y-3 w-full">
                <p class="font-medium font-signika-negative text-slate-700 text-center text-lg sm:text-2xl">
                    Bloqueados
                </p>
                <div v-if="blockedData.length == 0" class="py-2 px-4 bg-white rounded-xl border border-slate-300 shadow-sm">
                    <p class="font-normal font-signika-negative text-slate-600 text-sm sm:text-lg text-center">
                        No hay bloqueados en este menu
                    </p>
                </div>
                <div v-for="blocked in blockedData" :key="blocked.id" class="flex justify-between items-center py-2 px-4 bg-white rounded-xl border border-slate-300 shadow-sm">
                    <p class="font-normal font-signika-negative text-slate-600 text-sm sm:text-lg">
                        {{ blocked.name }}
                    </p>
                    <button @click="handleAction(blocked, 'unblockUser')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-rose-600 rounded-3xl ease-in-out hover:bg-rose-700 drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="p-1 h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="userStore.user?.menus.find(e => e.code == props.id)?.creator == true" class="flex justify-center w-full">
            <button @click="showDeleteMenuModal('deleteMenu')" class="py-1 px-3 w-fit font-signika-negative font-medium text-xs sm:text-xl text-slate-100 bg-rose-600 rounded-xl ease-in-out hover:bg-rose-700 drop-shadow-md">
                Eliminar menu
            </button>
        </div>
        <router-link :to="{name: 'MenuIndex', props: {id: props.id}}" class="absolute -top-2 sm:-top-1 left-8 p-2 hover:ease-in-out hover:duration-200 hover:-translate-x-2 hover:drop-shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-7 w-7 text-slate-600" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/> </svg>
        </router-link>
        <Teleport to="body">
            <Modal :show="showModal" @close="showModal = false">
                <template #header>
                    <h3 class="font-signika-negative font-medium text-base md:text-xl text-center text-slate-600">
                        Ajustes
                    </h3>
                </template>
                <template #body>
                    <p class="font-medium font-signika-negative text-slate-600 text-lg">{{ "¿Quieres " + statusMessage + "?" }}</p>
                </template>
                <template #footer>
                    <div class="flex justify-between w-full">
                        <button @click="manageUserStatus()" class="text-slate-100 font-medium font-signika-negative bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm sm:text-lg px-3 py-1.5 text-center">
                            Aceptar
                        </button>
                        <button @click="showModal = false" class="text-slate-100 font-medium font-signika-negative bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm sm:text-lg px-3 py-1.5 text-center">
                            Cancelar
                        </button>
                    </div>
                </template>
            </Modal>
        </Teleport>
    </div>
</template>