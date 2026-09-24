<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, String, Array],
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Tanlang'
  },
  labelKey: {
    type: String,
    default: 'name'
  },
  valueKey: {
    type: String,
    default: 'id'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: 'default' // 'category' yoki 'country' bo'lishi mumkin
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const search = ref('')
const wrapperRef = ref(null)

const toggleOptions = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    search.value = ''
  }
}

const handleClickOutside = (e) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const filteredOptions = computed(() => {
  if (!search.value) return props.options
  const s = search.value.toLowerCase()
  return props.options.filter(opt => opt[props.labelKey].toLowerCase().includes(s))
})

const displayValue = computed(() => {
  if (props.multiple) {
    if (!props.modelValue || !props.modelValue.length) return props.placeholder
    const count = props.modelValue.length
    return count === 1
      ? props.options.find(o => o[props.valueKey] === props.modelValue[0])?.[props.labelKey] || props.placeholder
      : `${count} ta tanlandi`
  } else {
    if (props.modelValue == null) return props.placeholder
    return props.options.find(o => o[props.valueKey] === props.modelValue)?.[props.labelKey] || props.placeholder
  }
})

const selectOption = (opt) => {
  const val = opt[props.valueKey]
  if (props.multiple) {
    let current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    if (current.includes(val)) {
      current = current.filter(v => v !== val)
    } else {
      current.push(val)
    }
    emit('update:modelValue', current)
    emit('change', current)
  } else {
    emit('update:modelValue', val === props.modelValue ? null : val)
    emit('change', val)
    isOpen.value = false
  }
}

const isSelected = (opt) => {
  const val = opt[props.valueKey]
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(val)
  }
  return props.modelValue === val
}
</script>

<template>
  <div class="relative w-full group" ref="wrapperRef">
    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggleOptions"
      class="w-full bg-slate-900/50 backdrop-blur-md border rounded-xl pl-12 pr-10 py-3 text-left text-white focus:outline-none transition-all shadow-lg flex items-center justify-between"
      :class="isOpen ? 'border-purple-500/60 bg-slate-800/80 shadow-purple-900/30' : 'border-white/10 hover:bg-slate-800/50 group-hover:border-white/20'"
    >
      <!-- LEFT ICON (Optional Contextual SVG) -->
      <span class="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" :class="isOpen ? 'text-purple-400' : 'text-white/40 group-hover:text-purple-400'">
        <slot name="icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </slot>
      </span>

      <span class="truncate block" :class="!modelValue ? 'text-white/70' : 'text-white'">
        {{ displayValue }}
      </span>

      <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200" :class="isOpen ? 'rotate-180 text-purple-400' : 'text-white/40'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </span>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-show="isOpen"
        class="absolute z-50 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
      >
        <!-- Search Input -->
        <div class="p-2 border-b border-white/5 relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M16.65 16.65a7 7 0 11-9.9-9.9 7 7 0 019.9 9.9z" />
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Qidirish..."
            class="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 placeholder-white/40"
            @click.stop
          />
        </div>

        <!-- Options List -->
        <div class="max-h-60 overflow-y-auto styled-scroll py-2">
          <!-- Barchasini tozalash optioni (Single select u-n) -->
          <div
            v-if="!multiple && modelValue != null && !search"
            @click="selectOption({ [valueKey]: null })"
            class="px-4 py-2 text-sm text-white/50 hover:bg-slate-700/50 cursor-pointer flex items-center justify-between transition"
          >
            Barchasi
          </div>
          
          <div
            v-for="opt in filteredOptions"
            :key="opt[valueKey]"
            @click="selectOption(opt)"
            class="px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors duration-150"
            :class="isSelected(opt) ? 'bg-purple-600/20 text-purple-300' : 'text-white/80 hover:bg-slate-700/50 hover:text-white'"
          >
            <span>{{ opt[labelKey] }}</span>
            <div v-if="isSelected(opt)" class="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div v-if="!filteredOptions.length" class="px-4 py-4 text-center text-xs text-white/40">
            Hech narsa topilmadi
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.styled-scroll::-webkit-scrollbar {
  width: 6px;
}
.styled-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.styled-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
.styled-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
