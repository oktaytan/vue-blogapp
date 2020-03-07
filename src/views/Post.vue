<template>
	<div>
		<div
			style="display: flex; justify-content: space-between; align-items: center"
		>
			<h2>{{ post.title }}</h2>
			<a-button type="link" @click="$router.go(-1)">Back</a-button>
		</div>
		<a-divider></a-divider>
		<a-comment>
			<template slot="actions">
				<span>
					<a-tooltip title="Like">
						<a-icon
							type="like"
							:theme="action === 'liked' ? 'filled' : 'outlined'"
							@click="like"
						/>
					</a-tooltip>
					<span style="padding-left: '8px';cursor: 'auto'">
						{{ likes }}
					</span>
				</span>
				<span>
					<a-tooltip title="Dislike">
						<a-icon
							type="dislike"
							:theme="action === 'disliked' ? 'filled' : 'outlined'"
							@click="dislike"
						/>
					</a-tooltip>
					<span style="padding-left: '8px';cursor: 'auto'">
						{{ dislikes }}
					</span>
				</span>
			</template>
			<a slot="author">{{ post.author }}</a>
			<a-avatar
				src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
				:alt="post.author"
				slot="avatar"
			/>
			<p slot="content">
				{{ post.body }}
			</p>
			<a-tooltip
				slot="datetime"
				:title="$moment(post.created_at).format('YYYY-MM-DD HH:mm:ss')"
			>
				<span>{{ $moment(post.created_at).fromNow() }}</span>
			</a-tooltip>
		</a-comment>
		<div>
			<a-list
				v-if="comments.length"
				:dataSource="comments"
				:header="
					`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`
				"
				itemLayout="horizontal"
			>
				<a-list-item slot="renderItem" slot-scope="item">
					<a-comment
						:author="item.author"
						:avatar="item.avatar"
						:content="item.content"
						:datetime="item.datetime"
					>
					</a-comment>
				</a-list-item>
			</a-list>
			<a-comment>
				<a-avatar
					slot="avatar"
					src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
					alt="Han Solo"
				/>
				<div slot="content">
					<a-form-item>
						<a-textarea
							:rows="4"
							@change="handleChange"
							:value="value"
						></a-textarea>
					</a-form-item>
					<a-form-item>
						<a-button
							htmlType="submit"
							:loading="submitting"
							@click="handleSubmit"
							type="primary"
						>
							Add Comment
						</a-button>
					</a-form-item>
				</div>
			</a-comment>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import avatar from '../assets/author.png';

export default {
	name: 'Post',
	data() {
		return {
			avatar,
			post: {},
			loading: true,
			likes: 0,
			dislikes: 0,
			action: null,
			comments: [],
			submitting: false,
			value: ''
		};
	},
	mounted() {
		this.fetchSinglePost(this.$route.params.id).then(() => {
			this.post = this.getPost;
			this.loading = false;
		});
	},
	computed: {
		...mapGetters(['getPost'])
	},
	methods: {
		...mapActions(['fetchSinglePost']),
		like() {
			this.likes = 1;
			this.dislikes = 0;
			this.action = 'liked';
		},
		dislike() {
			this.likes = 0;
			this.dislikes = 1;
			this.action = 'disliked';
		},
		handleSubmit() {
			if (!this.value) {
				return;
			}

			this.submitting = true;

			setTimeout(() => {
				this.submitting = false;
				this.comments = [
					{
						author: this.post.author,
						avatar: this.avatar,
						content: this.value,
						datetime: this.$moment().fromNow()
					},
					...this.comments
				];
				this.value = '';
			}, 1000);
		},
		handleChange(e) {
			this.value = e.target.value;
		}
	}
};
</script>
