<script setup>
    import CardFallback from './../CardFallback.vue';
    import ManageIngredients from './ManageIngredients.vue';

    const props = defineProps({
        id: {
            required: true,
            type: String
        }
    });
</script>

<template>
    <div class="mx-auto max-w-7xl px-10 h-full flex justify-center items-center">
        <Suspense>
            <ManageIngredients :id="props.id"></ManageIngredients>
            <template #fallback>
                <CardFallback></CardFallback>
            </template>
        </Suspense>
    </div>
</template>

<style scoped>

</style>