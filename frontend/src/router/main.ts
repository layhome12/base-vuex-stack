import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      meta: {
        guest: true,
      },
      component: () => import("@/views/login/Index.vue"),
    },
    {
      path: "/admin",
      meta: {
        requiresAuth: true,
      },
      component: () => import("@/layout/Admin.vue"),
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("@/views/admin/dashboard/Index.vue"),
        },
        {
          path: "system",
          name: "system",
          children: [
            {
              path: "users",
              name: "users",
              children: [
                {
                  path: "",
                  name: "user-index",
                  component: () =>
                    import("@/views/admin/system/users/Index.vue"),
                },
              ],
            },
            {
              path: "sidebars",
              name: "sidebars",
              children: [
                {
                  path: "",
                  name: "sidebar-index",
                  component: () =>
                    import("@/views/admin/system/sidebars/Index.vue"),
                },
              ],
            },
            {
              path: "groups",
              name: "groups",
              children: [
                {
                  path: "",
                  name: "group-index",
                  component: () =>
                    import("@/views/admin/system/groups/Index.vue"),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/layout/404.vue"),
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  const token = auth.token;

  // Sudah login -> tidak boleh ke login
  if (to.meta.guest && token) {
    return "/admin/dashboard";
  }

  // Belum login -> blok admin
  if (to.meta.requiresAuth && !token) {
    return "/";
  }

  return true;
});

export default router;
