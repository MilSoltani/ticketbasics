<script setup lang="ts">
import { SignupSchema } from '@ticketbasics/zod-schemas';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
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
import { useSignup } from '@/queries/auth.query';

const { defineField, handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(SignupSchema),
});

const [firstName, firstNameAttrs] = defineField('firstName');
const [lastName, lastNameAttrs] = defineField('lastName');
const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');

const confirmedPassword = ref<string>();

const { mutate: signup } = useSignup();

const onSubmit = handleSubmit((values) => {
  signup({
    firstName: values.firstName as string,
    lastName: values.lastName as string,
    username: values.username as string,
    password: values.password as string,
  }, {
    onSuccess: () => {
      resetForm();
      toast.success('Signup successful!');
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || 'Failed to create!';
      toast.error(message);
    },
  });
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Create an account</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="onSubmit">
        <div class="mb-5">
          <Label for="firstName" class="mb-3">
            First Name
          </Label>
          <Input v-bind="firstNameAttrs" id="firstName" v-model="firstName" type="text" required />
        </div>

        <div class="mb-5">
          <Label for="lastName" class="mb-3">
            Last Name
          </Label>
          <Input v-bind="lastNameAttrs" id="lastName" v-model="lastName" type="text" required />
        </div>

        <div class="mb-5">
          <Label for="username" class="mb-3">
            Username
          </Label>
          <Input v-bind="usernameAttrs" id="username" v-model="username" type="text" required />
        </div>

        <div class="mb-5">
          <Label for="password" class="mb-3">
            Password
          </Label>
          <Input v-bind="passwordAttrs" id="password" v-model="password" type="password" required />
        </div>
        <div class="mb-5">
          <Label for="confirm-password" class="mb-3">
            Confirm Password
          </Label>
          <Input id="confirmPassword" v-model="confirmedPassword" type="password" required />
        </div>
        <div>
          <div>
            <Button type="submit">
              Create Account
            </Button>
          </div>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
