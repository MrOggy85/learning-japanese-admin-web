<template>
  <main-layout>
    <div class="new-sentence-box">
      <v-link
        href="/edit"
        :query="'mode=new'"
      >
        New Sentence
      </v-link>
    </div>
    <ul>
      <li
        v-for="sentence in sentences"
        :key="sentence._id"
      >
        <v-link
          href="/edit"
          :query="'mode=edit&sentence=' + sentence._id"
        >
          {{ capitalized(sentence.en) }}
        </v-link>
      </li>
    </ul>
  </main-layout>
</template>

<script>
import VLink from '../components/VLink.vue';
import MainLayout from '../layouts/Main.vue';
import request from '../utils/request';
import { capitalize } from '../utils/utils';

export default {
  components: {
    MainLayout,
    VLink,
  },
  data: () => {
    return {
      sentences: [],
    };
  },
  async created() {
    const {
      VUE_APP_API_ENDPOINT,
    } = process.env;
    // const result = await request.get({ endpoint: `${VUE_APP_API_ENDPOINT}/` });
    const result = [
      {
        _id: '8242849248957395',
        en: 'Example Sentence',
      },
    ];

    this.sentences = result;
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

  .header {
    color: #3B3B3B;
    cursor: pointer;
    text-decoration: none;
  }
  .header:hover {
    text-decoration: underline;
  }
  .header.active {
    font-weight: bold;
  }

  .content {
    font-size: 21px;
  }
  .description {
    white-space: pre-line;
    margin-top: 0;
    margin-bottom: 21px;
  }

  .buttons {
    display: flex;
    justify-content: space-around;
    align-items: center;

    font-size: 35px;
  }

  .new-sentence-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60%;
    font-size: 35px;
    /* padding: 50px 50px 0 50px;

    display: flex;
    flex-direction: column;
    width: 100%; */
    /* margin-bottom: 30px; */
  }

  @media (min-width: 420px) {
    ul {
      width: 40%;
    }
  }
</style>
