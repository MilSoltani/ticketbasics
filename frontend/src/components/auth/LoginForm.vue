<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import Label from '../ui/label/Label.vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div>
            <div class="mb-5">
              <Label for="username" class="mb-2">
                Username
              </Label>
              <Input
                id="username"
                type="username"
                required
              />
            </div>

            <div class="mt-5">
              <Button type="submit">
                Login
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
