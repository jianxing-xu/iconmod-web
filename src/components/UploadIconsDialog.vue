<script setup lang="ts">
import { buildParsedSVG, convertParsedSVG, iconToHTML, parseSVGContent } from '@iconify/utils'
import { Tooltip } from 'floating-vue'
import { bags, showGlobalTip } from '../store'
import { projects, showAddToProject } from '../store/project'
import { mfetch } from '../utils/http'
import { clearSvg } from '../utils/icons'
import { LoadIconSvgs } from '../utils/pack'
import { useDragTarget } from '../utils/useDragTarget'
import { useThemeColor } from '../hooks'

defineEmits(['close'])

let incrementID = 0

const { style } = useThemeColor()

const submitting = ref(false)
const selected = ref<number | null>()
const uploadTip = ref('')

const dragTarget = ref()
const dragOver = ref(false)
const dropColor = ref(true)

const icons = ref<{ id: number, name: string, svg: string }[]>([])

useDragTarget(dragTarget, (e) => {
  const file = e.dataTransfer?.files[0]
  if (!file)
    return
  if (file.type !== 'image/svg+xml') {
    uploadTip.value = 'must be svg file'
    return
  }
  processSVG(file)
  setTimeout(() => dragOver.value = false)
})

async function onSubmit() {
  if (submitting.value || !selected.value)
    return
  submitting.value = true
  try {
    let icons = await LoadIconSvgs(bags.value)
    icons = icons.map(it => ({ ...it, name: it.name.split(':')[1] }))
    await mfetch('/api/project/addicons', { method: 'POST', body: JSON.stringify({ projectId: selected.value, icons }) })
    showGlobalTip('Add Successful!')
    showAddToProject.value = false
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (_) {

  }
}
async function onFilechange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file)
    return
  if (file.type !== 'image/svg+xml') {
    uploadTip.value = 'must be svg file'
  }
  processSVG(file)
}
async function processSVG(file: File) {
  try {
    uploadTip.value = ''
    const svg = await clearSvg(await file.text(), dropColor.value)
    const name = file.name
    icons.value.push({ name: name.replace('.svg', ''), id: ++incrementID, svg })
  }
  catch (error: any) {
    showGlobalTip(`Parse icon error${error?.toString()}`)
  }
}
function buildSvg(svg: string) {
  const icon = buildParsedSVG(parseSVGContent(svg) as any)
  if (!icon) {
    return 'icon convert failed'
  }
  const { body, ...attrs } = icon
  return iconToHTML(icon.body, { ...(attrs.attributes), width: '40', height: '40' })
}
</script>

<template>
  <form class="w-700px" @submit.prevent.stop="onSubmit">
    <div class="flex p4">
      <div font-bold>
        Upload icons
      </div>
      <iconify-icon icon="material-symbols:close-rounded" icon-button cursor-pointer mla @click="$emit('close')" />
    </div>
    <div class="p4 pt0">
      <label mb2 block text-14px flex items-center>
        <span>Drag svg to there</span>
        <input v-model="dropColor" type="checkbox" ml4 bg-base cursor-pointer>
        <span ml1 cursor-pointer>drop color</span>
        <Tooltip>
          <iconify-icon icon="material-symbols:help-center" text-5 ml1 cursor-pointer />
          <template #popper>
            <div :style="style">Remove the color to upload, example: fill, stroke colors. If your icon is a multi -color icon, it is recommended to cancel the check</div>
          </template>
        </Tooltip>
      </label>
      <div text-base>
        Icon drawing rule reference:
        <a icon-button target="_blank" href="https://www.iconfont.cn/help/detail?spm=a313x.help_article_detail.i1.de97f49b6.ad683a81E8BPF0&helptype=draw">Iconfont rule</a>
      </div>
      <div h20 wfull rd-1 b border-dashed border-white flex relative :class="{ 'border-2': dragOver }">
        <iconify-icon icon="mdi:add" ma text-6 />
        <input ref="dragTarget" type="file" wfull hfull absolute top-0 left-0 opacity-0 @change="onFilechange" @dragenter="dragOver = true" @dragleave="dragOver = false">
      </div>
      <div text-red>
        {{ uploadTip }}
      </div>
    </div>
    <div class="p4 pt0">
      <div>Icons</div>
      <div flex gap3 flex-wrap>
        <div v-for="icon of icons" :key="icon.id" flex items-center bg-base-2 rd-1 pl2>
          <div v-html="buildSvg(icon.svg)" />
          <input v-model="icon.name" bg-base-2 rd-1 w-20 hfull px2 ml2>
          <iconify-icon icon="mdi:trash" text-8 cursor-pointer icon-button />
        </div>
      </div>
    </div>
    <div class="p4 pt0">
      <label mb2 text-14px block>
        To project*
      </label>
      <div
        v-for="p of projects" :key="p.id"
        class="bg-base-2 py2 px3 rd-1 mb2 cursor-pointer"
        :class="{ 'outline outline-primary': selected === p.id }"
        @click="selected === p.id ? selected = null : selected = p.id"
      >
        <div>{{ p.name }}</div>
      </div>
      <div class="mt4">
        <button b border-base bg-base py2 px4 rd-1 flex items-center>
          Confirm
          <iconify-icon v-show="submitting" icon="svg-spinners:270-ring-with-bg" class="ml-1" />
        </button>
      </div>
    </div>
  </form>
</template>

<style>
.search-user-parent:has(#searchUser:focus) {
  outline: white 1px solid;
}
</style>
