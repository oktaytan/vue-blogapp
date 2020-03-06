import { ax } from "../../utils/settings";

const state = {
  posts: [],
  loading: false
};

const getters = {
  getPosts: state => state.posts,
  isPostLoading: state => state.loading
};

const actions = {
  fetchPosts: ({ commit }) => {
    return new Promise((resolve, reject) => {
      ax.get("/post/read.php")
        .then(res => {
          commit("setPosts", res.data);
          console.log(res.data);
          resolve(res.data);
        })
        .catch(err => reject(err));
    });
  },
  newPost: ({ commit }, post) => {
    return new Promise((resolve, reject) => {
      ax.get("/post/read.php")
        .then(res => {
          let postIndex = res.data.findIndex(
            item => item.name === post.name
          );
          if (postIndex > 0) {
            reject({ message: "This post already exists." });
          } else {
            ax.post("/post/create.php", JSON.stringify(post))
              .then(res => resolve(res))
              .catch(err => reject(err));
          }
        })
        .catch(err => reject(err));
    });
  },
  updatePost: ({ commit }, post) => {
    return new Promise((resolve, reject) => {
      ax.get("/post/read.php")
        .then(res => {
          let postIndex = res.data.findIndex(
            item => item.id === post.id
          );
          if (postIndex < 1) {
            reject({ message: "This post doesn't exists." });
          } else {
            ax.put("/post/update.php", JSON.stringify(post))
              .then(res => resolve(res))
              .catch(err => reject(err));
          }
        })
        .catch(err => reject(err));
    });
  },
  removePost: ({ commit }, id) => {
    return new Promise((resolve, reject) => {
      ax.post("/post/delete.php", JSON.stringify(id))
        .then(res => {
          resolve(res);
        })
        .catch(err => reject(err));
    });
  }
};

const mutations = {
  setPosts: (state, data) => (state.posts = data)
};

export default {
  state,
  getters,
  actions,
  mutations
};
