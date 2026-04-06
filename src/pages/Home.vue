<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Motion } from '@motionone/vue'
import {
  ArrowRight,
  BookOpen,
  FileText,
  History,
  Lightbulb,
  Settings,
  Briefcase,
  GraduationCap,
  ExternalLink,
  MessageCircle,
  Linkedin,
  Instagram
} from 'lucide-vue-next'
import ThreeBackground from '../components/ThreeBackground.vue'
import placementData from '../data/placements.json'
import scholarshipData from '../data/scholarships.json'

const scrollRef = ref<HTMLDivElement | null>(null)

// Auto-scroll placements horizontally
let animId: number
let paused = false
const speed = 0.6 // px per frame

const scroll = () => {
  const el = scrollRef.value
  if (!paused && el) {
    el.scrollLeft += speed
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
      el.scrollLeft = 0
    }
  }
  animId = requestAnimationFrame(scroll)
}

const pause = () => { paused = true }
const resume = () => { paused = false }

onMounted(() => {
  animId = requestAnimationFrame(scroll)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
})

const resources = [
  {
    title: 'Syllabus',
    icon: BookOpen,
    path: '/syllabus',
    desc: 'Complete curriculum breakdown'
  },
  {
    title: 'Notes',
    icon: FileText,
    path: '/notes',
    desc: 'Curated study materials'
  },
  {
    title: 'PYQ',
    icon: History,
    path: '/pyq',
    desc: 'Previous year question papers'
  },
  {
    title: 'Projects',
    icon: Lightbulb,
    path: 'https://github.com/orgs/IEACET/repositories',
    desc: 'Showcase of student innovation',
    isExternal: true
  }
]

const placements = placementData.placements
const scholarships = scholarshipData.scholarships
</script>

<template>
  <div class="w-full relative bg-transparent">
    <ThreeBackground />

    <!-- HERO SECTION -->
    <section class="min-h-screen flex flex-col items-center justify-center relative z-10 pt-20">
      <div class="container mx-auto px-6 text-center flex flex-col items-center">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 1 }"
          class="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md mb-10"
        >
          <Settings class="w-4 h-4 text-accent animate-[spin_4s_linear_infinite]" />
          <span class="text-xs font-medium text-slate-light tracking-[0.2em] uppercase">
            Industrial Engineering Association
          </span>
        </Motion>

        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 1, delay: 0.2 }"
          as="h1"
          class="text-6xl md:text-8xl lg:text-9xl font-display font-light mb-8 leading-none tracking-tighter text-white"
        >
          Engineering <br />
          <span class="font-bold text-accent">the Future.</span>
        </Motion>

        <Motion
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ duration: 1, delay: 0.4 }"
          as="p"
          class="text-lg md:text-2xl text-slate-light max-w-2xl font-light"
        >
          College of Engineering Trivandrum. Bridging the gap between
          mechanical systems and data-driven intelligence.
        </Motion>
      </div>
    </section>

    <!-- ABOUT SECTION -->
    <section class="py-32 relative z-10">
      <div class="container mx-auto px-6 max-w-5xl text-center md:text-left">
        <Motion
          :initial="{ opacity: 0, y: 40 }"
          :in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-100px' }"
          :transition="{ duration: 0.8 }"
          as="h2"
          class="text-4xl md:text-6xl font-display font-light mb-12 leading-tight text-white"
        >
          About the <span class="font-bold text-accent">Program</span>
        </Motion>
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-100px' }"
          :transition="{ duration: 0.8, delay: 0.2 }"
          as="p"
          class="text-lg md:text-2xl text-slate-light leading-relaxed font-light text-justify"
        >
          Industrial Engineering at the College of Engineering Thiruvananthapuram... 
          (Brief version for brevity, but I will include the full text in actual file)
          Industrial Engineering at the College of Engineering
          Thiruvananthapuram, the pioneering institution in Kerala
          Technological University, stands as the sole provider of this
          esteemed course, cementing its status as the first engineering
          college in Kerala. This program, a sub-branch of mechanical
          engineering, epitomizes modern industrial operations by integrating
          engineering principles with management techniques. It empowers
          students with a holistic grasp of manufacturing processes, supply
          chain management, operations research, and quality control,
          fostering analytical, problem-solving, and leadership skills crucial
          for success in today's competitive industrial landscape. Graduates
          emerge as sought-after professionals, capable of driving
          organizational excellence across diverse sectors, from manufacturing
          to healthcare and technology, positioning them as catalysts for
          impactful change.
        </Motion>
      </div>
    </section>

    <!-- RESOURCE HUB -->
    <section class="py-32 relative z-10">
      <div class="container mx-auto px-6 max-w-5xl">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true }"
          class="mb-16 md:mb-24 text-center md:text-left"
        >
          <h2 class="text-4xl md:text-6xl font-display font-bold text-white mb-4">
            Resource Hub
          </h2>
          <p class="text-xl text-slate-light font-light">
            Curated materials for your academic journey.
          </p>
        </Motion>

        <div class="flex flex-col">
          <Motion
            v-for="(resource, index) in resources"
            :key="resource.title"
            :initial="{ opacity: 0, x: -20 }"
            :in-view="{ opacity: 1, x: 0 }"
            :viewport="{ once: true }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
          >
            <template v-if="resource.isExternal">
              <a
                :href="resource.path"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-white/10 hover:border-accent transition-colors duration-500"
              >
                <div class="flex items-center gap-8 mb-4 md:mb-0">
                  <div class="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all duration-500">
                    <component :is="resource.icon" class="w-6 h-6 text-slate-light group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <h3 class="text-3xl font-display font-bold text-white mb-2 group-hover:text-accent transition-colors">
                      {{ resource.title }}
                    </h3>
                    <p class="text-slate-light font-light">{{ resource.desc }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-slate-light group-hover:text-accent transition-colors md:pl-8">
                  <span class="text-sm tracking-widest uppercase font-medium opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-4 group-hover:translate-x-0 duration-500">
                    Explore Github
                  </span>
                  <ArrowRight class="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-500" />
                </div>
              </a>
            </template>
            <template v-else>
              <router-link
                :to="resource.path"
                class="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-white/10 hover:border-accent transition-colors duration-500"
              >
                <div class="flex items-center gap-8 mb-4 md:mb-0">
                  <div class="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all duration-500">
                    <component :is="resource.icon" class="w-6 h-6 text-slate-light group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <h3 class="text-3xl font-display font-bold text-white mb-2 group-hover:text-accent transition-colors">
                      {{ resource.title }}
                    </h3>
                    <p class="text-slate-light font-light">{{ resource.desc }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-slate-light group-hover:text-accent transition-colors md:pl-8">
                  <span class="text-sm tracking-widest uppercase font-medium opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-4 group-hover:translate-x-0 duration-500">
                    Explore
                  </span>
                  <ArrowRight class="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-500" />
                </div>
              </router-link>
            </template>
          </Motion>
        </div>
      </div>
    </section>

    <!-- PLACEMENT INSIGHTS -->
    <section class="py-32 relative z-10">
      <div class="container mx-auto px-6 max-w-5xl">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true }"
          class="mb-16 flex items-center gap-4"
        >
          <Briefcase class="w-8 h-8 text-accent" />
          <h2 class="text-3xl md:text-5xl font-display font-bold text-white">
            Placement Insights
          </h2>
        </Motion>

        <div
          ref="scrollRef"
          class="flex gap-6 overflow-x-auto pb-4"
          style="scrollbar-width: none; -ms-overflow-style: none"
          @mouseenter="pause"
          @mouseleave="resume"
        >
          <div
            v-for="(item, index) in [...placements, ...placements]"
            :key="index"
            class="flex-shrink-0 w-56 p-8 border border-white/10 bg-black/20 backdrop-blur-sm hover:border-accent/50 transition-colors"
          >
            <h3 class="text-2xl font-display font-bold text-white mb-1">
              {{ item.company }}
            </h3>
            <div class="text-4xl font-display font-light text-slate-light">
              {{ item.count }}
            </div>
            <div class="text-xs text-slate-500 uppercase tracking-widest mt-2">
              Recruited
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCHOLARSHIPS -->
    <section class="py-32 relative z-10">
      <div class="container mx-auto px-6 max-w-5xl">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true }"
          class="mb-16 flex items-center gap-4"
        >
          <GraduationCap class="w-8 h-8 text-accent" />
          <h2 class="text-3xl md:text-5xl font-display font-bold text-white">
            Scholarships
          </h2>
        </Motion>

        <div
          class="overflow-y-auto pr-2"
          style="max-height: 420px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent"
        >
          <div class="space-y-4">
            <Motion
              v-for="(item, index) in scholarships"
              :key="index"
              as="a"
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
              :initial="{ opacity: 0, x: -20 }"
              :in-view="{ opacity: 1, x: 0 }"
              :viewport="{ once: true }"
              :transition="{ delay: index * 0.05 }"
              class="flex flex-col md:flex-row md:items-center justify-between p-6 border border-white/10 bg-black/20 backdrop-blur-sm hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <div class="md:w-1/3 mb-3 md:mb-0">
                <h3 class="text-lg font-display font-bold text-white group-hover:text-accent transition-colors flex items-center gap-2">
                  {{ item.title }}
                  <ExternalLink class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
              </div>
              <div class="md:w-2/3 md:pl-8 md:border-l border-white/10">
                <p class="text-slate-light font-light text-sm">{{ item.desc }}</p>
              </div>
            </Motion>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT SECTION -->
    <section class="py-40 relative z-10">
      <div class="container mx-auto px-6 max-w-6xl text-center">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true }"
          class="text-3xl md:text-5xl font-display font-bold text-white mb-20"
        >
          Get in Touch
        </Motion>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8">
          <Motion
            v-for="(contact, index) in [
              { name: 'Nandikesh', role: 'Student Representative' },
              { name: 'Noel Denny', role: 'Coordinator' },
              { name: 'Sidharth', role: 'Web Lead' }
            ]"
            :key="contact.name"
            :initial="{ opacity: 0, y: 20 }"
            :in-view="{ opacity: 1, y: 0 }"
            :viewport="{ once: true }"
            :transition="{ delay: index * 0.1 }"
            class="flex flex-col items-center"
          >
            <span class="text-xs text-slate-light uppercase tracking-[0.2em] mb-4">
              {{ contact.role }}
            </span>
            <h3 class="text-xl font-display text-white mb-6">
              {{ contact.name }}
            </h3>
            <div class="flex gap-4">
              <a href="#" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-all group">
                <MessageCircle class="w-5 h-5 text-slate-light group-hover:text-black" />
              </a>
              <a href="#" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-all group">
                <Linkedin class="w-5 h-5 text-slate-light group-hover:text-black" />
              </a>
              <a href="#" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-all group">
                <Instagram class="w-5 h-5 text-slate-light group-hover:text-black" />
              </a>
            </div>
          </Motion>
        </div>
      </div>
    </section>
  </div>
</template>
