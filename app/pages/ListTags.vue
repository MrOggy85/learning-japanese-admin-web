<template>
  <main-layout
    title="Tags"
  >
    <div class="new-box">
      <v-link
        href="/edit-tag"
        extra-style="color:#43ab32"
      >
        New Tag
      </v-link>
    </div>
    <ul>
      <li
        v-for="tag in tags"
        :key="tag._id"
      >
        <v-link
          href="/edit-tag"
          :query="'tag=' + tag._id"
        >
          {{ capitalized(tag.name) }}
        </v-link>
      </li>
    </ul>
  </main-layout>
</template>

<script>
import VLink from '../components/VLink.vue';
import MainLayout from '../layouts/Main.vue';
import request from '../utils/request';
import { capitalize, handleError } from '../utils/utils';

export default {
  components: {
    MainLayout,
    VLink,
  },
  data: () => {
    return {
      tags: [],
    };
  },
  async created() {
    const {
      VUE_APP_API_ENDPOINT,
    } = process.env;
    try {
      const result = await request.get({ endpoint: `${VUE_APP_API_ENDPOINT}/tag` });
      this.tags = result;
    } catch (error) {
      handleError.bind(this)(error);
    }
  },
  methods: {
    capitalized(text) {
      return capitalize(text);
    },
  },
};
</script>

<style scoped>
  ul {
    margin-top: 60px;
    list-style: none;
    padding: 0;
    font-size: 40px;
    text-align: center;
    width: 85%;
  }
  li {
    margin-bottom: 10px;
  }

  .new-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60%;
    font-size: 35px;
  }

  @media (min-width: 420px) {
    ul {
      width: 40%;
    }
  }
</style>
