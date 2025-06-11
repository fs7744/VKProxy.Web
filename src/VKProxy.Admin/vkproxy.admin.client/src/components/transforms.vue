<template>

  <el-form ref="formRef" :model="model" label-width="auto" :rules="rules">
    <el-form-item prop="way">
      <el-select v-model="way" filterable @change="changeWay">
        <el-option-group label="Request Path">
          <el-option key="PathPrefix" label="Add PathPrefix" value="PathPrefix" />
          <el-option key="PathRemovePrefix" label="Remove PathPrefix" value="PathRemovePrefix" />
          <el-option key="PathSet" label="Set Path" value="PathSet" />
        </el-option-group>
        <el-option-group label="Request QueryParameter">
          <el-option key="QueryAppendParameter" label="Append QueryParameter" value="QueryAppendParameter" />
          <el-option key="QuerySetParameter" label="Set QueryParameter" value="QuerySetParameter" />
          <el-option key="QueryRemoveParameter" label="Remove QueryParameter" value="QueryRemoveParameter" />
        </el-option-group>
        <el-option-group label="Request Method">
          <el-option key="HttpMethodChange" label="Change HttpMethod" value="HttpMethodChange" />
        </el-option-group>
        <el-option-group label="Request Header">
          <el-option key="RequestHeadersCopy" label="Copy RequestHeaders" value="RequestHeadersCopy" />
          <el-option key="RequestHeaderOriginalHost" label="RequestHeaderOriginalHost" value="RequestHeaderOriginalHost" />
          <el-option key="RequestHeaderRemove" label="Remove RequestHeader" value="RequestHeaderRemove" />
          <el-option key="RequestHeadersAllowed" label="Allow RequestHeader" value="RequestHeadersAllowed" />
        </el-option-group>
        <el-option-group label="Response">
          <el-option key="ResponseHeader" label="ResponseHeader" value="ResponseHeader" />
        </el-option-group>
      </el-select>
    </el-form-item>
    <el-form-item label="PathPrefix" prop="PathPrefix"
      v-if="way === 'PathPrefix' && model && (model.PathPrefix || model.PathPrefix === '')">
      <el-input v-model="model.PathPrefix"></el-input>
    </el-form-item>
    <el-form-item label="PathPrefix" prop="PathRemovePrefix"
      v-else-if="way === 'PathRemovePrefix' && model && (model.PathRemovePrefix || model.PathRemovePrefix === '')">
      <el-input v-model="model.PathRemovePrefix"></el-input>
    </el-form-item>
    <el-form-item label="Path" prop="PathSet"
      v-else-if="way === 'PathSet' && model && (model.PathSet || model.PathSet === '')">
      <el-input v-model="model.PathSet"></el-input>
    </el-form-item>
    <el-form-item label="QueryParameter" prop="QueryRemoveParameter"
      v-else-if="way === 'QueryRemoveParameter' && model && (model.QueryRemoveParameter || model.QueryRemoveParameter === '')">
      <el-input v-model="model.QueryRemoveParameter"></el-input>
    </el-form-item>

    <el-form-item label="QueryParameter" prop="QueryAppendParameter"
      v-if="way === 'QueryAppendParameter' && model && (model.QueryValueParameter || model.QueryValueParameter === '')">
      <el-input v-model="model.QueryValueParameter"></el-input>
    </el-form-item>
    <el-form-item label="Append Value" prop="QueryAppendParameterValue"
      v-if="way === 'QueryAppendParameter' && model && (model.Append || model.Append === '')">
      <el-input v-model="model.Append"></el-input>
    </el-form-item>

    <el-form-item label="QueryParameter" prop="QuerySetParameter"
      v-if="way === 'QuerySetParameter' && model && (model.QueryValueParameter || model.QueryValueParameter === '')">
      <el-input v-model="model.QueryValueParameter"></el-input>
    </el-form-item>
    <el-form-item label="Set Value" prop="QuerySetParameterValue"
      v-if="way === 'QuerySetParameter' && model && (model.Set || model.Set === '')">
      <el-input v-model="model.Set"></el-input>
    </el-form-item>

    <el-form-item label="Change" prop="HttpMethodChange"
      v-if="way === 'HttpMethodChange' && model && (model.HttpMethodChange || model.HttpMethodChange === '')">
      <el-select v-model="model.HttpMethodChange" allow-create filterable>
        <el-option key="GET" label="GET" value="GET" />
        <el-option key="POST" label="POST" value="POST" />
        <el-option key="PUT" label="PUT" value="PUT" />
        <el-option key="PATCH" label="PATCH" value="PATCH" />
        <el-option key="DELETE" label="DELETE" value="DELETE" />
        <el-option key="HEAD" label="HEAD" value="HEAD" />
        <el-option key="OPTIONS" label="OPTIONS" value="OPTIONS" />
      </el-select>
    </el-form-item>
    <el-form-item label="To" prop="HttpMethodChangeValue"
      v-if="way === 'HttpMethodChange' && model && (model.Set || model.Set === '')">
      <el-select v-model="model.Set" allow-create filterable>
        <el-option key="GET" label="GET" value="GET" />
        <el-option key="POST" label="POST" value="POST" />
        <el-option key="PUT" label="PUT" value="PUT" />
        <el-option key="PATCH" label="PATCH" value="PATCH" />
        <el-option key="DELETE" label="DELETE" value="DELETE" />
        <el-option key="HEAD" label="HEAD" value="HEAD" />
        <el-option key="OPTIONS" label="OPTIONS" value="OPTIONS" />
      </el-select>
    </el-form-item>

    <el-form-item label="Copy RequestHeaders" prop="RequestHeadersCopy"
      v-if="way === 'RequestHeadersCopy' && model && (model.RequestHeadersCopy || model.RequestHeadersCopy === '')">
      <el-select v-model="model.RequestHeadersCopy">
        <el-option label="true" value="true" />
        <el-option label="false" value="false" />
      </el-select>
    </el-form-item>

    <el-form-item label="RequestHeaderOriginalHost" prop="RequestHeaderOriginalHost"
      v-if="way === 'RequestHeaderOriginalHost' && model && (model.RequestHeaderOriginalHost || model.RequestHeaderOriginalHost === '')">
      <el-select v-model="model.RequestHeaderOriginalHost">
        <el-option label="true" value="true" />
        <el-option label="false" value="false" />
      </el-select>
    </el-form-item>

    <el-form-item label="RequestHeaderRemove" prop="RequestHeaderRemove"
      v-if="way === 'RequestHeaderRemove' && model && (model.RequestHeaderRemove || model.RequestHeaderRemove === '')">
      <el-input v-model="model.RequestHeaderRemove"></el-input>
    </el-form-item>

    <el-form-item label="Allow RequestHeader" prop="RequestHeadersAllowed"
      v-if="way === 'RequestHeadersAllowed' && model && (model.RequestHeadersAllowed || model.RequestHeadersAllowed === '')">
      <el-select v-model="model.RequestHeadersAllowed" multiple allow-create filterable>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<style scoped></style>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus';
import { reactive, ref, watch, watchEffect } from 'vue';
import { t } from '../service/confirm';

const formRef = ref<FormInstance>()
const model = defineModel('model', { required: true, default: {} as any })
const way = defineModel('way', { required: true, default: '' })

const changeWay = (w) => {
  if (w === 'PathPrefix') {
    model.value = { PathPrefix: '' }
  } else if (w === 'PathRemovePrefix') {
    model.value = { PathRemovePrefix: '' }
  } else if (w === 'PathSet') {
    model.value = { PathSet: '' }
  } else if (w === 'QueryRemoveParameter') {
    model.value = { QueryRemoveParameter: '' }
  } else if (w === 'QueryAppendParameter') {
    model.value = { QueryValueParameter: '', Append: '' }
  } else if (w === 'QuerySetParameter') {
    model.value = { QueryValueParameter: '', Set: '' }
  } else if (w === 'HttpMethodChange') {
    model.value = { HttpMethodChange: '', Set: '' }
  } else if (w === 'RequestHeadersCopy') {
    model.value = { RequestHeadersCopy: "true" }
  } else if (w === 'RequestHeaderOriginalHost') {
    model.value = { RequestHeaderOriginalHost: "false" }
  } else if (w === 'RequestHeaderRemove') {
    model.value = { RequestHeaderRemove: '' }
  } else if (w === 'RequestHeaderRemove') {
    model.value = { RequestHeaderRemove: '' }
  } else if (w === 'RequestHeadersAllowed') {
    model.value = { RequestHeadersAllowed: [] }
  } else {
    model.value = null
  }
}

const rules = reactive<FormRules<any>>({
  way: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!way.value) {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  PathPrefix: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  PathRemovePrefix: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  PathSet: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  QueryRemoveParameter: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  QueryAppendParameter: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.QueryValueParameter || model.value.QueryValueParameter === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  QueryAppendParameterValue: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.Append || model.value.Append === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  QuerySetParameter: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.QueryValueParameter || model.value.QueryValueParameter === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  QuerySetParameterValue: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.Set || model.value.Set === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  HttpMethodChange: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  HttpMethodChangeValue: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.Set || model.value.Set === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  RequestHeadersCopy: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  RequestHeaderOriginalHost: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  RequestHeaderRemove: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  RequestHeadersAllowed: [{ required: true, message: () => t('required'), trigger: 'blur' }]
})

const validate = async () => {
  if (await formRef?.value?.validate().catch(() => false)) {
    if (model.value) {
      if (model.value.PathPrefix && !model.value.PathPrefix.startsWith('/')) {
        model.value.PathPrefix = '/' + model.value.PathPrefix
      }
      if (model.value.PathRemovePrefix && !model.value.PathRemovePrefix.startsWith('/')) {
        model.value.PathRemovePrefix = '/' + model.value.PathRemovePrefix
      }
      if (model.value.PathSet && !model.value.PathSet.startsWith('/')) {
        model.value.PathSet = '/' + model.value.PathSet
      }
      if (model.value.RequestHeadersAllowed) {
        model.value.RequestHeadersAllowed = model.value.RequestHeadersAllowed.join(';')
      }
    }
    return true
  }
  return false
}

defineExpose({
  validate
})

</script>
