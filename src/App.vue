<script setup lang='ts'>
import { specialTabs } from './data'
import { useThemeColor } from './hooks'
import { useIconAction } from './hooks/icon_action'
import { activeMode, bags, showHelp, useCurrentCollection } from './store'

const { style } = useThemeColor()
const { copied, onSelect, current, onCopy } = useIconAction()
const collection = useCurrentCollection()

const showBag = ref(false)
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-base" :style="style">
    <div class="h-full flex-auto overflow-overlay">
      <RouterView />
    </div>
    <Progress />

    <!-- Mode -->
    <div
      class="fixed top-0 right-0 pl-4 pr-2 py-1 rounded-l-full bg-primary text-white shadow mt-16 cursor-pointer transition-transform duration-300 ease-in-out"
      :style="activeMode !== 'normal' ? {} : { transform: 'translateX(120%)' }"
      @click="activeMode = 'normal'"
    >
      {{ activeMode === 'select' ? 'Multiple select' : 'Name copying mode' }}
      <Icon icon="carbon:close" class="inline-block text-xl align-text-bottom" />
    </div>

    <!-- Bag -->
    <Modal :value="showBag" direction="right" @close="showBag = false">
      <Bag
        @close="showBag = false"
        @select="onSelect"
      />
    </Modal>
    <!-- Details -->
    <Modal :value="!!current" @close="current = ''">
      <IconDetail
        :icon="current" :show-collection="specialTabs.includes(collection?.id as string)"
        @close="current = ''"
        @copy="onCopy"
      />
    </Modal>

    <Notification :value="copied">
      <Icon icon="mdi:check" class="inline-block mr-2 font-xl align-middle" />
      <span class="align-middle">Copied</span>
    </Notification>

    <!-- Help -->
    <ModalDialog :value="showHelp" @close="showHelp = false">
      <HelpPage />
    </ModalDialog>

    <!-- Bag Fab -->
    <FAB
      v-if="bags.length"
      icon="carbon:shopping-bag"
      :number="bags.length"
      @click="showBag = true"
    />
  </div>
</template>
