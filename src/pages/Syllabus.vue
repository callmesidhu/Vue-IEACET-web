<script setup lang="ts">
import { ref, computed } from 'vue'
import { Motion, Presence as AnimatePresence } from '@motionone/vue'
import { ChevronDown, BookOpen } from 'lucide-vue-next'
import SchemeSelector from '../components/SchemeSelector.vue'
import { useSyllabus } from '../composables/useGoogleSheets'

type Scheme = '2024' | '2019'

const activeScheme = ref<Scheme>('2024')
const expandedId = ref<number | null>(null)

const { schemes, loading, error } = useSyllabus()

const currentSchemeData = computed(() =>
  schemes.value.find(s => s.year === activeScheme.value)
)
const semesters = computed(() => currentSchemeData.value ? currentSchemeData.value.semesters : [])

const toggleExpand = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <div class="pt-32 pb-20 min-h-screen bg-zinc-950 text-zinc-50 relative overflow-hidden">
    <!-- Extremely subtle grid overlay -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.25] pointer-events-none" />

    <div class="container mx-auto px-6 relative z-10">
      <Motion
        :initial="{ opacity: 0, y: 15 }"
        :animate="{ opacity: 1, y: 0 }"
        class="max-w-5xl mx-auto text-center mb-16"
      >
        <span class="text-xs font-mono font-medium tracking-widest text-zinc-500 uppercase mb-4 inline-block">
          Syllabus & Course Scheme
        </span>
        <h1 class="text-4xl md:text-5xl font-sans font-bold mb-6 tracking-tight text-zinc-50">
          Curriculum
        </h1>
        <p class="text-base text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
          Comprehensive curriculum structure and official syllabus breakdown for B.Tech Industrial Engineering.
        </p>

        <SchemeSelector
          v-model:activeScheme="activeScheme"
          class="mb-8"
        />
      </Motion>

      <div class="max-w-5xl mx-auto">
        <!-- Loading state -->
        <div v-if="loading" class="flex items-center justify-center py-24">
          <svg class="animate-spin h-8 w-8 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
        <!-- Error state -->
        <div v-else-if="error" class="border border-red-800/50 bg-red-900/10 rounded-xl p-10 text-center">
          <p class="text-red-400 text-sm">Failed to load syllabus data. Please try again later.</p>
        </div>
        <AnimatePresence v-else mode="wait">
          <Motion
            :key="activeScheme"
            :initial="{ opacity: 0, y: 10 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: -10 }"
            :transition="{ duration: 0.2 }"
            class="space-y-4"
          >
            <!-- Empty Placeholder -->
            <div v-if="semesters.length === 0" class="border border-zinc-800 bg-zinc-900/30 rounded-xl p-16 text-center shadow-sm relative overflow-hidden">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 mb-6 text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-sans font-semibold text-zinc-200 mb-2">Will be updated soon</h3>
              <p class="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
                We are currently compiling and verifying the official resource files for the {{ activeScheme }} Scheme. Please check back shortly.
              </p>
            </div>
            
            <!-- Semesters Accordion -->
            <div v-else class="border border-zinc-800 bg-zinc-900/20 rounded-xl divide-y divide-zinc-800 overflow-hidden shadow-sm">
              <div
                v-for="sem in semesters"
                :key="`${activeScheme}-${sem.id}`"
                class="transition-all duration-200"
              >
                <button
                  @click="toggleExpand(sem.id)"
                  class="w-full px-8 py-6 flex items-center justify-between text-left transition-colors bg-transparent hover:bg-zinc-900/40 group"
                  :class="{ 'bg-zinc-900/20': expandedId === sem.id }"
                >
                  <div class="flex items-center gap-5">
                    <div 
                      class="w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-200 flex-shrink-0"
                      :class="expandedId === sem.id 
                        ? 'bg-zinc-900 border-zinc-700 text-white' 
                        : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 group-hover:border-zinc-700'"
                    >
                      <BookOpen class="w-5 h-5 text-current" />
                    </div>
                    <div>
                      <h3 class="text-lg font-sans font-semibold text-zinc-200 transition-colors" :class="{ 'text-white': expandedId === sem.id }">
                        {{ sem.title }}
                      </h3>
                      <span class="text-xs text-zinc-500 font-mono font-medium">{{ activeScheme }} Scheme</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span v-if="expandedId !== sem.id" class="text-xs text-zinc-500 font-medium hidden sm:inline-block">View details</span>
                    <Motion
                      :animate="{ rotate: expandedId === sem.id ? 180 : 0 }"
                      :transition="{ duration: 0.2 }"
                    >
                      <ChevronDown class="text-zinc-500 w-4 h-4" />
                    </Motion>
                  </div>
                </button>

                <div 
                  class="grid transition-all duration-200 ease-in-out"
                  :class="expandedId === sem.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                >
                  <div class="overflow-hidden">
                    <div 
                      class="px-8 py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6 bg-zinc-950/40"
                    >
                      <div class="max-w-md">
                        <p class="text-zinc-400 text-sm leading-relaxed mb-1.5">
                          Official curriculum and course contents approved by the university.
                        </p>
                        <div class="flex items-center gap-2">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">PDF Document</span>
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-900/80 text-zinc-400 border border-zinc-800">Verified</span>
                        </div>
                      </div>
                      <div class="flex flex-wrap gap-3 w-full sm:w-auto justify-start sm:justify-end">
                        <a
                          v-for="file in sem.files"
                          :key="file.name"
                          :href="file.link"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-100 text-zinc-950 font-medium hover:bg-zinc-200 active:scale-[0.98] transition-all text-xs flex-1 sm:flex-none shadow-sm min-w-[120px]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {{ file.name === 'FULL' || file.name === 'Full Syllabus' ? 'Open Syllabus' : file.name }}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Motion>
        </AnimatePresence>
      </div>
    </div>
  </div>
</template>
