<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { LoginSchema } from '@ticketbasics/zod-schemas';
import { toTypedSchema } from '@vee-validate/zod';
import { ErrorMessage, useForm } from 'vee-validate';
import { toast } from 'vue-sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
import { cn } from '@/lib/utils';
import { useLogin } from '@/queries/auth.query';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { mutate: login } = useLogin();

const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: toTypedSchema(LoginSchema),
});

const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit((values) => {
  login({
    username: values.username,
    password: values.password,
  }, {
    onSuccess: () => {
      resetForm();
      toast.success('Login successful!');
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || 'Failed to create!';
      toast.error(message);
    },
  });
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onSubmit">
          <div class="mb-5">
            <Label for="username" class="mb-2 flex justify-between">
              <div>Username *</div>

              <div class="text-red-500">
                <ErrorMessage name="username" />
              </div>
            </Label>

            <Input id="username" v-model="username" :class="{ 'border-red-500': errors.username }" v-bind="usernameAttrs" required />
          </div>

          <div class="mb-5">
            <Label for="password" class="mb-2 flex justify-between">
              <div>Pasword *</div>

              <div class="text-red-500">
                <ErrorMessage name="password" />
              </div>
            </Label>

            <Input id="password" v-model="password" type="password" :class="{ 'border-red-500': errors.password }" v-bind="passwordAttrs" required />
          </div>

          <div class="mt-5">
            <Button type="submit">
              Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
