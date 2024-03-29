import Vue from "vue";
import VueRouter from "vue-router";
import Landing from "../views/Landing.vue";
import Dashboard from "../views/Dashboard.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Landing,
    meta: {
      title: "Home - YTTracker",
    },
  },
  {
    path: "/playlists",
    name: "Playlists",
    component: Dashboard,
    meta: {
      title: "Playlists - YTTracker",
      breadCrumbs: [
        {
          text: "Home",
          to: {
            path: "/",
          },
        },
        {
          text: "Playlists",
        },
      ],
    },
  },
  {
    path: "/playlist/:id",
    name: "Videos",
    component: Dashboard,
    meta: {
      title: "Playlist - YTTracker",
      breadCrumbs: [
        {
          text: "Home",
          to: {
            path: "/",
          },
        },
        {
          text: "Playlists",
          to: {
            path: "/playlists",
          },
        },
        {
          text: "Videos",
        },
      ],
    },
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.afterEach((to) => {
  // https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    document.title = to.meta.title || "YTTracker App";
  });
});

export default router;
