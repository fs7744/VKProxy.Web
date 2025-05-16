<template>
  <el-card style="margin: 0; padding: 0;">
    <el-page-header @back="goBack" style="padding-bottom: 8px;">
      <template #content>
        <span> {{ $t('Listen') }} </span>
      </template>
    </el-page-header>
    <div style="padding-bottom: 8px;">
      <el-input placeholder="Please input" v-model="searchKey" @change="search()">
        <template #prepend>
          <el-button :icon="Search" @click="search()" />
        </template>
      </el-input>
    </div>
    <div style="height: 400px; width: 100%;">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2 :width="width" :height="height" :columns="columns" :data="listens">
            <template #footer>
              <div style="padding: 8px; border-top: 1px solid var(--el-border-color);">
                <ElButton size="small" type="primary" @click="doNew()">{{ $t('new') }}</ElButton>
              </div>
            </template>
          </el-table-v2>
        </template>

      </el-auto-resizer>
    </div>
  </el-card>
  <el-drawer v-model="isEditView" direction="rtl" :before-close="handleClose" :with-header="false">
    <ListenDetail :data="editData"></ListenDetail>
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
import { protocols } from '../components'
import { useRouteQuery } from '@vueuse/router'
import { isArray, map } from "lodash"
import { ListenDetail } from '.'
import { ListenData } from '../ets/ListenData'
import { handleClose, removeConfirm } from '../service/confirm'

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
      <span> {t('operations')} </span>
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
    headerCellRenderer: () => (
      <span> {t('key')} </span>
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
    key: 'Key',
    dataKey: 'Key',
    width: 150,
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
    key: 'Address',
    dataKey: 'Address',
    minWidth: 150,
    headerCellRenderer: () => (
      <span> {t('address')} </span>
    )
  } as any
]

const search = async () => {
  listens.value = map((await storageService.getListen(searchKey.value)) ?? [], i => new ListenData(i))
}

const edit = async (r) => {
  editData.value = r
  isEditView.value = true
}

const remove = async (r) => {
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
