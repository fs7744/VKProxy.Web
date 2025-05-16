<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">

    <el-form-item :label="$t('key')" prop="Key">
      <el-input v-model="form.Key" v-if="isNew" />
      <el-text v-else>{{ form.Key }}</el-text>
    </el-form-item>

    <el-form-item :label="$t('protocols')" prop="Protocols">
      <protocolsSelect v-model="form.Protocols" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)">
        <el-text v-model="form.Key" v-if="isNew">{{ $t('create') }}</el-text>
        <el-text v-else>{{ $t('update') }}</el-text>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>

<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import { ListenData } from '../ets/ListenData';
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n';
import { protocolsSelect } from '../components'
import { protocolsValidator } from '../service/validators'

const { t } = useI18n({
  useScope: 'global'
})

const formRef = ref<FormInstance>()
const props = defineProps({
  data: {
    type: ListenData,
    validator: v => v != null,
    required: true,
  }
})

const isNew = ref(false)
const form = reactive(new ListenData({}))
const rules = reactive<FormRules<ListenData>>({
  Key: [{ required: true, message: () => t('required'), trigger: 'blur' },
  { min: 1, message: () => t('requiredLength') + '1', trigger: 'blur' },],
  Protocols: [{ required: true, message: () => t('required'), trigger: 'change' }, protocolsValidator]
})

watchEffect(() => {
  isNew.value = props.data.Key == null
  form.Key = props.data.Key
  form.Address = props.data.Address
  form.Protocols = props.data.Protocols
  form.RouteId = props.data.RouteId
  form.SniId = props.data.SniId
  form.UseSni = props.data.UseSni
  // if(isNew.value) {
  //   form.Key = crypto.randomUUID()
  // }
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', form)
    } else {
      console.log('error submit!', fields)
    }
  })
}

</script>
