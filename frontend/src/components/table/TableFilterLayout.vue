<script setup lang="ts">
import { FunnelPlus, X } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const props = withDefaults(defineProps<{
  size?: string;
}>(), {
  size: 'w-[600px]',
});

const emit = defineEmits<{
  (e: 'clear'): void;
}>();
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="sm">
        <FunnelPlus :size="16" /> Table Filters
      </Button>
    </PopoverTrigger>

    <PopoverContent align="start" :class="props.size">
      <div class="flex items-center justify-between mb-6">
        <div class="space-y-1">
          <h4 class="font-medium flex items-center gap-2">
            <FunnelPlus :size="16" /> Table Filters
          </h4>
          <p class="text-sm text-muted-foreground">
            Apply filters to the rows below:
          </p>
        </div>
        <Button variant="outline" size="sm" @click.prevent="emit('clear')">
          <X :size="18" /> Clear
        </Button>
      </div>

      <slot />
    </PopoverContent>
  </Popover>
</template>
