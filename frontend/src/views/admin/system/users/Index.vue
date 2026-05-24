<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import LucideIcon from "@/components/LucideIcon.vue"
import Button from "@/components/ui/button/Button.vue"
import DropdownMenu from "@/components/ui/dropdown-menu/DropdownMenu.vue"
import DropdownMenuContent from "@/components/ui/dropdown-menu/DropdownMenuContent.vue"
import DropdownMenuItem from "@/components/ui/dropdown-menu/DropdownMenuItem.vue"
import DropdownMenuSeparator from "@/components/ui/dropdown-menu/DropdownMenuSeparator.vue"
import DropdownMenuTrigger from "@/components/ui/dropdown-menu/DropdownMenuTrigger.vue"
import InputGroup from "@/components/ui/input-group/InputGroup.vue"
import InputGroupAddon from "@/components/ui/input-group/InputGroupAddon.vue"
import InputGroupInput from "@/components/ui/input-group/InputGroupInput.vue"
import { useUserStore } from "@/stores/system/users.store"
import { ref, onMounted, watch } from "vue"
import { useRouter } from "vue-router"

let debounce: ReturnType<typeof setTimeout>

const router = useRouter();
const userStore = useUserStore();
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
    router.push({
        name: 'user-create'
    });
}

function edit(item: any) {
    console.log(item);

    router.push({
        name: 'user-edit'
    });
}

watch(() => userStore.search, () => search());
onMounted(() => init())
</script>

<template>
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="m-4">
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
                            <Button variant="ghost" class="h-8 w-8 p-0 cursor-pointer" >
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
        </div>
    </div>
</template>