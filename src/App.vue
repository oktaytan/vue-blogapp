<template>
  <a-layout id="app-layout">
    <a-layout-sider
      breakpoint="lg"
      :trigger="null"
      collapsible
      v-model="collapsed"
    >
      <div class="logo">
        <router-link to="/">
          <img v-if="!collapsed" :src="logo" alt="logo" />
          <a-icon v-else type="home" style="color: white" />
        </router-link>
      </div>
      <a-menu theme="dark" mode="inline">
        <a-menu-item>
          <router-link to="/categories">
            <a-icon type="database" />
            <span class="nav-text">Categories</span>
          </router-link>
        </a-menu-item>
        <a-menu-item>
          <router-link to="/posts">
            <a-icon type="read" />
            <span class="nav-text">Posts</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        :style="{
          background: '#fff',
          padding: 0,
          display: 'flex',
          alignItems: 'center'
        }"
      >
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <a-breadcrumb style="margin-top: -8px">
          <a-breadcrumb-item>
            <router-link to="/">
              <a-icon type="home" />
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-if="$route.name !== 'home'">
            <span>{{ routeName }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div
          :style="{ padding: '24px', background: '#fff', minHeight: '360px' }"
        >
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer style="textAlign: center;">
        {{ "&copy; Blog App  " + new Date().getFullYear() }}
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import logo from "@/assets/logo.png";

export default {
  name: "app",
  data: () => ({
    logo: logo,
    collapsed: false
  }),
  computed: {
    routeName() {
      const name = this.$route.name;
      if (name !== "home") {
        return name.charAt(0).toUpperCase() + name.substr(1);
      }
      return "";
    }
  },
  methods: {}
};
</script>

<style>
#app-layout {
  min-height: 100vh;
}

#app-layout .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#app-layout .trigger:hover {
  color: #1890ff;
}

#app-layout .logo {
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  padding: 0.3rem 1rem;
}

#app-layout .logo img {
  width: 100%;
  transform: scaleX(0.9);
}

.link {
  color: rgba(255, 255, 255, 0.65);
}

a:focus {
  text-decoration: none !important;
}
</style>