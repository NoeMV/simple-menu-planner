<script setup>
  import { useUsersStore } from './stores/users';

    const userStore = useUsersStore();

</script>

<template>
  <div class="min-h-full h-screen overflow-y-auto">
    <div class="absolute top-4 right-6 flex justify-end w-full p-2 rounded-lg">
        <button @click="userStore.logout()" v-if="userStore.isLoggedIn" class="py-1 px-3 w-fit font-signika-negative font-medium text-base md:text-xl text-slate-100 bg-rose-500 rounded-3xl ease-in-out hover:bg-rose-700 drop-shadow-lg">
            Cerrar sesión
        </button>
    </div>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
  .fade-move,
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* .fade-leave-active {
    position: absolute;
  } */
</style>
