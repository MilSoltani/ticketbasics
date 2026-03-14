<script setup lang="ts">
import { Check, PlusCircle } from 'lucide-vue-next';
import { computed } from 'vue';

import Badge from '@/components/ui/badge/Badge.vue';
import Button from '@/components/ui/button/Button.vue';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Separator from '@/components/ui/separator/Separator.vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  title?: string;
  options: any[];
}>();

const modelValue = defineModel<string[]>({ default: [] });

const selectedSet = computed(() => new Set(modelValue.value));

function toggleOption(optionValue: string) {
  const newSet = new Set(selectedSet.value);
  if (newSet.has(optionValue)) {
    newSet.delete(optionValue);
  }
  else {
    newSet.add(optionValue);
  }
  modelValue.value = [...newSet];
}

function clearFilters() {
  modelValue.value = [];
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="sm" class="h-8 border-dashed justify-start">
        <PlusCircle class="mr-2 h-4 w-4" />
        {{ props.title }}

        <template v-if="selectedSet.size > 0">
          <Separator orientation="vertical" class="mx-2 h-4" />

          <Badge
            variant="secondary"
            class="rounded-sm px-1 font-normal lg:hidden"
          >
            {{ selectedSet.size }}
          </Badge>

          <div class="hidden space-x-1 lg:flex">
            <Badge
              v-if="selectedSet.size > 2"
              variant="secondary"
              class="rounded-sm px-1 font-normal"
            >
              {{ selectedSet.size }} selected
            </Badge>

            <template v-else>
              <Badge
                v-for="option in props.options.filter((opt) => selectedSet.has(opt))"
                :key="option"
                variant="secondary"
                class="rounded-sm px-1 font-normal"
              >
                {{ option }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-[200px] p-0" align="start">
      <Command>
        <CommandInput :placeholder="props.title" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in props.options"
              :key="option"
              :value="option"
              @select="() => toggleOption(option)"
            >
              <div
                :class="cn(
                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                  selectedSet.has(option)
                    ? 'bg-primary text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible',
                )"
              >
                <Check class="h-4 w-4" />
              </div>

              <span>{{ option }}</span>
            </CommandItem>
          </CommandGroup>

          <template v-if="selectedSet.size > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                value="clear-filters"
                class="justify-center text-center"
                @select="clearFilters"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
