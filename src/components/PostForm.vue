<template>
	<a-form layout="vertical" :form="postForm" @submit="changePost">
		<a-form-item label="Title">
			<a-input
				placeholder="Title..."
				v-decorator="[
					'title',
					{
						rules: [{ required: true, message: 'Please input a title!' }]
					}
				]"
			>
				<a-tooltip
					slot="suffix"
					:title="type === 'add' ? 'Add a title' : 'Update title'"
				>
					<a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
				</a-tooltip>
			</a-input>
		</a-form-item>
		<a-form-item label="Body">
			<a-textarea
				placeholder="Write post"
				:rows="4"
				v-decorator="[
					'body',
					{
						rules: [{ required: true, message: 'Please input post body!' }]
					}
				]"
			/>
		</a-form-item>
		<a-form-item label="Author">
			<a-input
				placeholder="Author..."
				v-decorator="[
					'author',
					{
						rules: [{ required: true, message: 'Please input author name!' }]
					}
				]"
			>
				<a-tooltip
					slot="suffix"
					:title="
						type === 'add' ? 'Add name of author' : 'Update name of author'
					"
				>
					<a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
				</a-tooltip>
			</a-input>
		</a-form-item>
		<a-form-item label="Category" has-feedback>
			<a-select
				v-decorator="[
					'category',
					{ rules: [{ required: true, message: 'Please select a category!' }] }
				]"
				placeholder="Please select a category"
			>
				<a-select-option
					v-for="category in getCategories"
					:value="category.id"
					:key="category.id"
				>
					{{ category.name }}
				</a-select-option>
			</a-select>
		</a-form-item>
		<a-form-item
			style="display: flex; justify-content: flex-end; align-items: center"
		>
			<a-button
				type="link"
				style="margin-right: 1rem; color: orange"
				ghost
				@click="$emit('closeDrawer')"
			>
				Cancel
			</a-button>
			<a-button
				type="primary"
				:icon="type === 'add' ? 'plus' : 'edit'"
				html-type="submit"
			>
				{{ type == 'add' ? 'Add' : 'Update' }}
			</a-button>
		</a-form-item>
	</a-form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { capitalize } from '../utils/settings';

export default {
	name: 'PostForm',
	props: {
		type: {
			type: String,
			required: true
		},
		selectedPost: {
			type: Object
		},
		visible: {
			type: Boolean
		}
	},
	data() {
		return {
			title: '',
			author: '',
			body: '',
			category: '',
			postForm: null
		};
	},
	created() {
		this.fetchCategories();
		this.postForm = this.$form.createForm(this, {
			name: 'form',
			mapPropsToFields: () => {
				return {
					title: this.$form.createFormField({
						value: this.selectedPost && this.selectedPost.title
					}),
					author: this.$form.createFormField({
						value: this.selectedPost && this.selectedPost.author
					}),
					body: this.$form.createFormField({
						value: this.selectedPost && this.selectedPost.body
					}),
					category: this.$form.createFormField({
						value: this.selectedPost && this.selectedPost.category_id
					})
				};
			}
		});
	},
	watch: {
		selectedPost(val) {
			this.postForm.setFieldsValue({
				title: val.title,
				author: val.author,
				body: val.body,
				category: val.category_id
			});
		},
		type(val) {
			if (val === 'add') {
				this.postForm.setFieldsValue({ title: '' });
			} else {
				this.postForm.setFieldsValue({
					title: this.selectedPost && this.selectedPost.title,
					author: this.selectedPost && this.selectedPost.author,
					body: this.selectedPost && this.selectedPost.body,
					category: this.selectedPost && this.selectedPost.category_id
				});
			}
		},
		visible(val) {
			if (!val) {
				this.postForm.resetFields();
			}
		}
	},
	computed: {
		...mapGetters(['getCategories'])
	},
	methods: {
		...mapActions(['fetchPosts', 'fetchCategories', 'newPost', 'updatePost']),
		changePost(e) {
			e.preventDefault();
			this.postForm.validateFields((err, values) => {
				if (!err) {
					if (this.type === 'add') {
						const newPost = {
							title: capitalize(values.title),
							author: capitalize(values.author),
							body: values.body,
							category_id: values.category
						};
						this.newPost(newPost)
							.then((data) => {
								if (data.status == 200) {
									this.$notification['success']({
										message: data.data.message
									});
									this.fetchPosts().then(() => this.$emit('repeat-set'));
								}
							})
							.catch((err) => {
								this.$notification['success']({
									message: err.message
								});
							});
					} else if (this.type === 'update') {
						const updatedPost = {
							id: this.selectedPost.id,
							title: capitalize(values.title),
							author: capitalize(values.author),
							body: values.body,
							category_id: values.category
						};
						this.updatePost(updatedPost)
							.then((data) => {
								if (data.status == 200) {
									this.$notification['success']({
										message: data.data.message
									});
									this.fetchPosts().then(() => this.$emit('repeat-set'));
								}
							})
							.catch((err) => {
								this.$notification['success']({
									message: err.message
								});
							});
					}
				}
			});
			this.postForm.resetFields();
		}
	}
};
</script>
