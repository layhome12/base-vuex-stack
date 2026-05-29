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
import Spinner from "@/components/ui/spinner/Spinner.vue"
import Textarea from "@/components/ui/textarea/Textarea.vue"
import { useUserStore } from "@/stores/system/users.store"
import { ref, onMounted, watch } from "vue"
import ErrorField, { type ErrorMessage } from "@/components/ErrorField.vue";
import { removeUser, saveUser } from "@/apis/users.api"
import { toast } from "vue-sonner"
import { Response } from "@/lib/response"
import AlertDialog from "@/components/ui/alert-dialog/AlertDialog.vue"
import AlertDialogContent from "@/components/ui/alert-dialog/AlertDialogContent.vue"
import AlertDialogHeader from "@/components/ui/alert-dialog/AlertDialogHeader.vue"
import AlertDialogTitle from "@/components/ui/alert-dialog/AlertDialogTitle.vue"
import AlertDialogDescription from "@/components/ui/alert-dialog/AlertDialogDescription.vue"
import AlertDialogFooter from "@/components/ui/alert-dialog/AlertDialogFooter.vue"
import AlertDialogCancel from "@/components/ui/alert-dialog/AlertDialogCancel.vue"
import AlertDialogAction from "@/components/ui/alert-dialog/AlertDialogAction.vue"
import Badge from "@/components/ui/badge/Badge.vue"
import { formatDate } from "@/lib/helper"

let debounce: ReturnType<typeof setTimeout>

const userStore = useUserStore();
const dialog = ref({
    save: false,
    remove: false,
});
const loading = ref({
    onSave: false,
    onRemove: false,
})
const errorMessage = ref<ErrorMessage[]>([]);

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
    // -- fetch
    if (!userStore.items.length) {
        userStore.fetchGroup();
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
    dialog.value.save = true;
}

function edit(item: any) {
    userStore.form = {
        id: item.id,
        group_id: item.group_id,
        name: item.name,
        email: item.email,
        password: "",
        biodata: item.biodata
    }

    dialog.value.save = true;
}

async function save() {
    loading.value.onSave = true;
    const res = await saveUser(userStore.form);
    loading.value.onSave = false;

    if (!Response.isOk(res)) {
        errorMessage.value = res.errors ?? [];
        toast.error(res.message);
        return;
    }

    dialog.value.save = false;
    toast.success("Saved successfull");

    userStore.fetchData();
}

async function remove() {
    loading.value.onRemove = true;
    const res = await removeUser(userStore.form.id);
    loading.value.onRemove = false;

    if (!Response.isOk(res)) {
        errorMessage.value = res.errors ?? [];
        toast.error(res.message);
        return;
    }

    dialog.value.remove = false;
    toast.success("Remove successfull");

    userStore.fetchData();
}

watch(() => userStore.search, () => search());
onMounted(() => init())
</script>

<template>
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="m-6">
            <div class="mb-3">
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
                <template #is_blocked="{ row }">
                    <Badge :variant="!row.is_blocked ? 'default' : 'destructive'">
                        <LucideIcon :icon="!row.is_blocked ? 'circle-check-big' : 'circle-x'"
                            class="h-3.5 w-3.5 mr-1" />
                        {{ !row.is_blocked ? "Active" : "Deactive" }}
                    </Badge>
                </template>
                <template #created_at="{ row }">
                    {{ formatDate(row.created_at) }}
                </template>
                <template #action="{ row }">
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="ghost" class="h-8 w-8 p-0 cursor-pointer">
                                <LucideIcon icon="settings-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem @click="edit(row)" class="cursor-pointer">
                                <LucideIcon icon="square-pen" class="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem @click="() => { dialog.remove = true; userStore.form.id = row.id; }"
                                class="text-destructive focus:text-destructive cursor-pointer">
                                <LucideIcon icon="trash-2" class="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </template>
            </DataTable>

            <Dialog v-model:open="dialog.save">
                <DialogContent class="sm:max-w-[540px]">
                    <DialogHeader>
                        <DialogTitle>Form User</DialogTitle>
                        <DialogDescription>
                            Fill user information below.
                        </DialogDescription>
                    </DialogHeader>
                    <div class="grid gap-3 md:grid-cols-2">
                        <div class="col-span-2 md:col-span-1">
                            <Label class="mb-2">Group</Label>
                            <Select v-model="userStore.form.group_id">
                                <SelectTrigger class="w-full">
                                    <SelectValue placeholder="Select group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="item, key in userStore.groups" :key="key" :value="item.id">
                                        {{ item.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <ErrorField name="group_id" :data="errorMessage" />
                        </div>
                        <div class="col-span-2 md:col-span-1">
                            <Label class="mb-2">Name</Label>
                            <Input v-model="userStore.form.name" placeholder="Enter full name" />
                            <ErrorField name="name" :data="errorMessage" />
                        </div>
                        <div class="col-span-2 md:col-span-1">
                            <Label class="mb-2">Email</Label>
                            <Input type="email" v-model="userStore.form.email" placeholder="user@gmail.com" />
                            <ErrorField name="email" :data="errorMessage" />
                        </div>
                        <div class="col-span-2 md:col-span-1">
                            <Label class="mb-2">Password</Label>
                            <Input type="password" v-model="userStore.form.password" placeholder="••••••••" />
                            <ErrorField name="password" :data="errorMessage" />
                        </div>
                        <div class="col-span-2">
                            <Label class="mb-2">Biodata</Label>
                            <Textarea rows="5" v-model="userStore.form.biodata" placeholder="Write short biodata.." />
                            <ErrorField name="biodata" :data="errorMessage" />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" @click="dialog.save = false" :disabled="loading.onSave">
                            Cancel
                        </Button>
                        <Button @click="save" :disabled="loading.onSave">
                            <Spinner v-if="loading.onSave" class="animate-spin" />
                            <LucideIcon v-else icon="save" class="mr-1" />
                            {{ loading.onSave ? "Saving.." : "Save" }}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog v-model:open="dialog.remove">
                <AlertDialogContent class="sm:max-w-[400px]">
                    <AlertDialogHeader>
                        <div
                            class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                            <LucideIcon icon="triangle-alert" class="text-destructive"></LucideIcon>
                        </div>
                        <AlertDialogTitle class="text-center text-xl">
                            Warning
                        </AlertDialogTitle>
                        <AlertDialogDescription class="text-center">
                            This action cannot be undone.
                            Deleted data will be permanently removed
                            from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter class="mt-4">
                        <AlertDialogCancel :disabled="loading.onRemove">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction @click.prevent="remove" :disabled="loading.onRemove"
                            class="bg-destructive text-white hover:bg-destructive/90">
                            <Spinner v-if="loading.onRemove" class="animate-spin" />
                            <LucideIcon v-else icon="trash-2" class="mr-1" />
                            {{ loading.onRemove ? "Deleting.." : "Delete" }}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </div>
</template>