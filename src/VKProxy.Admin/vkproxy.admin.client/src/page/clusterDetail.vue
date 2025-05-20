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
          @change="(v) => { if (v === 'None') { form.HealthCheck = null } else if (v === 'Passive') { form.HealthCheck = { Passive: new PassiveHealthCheckConfig({}), Active: null } } else if (v === 'Active') { form.HealthCheck = { Passive: null, Active: new ActiveHealthCheckConfig({}) } } }">
          <el-radio-button :label="$t('None')" value="None" />
          <el-radio-button :label="$t('Passive')" value="Passive" />
          <el-radio-button :label="$t('Active')" value="Active" />
        </el-radio-group>
      </el-col>
      <div v-if="form.HealthCheckType === 'Passive' && form.HealthCheck && form.HealthCheck.Passive"
        style="display: flex; gap: 16px 8px; margin-top: 8px;">
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
        <div style="display: flex; gap: 16px 8px; margin-top: 8px;">
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
        <div style="display: flex; gap: 16px 8px; margin-top: 8px;" v-if="form.HealthCheck.Active.Policy === 'http'">
        <el-form-item prop="HealthCheck.Active.Method">
          <el-input v-model="form.HealthCheck.Active.Method" :placeholder="$t('Method')" style="min-width: 300px;">
          </el-input></el-form-item>
        <el-form-item prop="HealthCheck.Active.Path">
          <el-input v-model="form.HealthCheck.Active.Path" :placeholder="$t('Path')" style="min-width: 300px;">
          </el-input></el-form-item>
        <el-form-item prop="HealthCheck.Active.Query">
          <el-input v-model="form.HealthCheck.Active.Query" :placeholder="$t('QueryString')" style="min-width: 300px;">
          </el-input></el-form-item>
          </div>
      </div>
    </el-form-item>

    <!--todo -->
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
import { ClusterData, PassiveHealthCheckConfig, ActiveHealthCheckConfig, toServiceCluster } from '../ets/ClusterData'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n';
import { storageService } from '../service/storage'
import { urlAddress } from '../components'
import { QuestionFilled } from '@element-plus/icons-vue'
import { parseAddress } from '../service/ip';

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
  }
})

const isNew = ref(false)
const form = reactive(new ClusterData({}))
const rules = reactive<FormRules<ClusterData>>({
  Key: [{ required: true, message: () => t('required'), trigger: 'blur' },
  { min: 1, message: () => t('requiredLength') + '1', trigger: 'blur' },],
  Destinations: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  LoadBalancingPolicy: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  "HealthCheck.Active.Path": [{ validator: (rule: any, value: any, callback: any) => {
    if(!value) {
      callback()
    } else {
      const s = parseAddress('http://a:80' + value, '')
      if (!s || value !== s.pathname) {
        callback(new Error(t('wrongpathname')))
      } else {
        callback()
      }
    }
  }, trigger: 'blur' }],
  "HealthCheck.Active.Query": [{ validator: (rule: any, value: any, callback: any) => {
    if(!value) {
      callback()
    } else {
      const s = parseAddress('http://a:80/s' + value, '')
      if (!s || value !== s.search) {
        callback(new Error(t('wrongsearch')))
      } else {
        callback()
      }
    }
  }, trigger: 'blur' }]
})

watchEffect(() => {
  isNew.value = props.data.Key == null
  form.Key = props.data.Key
  form.Destinations = props.data.Destinations
  form.LoadBalancingPolicy = props.data.LoadBalancingPolicy
  form.HealthCheck = props.data.HealthCheck
  form.HealthCheckType = props.data.HealthCheckType
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

</script>
