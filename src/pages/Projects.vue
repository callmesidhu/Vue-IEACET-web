<script setup lang="ts">
import { Motion } from '@motionone/vue'
import { Lightbulb, ExternalLink, Github } from 'lucide-vue-next'

const projects = [
  {
    id: 1,
    title: 'Supply Chain Optimizer',
    category: 'Data Analysis',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&q=80&w=800',
    desc: 'Machine learning model to predict and optimize inventory levels across multiple warehouses.'
  },
  {
    id: 2,
    title: 'Automated Sorting Arm',
    category: 'Mechanical Systems',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    desc: 'Robotic arm prototype with computer vision for automated defect detection and sorting.'
  },
  {
    id: 3,
    title: 'Ergonomic Workstation',
    category: 'Industrial Design',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    desc: 'Redesigned assembly line workstation to minimize worker fatigue and increase throughput.'
  },
  {
    id: 4,
    title: 'Predictive Maintenance Dashboard',
    category: 'Data Analysis',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    desc: 'IoT-based dashboard monitoring machine health to predict failures before they occur.'
  }
]
</script>

<template>
  <div class="pt-32 pb-20 min-h-screen bg-noir-900 relative">
    <div class="container mx-auto px-6 relative z-10">
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        class="mb-16"
      >
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6">
          <Lightbulb class="w-8 h-8 text-accent" />
        </div>
        <h1 class="text-4xl md:text-6xl font-display font-bold mb-4">
          Student Projects
        </h1>
        <p class="text-lg text-slate-light max-w-2xl">
          Showcasing innovative solutions built by our students, bridging the
          gap between theoretical knowledge and practical application.
        </p>
      </Motion>

      <div class="grid md:grid-cols-2 gap-8">
        <Motion
          v-for="(project, index) in projects"
          :key="project.id"
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: index * 0.1, duration: 0.5 }"
          class="group relative rounded-3xl overflow-hidden glass-card border border-white/10"
        >
          <!-- Image Container -->
          <div class="relative h-64 overflow-hidden">
            <div class="absolute inset-0 bg-noir-900/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div class="absolute top-4 left-4 z-20">
              <span class="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-medium border border-white/10">
                {{ project.category }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-8 relative z-20 bg-gradient-to-t from-noir-900 via-noir-900 to-transparent -mt-12">
            <h3 class="text-2xl font-display font-bold mb-3 group-hover:text-accent transition-colors">
              {{ project.title }}
            </h3>
            <p class="text-slate-light mb-6 line-clamp-2">
              {{ project.desc }}
            </p>

            <div class="flex gap-4">
              <button class="flex items-center gap-2 text-sm font-medium text-white hover:text-accent transition-colors">
                <ExternalLink class="w-4 h-4" /> View Demo
              </button>
              <button class="flex items-center gap-2 text-sm font-medium text-slate-light hover:text-white transition-colors">
                <Github class="w-4 h-4" /> Source
              </button>
            </div>
          </div>
        </Motion>
      </div>
    </div>
  </div>
</template>
