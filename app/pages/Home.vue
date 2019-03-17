<template>
  <main-layout>
    <ul>
      <li>
        <v-link
          href="/list-sentences"
        >
          Sentences
        </v-link>
      </li>
      <li>
        <v-link
          href="/list-challenges"
        >
          Challenges
        </v-link>
      </li>
      <li>
        <v-link
          href="/list-tags"
        >
          Tags
        </v-link>
      </li>
    </ul>
  </main-layout>
</template>

<script>
import VLink from '../components/VLink.vue';
import MainLayout from '../layouts/Main.vue';

export default {
  components: {
    MainLayout,
    VLink,
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

  @media (min-width: 420px) {
    ul {
      width: 40%;
    }
  }
</style>
