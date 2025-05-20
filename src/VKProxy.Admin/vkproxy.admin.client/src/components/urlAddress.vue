<template>
  <el-form ref="formRef" :model="v" label-width="auto">
    <div v-for="(node, index) of v.ips" :key="index" style="margin-bottom: 16px;">
      <el-form-item :label="''" :prop="`ips[${Number(index)}]`" :rules="checkIps">
        <div style="display: flex; gap: 16px 8px;">
          <el-button type="danger" @click="remove(index)" >
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
          <el-select v-model="node.protocol" :placeholder="''" >
            <el-option key="" label="" value="" />
            <el-option key="https://" label="https://" value="https://" />
            <el-option key="http://" label="http://" value="http://" />
          </el-select>
          <el-input v-model="node.host" :placeholder="$t('Host')">
          </el-input>
          <el-input-number :min="1" :max="65535" v-model="node.port" controls-position="right" style="min-width: 100px;" :placeholder="$t('Port')">
          </el-input-number>
          <el-input v-model="node.pathname" :placeholder="$t('Path')" style="min-width: 300px;">
          </el-input>
          <el-input v-model="node.search" :placeholder="$t('QueryString')" style="min-width: 300px;">
          </el-input>
          <el-input v-model="node.replaceHost" :placeholder="$t('Host')" >
          </el-input>
        </div>

      </el-form-item>
    </div>
    <el-button @click="add">
      <el-icon>
        <Plus />
      </el-icon>
    </el-button>
  </el-form>


</template>

<style scoped></style>

<script setup lang="ts">
import { map, filter } from 'lodash'
import { reactive, ref, watch } from 'vue'
import { isIpv6, parseAddress } from '../service/ip'
import { checkIp } from '../service/validators'
import { FormInstance } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'global'
})

const formRef = ref<FormInstance>()

const model = defineModel({ required: true, default: [] })
const v = reactive({ ips: p(model.value) })

watch(model, (n) => v.ips = p(n))

function p(n) {
  console.log(n, filter(map(n, i => parseAddress(i.Address, i.Host)), i => i !== null))
  return filter(map(n, i => parseAddress(i.Address, i.Host)), i => i !== null)
}

const validate = async () => {
  if (await formRef?.value?.validate().catch(() => false)) {
    model.value = map(v.ips, i => { return { Address: toUrl(i), Host: i.replaceHost === '' ? null : i.replaceHost } })
    return true
  }
  return false
}

const checkIps = [{
  validator: (rule: any, value: any, callback: any) => {
    let u = toUrl(value)
    if(!u.startsWith('https://') && !u.startsWith('http://')) {
      u = 'http://' + u;
    }
    const s = parseAddress(u, '')
    if(!s) {
      callback(new Error(t('wrongFormat')))
    } else if(value.protocol && value.protocol !== s.protocol) {
      callback(new Error(t('wrongprotocol')))
    } else if (value.host !== s.host) {
      callback(new Error(t('wronghost')))
    } else if (value.port !== s.port) {
      callback(new Error(t('wrongport')))
    } else if (value.pathname && value.pathname !== s.pathname) {
      callback(new Error(t('wrongpathname')))
    } else if (value.search && value.search !== s.search) {
      callback(new Error(t('wrongsearch')))
    } else if (v.ips.find(x => value !== x && value.protocol === x.protocol  && value.host === x.host && value.port === x.port && value.pathname === x.pathname && value.search === x.search && value.replaceHost === x.replaceHost)) {
      callback(new Error(t('alreadyExists')))
    } else {
      callback()
    }
  }, trigger: 'blur'
}]


defineExpose({
  validate
})

const add = () => {
  v.ips.push({
    protocol: 'https://',
    host: '0.0.0.0', port: 443,
    replaceHost: null
  })
}

const remove = (n) => {
  v.ips.splice(n, 1)
}


function toUrl(i: any ): string {
  return `${(i.protocol ? i.protocol.toLocaleLowerCase() : '')}${(isIpv6(i.host) ? `[${i.host}]` : i.host)}:${i.port}${(i.pathname && i.pathname !== '/' ? i.pathname : '')}${(i.search ? i.search : '')}`
}
</script>
