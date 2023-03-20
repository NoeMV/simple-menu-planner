<script setup>

</script>

<template>
    <div class="mx-auto max-w-7xl px-10 h-full flex justify-center items-center">
        <div class="py-5 sm:py-14 px-10 flex flex-col justify-center items-center space-y-4 sm:space-y-8 bg-slate-100 rounded-xl shadow-xl">
            <h1 class="font-signika-negative font-semibold text-2xl sm:text-4xl text-center text-slate-600">Simple menu planner</h1>
            <p class="font-signika-negative font-medium text-base sm:text-xl text-justify text-slate-600">
                Simple menu planner es una aplicación web para planificar comidas semanalmente, llevando un registro de qué se ha cocinado 
                recientemente y proporciona sugerencias de comidas basado en distintas variables como las preferencias del usuario.
            </p>
            <div class="flex justify-start w-full">
                <ul class="font-signika-negative font-medium text-base sm:text-xl text-slate-600 space-y-1 sm:space-y-3">
                    <li class="flex items-center ml-10 relative">
                        <div class="absolute rounded-full bg-sky-500 h-3 w-3 -left-6"></div>
                        <p>Organiza tus comidas en un solo lugar</p>
                    </li>
                    <li class="flex items-center ml-10 relative">
                        <div class="absolute rounded-full bg-sky-500 h-3 w-3 -left-6"></div>
                        <p>Planea lo que cocinarás en la semana</p>
                    </li>
                    <li class="flex items-center ml-10 relative">
                        <div class="absolute rounded-full bg-sky-500 h-3 w-3 -left-6"></div>
                        <p>Recibe sugerencias personalizadas para cocinar</p>
                    </li>
                    <li class="flex items-center ml-10 relative">
                        <div class="absolute rounded-full bg-sky-500 h-3 w-3 -left-6"></div>
                        <p>Invita a otros a formar parte de tu menu</p>
                    </li>
                </ul>
            </div>
            <router-link :to="{name: 'Login'}" class="py-2 px-5 w-fit font-signika-negative font-medium text-xl rounded-xl text-slate-100 bg-sky-600 ease-in-out hover:bg-sky-700 hover:drop-shadow-md">Continuar</router-link>
        </div>
    </div>
</template>