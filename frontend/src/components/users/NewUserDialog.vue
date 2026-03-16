<script setup lang="ts">
import type { UserCreatePayload } from '@ticketbasics/zod-schemas';

import { UserCreateSchema } from '@ticketbasics/zod-schemas';
import { toTypedSchema } from '@vee-validate/zod';
import { Plus } from 'lucide-vue-next';
import { ErrorMessage, useForm } from 'vee-validate';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

import Button from '@/components/ui/button/Button.vue';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateUser } from '@/queries';

const dialogOpen = ref(false);

const { mutate: createUser } = useCreateUser();

const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: toTypedSchema(UserCreateSchema),
  initialValues: {
    firstName: '',
    lastName: '',
    username: '',
  },
});

const [firstName, firstNameAttrs] = defineField('firstName');
const [lastName, lastNameAttrs] = defineField('lastName');
const [username, usernameAttrs] = defineField('username');

const onSubmit = handleSubmit((newUser: UserCreatePayload) => {
  createUser(newUser, {
    onSuccess: () => {
      resetForm();
      dialogOpen.value = false;
      toast.success('created!');
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || 'Failed to create!';
      toast.error(message);
    },
  });
});

function handleCancel() {
  resetForm();
  dialogOpen.value = false;
}
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <Button size="sm" variant="outline">
        <Plus :size="16" /> New User
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>New User</DialogTitle>
        <DialogDescription />
      </DialogHeader>

      <form @submit.prevent="onSubmit">
        <div class="mb-5">
          <Label for="firstName" class="mb-2 flex justify-between">
            <div>First Name *</div>

            <div class="text-red-500">
              <ErrorMessage name="firstName" />
            </div>
          </Label>

          <Input id="firstName" v-model="firstName" :class="{ 'border-red-500': errors.firstName }" v-bind="firstNameAttrs" required />
        </div>

        <div class="mb-5">
          <Label for="lastName" class="mb-2 flex justify-between">
            <div>Last Name *</div>

            <div class="text-red-500">
              <ErrorMessage name="lastName" />
            </div>
          </Label>

          <Input id="lastName" v-model="lastName" :class="{ 'border-red-500': errors.lastName }" v-bind="lastNameAttrs" required />
        </div>

        <div class="mb-5">
          <Label for="username" class="mb-2 flex justify-between">
            <div>Username *</div>

            <div class="text-red-500">
              <ErrorMessage name="username" />
            </div>
          </Label>

          <Input id="username" v-model="username" :class="{ 'border-red-500': errors.username }" v-bind="usernameAttrs" required />
        </div>

        <DialogFooter>
          <DialogClose as-child>
            <Button size="sm" variant="outline" @click="handleCancel">
              Cancel
            </Button>
          </DialogClose>

          <Button size="sm" type="submit">
            <Plus :size="16" /> Create
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
