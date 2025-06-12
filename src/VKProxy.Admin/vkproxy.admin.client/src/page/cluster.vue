<template>
  <el-card style="margin: 0; padding: 0;">
    <el-page-header @back="goBack" style="padding-bottom: 8px;">
      <template #content>
        <span> {{ $t('Clusters') }} </span>
      </template>
    </el-page-header>
    <div style="padding-bottom: 8px;">
      <el-input :placeholder="$t('inputPrefix')" v-model="searchKey" @change="search()">
        <template #prepend>
          <el-button :icon="Search" @click="search()" />
        </template>
      </el-input>
    </div>
    <div style="height: 80vh; width: 100%; display: -webkit-flex;">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2 :width="width" :height="height" :columns="columns" :data="listens" v-model:sort-state="sortState"
            @column-sort="onSort">
          </el-table-v2>
        </template>
      </el-auto-resizer>
    </div>
  </el-card>
  <el-drawer v-model="isEditView" direction="rtl" :before-close="handleClose" :title="$t('Clusters')"  size="70%">
    <ClusterDetail :data="editData" :done="() => { isEditView = false; search() }" :allow-update="true"></ClusterDetail>
  </el-drawer>
</template>


<script setup lang="tsx">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import type { Column } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  ElButton,
  TableV2FixedDir
} from 'element-plus'
import { storageService } from '../service/storage'
import { useRouteQuery } from '@vueuse/router'
import { isArray, map, orderBy, keys } from "lodash"
import { ClusterDetail } from '.'
import { ClusterData } from '../ets/ClusterData'
import { handleClose, removeConfirm } from '../service/confirm'
import { TableV2SortOrder } from 'element-plus'
import type { SortBy, SortState } from 'element-plus'

const k = useRouteQuery('key')
const isEditView = ref(false)
const editData = ref(new ClusterData({}))

const { t } = useI18n({
  useScope: 'global'
})

const r = useRouter()

const goBack = () => {
  r.push('/')
}

const searchKey = ref((isArray(k.value) ? k.value[0] : k.value) ?? '')
const listens = ref<any[]>([]);

const columns: Column<any>[] = [
  {
    key: 'operations',
    headerCellRenderer: () => (
      <ElButton size="small" type="primary" onClick={() => doNew()}>{t('new')}</ElButton>
    ),
    cellRenderer: ({ rowData: r }) => (
      <div style="padding-right: 18px;">
        <ElButton size="small" onClick={() => { edit(r) }} >{t('edit')}</ElButton>
        <ElButton size="small" type="danger" onClick={() => { remove(r) }}>
          {t('delete')}
        </ElButton>
      </div>
    ),
    width: 150,
    align: 'center',
    fixed: TableV2FixedDir.LEFT,
  },
  {
    key: 'Key',
    dataKey: 'Key',
    width: 150,
    sortable: true,
    headerCellRenderer: () => (
      <span> {t('key')} </span>
    )
  },
  {
    key: 'LoadBalancingPolicy',
    dataKey: 'LoadBalancingPolicy',
    width: 150,
    headerCellRenderer: () => (
      <span> {t('LoadBalancingPolicy')} </span>
    )
  },
  {
    key: 'HealthCheckType',
    dataKey: 'HealthCheckType',
    width: 150,
    headerCellRenderer: () => (
      <span> {t('HealthCheck')} </span>
    )
  },
  {
    key: 'HttpClientConfigEnable',
    dataKey: 'HttpClientConfigEnable',
    width: 150,
    headerCellRenderer: () => (
      <span> {t('HttpClientConfig')} </span>
    )
  },
  {
    key: 'Destinations',
    dataKey: 'Destinations',
    minWidth: 150,
    headerCellRenderer: () => (
      <span> {t('Destinations')} </span>
    )
  } as any,
]

const sortState = ref<SortState>({
  'Key': TableV2SortOrder.ASC,
})

const onSort = ({ key, order }: SortBy) => {
  sortState.value[key] = order
  search()
}

const search = async () => {
  let data = map((await storageService.getCluster(searchKey.value)) ?? [], i => new ClusterData(i))
  const ks = keys(sortState.value)
  data = orderBy(data, ks, map(ks, (k) => sortState.value[k] === TableV2SortOrder.ASC ? 'asc' : 'desc'))
  listens.value = data
}

const edit = async (r: any) => {
  editData.value = r
  isEditView.value = true
}

const remove = async (r: any) => {
  await removeConfirm(r.Key, async () => {
    await storageService.removeCluster(r.Key)
    await search()
  })
}

const doNew = async () => {
  editData.value = new ClusterData({})
  isEditView.value = true
}


search()
</script>

<style scoped></style>
