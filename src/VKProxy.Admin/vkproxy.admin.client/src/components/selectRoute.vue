<template>
  <div style="margin-bottom: 16px;">
    <el-radio-group v-model="c" @change="(v) => { model = v === true ? null : new RouteData(null); }" style="margin-bottom: 16px;">
      <el-radio-button :label="$t('SelectRoute')" :value="true" />
      <el-radio-button :label="$t('NewRoute')" :value="false" />
    </el-radio-group>

  <el-select-v2 v-if="c" filterable remote v-model="model" :remote-method="searchRoute" clearable :options="options"
    :loading="loading">
    <template #default="{ item }">
      <span style="margin-right: 8px">{{ item.value.Key }}</span>
      <span style="margin-right: 8px">(Order: {{ item.value.Order }})</span>
    </template>
  </el-select-v2>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { map } from 'lodash';
import { ref } from 'vue';
import { RouteData } from '../ets/RouteData';
import { storageService } from '../service/storage';

interface ListItem {
  value: RouteData
  label: string
}

const c = ref(true)
const model = defineModel({ required: true, default: null })
const options = ref<ListItem[]>([])
const loading = ref(false)

const searchRoute = async (query: string) => {
  if (query !== '') {
    loading.value = true
    let data = map((await storageService.getRoute(query, true)) ?? [], i => {
      const j = new RouteData(i)
      return { value: j, label: j.Key }
    })
    loading.value = false
    options.value = data
  } else {
    options.value = []
  }
}


</script>
