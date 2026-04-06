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
  <div class="pt-32 pb-20 min-h-screen bg-noir-900 relative">
    <!-- Background Grid -->
    <div class="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

    <div class="container mx-auto px-6 relative z-10">
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        class="max-w-3xl mx-auto text-center mb-16"
      >
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6">
          <BookOpen class="w-8 h-8 text-accent" />
        </div>
        <h1 class="text-4xl md:text-6xl font-display font-bold mb-6">
          Curriculum
        </h1>
        <p class="text-lg text-slate-light mb-10">
          Comprehensive syllabus breakdown for B.Tech Industrial Engineering.
        </p>

        <SchemeSelector
          v-model:activeScheme="activeScheme"
          class="mb-8"
        />
      </Motion>

      <div class="max-w-3xl mx-auto space-y-4">
        <AnimatePresence mode="wait">
          <Motion
            :key="activeScheme"
            :initial="{ opacity: 0, x: 20 }"
            :animate="{ opacity: 1, x: 0 }"
            :exit="{ opacity: 0, x: -20 }"
            :transition="{ duration: 0.3 }"
            class="space-y-4"
          >
            <div
              v-for="sem in semesters"
              :key="`${activeScheme}-${sem.id}`"
              class="glass-card rounded-2xl overflow-hidden border border-white/10"
            >
              <button
                @click="toggleExpand(sem.id)"
                class="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
              >
                <h3 class="text-xl font-display font-semibold text-white">
                  {{ sem.title }}
                </h3>
                <Motion
                  :animate="{ rotate: expandedId === sem.id ? 180 : 0 }"
                  :transition="{ duration: 0.3 }"
                >
                  <ChevronDown class="text-slate-light" />
                </Motion>
              </button>

              <AnimatePresence>
                <Motion
                  v-if="expandedId === sem.id"
                  :initial="{ height: 0, opacity: 0 }"
                  :animate="{ height: 'auto', opacity: 1 }"
                  :exit="{ height: 0, opacity: 0 }"
                  :transition="{ duration: 0.3, easing: [0.22, 1, 0.36, 1] }"
                  class="overflow-hidden"
                >
                  <div class="px-6 pb-6 pt-2 border-t border-white/5">
                    <ul class="space-y-3">
                      <Motion
                        v-for="(subject, i) in sem.subjects"
                        :key="i"
                        :initial="{ opacity: 0, x: -10 }"
                        :animate="{ opacity: 1, x: 0 }"
                        :exit="{ opacity: 0, x: -6 }"
                        :transition="{ delay: i * 0.04, duration: 0.2 }"
                        as="li"
                        class="flex items-start gap-3"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <a
                          :href="subject.link"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-slate-light hover:text-accent transition-colors"
                        >
                          {{ subject.name }}
                        </a>
                      </Motion>
                    </ul>
                  </div>
                </Motion>
              </AnimatePresence>
            </div>
          </Motion>
        </AnimatePresence>
      </div>
    </div>
  </div>
</template>
