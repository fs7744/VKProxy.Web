<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">

    <el-form-item :label="$t('key')" prop="Key" :rules="checkName" v-if="isNew">
      <el-input v-model="form.Key" />
    </el-form-item>
    <el-form-item :label="$t('key')" prop="Key" v-else>
      <el-text>{{ form.Key }}</el-text>
    </el-form-item>

    <el-form-item :label="$t('LoadBalancingPolicy')" prop="LoadBalancingPolicy">
      <el-select v-model="form.LoadBalancingPolicy" default-first-option>
        <el-option key="Random" label="Random" value="Random" />
        <el-option key="RoundRobin" label="RoundRobin" value="RoundRobin" />
        <el-option key="LeastRequests" label="LeastRequests" value="LeastRequests" />
        <el-option key="PowerOfTwoChoices" label="PowerOfTwoChoices" value="PowerOfTwoChoices" />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('Destinations')" prop="Destinations">
      <urlAddress v-model="form.Destinations" ref="addressR" />
    </el-form-item>

    <el-form-item :label="$t('HealthCheck')" prop="HealthCheck">
      <el-col :span="24">
        <el-radio-group v-model="form.HealthCheckType"
          @change="(v: any) => { if (v === 'None') { form.HealthCheck = null } else if (v === 'Passive') { form.HealthCheck = { Passive: new PassiveHealthCheckConfig({}), Active: null } } else if (v === 'Active') { form.HealthCheck = { Passive: null, Active: new ActiveHealthCheckConfig({}) } } }">
          <el-radio-button :label="$t('None')" value="None" />
          <el-radio-button :label="$t('Passive')" value="Passive" />
          <el-radio-button :label="$t('Active')" value="Active" />
        </el-radio-group>
      </el-col>
      <div v-if="form.HealthCheckType === 'Passive' && form.HealthCheck && form.HealthCheck.Passive"
        class="form-item-flex">
        <el-form-item prop="HealthCheck.Passive.MinimalTotalCountThreshold">
          <template #label>
            <span>{{ $t('MinimalTotalCountThreshold') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('MinimalTotalCountThresholdTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-input-number v-model="form.HealthCheck.Passive.MinimalTotalCountThreshold" :min="1"
            controls-position="right">
          </el-input-number>
        </el-form-item>
        <el-form-item prop="HealthCheck.Passive.FailureRateLimit">
          <template #label>
            <span>{{ $t('FailureRateLimit') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('FailureRateLimitTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-input-number v-model="form.HealthCheck.Passive.FailureRateLimit" :min="0.01" :precision="2" :step="0.01"
            :max="1" controls-position="right">
          </el-input-number>
        </el-form-item>
        <el-form-item prop="HealthCheck.Passive.DetectionWindowSize">
          <template #label>
            <span>{{ $t('DetectionWindowSize') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('DetectionWindowSizeTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-input-number v-model="form.HealthCheck.Passive.DetectionWindowSize" :min="1" :max="86399"
            controls-position="right">
            <template #suffix>
              <span>{{ $t('SecondSuffix') }}</span>
            </template>
          </el-input-number>
        </el-form-item>
        <el-form-item prop="HealthCheck.Passive.ReactivationPeriod">
          <template #label>
            <span>{{ $t('ReactivationPeriod') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('ReactivationPeriodTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-input-number v-model="form.HealthCheck.Passive.ReactivationPeriod" :min="1" :max="86399"
            controls-position="right">
            <template #suffix>
              <span>{{ $t('SecondSuffix') }}</span>
            </template>
          </el-input-number>
        </el-form-item>
      </div>
      <div v-else-if="form.HealthCheckType === 'Active' && form.HealthCheck && form.HealthCheck.Active">
        <div class="form-item-flex">
          <el-form-item prop="HealthCheck.Active.Policy" :label="t('Policy')">
            <el-select v-model="form.HealthCheck.Active.Policy" default-first-option style="min-width: 100px;">
              <el-option key="Connect" label="Connect" value="connect" />
              <el-option key="Http" label="Http" value="http" />
            </el-select>
          </el-form-item>
          <el-form-item prop="HealthCheck.Active.Interval">
            <template #label>
              <span>{{ $t('Interval') }}</span>
              <el-tooltip placement="top">
                <template #content> {{ $t('IntervalTip') }} </template>
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <el-input-number v-model="form.HealthCheck.Active.Interval" :min="1" :max="86399" controls-position="right">
              <template #suffix>
                <span>{{ $t('SecondSuffix') }}</span>
              </template>
            </el-input-number>
          </el-form-item>

          <el-form-item prop="HealthCheck.Active.Timeout">
            <template #label>
              <span>{{ $t('Timeout') }}</span>
              <el-tooltip placement="top">
                <template #content> {{ $t('TimeoutTip') }} </template>
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <el-input-number v-model="form.HealthCheck.Active.Timeout" :min="1" :max="86399" controls-position="right">
              <template #suffix>
                <span>{{ $t('SecondSuffix') }}</span>
              </template>
            </el-input-number>
          </el-form-item>

          <el-form-item prop="HealthCheck.Active.Passes">
            <template #label>
              <span>{{ $t('Passes') }}</span>
              <el-tooltip placement="top">
                <template #content> {{ $t('PassesTip') }} </template>
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <el-input-number v-model="form.HealthCheck.Active.Passes" :min="1" controls-position="right">
            </el-input-number>
          </el-form-item>

          <el-form-item prop="HealthCheck.Active.Fails">
            <template #label>
              <span>{{ $t('Fails') }}</span>
              <el-tooltip placement="top">
                <template #content> {{ $t('FailsTip') }} </template>
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <el-input-number v-model="form.HealthCheck.Active.Fails" :min="1" controls-position="right">
            </el-input-number>
          </el-form-item>
        </div>
        <div class="form-item-flex" v-if="form.HealthCheck.Active.Policy === 'http'">
          <el-form-item prop="HealthCheck.Active.Method">
            <el-input v-model="form.HealthCheck.Active.Method" :placeholder="$t('Method')" style="min-width: 300px;">
            </el-input>
          </el-form-item>
          <el-form-item prop="HealthCheck.Active.Path">
            <el-input v-model="form.HealthCheck.Active.Path" :placeholder="$t('Path')" style="min-width: 300px;">
            </el-input>
          </el-form-item>
          <el-form-item prop="HealthCheck.Active.Query">
            <el-input v-model="form.HealthCheck.Active.Query" :placeholder="$t('QueryString')"
              style="min-width: 300px;">
            </el-input>
          </el-form-item>
        </div>
      </div>
    </el-form-item>

    <el-form-item :label="$t('HttpClientConfig')" prop="HttpClientConfig">
      <el-col :span="24">
        <el-checkbox v-model="form.HttpClientConfigEnable" :label="t('Enable')"
          @change="(b: any) => { form.HttpClientConfig = b ? (form.HttpClientConfig ? form.HttpClientConfig : new HttpClientConfig({})) : null }" />
      </el-col>
      <div v-if="form.HttpClientConfigEnable && form.HttpClientConfig" class="form-item-flex">
        <el-form-item prop="HttpClientConfig.MaxConnectionsPerServer">
          <template #label>
            <span>{{ $t('MaxConnections') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('MaxConnectionsTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-input-number v-model="form.HttpClientConfig.MaxConnectionsPerServer" :min="1" controls-position="right">
          </el-input-number>
        </el-form-item>
        <el-form-item prop="HttpClientConfig.AllowAutoRedirect">
          <template #label>
            <span>{{ $t('AllowAutoRedirect') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('AllowAutoRedirectTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-checkbox v-model="form.HttpClientConfig.AllowAutoRedirect" style="margin-right: 32px;" />
        </el-form-item>
        <el-form-item prop="HttpClientConfig.EnableMultipleHttp2Connections">
          <template #label>
            <span>{{ $t('MultipleHttp2') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('MultipleHttp2Tip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-checkbox v-model="form.HttpClientConfig.EnableMultipleHttp2Connections" style="margin-right: 32px;" />
        </el-form-item>
        <el-form-item prop="HttpClientConfig.EnableMultipleHttp3Connections">
          <template #label>
            <span>{{ $t('MultipleHttp3') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('MultipleHttp3Tip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-checkbox v-model="form.HttpClientConfig.EnableMultipleHttp3Connections" style="margin-right: 32px;" />
        </el-form-item>
      </div>
      <div v-if="form.HttpClientConfigEnable && form.HttpClientConfig" class="form-item-flex">
        <el-form-item prop="HttpClientConfig.DangerousAcceptAnyServerCertificate">
          <template #label>
            <span>{{ $t('IngoreCertificate') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('IngoreCertificateTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-checkbox v-model="form.HttpClientConfig.DangerousAcceptAnyServerCertificate" />
        </el-form-item>
        <el-form-item prop="HttpClientConfig.SslProtocols">
          <template #label>
            <span>{{ $t('SslProtocols') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('SslProtocolsTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <sslProtocols v-model="form.HttpClientConfig.SslProtocols" />
        </el-form-item>
      </div>
      <el-col :span="24" v-if="form.HttpClientConfigEnable && form.HttpClientConfig">
        <el-form-item prop="HttpClientConfig.WebProxy" :label="t('WebProxy')">
          <el-checkbox v-if="form.HttpClientConfig" v-model="form.HttpClientConfig.WebProxyEnable" :label="t('Enable')"
            @change="(b: any) => { form.HttpClientConfig.WebProxy = b ? (form.HttpClientConfig.WebProxy ? form.HttpClientConfig.WebProxy : new WebProxy({})) : null }" />
          <div v-if="form.HttpClientConfig && form.HttpClientConfig.WebProxy && form.HttpClientConfig.WebProxyEnable"
            style="margin-left: 8px;" class="form-item-flex">
            <el-form-item prop="HttpClientConfig.WebProxy.Address">
              <el-input v-model="form.HttpClientConfig.WebProxy.Address" :placeholder="$t('address')"
                style="min-width: 300px;">
              </el-input>
            </el-form-item>
            <el-form-item prop="HttpClientConfig.WebProxy.BypassOnLocal">
              <template #label>
                <span>{{ $t('BypassOnLocal') }}</span>
                <el-tooltip placement="top">
                  <template #content> {{ $t('BypassOnLocalTip') }} </template>
                  <el-icon>
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </template>
              <el-checkbox v-model="form.HttpClientConfig.WebProxy.BypassOnLocal" />
            </el-form-item>
            <el-form-item prop="HttpClientConfig.WebProxy.UseDefaultCredentials">
              <template #label>
                <span>{{ $t('UseDefaultCredentials') }}</span>
                <el-tooltip placement="top">
                  <template #content> {{ $t('UseDefaultCredentialsTip') }} </template>
                  <el-icon>
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </template>
              <el-checkbox v-model="form.HttpClientConfig.WebProxy.UseDefaultCredentials" />
            </el-form-item>
          </div>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item :label="$t('HttpRequest')" prop="HttpRequest">
      <el-col :span="24">
        <el-checkbox v-model="form.HttpRequestEnable" :label="t('Enable')"
          @change="(b: any) => { form.HttpRequest = b ? (form.HttpRequest ? form.HttpRequest : new HttpRequestConfig({})) : null }" />
      </el-col>
      <div v-if="form.HttpRequest && form.HttpRequestEnable" class="form-item-flex">

        <el-form-item prop="HttpRequest.Version">
          <template #label>
            <span>{{ $t('Version') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('VersionTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-select v-model="form.HttpRequest.Version" style="min-width: 100px;">
            <el-option key="1.0" label="1.0" value="1.0" />
            <el-option key="1.1" label="1.1" value="1.1" />
            <el-option key="2" label="2" value="2" />
            <el-option key="3" label="3" value="3" />
          </el-select>
        </el-form-item>

        <el-form-item prop="HttpRequest.VersionPolicy">
          <template #label>
            <span>{{ $t('VersionPolicy') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('VersionPolicyTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-select v-model="form.HttpRequest.VersionPolicy" style="min-width: 200px;">
            <el-option key="RequestVersionOrLower" label="RequestVersionOrLower" :value="0" />
            <el-option key="RequestVersionOrHigher" label="RequestVersionOrHigher" :value="1" />
            <el-option key="RequestVersionExact" label="RequestVersionExact" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item prop="HttpRequest.ActivityTimeout">
          <template #label>
            <span>{{ $t('ActivityTimeout') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('ActivityTimeoutTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-input-number v-model="form.HttpRequest.ActivityTimeout" :min="1" :max="86399" controls-position="right">
            <template #suffix>
              <span>{{ $t('SecondSuffix') }}</span>
            </template>
          </el-input-number>
        </el-form-item>

        <el-form-item prop="HttpRequest.AllowResponseBuffering">
          <template #label>
            <span>{{ $t('AllowResponseBuffering') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('AllowResponseBufferingTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-checkbox v-model="form.HttpRequest.AllowResponseBuffering" />
        </el-form-item>
      </div>
    </el-form-item>
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
import { ClusterData, PassiveHealthCheckConfig, ActiveHealthCheckConfig, toServiceCluster, HttpClientConfig, WebProxy, HttpRequestConfig } from '../ets/ClusterData'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n';
import { storageService } from '../service/storage'
import { urlAddress, sslProtocols } from '../components'
import { QuestionFilled } from '@element-plus/icons-vue'
import { parseAddress } from '../service/ip'

const { t } = useI18n({
  useScope: 'global'
})

const formRef = ref<FormInstance>()
const addressR = ref<any>()
const forms = [addressR]
const props = defineProps({
  data: {
    type: ClusterData,
    validator: v => v != null,
    required: true,
  },
  done: {
  },
  allowUpdate: {
    type: Boolean,
  }
})

const isNew = ref(false)
const form = reactive(new ClusterData({}))
const rules = reactive<FormRules<ClusterData>>({
  Key: [{ required: true, message: () => t('required'), trigger: 'blur' },
  { min: 1, message: () => t('requiredLength') + '1', trigger: 'blur' },],
  Destinations: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  LoadBalancingPolicy: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  "HealthCheck.Active.Path": [{
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback()
      } else {
        const s = parseAddress('http://a:80' + value, '')
        if (!s || value !== s.pathname) {
          callback(new Error(t('wrongpathname')))
        } else {
          callback()
        }
      }
    }, trigger: 'blur'
  }],
  "HealthCheck.Active.Query": [{
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback()
      } else {
        const s = parseAddress('http://a:80/s' + value, '')
        if (!s || value !== s.search) {
          callback(new Error(t('wrongsearch')))
        } else {
          callback()
        }
      }
    }, trigger: 'blur'
  }],
  "HttpClientConfig.WebProxy.Address": [{
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback()
      } else {
        const s = URL.parse(value)
        if (!s) {
          callback(new Error(t('wrongFormat')))
        } else {
          callback()
        }
      }
    }, trigger: 'blur'
  }]
})

watchEffect(() => {
  isNew.value = props.data.Key == null
  form.Key = props.data.Key
  form.Destinations = props.data.Destinations
  form.LoadBalancingPolicy = props.data.LoadBalancingPolicy
  form.HealthCheck = props.data.HealthCheck
  form.HealthCheckType = props.data.HealthCheckType
  form.HttpClientConfig = props.data.HttpClientConfig
  form.HttpClientConfigEnable = props.data.HttpClientConfigEnable
  form.HttpRequest = props.data.HttpRequest
  form.HttpRequestEnable = props.data.HttpRequestEnable
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
  var r = await storageService.updateCluster(toServiceCluster(form));
  (props.done as any)()
}

const checkName = [{
  validator: (rule: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error(t('required')))
    } else {
      storageService.existsCluster(value).then(i => {
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

const model = defineModel<ClusterData>({ required: false, default: null })

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
  model.value = new ClusterData(form)
  return true
}

defineExpose({
  validate
})

</script>
