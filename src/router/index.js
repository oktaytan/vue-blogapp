import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Categories from "../views/Categories.vue";
import Posts from "../views/Posts.vue";
import Post from "../views/Post.vue";

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
  },
  {
    path: "/posts/:id",
    name: "post",
    component: Post
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
