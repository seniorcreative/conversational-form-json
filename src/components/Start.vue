<template>
  <div>
    <nav>
      <button type="button" class="plain is-hidden" @click="activateMenu()">Menu</button>
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
    <button type="button" v-show="showReload" class="reload" @click="converse()">Start again</button>
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
      formData: {},
      cf: null,
      gaCategory: 'CF Tool - Worksafe Conversation Tester',
      showReload: false
    }
  },
  methods: {
    converse () {
      this.showReload = false
      this.cf = ConversationalForm.startTheConversation(this.formData)
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
        const step = q + 1
        const answers = data[q]['Selectors / Input type'].split(', ')
        tagObj['cf-questions'] = data[q]['Question / Content']
        if (answers[0].toLowerCase() === 'text') {
          tagObj.name = `cfc-${step}`
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
            aTag.name = `cfc-question-${step}`
            aTag.id = `cfc-${step}-a-${a}`
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
        const step = q + 1
        const logic = data[q].Logic.split(',')
        if (logic.length > 1 && q > 0) {
          // Jump ahead in time and add the conditionals to subsequent questions
          for (let l = 0; l < logic.length; l++) {
            const goto = parseInt(logic[l]) - 2
            tags[goto].children.map(c => (c[`cf-conditional-cfc-question-${step}`] = answers[l]))
          }
        }
      }

      const userInterfaceOptions = {
        controlElementsInAnimationDelay: 250,
        robot: {
          robotResponseTime: 1750,
          chainedResponseTime: 500
        },
        user: {
          showThinking: false,
          showThumb: false
        }
      }
      const options = {
        context: document.getElementById('formTarget'),
        theme: 'dark', // FYI this gets a few yellow overrides
        showProgressBar: true,
        userInterfaceOptions,
        submitCallback: this.submitCallback,
        preventAutoFocus: true,
        flowStepCallback: this.flowStepCallback
      }
      this.formData = { options, tags }
      this.converse()
    },
    flowStepCallback (dto, success, error) {
      const currentStep = this.cf.flowManager.getStep() + 1 // Steps are 0-based so we add 1
      const maxSteps = this.cf.flowManager.maxSteps // This value is not 0-based
      const gaAction = `Step ${currentStep}/${maxSteps}`
      const gaLabel = `Field name - ${dto.tag.name}` // We only track actual field name for reference purpose. If you want to track the actual value you may do so.

      /*       console.log(
        `tag script: ${window.gtag}
  GA event tracking.
  Category: ${this.gaCategory}
  action: ${gaAction}
  label: ${gaLabel}`) */

      window.gtag('event', 'CF event', {
        event_category: this.gaCategory,
        event_action: this.gaAction,
        event_label: this.gaLabel
      })

      success()
    },
    submitCallback () {
      /* console.log(`GA event tracking.
  Category: ${this.gaCategory}
  action: Form submitted
  label:)`) */
      window.gtag('event', 'CF submitted', {
        event_category: this.gaCategory,
        event_action: 'Form submitted',
        event_label: 'Reached end of form'
      })
      this.cf.addRobotChatResponse('Thanks for your feedback.')
      // Kill form?
      window.jQuery('.inputWrapper > textarea').val('')
      setTimeout(() => {
        // this.cf.remapTagsAndStartFrom(0, 0, 1)
        this.cf.remove()
        this.showReload = true
      }, 5000)
    }
  },
  computed: {
  },
  mounted () {
    // Load in the json via axios
    // By default we get sheet 1
    // Subsequent sheets - syntax is https://sheetsu.com/apis/v1.0su/a75350b2f458/sheets/conversation-2
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
