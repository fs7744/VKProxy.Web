<template>
  <el-card style="margin: 0; padding: 0;">
    <el-page-header @back="goBack" style="padding-bottom: 8px;">
      <template #content>
        <span> {{ $t('Certificate') }} </span>
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
          <el-table-v2 :width="width" :height="height" :columns="columns" :data="listens" :sort-by="sortState"
            @column-sort="onSort">
          </el-table-v2>
        </template>
      </el-auto-resizer>
    </div>
  </el-card>
  <el-drawer v-model="isEditView" direction="rtl" :before-close="handleClose" size="70%" :title="$t('sni')" >
    <SniDetail :data="editData" :done="() => { isEditView = false; search() }" :allow-route="true"></SniDetail>
  </el-drawer>
</template>


<script setup lang="tsx">
import { ref, reactive } from 'vue'
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
import { isArray, map, orderBy } from "lodash"
import { SniDetail } from '.'
import { SniData } from '../ets/SniData'
import { handleClose, removeConfirm } from '../service/confirm'
import type { SortBy } from 'element-plus'
import { TableV2SortOrder } from 'element-plus'
import { RouteData } from '../ets/RouteData'
import { ClusterData } from '../ets/ClusterData'

const k = useRouteQuery('key')
const isEditView = ref(false)
const editData = ref(new SniData({}))

const { t } = useI18n({
  useScope: 'global'
})

const r = useRouter()

const goBack = () => {
  r.push('/')
}

const searchKey = ref((isArray(k.value) ? k.value[0] : k.value) ?? '')
const listens = ref<any[]>([])

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
    sortable: true,
    width: 150,
    headerCellRenderer: () => (
      <span> {t('key')} </span>
    )
  },
  {
    key: 'Order',
    dataKey: 'Order',
    sortable: true,
    width: 150,
    headerCellRenderer: () => (
      <span> {t('Order')} </span>
    )
  },
  {
    key: 'Passthrough',
    dataKey: 'Passthrough',
    width: 150,
    headerCellRenderer: () => (
      <span> {t('Passthrough')} </span>
    )
  },
  {
    key: 'RouteId',
    dataKey: 'RouteId',
    width: 100,
    headerCellRenderer: () => (
      <span> {t('Routes')} </span>
    )
  },
  {
    key: 'Host',
    dataKey: 'Host',
    minWidth: 150,
    headerCellRenderer: () => (
      <span> {t('Host')} </span>
    )
  } as any,
]

const sortState = ref<SortBy>({
  key:'Order',  order: TableV2SortOrder.ASC
})

const onSort = (sortBy: SortBy) => {
  sortState.value = sortBy
  search()
}

const search = async () => {
  let data = map((await storageService.getSni(searchKey.value)) ?? [], i => new SniData(i))
  data = orderBy(data, [sortState.value.key], [sortState.value.order === TableV2SortOrder.ASC ? 'asc' : 'desc'])
  listens.value = data
}

const edit = async (r: any) => {
  if (r.RouteId) {
    let f = new RouteData((await storageService.getRoute(r.RouteId))[0]);
    if (f.ClusterId) {
      f.Cluster = new ClusterData((await storageService.getCluster(f.ClusterId))[0])
    }
    r.Route = f
  }
  editData.value = r
  isEditView.value = true
}

const remove = async (r: any) => {
  await removeConfirm(r.Key, async () => {
    await storageService.removeSni(r.Key)
    await search()
  })
}

const doNew = async () => {
  editData.value = new SniData({})
  isEditView.value = true
}


search()
</script>

<style scoped></style>
