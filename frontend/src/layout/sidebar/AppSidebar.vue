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
import TeamSwitcher from "./TeamSwitcher.vue"

import { useSidebarStore } from "@/stores/sidebar"
import { onMounted } from "vue"
import { useAuthStore } from "@/stores/auth.ts"

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})

const sidebar = useSidebarStore();
const auth = useAuthStore();

const data = {
  teams: [
    {
      name: "MadHome Dev",
      logo: "gallery-vertical-end",
      plan: "Enterprise",
    },
  ],
}

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
      <TeamSwitcher :teams="data.teams" />
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
