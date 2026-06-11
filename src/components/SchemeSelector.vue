<script setup lang="ts">
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
    :class="`inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900/80 p-1 text-zinc-400 border border-zinc-800/80 shadow-md ${className || ''}`"
  >
    <button
      v-for="scheme in schemes"
      :key="scheme"
      @click="setScheme(scheme)"
      class="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-5 py-2 text-sm font-sans font-semibold transition-all duration-200"
      :class="activeScheme === scheme 
        ? 'bg-zinc-950 text-white border border-zinc-800/80 shadow-sm' 
        : 'hover:text-zinc-200'"
    >
      {{ scheme }} Scheme
    </button>
  </div>
</template>

