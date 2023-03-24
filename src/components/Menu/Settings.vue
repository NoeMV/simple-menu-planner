<script setup>
    import CardFallback from '../CardFallback.vue';
    import MenuSettings from './MenuSettings.vue';

    const props = defineProps({
        id: {
            required: true,
            type: String
        }
    });

</script>

<template>
    <div class="mx-auto max-w-7xl px-6 h-full w-full flex justify-center items-center">
        <Suspense>
            <MenuSettings :id="props.id"></MenuSettings>
            <template #fallback>
                <CardFallback></CardFallback>
            </template>
        </Suspense>
    </div>
</template>