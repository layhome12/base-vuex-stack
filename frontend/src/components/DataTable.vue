<script setup lang="ts">
import type {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from "@tanstack/vue-table"

import {
    FlexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from "@tanstack/vue-table"

import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconDotsVertical,
    IconLayoutColumns,
    IconLoader,
    IconPlus,
} from "@tabler/icons-vue"

import { ref } from "vue"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Label } from "@/components/ui/label"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import LucideIcon from "./LucideIcon.vue"

interface TableData {
    id: number
    header: string
    type: string
    status: string
    target: string
    limit: string
    reviewer: string
}

const props = defineProps<{
    data: TableData[]
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const columns: ColumnDef<TableData>[] = [
    {
        id: "select",
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "actions",
    },
    {
        accessorKey: "header",
        header: "Header",
        enableHiding: false,
    },
    {
        accessorKey: "type",
        header: "Section Type",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "target",
        header: "Target",
    },
    {
        accessorKey: "limit",
        header: "Limit",
    },
    {
        accessorKey: "reviewer",
        header: "Reviewer",
    },
]

const table = useVueTable({
    get data() {
        return props.data
    },

    columns,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onSortingChange: (updaterOrValue) => {
        sorting.value =
            typeof updaterOrValue === "function"
                ? updaterOrValue(sorting.value)
                : updaterOrValue
    },

    onColumnFiltersChange: (updaterOrValue) => {
        columnFilters.value =
            typeof updaterOrValue === "function"
                ? updaterOrValue(columnFilters.value)
                : updaterOrValue
    },

    onColumnVisibilityChange: (updaterOrValue) => {
        columnVisibility.value =
            typeof updaterOrValue === "function"
                ? updaterOrValue(columnVisibility.value)
                : updaterOrValue
    },

    onRowSelectionChange: (updaterOrValue) => {
        rowSelection.value =
            typeof updaterOrValue === "function"
                ? updaterOrValue(rowSelection.value)
                : updaterOrValue
    },

    state: {
        get sorting() {
            return sorting.value
        },

        get columnFilters() {
            return columnFilters.value
        },

        get columnVisibility() {
            return columnVisibility.value
        },

        get rowSelection() {
            return rowSelection.value
        },
    },
})
</script>

<template>
    <div class="p-4 space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="outline" size="sm">
                            <IconLayoutColumns class="mr-2 h-4 w-4" />
                            <span class="hidden lg:inline">
                                Customize Columns
                            </span>
                            <span class="lg:hidden">
                                Columns
                            </span>
                            <IconChevronDown class="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-56">
                        <template v-for="column in table
                            .getAllColumns()
                            .filter(
                                (column) =>
                                    typeof column.accessorFn !== 'undefined' &&
                                    column.getCanHide()
                            )" :key="column.id">
                            <DropdownMenuCheckboxItem class="capitalize" :model-value="column.getIsVisible()"
                                @update:model-value="
                                    column.toggleVisibility(!!$event)
                                    ">
                                {{ column.id }}
                            </DropdownMenuCheckboxItem>
                        </template>
                    </DropdownMenuContent>
                </DropdownMenu>

                <!-- ADD -->
                <Button variant="default" size="sm">
                    <IconPlus class="" />
                </Button>
            </div>
        </div>

        <!-- TABLE -->
        <div class="overflow-hidden rounded-sm border">
            <Table>
                <TableHeader class="bg-muted/50">
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id" :col-span="header.colSpan">
                            <!-- SELECT ALL -->
                            <template v-if="header.id === 'select'">
                                <Checkbox :model-value="table.getIsAllPageRowsSelected() ||
                                    (
                                        table.getIsSomePageRowsSelected() &&
                                        'indeterminate'
                                    )
                                    " @update:model-value="table.toggleAllPageRowsSelected(!!$event)" />
                            </template>
                            <!-- NORMAL -->
                            <template v-else>
                                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                                    :props="header.getContext()" />
                            </template>
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <!-- BODY -->
                <TableBody>
                    <template v-if="table.getRowModel().rows.length">
                        <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
                            class="transition-colors hover:bg-muted/30">
                            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                <template v-if="cell.column.id === 'select'">
                                    <Checkbox :model-value="row.getIsSelected()" @update:model-value="
                                        row.toggleSelected(!!$event)
                                        " />
                                </template>
                                <template v-else-if="cell.column.id === 'type'">
                                    <Badge variant="outline">
                                        {{ row.getValue("type") }}
                                    </Badge>
                                </template>
                                <template v-else-if="cell.column.id === 'status'">
                                    <div class="flex items-center gap-2">
                                        <IconCircleCheckFilled v-if="row.getValue('status') === 'Done'"
                                            class="h-4 w-4 text-emerald-500" />
                                        <IconLoader v-else class="text-muted-foreground h-4 w-4 animate-spin" />
                                        <span>
                                            {{ row.getValue("status") }}
                                        </span>
                                    </div>
                                </template>
                                <template v-else-if="cell.column.id === 'target'">
                                    <Button variant="ghost" size="sm" class="h-auto p-1 text-xs font-mono">
                                        <span class="ml-1 font-semibold">
                                            {{ row.getValue("target") }}
                                        </span>
                                    </Button>
                                </template>
                                <template v-else-if="cell.column.id === 'limit'">
                                    <Button variant="ghost" size="sm" class="h-auto p-1 text-xs font-mono">
                                        <span class="ml-1 font-semibold">
                                            {{ row.getValue("limit") }}
                                        </span>
                                    </Button>
                                </template>
                                <template v-else-if="cell.column.id === 'reviewer'">
                                    <template v-if="
                                        row.getValue('reviewer') !==
                                        'Assign reviewer'
                                    ">
                                        {{ row.getValue("reviewer") }}
                                    </template>
                                    <template v-else>
                                        <Select>
                                            <SelectTrigger class="w-full">
                                                <SelectValue placeholder="Assign reviewer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="eddie">
                                                    Eddie Lake
                                                </SelectItem>
                                                <SelectItem value="jamik">
                                                    Jamik Tashpulatov
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </template>
                                </template>
                                <template v-else-if="cell.column.id === 'actions'">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger as-child>
                                            <Button variant="ghost" class="h-8 w-8 p-0">
                                                <span class="sr-only">
                                                    Open menu
                                                </span>
                                                <IconDotsVertical class="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <LucideIcon icon="square-pen" class="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <LucideIcon icon="printer" class="mr-2 h-4 w-4" />
                                                Print
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem class="text-destructive focus:text-destructive">
                                                <LucideIcon icon="trash-2" class="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </template>
                                <template v-else>
                                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                                </template>
                            </TableCell>
                        </TableRow>
                    </template>
                    <TableRow v-else>
                        <TableCell :col-span="columns.length" class="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <!-- PAGINATION -->
        <div class="flex items-center justify-between px-4">
            <div class="text-muted-foreground hidden flex-1 text-sm lg:flex">
                {{ table.getFilteredSelectedRowModel().rows.length }}
                of
                {{ table.getFilteredRowModel().rows.length }}
                row(s) selected.
            </div>
            <div class="flex w-full items-center gap-8 lg:w-fit">
                <div class="hidden items-center gap-2 lg:flex">
                    <Label for="rows-per-page" class="text-sm font-medium">
                        Rows per page
                    </Label>
                    <Select :model-value="table.getState().pagination.pageSize
                        " @update:model-value="
                            table.setPageSize(Number($event))
                            ">
                        <SelectTrigger id="rows-per-page" size="sm" class="w-20">
                            <SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
                        </SelectTrigger>
                        <SelectContent side="top">
                            <SelectItem v-for="pageSize in [10, 20, 30, 40, 50]" :key="pageSize" :value="`${pageSize}`">
                                {{ pageSize }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div class="flex w-fit items-center justify-center text-sm font-medium">
                    Page
                    {{ table.getState().pagination.pageIndex + 1 }}
                    of
                    {{ table.getPageCount() }}
                </div>
                <div class="ml-auto flex items-center gap-2 lg:ml-0">
                    <Button variant="outline" class="hidden h-8 w-8 p-0 lg:flex" :disabled="!table.getCanPreviousPage()"
                        @click="table.setPageIndex(0)">
                        <span class="sr-only">
                            Go to first page
                        </span>
                        <IconChevronsLeft />
                    </Button>
                    <Button variant="outline" class="size-8" size="icon" :disabled="!table.getCanPreviousPage()"
                        @click="table.previousPage()">
                        <span class="sr-only">
                            Go to previous page
                        </span>

                        <IconChevronLeft />
                    </Button>
                    <Button variant="outline" class="size-8" size="icon" :disabled="!table.getCanNextPage()"
                        @click="table.nextPage()">
                        <span class="sr-only">
                            Go to next page
                        </span>

                        <IconChevronRight />
                    </Button>
                    <Button variant="outline" class="hidden size-8 lg:flex" size="icon"
                        :disabled="!table.getCanNextPage()" @click="
                            table.setPageIndex(
                                table.getPageCount() - 1
                            )
                            ">
                        <span class="sr-only">
                            Go to last page
                        </span>
                        <IconChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>