import { mfetch } from '../utils/http'

export const projects = useStorage<{ prefix: string, name: string, desc: string, id: number }[]>('projects', [])

export function getOwnProejcts() {
  return mfetch('/api/project/list').then(res => res.json()).then((res) => {
    projects.value = res.data
  })
}
