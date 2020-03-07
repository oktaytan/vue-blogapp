<template>
	<div>
		<a-row>
			<a-col
				:sm="24"
				:md="{ span: 10, offset: 0 }"
				style="margin-bottom: 2rem;"
			>
				<a-statistic
					title="Categories"
					:value="getCategories.length"
					style="margin-bottom: 1rem"
				>
					<template v-slot:prefix>
						<a-icon type="database" style="margin-right: 0.5rem" />
					</template>
				</a-statistic>
				<canvas style="margin-top: -4rem" id="categories"></canvas>
			</a-col>
			<a-col
				:sm="24"
				:md="{ span: 10, offset: 4 }"
				style="margin-bottom: 2rem;"
			>
				<a-statistic
					title="Authors"
					:value="authorsCount"
					style="margin-bottom: 1rem"
				>
					<template v-slot:prefix>
						<a-icon type="read" style="margin-right: 0.5rem" />
					</template>
				</a-statistic>
				<canvas style="margin-top: -4rem" id="authors"></canvas>
			</a-col>
		</a-row>
		<a-row>
			<a-col
				:sm="24"
				:md="{ span: 10, offset: 0 }"
				style="margin-bottom: 4rem;"
			>
				<a-statistic
					title="Latest Posts"
					value="2 posts"
					style="margin-bottom: 1rem;"
				>
					<template v-slot:prefix>
						<a-icon type="post" style="margin-right: 0.5rem" />
					</template>
				</a-statistic>
				<div v-if="isLoading">
					<a-skeleton active avatar :title="false" />
					<a-divider style="margin: 2rem 0"></a-divider>
					<a-skeleton active avatar :title="false" />
				</div>
				<a-list v-else itemLayout="horizontal">
					<a-list-item v-for="post in latestPost" :key="post.id">
						<a-comment :author="post.author" :avatar="avatar">
							<p slot="content">
								<span
									style="display: block; color: rgba(0, 0, 0, 0.4); margin-bottom: 5px"
									>{{ post.title }}</span
								>{{ post.body.substr(0, 80) + '...' }}
								<span @click="goPost(post.id)" class="post__link"
									><a-icon
										style="margin-right: 0.6rem"
										type="right-circle"
										theme="twoTone"
									/>Read</span
								>
							</p>
							<a-tooltip
								slot="datetime"
								:title="
									$moment(post.created_at)
										.add(3, 'hours')
										.format('DD-MM-YYYY HH:mm:ss')
								"
							>
								<span>{{
									$moment(post.created_at)
										.add(3, 'hours')
										.fromNow()
								}}</span>
							</a-tooltip>
						</a-comment>
					</a-list-item>
				</a-list>
			</a-col>
			<a-col
				:sm="24"
				:md="{ span: 10, offset: 4 }"
				style="margin-bottom: 4rem;"
			>
				<a-statistic
					title="Calendar"
					:value="date"
					style="margin-bottom: 1rem;"
				>
					<template v-slot:prefix>
						<a-icon type="calendar" style="margin-right: 0.5rem" />
					</template>
				</a-statistic>
				<div
					:style="{
						width: '100%',
						border: '1px solid #d9d9d9',
						borderRadius: '4px'
					}"
				>
					<a-calendar :fullscreen="false" @change="changeDate" />
				</div>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import avatar from '../assets/author.png';

export default {
	name: 'Home',
	components: {},
	data() {
		return {
			avatar,
			isLoading: true,
			labels: [],
			categoryData: {},
			authorData: {},
			categoryColors: [],
			authorColors: [],
			date: this.$moment(new Date()).format('DD / MM / YYYY'),
			latestPost: []
		};
	},
	mounted() {
		this.fetchCategories().then(() => {
			this.getCategories.forEach((item) => {
				this.categoryData[item.name] = 0;
				const randomColor =
					'#' + Math.floor(Math.random() * 16777215).toString(16);
				this.categoryColors.push(randomColor);
			});
			this.fetchPosts().then(() => {
				this.isLoading = false;
				this.latestPost = this.getPosts.splice(0, 2);
				this.getPosts.forEach((post) => {
					this.categoryData[post.category_name] += 1;
					this.authorData[post.author] = 0;
				});
				this.getPosts.forEach((post) => {
					this.authorData[post.author] += 1;
					const randomColor =
						'#' + Math.floor(Math.random() * 16777215).toString(16);
					this.authorColors.push(randomColor);
				});
				const chartCategory = {
					type: 'doughnut',
					data: {
						datasets: [
							{
								data: Object.values(this.categoryData),
								backgroundColor: this.categoryColors
							}
						],
						labels: Object.keys(this.categoryData)
					},
					options: {
						responsive: true,
						mode: 'nearest',
						aspectRatio: 1,
						legend: {
							position: 'left',
							fullWidth: true,
							labels: {
								boxWidth: 30,
								padding: 20,
								usePointStyle: true
							}
						},
						tooltips: {
							backgroundColor: '#021429'
						}
					}
				};
				const chartAuthor = {
					type: 'doughnut',
					data: {
						datasets: [
							{
								data: Object.values(this.authorData),
								backgroundColor: this.authorColors
							}
						],
						labels: Object.keys(this.authorData)
					},
					options: {
						responsive: true,
						mode: 'nearest',
						aspectRatio: 1,
						legend: {
							position: 'right',
							fullWidth: true,
							labels: {
								boxWidth: 30,
								padding: 20,
								usePointStyle: true
							}
						},
						tooltips: {
							backgroundColor: '#021429'
						}
					}
				};
				this.createChart('categories', chartCategory);
				this.createChart('authors', chartAuthor);
			});
		});
	},
	computed: {
		...mapGetters(['getCategories', 'getPosts']),
		authorsCount() {
			const authors = new Set(this.getPosts.map((post) => post.author));
			return [...authors].length;
		}
	},
	methods: {
		...mapActions(['fetchCategories', 'fetchPosts']),
		createChart(chartId, chartData) {
			const ctx = document.getElementById(chartId);
			const myChart = new this.$chart(ctx, {
				type: chartData.type,
				data: chartData.data,
				options: chartData.options
			});
		},
		changeDate(date) {
			this.date = date.format('DD / MM / YYYY');
		},
		goPost(id) {
			this.$router.push({ name: 'post', params: { id } });
		}
	}
};
</script>

<style scoped>
.marginRes {
	margin-top: 3rem;
}

.post__link {
	display: block;
	float: right;
	cursor: pointer;
	margin-top: 5px;
	transition: color 0.3s ease-out;
}

.post__link:hover {
	color: #2a8ff7;
}
</style>
