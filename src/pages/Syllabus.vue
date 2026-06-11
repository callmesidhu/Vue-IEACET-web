<script setup lang="ts">
import { ref, computed } from 'vue'
import { Motion, Presence as AnimatePresence } from '@motionone/vue'
import { ChevronDown, BookOpen } from 'lucide-vue-next'
import SchemeSelector from '../components/SchemeSelector.vue'
import syllabusData from '../data/syllabus.json'

type Scheme = '2024' | '2019'

const activeScheme = ref<Scheme>('2024')
const expandedId = ref<number | null>(null)

const currentSchemeData = computed(() => 
  syllabusData.schemes.find(s => s.year === activeScheme.value)
)
const semesters = computed(() => currentSchemeData.value ? currentSchemeData.value.semesters : [])

const toggleExpand = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <div class="pt-32 pb-20 min-h-screen bg-noir-900 relative overflow-hidden">
    <!-- Background Grid & Glows -->
    <div class="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

    <div class="container mx-auto px-6 relative z-10">
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        class="max-w-3xl mx-auto text-center mb-16"
      >
        <span class="px-4 py-1.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 tracking-wider uppercase mb-6 inline-block">
          Official Curriculum
        </span>
        <h1 class="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight text-white">
          Syllabus & Course Scheme
        </h1>
        <p class="text-lg text-slate-light mb-10 max-w-xl mx-auto">
          Comprehensive curriculum structure and official syllabus breakdown for B.Tech Industrial Engineering.
        </p>

        <SchemeSelector
          v-model:activeScheme="activeScheme"
          class="mb-8 p-1 bg-noir-800/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl"
        />
      </Motion>

      <div class="max-w-3xl mx-auto space-y-4">
        <AnimatePresence mode="wait">
          <Motion
            :key="activeScheme"
            :initial="{ opacity: 0, y: 15 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: -15 }"
            :transition="{ duration: 0.3 }"
            class="space-y-4"
          >
            <div v-if="semesters.length === 0" class="glass-card rounded-2xl p-16 text-center border border-white/10 shadow-2xl relative overflow-hidden">
              <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent/50 to-transparent" />
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6 text-slate-light">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-2xl font-display font-bold text-white mb-3">Will be updated soon</h3>
              <p class="text-slate-light text-sm max-w-sm mx-auto leading-relaxed">
                We are currently compiling and verifying the official resource files for the 2019 Scheme. Please check back shortly.
              </p>
            </div>
            
            <div
              v-else
              v-for="sem in semesters"
              :key="`${activeScheme}-${sem.id}`"
              class="glass-card rounded-2xl overflow-hidden border transition-all duration-300 relative"
              :class="expandedId === sem.id ? 'border-accent/40 bg-noir-850/80 shadow-[0_10px_35px_rgba(59,130,246,0.05)]' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.01]'"
            >
              <!-- Left accent glow bar -->
              <div 
                class="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
                :class="expandedId === sem.id ? 'bg-accent shadow-[0_0_15px_#3b82f6]' : 'bg-transparent'"
              />

              <button
                @click="toggleExpand(sem.id)"
                class="w-full px-6 py-5 flex items-center justify-between text-left transition-colors"
                :class="{ 'bg-white/[0.02]': expandedId === sem.id }"
              >
                <div class="flex items-center gap-4">
                  <div 
                    class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                    :class="expandedId === sem.id ? 'bg-accent/20 text-accent' : 'bg-white/5 text-slate-light'"
                  >
                    <BookOpen class="w-5 h-5" />
                  </div>
                  <div>
                    <h3 class="text-lg md:text-xl font-display font-bold text-white transition-colors" :class="{ 'text-accent': expandedId === sem.id }">
                      {{ sem.title }}
                    </h3>
                    <span class="text-xs text-slate-light font-medium">{{ activeScheme }} Scheme</span>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span v-if="expandedId !== sem.id" class="text-xs text-slate-light/60 font-medium hidden sm:inline-block">View details</span>
                  <Motion
                    :animate="{ rotate: expandedId === sem.id ? 180 : 0 }"
                    :transition="{ duration: 0.3 }"
                  >
                    <ChevronDown class="text-slate-light w-5 h-5" />
                  </Motion>
                </div>
              </button>

              <div 
                class="grid transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                :class="expandedId === sem.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
              >
                <div class="overflow-hidden">
                  <div 
                    class="px-6 pb-6 pt-5 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/[0.01] transition-all duration-300 transform"
                    :class="expandedId === sem.id ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'"
                  >
                    <div class="max-w-md">
                      <p class="text-slate-light text-sm leading-relaxed mb-1">
                        Official curriculum and course contents approved by the university.
                      </p>
                      <div class="flex items-center gap-2 mt-2">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-white/5 text-slate-light border border-white/10">Format: PDF</span>
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-accent/10 text-accent border border-accent/20">Verified</span>
                      </div>
                    </div>
                    <a
                      :href="sem.syllabus"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.45)] hover:bg-accent/90 active:scale-[0.98] transition-all text-sm w-full sm:w-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open Syllabus PDF
                    </a>
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
