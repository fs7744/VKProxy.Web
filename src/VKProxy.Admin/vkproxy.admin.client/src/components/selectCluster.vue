<template>
  <div style="margin-bottom: 16px;">
    <el-radio-group v-model="c" @change="(v: any) => { model = v === true ? null : new ClusterData(null); }" style="margin-bottom: 16px;">
      <el-radio-button :label="$t('SelectCluster')" :value="true" />
      <el-radio-button :label="$t('NewCluster')" :value="false" />
    </el-radio-group>

  <el-select-v2 v-if="c" filterable remote v-model="model" :remote-method="searchCluster" clearable :options="options"
    :loading="loading">
    <template #default="{ item }">
      <span style="margin-right: 8px">{{ item.value.Key }}</span>
      <span style="margin-right: 8px">({{ item.value.Destinations }})</span>
    </template>
  </el-select-v2>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { map } from 'lodash';
import { ref } from 'vue';
import { ClusterData } from '../ets/ClusterData';
import { storageService } from '../service/storage';

interface ListItem {
  value: ClusterData
  label: string
}

const c = ref(true)
const model = defineModel({ required: true, default: null })
const options = ref<ListItem[]>([])
const loading = ref(false)

const searchCluster = async (query: string) => {
  if (query !== '') {
    loading.value = true
    let data = map((await storageService.getCluster(query, true)) ?? [], i => {
      const j = new ClusterData(i)
      return { value: j, label: j.Key }
    })
    loading.value = false
    options.value = data
  } else {
    options.value = []
  }
}


</script>
