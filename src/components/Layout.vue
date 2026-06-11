<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Motion } from '@motionone/vue'
import { Menu, X, ExternalLink } from 'lucide-vue-next'
import logoSrc from '../logo.jpg'

const route = useRoute()
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Syllabus', path: '/syllabus' },
  { name: 'Notes', path: '/notes' },
  { name: 'PYQ', path: '/pyq' },
  {
    name: 'Projects',
    path: 'https://github.com/orgs/IEACET/repositories',
    isExternal: true
  }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(() => route.path, () => {
  mobileMenuOpen.value = false
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="min-h-screen flex flex-col relative">
    <!-- Navbar -->
    <header
      :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'glass py-4' : 'bg-transparent py-6'
      ]"
    >
      <div class="container mx-auto px-6 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-3 group">
          <Motion
            :while-hover="{ scale: 1.05 }"
            :transition="{ duration: 0.2 }"
            class="w-9 h-9 rounded-lg overflow-hidden border border-white/20 flex-shrink-0"
          >
            <img :src="logoSrc" alt="IEA CET Logo" class="w-full h-full object-cover" />
          </Motion>
          <span class="font-display font-bold text-xl tracking-wider group-hover:text-accent transition-colors">
            IEA
            <span class="text-slate-light font-sans text-sm ml-2 font-normal hidden sm:inline-block">
              CET
            </span>
          </span>
        </router-link>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-6">
          <template v-for="link in navLinks" :key="link.name">
            <a
              v-if="link.isExternal"
              :href="link.path"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm font-medium transition-colors hover:text-accent text-slate-light"
            >
              {{ link.name }}
            </a>
            <router-link
              v-else
              :to="link.path"
              :class="[
                'text-sm font-medium transition-colors hover:text-accent relative',
                route.path === link.path ? 'text-accent' : 'text-slate-light'
              ]"
            >
              {{ link.name }}
              <Motion
                v-if="route.path === link.path"
                layoutId="nav-indicator"
                class="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent rounded-full"
                :initial="false"
                :transition="{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }"
              />
            </router-link>
          </template>

          <a
            href="https://nexera.cet.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/40 text-accent text-sm font-semibold hover:bg-accent hover:text-black transition-all duration-300"
          >
            Nexera
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
        </nav>

        <!-- Mobile Menu Toggle -->
        <button
          class="md:hidden text-white p-2"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <X v-if="mobileMenuOpen" />
          <Menu v-else />
        </button>
      </div>
    </header>

    <!-- Mobile Nav Overlay -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-40 glass pt-24 px-6 md:hidden"
      >
        <div class="flex flex-col gap-6 text-center">
          <template v-for="link in navLinks" :key="link.name">
            <a
              v-if="link.isExternal"
              :href="link.path"
              target="_blank"
              rel="noopener noreferrer"
              class="text-2xl font-display text-white hover:text-accent"
            >
              {{ link.name }}
            </a>
            <router-link
              v-else
              :to="link.path"
              :class="[
                'text-2xl font-display',
                route.path === link.path ? 'text-accent' : 'text-white'
              ]"
            >
              {{ link.name }}
            </router-link>
          </template>
          <a
            href="https://nexera.cet.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            class="text-2xl font-display text-accent flex items-center justify-center gap-2"
          >
            Nexera <ExternalLink class="w-5 h-5" />
          </a>
        </div>
      </div>
    </transition>

    <!-- Main Content -->
    <main class="flex-grow relative z-10">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/10 bg-noir-900 py-4 relative z-10">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg overflow-hidden border border-white/20 flex-shrink-0">
              <img :src="logoSrc" alt="IEA CET Logo" class="w-full h-full object-cover" />
            </div>
            <span class="font-display font-bold">IEA CET</span>
          </div>

          <p class="text-slate-light text-sm text-center md:text-left">
            © {{ new Date().getFullYear() }} Industrial Engineering Association.
            College of Engineering Trivandrum.
          </p>

          <!-- Social links -->
          <div class="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/company/iea-cet/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              class="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[#0A66C2]/30 hover:border-[#0A66C2]/60 border border-white/10 transition-all duration-300 group"
            >
              <svg class="w-4 h-4 text-slate-light group-hover:text-[#0A66C2] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://github.com/IEACET"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              class="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 border border-white/10 transition-all duration-300 group"
            >
              <svg class="w-4 h-4 text-slate-light group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/iea_cet/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              class="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-gradient-to-br hover:from-[#f09433]/30 hover:to-[#bc1888]/30 border border-white/10 transition-all duration-300 group"
            >
              <svg class="w-4 h-4 text-slate-light group-hover:text-pink-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
