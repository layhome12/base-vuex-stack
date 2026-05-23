<script setup lang="ts">
import DataTable from "@/components/DataTable.vue"
import LucideIcon from "@/components/LucideIcon.vue"
import Button from "@/components/ui/button/Button.vue"
import DropdownMenu from "@/components/ui/dropdown-menu/DropdownMenu.vue"
import DropdownMenuContent from "@/components/ui/dropdown-menu/DropdownMenuContent.vue"
import DropdownMenuItem from "@/components/ui/dropdown-menu/DropdownMenuItem.vue"
import DropdownMenuSeparator from "@/components/ui/dropdown-menu/DropdownMenuSeparator.vue"
import DropdownMenuTrigger from "@/components/ui/dropdown-menu/DropdownMenuTrigger.vue"
import { ref, onMounted } from "vue"

const data = ref([])
const loading = ref(false)

const pagination = ref({
    page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
})

const columns = ref([
    {
        accessorKey: "action",
        header: "",
        size: 10,
        meta: {
            align: "center" as const,
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "age",
        header: "Age",
    },
])

async function fetchData(params: any = {}) {
    loading.value = true

    await new Promise((resolve) =>
        setTimeout(resolve, 500)
    )

    // dummy total data
    const allData = Array.from(
        { length: 30 },
        (_, i) => ({
            id: i + 1,
            name: `User ${i + 1}`,
            email: `user${i + 1}@mail.com`,
            age: 20 + (i % 10),
        })
    )

    const page =
        params.page ?? pagination.value.page

    const perPage =
        params.per_page ??
        pagination.value.per_page

    const sortBy = params.sort_by
    const sortDesc = params.sort_desc

    let rows = [...allData]

    // sorting
    if (sortBy) {
        rows.sort((a: any, b: any) => {
            if (a[sortBy] < b[sortBy])
                return sortDesc ? 1 : -1

            if (a[sortBy] > b[sortBy])
                return sortDesc ? -1 : 1

            return 0
        })
    }

    // pagination
    const start =
        (page - 1) * perPage

    const end =
        start + perPage

    data.value = rows.slice(start, end) as any

    pagination.value = {
        page,
        per_page: perPage,
        total: rows.length,
        last_page: Math.ceil(
            rows.length / perPage
        ),
    }

    loading.value = false
}

function handleTableChange(payload: any) {
    pagination.value.page = payload.page
    pagination.value.per_page = payload.per_page

    fetchData(payload)
}

onMounted(fetchData)
</script>

<template>
    <div class="@container/main flex flex-1 flex-col gap-2">
        <DataTable class="table-striped" :columns="columns" :data="data" :loading="loading" :pagination="pagination"
            @change="handleTableChange">
            <template #action="{ }">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="ghost" class="h-8 w-8 p-0">
                            <LucideIcon icon="settings-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem>
                            <LucideIcon icon="square-pen" class="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem class="text-destructive focus:text-destructive">
                            <LucideIcon icon="trash-2" class="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </template>
        </DataTable>
    </div>
</template>