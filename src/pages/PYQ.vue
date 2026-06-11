<script setup lang="ts">
import { ref, computed } from 'vue'
import { Motion, Presence as AnimatePresence } from '@motionone/vue'
import { History, Search, Download, ChevronDown } from 'lucide-vue-next'
import pyqData from '../data/pyq.json'

const searchQuery = ref('')
const expandedSemester = ref<string | null>(null)

const isSearching = computed(() => searchQuery.value.length > 0)

const filteredSemesters = computed(() => {
  return pyqData.semesters.map(semGroup => {
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
</script>

<template>
  <div class="pt-32 pb-20 min-h-screen bg-noir-900 relative overflow-hidden">
    <!-- Background Grid & Glows -->
    <div class="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
    <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
    <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

    <div class="container mx-auto px-6 relative z-10">
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        class="max-w-3xl mx-auto text-center mb-12"
      >
        <span class="px-4 py-1.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 tracking-wider uppercase mb-6 inline-block">
          Exam Archive
        </span>
        <h1 class="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight text-white">
          Previous Year Questions
        </h1>
        <p class="text-lg text-slate-light mb-8 max-w-xl mx-auto">
          Access the verified archive of past semester examination papers to boost your academic preparation.
        </p>

        <!-- Search Bar -->
        <div class="relative max-w-xl mx-auto">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-slate-light" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-12 pr-4 py-4 bg-noir-800 border border-white/10 rounded-2xl text-white placeholder-slate-light focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all shadow-inner text-sm"
            placeholder="Search by subject name..."
          />
        </div>
      </Motion>

      <div class="max-w-4xl mx-auto space-y-4">
        <!-- No results found (Search Empty state) -->
        <div v-if="filteredSemesters.length === 0" class="glass-card rounded-3xl p-16 text-center border border-white/10 shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent/50 to-transparent" />
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6 text-slate-light">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-dasharray="none" stroke-width="1.5">
              <circle cx="11" cy="11" r="8" stroke="currentColor"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor"></line>
            </svg>
          </div>
          <h3 class="text-2xl font-display font-bold text-white mb-3">No results found</h3>
          <p class="text-slate-light text-sm max-w-sm mx-auto leading-relaxed">
            We couldn't find any question papers matching "{{ searchQuery }}". Try checking your spelling or search term.
          </p>
        </div>

        <!-- Semesters List -->
        <div
          v-else
          v-for="(semGroup, index) in filteredSemesters"
          :key="semGroup.semester"
          class="glass-card rounded-2xl overflow-hidden border transition-all duration-300 relative"
          :class="isExpanded(semGroup.semester) ? 'border-accent/40 bg-noir-850/80 shadow-[0_10px_35px_rgba(59,130,246,0.05)]' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.01]'"
        >
          <!-- Left accent glow bar -->
          <div 
            class="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
            :class="isExpanded(semGroup.semester) ? 'bg-accent shadow-[0_0_15px_#3b82f6]' : 'bg-transparent'"
          />

          <Motion
            :initial="{ opacity: 0, y: 15 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: index * 0.05 }"
          >
            <button
              @click="toggleExpand(semGroup.semester)"
              class="w-full px-6 py-5 flex items-center justify-between text-left transition-colors"
              :class="{ 'bg-white/[0.02]': isExpanded(semGroup.semester) }"
            >
              <div class="flex items-center gap-4">
                <div 
                  class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  :class="isExpanded(semGroup.semester) ? 'bg-accent/20 text-accent' : 'bg-white/5 text-slate-light'"
                >
                  <History class="w-5 h-5" />
                </div>
                <div>
                  <h2 class="text-xl font-display font-bold text-white transition-colors" :class="{ 'text-accent': isExpanded(semGroup.semester) }">
                    Semester {{ semGroup.semester }}
                  </h2>
                  <span class="text-xs text-slate-light font-medium">Question Banks</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-slate-light border border-white/10">
                  {{ semGroup.subjects.length }} Subject{{ semGroup.subjects.length > 1 ? 's' : '' }}
                </span>
                <Motion
                  :animate="{ rotate: isExpanded(semGroup.semester) ? 180 : 0 }"
                  :transition="{ duration: 0.3 }"
                >
                  <ChevronDown class="text-slate-light w-5 h-5" />
                </Motion>
              </div>
            </button>

            <AnimatePresence mode="wait">
              <Motion
                v-if="isExpanded(semGroup.semester)"
                :initial="{ height: 0, opacity: 0 }"
                :animate="{ height: 'auto', opacity: 1 }"
                :exit="{ height: 0, opacity: 0 }"
                :transition="{ duration: 0.3, easing: [0.22, 1, 0.36, 1] }"
                class="overflow-hidden"
              >
                <div class="px-6 pb-6 pt-4 border-t border-white/5 bg-white/[0.005]">
                  <div class="grid sm:grid-cols-2 gap-4 mt-2">
                    <div
                      v-for="(sub, i) in semGroup.subjects"
                      :key="i"
                      @click="openPyqLink(sub.link)"
                      class="bg-white/5 p-5 rounded-xl flex items-center justify-between group hover:bg-accent/10 hover:-translate-y-[2px] border border-transparent hover:border-accent/20 transition-all duration-300 cursor-pointer"
                    >
                      <div class="flex flex-col gap-1 pr-4">
                        <span class="font-display font-bold text-white group-hover:text-accent transition-colors leading-snug">
                          {{ sub.name }}
                        </span>
                        <span class="text-[10px] text-slate-light/60">Previous Year Papers</span>
                      </div>
                      <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300 flex-shrink-0">
                        <Download class="w-4 h-4" />
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
