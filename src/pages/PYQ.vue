<script setup lang="ts">
import { ref, computed } from 'vue'
import { Motion } from '@motionone/vue'
import { History, Search, Download, ChevronDown } from 'lucide-vue-next'
import SchemeSelector from '../components/SchemeSelector.vue'
import { usePyqs } from '../composables/useGoogleSheets'

type Scheme = '2024' | '2019'

const activeScheme = ref<Scheme>('2024')
const expandedSemester = ref<string | null>(null)
const searchQuery = ref('')

const isSearching = computed(() => searchQuery.value.length > 0)

const { pyq, loading, error } = usePyqs()

const currentSchemeData = computed(() =>
  pyq.value.find(s => s.scheme === activeScheme.value)
)
const semesters = computed(() => currentSchemeData.value ? currentSchemeData.value.semesters : [])

const filteredSemesters = computed(() => {
  const list = semesters.value
  return list.map(semGroup => {
    const subjects = semGroup.subjects.filter(sub =>
      sub.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    return { ...semGroup, subjects }
  }).filter(semGroup => semGroup.subjects.length > 0)
})

const toggleExpand = (semester: string) => {
  expandedSemester.value = expandedSemester.value === semester ? null : semester
}

const isExpanded = (semester: string) => {
  return expandedSemester.value === semester || isSearching.value
}

const openPyqLink = (url: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const handleSchemeChange = (scheme: Scheme) => {
  activeScheme.value = scheme
  expandedSemester.value = null
  searchQuery.value = ''
}
</script>

<template>
  <div class="pt-32 pb-20 min-h-screen bg-zinc-950 text-zinc-50 relative overflow-hidden">
    <!-- Extremely subtle grid overlay -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.25] pointer-events-none" />

    <div class="container mx-auto px-6 relative z-10">
      <div class="max-w-5xl mx-auto">
        <Motion
          :initial="{ opacity: 0, y: 15 }"
          :animate="{ opacity: 1, y: 0 }"
          class="max-w-5xl mx-auto text-center mb-12"
        >
          <span class="text-xs font-mono font-medium tracking-widest text-zinc-500 uppercase mb-4 inline-block">
            Exam Archive
          </span>
          <h1 class="text-4xl md:text-5xl font-sans font-bold mb-6 tracking-tight text-zinc-50">
            Previous Year Questions
          </h1>
          <p class="text-base text-zinc-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Access the verified archive of past semester examination papers to boost your academic preparation.
          </p>

          <!-- Search Bar & Scheme Selector -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <div class="relative w-full sm:flex-1">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search class="h-4 w-4 text-zinc-500" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="block w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-all shadow-sm text-sm"
                placeholder="Search by subject..."
              />
            </div>
            <SchemeSelector
              :activeScheme="activeScheme"
              @update:activeScheme="handleSchemeChange"
              class="w-full sm:w-auto"
            />
          </div>
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
            <p class="text-red-400 text-sm">Failed to load PYQ data. Please try again later.</p>
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
              <!-- Will be updated soon (Placeholder) -->
              <div v-if="semesters.length === 0" class="border border-zinc-800 bg-zinc-900/30 rounded-xl p-16 text-center shadow-sm relative overflow-hidden">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 mb-6 text-zinc-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-lg font-sans font-semibold text-zinc-200 mb-2">Will be updated soon</h3>
                <p class="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
                  Question papers for the {{ activeScheme }} Scheme are currently being compiled and will be uploaded soon.
                </p>
              </div>

              <!-- No results found (Search Empty state) -->
              <div v-else-if="filteredSemesters.length === 0" class="border border-zinc-800 bg-zinc-900/30 rounded-xl p-16 text-center shadow-sm relative overflow-hidden">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 mb-6 text-zinc-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-dasharray="none" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8" stroke="currentColor"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor"></line>
                  </svg>
                </div>
                <h3 class="text-lg font-sans font-semibold text-zinc-200 mb-2">No results found</h3>
                <p class="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
                  We couldn't find any question papers matching "{{ searchQuery }}". Try checking your spelling or search term.
                </p>
              </div>

              <!-- Semesters Accordion -->
              <div v-else class="border border-zinc-800 bg-zinc-900/20 rounded-xl divide-y divide-zinc-800 overflow-hidden shadow-sm">
                <div
                  v-for="(semGroup, index) in filteredSemesters"
                  :key="semGroup.semester"
                  class="transition-all duration-205"
                >
                  <Motion
                    :initial="{ opacity: 0, y: 10 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ delay: index * 0.03 }"
                  >
                    <button
                      @click="toggleExpand(semGroup.semester)"
                      class="w-full px-8 py-6 flex items-center justify-between text-left transition-colors bg-transparent hover:bg-zinc-900/40 group"
                      :class="{ 'bg-zinc-900/20': isExpanded(semGroup.semester) }"
                    >
                      <div class="flex items-center gap-5">
                        <div 
                          class="w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-200 flex-shrink-0"
                          :class="isExpanded(semGroup.semester) 
                            ? 'bg-zinc-900 border-zinc-700 text-white' 
                            : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 group-hover:border-zinc-700'"
                        >
                          <History class="w-5 h-5 text-current" />
                        </div>
                        <div>
                          <h2 class="text-lg font-sans font-semibold text-zinc-200 transition-colors" :class="{ 'text-white': isExpanded(semGroup.semester) }">
                            Semester {{ semGroup.semester.replace('S', '') }}
                          </h2>
                          <span class="text-xs text-zinc-500 font-mono font-medium">{{ activeScheme }} Scheme</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-4">
                        <span class="text-xs font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {{ semGroup.subjects.length }} subject{{ semGroup.subjects.length > 1 ? 's' : '' }}
                        </span>
                        <Motion
                          :animate="{ rotate: isExpanded(semGroup.semester) ? 180 : 0 }"
                          :transition="{ duration: 0.2 }"
                        >
                          <ChevronDown class="text-zinc-500 w-4 h-4" />
                        </Motion>
                      </div>
                    </button>

                    <div 
                      class="grid transition-all duration-200 ease-in-out"
                      :class="isExpanded(semGroup.semester) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                    >
                      <div class="overflow-hidden">
                        <div 
                          class="px-8 py-6 bg-zinc-950/40"
                        >
                          <div class="grid sm:grid-cols-2 gap-5 mt-2">
                            <div
                              v-for="(sub, i) in semGroup.subjects"
                              :key="i"
                              @click="openPyqLink(sub.link)"
                              class="bg-zinc-900/40 hover:bg-zinc-900/80 p-6 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors duration-200 cursor-pointer flex items-center justify-between shadow-sm group"
                            >
                              <div class="flex flex-col gap-1 pr-4">
                                <span class="font-sans text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug">
                                  {{ sub.name }}
                                </span>
                                <span class="text-[10px] text-zinc-500 font-mono">PYQ Drive</span>
                              </div>
                              <div class="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-white transition-all flex-shrink-0">
                                <Download class="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Motion>
                </div>
              </div>
            </Motion>
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
</template>
