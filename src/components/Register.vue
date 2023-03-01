<script setup>
    import { useUsersStore } from '../stores/users';
    import { ref } from 'vue';

    const userStore = useUsersStore();

    const error = userStore.errorMessage;
    const name = ref('');
    const email = ref('');
    const password = ref('');

</script>

<template>
    <div class="mx-auto max-w-7xl h-full flex justify-center items-center">
        <div class="py-14 px-10 w-fit flex flex-col justify-center bg-white bg-opacity-50 backdrop-blur-lg drop-shadow-md rounded-lg shadow-lg">
            <h1 class="font-signika-negative font-semibold text-3xl text-center text-slate-700">Registro</h1>
            <form class="flex flex-col items-center justify-center w-full px-6 mt-8" @submit.prevent="userStore.register(name, email, password)">
                <div class="mb-6 relative w-full">
                    <input type="name" autocomplete="off" id="name" placeholder="name" v-model="name" class="peer mt-1 w-full bg-opacity-0 bg-white border-b-2 border-slate-50 px-0 py-1 placeholder:text-transparent focus:border-slate-500 focus:outline-none">
                    <label for="name" class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-slate-700 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-placeholder-shown:font-signika-negative peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-slate-800">
                        Nombre
                    </label>
                </div>
                <div class="mb-6 relative w-full">
                    <input type="email" autocomplete="off" id="email" placeholder="email" v-model="email" class="peer mt-1 w-full bg-opacity-0 bg-white border-b-2 border-slate-50 px-0 py-1 placeholder:text-transparent focus:border-slate-500 focus:outline-none">
                    <label for="email" class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-slate-700 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-placeholder-shown:font-signika-negative peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-slate-800">
                        Email
                    </label>
                </div>
                <div class="mb-8 relative w-full">
                    <input type="password" autocomplete="off" id="password" placeholder="password" v-model="password" class="peer mt-1 w-full bg-opacity-0 bg-white border-b-2 border-slate-50 px-0 py-1 placeholder:text-transparent focus:border-slate-500 focus:outline-none">
                    <label for="password" class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-slate-700 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-placeholder-shown:font-signika-negative peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-slate-800">
                        Contraseña
                    </label>
                </div>
                <div v-if="error" class="mb-8 relative w-full">
                    <p class="font-signika-negative font-medium text-lg text-rose-500 text-center">{{ error }}</p>
                </div>
                <button type="submit" class="py-2 px-5 w-fit mb-4 font-signika-negative font-medium text-lg rounded-3xl text-slate-100 bg-sky-600 ease-in-out hover:bg-sky-700 hover:drop-shadow-md">
                    Registrarse
                </button>
                <router-link :to="{name: 'Login'}" class="font-signika-negative font-normal text-sm text-slate-500 underline hover:text-slate-700">¿Tienes una cuenta? Inicia sesión</router-link>
            </form>
            <div class="relative flex py-5 items-center mt-6">
                <div class="flex-grow border-t-2 border-slate-600"></div>
                <h2 class="flex-shrink mx-2 font-signika-negative font-medium text-xl text-center align-middle text-slate-700">
                    O continúa con
                </h2>
                <div class="flex-grow border-t-2 border-slate-600"></div>
            </div>
            <div class="flex flex-col items-center justify-center w-full px-16 space-y-2">
                <button @click="userStore.authWithGoogle()" class="py-2 px-5 w-fit flex items-center font-signika-negative font-medium text-lg rounded-3xl text-slate-700 bg-slate-50 ease-in-out hover:bg-slate-200 hover:drop-shadow-md">
                    <img class="h-6 w-6 mr-3" src="http://www.logomaven.com/wp-content/uploads/Google-Logo-542x554px-compressed.png" alt="" />
                    Google
                </button>
            </div>
        </div>
    </div>
</template>