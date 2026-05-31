<script setup lang="ts">
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
import { useSidebarStore } from '@/stores/sidebar';
import { useGroupStore } from '@/stores/system/groups.store';
import { ChevronRight } from 'lucide-vue-next';

const sidebar = useSidebarStore();
const groupStore = useGroupStore();

sidebar.setBreadcrumbs([
    {
        title: "System",
    },
    {
        title: "Groups",
    }
]);

function showAccess() {
    groupStore.display = 'FRM';
}
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
                                <TableRow>
                                    <TableCell>
                                        <Button @click="showAccess()" variant="ghost"
                                            class="h-8 w-8 p-0 cursor-pointer">
                                            <LucideIcon icon="settings-2" />
                                        </Button>
                                    </TableCell>
                                    <TableCell>Administrator</TableCell>
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
                                <h3 class="inline mx-3 text-lg">Administrator</h3>
                            </div>
                            <SidebarMenu>
                                <template v-for="item in sidebar.menus" :key="item.title">
                                    <!-- JIKA ADA CHILD -->
                                    <Collapsible v-if="item.items && item.items.length > 0" as-child
                                        :default-open="item.isActive" class="group/collapsible">
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger as-child>
                                                <SidebarMenuButton :tooltip="item.title">
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
                                                                    <Checkbox />
                                                                    <span>READ</span>
                                                                </label>

                                                                <label class="flex items-center gap-2 text-xs">
                                                                    <Checkbox />
                                                                    <span>CREATE</span>
                                                                </label>

                                                                <label class="flex items-center gap-2 text-xs">
                                                                    <Checkbox />
                                                                    <span>UPDATE</span>
                                                                </label>

                                                                <label class="flex items-center gap-2 text-xs">
                                                                    <Checkbox />
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
                                            <div class="flex flex-wrap gap-4 mx-[35px] mb-1">
                                                <label class="flex items-center gap-2 text-xs">
                                                    <Checkbox />
                                                    <span>READ</span>
                                                </label>

                                                <label class="flex items-center gap-2 text-xs">
                                                    <Checkbox />
                                                    <span>CREATE</span>
                                                </label>

                                                <label class="flex items-center gap-2 text-xs">
                                                    <Checkbox />
                                                    <span>UPDATE</span>
                                                </label>

                                                <label class="flex items-center gap-2 text-xs">
                                                    <Checkbox />
                                                    <span>DELETE</span>
                                                </label>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </template>
                            </SidebarMenu>

                            <div class="flex gap-2 justify-end mt-4">
                                <Button variant="outline" @click="groupStore.display = 'IDX'">
                                    <LucideIcon icon="arrow-left" /> Back
                                </Button>
                                <Button>
                                    <LucideIcon icon="save" />
                                    Save
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>