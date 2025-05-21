<template>
  <el-select v-model="v" @change="vv => changeV(vv)" multiple style="min-width: 200px;">
      <el-option key="None" label="None" :value="0" />
      <el-option key="Ssl2" label="Ssl2" :value="12" />
      <el-option key="Ssl3" label="Ssl3" :value="48" />
      <el-option key="Tls" label="Tls" :value="192" />
      <el-option key="Tls11" label="Tls11" :value="768" />
      <el-option key="Tls12" label="Tls12" :value="3072" />
      <el-option key="Tls13" label="Tls13" :value="12288" />
  </el-select>
</template>
<style scoped></style>

<script setup lang="ts">
import { SslProtocols,toSslProtocols,unionSslProtocols } from '../ets/ClusterData'
import { ref,watch  } from 'vue';

const model = defineModel({ required: true, default: SslProtocols.None })

const v = ref(toSslProtocols(model.value))

watch(model, (n) => {
  v.value = toSslProtocols(n)
})

const changeV = (vv: any) => {
  model.value = unionSslProtocols(vv)
}
</script>
