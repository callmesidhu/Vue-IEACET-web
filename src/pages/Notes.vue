<script setup lang="ts">
import { ref, computed } from 'vue'
import { Motion, Presence as AnimatePresence } from '@motionone/vue'
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
  <div class="pt-32 pb-20 min-h-screen bg-noir-900 relative overflow-hidden">
    <!-- Glow Spots -->
    <div class="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
    <div class="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
    <div class="absolute bottom-10 left-10 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

    <div class="container mx-auto px-6 relative z-10">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <Motion
          :initial="{ opacity: 0, x: -20 }"
          :animate="{ opacity: 1, x: 0 }"
          class="flex-1"
        >
          <span class="px-4 py-1.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 tracking-wider uppercase mb-6 inline-block">
            Study Resources
          </span>
          <h1 class="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight text-white">
            Study Notes & Materials
          </h1>
          <p class="text-lg text-slate-light mb-8 max-w-xl">
            Curated study notes, reference materials, and textbook drives for your coursework.
          </p>
          
          <SchemeSelector
            :activeScheme="activeScheme"
            @update:activeScheme="handleSchemeChange"
            class="p-1 bg-noir-800/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl"
          />
        </Motion>

        <Motion
          :initial="{ opacity: 0, x: 20 }"
          :animate="{ opacity: 1, x: 0 }"
          class="w-full md:w-80"
        >
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-slate-light" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              class="block w-full pl-12 pr-4 py-3.5 bg-noir-800 border border-white/10 rounded-2xl text-white placeholder-slate-light focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all text-sm shadow-inner"
              placeholder="Search subjects..."
            />
          </div>
        </Motion>
      </div>

      <div class="space-y-6">
        <!-- Will be updated soon (2019 Scheme Placeholder) -->
        <div v-if="semesters.length === 0" class="glass-card rounded-3xl p-16 text-center border border-white/10 shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent/50 to-transparent" />
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6 text-slate-light">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-2xl font-display font-bold text-white mb-3">Will be updated soon</h3>
          <p class="text-slate-light text-sm max-w-sm mx-auto leading-relaxed">
            Study materials and notes for the 2019 Scheme are currently being prepared and will be uploaded soon.
          </p>
        </div>

        <!-- No results found (Search Empty state) -->
        <div v-else-if="filteredSemesters.length === 0" class="glass-card rounded-3xl p-16 text-center border border-white/10 shadow-2xl relative overflow-hidden">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6 text-slate-light">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-dasharray="none" stroke-width="1.5">
              <circle cx="11" cy="11" r="8" stroke="currentColor"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor"></line>
            </svg>
          </div>
          <h3 class="text-2xl font-display font-bold text-white mb-3">No results found</h3>
          <p class="text-slate-light text-sm max-w-sm mx-auto leading-relaxed">
            We couldn't find any notes matching "{{ searchQuery }}". Try checking your spelling or search term.
          </p>
        </div>

        <!-- Semesters List -->
        <div
          v-else
          v-for="(sem, semIdx) in filteredSemesters"
          :key="`${activeScheme}-${sem.semester}`"
          class="glass-card rounded-3xl overflow-hidden border transition-all duration-300 relative"
          :class="(expandedSemester === sem.semester || isSearching) ? 'border-accent/40 bg-noir-850/80 shadow-[0_10px_35px_rgba(59,130,246,0.05)]' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.01]'"
        >
          <!-- Left accent glow bar -->
          <div 
            class="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
            :class="(expandedSemester === sem.semester || isSearching) ? 'bg-accent shadow-[0_0_15px_#3b82f6]' : 'bg-transparent'"
          />

          <Motion
            :initial="{ opacity: 0, y: 15 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: semIdx * 0.05 }"
          >
            <button
              @click="toggleExpand(sem.semester)"
              class="w-full px-8 py-6 flex items-center justify-between text-left transition-colors"
              :class="{ 'bg-white/[0.02]': (expandedSemester === sem.semester || isSearching) }"
            >
              <div class="flex items-center gap-4">
                <div 
                  class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  :class="(expandedSemester === sem.semester || isSearching) ? 'bg-accent/20 text-accent' : 'bg-white/5 text-slate-light'"
                >
                  <FileText class="w-5 h-5" />
                </div>
                <div>
                  <h2 class="text-xl md:text-2xl font-display font-bold text-white transition-colors" :class="{ 'text-accent': (expandedSemester === sem.semester || isSearching) }">
                    {{ sem.semester }}
                  </h2>
                  <span class="text-xs text-slate-light font-medium">{{ activeScheme }} Scheme</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-slate-light border border-white/10">
                  {{ sem.subjects.length }} Subject{{ sem.subjects.length > 1 ? 's' : '' }}
                </span>
                <Motion
                  :animate="{ rotate: (expandedSemester === sem.semester || isSearching) ? 180 : 0 }"
                  :transition="{ duration: 0.3 }"
                >
                  <ChevronDown class="text-slate-light w-5 h-5" />
                </Motion>
              </div>
            </button>

            <AnimatePresence mode="wait">
              <Motion
                v-if="expandedSemester === sem.semester || isSearching"
                :initial="{ height: 0, opacity: 0 }"
                :animate="{ height: 'auto', opacity: 1 }"
                :exit="{ height: 0, opacity: 0 }"
                :transition="{ duration: 0.3, easing: [0.22, 1, 0.36, 1] }"
                class="overflow-hidden"
              >
                <div class="px-8 pb-8 pt-4 border-t border-white/5 bg-white/[0.005]">
                  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    <div
                      v-for="(subject, subIdx) in sem.subjects"
                      :key="subIdx"
                      @click="openNoteLink(subject.link)"
                      class="bg-white/5 p-6 rounded-2xl group hover:bg-accent/15 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] border border-transparent hover:border-accent/20 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[150px]"
                    >
                      <div>
                        <div class="flex items-center justify-between mb-3">
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-white/5 text-slate-light border border-white/10 group-hover:bg-accent/20 group-hover:text-accent group-hover:border-accent/30 transition-colors">
                            Resource folder
                          </span>
                        </div>
                        <h3 class="text-lg font-display font-bold text-white group-hover:text-accent transition-colors leading-snug">
                          {{ subject.name }}
                        </h3>
                      </div>
                      <div class="flex items-center justify-between text-xs mt-6 pt-4 border-t border-white/5">
                        <span class="text-slate-light/60 group-hover:text-slate-light transition-colors">Open Google Drive</span>
                        <span class="flex items-center gap-1.5 text-accent font-semibold">
                          Access <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Motion>
            </AnimatePresence>
          </Motion>
        </div>
      </div>
    </div>
  </div>
</template>
