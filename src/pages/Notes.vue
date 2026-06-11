<script setup lang="ts">
import { ref, computed } from 'vue'
import { Motion } from '@motionone/vue'
import { FileText, ChevronDown, Search } from 'lucide-vue-next'
import SchemeSelector from '../components/SchemeSelector.vue'
import notesData from '../data/notes.json'

type Scheme = '2024' | '2019'

const activeScheme = ref<Scheme>('2024')
const expandedSemester = ref<string | null>(null)
const searchQuery = ref('')

const isSearching = computed(() => searchQuery.value.length > 0)

const currentSchemeData = computed(() => 
  notesData.notes.find(s => s.scheme === activeScheme.value)
)
const semesters = computed(() => currentSchemeData.value ? currentSchemeData.value.semesters : [])

const filteredSemesters = computed(() => {
  const list = semesters.value
  if (!searchQuery.value) return list
  
  return list.map(sem => {
    const subjects = sem.subjects.filter(sub =>
      sub.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    return { ...sem, subjects }
  }).filter(sem => sem.subjects.length > 0)
})

const toggleExpand = (semester: string) => {
  expandedSemester.value = expandedSemester.value === semester ? null : semester
}

const handleSchemeChange = (scheme: Scheme) => {
  activeScheme.value = scheme
  expandedSemester.value = null
  searchQuery.value = ''
}

const openNoteLink = (url: string) => {
  if (url) {
    window.open(url, '_blank')
  }
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
            Study Resources
          </span>
          <h1 class="text-4xl md:text-5xl font-sans font-bold mb-6 tracking-tight text-zinc-50">
            Study Notes & Materials
          </h1>
          <p class="text-base text-zinc-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Curated study notes, reference materials, and textbook drives for your coursework.
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
                placeholder="Search subjects..."
              />
            </div>
            <SchemeSelector
              :activeScheme="activeScheme"
              @update:activeScheme="handleSchemeChange"
              class="w-full sm:w-auto p-1 bg-zinc-900 border border-zinc-800 rounded-xl"
            />
          </div>
        </Motion>

        <div class="space-y-6">
          <!-- Will be updated soon (2019 Scheme Placeholder) -->
          <div v-if="semesters.length === 0" class="border border-zinc-800 bg-zinc-900/30 rounded-xl p-16 text-center shadow-sm relative overflow-hidden">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 mb-6 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-sans font-semibold text-zinc-200 mb-2">Will be updated soon</h3>
            <p class="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
              Study materials and notes for the 2019 Scheme are currently being prepared and will be uploaded soon.
            </p>
          </div>

          <!-- No results found (Search Empty state) -->
          <div v-else-if="filteredSemesters.length === 0" class="border border-zinc-800 bg-zinc-900/30 rounded-xl p-16 text-center shadow-sm relative overflow-hidden">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 mb-6 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-dasharray="none" stroke-width="1.5">
                <circle cx="11" cy="11" r="8" stroke="currentColor"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor"></line>
              </svg>
            </div>
            <h3 class="text-lg font-sans font-semibold text-zinc-200 mb-2">No results found</h3>
            <p class="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
              We couldn't find any notes matching "{{ searchQuery }}". Try checking your spelling or search term.
            </p>
          </div>

          <!-- Semesters Accordion -->
          <div v-else class="border border-zinc-800 bg-zinc-900/20 rounded-xl divide-y divide-zinc-800 overflow-hidden shadow-sm">
            <div
              v-for="(sem, semIdx) in filteredSemesters"
              :key="`${activeScheme}-${sem.semester}`"
              class="transition-all duration-200"
            >
              <Motion
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ delay: semIdx * 0.03 }"
              >
                <button
                  @click="toggleExpand(sem.semester)"
                  class="w-full px-8 py-6 flex items-center justify-between text-left transition-colors bg-transparent hover:bg-zinc-900/40 group"
                  :class="{ 'bg-zinc-900/20': (expandedSemester === sem.semester || isSearching) }"
                >
                  <div class="flex items-center gap-5">
                    <div 
                      class="w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-200 flex-shrink-0"
                      :class="(expandedSemester === sem.semester || isSearching) 
                        ? 'bg-zinc-900 border-zinc-700 text-white' 
                        : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 group-hover:border-zinc-700'"
                    >
                      <FileText class="w-5 h-5 text-current" />
                    </div>
                    <div>
                      <h2 class="text-lg font-sans font-semibold text-zinc-200 transition-colors" :class="{ 'text-white': (expandedSemester === sem.semester || isSearching) }">
                        Semester {{ sem.semester.replace('S', '') }}
                      </h2>
                      <span class="text-xs text-zinc-500 font-mono font-medium">{{ activeScheme }} Scheme</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-xs font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {{ sem.subjects.length }} subject{{ sem.subjects.length > 1 ? 's' : '' }}
                    </span>
                    <Motion
                      :animate="{ rotate: (expandedSemester === sem.semester || isSearching) ? 180 : 0 }"
                      :transition="{ duration: 0.2 }"
                    >
                      <ChevronDown class="text-zinc-500 w-4 h-4" />
                    </Motion>
                  </div>
                </button>

                <div 
                  class="grid transition-all duration-200 ease-in-out"
                  :class="(expandedSemester === sem.semester || isSearching) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                >
                  <div class="overflow-hidden">
                    <div 
                      class="px-8 py-6 bg-zinc-950/40"
                    >
                      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
                        <div
                          v-for="(subject, subIdx) in sem.subjects"
                          :key="subIdx"
                          @click="openNoteLink(subject.link)"
                          class="bg-zinc-900/40 hover:bg-zinc-900/80 p-6 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors duration-200 cursor-pointer flex flex-col justify-between min-h-[150px] shadow-sm relative group"
                        >
                          <div>
                            <div class="flex items-center justify-between mb-3">
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-950 text-zinc-400 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                Drive Folder
                              </span>
                            </div>
                            <h3 class="text-sm font-sans font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug">
                              {{ subject.name }}
                            </h3>
                          </div>
                          <div class="flex items-center justify-between text-[11px] mt-4 pt-3 border-t border-zinc-800/60">
                            <span class="text-zinc-500">Google Drive</span>
                            <span class="flex items-center gap-1 text-zinc-350 hover:text-white transition-colors font-medium">
                              Access <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Motion>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
