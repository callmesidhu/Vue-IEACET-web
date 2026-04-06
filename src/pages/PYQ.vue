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
</script>

<template>
  <div class="pt-32 pb-20 min-h-screen bg-noir-900 relative">
    <div class="container mx-auto px-6 relative z-10">
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        class="max-w-3xl mx-auto text-center mb-12"
      >
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6">
          <History class="w-8 h-8 text-accent" />
        </div>
        <h1 class="text-4xl md:text-6xl font-display font-bold mb-6">
          Previous Year Questions
        </h1>
        <p class="text-lg text-slate-light mb-8">
          Access the archive of past examination papers to boost your preparation.
        </p>

        <!-- Search Bar -->
        <div class="relative max-w-xl mx-auto">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-slate-light" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-12 pr-4 py-4 bg-noir-800 border border-white/10 rounded-2xl text-white placeholder-slate-light focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all"
            placeholder="Search by subject name..."
          />
        </div>
      </Motion>

      <div class="max-w-4xl mx-auto space-y-4">
        <div
          v-for="(semGroup, index) in filteredSemesters"
          :key="semGroup.semester"
          class="glass-card rounded-2xl overflow-hidden border border-white/5"
        >
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: index * 0.1 }"
          >
            <button
              @click="toggleExpand(semGroup.semester)"
              class="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
            >
              <h2 class="text-xl font-display font-bold text-white uppercase tracking-wider">
                {{ semGroup.semester }}
              </h2>
              <Motion
                :animate="{ rotate: isExpanded(semGroup.semester) ? 180 : 0 }"
                :transition="{ duration: 0.3 }"
              >
                <ChevronDown class="text-slate-light" />
              </Motion>
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
                <div class="px-6 pb-6 pt-2 border-t border-white/5">
                  <div class="grid sm:grid-cols-2 gap-4 mt-4">
                    <Motion
                      v-for="(sub, i) in semGroup.subjects"
                      :key="i"
                      as="a"
                      :href="sub.link"
                      target="_blank"
                      rel="noopener noreferrer"
                      :while-hover="{ scale: 1.02 }"
                      :initial="{ opacity: 0, y: 8 }"
                      :animate="{ opacity: 1, y: 0 }"
                      :exit="{ opacity: 0, y: 6 }"
                      :transition="{ delay: i * 0.04, duration: 0.2 }"
                      class="bg-white/5 p-5 rounded-xl flex items-center justify-between group hover:border-accent/30 transition-colors cursor-pointer"
                    >
                      <span class="font-medium text-slate-light group-hover:text-white transition-colors">
                        {{ sub.name }}
                      </span>
                      <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                        <Download class="w-4 h-4" />
                      </div>
                    </Motion>
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
