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

    <el-form-item prop="UdpResponses" v-if="protocols && (protocols & GatewayProtocols.UDP)">
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

    <el-form-item prop="Timeout" :label="$t('Timeout')">
      <el-input-number v-model="form.Timeout" :min="1" :max="86399" controls-position="right">
        <template #suffix>
          <span>{{ $t('SecondSuffix') }}</span>
        </template>
      </el-input-number>
    </el-form-item>

    <el-form-item prop="RouteMatch" :label="$t('Match')"
      v-if="props.protocols && ((props.protocols & GatewayProtocols.HTTP1) || (props.protocols & GatewayProtocols.HTTP2) || (props.protocols & GatewayProtocols.HTTP3))">
      <div v-if="form.Match" style="width: 100%;">
        <el-button :icon="RemoveFilled" @click="() => { form.Match = null; }" />

        <el-form-item prop="Hosts" :label="$t('Host')">
          <el-select v-model="form.Match.Hosts" multiple allow-create filterable>
          </el-select>
        </el-form-item>
        <el-form-item prop="Paths" :label="$t('Paths')">
          <el-select v-model="form.Match.Paths" multiple allow-create filterable :placeholder="$t('Path')">
          </el-select>
        </el-form-item>
        <el-form-item prop="Methods" :label="$t('Methods')">
          <el-select v-model="form.Match.Methods" multiple allow-create filterable>
            <el-option key="GET" label="GET" value="GET" />
            <el-option key="POST" label="POST" value="POST" />
            <el-option key="PUT" label="PUT" value="PUT" />
            <el-option key="PATCH" label="PATCH" value="PATCH" />
            <el-option key="DELETE" label="DELETE" value="DELETE" />
            <el-option key="HEAD" label="HEAD" value="HEAD" />
            <el-option key="OPTIONS" label="OPTIONS" value="OPTIONS" />
          </el-select>
        </el-form-item>
        <el-form-item prop="Statement">
          <template #label>
            <span>{{ $t('Statement') }}</span>
            <el-tooltip placement="top">
              <template #content> {{ $t('StatementTip') }} </template>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.Match.Statement" :placeholder="$t('StatementTip')" />
        </el-form-item>
      </div>
      <div v-else>
        <el-button :icon="CirclePlusFilled" @click="() => { form.Match = new RouteMatch({}); }" />
      </div>
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
        <ClusterDetail :data="form.Cluster" :done="() => { }" :allowUpdate="false" ref="clusterformRef"
          v-model="form.Cluster"></ClusterDetail>
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
    <el-form-item prop="Metadata" :label="$t('Metadata')">
      <div v-if="form.Metadata" style="width: 100%;">
        <el-button :icon="RemoveFilled" @click="() => { form.Metadata = null; }" style="margin-bottom: 16px;" />
        <div v-for="(node, index) of form.Metadata" :key="index" style="margin-bottom: 16px;">
          <el-form-item :label="''" :prop="`Metadata[${Number(index)}]`">
            <div style="display: flex; gap: 16px 8px;">
              <el-button type="danger" @click="(n: any) => { form.Metadata?.splice(n, 1) }">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
              <el-input v-model="node.Key" :placeholder="$t('Key')" />
              <el-input v-model="node.Value" :placeholder="$t('Value')" />
            </div>
          </el-form-item>
        </div>
        <div>
          <el-button @click="() => { form.Metadata?.push({ Key: '', Value: '' }) }">
            <el-icon>
              <Plus />
            </el-icon>
          </el-button>
        </div>
      </div>
      <div v-else>
        <el-button :icon="CirclePlusFilled" @click="() => { form.Metadata = [{ Key: '', Value: '' }]; }" />
      </div>
    </el-form-item>
    <el-form-item prop="Transforms" :label="$t('Transforms')">
      <div v-if="form.Transforms" style="width: 100%;">
        <el-button :icon="RemoveFilled" @click="() => { form.Transforms = null; }" style="margin-bottom: 16px;" />
        <div v-for="(node, index) of form.Transforms" :key="index" style="margin-bottom: 16px;">
          <el-form-item :label="''" :prop="`Transforms[${Number(index)}]`">
            <el-button type="danger" @click="() => { form.Transforms?.splice(index, 1) }" style="margin-right: 8px;">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
            <span v-for="(v, i) of keys(node)" style="margin-right: 8px;">
              {{ v }} : {{ node[v] }}
            </span>
          </el-form-item>
        </div>
        <div>
          <el-button @click="() => { selectedTransform = {}; selectedTransformWay = ''; dialogSelectTransform = true; }">
            <el-icon>
              <Plus />
            </el-icon>
          </el-button>
          <el-dialog v-model="dialogSelectTransform" :title="$t('Transforms')" :close-on-click-modal="false">
            <selectTransform v-model:model="selectedTransform" v-model:way="selectedTransformWay"
              ref="selectTransformRef">
            </selectTransform>
            <el-button type="primary"
              @click="async () => { if (await selectTransformRef.validate()) { dialogSelectTransform = false; form.Transforms?.push(selectedTransform); } }">
              {{ $t('Confirm') }}
            </el-button>
          </el-dialog>
        </div>
      </div>
      <div v-else>
        <el-button :icon="CirclePlusFilled" @click="() => { form.Transforms = []; }" />
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
import { RouteData, RouteMatch, toServiceRoute } from '../ets/RouteData';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n';
import { storageService } from '../service/storage'
import { QuestionFilled, RemoveFilled, CirclePlusFilled, Delete, Plus } from '@element-plus/icons-vue'
import { GatewayProtocols } from '../ets/GatewayProtocols';
import ClusterDetail from './clusterDetail.vue';
import { ClusterData } from '../ets/ClusterData';
import { selectCluster, selectTransform } from '../components';
import { keys } from 'lodash';

const { t } = useI18n({
  useScope: 'global'
})

const dialogSelectTransform = ref(false)
const dialogSelectCluster = ref(false)
const selectedCluster = ref<ClusterData | null>(null)
const formRef = ref<FormInstance>()
const selectTransformRef = ref<any>()
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
const selectedTransform = ref({} as any)
const selectedTransformWay = ref('')
const isNew = ref(false)
const form = reactive(new RouteData({}))
const rules = reactive<FormRules<RouteData>>({
  Key: [{ required: true, message: () => t('required'), trigger: 'blur' },
  { min: 1, message: () => t('requiredLength') + '1', trigger: 'blur' },],
})

watchEffect(() => {
  isNew.value = props.data.Key == null
  const f = form as any
  for (const k of ['Key', 'Order', 'Timeout', 'UdpResponses', 'ClusterId', 'Cluster', 'Match', 'Metadata', 'Transforms']) {
    f[k] = (props.data as any)[k]
  }
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
  if(form.Cluster?.Key) {
    form.ClusterId = form.Cluster?.Key
  } else {
    form.ClusterId = null
  }
  if (invalid || !formEl || !await formEl.validate().catch(() => false)) {
    ElMessage.error(t('wrongSave'))
    return
  }
  var r = await storageService.updateRoute(toServiceRoute(form));
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
  if(form.Cluster?.Key) {
    form.ClusterId = form.Cluster?.Key
  } else {
    form.ClusterId = null
  }

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
