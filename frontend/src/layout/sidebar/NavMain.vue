<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import LucideIcon from "@/components/LucideIcon.vue";
import type { SidebarMenu as SidebarMenuType } from "@/stores/sidebar";

defineProps<{
  items: SidebarMenuType[]
}>()

</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Features</SidebarGroupLabel>
    <SidebarMenu>
      <template v-for="item in items" :key="item.title">

        <!-- JIKA ADA CHILD -->
        <Collapsible v-if="item.items && item.items.length > 0" as-child :default-open="item.isActive"
          class="group/collapsible">
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
                    <RouterLink :to="subItem.url">
                      <span>{{ subItem.title }}</span>
                    </RouterLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        <!-- JIKA TIDAK ADA CHILD -->
        <SidebarMenuItem v-else>
          <SidebarMenuButton as-child :tooltip="item.title">
            <RouterLink :to="item.url">
              <LucideIcon :icon="item.icon" />
              <span>{{ item.title }}</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </template>
    </SidebarMenu>
  </SidebarGroup>
</template>
