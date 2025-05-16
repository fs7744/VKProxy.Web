import {
  ElMessageBox
} from 'element-plus'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages
})
const { t } = i18n.global

export const handleClose = async (done: () => void) => {
  try {
    const cr = await ElMessageBox.confirm(t('closeLoss'))
    if (cr === "confirm") {
      done()
    }
  } catch { }
}

export const removeConfirm = async (key: string, d: () => Promise<void>) => {
  let cr;
  try {
    cr = await ElMessageBox.confirm(`${t('removeLoss')} ${key} ?`)
  } catch { }
  if (cr === "confirm") {
    await d()
  }
}
