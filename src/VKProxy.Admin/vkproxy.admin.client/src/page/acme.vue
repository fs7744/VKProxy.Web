<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-form-item :label="$t('key')" prop="Key">
      <el-input v-model="form.Key" />
    </el-form-item>
    <el-form-item :label="$t('AcmeServer')" prop="Server">
      <el-input v-model="form.Server" />
    </el-form-item>

    <el-form-item prop="Host" :label="$t('Host')">
      <el-select v-model="form.DomainNames" multiple allow-create filterable>
      </el-select>
    </el-form-item>

    <el-form-item prop="Contact" :label="$t('Contact')">
      <el-select v-model="form.Contact" multiple allow-create filterable>
      </el-select>
    </el-form-item>

    <el-form-item prop="AdditionalIssuers" :label="$t('AdditionalIssuers')">
      <el-select v-model="form.AdditionalIssuers" multiple allow-create filterable>
      </el-select>
    </el-form-item>

    <el-form-item prop="RenewDaysInAdvance" :label="$t('RenewDaysInAdvance')">
      <el-input-number v-model="form.RenewDaysInAdvance" :max="365" controls-position="right">
        <template #suffix>
          <span> day </span>
        </template>
      </el-input-number>
    </el-form-item>

    <el-form-item prop="Timeout" :label="$t('Timeout')">
      <el-input-number v-model="form.Timeout" :min="1" :max="86399" controls-position="right">
        <template #suffix>
          <span> {{ $t('SecondSuffix') }} </span>
        </template>
      </el-input-number>
    </el-form-item>

    <el-form-item prop="KeyAlgorithm">
      <template #label>
        <span>{{ $t('KeyAlgorithm') }}</span>
        <el-tooltip placement="top">
          <template #content> {{ $t('KeyAlgorithm') }} </template>
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </template>
      <el-select v-model="form.KeyAlgorithm" style="min-width: 200px;">
        <el-option key="RS256" label="RS256" :value="'RS256'" />
        <el-option key="ES256" label="ES256" :value="'ES256'" />
        <el-option key="ES384" label="ES384" :value="'ES384'" />
        <el-option key="ES512" label="ES512" :value="'ES512'" />
      </el-select>
    </el-form-item>

    <el-form-item prop="Certificate" :label="t('Certificate')" v-if="form.Pem">
      <el-col :span="12">
        <el-form-item prop="Pem" label-position="top">
          <template #label>
            <span>{{ $t('PEM') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('PEMTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-input :readonly="true" v-model="form.Pem" :rows="30" style="padding-right: 8px;" type="textarea" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="PemKey" label-position="top">
          <template #label>
            <span>{{ $t('PEMKey') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('PEMKeyTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-input :readonly="true" v-model="form.PemKey" :rows="30" type="textarea" />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="() => { (props.done as any)(form) }" >
        {{ $t('Use') }}
      </el-button>
      <el-button type="primary" @click="renew(form)" >
        {{ $t('Renew') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>


<script setup lang="ts">

import { reactive, watchEffect } from 'vue'
import { toServiceAcmeChallenge, AcmeChallenge } from '../ets/SniData'
import { type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { storageService } from '../service/storage'
import { map } from "lodash"
import { QuestionFilled } from '@element-plus/icons-vue'

const props = defineProps({
  Key: {
    type: String,
    validator: v => v != null,
    required: true,
  },
  done: {
  }
})

const { t } = useI18n({
  useScope: 'global'
})

const form = reactive(new AcmeChallenge({}))
const rules = reactive<FormRules<AcmeChallenge>>({
  Key: [{ required: true, message: () => t('required'), trigger: 'blur' },
  { min: 1, message: () => t('requiredLength') + '1', trigger: 'blur' },],
})


const load = async (k: string) => {
  let data = map((await storageService.getAcme("")) ?? [], i => new AcmeChallenge(i))
  let acme = data.find(i => i.SniKey === k)
  if (!acme) {
    acme = new AcmeChallenge({})
  }
  const f = form as any
  for (const k of ['Key', 'Pem', 'PemKey','DomainNames', 'Server', 'RenewDaysInAdvance', 'Timeout', 'AllowedChallengeTypes', 'KeyAlgorithm', 'KeySize', 'AdditionalIssuers', 'AccountKeyPem', 'AccountKeyPem', 'Contact', 'EabKeyId', 'EabKey', 'EabKeyAlg', 'SniKey']) {
    f[k] = (acme as any)[k]
  }
  f.AllowedChallengeTypes = 'Http01'
  f.SniKey = k
}

const renew = async (k: AcmeChallenge) => {
  let data = await storageService.updateAcme(toServiceAcmeChallenge(k))
  form.Pem = data.Pem
  form.PemKey = data.PemKey
}

watchEffect(() => {
  load(props.Key)
})
</script>

<style scoped></style>
