<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ElConfigProvider } from 'element-plus'
  import zhCn from 'element-plus/es/locale/lang/zh-cn'
  import en from 'element-plus/es/locale/lang/en'
  import { useI18n } from 'vue-i18n'
  import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
    DArrowRight,
    DArrowLeft,
    Sunny,
    Moon
  } from '@element-plus/icons-vue'
  import { useDark, useToggle } from '@vueuse/core'
  import { useStorage } from '@vueuse/core'

  const isCollapse = ref(true)
  const { t, locale } = useI18n({
    useScope: 'global'
  })

  const state = useStorage(
    'vkproxy-store',
    { language: 'zh' },
    localStorage,
    { mergeDefaults: true }
  )

  const isDark = useDark()
  const toggleDark = useToggle(isDark)

  const language = ref(state.value.language)
  const localev = computed(() => (language.value === 'zh' ? zhCn : en))

  const toggle = () => {
    language.value = language.value === 'zh' ? 'en' : 'zh'
    locale.value = language.value
    state.value.language = language.value
  }
</script>

<template>

  <el-menu mode="horizontal" style="width: 100%"
           :ellipsis="false">
    <el-menu-item index="0">
      <el-image src="/favicon.ico" fit="fill" />
    </el-menu-item>
    <el-menu-item index="1">
      <el-switch v-model="isDark" change="() =>toggleDark()">
        <template #active-action>
          <el-icon><Moon /></el-icon>
        </template>
        <template #inactive-action>
          <el-icon><Sunny /></el-icon>
        </template>
      </el-switch>
    </el-menu-item>
    <el-menu-item index="2">
      <el-button @click="toggle" link>
        <span v-if="language === 'zh'">中</span>
        <span v-else>en</span>
      </el-button>
    </el-menu-item>
    <el-menu-item index="3">
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      <el-text size="large" style="margin-left: 4px;" truncated>User name</el-text>
    </el-menu-item>
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
      <el-menu default-active="2"
               class="el-menu-vertical"
               :collapse="isCollapse">
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item-group>
            <template #title>
              <span>Group One</span>
            </template>
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title>
              <span>item four</span>
            </template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <template #title>
            Navigator Two
          </template>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <el-icon><document /></el-icon>
          <template #title>
            Navigator Three
          </template>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <template #title>
            Navigator Four
          </template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-row>
        </el-row>
      </el-header>
      <el-main>
        <el-config-provider :locale="localev">
          <p>message: {{ $t('hello') }}</p>
        </el-config-provider>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
  .el-menu-vertical:not(.el-menu--collapse) {
    min-width: 200px;
    min-height: 400px;
  }

  .el-menu--horizontal > .el-menu-item:nth-child(1) {
    margin-right: auto;
  }

  .el-switch.is-checked {
    --el-switch-on-color: #2c2c2c;
    --el-switch-off-color: #2c2c2c;
    --el-switch-border-color: #4C4D4F;
  }

  .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: none;
  }
</style>
