<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { useI18n } from 'vue-i18n'
import {
  Document,
  MostlyCloudy,
  Location,
  Aim,
  DArrowRight,
  DArrowLeft,
  Sunny,
  Moon
} from '@element-plus/icons-vue'
import { useDark, useToggle } from '@vueuse/core'
import { useStorage } from '@vueuse/core'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = ref("/");
watch(() => route.path, () => {
  let r = "/"
  if (route.path) {
    const p = route.path.split('/', 3)
    if (p && p[1]) {
      r = '/' + p[1]
    }
  }
  activeMenu.value = r
})


const { locale } = useI18n({
  useScope: 'global'
})

const state = useStorage(
  'vkproxy-store',
  { language: 'zh' },
  localStorage,
  { mergeDefaults: true }
)

const isCollapse = ref(false)

const isDark = useDark()
const toggleDark = useToggle(isDark)

const language = ref(state.value.language)
const localev = computed(() => (language.value === 'zh' ? zhCn : en))

const toggle = () => {
  language.value = language.value === 'zh' ? 'en' : 'zh'
  locale.value = language.value
  state.value.language = language.value
}

const open = (u: string) => {
  window.open(u, "_blank")
}
</script>

<template>

  <el-menu mode="horizontal" style="width: 100%" :ellipsis="false">
    <el-menu-item index="0">
      <el-image style="width: 100px; height: 55px" src="/logo.jpg" fit="scale-down" />
      <el-text size="large" style="font-weight: 600;" truncated>VKProxy</el-text>
    </el-menu-item>
    <el-menu-item index="1">
      <el-switch v-model="isDark" @change="toggleDark()">
        <template #active-action>
          <el-icon>
            <Moon />
          </el-icon>
        </template>
        <template #inactive-action>
          <el-icon>
            <Sunny />
          </el-icon>
        </template>
      </el-switch>
    </el-menu-item>
    <el-menu-item index="2">
      <el-button @click="toggle" link>
        <span v-if="language === 'zh'">中</span>
        <span v-else>en</span>
      </el-button>
    </el-menu-item>
    <!-- <el-menu-item index="3">
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      <el-text size="large" style="margin-left: 4px;" truncated>User name</el-text>
    </el-menu-item> -->
  </el-menu>

  <el-container>
    <el-aside style="width: auto;">

      <div style="display:flex;">
        <el-button @click="isCollapse = !isCollapse" style="border: 0px; margin-left: auto;">
          <el-icon v-if="isCollapse">
            <DArrowRight />
          </el-icon>
          <el-icon v-else>
            <DArrowLeft />
          </el-icon>
        </el-button>
      </div>
      <el-menu :default-active="activeMenu" class="el-menu-vertical" :collapse="isCollapse" :router="true">
        <el-menu-item index="/401">
          <el-icon>
            <location />
          </el-icon>
          <template #title>
            <span>{{ $t('Routes') }}</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/clusters">
          <el-icon>
            <MostlyCloudy />
          </el-icon>
          <template #title>
            <span>{{ $t('Clusters') }}</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/listen">
          <el-icon>
            <Aim />
          </el-icon>
          <template #title>
            <span>{{ $t('Listen') }}</span>
          </template>
        </el-menu-item>
        <el-menu-item index="" @click="open('https://fs7744.github.io/vkproxy.doc/')">
          <el-icon>
            <document />
          </el-icon>
          <template #title>
            <span>{{ $t('document') }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <el-config-provider :locale="localev">
          <Suspense>
            <router-view />
            <template #fallback>
              Loading...
            </template>
          </Suspense>

        </el-config-provider>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  min-width: 200px;
  min-height: 400px;
}

.el-menu--horizontal>.el-menu-item:nth-child(1) {
  margin-right: auto;
}

.el-switch.is-checked {
  --el-switch-on-color: #2c2c2c;
  --el-switch-off-color: #2c2c2c;
  --el-switch-border-color: #4C4D4F;
}

.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: none;
}
</style>
