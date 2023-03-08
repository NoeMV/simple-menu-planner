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
    const showAlert = ref(true);

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
                await menuStore.acceptRequest(props.id, targetId);
            break;
            case 'cancelRequest':
                await menuStore.cancelRequest(props.id, targetId);
            break;
            case 'blockRequest':
                await menuStore.blockRequest(props.id, targetId);
            break;
            case 'unblockUser':
                await menuStore.unblockUser(props.id, targetId);
            break;
            case 'removeParticipant':
                await menuStore.removeParticipant(props.id, targetId);
            break;
        }

        await userStore.getUser(currentUserId);
        await initData();
    }

</script>

<template>
    <div class="mx-auto max-w-7xl px-10 h-full flex justify-center items-center">
        <div class="py-8 px-10 w-full flex flex-col justify-center items-center space-y-8 bg-white bg-opacity-20 backdrop-blur-md drop-shadow-sm rounded-lg shadow-lg">
            <h1 class="font-signika-negative font-semibold text-xl md:text-3xl text-center text-slate-700 w-full pb-2 border-b-2 border-slate-500">
                {{ menuData.name }}
            </h1>
            <div v-if="(requestsData.length > 0 && showAlert)" class="py-2 px-4 w-full flex justify-between items-center bg-teal-500 bg-opacity-40 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="hidden sm:block h-7 w-7 text-white" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/> </svg>
                <p class="font-medium font-signika-negative text-slate-700 text-center text-base sm:text-lg">
                    Hay solicitudes para unirse en espera
                </p>
                <button @click="showAlert = false" class="w-fit ease-in-out hover:drop-shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-5 w-5 sm:h-7 sm:w-7 text-slate-700" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>
                </button>
            </div>
            <p class="font-semibold font-signika-negative text-slate-700 text-xl">
                Solicitudes
            </p>
            <span v-for="request in requestsData" :key="request.id">
                <div class="flex justify-between items-center">
                    <p class="mr-0 sm:mr-6 font-normal font-signika-negative text-slate-700 text-sm sm:text-lg">
                        {{ request.name }}
                    </p>
                    <div class="flex justify-center space-x-1 sm:space-x-2">
                        <button @click="handleAction(request.id, 'acceptRequest')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-teal-600 rounded-3xl ease-in-out hover:bg-teal-700 drop-shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 16 16"> <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/> </svg>
                        </button>
                        <button @click="handleAction(request.id, 'cancelRequest')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-amber-600 rounded-3xl ease-in-out hover:bg-amber-700 drop-shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>
                        </button>
                        <button @click="handleAction(request.id, 'blockRequest')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-rose-600 rounded-3xl ease-in-out hover:bg-rose-700 drop-shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="p-1 h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z"/> </svg>
                        </button>
                    </div>
                </div>
            </span>
            <p class="font-semibold font-signika-negative text-slate-700 text-xl">
                Participantes
            </p>
            <span v-for="participant in participantsData" :key="participant.id">
                <div class="flex justify-between items-center">
                    <p class="mr-2 sm:mr-6 font-normal font-signika-negative text-slate-700 text-sm sm:text-lg">
                        {{ participant.name }}
                    </p>
                    <button v-if="userStore.user?.menus.find(e => e.code == props.id)?.creator == true && participant.id != userStore.user?.id" @click="handleAction(participant.id, 'removeParticipant')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-rose-600 rounded-3xl ease-in-out hover:bg-rose-700 drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="p-1 h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg>
                    </button>
                </div>
            </span>
            <p class="font-semibold font-signika-negative text-slate-700 text-xl">
                Bloqueados
            </p>
            <span v-for="blocked in blockedData" :key="blocked.id">
                <div class="flex justify-between items-center">
                    <p class="mr-2 sm:mr-6 font-normal font-signika-negative text-slate-700 text-sm sm:text-lg">
                        {{ blocked.name }}
                    </p>
                    <button @click="handleAction(blocked.id, 'unblockUser')" class="p-1 w-fit font-signika-negative font-normal text-sm sm:text-base text-slate-100 bg-rose-600 rounded-3xl ease-in-out hover:bg-rose-700 drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="p-1 h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg>
                    </button>
                </div>
            </span>
            <a href="javascript:void(0)" @click="router.go(-1)" class="absolute -top-0.5 sm:-top-1 left-8 p-2 hover:ease-in-out hover:duration-200 hover:-translate-x-2 hover:drop-shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-5 w-5 sm:h-7 sm:w-7 text-slate-700" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/> </svg>
            </a>
        </div>
    </div>
</template>