<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { signOut } from "@/apis/auth.api";
import { resetStores } from "@/lib/helper";
import LucideIcon from "@/components/LucideIcon.vue";

const { isMobile } = useSidebar()
const router = useRouter();
const auth = useAuthStore();

function picName() {
  return auth.profile.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((v: string) => v.charAt(0).toUpperCase())
    .join('')
}

const logout = () => {
  // -- clearing session
  signOut();

  // -- logout
  auth.logout();
  router.push("/");

  // -- clear stores
  resetStores();
};
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <Avatar class="h-8 w-8 rounded-lg grayscale">
              <AvatarImage :src="auth.profile.picture ?? ''" :alt="auth.profile.name" />
              <AvatarFallback class="rounded-lg">
                {{ picName() }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ auth.profile.name }}</span>
              <span class="text-muted-foreground truncate text-xs">
                {{ auth.profile.email }}
              </span>
            </div>
            <LucideIcon icon="ellipsis-vertical" class="ml-auto size-4"></LucideIcon>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'" :side-offset="4" align="end">
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="auth.profile.picture ?? ''" :alt="auth.profile.name" />
                <AvatarFallback class="rounded-lg">
                  {{ picName() }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">{{ auth.profile.name }}</span>
                <span class="text-muted-foreground truncate text-xs">
                  {{ auth.profile.email }}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem @click="router.push('/admin/profile')" class="cursor-pointer">
              <LucideIcon icon="user" />
              Account
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuItem @click="logout" class="cursor-pointer">
            <LucideIcon icon="log-out"></LucideIcon>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
