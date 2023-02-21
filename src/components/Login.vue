<script setup>
    import { getAuth, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    async function signInWithGoogle(){
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(getAuth(), provider);
            router.push('/dashboard');
        } catch (error) {
            console.log(error);
        }
    }

</script>

<template>
    <div>
        <h1 class="font-signika-negative font-medium text-xl text-center text-orange-600">Login Page</h1>
        <button @click="signInWithGoogle">Enter with Google</button>
    </div>
</template>