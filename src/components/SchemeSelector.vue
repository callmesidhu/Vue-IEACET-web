<script setup lang="ts">
import { Motion } from '@motionone/vue'

type Scheme = '2024' | '2019'

interface Props {
  activeScheme: Scheme
  className?: string
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:activeScheme', scheme: Scheme): void
}>()

const schemes: Scheme[] = ['2024', '2019']

const setScheme = (scheme: Scheme) => {
  emit('update:activeScheme', scheme)
}
</script>

<template>
  <div
    :class="`inline-flex p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 ${className || ''}`"
  >
    <button
      v-for="scheme in schemes"
      :key="scheme"
      @click="setScheme(scheme)"
      class="relative px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden"
    >
      <Motion
        v-if="activeScheme === scheme"
        layoutId="activeScheme"
        class="absolute inset-0 bg-accent shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        :transition="{ type: 'spring', bounce: 0.2, duration: 0.6 }"
      />
      <span
        :class="`relative z-10 ${
          activeScheme === scheme ? 'text-white' : 'text-slate-light hover:text-white'
        }`"
      >
        {{ scheme }} Scheme
      </span>
    </button>
  </div>
</template>
