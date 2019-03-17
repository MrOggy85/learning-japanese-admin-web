import Home from './pages/Home.vue';
import Login from './pages/Login.vue';
import EditSentence from './pages/EditSentence.vue';
import EditChallenge from './pages/EditChallenge.vue';
import EditTag from './pages/EditTag.vue';
import ListSentences from './pages/ListSentences.vue';
import ListChallenges from './pages/ListChallenges.vue';
import ListTags from './pages/ListTags.vue';

import { getBaseUrl } from './utils/utils';
const BASE_URL = getBaseUrl();

export default {
  [`${BASE_URL}/`]: Home,
  [`${BASE_URL}/login`]: Login,
  [`${BASE_URL}/list-sentences`]: ListSentences,
  [`${BASE_URL}/list-challenges`]: ListChallenges,
  [`${BASE_URL}/list-tags`]: ListTags,
  [`${BASE_URL}/edit-sentence`]: EditSentence,
  [`${BASE_URL}/edit-challenge`]: EditChallenge,
  [`${BASE_URL}/edit-tag`]: EditTag,
};
