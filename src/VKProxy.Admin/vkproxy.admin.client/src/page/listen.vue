<template>
  <el-card style="margin: 0; padding: 0;">
    <el-page-header @back="goBack" style="padding-bottom: 8px;">
      <template #content>
        <span> {{ $t('Listen') }} </span>
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
  <el-drawer v-model="isEditView" direction="rtl" :before-close="handleClose" :title="$t('Listen')" size="70%"
    :destroy-on-close="true">
    <ListenDetail :data="editData" :done="() => { isEditView = false; search() }"></ListenDetail>
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
import { isArray, map, orderBy, keys } from "lodash"
import { protocols } from '../components'
import { ListenDetail } from '.'
import { ListenData } from '../ets/ListenData'
import { handleClose, removeConfirm } from '../service/confirm'
import { TableV2SortOrder } from 'element-plus'
import type { SortBy, SortState } from 'element-plus'
import { RouteData } from '../ets/RouteData'
import { ClusterData } from '../ets/ClusterData'
import { SniData } from '@/ets/SniData'

const k = useRouteQuery('key')
const isEditView = ref(false)
const editData = ref(new ListenData({}))

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
    key: 'Protocols',
    dataKey: 'Protocols',
    width: 150,
    headerCellRenderer: () => (
      <span> {t('protocols')} </span>
    ),
    cellRenderer: ({ cellData: p }) => (
      <protocols protocols={p}> </protocols>
    )
  },
  {
    key: 'SniId',
    dataKey: 'SniId',
    width: 150,
    headerCellRenderer: () => (
      <span> {t('sni')} </span>
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
    key: 'Address',
    dataKey: 'Address',
    minWidth: 150,
    headerCellRenderer: () => (
      <span> {t('address')} </span>
    )
  } as any
]

const sortState = ref<SortState>({
  'Key': TableV2SortOrder.ASC,
})

const onSort = ({ key, order }: SortBy) => {
  sortState.value[key] = order
  search()
}

const search = async () => {
  let data = map((await storageService.getListen(searchKey.value)) ?? [], i => new ListenData(i))
  const ks = keys(sortState.value)
  data = orderBy(data, ks, map(ks, (k) => sortState.value[k] === TableV2SortOrder.ASC ? 'asc' : 'desc'))
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
  if (r.SniId) {
    let f = new SniData((await storageService.getSni(r.SniId))[0]);
    if (f.RouteId) {
      f.Route = new RouteData((await storageService.getRoute(f.RouteId))[0])
      if (f.Route.ClusterId) {
        f.Route.Cluster = new ClusterData((await storageService.getCluster(f.Route.ClusterId))[0])
      }
    }
    r.Sni = f
  }
  editData.value = r
  isEditView.value = true
}

const remove = async (r: any) => {
  await removeConfirm(r.Key, async () => {
    await storageService.removeListen(r.Key)
    await search()
  })
}

const doNew = async () => {
  editData.value = new ListenData({})
  isEditView.value = true
}


search()
</script>

<style scoped></style>
