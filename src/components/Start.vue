<template>
  <div>
    <nav>
      <button type="button" class="plain" v-bind:class="{ active: showMenu }" @click="activateMenu()">Menu</button>
      <button type="button" class="plain" v-bind:class="{ active: showAbout }" @click="activateAbout()">About</button>
      <div v-show="showMenu" class="has-text-right"><a @click="deactivateMenu()" class="btn-close"></a></div>
      <div v-show="showAbout" class="has-text-right"><a @click="deactivateAbout()" class="btn-close"></a></div>
    </nav>
    <!-- Welcome -->
    <section id="intro" v-show="!showMenu && !showAbout" class="intro  has-text-centered">
      <p>
        Welcome to the<br>
        <span>WorkSafe Victoria</span><br>
        conversation tester</p>
    </section>
    <!-- Conversations menu -->
    <section id="menu" v-show="showMenu">
      <ul>
        <li><button type="button" @click="setForm('conversation-2')" _v-bind:class="{ active: formIndex == 2 }" >Conversation 1</button></li>
        <li><button type="button" @click="setForm('conversation-3')" _v-bind:class="{ active: formIndex == 3 }" :disabled="!this.form1Submitted" >Conversation 2</button></li>
      </ul>
    </section>
    <!-- Content tool -->
    <button type="button" v-show="showReload" class="reload" @click="converse()">Start again</button>
    <div class="columns" v-show="!showMenu && !showAbout">
      <div class="column is-8 is-offset-2" id="formTarget">
      </div>
    </div>
    <div class="columns" v-show="showAbout">
      <div class="column is-8 is-offset-2 content-block  has-text-left">
        <h3>About</h3>
        <p>Nobody likes filling in lengthy paperwork or online forms.</p>
<p>The clever folks over at <a href="https://space10.com">Space10</a> have looked to address this problem by developing a conversational form framework, that takes a normal web form and converts it into a more dynamic two-way dialogue.</p>
<p>At WorkSafe Innovation we have extended on this work as a means to rapidly prototype and test new service conversations with our clients. With a bit of extra code and a third-party app called <a href="https://sheetsu.com/">Sheetsu</a> (which reads a spreadsheet and converts it into JSON), we are now able to manage the conversation questions in a Google spreadsheet and quickly test different content variations by applying some conditional logic.</p>
<p>We would like to say thanks Space10 for their groundwork and in the spirit of continuing the conversation with other developers/designers have made our code available for others to reuse here.</p>
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
      showAbout: false,
      formIndex: 1,
      form1Submitted: false,
      templateData: {},
      formData: {},
      cf: null,
      gaCategory: 'CF Tool - Worksafe Conversation Tester',
      showReload: false,
      globalTags: {}
    }
  },
  methods: {
    converse () {
      this.showReload = false
      this.showMenu = false
      this.showAbout = false
      this.cf = ConversationalForm.startTheConversation(this.formData)
    },
    toggle (paramName) {
      this[paramName] = !this[paramName]
    },
    setForm (formName) {
      this.formIndex = parseInt(formName.split('-')[1])
      axios
        .get(`https://sheetsu.com/apis/v1.0bu/a75350b2f458/sheets/${formName}`)
        .then(response => {
          this.formatJSONAsTags(response.data)
        }
        )
    },
    submit () {
      // Form submit
    },
    activateMenu () {
      this.showMenu = !this.showMenu
      this.showAbout = false
    },
    deactivateMenu () {
      this.showMenu = false
    },
    activateAbout () {
      this.showAbout = !this.showAbout
      this.showMenu = false
    },
    deactivateAbout () {
      this.showAbout = false
    },
    formatJSONAsTags (data) {
      const tags = []
      for (let q = 0; q < data.length; q++) {
        const tagObj = {}
        const step = q + 1
        const answers = data[q]['Selectors / Input type'].split(', ')
        let questionContent = data[q]['Question / Content']
        // Loop the globals... replace.
        for (const g in this.globalTags) {
          const searchTerm = `{{${g}}}`
          if (questionContent.indexOf(searchTerm) !== -1) {
            questionContent = questionContent.replace(searchTerm, this.globalTags[g])
          }
        }
        tagObj['cf-questions'] = questionContent
        const answerType = answers[0].toLowerCase()
        if (answerType === 'longtext' || answerType === 'text' || answerType === 'date') {
          tagObj.name = `cfc-${step}`
          tagObj.id = data[q].Pipe || tagObj.name
          tagObj.tag = 'input'
          tagObj.type = answerType
          if (answerType === 'longtext') tagObj.rows = 3
        } else {
          tagObj.tag = 'fieldset'
          tagObj.children = []
          for (let a = 0; a < answers.length; a++) {
            const aTag = {}
            aTag.tag = 'input'
            aTag.type = 'radio'
            aTag.name = `cfc-question-${step}`
            aTag.id = data[q].Pipe || `cfc-${step}-a-${a}`
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
            // Check if the condition has a star - if it does, both conditions here lead to that question
            if (logic[l].indexOf('*') !== -1) {
              const goto = parseInt(logic[l].split('*')[0]) - 2
              if (tags[goto].children) tags[goto].children.map(c => (c[`cf-conditional-cfc-question-${step}`] = answers.join('||')))
            } else {
              const goto = parseInt(logic[l]) - 2
              if (tags[goto].children) tags[goto].children.map(c => (c[`cf-conditional-cfc-question-${step}`] = answers[l]))
            }
          }
        }
      }

      const userInterfaceOptions = {
        // controlElementsInAnimationDelay: 250,
        robot: {
        //   robotResponseTime: 1000
          chainedResponseTime: 1000
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
        preventAutoFocus: false,
        flowStepCallback: this.flowStepCallback
      }
      this.formData = { options, tags }
      this.converse()
    },
    flowStepCallback (dto, success, error) {
      const currentStep = this.cf.flowManager.getStep() + 1 // Steps are 0-based so we add 1
      const maxSteps = this.cf.flowManager.maxSteps // This value is not 0-based
      const gaAction = `Form ${this.formIndex} Step ${currentStep}/${maxSteps}`
      const gaLabel = `Form ${this.formIndex} Field name - ${dto.tag.name}` // We only track actual field name for reference purpose. If you want to track the actual value you may do so.
      this.globalTags[dto.tag.id] = dto.text // Stash as global so can use in the next form?
      window.gtag('event', 'CF event', {
        event_category: this.gaCategory,
        event_action: gaAction,
        event_label: gaLabel
      })

      success()
    },
    submitCallback () {
      window.gtag('event', 'CF submitted', {
        event_category: this.gaCategory,
        event_action: `Form ${this.formIndex} submitted`,
        event_label: `Reached end of form ${this.formIndex}`
      })
      // this.cf.addRobotChatResponse('Thanks for your feedback.')
      // Kill form?
      window.jQuery('.inputWrapper > textarea').val('')
      setTimeout(() => {
        this.cf.remove()
        // this.showReload = true
        this.form1Submitted = true
        this.activateMenu()
      }, 3000)
    }
  },
  computed: {
  },
  mounted () {
    // Load in the specific sheet json via axios
    // Subsequent sheets - syntax is https://sheetsu.com/apis/v1.0su/a75350b2f458/sheets/conversation-2
    this.setForm('conversation-2')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
