<script setup>
    import { onBeforeMount, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useMenusStore } from '../../stores/menus';
    import { useUsersStore } from '../../stores/users';

    const menuStore = useMenusStore();
    const userStore = useUsersStore();

    const router = useRouter();

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

    onBeforeMount(async () => {
        await initData();
    });

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

    async function handleAction(targetId, action) {
        const currentUserId = userStore.user.id;

        switch(action){
            case 'acceptRequest':
                await menuStore.acceptRequest(props.id, targetId, currentUserId, requestsData, participantsData);
            break;
            case 'cancelRequest':
                await menuStore.cancelRequest(props.id, targetId, currentUserId, requestsData);
            break;
            case 'blockRequest':
                await menuStore.blockRequest(props.id, targetId, currentUserId, requestsData, blockedData);
            break;
            case 'unblockUser':
                await menuStore.unblockUser(props.id, targetId, currentUserId, blockedData);
            break;
            case 'removeParticipant':
                await menuStore.removeParticipant(props.id, targetId, currentUserId, participantsData);
            break;
        }

        await initData();
    }

</script>

<template>
    <div class="mx-auto max-w-7xl px-10 h-full flex justify-center items-center">
        <div class="py-8 px-10 w-full flex flex-col justify-center items-center space-y-8 bg-white bg-opacity-50 backdrop-blur-lg drop-shadow-md rounded-lg shadow-lg">
            <h1 class="font-signika-negative font-semibold text-xl md:text-3xl text-center text-slate-700 w-full pb-2 border-b-2 border-slate-500">
                {{ menuData.name }}
            </h1>
            <div v-if="(requestsData.length > 0)" class="py-2 px-4 w-full font-medium font-signika-negative text-slate-700 text-center bg-teal-500 bg-opacity-40 rounded-lg">
                Hay solicitudes para unirse en espera
            </div>
            <p class="font-medium font-signika-negative text-slate-700 text-lg">
                {{ "solicitudes" }}
            </p>
            <span v-for="request in requestsData" :key="request.id">
                <p>{{ request.name }}</p>
                <button @click="handleAction(request.id, 'acceptRequest')">
                    aceptar
                </button>
                <button @click="handleAction(request.id, 'cancelRequest')">
                    cancelar
                </button>
                <button @click="handleAction(request.id, 'blockRequest')">
                    bloquear
                </button>
            </span>
            <p class="font-medium font-signika-negative text-slate-700 text-lg">
                {{ "participantes" }}
            </p>
            <span v-for="participant in participantsData" :key="participant.id">
                <p>{{ participant.name }}</p>
                <button v-if="userStore.user?.menus.find(e => e.code == props.id)?.creator == true && participant.id != userStore.user?.id" @click="handleAction(participant.id, 'removeParticipant')">
                    eliminar
                </button>
            </span>
            <p class="font-medium font-signika-negative text-slate-700 text-lg">
                {{ "bloqueados" }}
            </p>
            <span v-for="blocked in blockedData" :key="blocked.id">
                <p>{{ blocked.name }}</p>
                <button @click="handleAction(blocked.id, 'unblockUser')">
                    eliminar
                </button>
            </span>
            <div class="flex justify-between w-full">
                <router-link :to="{name: 'MenuIndex', params: {id: props.id}}" class="py-1 px-3 w-fit font-signika-negative font-medium text-sm sm:text-xl text-slate-100 bg-sky-600 rounded-3xl ease-in-out hover:bg-sky-700 drop-shadow-md">
                    Volver
                </router-link>
            </div>
        </div>
    </div>
</template>