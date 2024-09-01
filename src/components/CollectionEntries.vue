<script setup lang="ts">
import type { CollectionInfo, PresentType } from '../data'

defineProps<{
  collections: CollectionInfo[]
  type?: PresentType
}>()
</script>

<template>
  <div class="collections-list grid gap2" p2>
    <template
      v-for="collection of collections"
      :key="collection.id"
    >
      <CollectionEntryProject
        v-if="type === 'project'"
        :collection="collection"
        :type="type"
      />
      <CollectionEntry
        v-else
        :type="type"
        :collection="collection"
      />
    </template>
  </div>
</template>

<style>
.collections-list {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
