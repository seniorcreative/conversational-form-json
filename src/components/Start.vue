<template>
  <div>
    <nav>
      <button type="button" class="plain" @click="activateMenu()">Menu</button>
      <div v-show="showMenu" class="has-text-right"><a @click="deactivateMenu()" class="btn-close"></a></div>
    </nav>
    <!-- Welcome -->
    <section id="intro" v-show="!showMenu" class="intro  has-text-centered">
      <p>
        Welcome to the<br>
        <span>WorkSafe Victoria</span><br>
        conversation tester</p>
    </section>
    <!-- Conversations menu -->
    <section id="menu" v-show="showMenu">
      <ul>
        <li><a @click="setForm(1)" v-bind:class="{ active: formIndex == 1 }" >Conversation 1</a></li>
        <li><a @click="setForm(2)" v-bind:class="{ active: formIndex == 2 }" >Conversation 2</a></li>
      </ul>
    </section>
    <!-- Conversation tool -->
    <div class="columns" v-show="!showMenu">
      <div class="column is-8 is-offset-2" id="formTarget">
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import DynamicTemplate from './dynamictemplate'
// You need the CSV loader in the vue.config to read the file below!
// import csv from '../assets/csv/sheet1.csv'

export default {
  name: 'Start',
  props: {
    msg: String
  },
  data () {
    return {
      showMenu: false,
      formIndex: 1,
      // templateData: templateJson.data[0]
      templateData: {},
      formData: {}
    }
  },
  methods: {
    converse () {
      // window.jQuery('form').conversationalForm({ context: document.getElementById('formTarget'), theme: 'dark' })
      const cf = window.cf.ConversationalForm.startTheConversation(this.formData)
      // cf.addRobotChatResponse('Thank you for participating.')
    },
    toggle (paramName) {
      this[paramName] = !this[paramName]
    },
    setForm (index) {
      this.formIndex = index
      this.templateData = this.csvData.data[this.formIndex - 1]
      this.showMenu = false
      setTimeout(() => {
        this.converse()
      }, 500)
    },
    submit () {
      // Form submit
    },
    activateMenu () {
      this.showMenu = !this.showMenu
    },
    deactivateMenu () {
      this.showMenu = false
    },
    formatJSONAsTags (data) {
      const tags = []
      for (let q = 0; q < data.length; q++) {
        const tagObj = {}
        const answers = data[q]['Selectors / Input type'].split(', ')
        tagObj['cf-questions'] = data[q]['Question / Content']
        tagObj.name = `q-${q}`
        if (answers[0].toLowerCase() === 'text') {
          tagObj.tag = 'input'
          tagObj.type = 'text'
          tagObj.rows = 3
        } else {
          tagObj.tag = 'label'
          tagObj.children = []
          for (let a = 0; a < answers.length; a++) {
            const aTag = {}
            aTag.tag = 'input'
            aTag.type = 'radio'
            aTag.name = `q-${q}`
            aTag.id = `q-${q}-a-${a}`
            aTag['cf-label'] = answers[a]
            tagObj.children.push(aTag)
          }
        }

        tags.push(tagObj)
      }
      const userInterfaceOptions = {
        controlElementsInAnimationDelay: 250,
        robot: {
          robotResponseTime: 2000,
          chainedResponseTime: 500
        },
        user: {
          showThinking: false,
          showThumb: false
        }
      }
      const options = { context: document.getElementById('formTarget'), theme: 'dark', showProgressBar: true, userInterfaceOptions }
      this.formData = { options, tags }
      this.converse()
    }
  },
  computed: {
  },
  mounted () {
    // Load in the json via axios
    axios
      .get('https://sheetsu.com/apis/v1.0su/a75350b2f458')
      .then(response => {
        this.formatJSONAsTags(response.data)
        // this.formData = response
      }
      )
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
