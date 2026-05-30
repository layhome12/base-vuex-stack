<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar"
import NavMain from "./NavMain.vue"
import NavUser from "./NavUser.vue"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useSidebarStore } from "@/stores/sidebar"
import { onMounted } from "vue"
import { useAuthStore } from "@/stores/auth.ts"
import SidebarMenu from "@/components/ui/sidebar/SidebarMenu.vue"
import SidebarMenuItem from "@/components/ui/sidebar/SidebarMenuItem.vue"
import SidebarMenuButton from "@/components/ui/sidebar/SidebarMenuButton.vue"
import LucideIcon from "@/components/LucideIcon.vue"

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})

const sidebar = useSidebarStore();
const auth = useAuthStore();

function init() {
  if (!sidebar.menus.length) {
    auth.getSidebarAccess();
  }
}

onMounted(() => init());
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <LucideIcon icon="diamond" class="size-4"></LucideIcon>
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight ml-1">
              <span class="truncate font-medium">
                App Dev
              </span>
              <span class="truncate text-xs">
                {{ auth.profile.group }}
              </span>
            </div>
            <LucideIcon icon="chevrons-up-down" class="ml-auto"></LucideIcon>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="sidebar.menus" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
