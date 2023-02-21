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
    <div>
        <h1 class="font-signika-negative font-medium text-xl text-center text-red-600">Logged in, Dashboard page</h1>
        <button @click="handleSignOut" v-if="isLoggedIn">Log out</button>
    </div>
</template>