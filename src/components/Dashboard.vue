<script setup>
    import { useUsersStore } from '../stores/users';
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { storeToRefs } from 'pinia';

    const userStore = useUsersStore();
    const router = useRouter();

    const {user} = storeToRefs(userStore);

</script>

<template>
    <div class="mx-auto max-w-7xl px-10 h-full flex justify-center items-center">
        <div class="py-8 px-10 w-full flex flex-col justify-center items-center space-y-8 bg-white bg-opacity-50 backdrop-blur-lg drop-shadow-md rounded-lg shadow-lg">
            <h1 class="font-signika-negative font-semibold text-xl md:text-3xl text-center text-slate-700 w-full pb-2 border-b-2 border-slate-500">
                {{ "Menus de " + user?.name }}
            </h1>
            <div class="overflow-auto h-80">
                <div class="flex flex-wrap justify-center items-center">
                    <p v-for="i in 16" class="px-10 py-8">{{ i + " menu" }}</p>
                </div>
            </div>
            <div class="flex justify-between w-full">
                <button class="py-1 px-3 w-fit font-signika-negative font-medium text-sm sm:text-xl text-slate-100 bg-sky-500 rounded-3xl ease-in-out hover:bg-sky-700 drop-shadow-lg">
                    Crear menu
                </button>
                <button class="py-1 px-3 w-fit font-signika-negative font-medium text-sm sm:text-xl text-slate-100 bg-sky-500 rounded-3xl ease-in-out hover:bg-sky-700 drop-shadow-lg">
                    Unirse a menu
                </button>
            </div>
        </div>
    </div>
</template>