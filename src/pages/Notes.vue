<script setup lang="ts">
import { ref, computed } from 'vue'
import { Motion, Presence as AnimatePresence } from '@motionone/vue'
import { FileText, Download, ChevronDown } from 'lucide-vue-next'
import SchemeSelector from '../components/SchemeSelector.vue'
import notesData from '../data/notes.json'

type Scheme = '2024' | '2019'

const activeScheme = ref<Scheme>('2024')
const expandedSemester = ref<string | null>(null)

const currentSchemeData = computed(() => 
  notesData.notes.find(s => s.scheme === activeScheme.value)
)
const semesters = computed(() => currentSchemeData.value ? currentSchemeData.value.semesters : [])

const toggleExpand = (semester: string) => {
  expandedSemester.value = expandedSemester.value === semester ? null : semester
}

const handleSchemeChange = (scheme: Scheme) => {
  activeScheme.value = scheme
  expandedSemester.value = null
}
</script>

<template>
  <div class="pt-32 pb-20 min-h-screen bg-noir-900 relative">
    <div class="absolute top-0 right-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

    <div class="container mx-auto px-6 relative z-10">
      <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <Motion
          :initial="{ opacity: 0, x: -20 }"
          :animate="{ opacity: 1, x: 0 }"
        >
          <h1 class="text-4xl md:text-6xl font-display font-bold mb-4">
            Study Notes
          </h1>
          <p class="text-lg text-slate-light mb-8">
            Curated materials for your coursework.
          </p>
          
          <SchemeSelector
            :activeScheme="activeScheme"
            @update:activeScheme="handleSchemeChange"
          />
        </Motion>
      </div>

      <div class="space-y-6">
        <div
          v-for="(sem, semIdx) in semesters"
          :key="`${activeScheme}-${sem.semester}`"
          class="glass-card rounded-3xl overflow-hidden border border-white/5"
        >
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: semIdx * 0.1 }"
          >
            <button
              @click="toggleExpand(sem.semester)"
              class="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <FileText class="w-5 h-5 text-accent" />
                </div>
                <h2 class="text-2xl font-display font-bold text-white">
                  {{ sem.semester }}
                </h2>
              </div>
              <Motion
                :animate="{ rotate: expandedSemester === sem.semester ? 180 : 0 }"
                :transition="{ duration: 0.3 }"
              >
                <ChevronDown class="text-slate-light" />
              </Motion>
            </button>

            <AnimatePresence mode="wait">
              <Motion
                v-if="expandedSemester === sem.semester"
                :initial="{ height: 0, opacity: 0 }"
                :animate="{ height: 'auto', opacity: 1 }"
                :exit="{ height: 0, opacity: 0 }"
                :transition="{ duration: 0.3, easing: [0.22, 1, 0.36, 1] }"
                class="overflow-hidden"
              >
                <div class="px-8 pb-8 pt-2 border-t border-white/5">
                  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <Motion
                      v-for="(subject, subIdx) in sem.subjects"
                      :key="subIdx"
                      as="a"
                      :href="subject.link"
                      target="_blank"
                      rel="noopener noreferrer"
                      :initial="{ opacity: 0, scale: 0.95 }"
                      :animate="{ opacity: 1, scale: 1 }"
                      :exit="{ opacity: 0, scale: 0.98 }"
                      :transition="{ delay: subIdx * 0.04, duration: 0.2 }"
                      class="bg-white/5 p-6 rounded-2xl group hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-all"
                    >
                      <h3 class="text-xl font-display font-semibold mb-4 text-white group-hover:text-accent transition-colors">
                        {{ subject.name }}
                      </h3>
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-light">Study Material</span>
                        <span class="flex items-center gap-1 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                          View <Download class="w-4 h-4" />
                        </span>
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
