import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("@/views/login/Index.vue"),
    },
    {
      path: "/admin",
      component: () => import("@/layout/Admin.vue"),
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("@/views/admin/dashboard/index.vue"),
        },
        {
          path: "datatable",
          name: "datatable",
          component: () => import("@/views/admin/datatable/Index.vue"),
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

export default router;
