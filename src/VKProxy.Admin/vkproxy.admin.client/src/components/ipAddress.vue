<template>
  {{ v }}
</template>

<style scoped></style>

<script setup lang="ts">
import { map, filter } from 'lodash';
import { ref,watch  } from 'vue';
import { parseIpAddress } from '../service/ip';

const model = defineModel({ required: true, default: [] })
const v = ref(p(model.value))

watch(model, (n) => v.value =p(n))


function p(n) {
  return filter(map(n, parseIpAddress), i => i !== null)
}
</script>
