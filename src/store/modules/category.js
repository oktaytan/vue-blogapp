import { ax } from "../../utils/settings";

const state = {
  categories: [],
  loading: false
};

const getters = {
  getCategories: state => state.categories,
  isLoading: state => state.loading
};

const actions = {
  fetchCategories: ({ commit }) => {
    return new Promise((resolve, reject) => {
      ax.get("/category/read.php")
        .then(res => {
          commit("setCategories", res.data);
          resolve(res.data);
        })
        .catch(err => reject(err));
    });
  },
  newCategory: ({ commit }, category) => {
    return new Promise((resolve, reject) => {
      ax.get("/category/read.php")
        .then(res => {
          let categoryIndex = res.data.findIndex(
            item => item.name === category.name
          );
          if (categoryIndex > 0) {
            reject({ message: "This category already exists." });
          } else {
            ax.post("/category/create.php", JSON.stringify(category))
              .then(res => resolve(res))
              .catch(err => reject(err));
          }
        })
        .catch(err => reject(err));
    });
  },
  updateCategory: ({ commit }, category) => {
    return new Promise((resolve, reject) => {
      ax.get("/category/read.php")
        .then(res => {
          let categoryIndex = res.data.findIndex(
            item => item.id === category.id
          );
          if (categoryIndex < 1) {
            reject({ message: "This category doesn't exists." });
          } else {
            ax.put("/category/update.php", JSON.stringify(category))
              .then(res => resolve(res))
              .catch(err => reject(err));
          }
        })
        .catch(err => reject(err));
    });
  },
  removeCategory: ({ commit }, id) => {
    return new Promise((resolve, reject) => {
      ax.post("/category/delete.php", JSON.stringify(id))
        .then(res => {
          resolve(res);
        })
        .catch(err => reject(err));
    });
  }
};

const mutations = {
  setCategories: (state, data) => (state.categories = data)
};

export default {
  state,
  getters,
  actions,
  mutations
};
