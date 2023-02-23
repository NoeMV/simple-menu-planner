<script setup>
    import { useRouter } from 'vue-router';

    const router = useRouter();

</script>

<template>
    <div class="mx-auto max-w-7xl py-24 px-16">
        <div class="py-14 px-10 flex flex-col justify-center items-center space-y-8 bg-white bg-opacity-50 backdrop-blur-lg drop-shadow-md rounded-lg shadow-lg">
            <h1 class="font-signika-negative font-semibold text-4xl text-center text-sky-600">Simple menu planner</h1>
            <p class="font-signika-negative font-medium text-xl text-justify text-slate-700">
                Simple menu planner es una aplicación web para planificar comidas semanalmente, llevando un registro de qué se ha cocinado 
                recientemente y proporciona sugerencias de comidas basado en distintas variables como las preferencias del usuario, la última
                vez que un platillo ha sido cocinado, su complejidad, los ingedientes que lleva, etc.
            </p>
            <div class="flex justify-start w-full">
                <ul class="font-signika-negative font-medium text-xl text-slate-700 space-y-3">
                    <li class="flex items-center ml-6">
                        <div class="rounded-full bg-rose-500 h-3 w-3 mr-2"></div>
                        <p>Organiza tus comidas en un solo lugar</p>
                    </li>
                    <li class="flex items-center ml-6">
                        <div class="rounded-full bg-rose-500 h-3 w-3 mr-2"></div>
                        <p>Planea lo que cocinarás en la semana</p>
                    </li>
                    <li class="flex items-center ml-6">
                        <div class="rounded-full bg-rose-500 h-3 w-3 mr-2"></div>
                        <p>Recibe sugerencias personalizadas para cocinar</p>
                    </li>
                    <li class="flex items-center ml-6">
                        <div class="rounded-full bg-rose-500 h-3 w-3 mr-2"></div>
                        <p>Invita a otros a formar parte de tu menu</p>
                    </li>
                </ul>
            </div>
            <button @click="router.push('/login')" class="py-2 px-5 w-fit font-signika-negative font-medium text-xl rounded-3xl text-slate-100 bg-sky-600 ease-in-out hover:bg-sky-700 hover:drop-shadow-md">Continuar</button>
        </div>
    </div>
</template>