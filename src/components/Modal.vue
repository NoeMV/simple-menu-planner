<script setup>
const props = defineProps({
  show: Boolean
})
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inline-flex justify-center items-center z-50 w-full p-4 overflow-x-hidden overflow-y-auto h-full inset-0 bg-black bg-opacity-40">
        <div class="relative w-full max-w-2xl h-auto">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <slot name="header">
                        Modal
                    </slot>
                    <button @click="$emit('close')" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Cerrar</span>
                    </button>
                </div>

                <div class="p-6 space-y-6">
                    <slot name="body">
                        Contenido
                    </slot>
                </div>

                <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <slot name="footer">
                        <button @click="$emit('close')" class="text-slate-100 font-medium font-signika-negative bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm sm:text-lg px-3 py-1.5 text-center">
                            Cerrar
                        </button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
  </Transition>
</template>

<style>
    .modal-enter-from {
        opacity: 0;
    }

    .modal-leave-to {
        opacity: 0;
    }

    .modal-enter-active,
    .modal-leave-active {
        transition: 0.1s ease-in-out;
    }

    .modal-enter-from,
    .modal-leave-to {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>