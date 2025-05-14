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
                :height="height" :columns="columns" :data="listens" fixed>
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
const { t } = useI18n({
    useScope: 'global'
})

const r = useRouter()

const goBack = () => {
    r.push('/')
}

const searchKey = ref('')
const listens = ref<any[]>([{ Key: 'http_dddd', Protocols: 12, Address: ["127.0.0.1:5001", "[::1]:5001"] }]);

const columns: Column<any>[] = [
    {
        key: 'Key',
        dataKey: 'Key',
        width: 150,
        fixed: TableV2FixedDir.LEFT,
        headerCellRenderer: () => (
            <span> {t('key')} </span>
        )
    },
    {
        key: 'Protocols',
        dataKey: 'Protocols',
        width: 150,
        fixed: TableV2FixedDir.LEFT,
        headerCellRenderer: () => (
            <span> {t('protocols')} </span>
        )
    },
    {
        key: 'Address',
        dataKey: 'Address',
        width: 350,
        headerCellRenderer: () => (
            <span> {t('address')} </span>
        )
    },
    {
        key: 'operations',
        title: 'Operations',
        cellRenderer: () => (
            <div>
                <ElButton size="small">{t('edit')}</ElButton>
                <ElButton size="small" type="danger">
                    {t('delete')}
                </ElButton>
            </div>
        ),
        width: 150,
        align: 'center',
    }
]

const search = () => {
    console.log(searchKey.value)
}
</script>

<style scoped></style>