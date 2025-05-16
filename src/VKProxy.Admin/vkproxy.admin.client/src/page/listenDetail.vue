<template>
  <div>{{d}}</div>
</template>

<style scoped>
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { ListenData } from '../ets/ListenData';

const props = defineProps({
    data: {
        type: ListenData,
        validator: v => v != null,
        required: true,
    }
})

const d = ref(props.data)

</script>
