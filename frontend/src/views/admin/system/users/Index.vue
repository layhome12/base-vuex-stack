<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import LucideIcon from "@/components/LucideIcon.vue"
import Button from "@/components/ui/button/Button.vue"
import Dialog from "@/components/ui/dialog/Dialog.vue"
import DialogContent from "@/components/ui/dialog/DialogContent.vue"
import DialogDescription from "@/components/ui/dialog/DialogDescription.vue"
import DialogFooter from "@/components/ui/dialog/DialogFooter.vue"
import DialogHeader from "@/components/ui/dialog/DialogHeader.vue"
import DialogTitle from "@/components/ui/dialog/DialogTitle.vue"
import DropdownMenu from "@/components/ui/dropdown-menu/DropdownMenu.vue"
import DropdownMenuContent from "@/components/ui/dropdown-menu/DropdownMenuContent.vue"
import DropdownMenuItem from "@/components/ui/dropdown-menu/DropdownMenuItem.vue"
import DropdownMenuSeparator from "@/components/ui/dropdown-menu/DropdownMenuSeparator.vue"
import DropdownMenuTrigger from "@/components/ui/dropdown-menu/DropdownMenuTrigger.vue"
import InputGroup from "@/components/ui/input-group/InputGroup.vue"
import InputGroupAddon from "@/components/ui/input-group/InputGroupAddon.vue"
import InputGroupInput from "@/components/ui/input-group/InputGroupInput.vue"
import Input from "@/components/ui/input/Input.vue"
import Label from "@/components/ui/label/Label.vue"
import Select from "@/components/ui/select/Select.vue"
import SelectContent from "@/components/ui/select/SelectContent.vue"
import SelectItem from "@/components/ui/select/SelectItem.vue"
import SelectTrigger from "@/components/ui/select/SelectTrigger.vue"
import SelectValue from "@/components/ui/select/SelectValue.vue"
import Textarea from "@/components/ui/textarea/Textarea.vue"
import { useUserStore } from "@/stores/system/users.store"
import { ref, onMounted, watch } from "vue"

let debounce: ReturnType<typeof setTimeout>

const userStore = useUserStore();
const dialog = ref(false);
const columns = ref([
    {
        accessorKey: "action",
        header: "",
        size: 50,
        meta: {
            align: "center" as const,
        },
        enableSorting: false,
    },
    {
        accessorKey: "group",
        orderKey: "gr.name",
        header: "Group",
        enableSorting: true,
    },
    {
        accessorKey: "name",
        orderKey: "us.name",
        header: "Name",
        enableSorting: true,
    },
    {
        accessorKey: "email",
        orderKey: "us.email",
        header: "Email",
        enableSorting: true,
    },
    {
        accessorKey: "is_blocked",
        header: "Is Blocked",
        enableSorting: false,
    },
    {
        accessorKey: "created_at",
        orderKey: "us.created_at",
        header: "Created At",
        enableSorting: true,
    },
])

function init() {
    if (!userStore.items.length) {
        userStore.fetchData();
    }
}

function search() {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
        userStore.params.page = 1;
        userStore.fetchData();
    }, 500);
}

function create() {
    userStore.resetForm();
    dialog.value = true;
}

function edit(item: any) {
    console.log(item);

    dialog.value = true;
}

watch(() => userStore.search, () => search());
onMounted(() => init())
</script>

<template>
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="m-6">
            <div class="mb-5">
                <h4 class="text-[22px] leading-none mb-1">
                    <LucideIcon icon="user-cog" class="inline mr-1 w-5 h-5"></LucideIcon> Users
                </h4>
                <p class="text-sm text-muted-foreground">
                    Manage user accounts and permission
                </p>
            </div>

            <div class="flex flex-2 justify-start gap-2 my-2">
                <div>
                    <Button @click="create" variant="default" size="sm" class="h-8 px-3 cursor-pointer">
                        <LucideIcon icon="plus" class="w-4 h-4" />
                    </Button>
                </div>
                <div>
                    <InputGroup class="h-8">
                        <InputGroupInput v-model="userStore.search" placeholder="Search.." class="h-8 text-sm" />
                        <InputGroupAddon class="h-8 px-2">
                            <LucideIcon icon="search" class="w-4 h-4" />
                        </InputGroupAddon>
                    </InputGroup>
                </div>
            </div>

            <DataTable class="table-striped" :columns="columns" :data="userStore.items" :loading="userStore.loading"
                :pagination="userStore.paginate" @change="userStore.onTableChange">
                <template #action="{ }">
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="ghost" class="h-8 w-8 p-0 cursor-pointer">
                                <LucideIcon icon="settings-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem @click="edit" class="cursor-pointer">
                                <LucideIcon icon="square-pen" class="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem class="text-destructive focus:text-destructive cursor-pointer">
                                <LucideIcon icon="trash-2" class="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </template>
            </DataTable>

            <Dialog v-model:open="dialog">
                <DialogContent class="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Form User</DialogTitle>
                        <DialogDescription>
                            Fill user information below.
                        </DialogDescription>
                    </DialogHeader>
                    <div class="grid gap-5 md:grid-cols-2">
                        <div class="col-span-2 md:col-span-1">
                            <Label class="mb-2">Group</Label>
                            <Select v-model="userStore.form.group_id">
                                <SelectTrigger class="w-full">
                                    <SelectValue placeholder="Select group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">
                                        Admin
                                    </SelectItem>
                                    <SelectItem value="2">
                                        Staff
                                    </SelectItem>
                                    <SelectItem value="3">
                                        User
                                    </SelectItem>
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
                            <Textarea rows="5" v-model="userStore.form.biodata" placeholder="Write short biodata.." />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" @click="dialog = false">
                            Cancel
                        </Button>
                        <Button>
                            <LucideIcon icon="save"></LucideIcon> Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>