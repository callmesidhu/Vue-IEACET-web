<script setup lang="ts">
import { ref } from 'vue'
import { Motion } from '@motionone/vue'
import { Lock } from 'lucide-vue-next'

const selectedModel = ref('fast')
const isDropdownOpen = ref(false)
const apiBaseUrl = 'https://iea.llm.xyphx.com/'

// Referenced to avoid TS6133 unused variable error before future integration
if (import.meta.env.DEV) {
  console.log('IEAGPT API base URL initialized:', apiBaseUrl)
}

const selectModel = (model: string) => {
  selectedModel.value = model
  isDropdownOpen.value = false
}
</script>

<template>
  <div class="pt-24 pb-6 h-screen max-h-screen bg-zinc-950 text-zinc-50 relative overflow-hidden flex flex-col">
    <!-- Dynamic background effect -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1f2937_0%,transparent_70%)] opacity-40 pointer-events-none" />
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15] pointer-events-none" />

    <div class="container mx-auto px-4 sm:px-6 relative z-10 flex-grow flex flex-col items-center">
      
      <!-- Header -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5 }"
        class="text-center mb-6 mt-0"
      >
        <h1 class="text-3xl md:text-4xl font-sans font-bold mb-3 tracking-tight text-white flex items-center justify-center gap-2 drop-shadow-xl">
          IEAGPT
        </h1>
        <p class="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed px-4">
          Your intelligent companion for navigating the IEACET curriculum, exploring past year questions, and synthesizing study materials. Powered by specialized XyphX models.
        </p>
      </Motion>

      <!-- Chat Mockup Window -->
      <Motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.6, delay: 0.1 }"
        class="w-full max-w-4xl relative rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl shadow-2xl overflow-hidden mb-0 flex flex-col flex-grow min-h-0"
      >
        <!-- Mockup Header -->
        <div class="border-b border-zinc-800/60 bg-zinc-950/80 p-4 flex items-center justify-between z-10">
          <div class="flex items-center gap-4 w-full">
            <div class="flex gap-2 hidden sm:flex">
              <div class="w-3 h-3 rounded-full bg-red-500/80" />
              <div class="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div class="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
          </div>
        </div>

        <!-- Mockup Body -->
        <div class="p-6 md:p-8 flex flex-col items-center justify-center bg-zinc-950/30 overflow-y-auto flex-grow">
          <Motion 
            :initial="{ opacity: 0, scale: 0.9 }"
            :animate="{ opacity: 1, scale: 1 }"
            :transition="{ duration: 0.5, delay: 0.3 }"
            class="text-center"
          >
            <Lock class="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h2 class="text-xl font-display font-semibold text-zinc-300 mb-2 tracking-wide">IEAGPT is Coming Soon</h2>
            <p class="text-sm text-zinc-500 max-w-xs mx-auto">We are fine-tuning our specialized XyphX-edu models to bring you the best academic assistant.</p>
          </Motion>
        </div>
        
        <!-- Mockup Input Area (matching screenshot) -->
        <div class="p-3.5 sm:p-5 border-t border-zinc-800 bg-zinc-950/90 z-10">
          <div class="relative flex items-center max-w-4xl mx-auto bg-[#212121] rounded-[24px] px-3 py-2 border border-zinc-800/80 shadow-md">
            <!-- Plus Button -->
            <button class="w-8 h-8 rounded-full bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 flex items-center justify-center transition-colors flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            <!-- Text Input -->
            <input 
              type="text" 
              placeholder="Write a message..." 
              class="flex-grow bg-transparent text-zinc-200 placeholder-zinc-500 text-sm px-2 sm:px-3 focus:outline-none min-w-0"
            />
            
            <!-- Model Selector Dropdown -->
            <div class="relative flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <div 
                @click="isDropdownOpen = !isDropdownOpen"
                class="flex items-center justify-between gap-1.5 sm:gap-2 bg-[#2f2f2f] hover:bg-[#3f3f3f] transition-colors cursor-pointer rounded-full px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs text-zinc-300 font-medium border border-zinc-700/50 whitespace-nowrap flex-shrink-0 min-w-[110px] sm:min-w-[150px]"
              >
                <span v-if="selectedModel === 'fast'">XyphX 1.0 Fast</span>
                <span v-else>XyphX 1.0 Thinking</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transition-transform duration-200 flex-shrink-0" :class="{ 'rotate-180': isDropdownOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-2 scale-95"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 translate-y-2 scale-95"
              >
                <div v-if="isDropdownOpen" class="absolute bottom-full right-0 sm:right-10 mb-2 w-56 sm:w-64 bg-[#212121] border border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden z-50 py-2">
                  <div class="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Select Model</div>
                  <div class="flex flex-col">
                    <button 
                      @click="selectModel('fast')"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors"
                      :class="selectedModel === 'fast' ? 'bg-[#3f3f3f] text-white' : 'text-zinc-300 hover:bg-[#2f2f2f] hover:text-white'"
                    >
                      XyphX 1.0 Fast
                    </button>
                    <button 
                      @click="selectModel('thinking')"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors"
                      :class="selectedModel === 'thinking' ? 'bg-[#3f3f3f] text-white' : 'text-zinc-300 hover:bg-[#2f2f2f] hover:text-white'"
                    >
                      XyphX 1.0 Thinking
                    </button>
                  </div>
                </div>
              </transition>
              
              <!-- Send Button -->
              <button class="w-8 h-8 rounded-full bg-[#2f2f2f] hover:bg-[#3f3f3f] text-zinc-300 flex items-center justify-center transition-colors ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
          <div class="text-center mt-3 opacity-40">
            <span class="text-[10px] text-zinc-500 font-sans uppercase tracking-widest">XYPHX AI IS AN EXPERIMENTAL MODEL. PLEASE DOUBLE-CHECK RESPONSES.</span>
          </div>
        </div>
      </Motion>
    </div>
  </div>
</template>
