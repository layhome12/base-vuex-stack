<script setup lang="ts">
import { computed, ref } from "vue";
import { useSidebarStore } from "@/stores/sidebar";
import { useAuthStore } from "@/stores/auth";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import Avatar from "@/components/ui/avatar/Avatar.vue";
import AvatarImage from "@/components/ui/avatar/AvatarImage.vue";
import AvatarFallback from "@/components/ui/avatar/AvatarFallback.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import LucideIcon from "@/components/LucideIcon.vue";
import Button from "@/components/ui/button/Button.vue";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import DialogContent from "@/components/ui/dialog/DialogContent.vue";
import DialogHeader from "@/components/ui/dialog/DialogHeader.vue";
import DialogTitle from "@/components/ui/dialog/DialogTitle.vue";
import DialogDescription from "@/components/ui/dialog/DialogDescription.vue";
import Label from "@/components/ui/label/Label.vue";
import Input from "@/components/ui/input/Input.vue";
import ErrorField, { type ErrorMessage } from "@/components/ErrorField.vue";
import { useProfileStore } from "@/stores/system/profile.store";
import Textarea from "@/components/ui/textarea/Textarea.vue";
import DialogFooter from "@/components/ui/dialog/DialogFooter.vue";
import Spinner from "@/components/ui/spinner/Spinner.vue";
import { saveProfile } from "@/apis/auth.api";
import { Response } from "@/lib/response";
import { toast } from "vue-sonner";

const sidebarStore = useSidebarStore();
const authStore = useAuthStore();
const profileStore = useProfileStore();

sidebarStore.setBreadcrumbs([
    {
        title: "My Account",
    },
]);

const dialog = ref(false);
const errorMessage = ref<ErrorMessage[]>([]);
const loading = ref({
    onSave: false,
});

const profile = computed(() => authStore.profile);
const initials = computed(() => profile.value.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((v: string) => v.charAt(0).toUpperCase())
    .join('')
);

function show() {
    profileStore.form = {
        name: profile.value.name,
        email: profile.value.email,
        picture: "",
        password: "",
        biodata: profile.value.biodata,
    }

    dialog.value = true;
}

async function save() {
    const data = profileStore.form;

    loading.value.onSave = true;
    const res = await saveProfile(data);
    loading.value.onSave = false;

    if (!Response.isOk(res)) {
        errorMessage.value = res.errors ?? [];
        toast.error(res.message);
        return;
    }

    // -- set
    authStore.profile.name = data.name;
    authStore.profile.email = data.email;
    authStore.profile.biodata = data.biodata;

    toast.success("Saved Successful");
    dialog.value = false;
}


</script>

<template>
    <div class="@container/main flex flex-1 flex-col">
        <div class="p-6">
            <div class="grid grid-cols-3">
                <div class="col-span-3 md:col-span-2">
                    <!-- Header -->
                    <div class="mb-6">
                        <h1 class="text-xl mb-1">
                            <LucideIcon icon="user" class="inline mr-1 w-5 h-5"></LucideIcon>
                            My Account
                        </h1>
                        <p class="text-sm text-muted-foreground">
                            View your account information and access details.
                        </p>
                    </div>

                    <div class="grid gap-3 lg:grid-cols-3">
                        <!-- Profile Card -->
                        <Card class="overflow-hidden p-0">
                            <div class="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

                            <CardContent class="-mt-18 flex flex-col items-center px-6 pb-6">
                                <Avatar class="h-24 w-24 border-4 border-background shadow-md">
                                    <AvatarImage :src="profile.picture ?? ''" :alt="profile.name" />
                                    <AvatarFallback class="text-3xl font-semibold text-[#898989]">
                                        {{ initials }}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 class="mt-3 text-xl font-semibold">
                                    {{ profile.name }}
                                </h2>
                                <p class="text-sm text-muted-foreground">
                                    {{ profile.username }}
                                </p>
                                <Badge class="mt-3 text-[10px]">
                                    <LucideIcon icon="badge-check" class="h-4 w-4" />
                                    {{ profile.group }}
                                </Badge>
                            </CardContent>
                        </Card>

                        <!-- Information -->
                        <Card class="lg:col-span-2">
                            <CardHeader class="flex flex-row items-start justify-between space-y-0">
                                <div>
                                    <CardTitle class="mb-1">
                                        Info Account
                                    </CardTitle>
                                    <CardDescription>
                                        Information your account.
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="lg" @click="show()">
                                    <LucideIcon icon="square-pen" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div class="grid gap-4 md:grid-cols-2">
                                    <div class="rounded-xl border p-4 transition-colors hover:bg-muted/40">
                                        <div class="mb-2 flex items-center gap-2">
                                            <LucideIcon icon="user" class="h-4 w-4 text-muted-foreground" />
                                            <span class="text-sm text-muted-foreground">
                                                Full Name
                                            </span>
                                        </div>
                                        <div class="font-medium">
                                            {{ profile.name }}
                                        </div>
                                    </div>
                                    <div class="rounded-xl border p-4 transition-colors hover:bg-muted/40">
                                        <div class="mb-2 flex items-center gap-2">
                                            <LucideIcon icon="at-sign" class="h-4 w-4 text-muted-foreground" />
                                            <span class="text-sm text-muted-foreground">
                                                Username
                                            </span>
                                        </div>
                                        <div class="font-medium">
                                            {{ profile.username }}
                                        </div>
                                    </div>
                                    <div class="rounded-xl border p-4 transition-colors hover:bg-muted/40">
                                        <div class="mb-2 flex items-center gap-2">
                                            <LucideIcon icon="mail" class="h-4 w-4 text-muted-foreground" />
                                            <span class="text-sm text-muted-foreground">
                                                Email Address
                                            </span>
                                        </div>
                                        <div class="font-medium break-all">
                                            {{ profile.email }}
                                        </div>
                                    </div>
                                    <div class="rounded-xl border p-4 transition-colors hover:bg-muted/40">
                                        <div class="mb-2 flex items-center gap-2">
                                            <LucideIcon icon="shield" class="h-4 w-4 text-muted-foreground" />
                                            <span class="text-sm text-muted-foreground">
                                                Access Group
                                            </span>
                                        </div>
                                        <div class="font-medium">
                                            {{ profile.group }}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Dialog v-model:open="dialog">
        <DialogContent class="sm:max-w-[540px]">
            <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                    Fill profile information below.
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-3 md:grid-cols-2">
                <div class="col-span-2 md:col-span-1">
                    <Label class="mb-2">Group</Label>
                    <Input v-model="authStore.profile.group" readonly />
                </div>
                <div class="col-span-2 md:col-span-1">
                    <Label class="mb-2">Name</Label>
                    <Input v-model="profileStore.form.name" placeholder="Enter full name" />
                    <ErrorField name="name" :data="errorMessage" />
                </div>
                <div class="col-span-2 md:col-span-1">
                    <Label class="mb-2">Email</Label>
                    <Input type="email" v-model="profileStore.form.email" placeholder="user@gmail.com" />
                    <ErrorField name="email" :data="errorMessage" />
                </div>
                <div class="col-span-2 md:col-span-1">
                    <Label class="mb-2">Password</Label>
                    <Input type="password" v-model="profileStore.form.password" placeholder="******" />
                    <ErrorField name="password" :data="errorMessage" />
                </div>
                <div class="col-span-2">
                    <Label class="mb-2">Biodata</Label>
                    <Textarea rows="5" v-model="profileStore.form.biodata" placeholder="Write short biodata.." />
                    <ErrorField name="biodata" :data="errorMessage" />
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" @click="dialog = false" :disabled="loading.onSave">
                    Cancel
                </Button>
                <Button @click="save" :disabled="loading.onSave">
                    <Spinner v-if="loading.onSave" class="animate-spin" />
                    <LucideIcon v-else icon="save" />
                    {{ loading.onSave ? "Saving.." : "Save" }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>