<script setup lang='ts'>
import { watch } from 'vue'
import type { CollectionInfo } from '../../data'
import { activeMode, bags, toggleBag } from '../../store'
import { getIconSnippet } from '../../utils/icons'

const route = useRoute()

const abortSignal = new AbortController()

const copied = ref(false)
const searchKey = ref('')
const searchbar = ref<{ input: HTMLElement }>()
const current = ref('')

const collections = ref<Record<string, CollectionInfo[]>>({})
const icons = ref<string[]>([])

function onCopy(status: boolean) {
  copied.value = status
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
async function copyText(text?: string) {
  if (text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    }
    catch {
    }
  }
  return false
}
async function onSelect(icon: string) {
  switch (activeMode.value) {
    case 'select':
      toggleBag(icon)
      break
    case 'copy':
      onCopy(await copyText(await getIconSnippet(icon, 'id', true) || icon))
      break
    default:
      current.value = icon
      break
  }
}

async function getIconList(searchString: string) {
  const result = await fetch(`/api/search?query=${searchString}&limit=100`, { signal: abortSignal.signal }).then(r => r.json())
  if (result.collections) {
    for (const key in result.collections) {
      const value = result.collections[key]
      if (value) {
        value.id = key
      }
    }
    collections.value = result.collections
  }
  icons.value = result.icons
}

watch(() => route.query.s, (v) => {
  getIconList(v as string)
}, { immediate: true })

onMounted(() => searchbar.value?.input.focus())
</script>

<template>
  <WithNavbar>
    <div of-hidden grid="~ rows-[max-content_1fr]">
      <!-- Searching -->
      <div md:mx-6 md:mt-6>
        <SearchBar
          ref="searchbar"
          v-model:search="searchKey"
          placeholder="Search all icons..."
          flex
        />
        <RouterLink
          :class="searchKey ? '' : 'op0 pointer-events-none'"
          px4 py2 w-full mt--1px text-sm z--1 h-10
          flex="~ gap-2" items-center
          border="~ base rounded-b"
          hover="text-primary !border-primary shadow"
          :to="`/collection/all?s=${searchKey}`"
        >
          <div i-carbon-direction-right-01 scale-y--100 op50 />
          Search for all icons...
        </RouterLink>
      </div>

      <div of-y-auto>
        <Icons :icons="icons" :selected="bags" @select="onSelect" />

        <CollectionEntries
          of-hidden
          :collections="collections"
        />

        <div class="flex flex-col flex-grow w-full py-6 justify-center items-center">
          <Icon icon="ph:x-circle-bold" class="text-4xl mb-2 opacity-20" />
          <span class="text-lg opacity-60">There is no result corresponding to your search query.</span>
        </div>
        <Footer />
      </div>
      <!-- Details -->
      <Modal :value="!!current" @close="current = ''">
        <IconDetail
          :icon="current"
          @close="current = ''"
          @copy="onCopy"
        />
      </Modal>
    </div>
  </WithNavbar>
</template>
