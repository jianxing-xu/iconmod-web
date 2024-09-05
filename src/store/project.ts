import { mfetch } from '../utils/http'

export const showCreateProject = ref(false)
export const showAddToProject = ref(false)
export const showUploadIcon = ref(true)
export const projects = ref<{ prefix: string, name: string, desc: string, id: number }[]>([])

export function getOwnProejcts() {
  return mfetch('/api/project/list').then(res => res.json()).then((res) => {
    projects.value = res.data
  }).catch(() => {})
}

export function addIconsToProject() {}
