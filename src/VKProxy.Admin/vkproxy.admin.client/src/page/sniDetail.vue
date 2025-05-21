<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">

    <el-form-item :label="$t('key')" prop="Key" :rules="checkName" v-if="isNew">
      <el-input v-model="form.Key"  />
    </el-form-item>
    <el-form-item :label="$t('key')" prop="Key" v-else>
      <el-text >{{ form.Key }}</el-text>
    </el-form-item>

    <!--todo -->
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
import { SniData } from '../ets/SniData';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n';
import { storageService } from '../service/storage'

const { t } = useI18n({
  useScope: 'global'
})

const formRef = ref<FormInstance>()
const forms = []
const props = defineProps({
  data: {
    type: SniData,
    validator: v => v != null,
    required: true,
  },
  done: {
  }
})

const isNew = ref(false)
const form = reactive(new SniData({}))
const rules = reactive<FormRules<SniData>>({
  Key: [{ required: true, message: () => t('required'), trigger: 'blur' },
  { min: 1, message: () => t('requiredLength') + '1', trigger: 'blur' },],
})

watchEffect(() => {
  isNew.value = props.data.Key == null
  form.Key = props.data.Key
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
 var r = await storageService.updateSni(form);
 (props.done as any)()
}

const checkName = [{
  validator: (rule: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error(t('required')))
    } else {
      storageService.existsSni(value).then(i => {
        if(i) {
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
