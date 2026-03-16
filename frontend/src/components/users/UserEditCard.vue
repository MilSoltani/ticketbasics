<script setup lang="ts">
import type { UserUpdatePayload } from '@ticketbasics/zod-schemas';

import { UserUpdateSchema } from '@ticketbasics/zod-schemas';
import { toTypedSchema } from '@vee-validate/zod';
import { Save } from 'lucide-vue-next';
import { ErrorMessage, useForm } from 'vee-validate';
import { watch } from 'vue';
import { toast } from 'vue-sonner';

import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardDescription from '@/components/ui/card/CardDescription.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
import { useGetUserById, useUpdateUser } from '@/queries';

const props = defineProps<{
  userId: number;
}>();

const { data: user, isLoading, error } = useGetUserById(props.userId);

const { mutate: updateUser, isPending } = useUpdateUser();

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: toTypedSchema(UserUpdateSchema),
  initialValues: {},
});

const [firstName, firstNameAttrs] = defineField('firstName');
const [lastName, lastNameAttrs] = defineField('lastName');
const [username, usernameAttrs] = defineField('username');

watch(user, (newUser, oldUser) => {
  if (newUser && newUser !== oldUser) {
    resetForm({ values: newUser });
  }
}, { immediate: true });

const onSubmit = handleSubmit((updatedUser: UserUpdatePayload) => {
  updateUser(
    { id: props.userId, changes: updatedUser },
    {
      onSuccess: () => {
        toast.success('updated!');
      },
      onError: (error: any) => {
        const message = error?.message || error?.response?.data?.message || 'Failed to update!';
        toast.error(message);
      },
    },
  );
});
</script>

<template>
  <Card class="shadow-none w-full rounded-none">
    <form @submit.prevent="onSubmit">
      <CardHeader>
        <div class="flex justify-between">
          <div class="mb-5">
            <CardTitle class="mb-2">
              User
            </CardTitle>
            <CardDescription>Edit page of a user</CardDescription>
          </div>

          <div class="justify-self-end">
            <Button variant="outline" size="sm" type="submit" :disabled="isPending">
              <Save :size="16" /> Update
            </Button>
          </div>
        </div>
      </CardHeader>

      <div v-if="isLoading">
        Loading...
      </div>
      <div v-else-if="error">
        <pre>{{ error }}</pre>
      </div>

      <CardContent v-else>
        <div>
          <div class="mb-5">
            <Label for="firstName" class="mb-2 flex justify-between">
              <div>First Name *</div>

              <div class="text-red-500">
                <ErrorMessage name="firstName" />
              </div>
            </Label>

            <Input id="firstName" v-model="firstName" :class="{ 'border-red-500': errors.firstName }" v-bind="firstNameAttrs" />
          </div>

          <div class="mb-5">
            <Label for="lastName" class="mb-2 flex justify-between">
              <div>Last Name *</div>

              <div class="text-red-500">
                <ErrorMessage name="lastName" />
              </div>
            </Label>

            <Input id="lastName" v-model="lastName" :class="{ 'border-red-500': errors.lastName }" v-bind="lastNameAttrs" />
          </div>

          <div class="mb-5">
            <Label for="username" class="mb-2 flex justify-between">
              <div>Username *</div>

              <div class="text-red-500">
                <ErrorMessage name="username" />
              </div>
            </Label>

            <Input id="username" v-model="username" :class="{ 'border-red-500': errors.username }" v-bind="usernameAttrs" />
          </div>
        </div>
      </CardContent>
    </form>
  </Card>
</template>
