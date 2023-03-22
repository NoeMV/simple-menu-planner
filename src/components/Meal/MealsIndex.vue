<script setup>
    import CardFallback from '../CardFallback.vue';
    import MealsList from './MealsList.vue';

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
            <MealsList :id="props.id"></MealsList>
            <template #fallback>
                <CardFallback></CardFallback>
            </template>
        </Suspense>
    </div>
</template>

<style scoped>

</style>