<template>
	<div>
		<div
			style="display: flex; justify-content: space-between; align-items: center"
		>
			<a-statistic value="All Posts" style="margin-right: 50px">
				<template v-slot:prefix>
					<a-icon type="read" style="margin-right: 0.7rem" />
				</template>
			</a-statistic>
			<div
				class="top__info"
				style="display: flex; justify-content: flex-end; align-items: center"
			>
				<a-tag color="blue" style="margin: 0"
					>{{ posts.length }} {{ posts.length > 1 ? 'posts' : 'post' }}</a-tag
				>
				<a-divider type="vertical"></a-divider>
				<a-tag color="red" style="margin: 0"
					>{{ categoryCount }}
					{{ categoryCount > 1 ? 'categories' : 'category' }}</a-tag
				>
				<a-divider type="vertical"></a-divider>
				<a-button type="primary" @click="addPost" size="small" icon="plus">
					Add
				</a-button>
			</div>
		</div>
		<a-divider></a-divider>
		<a-drawer
			:title="type === 'add' ? 'Add Post' : 'Update Post'"
			placement="right"
			:closable="false"
			:width="360"
			@close="onClose"
			:visible="visible"
		>
			<update-form
				:type="type"
				:selectedPost="selectedPost"
				@repeat-set="repeatSet"
				:visible="visible"
				@closeDrawer="onClose"
			/>
		</a-drawer>
		<div v-if="isPostLoading">
			<a-skeleton active />
			<a-skeleton active />
			<a-skeleton active />
		</div>
		<a-table
			:dataSource="posts"
			:columns="columns"
			v-else
			:rowKey="(record, index) => record.id"
			:pagination="{ position: 'bottom', size: 'small' }"
		>
			<div
				slot="filterDropdown"
				slot-scope="{
					setSelectedKeys,
					selectedKeys,
					confirm,
					clearFilters,
					column
				}"
				style="padding: 8px"
			>
				<a-input
					v-ant-ref="(c) => (searchInput = c)"
					:placeholder="`Search ${column.dataIndex}`"
					:value="selectedKeys[0]"
					@change="
						(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
					"
					@pressEnter="() => handleSearch(selectedKeys, confirm)"
					style="width: 188px; margin-bottom: 8px; display: block;"
				/>
				<a-button
					@click="() => handleReset(clearFilters)"
					size="small"
					style="width: 90px"
					>Reset</a-button
				>
				<a-button
					type="primary"
					@click="() => handleSearch(selectedKeys, confirm)"
					icon="search"
					size="small"
					style="width: 90px; margin-left: 8px"
					>Search</a-button
				>
			</div>
			<a-icon
				slot="filterIcon"
				slot-scope="filtered"
				type="search"
				:style="{ color: filtered ? '#108ee9' : undefined }"
			/>
			<template slot="data" slot-scope="text">
				<span v-if="searchText">
					<template
						v-for="(fragment, i) in text
							.toString()
							.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
					>
						<mark
							v-if="fragment.toLowerCase() === searchText.toLowerCase()"
							:key="i"
							class="highlight"
							>{{ fragment }}</mark
						>
						<template v-else>{{ fragment }}</template>
					</template>
				</span>
				<template v-else>{{ text }}</template>
			</template>
			<template slot="actions" slot-scope="record">
				<a slot="actions">
					<a-tooltip slot="suffix" title="Read Post">
						<a-icon type="eye" theme="twoTone" @click="goPost(record)" />
					</a-tooltip>
				</a>
				<a-divider type="vertical"></a-divider>
				<a slot="actions">
					<a-tooltip slot="suffix" title="Update">
						<a-icon type="edit" theme="twoTone" @click="updatePost(record)" />
					</a-tooltip>
				</a>
				<a-divider type="vertical"></a-divider>
				<a slot="actions">
					<a-tooltip slot="suffix" title="Delete">
						<span>
							<a-popconfirm
								title="Sure to delete?"
								@confirm="() => onDelete(record)"
							>
								<a-icon type="delete" theme="twoTone" twoToneColor="#eb4b2f" />
							</a-popconfirm>
						</span>
					</a-tooltip>
				</a>
			</template>
			<p slot="expandedRowRender" slot-scope="record" style="margin: 0">
				<a-card size="small" :title="record.title">
					<div slot="extra">
						<a-tag color="blue">{{
							$moment(record.created_at)
								.add(3, 'hours')
								.fromNow()
						}}</a-tag>
					</div>
					<p>{{ record.body }}</p>
				</a-card>
			</p>
		</a-table>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PostForm from '../components/PostForm';

export default {
	name: 'Posts',
	components: {
		'update-form': PostForm
	},
	data() {
		return {
			posts: [],
			type: 'add',
			visible: false,
			text: '',
			searchText: '',
			searchInput: null,
			columns: [
				{
					title: 'Title',
					dataIndex: 'title',
					key: 'title',
					scopedSlots: {
						filterDropdown: 'filterDropdown',
						filterIcon: 'filterIcon',
						customRender: 'data'
					},
					onFilter: (value, record) =>
						record.title
							.toString()
							.toLowerCase()
							.includes(value.toLowerCase()),
					onFilterDropdownVisibleChange: (visible) => {
						if (visible) {
							setTimeout(() => {
								this.searchInput.focus();
							}, 0);
						}
					}
				},
				{
					title: 'Author',
					dataIndex: 'author',
					key: 'author',
					scopedSlots: {
						filterDropdown: 'filterDropdown',
						filterIcon: 'filterIcon',
						customRender: 'data'
					},
					onFilter: (value, record) =>
						record.author
							.toString()
							.toLowerCase()
							.includes(value.toLowerCase()),
					onFilterDropdownVisibleChange: (visible) => {
						if (visible) {
							setTimeout(() => {
								this.searchInput.focus();
							});
						}
					}
				},
				{
					title: 'Category',
					dataIndex: 'category_name',
					key: 'category_name',
					scopedSlots: {
						filterDropdown: 'filterDropdown',
						filterIcon: 'filterIcon',
						customRender: 'data'
					},
					onFilter: (value, record) =>
						record.category_name
							.toString()
							.toLowerCase()
							.includes(value.toLowerCase()),
					onFilterDropdownVisibleChange: (visible) => {
						if (visible) {
							setTimeout(() => {
								this.searchInput.focus();
							});
						}
					}
				},
				{
					title: 'Actions',
					key: 'id',
					dataIndex: 'id',
					scopedSlots: { customRender: 'actions' }
				}
			],
			selectedPost: null,
			isPostLoading: true
		};
	},
	mounted() {
		this.setPosts();
	},
	computed: {
		...mapGetters(['getPosts']),
		categoryCount() {
			let categories = new Set(this.posts.map((post) => post.category_name));
			return [...categories].length;
		}
	},
	methods: {
		...mapActions(['fetchPosts', 'removePost']),
		setPosts() {
			this.fetchPosts().then(() => {
				this.posts = this.getPosts;
				this.isPostLoading = false;
			});
		},
		handleSearch(selectedKeys, confirm) {
			confirm();
			this.searchText = selectedKeys[0];
		},
		handleReset(clearFilters) {
			clearFilters();
			this.searchText = '';
		},
		showDrawer() {
			this.visible = true;
		},
		onClose() {
			this.visible = false;
			this.type = 'add';
		},
		repeatSet() {
			this.setPosts();
			this.type = 'add';
			this.visible = false;
		},
		onDelete(id) {
			this.removePost({ id })
				.then((data) => {
					if (data.status == 200) {
						this.$notification['success']({
							message: data.data.message
						});
						this.fetchPosts().then(() => this.setPosts());
					}
				})
				.catch((err) => {
					this.$notification['success']({
						message: err.message
					});
				});
		},
		addPost() {
			this.type = 'add';
			this.showDrawer();
		},
		updatePost(id) {
			this.type = 'update';
			this.showDrawer();
			let currentPost = this.posts.filter((item) => item.id === id);
			this.selectedPost = currentPost[0];
		},
		goPost(id) {
			this.$router.push({ name: 'post', params: { id } });
		}
	}
};
</script>

<style scoped>
.highlight {
	background-color: rgb(255, 192, 105);
	padding: 0px;
}

.table__link {
	color: grey;
}
.table__link:hover {
	color: #2a8ff7;
}
</style>
