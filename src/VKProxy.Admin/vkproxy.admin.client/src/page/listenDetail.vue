<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">

    <el-form-item :label="$t('key')" prop="Key" :rules="checkName" v-if="isNew">
      <el-input v-model="form.Key" />
    </el-form-item>
    <el-form-item :label="$t('key')" prop="Key" v-else>
      <el-text>{{ form.Key }}</el-text>
    </el-form-item>

    <el-form-item :label="$t('protocols')" prop="Protocols">
      <protocolsSelect v-model="form.Protocols" @changeProtocols="i => changeProtocols(i, form.UseSni)" />
    </el-form-item>

    <el-form-item :label="$t('address')" prop="Address">
      <ipAddress v-model="form.Address" ref="address" />
    </el-form-item>
    <el-form-item prop="UseSni" v-if="hasSniProxy">
      <template #label>
        <span>{{ $t('UseSni') }}</span>
        <el-tooltip placement="top">
          <template #content> {{ $t('UseSniTip') }} </template>
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </template>
      <el-checkbox v-model="form.UseSni" @change="(v) => { changeProtocols(form.Protocols, v) }" />
    </el-form-item>
    <div v-if="hasSni">
      <el-form-item prop="Sni">
        <template #label>
          <span>{{ $t('Certificate') }}</span>
        </template>
        <div v-if="form.Sni" style="width: 100%;">
          <el-button :icon="RemoveFilled" @click="() => { form.SniId = null; form.Sni = null; }" />
          <SniDetail :data="form.Sni" v-model="form.Sni" :done="() => { }" :allowUpdate="false"
            :allowRoute="allowSniRoute" style="gap: 16px 8px;" ref="sniForm"></SniDetail>
        </div>
        <div v-else>
          <el-button :icon="CirclePlusFilled" @click="() => { dialogSelectSni = true; }" />
          <el-dialog v-model="dialogSelectSni">
            <selectSni v-model="selectedSni"></selectSni>
            <el-button @click="() => { dialogSelectSni = false; selectedSni = null; }">{{ $t('Cancel') }}</el-button>
            <el-button type="primary"
              @click="() => { dialogSelectSni = false; form.Sni = selectedSni; selectedSni = null; }">
              {{ $t('Confirm') }}
            </el-button>
          </el-dialog>
        </div>
      </el-form-item>
    </div>
    <div v-if="hasRoute">
      <el-form-item prop="Route">
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
          <RouteDetail :data="form.Route" v-model="form.Route" :done="() => { }" :allowUpdate="false"
            style="gap: 16px 8px;" ref="routeForm" :protocols="form.Protocols"></RouteDetail>
        </div>
        <div v-else>
          <el-button :icon="CirclePlusFilled" @click="() => { dialogSelectRoute = true; }" />
          <el-dialog v-model="dialogSelectRoute">
            <selectRoute v-model="selectedRoute"></selectRoute>
            <el-button @click="() => { dialogSelectRoute = false; selectedRoute = null; }">{{ $t('Cancel')
              }}</el-button>
            <el-button type="primary"
              @click="() => { dialogSelectRoute = false; form.Route = selectedRoute; selectedRoute = null; }">
              {{ $t('Confirm') }}
            </el-button>
          </el-dialog>
        </div>
      </el-form-item>
    </div>
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
import { ListenData, toServiceListen } from '../ets/ListenData';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n';
import { protocolsSelect, ipAddress, selectRoute, selectSni } from '../components'
import { protocolsValidator } from '../service/validators'
import { storageService } from '../service/storage'
import { QuestionFilled, CirclePlusFilled, RemoveFilled } from '@element-plus/icons-vue'
import { GatewayProtocols } from '../ets/GatewayProtocols'
import RouteDetail from './routeDetail.vue'
import SniDetail from './sniDetail.vue'
import { RouteData } from '../ets/RouteData';
import { SniData } from '../ets/SniData';

const { t } = useI18n({
  useScope: 'global'
})
const dialogSelectRoute = ref(false)
const dialogSelectSni = ref(false)
const formRef = ref<FormInstance>()
const address = ref<any>()
const routeForm = ref<any>()
const sniForm = ref<any>()
const forms = [address, routeForm, sniForm]
const props = defineProps({
  data: {
    type: ListenData,
    validator: v => v != null,
    required: true,
  },
  done: {
  }
})
const selectedSni = ref<SniData>(null)
const selectedRoute = ref<RouteData>(null)
const hasRoute = ref(false)
const hasSni = ref(false)
const allowSniRoute = ref(false)
const hasSniProxy = ref(false)
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

const changeProtocols = (p: GatewayProtocols, useSni: boolean) => {
  if (p === GatewayProtocols.TCP) {
    hasRoute.value = true
    hasSniProxy.value = true
    hasSni.value = useSni
    if (!useSni) {
      allowSniRoute.value = false
      form.Sni = null
      form.SniId = null
    } else if (useSni === true) {
      allowSniRoute.value = true
      hasRoute.value = false
      if (form.Route) {
        form.Route = null
        form.RouteId = null
      }
    }
  } else if (p === GatewayProtocols.UDP || p === (GatewayProtocols.UDP | GatewayProtocols.TCP)) {
    hasRoute.value = true
    hasSniProxy.value = false
    hasSni.value = false
    allowSniRoute.value = false
    if (form.UseSni === true) {
      form.UseSni = false
    }
  } else {
    allowSniRoute.value = false
    hasSniProxy.value = false
    hasSni.value = true
    hasRoute.value = false
    if (form.UseSni) {
      form.UseSni = false
    }
    if (form.Route) {
      form.Route = null
      form.RouteId = null
    }
  }
}

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
  changeProtocols(props.data.Protocols, props.data.UseSni)
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
