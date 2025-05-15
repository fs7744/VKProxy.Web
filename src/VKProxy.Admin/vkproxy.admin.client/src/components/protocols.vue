<template>
  <div>
     {{v}}
  </div>
</template>

<style scoped>
</style>

<script setup lang="ts">
import { isNumber } from 'lodash';
import { GatewayProtocols,toGatewayProtocolsNames } from '../ets/GatewayProtocols'
import { ref } from 'vue';

const props = defineProps({
    protocols: {
        type: Number,
        validator: v => isNumber(v),
        required: true,
    }
})

const v = ref(toGatewayProtocolsNames(props.protocols as GatewayProtocols).join(','))

</script>
