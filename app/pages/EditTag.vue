
<template>
  <main-layout
    :title="title"
  >
    <div class="container">
      <div class="box">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="tag.name"
        />
      </div>

      <hr style="width: 100%;" />

      <div class="box action-box">
        <v-link
          href="/"
          :back="true"
        >
          Back
        </v-link>
        <input
          type="button"
          value="Send"
          :disabled="!isInputValid"
          @click="send"
        />
      </div>
    </div>
  </main-layout>
</template>

<script>
// @flow

import VLink from '../components/VLink.vue';
import MainLayout from '../layouts/Main.vue';
import request from '../utils/request';
import { getBaseUrl, handleError } from '../utils/utils';
const BASE_URL = getBaseUrl();

const {
  VUE_APP_API_ENDPOINT,
} = process.env;

const app = {
  components: {
    MainLayout,
    VLink,
  },
  data() {
    return {
      tag: {
        _id: '',
        name: '',
      },
    };
  },
  computed: {
    title() {
      return this.tag._id
        ? `Edit Tag ${this.tag._id}`
        : 'New Tag';
    },

    isInputValid() {
      return !!this.tag.name;
    },
  },
  methods: {
    async send(event) {
      event.preventDefault();

      try {
        const method = this.tag._id ? 'put' : 'post';

        await request[method]({
          endpoint: `${VUE_APP_API_ENDPOINT}/tag`,
          payload: this.tag,
        });
      } catch (error) {
        handleError.bind(this)(error);
        return;
      }

      this.$root.currentRoute = `${BASE_URL}/list-tags`;

      const tagId = new URLSearchParams(window.location.search).get('tag') || '';

      if (window.history.state && tagId) {
        window.history.pushState(
          null,
          '',
          `${BASE_URL}/list-tags`,
        );
      } else {
        window.history.back();
      }
    },
  },
  async created() {
    const tagId = new URLSearchParams(window.location.search).get('tag') || '';

    if (tagId) {
      try {
        const result = await request.get({ endpoint: `${VUE_APP_API_ENDPOINT}/tag/${tagId}` });
        this.tag = result;
      } catch (error) {
        handleError.bind(this)(error);
      }
    }
  },
};

export default app;
</script>

<style scoped>
  input {
    font-size: 30px;
    padding-left: 10px;
  }

  label {
    margin-bottom: 5px;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  li {
    display: flex;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60%;
    padding: 50px 50px 0 50px;
  }

  .box {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 30px;
  }

  .action-box {
    flex-direction: row;
  }
  .action-box a {
    align-self: center;
    font-size: 30px;
    margin-right: 85px;
  }
  .action-box input {
    align-self: flex-start;
    width: auto;
    height: auto;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
    color: #5B5B5B;
  }
  .action-box input:hover {
    text-decoration: underline;
  }
  .action-box input:disabled {
    text-decoration: line-through;
    cursor: not-allowed;
  }
</style>
