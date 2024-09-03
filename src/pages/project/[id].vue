<script setup lang='ts'>
import ActionsMenu from '../../components/ActionsMenu.vue'
import { useIconAction } from '../../hooks'
import { bags, iconSize, listType } from '../../store'
import { mfetch } from '../../utils/http'

const props = defineProps<{
  id: string
}>()

const max = 100
const { onSelect } = useIconAction()

const project = ref<{ name: string, id: string, icons: string[], prefix: string }>()
const search = ref('')
const showMemberManage = ref(false)

const icons = computed(() => project?.value?.icons || [])
const filterIcons = computed(() => icons.value.filter(it => it.includes(search.value)))

function loadMore() {}
function loadAll() {}

function initData() {
  mfetch(`/api/project/info?prefix=${props.id}`).then(r => r.json()).then((res) => {
    if (res.data) {
      res.data.icons = res.data.uncategorized
      delete res.data.uncategorized
      project.value = res.data
    }
  }).catch(() => {})
}
initData()
</script>

<template>
  <WithNavbar>
    <div v-if="!project" class="py-8 px-4 text-gray-700 text-center dark:text-dark-700">
      Loading...
    </div>
    <div v-else class="flex flex-auto h-full overflow-hidden">
      <div
        h-full overflow-y-overlay flex-none hidden md:block
        w="250px"
        transition-all duration-300
        border-r border-base
      />

      <div h-full w-full relative max-h-full grid="~ rows-[max-content_1fr]" of-hidden>
        <div pt-5 flex="~ col gap-2">
          <div class="flex px-8">
            <!-- Left -->
            <div class="flex-auto px-2">
              <div class="text-gray-900 text-xl flex select-none dark:text-gray-200">
                <div class="whitespace-no-wrap overflow-hidden">
                  {{ project?.name }}
                </div>
              </div>
            </div>

            <!-- Right -->
            <div v-if="project" class="flex flex-col">
              <ActionsMenu :collection="{ ...project, id: project.prefix }">
                <div>
                  <iconify-icon icon="tdesign:member" class="icon-button" @click="showMemberManage = true" />
                </div>
              </ActionsMenu>
              <div class="flex-auto" />
            </div>
          </div>

          <!-- Searching -->
          <SearchBar v-model:search="search" class="mx-8 hidden md:flex" />
        </div>
        <div of-y-scroll of-x-hidden>
          <!-- Icons -->
          <div class="px-5 pt-2 pb-4 text-center">
            <Icons
              :icons="filterIcons.slice(0, max)"
              :selected="bags"
              :namespace="`${id}:`"
              :class="iconSize"
              :display="listType"
              @select="onSelect"
            />
            <button v-if="icons.length > max" class="btn mx-1 my-3" @click="loadMore">
              Load More
            </button>
            <button v-if="icons.length > max" class="btn mx-1 my-3" @click="loadAll">
              Load All ({{ icons.length - max }})
            </button>
            <p class="color-fade text-sm pt-4">
              {{ icons.length }} icons
            </p>
          </div>

          <Footer />
        </div>
      </div>
    </div>
    <ModalDialog :value="showMemberManage">
      <MemberManagerDialog :project-id="project?.id" @close="showMemberManage = false" />
    </ModalDialog>
  </WithNavbar>
</template>
