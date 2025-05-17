<template>
  <el-form ref="formRef" :model="v" label-width="auto">
    <div v-for="(node, index) of v.ips" :key="index" style="margin-bottom: 16px;">
      <el-form-item :label="''" :prop="`ips[${Number(index)}]`" :rules="checkIps">
        <div style="display: flex;">
          <el-input v-model="node.ip" class="nopadding">
            <template #prepend>
              <span>{{ $t('Ip') }}</span>
            </template>
            <template #append>
              <el-input-number :min="1" :max="65535" v-model="node.port">
                <template #prefix>
                  <span>{{ $t('Port') }}</span>
                </template>
              </el-input-number>
            </template>
          </el-input>

          <el-button type="danger" @click="remove(index)">
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
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
import { isIpv6, parseIpAddress } from '../service/ip'
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
  return filter(map(n, parseIpAddress), i => i !== null)
}

const validate = async () => {
  if (await formRef?.value?.validate().catch(() => false)) {
    model.value = map(v.ips, i => `${(isIpv6(i.ip) ? `[${i.ip}]` : i.ip)}:${i.port}`)
    return true
  }
  return false
}

const checkIps = [checkIp, {
  validator: (rule: any, value: any, callback: any) => {
    if (v.ips.find(x => value !== x && value.ip === x.ip && value.port === x.port)) {
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
  v.ips.push({ ip: '0.0.0.0', port: 80 })
}

const remove = (n) => {
  v.ips.splice(n, 1)
}

</script>
