<template>
  <div>
    <update-form
      :type="type"
      :selectedCategory="selectedCategory"
      @repeat-set="repeatSet"
    />
    <a-list
      class="category-list"
      :loading="isLoading"
      itemLayout="horizontal"
      :dataSource="categories"
    >
      <div
        v-if="showLoadingMore"
        slot="loadMore"
        :style="{
          textAlign: 'center',
          marginTop: '12px',
          height: '32px',
          lineHeight: '32px'
        }"
      >
        <a-spin v-if="loadingMore" />
        <a-button v-else @click="onLoadMore">Load More</a-button>
      </div>
      <a-list-item key="item.id" slot="renderItem" slot-scope="item">
        <a slot="actions" v-if="type === 'add'">
          <a-tooltip slot="suffix" title="Edit">
            <a-icon
              type="edit"
              theme="twoTone"
              @click="updateCategory(item.id)"
            />
          </a-tooltip>
        </a>
        <a slot="actions" v-else>
          <a-tooltip slot="suffix" title="Cancel">
            <a-icon
              type="close-circle"
              theme="twoTone"
              @click="cancelUpdate()"
            />
          </a-tooltip>
        </a>
        <a slot="actions">
          <a-tooltip slot="suffix" title="Delete">
            <a-popconfirm
              title="Sure to delete?"
              @confirm="() => deleteCategory(item.id)"
            >
              <a-icon type="delete" theme="twoTone" twoToneColor="#eb4b2f" />
            </a-popconfirm>
          </a-tooltip>
        </a>
        <div>
          <a-icon slot="avatar" type="database" style="margin-right: 0.6rem" />
          <span>{{ item.name }}</span>
          <a-tooltip
            slot="datetime"
            :title="
              $moment(item.created_at).format('DD / MM / YYYY, h:mm:ss a')
            "
          >
            <span style="fontSize: 0.8rem; color: rgba(0,0,0,0.4)">{{
              "  -  added  " +
                $moment(item.created_at)
                  .add(3, "hours")
                  .fromNow()
            }}</span>
          </a-tooltip>
        </div>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import CategoryForm from "../components/CategoryForm";

export default {
  name: "Categories",
  components: {
    "update-form": CategoryForm
  },
  data() {
    return {
      loadingMore: false,
      showLoadingMore: true,
      categories: [],
      selectedCategory: null,
      showLimit: 5,
      type: "add"
    };
  },
  mounted() {
    this.setCategories();
  },
  computed: {
    ...mapGetters(["getCategories", "isLoading"])
  },
  methods: {
    ...mapActions(["fetchCategories", "removeCategory"]),
    setCategories() {
      this.fetchCategories().then(() => {
        if (this.getCategories.length >= 5) {
          this.categories = this.getCategories.splice(0, this.showLimit);
        } else {
          this.categories = this.getCategories;
        }
      });
    },
    updateCategory(id) {
      this.type = "update";
      let category = this.categories.filter(item => item.id === id);
      this.selectedCategory = category[0];
    },
    repeatSet() {
      this.setCategories();
      this.type = "add";
    },
    cancelUpdate() {
      this.type = "add";
    },
    deleteCategory(id) {
      this.removeCategory({ id })
        .then(data => {
          if (data.status == 200) {
            this.$notification["success"]({
              message: data.data.message
            });
            this.fetchCategories().then(() => this.setCategories());
          }
        })
        .catch(err => {
          this.$notification["success"]({
            message: err.message
          });
        });
    },
    onLoadMore() {
      this.loadingMore = true;
      this.fetchCategories().then(() => {
        this.showLimit += 5;
        this.categories = this.getCategories.splice(0, this.showLimit);
        this.loadingMore = false;
      });
    }
  }
};
</script>

<style scoped>
.category-list {
  min-height: 350px;
}
</style>
