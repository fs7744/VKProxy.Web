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
    <el-form-item prop="Host" :label="$t('Host')">
      <el-select v-model="form.Host" multiple allow-create filterable>
      </el-select>
    </el-form-item>
    <el-form-item prop="Passthrough">
      <template #label>
        <span>{{ $t('Passthrough') }}</span>
        <el-tooltip placement="top">
          <template #content> {{ $t('PassthroughTip') }} </template>
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </template>
      <el-checkbox v-model="form.Passthrough"
        @change="(v) => { form.Certificate = v ? null : (form.Certificate ?? new CertificateConfig({})) }" />
    </el-form-item>
    <div v-if="form.Passthrough"></div>
    <div v-else>
      <div class="form-item-flex">
        <el-form-item prop="HandshakeTimeout" :label="$t('HandshakeTimeout')">
          <el-input-number v-model="form.HandshakeTimeout" :min="1" :max="86399" controls-position="right">
            <template #suffix>
              <span>{{ $t('SecondSuffix') }}</span>
            </template>
          </el-input-number>
        </el-form-item>

        <el-form-item prop="Protocols">
          <template #label>
            <span>{{ $t('SslProtocols') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('SslProtocolsTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <sslProtocols v-model="form.Protocols" />
        </el-form-item>

        <el-form-item prop="CheckCertificateRevocation">
          <template #label>
            <span>{{ $t('checkCertificateRevocation') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('checkCertificateRevocationTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-checkbox v-model="form.CheckCertificateRevocation" />
        </el-form-item>

        <el-form-item prop="ClientCertificateMode">
          <template #label>
            <span>{{ $t('ClientCertificateMode') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('ClientCertificateModeTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-select v-model="form.ClientCertificateMode" style="min-width: 200px;">
            <el-option key="NoCertificate" label="NoCertificate" :value="0" />
            <el-option key="AllowCertificate" label="AllowCertificate" :value="1" />
            <el-option key="RequireCertificate" label="RequireCertificate" :value="2" />
            <el-option key="DelayCertificate" label="DelayCertificate" :value="3" />
          </el-select>
        </el-form-item>
      </div>
      <el-form-item prop="Certificate" :label="t('Certificate')" v-if="form.Certificate">
        <el-col :span="12">
          <el-form-item prop="Certificate.PEM" label-position="top">
            <template #label>
              <span>{{ $t('PEM') }}</span>
              <el-tooltip placement="top">
                <template #content> {{ $t('PEMTip') }} </template>
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <el-input v-model="form.Certificate.PEM"  :rows="30" style="padding-right: 8px;"
              type="textarea" :placeholder="'-----BEGIN CERTIFICATE-----\nxxxxxx\n-----END CERTIFICATE----'" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="Certificate.PEMKey" label-position="top">
            <template #label>
              <span>{{ $t('PEMKey') }}</span>
              <el-tooltip placement="top">
                <template #content> {{ $t('PEMKeyTip') }} </template>
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <el-input v-model="form.Certificate.PEMKey"
              :rows="30" type="textarea"
              :placeholder="'-----BEGIN ENCRYPTED PRIVATE KEY-----\nxxxxxx\n-----END ENCRYPTED PRIVATE KEY-----'" />
          </el-form-item>
        </el-col>

        <el-col :span="24" style="margin-top: 16px;">
          <el-form-item prop="Certificate.Password">
            <template #label>
              <span>{{ $t('Password') }}</span>
              <el-tooltip placement="top">
                <template #content> {{ $t('PasswordTip') }} </template>
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <el-input v-model="form.Certificate.Password"  />
          </el-form-item>
        </el-col>
      </el-form-item>

    </div>
    <div v-if="allowRoute">
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
            style="gap: 16px 8px;" ref="routeForm" :protocols="GatewayProtocols.TCP"></RouteDetail>
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
import { SniData, toServiceSni, CertificateConfig } from '../ets/SniData'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { QuestionFilled, CirclePlusFilled, RemoveFilled } from '@element-plus/icons-vue'
import { storageService } from '../service/storage'
import { RouteData } from '../ets/RouteData'
import RouteDetail from './routeDetail.vue'
import { GatewayProtocols } from '../ets/GatewayProtocols'

const { t } = useI18n({
  useScope: 'global'
})
const routeForm = ref<any>()

const formRef = ref<FormInstance>()
const forms = [routeForm]
const props = defineProps({
  data: {
    type: SniData,
    validator: v => v != null,
    required: true,
  },
  allowUpdate: {
    type: Boolean,
  },
  allowRoute: {
    type: Boolean,
  },
  done: {
  }
})

const model = defineModel<SniData>({ required: false, default: null })

const dialogSelectRoute = ref(false)
const selectedRoute = ref<RouteData>(null)
const isNew = ref(false)
const form = reactive(new SniData({}))
const rules = reactive<FormRules<SniData>>({
  Key: [{ required: true, message: () => t('required'), trigger: 'blur' },
  { min: 1, message: () => t('requiredLength') + '1', trigger: 'blur' },],
  Order: [{ required: true, message: () => t('required'), trigger: 'blur' },],
  Host: [{ required: true, message: () => t('required'), trigger: 'blur' },],
})

watchEffect(() => {
  isNew.value = props.data.Key == null
  for (const k of ['Key', 'Order', 'Host', 'Passthrough', 'HandshakeTimeout', 'Protocols', 'CheckCertificateRevocation', 'ClientCertificateMode', 'RouteId', 'Route', 'Certificate']) {
    form[k] = props.data[k]
  }
})

const submitForm = async (formEl: FormInstance | undefined) => {
  let invalid = false
  if(!props.allowRoute) {
    form.Route = null
    form.RouteId = null
  }
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
  var r = await storageService.updateSni(toServiceSni(form));
  (props.done as any)()
}

const checkName = [{
  validator: (rule: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error(t('required')))
    } else {
      storageService.existsSni(value).then(i => {
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
  if (!formRef.value || !await formRef.value.validate().catch(() => false)) {
    invalid = true
  }
  if (invalid) {
    return false
  }
  model.value = new SniData(form)
  return true
}

defineExpose({
  validate
})

</script>
