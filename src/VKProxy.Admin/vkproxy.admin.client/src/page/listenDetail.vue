<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">

    <el-form-item :label="$t('key')" prop="Key" :rules="checkName" v-if="isNew">
      <el-input v-model="form.Key" />
    </el-form-item>
    <el-form-item :label="$t('key')" prop="Key" v-else>
      <el-text>{{ form.Key }}</el-text>
    </el-form-item>

    <el-form-item :label="$t('protocols')" prop="Protocols">
      <protocolsSelect v-model="form.Protocols" />
    </el-form-item>

    <el-form-item :label="$t('address')" prop="Address">
      <ipAddress v-model="form.Address" ref="address" />
    </el-form-item>
    <el-form-item prop="UseSni">
      <template #label>
        <span>{{ $t('UseSni') }}</span>
        <el-tooltip placement="top">
          <template #content> {{ $t('UseSniTip') }} </template>
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </template>
      <el-checkbox v-model="form.UseSni" @change="(v) => { if (v) { form.SniId = null; form.RouteId = null; } }" />
    </el-form-item>
    <!--todo sni and route-->
    {{ form }}
    <el-form-item>
      <template #label>
        <el-button type="primary" @click="submitForm(formRef)">
          <el-text v-model="form.Key" v-if="isNew">{{ $t('create') }}</el-text>
          <el-text v-else>{{ $t('update') }}</el-text>
        </el-button>
      </template>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>

<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import { ListenData } from '../ets/ListenData';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n';
import { protocolsSelect, ipAddress } from '../components'
import { protocolsValidator } from '../service/validators'
import { storageService } from '../service/storage'
import { QuestionFilled } from '@element-plus/icons-vue'
import { GatewayProtocols } from '../ets/GatewayProtocols';

const { t } = useI18n({
  useScope: 'global'
})

const formRef = ref<FormInstance>()
const address = ref<any>()
const forms = [address]
const props = defineProps({
  data: {
    type: ListenData,
    validator: v => v != null,
    required: true,
  },
  done: {
  }
})

const isNew = ref(false)
const form = reactive(new ListenData({}))
const rules = reactive<FormRules<ListenData>>({
  Key: [{ required: true, message: () => t('required'), trigger: 'blur' },
  { min: 1, message: () => t('requiredLength') + '1', trigger: 'blur' },],
  Protocols: [{ required: true, message: () => t('required'), trigger: 'change' }, protocolsValidator, {
    validator: (rule: any, value: any, callback: any) => {
      if (form.UseSni && (value & GatewayProtocols.HTTP1 || value & GatewayProtocols.HTTP2 || value & GatewayProtocols.HTTP3 || value & GatewayProtocols.HTTP3)) {
        callback(new Error(t('UseSniError')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  Address: [{ required: true, message: () => t('required'), trigger: 'change' }],
  UseSni: [{
    validator: (rule: any, value: any, callback: any) => {
      if (value && (form.Protocols & GatewayProtocols.HTTP1 || form.Protocols & GatewayProtocols.HTTP2 || form.Protocols & GatewayProtocols.HTTP3 || form.Protocols & GatewayProtocols.HTTP3)) {
        callback(new Error(t('UseSniError')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }]
})

watchEffect(() => {
  isNew.value = props.data.Key == null
  form.Key = props.data.Key
  form.Address = props.data.Address
  form.Protocols = props.data.Protocols
  form.RouteId = props.data.RouteId
  form.SniId = props.data.SniId
  form.UseSni = props.data.UseSni
})

const submitForm = async (formEl: FormInstance | undefined) => {
  let invalid = false
  for (const element of forms) {
    if (element && element.value) {
      const v = !await element.value.validate();
      if (!invalid) {
        invalid = v
      }
    }
  }
  if (invalid || !formEl || !await formEl.validate().catch(() => false)) {
    ElMessage.error(t('wrongSave'))
    return
  }
  var r = await storageService.updateListen(form);
  (props.done as any)()
}

const checkName = [{
  validator: (rule: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error(t('required')))
    } else {
      storageService.existsListen(value).then(i => {
        if (i) {
          callback(new Error(t('alreadyExists')))
        } else {
          callback()
        }
      }).catch(ex => {
        callback(ex)
      })
    }
  }, trigger: 'blur'
}]

</script>
