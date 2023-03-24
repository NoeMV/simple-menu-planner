<script setup>
  import { ref } from 'vue';
  import { useUsersStore } from './stores/users';
  import Nav from './components/Nav.vue';
  import { useRouter } from 'vue-router';

  const userStore = useUsersStore();
  const router = useRouter();

  const showNav = ref(false);

  router.beforeEach(() => {
    showNav.value = false;
  });

</script>

<template>
  <div class="min-h-screen h-full w-full overflow-y-auto bg-gradient-to-tl from-cyan-300 to-lime-200 bg-cover aspect-auto flex justify-center items-center">
    <div class="absolute top-4 flex justify-between w-full px-10 py-1 rounded-lg">
        <button @click="showNav = !showNav" v-if="userStore.isLoggedIn" class="p-1 w-fit ease-in-out bg-white bg-opacity-30 backdrop-blur-md drop-shadow-sm rounded-lg shadow-lg hover:bg-opacity-50">
          <Transition name="menu" mode="out-in">
            <svg v-if="showNav" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-7 w-7 text-slate-700" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-7 w-7 text-slate-700" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/> </svg>
          </Transition>
        </button>
        <button @click="userStore.logout()" v-if="userStore.isLoggedIn" class="py-1 px-3 w-fit font-signika-negative font-medium text-base md:text-xl text-slate-100 bg-sky-600 rounded-xl ease-in-out hover:bg-sky-700 shadow-lg">
            Salir
        </button>
    </div>
    <Transition name="menu" mode="out-in">
      <Nav v-if="showNav && userStore.isLoggedIn" />
    </Transition>
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
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .menu-move,
  .menu-enter-active,
  .menu-leave-active {
    transition: opacity 0.2s ease;
  }

  .menu-enter-from,
  .menu-leave-to {
    opacity: 0;
  }

  /* .fade-leave-active {
    position: absolute;
  } */
</style>
