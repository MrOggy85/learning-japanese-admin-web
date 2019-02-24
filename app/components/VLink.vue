<template>
  <a
    :href="fullHref"
    @click="go"
  >
    <slot />
  </a>
</template>

<script>
import { getBaseUrl } from '../utils/utils';
const BASE_URL = getBaseUrl();

export default {
  props: {
    href: {
      type: String,
      required: true,
    },
    query: {
      type: String,
      required: false,
      default: '',
    },
    replace: {
      type: Boolean,
      required: false,
      default: false,
    },
    back: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    fullHref() {
      return `${BASE_URL}${this.href}${this.fullQuery}`;
    },
    fullQuery() {
      return this.query ? `?${this.query}` : '';
    },
  },
  methods: {
    go(event) {
      event.preventDefault();
      this.$root.currentRoute = `${BASE_URL}${this.href}`;

      if (this.back) {
        if (!window.history.state) {
          window.history.replaceState(
            null,
            '',
            `${BASE_URL}/`,
          );
        } else {
          window.history.back();
        }

        return;
      }

      if (this.replace) {
        window.history.replaceState(
          this.href,
          '',
          `${BASE_URL}${this.href}${this.fullQuery}`,
        );
      } else {
        window.history.pushState(
          this.href,
          '',
          `${BASE_URL}${this.href}${this.fullQuery}`,
        );
      }
    },
  },
};
</script>

<style scoped>
  a {
    color: #5B5B5B;
    text-decoration: none;
    outline: none;
  }
  a:hover {
    text-decoration: underline;
  }
  a:active {
    color: #7F7F7F;
  }
</style>
