<script setup>
    import { useRouter } from 'vue-router';

    const router = useRouter();

</script>

<template>
    <div>
        <h1 class="font-signika-negative font-medium text-xl text-center text-sky-600">Home page</h1>
        <button @click="router.push('/login')">Go and Login</button>
    </div>
</template>