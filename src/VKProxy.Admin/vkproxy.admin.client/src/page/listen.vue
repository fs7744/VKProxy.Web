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
                <el-table-v2  :width="width"
                :height="height" :columns="columns" :data="listens" >
                </el-table-v2>
            </template>
            </el-auto-resizer>
        </div>
    </el-card>
</template>


<script setup lang="tsx">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import type { Column } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
    ElText,
    ElButton,
    ElIcon,
    ElTag,
    ElTooltip,
    TableV2FixedDir,
} from 'element-plus'
import { storageService } from '../service/storage'
import { protocols } from '../components/protocols.vue'

const { t } = useI18n({
    useScope: 'global'
})

const r = useRouter()

const goBack = () => {
    r.push('/')
}

const searchKey = ref('')
const listens = ref<any[]>([]);

const columns: Column<any>[] = [
    {
        key: 'operations',
        headerCellRenderer: () => (
            <span> {t('operations')} </span>
        ),
        cellRenderer: () => (
            <div style="padding-right: 18px;">
                <ElButton size="small">{t('edit')}</ElButton>
                <ElButton size="small" type="danger">
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
    listens.value = (await storageService.getListen(searchKey.value)) ?? []
}

search()
</script>

<style scoped></style>
