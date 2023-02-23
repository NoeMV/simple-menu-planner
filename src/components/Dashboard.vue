<script setup>
    import { onMounted, ref } from 'vue';
    import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const isLoggedIn = ref(false);

    let auth;

    onMounted(() => {
        auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                isLoggedIn.value = true;
            } else {
                isLoggedIn.value = false;
            }
        })
    });

    async function handleSignOut(){
        try {
            await signOut(getAuth());
            router.push('/login');
        } catch (error) {
            console.log(error);
        }
    }
</script>

<template>
    <div class="mx-auto max-w-7xl py-24 px-16">
        <div class="py-14 px-10 flex flex-col justify-center items-center space-y-8 bg-white bg-opacity-50 backdrop-blur-lg drop-shadow-md rounded-lg shadow-lg">
            <h1 class="font-signika-negative font-semibold text-3xl text-center text-sky-600">Mis menus</h1>

            <button @click="handleSignOut" v-if="isLoggedIn" class="py-2 px-5 w-fit font-signika-negative font-medium text-xl rounded-3xl text-slate-100 bg-rose-500 ease-in-out hover:bg-rose-700 hover:drop-shadow-md">Cerrar sesión</button>
        </div>
    </div>
</template>