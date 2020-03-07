<template>
	<a-layout id="app-layout">
		<a-layout-sider
			breakpoint="lg"
			:trigger="null"
			collapsible
			v-model="collapsed"
		>
			<router-link to="/" exact>
				<div class="logo">
					<img v-if="!collapsed" :src="logo" alt="logo" />
					<a-icon v-else type="home" style="color: white" />
				</div>
			</router-link>
			<a-menu theme="dark" mode="inline" :selectable="false">
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
					alignItems: 'center',
					position: 'relative'
				}"
			>
				<a-icon
					class="trigger"
					:type="collapsed ? 'menu-unfold' : 'menu-fold'"
					@click="() => (collapsed = !collapsed)"
				/>
				<span
					style="position: absolute; top: 50%; right: 2rem; transform: translateY(-50%)"
				>
					<a-dropdown :trigger="['click']">
						<span class="user__link">
							<a-avatar :src="avatar" />
							<span style="display: inline-block; margin-left: 0.6rem;"
								>John Doe</span
							>
						</span>
						<a-menu slot="overlay">
							<a-menu-item key="0"
								><a-icon type="user" /> My profile
							</a-menu-item>
							<a-menu-item key="1"
								><a-icon type="setting" />Settings
							</a-menu-item>
							<a-menu-divider />
							<a-menu-item key="3"><a-icon type="logout" />Logout</a-menu-item>
						</a-menu>
					</a-dropdown>
				</span>
				<a-breadcrumb style="margin-top: -6px;">
					<a-breadcrumb-item>
						<router-link to="/">
							<a-icon type="home" />
						</router-link>
					</a-breadcrumb-item>
					<a-breadcrumb-item v-if="$route.name !== 'home'">
						<span>{{ routeName }}</span>
					</a-breadcrumb-item>
					<a-breadcrumb-item v-if="$route.name === 'post'">
						<span>{{ $route.params.id }}</span>
					</a-breadcrumb-item>
				</a-breadcrumb>
			</a-layout-header>
			<a-layout-content :style="{ margin: '24px 16px 0' }">
				<div
					:style="{ padding: '24px', background: '#fff', minHeight: '600px' }"
				>
					<router-view />
				</div>
			</a-layout-content>
			<a-layout-footer style="textAlign: center;">
				{{ '&copy; Blog App  ' + new Date().getFullYear() }}
			</a-layout-footer>
		</a-layout>
	</a-layout>
</template>

<script>
import logo from '@/assets/logo.png';
import avatar from '@/assets/author.png';

export default {
	name: 'app',
	data: () => ({
		logo: logo,
		collapsed: false,
		avatar
	}),
	computed: {
		routeName() {
			const name = this.$route.name;
			if (name !== 'home') {
				return name.charAt(0).toUpperCase() + name.substr(1);
			}
			return '';
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

.user__link {
	cursor: pointer;
}

.user__link:hover > span {
	color: #2a8ff7;
}
</style>
