<script setup lang="ts">
import { removeSidebar, saveSidebar } from '@/apis/sidebars.api';
import ErrorField, { type ErrorMessage } from '@/components/ErrorField.vue';
import LucideIcon from '@/components/LucideIcon.vue';
import AlertDialog from '@/components/ui/alert-dialog/AlertDialog.vue';
import AlertDialogAction from '@/components/ui/alert-dialog/AlertDialogAction.vue';
import AlertDialogCancel from '@/components/ui/alert-dialog/AlertDialogCancel.vue';
import AlertDialogContent from '@/components/ui/alert-dialog/AlertDialogContent.vue';
import AlertDialogDescription from '@/components/ui/alert-dialog/AlertDialogDescription.vue';
import AlertDialogFooter from '@/components/ui/alert-dialog/AlertDialogFooter.vue';
import AlertDialogHeader from '@/components/ui/alert-dialog/AlertDialogHeader.vue';
import AlertDialogTitle from '@/components/ui/alert-dialog/AlertDialogTitle.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import Collapsible from '@/components/ui/collapsible/Collapsible.vue';
import CollapsibleContent from '@/components/ui/collapsible/CollapsibleContent.vue';
import CollapsibleTrigger from '@/components/ui/collapsible/CollapsibleTrigger.vue';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import DialogContent from '@/components/ui/dialog/DialogContent.vue';
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue';
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue';
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import Select from '@/components/ui/select/Select.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import SidebarMenu from '@/components/ui/sidebar/SidebarMenu.vue';
import SidebarMenuButton from '@/components/ui/sidebar/SidebarMenuButton.vue';
import SidebarMenuItem from '@/components/ui/sidebar/SidebarMenuItem.vue';
import SidebarMenuSub from '@/components/ui/sidebar/SidebarMenuSub.vue';
import SidebarMenuSubButton from '@/components/ui/sidebar/SidebarMenuSubButton.vue';
import SidebarMenuSubItem from '@/components/ui/sidebar/SidebarMenuSubItem.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import { Response } from '@/lib/response';
import { useSidebarStore } from '@/stores/sidebar';
import { ChevronRight } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';

const sidebarStore = useSidebarStore();
const dialog = ref({
    save: false,
    remove: false
});
const loading = ref({
    onSave: false,
    onRemove: false,
});
const errorMessage = ref<ErrorMessage[]>([]);

sidebarStore.setBreadcrumbs([
    {
        title: "System",
    },
    {
        title: "Sidebars",
    }
]);

function init() {
    if (!sidebarStore.menus.length) {
        sidebarStore.fetchData();
    }
}

function create() {
    sidebarStore.resetForm();

    errorMessage.value = [];
    dialog.value.save = true;
}

async function save() {
    loading.value.onSave = true;
    const res = await saveSidebar(sidebarStore.form);
    loading.value.onSave = false;

    if (!Response.isOk(res)) {
        errorMessage.value = res.errors ?? [];
        toast.error(res.message);
        return;
    }

    dialog.value.save = false;
    toast.success("Saved successfull");

    sidebarStore.fetchData();
}

async function remove() {
    loading.value.onRemove = true;
    const res = await removeSidebar(sidebarStore.form.key);
    loading.value.onRemove = false;

    if (!Response.isOk(res)) {
        errorMessage.value = res.errors ?? [];
        toast.error(res.message);
        return;
    }

    dialog.value.remove = false;
    toast.success("Remove successfull");

    sidebarStore.fetchData();
}

function dialogRemoveShow(key: string) {
    sidebarStore.form.key = key;
    dialog.value.remove = true;
}

onMounted(() => init());

</script>

<template>
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="m-6">
            <div class="mb-3">
                <h4 class="text-[22px] leading-none mb-1">
                    <LucideIcon icon="columns-3-cog" class="inline mr-1 w-5 h-5"></LucideIcon>
                    Sidebars
                </h4>
                <p class="text-sm text-muted-foreground">
                    Configure sidebar menus and navigation access
                </p>
            </div>

            <div class="grid grid-cols-2">
                <Card class="p-2 col-span-2 md:col-span-1">
                    <CardContent class="p-2">
                        <Button variant="default" size="sm" class="mb-4"
                            @click="create">
                            <LucideIcon icon="plus"></LucideIcon>
                        </Button>
                        <SidebarMenu>
                            <template v-for="item in sidebarStore.menus" :key="item.title">
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
                                                <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                                                    <SidebarMenuSubButton as-child>
                                                        <div class="flex items-center justify-between w-full">
                                                            <a href="javascript:;" class="cursor-default">
                                                                <span>{{ subItem.title }}</span>
                                                            </a>
                                                            <Badge variant="outline" class="ml-auto text-[10px]">
                                                                {{ subItem.url }}
                                                            </Badge>
                                                            <button type="button"
                                                                class="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                                                                @click="dialogRemoveShow(subItem.key)">
                                                                <LucideIcon icon="trash-2" class="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </SidebarMenuSubButton>
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
                                            <button type="button"
                                                class="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                                                @click="dialogRemoveShow(item.key)">
                                                <LucideIcon icon="trash-2" class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </template>
                        </SidebarMenu>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>

    <Dialog v-model:open="dialog.save">
        <DialogContent class="sm:max-w-[540px]">
            <DialogHeader class="mb-2 text-left">
                <DialogTitle>Sidebar</DialogTitle>
                <DialogDescription>
                    Fill information below.
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-3 md:grid-cols-6">
                <div class="col-span-3 md:col-span-3">
                    <Label class="mb-2">Parent</Label>
                    <Select v-model="sidebarStore.form.parent_key">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Parent" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem :value="null">
                                Parent
                            </SelectItem>
                            <SelectItem v-for="(item, i) in sidebarStore.parentOfChild()" :key="i" :value="item.key">
                                {{ item.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <ErrorField name="parent_key" :data="errorMessage" />
                </div>
                <div class="col-span-3 md:col-span-3">
                    <Label class="mb-2">Key</Label>
                    <Input placeholder="menu_key" v-model="sidebarStore.form.key" />
                    <ErrorField name="key" :data="errorMessage" />
                </div>
                <div class="col-span-6 md:col-span-3">
                    <Label class="mb-2">Name</Label>
                    <Input placeholder="Menu #1" v-model="sidebarStore.form.name" />
                    <ErrorField name="name" :data="errorMessage" />
                </div>
                <div class="col-span-3 md:col-span-2">
                    <Label class="mb-2">Icon</Label>
                    <Input placeholder="lucide-icon" v-model="sidebarStore.form.icon" />
                    <ErrorField name="icon" :data="errorMessage" />
                </div>
                <div class="col-span-3 md:col-span-1">
                    <Label class="mb-2">Seq</Label>
                    <Input placeholder="1" type="number" v-model="sidebarStore.form.seq" />
                    <ErrorField name="seq" :data="errorMessage" />
                </div>
                <div class="col-span-6">
                    <Label class="mb-2">Route</Label>
                    <Input placeholder="/admin/feature" v-model="sidebarStore.form.route" />
                    <ErrorField name="route" :data="errorMessage" />
                </div>
            </div>
            <DialogFooter class="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                <Button variant="outline" @click="dialog.save = false" :disabled="loading.onSave">
                    Cancel
                </Button>
                <Button @click="save()" :disabled="loading.onSave">
                    <Spinner v-if="loading.onSave" class="animate-spin" />
                    <LucideIcon v-else icon="save" />
                    {{ loading.onSave ? "Saving.." : "Save" }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    <AlertDialog v-model:open="dialog.remove">
        <AlertDialogContent class="sm:max-w-[400px]">
            <AlertDialogHeader>
                <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
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
            <AlertDialogFooter class="mt-4 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                <AlertDialogCancel class="my-0" @click="dialog.remove = false" :disabled="loading.onRemove">
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction @click="remove()" class="bg-destructive text-white hover:bg-destructive/90"
                    :disabled="loading.onRemove">
                    <Spinner v-if="loading.onRemove" class="animate-spin" />
                    <LucideIcon v-else icon="trash-2" class="mr-1" />
                    {{ loading.onRemove ? "Deleting.." : "Delete" }}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>