<template>
  <main-layout
    title="Login"
  >
    <div class="container">
      <label for="username">Username</label>
      <input
        id="username"
        v-model="username"
      />
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
      />
      <input
        type="button"
        value="Login"
        @click="login"
      />
    </div>
  </main-layout>
</template>

<script>
import MainLayout from '../layouts/Main.vue';
import request from '../utils/request';
import { navigate } from '../utils/utils';

export default {
  components: {
    MainLayout,
  },
  data: () => {
    return {
      username: '',
      password: '',
    };
  },
  created() {
    document.addEventListener('keypress', this.onKeyPress);
  },
  destroyed() {
    document.removeEventListener('keypress', this.onKeyPress);
  },
  methods: {
    onKeyPress(e: KeyboardEvent) {
      const keys = {
        ENTER: 13,
      };

      const key = e.which || e.keyCode;
      if (key === keys.ENTER) {
        this.login();
      }
    },
    async login() {
      try {
        await request.post({
          endpoint: 'http://localhost:3000/login',
          payload: {
            username: this.username,
            password: this.password,
          },
        });
        navigate.bind(this)('/');
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
  .container {
    display: flex;
    padding-top: 22%;
    flex-direction: column;
  }

  #password {
    margin-bottom: 15px;
  }

</style>
