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
      <el-checkbox v-model="form.UseSni" @change="(v) => { if (v) { form.SniId = null; form.RouteId = null; form.Route = null;} }" />
    </el-form-item>
    <div v-if="!form.UseSni">
      <el-form-item prop="Routes">
        <template #label>
          <span>{{ $t('Routes') }}</span>
          <el-tooltip placement="top">
            <template #content> {{ $t('RoutesTip') }} </template>
            <el-icon>
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </template>
        <div v-if="form.Route" style="width: 100%;">
          <el-button :icon="RemoveFilled" @click="() => { form.RouteId = null; form.Route = null; }" />
          <RouteDetail :data="form.Route" v-model="form.Route" :done="() => { }" :allowUpdate="false" style="gap: 16px 8px;" ref="routeForm" :protocols="form.Protocols"></RouteDetail>
        </div>
        <div v-else>
          <el-button :icon="CirclePlusFilled" @click="() => { dialogSelectRoute = true; }" />
          <el-dialog v-model="dialogSelectRoute">
            <selectRoute v-model="selectedRoute" ></selectRoute>
            <el-button @click="() => { dialogSelectRoute = false; selectedRoute = null; }">{{ $t('Cancel') }}</el-button>
            <el-button type="primary" @click="() => { dialogSelectRoute = false; form.Route = selectedRoute; selectedRoute = null;}">
              {{ $t('Confirm') }}
            </el-button>
          </el-dialog>
        </div>
      </el-form-item>
    </div>
    <!--todo sni -->
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

<style scoped>
</style>

<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import { ListenData, toServiceListen } from '../ets/ListenData';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n';
import { protocolsSelect, ipAddress, selectRoute } from '../components'
import { protocolsValidator } from '../service/validators'
import { storageService } from '../service/storage'
import { QuestionFilled, CirclePlusFilled, RemoveFilled } from '@element-plus/icons-vue'
import { GatewayProtocols } from '../ets/GatewayProtocols'
import RouteDetail from './routeDetail.vue'
import { RouteData } from '../ets/RouteData';

const { t } = useI18n({
  useScope: 'global'
})
const dialogSelectRoute = ref(false)
const formRef = ref<FormInstance>()
const address = ref<any>()
const routeForm = ref<any>()
const forms = [address, routeForm]
const props = defineProps({
  data: {
    type: ListenData,
    validator: v => v != null,
    required: true,
  },
  done: {
  }
})
const selectedRoute = ref<RouteData>(null)
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
  form.Route = props.data.Route
  form.Sni = props.data.Sni
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
  form.RouteId = form.Route?.Key
  var r = await storageService.updateListen(toServiceListen(form));
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
