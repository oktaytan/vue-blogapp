import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Categories from "../views/Categories.vue";
import Posts from "../views/Posts.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/categories",
    name: "categories",
    component: Categories
  },
  {
    path: "/posts",
    name: "posts",
    component: Posts
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
