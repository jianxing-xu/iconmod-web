<script setup lang="ts">
import { mfetch } from '../utils/http'

const props = defineProps<{ projectId: number }>()

let timer: any

const members = ref<{ userId: number, user: { name: string }, role: number }[]>([])
const userResults = ref<{ id: number, name: string, email: string }[]>([])

function getMembers() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    mfetch(`/api/project/members?projectId=${props.projectId}`).then(r => r.json()).then((res) => {
      members.value = res.data || []
    })
  }, 400)
}

function searchUser(e: Event) {
  const k = (e.target as HTMLInputElement).value
  if (!k.trim()) {
    userResults.value = []
    return
  }
  mfetch(`/api/user/search?keyword=${k}`).then(r => r.json()).then((res) => {
    userResults.value = res.data || []
  })
}

function onAddUser(id: number) {
  mfetch('/api/project/adduser', {
    method: 'POST',
    body: JSON.stringify({ projectId: props.projectId, userId: id }),
    headers: { 'Content-Type': 'application/json' },
  }).then(r => r.json()).then(() => {
    getMembers()
    // eslint-disable-next-line no-alert
    alert('添加成功')
  })
}

onMounted(() => {
  getMembers()
})
</script>

<template>
  <div class="min-w-500px">
    <div class="flex p4">
      <div font-bold>
        Member Manager
      </div>
      <iconify-icon icon="material-symbols:close-rounded" icon-button mla />
    </div>
    <div px4 relative>
      <input class="bg-base-2 rd-2 p1 px2" @input="searchUser">
      <div v-show="userResults.length" w-200px border p2 border-base rd-1 absolute top-10 bg-base shadow shadow-gray>
        <div v-for="u of userResults" :key="u.id" flex items-center>
          <div>{{ u.name }}</div>
          <div icon-button border border-base p1 text-3 rd-1 cursor-pointer mla @click="onAddUser(u.id)">
            Add
          </div>
        </div>
      </div>
    </div>
    <div p4>
      <div flex mb2 color-base>
        <div w-300px pr2>
          Name
        </div>
        <div>Role</div>
        <div mla>
          Action
        </div>
      </div>
      <div v-for="u of members" :key="u.userId" flex items-center>
        <div w-300px pr2>
          {{ u.user.name }}
        </div>
        <div>{{ u.role === 1 ? "Admin" : "Member" }}</div>
        <iconify-icon icon="material-symbols:delete" text-2xl icon-button mla />
      </div>
    </div>
  </div>
</template>
