<script setup lang="ts">
import { getAccess, saveAccess } from '@/apis/groups.api';
import LucideIcon from '@/components/LucideIcon.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import Collapsible from '@/components/ui/collapsible/Collapsible.vue';
import CollapsibleContent from '@/components/ui/collapsible/CollapsibleContent.vue';
import CollapsibleTrigger from '@/components/ui/collapsible/CollapsibleTrigger.vue';
import SidebarMenu from '@/components/ui/sidebar/SidebarMenu.vue';
import SidebarMenuButton from '@/components/ui/sidebar/SidebarMenuButton.vue';
import SidebarMenuItem from '@/components/ui/sidebar/SidebarMenuItem.vue';
import SidebarMenuSub from '@/components/ui/sidebar/SidebarMenuSub.vue';
import SidebarMenuSubItem from '@/components/ui/sidebar/SidebarMenuSubItem.vue';
import Table from '@/components/ui/table/Table.vue';
import TableBody from '@/components/ui/table/TableBody.vue';
import TableCell from '@/components/ui/table/TableCell.vue';
import TableHead from '@/components/ui/table/TableHead.vue';
import TableHeader from '@/components/ui/table/TableHeader.vue';
import TableRow from '@/components/ui/table/TableRow.vue';
import { Response } from '@/lib/response';
import { useSidebarStore } from '@/stores/sidebar';
import { useGroupStore, type GroupAccess } from '@/stores/system/groups.store';
import { ChevronRight } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';

const sidebar = useSidebarStore();
const groupStore = useGroupStore();
const loading = ref({
    onSave: false,
    onGet: false,
});

sidebar.setBreadcrumbs([
    {
        title: "System",
    },
    {
        title: "Groups",
    }
]);

async function showAccess(item: any) {
    groupStore.form.group_id = item.id;
    groupStore.form.group_name = item.name;

    loading.value.onGet = true;
    const res = await getAccess(item.id);
    loading.value.onGet = false;

    if (!Response.isOk(res)) {
        toast.error(res.message);
        return;
    }

    const access: Record<string, GroupAccess> = res.data.reduce((acc: any, item: any) => {
        acc[item.sidebar_key] = {
            read: Boolean(item.read),
            create: Boolean(item.create),
            update: Boolean(item.update),
            delete: Boolean(item.delete),
        }

        return acc
    }, {});

    // -- mapper
    const keyOfSidebar = sidebar.keyOfData();
    const result = Object.fromEntries(
        keyOfSidebar.map(key => [key, access[key] ?? {
            read: false,
            create: false,
            update: false,
            delete: false,
        }]))

    groupStore.access = result;
    groupStore.display = 'FRM';
}

async function save() {
    const result = Object.entries(groupStore.access)
        .map(([sidebar_key, permission]) => ({
            sidebar_key,
            read: permission.read,
            create: permission.create,
            update: permission.update,
            delete: permission.delete,
        }));

    loading.value.onSave = true;
    const res = await saveAccess(result, groupStore.form.group_id);
    loading.value.onSave = false;

    if (!Response.isOk(res)) {
        toast.error(res.message);
        return;
    }

    toast.success("Saved permission access");
}

function init() {
    if (!groupStore.items.length) {
        groupStore.fetchData();
    }
}

onMounted(() => init());
</script>
<template>
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="m-6">
            <div class="mb-3">
                <h4 class="text-[22px] leading-none mb-1">
                    <LucideIcon icon="user-round-key" class="inline mr-1 w-5 h-5"></LucideIcon>
                    Groups
                </h4>
                <p class="text-sm text-muted-foreground">
                    Manage user groups and assign access permissions
                </p>
            </div>

            <div class="grid grid-cols-2">
                <div class="col-span-2 md:col-span-1">
                    <div v-if="groupStore.display == 'IDX'" class="border rounded-sm mb-2 bg-card shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead class="w-[20px]"></TableHead>
                                    <TableHead>Group Name</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-if="groupStore.items.length == 0">
                                    <TableCell :colspan="2" class="h-12 text-center text-muted-foreground">
                                        {{ groupStore.loading ? 'Fetching..' : 'No data available' }}
                                    </TableCell>
                                </TableRow>
                                <TableRow v-for="item, i in groupStore.items" :key="i">
                                    <TableCell>
                                        <Button @click="showAccess(item)" variant="ghost"
                                            class="h-8 w-8 p-0 cursor-pointer" :disabled="loading.onGet">
                                            <LucideIcon v-if="loading.onGet" icon="loader-circle"
                                                class="animate-spin" />
                                            <LucideIcon v-else icon="settings-2" />
                                        </Button>
                                    </TableCell>
                                    <TableCell>{{ item.name }}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <Card v-if="groupStore.display == 'FRM'" class="p-2 col-span-2 md:col-span-1">
                        <CardContent class="p-2">
                            <div class="mb-4">
                                <Button variant="default" size="sm" @click="groupStore.display = 'IDX'">
                                    <LucideIcon icon="arrow-left"></LucideIcon>
                                </Button>
                                <h3 class="inline mx-3 text-lg">{{ groupStore.form.group_name }}</h3>
                            </div>
                            <SidebarMenu>
                                <template v-for="item in sidebar.menus" :key="item.title">
                                    <!-- JIKA ADA CHILD -->
                                    <Collapsible v-if="item.items && item.items.length > 0" as-child
                                        :default-open="item.isActive" class="group/collapsible">
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger as-child>
                                                <SidebarMenuButton :tooltip="item.title" class="mb-1">
                                                    <LucideIcon :icon="item.icon" />
                                                    <span>{{ item.title }}</span>
                                                    <ChevronRight
                                                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    <SidebarMenuSubItem v-for="subItem in item.items"
                                                        :key="subItem.title">
                                                        <div class="border p-2 rounded-sm">
                                                            <div class="flex items-center justify-between w-full mb-2">
                                                                <a href="javascript:;" class="cursor-default text-sm">
                                                                    <span>{{ subItem.title }}</span>
                                                                </a>
                                                                <Badge variant="outline" class="ml-auto text-[10px]">
                                                                    {{ subItem.url }}
                                                                </Badge>
                                                            </div>

                                                            <div class="flex flex-wrap gap-4">
                                                                <label class="flex items-center gap-2 text-xs">
                                                                    <Checkbox
                                                                        v-model="groupStore.access[subItem.key].read" />
                                                                    <span>READ</span>
                                                                </label>

                                                                <label class="flex items-center gap-2 text-xs">
                                                                    <Checkbox
                                                                        v-model="groupStore.access[subItem.key].create" />
                                                                    <span>CREATE</span>
                                                                </label>

                                                                <label class="flex items-center gap-2 text-xs">
                                                                    <Checkbox
                                                                        v-model="groupStore.access[subItem.key].update" />
                                                                    <span>UPDATE</span>
                                                                </label>

                                                                <label class="flex items-center gap-2 text-xs">
                                                                    <Checkbox
                                                                        v-model="groupStore.access[subItem.key].delete" />
                                                                    <span>DELETE</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </SidebarMenuSubItem>
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>

                                    <!-- JIKA TIDAK ADA CHILD -->
                                    <SidebarMenuItem v-else>
                                        <SidebarMenuButton as-child :tooltip="item.title">
                                            <div class="flex items-center justify-between w-full">
                                                <a href="javascript:;" class="cursor-default flex items-center gap-2">
                                                    <LucideIcon :icon="item.icon" class="w-4 h-4" />
                                                    <span>{{ item.title }}</span>
                                                </a>
                                                <Badge variant="outline" class="ml-auto text-[10px]">
                                                    {{ item.url }}
                                                </Badge>
                                            </div>
                                            <div class="flex flex-wrap gap-4 mx-[35px] my-1">
                                                <label class="flex items-center gap-2 text-xs">
                                                    <Checkbox v-model="groupStore.access[item.key].read" />
                                                    <span>READ</span>
                                                </label>

                                                <label class="flex items-center gap-2 text-xs">
                                                    <Checkbox v-model="groupStore.access[item.key].create" />
                                                    <span>CREATE</span>
                                                </label>

                                                <label class="flex items-center gap-2 text-xs">
                                                    <Checkbox v-model="groupStore.access[item.key].update" />
                                                    <span>UPDATE</span>
                                                </label>

                                                <label class="flex items-center gap-2 text-xs">
                                                    <Checkbox v-model="groupStore.access[item.key].delete" />
                                                    <span>DELETE</span>
                                                </label>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </template>
                            </SidebarMenu>

                            <div class="flex gap-2 justify-end mt-4">
                                <Button variant="outline" @click="groupStore.display = 'IDX'"
                                    :disabled="loading.onSave">
                                    <LucideIcon icon="arrow-left" /> Back
                                </Button>
                                <Button @click="save()" :disabled="loading.onSave">
                                    <LucideIcon v-if="loading.onSave" icon="loader-circle" class="animate-spin" />
                                    <LucideIcon v-else icon="save" />
                                    {{ loading.onSave ? 'Saving..' : 'Save' }}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>