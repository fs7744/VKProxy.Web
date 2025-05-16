<template>
  <el-select v-model="v" @change="vv => changeV(vv)" multiple>
    <el-option-group key="Layer 4" label="Layer 4">
      <el-option key="TCP" label="TCP" :value="1" />
      <el-option key="UDP" label="UDP" :value="2" />
    </el-option-group>
    <el-option-group key="Layer 7" label="Layer 7">
      <el-option key="HTTP1" label="HTTP1" :value="4" />
      <el-option key="HTTP2" label="HTTP2" :value="8" />
      <el-option key="HTTP3" label="HTTP3" :value="16" />
    </el-option-group>
  </el-select>
</template>

<style scoped></style>

<script setup lang="ts">
import { GatewayProtocols, toGatewayProtocols, unionGatewayProtocols } from '../ets/GatewayProtocols'
import { ref,watch  } from 'vue';

const model = defineModel({ required: true, default: GatewayProtocols.HTTP1 })

const v = ref(toGatewayProtocols(model.value))

watch(model, (n) => {
  v.value = toGatewayProtocols(n)
})

const changeV = (vv: any) => {
  model.value = unionGatewayProtocols(vv)
}
</script>
