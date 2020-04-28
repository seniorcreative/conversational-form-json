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
        <li><button type="button" @click="setForm(1)" v-bind:class="{ active: formIndex == 1 }" >Conversation 1</button></li>
        <li><button type="button" @click="setForm(2)" v-bind:class="{ active: formIndex == 2 }" disabled >Conversation 2</button></li>
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
import { ConversationalForm } from 'conversational-form'

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
      const cf = ConversationalForm.startTheConversation(this.formData)
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
        if (answers[0].toLowerCase() === 'text') {
          tagObj.name = `cfc-${q}`
          tagObj.tag = 'input'
          tagObj.type = 'text'
          tagObj.rows = 3
        } else {
          tagObj.tag = 'fieldset'
          tagObj.children = []
          for (let a = 0; a < answers.length; a++) {
            const aTag = {}
            aTag.tag = 'input'
            aTag.type = 'radio'
            aTag.name = `cfc-step${q}`
            aTag.id = `cfc-${q}-a-${a}`
            aTag['cf-label'] = answers[a]
            aTag.value = answers[a]
            tagObj.children.push(aTag)
          }
        }

        tags.push(tagObj)
      }
      // Loop again and add logic
      for (let q = 0; q < data.length; q++) {
        const answers = data[q]['Selectors / Input type'].split(', ')
        const logic = data[q].Logic.split(',')
        if (logic.length > 1 && q > 0) {
          // Jump ahead in time and add the conditionals to subsequent questions
          for (let l = 0; l < logic.length; l++) {
            const goto = parseInt(logic[l]) - 2
            tags[goto].children.map(c => (c[`cf-conditional-cfc-step${q}`] = answers[l]))
          }
        }
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
      const options = {
        context: document.getElementById('formTarget'),
        theme: 'dark',
        showProgressBar: true,
        userInterfaceOptions,
        // submitCallback: this.submitCallback,
        preventAutoFocus: true
      }
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
      }
      )
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
