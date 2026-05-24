<script setup lang="ts">
import LucideIcon from '@/components/LucideIcon.vue';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardDescription from '@/components/ui/card/CardDescription.vue';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import Select from '@/components/ui/select/Select.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import { useUserStore } from '@/stores/system/users.store';

const userStore = useUserStore();

function submit() {
    console.log(userStore.form);

    /*
    payload:
    {
      group_id:3,
      name:"User",
      email:"user@gmail.com",
      password:"password",
      biodata:"-"
    }
    */
}
</script>

<template>
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="m-4">
            <!-- Header -->
            <div class="mb-5">
                <h4 class="text-[22px] leading-none mb-1">
                    <LucideIcon icon="user-cog" class="inline mr-1 w-5 h-5"></LucideIcon> Users
                </h4>
                <p class="text-sm text-muted-foreground">
                    Manage user accounts and permission
                </p>
            </div>

            <!-- Card -->
            <div class="grid grid-cols-2">
                <Card class="col-span-2 md:col-span-1 rounded-lg">
                    <CardHeader>
                        <CardTitle>Create User</CardTitle>
                        <CardDescription>
                            Fill in user details below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="grid gap-5 md:grid-cols-2">
                            <div class="col-span-2 md:col-span-1">
                                <Label class="mb-2">Group</Label>
                                <Select v-model="userStore.form.group_id">
                                    <SelectTrigger class="w-full">
                                        <SelectValue placeholder="Select group" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem :value="1">Admin</SelectItem>
                                        <SelectItem :value="2">Staff</SelectItem>
                                        <SelectItem :value="3">User</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div class="col-span-2 md:col-span-1">
                                <Label class="mb-2">Name</Label>
                                <Input v-model="userStore.form.name" placeholder="Enter full name" />
                            </div>
                            <div class="col-span-2 md:col-span-1">
                                <Label class="mb-2">Email</Label>
                                <Input type="email" v-model="userStore.form.email" placeholder="user@gmail.com" />
                            </div>
                            <div class="col-span-2 md:col-span-1">
                                <Label class="mb-2">Password</Label>
                                <Input type="password" v-model="userStore.form.password" placeholder="••••••••" />
                            </div>
                            <div class="col-span-2">
                                <Label class="mb-2">Biodata</Label>
                                <Textarea rows="5" v-model="userStore.form.biodata"
                                    placeholder="Write short biodata.." />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter class="justify-end gap-2">
                        <Button class="cursor-pointer w-[100px]" size="sm" variant="outline" @click="$router.back()">
                            Cancel
                        </Button>
                        <Button class="cursor-pointer w-[100px]" size="sm" @click="submit">
                            <LucideIcon icon="save" class="w-4 h-4" />
                            Save
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
</template>
