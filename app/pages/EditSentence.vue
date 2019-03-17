
<template>
  <main-layout
    :title="title"
  >
    <div class="container">
      <div class="box english-box">
        <label for="english">In English</label>
        <input
          id="english"
          v-model="sentence.en"
        />
      </div>

      <div class="box japanese-box">
        <label for="userinput">New Japanese Translation</label>
        <textarea
          id="userinput"
          v-model="userInput"
          :style="{
            color: isSpeaking ? 'gray' : 'black',
          }"
          :class="{
            userInput: true,
            speaking: isSpeaking,
          }"
          rows="2"
        />
        <div class="japanese-box-action-buttons">
          <input
            type="button"
            value="Add"
            :disabled="!userInput"
            @click="addJapaneseSentence"
          />
          <input
            type="button"
            value="Speak"
            :disabled="isSpeaking"
            @click="startSpeechRecognition"
          />
          <p>{{ recordingText }}</p>
        </div>
      </div>

      <div class="box hint-box">
        <label for="hint">Hint</label>
        <input
          id="hint"
          v-model="sentence.hint"
        />
      </div>

      <div class="box translations-box">
        <label for="translations">Japanese Translations</label>
        <ul id="translations">
          <li
            v-for="(_, index) in sentence.ja"
            :key="index"
          >
            <textarea
              v-model="sentence.ja[index]"
              rows="2"
            />
            <input
              type="button"
              value="X"
              @click="removeJapaneseSentense(index)"
            />
          </li>
        </ul>
      </div>

      <div class="box tags-box">
        <label for="tags">Tags</label>
        <ul id="tags">
          <li
            v-for="(sentenceTag, index) in sentence.tags"
            :key="index"
          >
            <select v-model="sentence.tags[index]">
              <option value="">--Please choose an option--</option>
              <option
                v-for="(tag, i) in tags"
                :key="i"
                :value="tag._id"
              >
                {{ tag.name }}
              </option>
            </select>
            <!-- <input
              v-model="sentence.tags[index]"
              type=""
            /> -->
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
import SpeechRecognitionAdapter, { ErrorCode } from '../utils/SpeechRecognitionAdapter';
import SpeechSynthesisAdapter from '../utils/SpeechSynthesisAdapter';
import { getBaseUrl, handleError } from '../utils/utils';
const BASE_URL = getBaseUrl();

const {
  VUE_APP_API_ENDPOINT,
} = process.env;

type App = {
  speechRecognition: SpeechRecognitionAdapter | null;
}

const app: App = {
  speechRecognition: null,

  components: {
    MainLayout,
    VLink,
  },
  data() {
    return {
      sentence: {
        _id: '',
        en: '',
        ja: [],
        hint: '',
        tags: [],
      },

      actionText: 'Start',

      tags: [],

      // SpeechInput
      speechRecognition: null,
      speechSynthesis: null,
      userInput: '',
      feedbackText: '',
      recordingText: '',
      isSpeaking: false,
    };
  },
  computed: {
    title() {
      return this.sentence._id
        ? `Edit Sentence ${this.sentence._id}`
        : 'New Sentence';
    },

    isInputValid() {
      return !!this.sentence.en
        && !!this.sentence.hint
        && this.sentence.ja.length > 0
        && this.sentence.tags.every(tag => tag);
    },
  },
  methods: {
    addJapaneseSentence() {
      this.sentence.ja.push(this.userInput);
      this.userInput = '';
    },
    removeJapaneseSentense(index) {
      this.sentence.ja.splice(index, 1);
    },
    addTag() {
      this.sentence.tags.push('');
    },
    removeTag(index) {
      this.sentence.tags.splice(index, 1);
    },
    startSpeechRecognition() {
      this.userInput = '';
      this.actionText = '';
      this.recordingText = 'listening...';
      this.speechRecognition.startRecognition();
    },

    onActionButtonClick() {
      this.startSpeechRecognition.call(this);
    },
    async send(event) {
      event.preventDefault();

      try {
        const method = this.sentence._id ? 'put' : 'post';

        const result = await request[method]({
          endpoint: `${VUE_APP_API_ENDPOINT}/sentence`,
          payload: this.sentence,
        });
        this.sentence = result;
      } catch (error) {
        handleError.bind(this)(error);
        return;
      }

      this.$root.currentRoute = `${BASE_URL}/list-sentences`;

      const sentenceId = new URLSearchParams(window.location.search).get('sentence') || '';

      if (window.history.state && sentenceId) {
        window.history.pushState(
          null,
          '',
          `${BASE_URL}/list-sentences`,
        );
      } else {
        window.history.back();
      }
    },
  },
  async created() {
    const sentenceId = new URLSearchParams(window.location.search).get('sentence') || '';

    if (sentenceId) {
      try {
        const result = await request.get({ endpoint: `${VUE_APP_API_ENDPOINT}/sentence/${sentenceId}` });
        this.sentence = result;
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

    this.speechRecognition = new SpeechRecognitionAdapter();
    this.speechRecognition.onSpeechStartCallback = () => {
      this.recordingText = 'detecting...';
      this.isSpeaking = true;
    };
    this.speechRecognition.onSpeechEndCallback = () => {
      this.isSpeaking = false;
      if (!this.userInput) {
        this.recordingText = 'You didn\'t say anything!';
      } else {
        this.recordingText = '';
      }
    };
    this.speechRecognition.onResultCallback = (text, isFinal, isSpeaking) => {
      this.userInput = text;

      if (isFinal) {
        this.speechSynthesis.speak(this.userInput);
      }
    };

    this.speechRecognition.onErrorCallback = (errorText, errorCode) => {
      if (errorCode === ErrorCode.NO_SPEECH) {
        this.recordingText = 'No speech input detected';
      } else {
        this.recordingText = errorText;
      }
    };

    this.speechSynthesis = new SpeechSynthesisAdapter();
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

  .english-box {}

  .japanese-box {}
  .japanese-box-action-buttons {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
  }
  .japanese-box textarea {
    flex: 1;
    font-size: 30px;
    margin-bottom: 10px;
  }
  .japanese-box input {
    font-size: 20px;
    width: 100px;
    margin-right: 15px;
  }
  .japanese-box p {
    margin: 0;
    align-self: center;
  }

  .hint-box {}

  .translations-box {}
  /* .translations-box ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .translations-box li {
    display: flex;
  } */
  .translations-box textarea {
    flex: 1;
    font-size: 30px;
    margin-bottom: 10px;
    margin-right: 5px;
  }
  .translations-box input {
    font-size: 20px;
    align-self: flex-start;
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
