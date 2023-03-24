<script setup>
    import { useUsersStore } from '../stores/users';
    import { ref, onBeforeUnmount } from 'vue';

    const userStore = useUsersStore();

    const email = ref('');
    const password = ref('');

    onBeforeUnmount(() => {
        userStore.errorMessage = '';
    });

</script>

<template>
    <div class="mx-auto max-w-7xl px-16 h-full w-full flex justify-center items-center">
        <div class="py-14 px-6 w-fit flex flex-col justify-center bg-slate-100 rounded-xl shadow-xl">
            <h1 class="font-signika-negative font-semibold text-2xl sm:text-3xl text-center text-slate-600">Iniciar sesión</h1>
            <form class="flex flex-col items-center justify-center w-full px-6 mt-8" @submit.prevent="userStore.login(email, password)">
                <div class="mb-6 relative w-full">
                    <input required type="email" autocomplete="off" id="email" placeholder="email" v-model="email" class="peer mt-0 w-full bg-white border border-slate-300 px-2.5 py-1 rounded-xl placeholder:text-transparent focus:border-sky-600 focus:ring-2 focus:ring-offset-0 focus:ring-offset-sky-600 focus:ring-opacity-60">
                    <label for="email" class="absolute -top-[0.3rem] bg-slate-100 leading-none left-2.5 origin-left px-0.5 -translate-y-1/2 transform text-sm text-center text-slate-700 transition-all duration-100 ease-in-out font-signika-negative peer-placeholder-shown:bg-white peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-focus:bg-slate-100 peer-focus:leading-none peer-focus:-top-[0.3rem] peer-focus:px-0.5 peer-focus:text-sm peer-focus:text-slate-800">
                        Email
                    </label>
                </div>
                <div class="mb-8 relative w-full">
                    <input required type="password" autocomplete="off" id="password" placeholder="password" v-model="password" class="peer mt-0 w-full bg-white border border-slate-300 px-2.5 py-1 rounded-xl placeholder:text-transparent focus:border-sky-600 focus:ring-2 focus:ring-offset-0 focus:ring-offset-sky-600 focus:ring-opacity-60">
                    <label for="password" class="absolute -top-[0.3rem] bg-slate-100 leading-none left-2.5 origin-left -translate-y-1/2 transform text-sm text-center text-slate-700 transition-all duration-100 ease-in-out font-signika-negative peer-placeholder-shown:bg-white peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-focus:bg-slate-100 peer-focus:leading-none peer-focus:-top-[0.3rem] peer-focus:px-0.5 peer-focus:text-sm peer-focus:text-slate-800">
                        Contraseña
                    </label>
                </div>
                <div v-if="userStore.errorMessage" class="mb-8 relative w-full">
                    <p class="font-signika-negative font-medium text-lg text-rose-500 text-center">{{ userStore.errorMessage }}</p>
                </div>
                <button type="submit" class="py-2 px-5 w-fit mb-4 font-signika-negative font-medium text-lg rounded-xl text-slate-100 bg-sky-600 ease-in-out hover:bg-sky-700 hover:drop-shadow-md">
                    Ingresar
                </button>
                <router-link :to="{name: 'Register'}" class="font-signika-negative font-normal text-sm text-center text-slate-500 underline hover:text-slate-700">¿No tienes una cuenta? Regístrate</router-link>
            </form>
            <div class="relative flex py-5 items-center mt-6">
                <div class="flex-grow border-t-2 border-slate-600"></div>
                <h2 class="flex-shrink mx-2 font-signika-negative font-medium text-xl text-center align-middle text-slate-600">
                    O continúa con
                </h2>
                <div class="flex-grow border-t-2 border-slate-600"></div>
            </div>
            <div class="flex flex-col items-center justify-center w-full px-16 space-y-2">
                <button @click="userStore.authWithGoogle()" class="py-2 px-6 flex justify-center items-center font-signika-negative font-medium text-lg text-slate-600 bg-white rounded-xl border-2 border-slate-300 shadow-sm ease-in-out hover:bg-slate-200">
                    <img class="h-6 w-6 mr-3" src="https://www.logomaven.com/wp-content/uploads/Google-Logo-542x554px-compressed.png" alt="" />
                    Google
                </button>
            </div>
        </div>
    </div>
</template>