<script setup lang='ts'>
import { pushRecentCollection, setCurrentCollection, useCurrentCollection } from '../../store'

const props = defineProps<{
  id: string
}>()

watch(
  () => props.id,
  () => setCurrentCollection(props.id),
  { immediate: true },
)

onUnmounted(() => setCurrentCollection(''))

const collection = useCurrentCollection()

onMounted(() => {
  pushRecentCollection(props.id)
})
</script>

<template>
  <WithNavbar>
    <div v-if="!collection" class="py-8 px-4 text-gray-700 text-center dark:text-dark-700">
      Loading...
    </div>
    <IconSet v-else />
  </WithNavbar>
</template>
