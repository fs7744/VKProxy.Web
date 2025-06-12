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
          <el-option key="AppendRequestHeader" label="Append RequestHeader" value="AppendRequestHeader" />
          <el-option key="SetRequestHeader" label="Set RequestHeader" value="SetRequestHeader" />
          <el-option key="RequestHeaderOriginalHost" label="RequestHeaderOriginalHost"
            value="RequestHeaderOriginalHost" />
          <el-option key="RequestHeaderRemove" label="Remove RequestHeader" value="RequestHeaderRemove" />
          <el-option key="RequestHeadersAllowed" label="Allow RequestHeader" value="RequestHeadersAllowed" />
          <el-option key="RequestHeadersCopy" label="Copy RequestHeaders" value="RequestHeadersCopy" />
          <el-option key="X-Forwarded" label="X-Forwarded" value="X-Forwarded" />
        </el-option-group>
        <el-option-group label="Response">
          <el-option key="ResponseHeadersCopy" label="Copy ResponseHeaders" value="ResponseHeadersCopy" />
          <el-option key="AppendResponseHeader" label="Append ResponseHeader" value="AppendResponseHeader" />
          <el-option key="SetResponseHeader" label="Set ResponseHeader" value="SetResponseHeader" />
          <el-option key="ResponseHeaderRemove" label="Remove ResponseHeader" value="ResponseHeaderRemove" />
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

    <el-form-item label="RequestHeader" prop="AppendRequestHeader"
      v-if="way === 'AppendRequestHeader' && model && (model.RequestHeader || model.RequestHeader === '')">
      <el-input v-model="model.RequestHeader"></el-input>
    </el-form-item>
    <el-form-item label="Append Value" prop="AppendRequestHeaderValue"
      v-if="way === 'AppendRequestHeader' && model && (model.Append || model.Append === '')">
      <el-input v-model="model.Append"></el-input>
    </el-form-item>

    <el-form-item label="RequestHeader" prop="SetRequestHeader"
      v-if="way === 'SetRequestHeader' && model && (model.RequestHeader || model.RequestHeader === '')">
      <el-input v-model="model.RequestHeader"></el-input>
    </el-form-item>
    <el-form-item label="Set Value" prop="SetRequestHeaderValue"
      v-if="way === 'SetRequestHeader' && model && (model.Set || model.Set === '')">
      <el-input v-model="model.Set"></el-input>
    </el-form-item>

    <el-form-item label="X-Forwarded" prop="XForwarded"
      v-if="way === 'X-Forwarded' && model && (model.XForwarded || model.XForwarded === '')">
      <el-select v-model="model.XForwarded" filterable>
        <el-option key="Set" label="Set" value="Set" />
        <el-option key="Append" label="Append" value="Append" />
        <el-option key="Remove" label="Remove" value="Remove" />
        <el-option key="Off" label="Off" value="Off" />
      </el-select>
    </el-form-item>
    <el-form-item label="For" prop="XForwardedFor"
      v-if="way === 'X-Forwarded' && model && (model.For || model.For === '')">
      <el-select v-model="model.For" filterable>
        <el-option key="Set" label="Set" value="Set" />
        <el-option key="Append" label="Append" value="Append" />
        <el-option key="Remove" label="Remove" value="Remove" />
        <el-option key="Off" label="Off" value="Off" />
      </el-select>
    </el-form-item>
    <el-form-item label="Proto" prop="XForwardedProto"
      v-if="way === 'X-Forwarded' && model && (model.Proto || model.Proto === '')">
      <el-select v-model="model.Proto" filterable>
        <el-option key="Set" label="Set" value="Set" />
        <el-option key="Append" label="Append" value="Append" />
        <el-option key="Remove" label="Remove" value="Remove" />
        <el-option key="Off" label="Off" value="Off" />
      </el-select>
    </el-form-item>
    <el-form-item label="Prefix" prop="XForwardedPrefix"
      v-if="way === 'X-Forwarded' && model && (model.Prefix || model.Prefix === '')">
      <el-select v-model="model.Prefix" filterable>
        <el-option key="Set" label="Set" value="Set" />
        <el-option key="Append" label="Append" value="Append" />
        <el-option key="Remove" label="Remove" value="Remove" />
        <el-option key="Off" label="Off" value="Off" />
      </el-select>
    </el-form-item>
    <el-form-item label="HeaderPrefix" prop="XForwardedHeaderPrefix"
      v-if="way === 'X-Forwarded' && model && (model.HeaderPrefix || model.HeaderPrefix === '')">
     <el-input v-model="model.HeaderPrefix"></el-input>
    </el-form-item>

    <el-form-item label="Copy ResponseHeaders" prop="ResponseHeadersCopy"
      v-if="way === 'ResponseHeadersCopy' && model && (model.ResponseHeadersCopy || model.ResponseHeadersCopy === '')">
      <el-select v-model="model.ResponseHeadersCopy">
        <el-option label="true" value="true" />
        <el-option label="false" value="false" />
      </el-select>
    </el-form-item>

    <el-form-item label="ResponseHeader" prop="AppendResponseHeader"
      v-if="way === 'AppendResponseHeader' && model && (model.ResponseHeader || model.ResponseHeader === '')">
      <el-input v-model="model.ResponseHeader"></el-input>
    </el-form-item>
    <el-form-item label="Append Value" prop="AppendResponseHeaderValue"
      v-if="way === 'AppendResponseHeader' && model && (model.Append || model.Append === '')">
      <el-input v-model="model.Append"></el-input>
    </el-form-item>
    <el-form-item label="When" prop="AppendResponseHeaderWhen"
      v-if="way === 'AppendResponseHeader' && model && (model.When || model.When === '')">
      <el-select v-model="model.When" filterable>
        <el-option key="Success" label="Success" value="Success" />
        <el-option key="Failure" label="Failure" value="Failure" />
        <el-option key="Always" label="Always" value="Always" />
      </el-select>
    </el-form-item>

    <el-form-item label="ResponseHeader" prop="SetResponseHeader"
      v-if="way === 'SetResponseHeader' && model && (model.ResponseHeader || model.ResponseHeader === '')">
      <el-input v-model="model.ResponseHeader"></el-input>
    </el-form-item>
    <el-form-item label="Set Value" prop="SetResponseHeaderValue"
      v-if="way === 'SetResponseHeader' && model && (model.Set || model.Set === '')">
      <el-input v-model="model.Set"></el-input>
    </el-form-item>
    <el-form-item label="When" prop="SetResponseHeaderWhen"
      v-if="way === 'SetResponseHeader' && model && (model.When || model.When === '')">
      <el-select v-model="model.When" filterable>
        <el-option key="Success" label="Success" value="Success" />
        <el-option key="Failure" label="Failure" value="Failure" />
        <el-option key="Always" label="Always" value="Always" />
      </el-select>
    </el-form-item>

    <el-form-item label="ResponseHeaderRemove" prop="ResponseHeaderRemove"
      v-if="way === 'ResponseHeaderRemove' && model && (model.ResponseHeaderRemove || model.ResponseHeaderRemove === '')">
      <el-input v-model="model.ResponseHeaderRemove"></el-input>
    </el-form-item>
    <el-form-item label="When" prop="ResponseHeaderRemoveWhen"
      v-if="way === 'ResponseHeaderRemove' && model && (model.When || model.When === '')">
      <el-select v-model="model.When" filterable>
        <el-option key="Success" label="Success" value="Success" />
        <el-option key="Failure" label="Failure" value="Failure" />
        <el-option key="Always" label="Always" value="Always" />
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
  } else if (w === 'AppendRequestHeader') {
    model.value = { RequestHeader: '', Append: '' }
  } else if (w === 'SetRequestHeader') {
    model.value = { RequestHeader: '', Set: '' }
  } else if (w === 'RequestHeaderRemove') {
    model.value = { RequestHeaderRemove: '' }
  } else if (w === 'RequestHeadersAllowed') {
    model.value = { RequestHeadersAllowed: [] }
  } else if (w === 'X-Forwarded') {
    model.value = { For: 'Append', Prefix: 'Off', HeaderPrefix: "X-Forwarded-", Proto: "Set", XForwarded: "Set" }
  } else if (w === 'ResponseHeadersCopy') {
    model.value = { ResponseHeadersCopy: "true" }
  } else if (w === 'AppendResponseHeader') {
    model.value = { ResponseHeader: "", Append: '', When: 'Always' }
  } else if (w === 'SetResponseHeader') {
    model.value = { ResponseHeader: "", Set: '', When: 'Always' }
  } else if (w === 'ResponseHeaderRemove') {
    model.value = { ResponseHeaderRemove: "", When: 'Always' }
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
  RequestHeadersAllowed: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  AppendRequestHeader: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.RequestHeader || model.value.RequestHeader === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  AppendRequestHeaderValue: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.Append || model.value.Append === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  SetRequestHeader: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.RequestHeader || model.value.RequestHeader === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  SetRequestHeaderValue: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.Set || model.value.Set === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  XForwarded: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  XForwardedFor: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.For || model.value.For === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  XForwardedProto: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.Proto || model.value.Proto === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  XForwardedPrefix: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.Prefix || model.value.Prefix === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  XForwardedHeaderPrefix: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.HeaderPrefix || model.value.HeaderPrefix === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  ResponseHeadersCopy: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  AppendResponseHeader: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.ResponseHeader || model.value.ResponseHeader === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  AppendResponseHeaderValue: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.Append || model.value.Append === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  AppendResponseHeaderWhen: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.When || model.value.When === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  SetResponseHeader: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.ResponseHeader || model.value.ResponseHeader === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  SetResponseHeaderValue: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.Set || model.value.Set === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  SetResponseHeaderWhen: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.When || model.value.When === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  ResponseHeaderRemove: [{ required: true, message: () => t('required'), trigger: 'blur' }],
  ResponseHeaderRemoveWhen: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!model.value || !model.value.When || model.value.When === '') {
        callback(new Error(t('required')))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
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
