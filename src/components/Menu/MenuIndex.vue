<script setup>
    import CardFallback from '../CardFallback.vue';
    import MenuMain from './MenuMain.vue';

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
            <MenuMain :id="props.id"></MenuMain>
            <template #fallback>
                <CardFallback></CardFallback>
            </template>
        </Suspense>
    </div>
</template>