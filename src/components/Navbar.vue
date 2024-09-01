<script lang="ts">
import { getSearchResults, isDark } from '../store'
import { showLogin, userInfo } from '../store/user'

export default defineComponent({
  setup() {
    const route = useRoute()
    return {
      ...getSearchResults(),
      isDark,
      isHomepage: computed(() => route.path === '/'),
      showLogin,
      userInfo,
    }
  },
})
</script>

<template>
  <nav
    class="dragging"
    flex="~ gap4 none"
    p4 relative bg-base z-10 border="b base" text-xl
  >
    <!-- In Collections -->
    <RouterLink
      v-if="!isHomepage"
      class="non-dragging"
      icon-button flex-none
      to="/"
    >
      <iconify-icon icon="carbon:arrow-left" />
    </RouterLink>

    <!-- Homepage Only -->
    <div flex-auto />
    <h1
      absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center
      text-xl font-light tracking-2px pointer-events-none
    >
      Icônes
    </h1>
    <button v-if="!userInfo.id" class="icon-button text-4" @click="showLogin">
      Sign In
    </button>
    <button v-else class="icon-button text-4">
      Hello, {{ userInfo.name }}
    </button>
    <RouterLink to="/upload" class="icon-button">
      <iconify-icon icon="system-uicons:upload-alt" />
    </RouterLink>
    <RouterLink
      class="non-dragging"
      icon-button flex-none
      to="/settings"
      title="Settings"
    >
      <iconify-icon icon="carbon-settings" />
    </RouterLink>
    <DarkSwitcher flex-none />
  </nav>
</template>
