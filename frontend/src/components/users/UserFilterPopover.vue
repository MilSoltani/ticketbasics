<script setup lang="ts">
import type { UserQuery } from '@ticketbasics/zod-schemas';

import { useDebounceFn } from '@vueuse/core';
import { useForm } from 'vee-validate';

import DateSelector from '@/components/form/DateSelector.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import TableFilterLayout from '../table/TableFilterLayout.vue';

const emit = defineEmits<{
  (e: 'setQuery', patch: Partial<UserQuery>): void;
}>();

const { defineField, resetForm } = useForm<{
  id: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  username: string | undefined;
  createdFrom: string | undefined;
  createdTo: string | undefined;
}>({
  initialValues: {
    id: undefined,
    firstName: undefined,
    lastName: undefined,
    username: undefined,
    createdFrom: undefined,
    createdTo: undefined,
  },
});

const [id, idAttrs] = defineField('id');
const [firstName, firstNameAttrs] = defineField('firstName');
const [lastName, lastNameAttrs] = defineField('lastName');
const [username, usernameAttrs] = defineField('username');
const [createdFrom, createdFromAttrs] = defineField('createdFrom');
const [createdTo, createdToAttrs] = defineField('createdTo');

const debouncedHandleChange = useDebounceFn(() => {
  emit('setQuery', {
    id: id.value,
    firstName: firstName.value,
    lastName: lastName.value,
    username: username.value,
    createdFrom: createdFrom.value ? new Date(createdFrom.value) : undefined,
    createdTo: createdTo.value ? new Date(createdTo.value) : undefined,
  });
}, 1000);

function handleClear() {
  resetForm();
  emit('setQuery', {
    id: undefined,
    firstName: undefined,
    lastName: undefined,
    username: undefined,
    createdFrom: undefined,
    createdTo: undefined,
  });
}
</script>

<template>
  <form>
    <TableFilterLayout @clear="handleClear">
      <div class="grid grid-cols-2 gap-x-12 gap-y-4 items-start mb-2">
        <div class="grid gap-4">
          <div class="grid grid-rows-1 gap-3 items-center">
            <Label for="id" class="text-right">Id:</Label>
            <Input id="id" v-model="id" v-bind="idAttrs" type="number" class=" h-8" @input="debouncedHandleChange" />
          </div>

          <div class="grid grid-rows-1 gap-3 items-center">
            <Label for="firstName" class="text-right">First Name:</Label>
            <Input id="firstName" v-model="firstName" v-bind="firstNameAttrs" class=" h-8" @input="debouncedHandleChange" />
          </div>

          <div class="grid grid-rows-1 gap-3 items-center">
            <Label for="lastName" class="text-right">Last Name:</Label>
            <Input id="lastName" v-model="lastName" v-bind="lastNameAttrs" class=" h-8" @input="debouncedHandleChange" />
          </div>

          <div class="grid grid-rows-1 gap-3 items-center">
            <Label for="username" class="text-right">Username:</Label>
            <Input id="username" v-model="username" v-bind="usernameAttrs" class=" h-8" @input="debouncedHandleChange" />
          </div>
        </div>

        <div class="grid gap-4">
          <div class="grid grid-rows-1 gap-3 items-center">
            <Label class="text-right">Created from:</Label>
            <div class="">
              <DateSelector :date="createdFrom" v-bind="createdFromAttrs" @update:date="(value) => { createdFrom = value; debouncedHandleChange(); }" />
            </div>
          </div>
          <div class="grid grid-rows-1 gap-3 items-center">
            <Label class="text-right">Created to:</Label>
            <div class="">
              <DateSelector :date="createdTo" v-bind="createdToAttrs" @update:date="(value) => { createdTo = value; debouncedHandleChange(); }" />
            </div>
          </div>
        </div>
      </div>
    </TableFilterLayout>
  </form>
</template>
