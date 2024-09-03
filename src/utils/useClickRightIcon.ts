import { createVNode, render } from 'vue'
import { toggleBag } from '../store'

const Menu = defineComponent({
  props: { icon: { type: String }, x: { type: Number }, y: { type: Number } },
  setup(props, { emit }) {
    function close() {
      emit('close')
    }
    onMounted(() => {
      document.removeEventListener('click', close)
      document.addEventListener('click', close)
    })
    onUnmounted(() => {
      document.removeEventListener('click', close)
    })
    return {
      onAddToBag() {
        toggleBag(props.icon as string)
        emit('close')
      },
    }
  },
  render() {
    return h('div', {
      style: { top: `${this.$props.y}px`, left: `${this.$props.x}px` },
      class: 'fixed overflow-hidden rd-1 border-base bg-base shadow',
    }, [
      h('div', {
        class: 'px2 py1 border-b border-base text-3 icon-button cursor-pointer',
        onClick: this.onAddToBag,
      }, 'Add to Bag'),
    ])
  },
})

function showMenu(icon: string, x: number, y: number, onClose?: () => void) {
  const box = document.createElement('div')
  const vnode = createVNode(Menu, { icon, x, y, onClose })
  render(vnode, box)
  document.body.appendChild(box)
  return () => {
    vnode.appContext?.app?.unmount?.()
    box.remove()
  }
}

export function useRightClickIcon() {
  function onContextMenu(iconName: string, e: MouseEvent) {
    e.preventDefault()
    const close = showMenu(iconName, e.x, e.y, () => {
      close()
    })
  }
  return { onContextMenu }
}
