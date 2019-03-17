
<template>
  <main-layout
    :title="title"
  >
    <div class="container">
      <div class="box">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="challenge.name"
        />
      </div>

      <div class="box">
        <label for="type">Type</label>
        <input
          id="type"
          v-model="challenge.type"
          readonly
        />
      </div>

      <div class="box tags-box">
        <label for="tags">Tags</label>
        <ul id="tags">
          <li
            v-for="(_, index) in challenge.tags"
            :key="index"
          >
            <select v-model="challenge.tags[index]">
              <option value="">--Please Select--</option>
              <option
                v-for="(tag, i) in tags"
                :key="i"
                :value="tag._id"
              >
                {{ tag.name }}
              </option>
            </select>
            <input
              type="button"
              value="X"
              @click="removeTag(index)"
            />
          </li>
        </ul>
        <input
          type="button"
          value="Add Tag"
          @click="addTag"
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
      challenge: {
        _id: '',
        name: '',
        type: 'simple',
        tags: [],
      },

      tags: [],
    };
  },
  computed: {
    title() {
      return this.challenge._id
        ? `Edit Challenge ${this.challenge._id}`
        : 'New Challenge';
    },

    isInputValid() {
      return !!this.challenge.name
        && !!this.challenge.type
        && this.challenge.tags.every(tag => tag);
    },
  },
  methods: {
    addTag() {
      this.challenge.tags.push('');
    },

    removeTag(index) {
      this.challenge.tags.splice(index, 1);
    },

    async send(event) {
      event.preventDefault();

      try {
        const method = this.challenge._id ? 'put' : 'post';

        const result = await request[method]({
          endpoint: `${VUE_APP_API_ENDPOINT}/challenge`,
          payload: this.challenge,
        });
        this.challenge = result;
      } catch (error) {
        handleError.bind(this)(error);
        return;
      }

      this.$root.currentRoute = `${BASE_URL}/list-challenges`;

      const sentenceId = new URLSearchParams(window.location.search).get('challenge') || '';

      if (window.history.state && sentenceId) {
        window.history.pushState(
          null,
          '',
          `${BASE_URL}/list-challenges`,
        );
      } else {
        window.history.back();
      }
    },
  },
  async created() {
    const challengeId = new URLSearchParams(window.location.search).get('challenge') || '';

    if (challengeId) {
      try {
        const result = await request.get({ endpoint: `${VUE_APP_API_ENDPOINT}/challenge/${challengeId}` });
        this.challenge = result;
      } catch (error) {
        handleError.bind(this)(error);
      }
    }

    try {
      const tags = await request.get({ endpoint: `${VUE_APP_API_ENDPOINT}/tag/` });
      this.tags = tags;
    } catch (error) {
      // handleError.bind(this)(error);
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

  .tags-box input[type=text] {
    flex: 1;
    font-size: 30px;
    margin-bottom: 10px;
    margin-right: 5px;
  }
  .tags-box input[type=button] {
    font-size: 20px;
    align-self: flex-start;
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
