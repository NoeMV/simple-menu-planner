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

    onBeforeMount(async ()=> {
        await menuStore.getMenu(props.id);
    });

    async function acceptRequest(id){
        const requestList = menuStore.requests.map(e => e.id);
        const index = requestList.indexOf(id);
        requestList.splice(index, 1);

        const participantList = menuStore.participants.map(e => e.id);
        participantList.push(id);

        await menuStore.updateMenu(props.id, {requests: requestList, participants: participantList});

        await userStore.getUser(id);
        const menuList = userStore.user.menus;
        const indexMenu = menuList.map(e => e.code).indexOf(props.id);
        menuList[indexMenu].status = 'participant';
        
        await userStore.updateUser(id, {menus: menuList});
    }

</script>

<template>
    <div class="mx-auto max-w-7xl px-10 h-full flex justify-center items-center">
        <div class="py-8 px-10 w-full flex flex-col justify-center items-center space-y-8 bg-white bg-opacity-50 backdrop-blur-lg drop-shadow-md rounded-lg shadow-lg">
            <h1 class="font-signika-negative font-semibold text-xl md:text-3xl text-center text-slate-700 w-full pb-2 border-b-2 border-slate-500">
                {{ menuStore.menu?.name }}
            </h1>
            <div v-if="(menuStore.menu.requests?.length > 0)">
                Hay solicitudes para unirse en espera
            </div>
            <p class="font-medium font-signika-negative text-slate-700 text-lg">
                {{ "Calendar" }}
            </p>
            <p class="font-medium font-signika-negative text-slate-700 text-lg">
                {{ "Week schedule" }}
            </p>
            <p class="font-medium font-signika-negative text-slate-700 text-lg">
                {{ "Meals list" }}
            </p>
            <span v-for="meal in menuStore.meals" :key="meal.id">
                {{ meal.name }}
            </span>
            <p class="font-medium font-signika-negative text-slate-700 text-lg">
                {{ "solicitudes" }}
            </p>
            <span v-for="request in menuStore.requests" :key="request.id">
                <p>{{ request.name }}</p>
                <button @click="acceptRequest(request.id)">aceptar</button>
            </span>
            <p class="font-medium font-signika-negative text-slate-700 text-lg">
                {{ "participantes" }}
            </p>
            <span v-for="participant in menuStore.participants" :key="participant.id">
                <p>{{ participant.name }}</p>
            </span>
            <div class="flex justify-between w-full">
                <router-link :to="{name: 'Dashboard'}" class="py-1 px-3 w-fit font-signika-negative font-medium text-sm sm:text-xl text-slate-100 bg-sky-600 rounded-3xl ease-in-out hover:bg-sky-700 drop-shadow-md">
                    Volver
                </router-link>
            </div>
        </div>
    </div>
</template>