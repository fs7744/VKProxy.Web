<template>
  <el-form ref="formRef" :model="v" label-width="auto" :rules="checks">
    <div v-for="(node, index) of v.ips" :key="index" style="margin-bottom: 16px;">
      <el-form-item :label="''" :prop="`ips[${Number(index)}]`" :rules="checkIps">
        <div style="display: flex; gap: 16px 8px;">
          <el-button type="danger" @click="remove(index)">
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
          <el-input v-model="node.host" class="nopadding">
            <template #prepend>
              <span>{{ $t('Ip') }}</span>
            </template>
            <template #append>
              <el-input-number :min="1" :max="65535" v-model="node.port" controls-position="right">
                <template #prefix>
                  <span>{{ $t('Port') }}</span>
                </template>
              </el-input-number>
            </template>
          </el-input>
        </div>
      </el-form-item>
    </div>

    <el-form-item prop="ips" style="margin-bottom: 0px !important;">
    <el-button @click="add">
      <el-icon>
        <Plus />
      </el-icon>
    </el-button>
    </el-form-item >
  </el-form>


</template>

<style scoped></style>

<script setup lang="ts">
import { map, filter } from 'lodash'
import { reactive, ref, watch } from 'vue'
import { isIpv6, parseIpAddress } from '../service/ip'
import { checkIp } from '../service/validators'
import type { FormInstance } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'global'
})

const formRef = ref<FormInstance>()

const model = defineModel({ required: true, default: [] })
const v = reactive({ ips: p(model.value) })

watch(model, (n) => v.ips = p(n))

function p(n: any) {
  return filter(map(n, parseIpAddress), i => i !== null)
}

const validate = async () => {
  if (await formRef?.value?.validate().catch(() => false)) {
    model.value = map(v.ips, i => `${(isIpv6(i.host) ? `[${i.host}]` : i.host)}:${i.port}`)
    return true
  }
  return false
}

const checks= {
 ips: [{ required: true, message: () => t('required'), trigger: 'blur' },]
}

const checkIps = [checkIp, {
  validator: (rule: any, value: any, callback: any) => {
    if(v.ips.length == 0) {
      callback(new Error(t('required')))
    }
    else if (v.ips.find(x => value !== x && value.host === x.host && value.port === x.port)) {
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
  v.ips.push({ host: '0.0.0.0', port: 80 })
  validate()
}

const remove = (n: any) => {
  v.ips.splice(n, 1)
}

</script>
