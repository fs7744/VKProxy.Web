<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">

    <el-form-item :label="$t('key')" prop="Key" :rules="checkName" v-if="isNew">
      <el-input v-model="form.Key" />
    </el-form-item>
    <el-form-item :label="$t('key')" prop="Key" v-else>
      <el-text>{{ form.Key }}</el-text>
    </el-form-item>
    <el-form-item prop="Order">
      <template #label>
        <span>{{ $t('Order') }}</span>
        <el-tooltip placement="top">
          <template #content> {{ $t('OrderTip') }} </template>
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </template>
      <el-input-number v-model="form.Order" :min="0" controls-position="right">
      </el-input-number>
    </el-form-item>

    <el-form-item prop="UdpResponses" v-if="protocols & GatewayProtocols.UDP">
      <template #label>
        <span>{{ $t('UdpResponses') }}</span>
        <el-tooltip placement="top">
          <template #content> {{ $t('UdpResponsesTip') }} </template>
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </template>
      <el-input-number v-model="form.UdpResponses" :min="0" controls-position="right">
      </el-input-number>
    </el-form-item>

    <el-form-item prop="ClusterId">
      <template #label>
        <span>{{ $t('Clusters') }}</span>
        <el-tooltip placement="top">
          <template #content> {{ $t('ClustersTip') }} </template>
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </template>
      <div v-if="form.Cluster" style="width: 100%;">
        <el-button :icon="RemoveFilled" @click="() => { form.ClusterId = null; form.Cluster = null; }" />
        <ClusterDetail :data="form.Cluster" :done="() => { }" :allowUpdate="false" ref="clusterformRef" v-model="form.Cluster"></ClusterDetail>
      </div>
      <div v-else>
        <el-button :icon="CirclePlusFilled" @click="() => { dialogSelectCluster = true; }" />
        <el-dialog v-model="dialogSelectCluster">
          <selectCluster v-model="selectedCluster"></selectCluster>
          <el-button @click="() => { dialogSelectCluster = false; selectedCluster = null; }">{{ $t('Cancel')
            }}</el-button>
          <el-button type="primary"
            @click="() => { dialogSelectCluster = false; form.Cluster = selectedCluster; selectedCluster = null; }">
            {{ $t('Confirm') }}
          </el-button>
        </el-dialog>
      </div>
    </el-form-item>

    <!--todo -->
    <el-form-item v-if="allowUpdate">
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
import { RouteData } from '../ets/RouteData';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n';
import { storageService } from '../service/storage'
import { QuestionFilled, RemoveFilled, CirclePlusFilled } from '@element-plus/icons-vue'
import { GatewayProtocols } from '../ets/GatewayProtocols';
import ClusterDetail from './clusterDetail.vue';
import { ClusterData } from '../ets/ClusterData';
import { selectCluster } from '../components';

const { t } = useI18n({
  useScope: 'global'
})

const dialogSelectCluster = ref(false)
const selectedCluster = ref<ClusterData>(null)
const formRef = ref<FormInstance>()
const clusterformRef = ref<any>()
const forms = [clusterformRef]
const props = defineProps({
  data: {
    type: RouteData,
    validator: v => v != null,
    required: true,
  },
  done: {
  },
  allowUpdate: {
    type: Boolean,
  },
  protocols: {
    type: Number
  }
})

const model = defineModel<RouteData>({ required: false, default: null })

const isNew = ref(false)
const form = reactive(new RouteData({}))
const rules = reactive<FormRules<RouteData>>({
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
      const v = await element.value.validate();
      if (!v) {
        invalid = true
      }
    }
  }
  if (invalid || !formEl || !await formEl.validate().catch(() => false)) {
    ElMessage.error(t('wrongSave'))
    return
  }
  var r = await storageService.updateRoute(form);
  (props.done as any)()
}

const checkName = [{
  validator: (rule: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error(t('required')))
    } else {
      storageService.existsRoute(value).then(i => {
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

const validate = async () => {
  let invalid = false
  for (const element of forms) {
    if (element && element.value) {
      const v = await element.value.validate();
      if (!v) {
        invalid = true
      }
    }
  }
  form.ClusterId = form.Cluster?.Key
  if (!formRef.value || !await formRef.value.validate().catch(() => false)) {
    invalid = true
  }
  if (invalid) {
    return false
  }
  model.value = new RouteData(form)
  return true
}

defineExpose({
  validate
})

</script>
