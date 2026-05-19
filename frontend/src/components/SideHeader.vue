<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Breadcrumb from "./ui/breadcrumb/Breadcrumb.vue";
import BreadcrumbList from "./ui/breadcrumb/BreadcrumbList.vue";
import BreadcrumbItem from "./ui/breadcrumb/BreadcrumbItem.vue";
import BreadcrumbLink from "./ui/breadcrumb/BreadcrumbLink.vue";
import BreadcrumbPage from "./ui/breadcrumb/BreadcrumbPage.vue";
import BreadcrumbSeparator from "./ui/breadcrumb/BreadcrumbSeparator.vue";
import { useColorMode } from "@vueuse/core";
import DropdownMenu from "./ui/dropdown-menu/DropdownMenu.vue";
import DropdownMenuTrigger from "./ui/dropdown-menu/DropdownMenuTrigger.vue";
import DropdownMenuContent from "./ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "./ui/dropdown-menu/DropdownMenuItem.vue";
import LucideIcon from "./LucideIcon.vue";
import InputGroup from "./ui/input-group/InputGroup.vue";
import InputGroupInput from "./ui/input-group/InputGroupInput.vue";
import InputGroupAddon from "./ui/input-group/InputGroupAddon.vue";
import Badge from "./ui/badge/Badge.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import Dialog from "./ui/dialog/Dialog.vue";
import DialogContent from "./ui/dialog/DialogContent.vue";
import Command from "./ui/command/Command.vue";
import CommandInput from "./ui/command/CommandInput.vue";
import CommandList from "./ui/command/CommandList.vue";
import CommandEmpty from "./ui/command/CommandEmpty.vue";
import CommandGroup from "./ui/command/CommandGroup.vue";
import CommandItem from "./ui/command/CommandItem.vue";
import { useRouter } from "vue-router";
import { useSidebarStore } from "@/stores/sidebar";
import DialogTitle from "./ui/dialog/DialogTitle.vue";
import DialogHeader from "./ui/dialog/DialogHeader.vue";
import DialogDescription from "./ui/dialog/DialogDescription.vue";

const mode = useColorMode();
const router = useRouter();
const sidebar = useSidebarStore();
const open = ref(false);

const handleShortcut = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    open.value = true;
  }
}

const goTo = (path: string) => {
  router.push(path);
  open.value = false;
}

onMounted(() => {
  window.addEventListener("keydown", handleShortcut)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleShortcut)
})

</script>

<template>
  <header
    class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
    <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem class="hidden md:block">
            <BreadcrumbLink href="#">
              Main
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div class="ml-auto flex items-center gap-2">
        <div @click="open = true" class="cursor-pointer">
          <!-- Mobile -->
          <Button variant="outline" size="icon" class="sm:hidden">
            <LucideIcon icon="search" class="h-5 w-5" />
          </Button>

          <!-- Desktop -->
          <div class="hidden sm:block w-[180px]">
            <InputGroup>
              <InputGroupInput placeholder="Search.." disabled class="pointer-events-none" />
              <InputGroupAddon>
                <LucideIcon icon="search" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Badge variant="secondary" class="text-[10px] font-bold">
                  Ctrl + K
                </Badge>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="icon" class="relative">
              <LucideIcon icon="moon"
                class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <LucideIcon icon="sun"
                class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span class="sr-only">
                Toggle theme
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="mode = 'light'">
              <LucideIcon icon="sun" class="w-4 h-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem @click="mode = 'dark'">
              <LucideIcon icon="moon" class="w-4 h-4 mr-2" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem @click="mode = 'auto'">
              <LucideIcon icon="monitor" class="w-4 h-4 mr-2" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>

  <!-- Popup -->
  <Dialog v-model:open="open">
    <DialogContent class="overflow-hidden p-0 sm:max-w-xl [&>button]:hidden">
      <DialogHeader class="hidden">
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <Command>
        <CommandInput placeholder="Search menu..." />
        <CommandList>
          <CommandEmpty>
            Menu tidak ditemukan
          </CommandEmpty>
          <template v-for="parent in sidebar.menus" :key="parent.title">
            <!-- Parent tanpa child -->
            <CommandGroup v-if="parent.items.length === 0" heading="">
              <CommandItem :value="parent.title" @select="goTo(parent.url)" class="cursor-pointer">
                <LucideIcon :icon="parent.icon" class="mr-2 h-4 w-4" />
                <span>{{ parent.title }}</span>

                <Badge variant="outline" class="ml-auto text-[10px]">
                  {{ parent.url }}
                </Badge>
              </CommandItem>
            </CommandGroup>

            <!-- Parent dengan child -->
            <CommandGroup v-else :heading="parent.title">
              <CommandItem v-for="child in parent.items" :key="child.url" :value="child.title" @select="goTo(child.url)"
                class="cursor-pointer">
                <LucideIcon :icon="child.icon" class="mr-2 h-4 w-4" />
                <span>{{ child.title }}</span>

                <Badge variant="outline" class="ml-auto text-[10px]">
                  {{ child.url }}
                </Badge>
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </DialogContent>
  </Dialog>
</template>
