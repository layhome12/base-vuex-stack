<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  SortingState,
} from "@tanstack/vue-table"

import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from "@tanstack/vue-table"

import { ref, watch } from "vue"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ChevronsRight, ChevronsLeft, Loader2 } from "lucide-vue-next"
import type { AcceptableValue } from "reka-ui"
import type { OnChangeTable, PaginationTable } from "@/types/tanstack-table"

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  pagination: PaginationTable
}>()

const emit = defineEmits<{
  (e: "change", payload: OnChangeTable): void
}>()

const sorting = ref<SortingState>([])
const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  state: {
    get sorting() {
      return sorting.value
    },
  },
  manualSorting: true,
  getCoreRowModel: getCoreRowModel(),
  onSortingChange: (updater) => {
    sorting.value =
      typeof updater === "function"
        ? updater(sorting.value)
        : updater
  },
})

watch(
  sorting,
  () => {
    emit("change", {
      page: props.pagination.page,
      per_page: props.pagination.per_page,
      sort_by: sorting.value[0]?.id,
      sort_desc: sorting.value[0]?.desc,
    })
  },
  { deep: true }
)

function changePage(page: number) {
  emit("change", {
    page,
    per_page: props.pagination.per_page,
    sort_by: sorting.value[0]?.id,
    sort_desc: sorting.value[0]?.desc,
  })
}

function changeLimit(value: AcceptableValue) {
  emit("change", {
    page: 1,
    per_page: Number(value),
    sort_by: sorting.value[0]?.id,
    sort_desc: sorting.value[0]?.desc,
  })
}
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- loading -->
    <div v-if="loading" class="absolute inset-0 z-50 flex items-center justify-center bg-background/30">
      <div
        class="flex items-center gap-2 rounded-[7px] bg-zinc-900 text-white dark:bg-white dark:text-black px-5 py-1 my-3">
        <Loader2 class="h-4 w-4 animate-spin font-bold" />
        <span class="text-[12px]">
          Fetching..
        </span>
      </div>
    </div>

    <div class="border rounded-sm mb-2">
      <Table>
        <!-- HEADER -->
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id" class="cursor-pointer" @click="
              header.column.getCanSort() &&
              header.column.toggleSorting()
              " :style="header.column.columnDef.size
                ? {
                  width: `${header.getSize()}px`,
                  minWidth: `${header.getSize()}px`,
                  maxWidth: `${header.getSize()}px`,
                }
                : {}
                ">
              <div class="flex items-center gap-2" :class="{
                'justify-start':
                  header.column.columnDef.meta?.align === 'left' || !header.column.columnDef.meta?.align,
                'justify-center':
                  header.column.columnDef.meta?.align === 'center',
                'justify-end':
                  header.column.columnDef.meta?.align === 'right',
              }">
                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                  :props="header.getContext()" />
                <ArrowUp v-if="header.column.getIsSorted() === 'asc'" class="w-4 h-4" />
                <ArrowDown v-if="header.column.getIsSorted() === 'desc'" class="w-4 h-4" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <!-- BODY -->
        <TableBody>
          <template v-if="table.getRowModel().rows.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
              <TableCell class="p-1" v-for="cell in row.getVisibleCells()" :key="cell.id" :style="cell.column.columnDef.size
                ? {
                  width: `${cell.column.getSize()}px`,
                  minWidth: `${cell.column.getSize()}px`,
                  maxWidth: `${cell.column.getSize()}px`,
                }
                : {}
                " :class="{
                  'text-left':
                    cell.column.columnDef.meta?.align === 'left',
                  'text-center':
                    cell.column.columnDef.meta?.align === 'center',
                  'text-right':
                    cell.column.columnDef.meta?.align === 'right',
                }">
                <slot :name="cell.column.id" :row="row.original" :value="cell.getValue()">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </slot>
              </TableCell>
            </TableRow>
          </template>

          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="text-center p-3">
                No data available
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- PAGINATION -->
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <span class="text-[14px]">Items per page</span>
        <Select size="sm" :default-value="String(pagination.per_page)" @update:model-value="changeLimit">
          <SelectTrigger class="w-20">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex items-center justify-end gap-6 text-sm">
        <!-- total data -->
        <div>
          {{
            pagination.total
              ? (pagination.page - 1) * pagination.per_page + 1
              : 0
          }}
          -
          {{
            (pagination.page - 1) * pagination.per_page +
            data.length
          }}
          of {{ pagination.total }}
        </div>

        <!-- pagination -->
        <div class="flex items-center gap-1">
          <!-- first -->
          <Button variant="ghost" size="icon" class="h-8 w-8" :disabled="pagination.page <= 1" @click="changePage(1)">
            <ChevronsLeft class="h-4 w-4" />
          </Button>
          <!-- prev -->
          <Button variant="ghost" size="icon" class="h-8 w-8" :disabled="pagination.page <= 1"
            @click="changePage(pagination.page - 1)">
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <!-- next -->
          <Button variant="ghost" size="icon" class="h-8 w-8" :disabled="pagination.page >= pagination.last_page"
            @click="changePage(pagination.page + 1)">
            <ChevronRight class="h-4 w-4" />
          </Button>
          <!-- last -->
          <Button variant="ghost" size="icon" class="h-8 w-8" :disabled="pagination.page >= pagination.last_page"
            @click="changePage(pagination.last_page)">
            <ChevronsRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>