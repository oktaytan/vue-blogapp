<template>
  <a-form layout="vertical" :form="categoryForm" @submit="changeCategory">
    <a-form-item :label="type == 'add' ? 'Add Category' : 'Update Category'">
      <a-input
        placeholder="Category name..."
        v-decorator="[
          'category',
          {
            rules: [
              { required: true, message: 'Please input a category name!' }
            ]
          }
        ]"
      >
        <a-icon slot="prefix" type="database" />
        <a-tooltip
          slot="suffix"
          :title="type === 'add' ? 'Add a category' : 'Update category'"
        >
          <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
        </a-tooltip>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button
        type="primary"
        :icon="type === 'add' ? 'plus' : 'edit'"
        html-type="submit"
      >
        {{ type == "add" ? "Add" : "Update" }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { capitalize } from "../utils/settings";

export default {
  name: "UpdateForm",
  props: {
    type: {
      type: String,
      required: true
    },
    selectedCategory: {
      type: Object
    }
  },
  data() {
    return {
      category: "",
      categoryForm: null
    };
  },
  created() {
    this.categoryForm = this.$form.createForm(this, {
      name: "form",
      mapPropsToFields: () => {
        return {
          category: this.$form.createFormField({
            value: this.selectedCategory && this.selectedCategory.name
          })
        };
      }
    });
  },
  watch: {
    selectedCategory(val) {
      this.categoryForm.setFieldsValue({ category: val.name });
    },
    type(val) {
      if (val === "add") {
        this.categoryForm.setFieldsValue({ category: "" });
      }
    }
  },
  methods: {
    ...mapActions(["fetchCategories", "newCategory", "updateCategory"]),
    changeCategory(e) {
      e.preventDefault();
      this.categoryForm.validateFields((err, values) => {
        if (!err) {
          if (this.type === "add") {
            const newCategory = {
              name: capitalize(values.category)
            };
            this.newCategory(newCategory)
              .then(data => {
                if (data.status == 200) {
                  this.$notification["success"]({
                    message: data.data.message
                  });
                  this.fetchCategories();
                }
              })
              .catch(err => {
                this.$notification["success"]({
                  message: err.message
                });
              });
          } else if (this.type === "update") {
            const updatedCategory = {
              id: this.selectedCategory.id,
              name: capitalize(values.category)
            };
            this.updateCategory(updatedCategory)
              .then(data => {
                if (data.status == 200) {
                  this.$notification["success"]({
                    message: data.data.message
                  });
                  this.fetchCategories().then(() => this.$emit("repeat-set"));
                }
              })
              .catch(err => {
                this.$notification["success"]({
                  message: err.message
                });
              });
          }
        }
      });
      this.categoryForm.resetFields();
    }
  }
};
</script>