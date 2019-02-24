import Home from './pages/Home.vue';
import Login from './pages/Login.vue';
import Edit from './pages/Edit.vue';

import { getBaseUrl } from './utils/utils';
const BASE_URL = getBaseUrl();

export default {
  [`${BASE_URL}/`]: Home,
  [`${BASE_URL}/login`]: Login,
  [`${BASE_URL}/edit`]: Edit,
};
