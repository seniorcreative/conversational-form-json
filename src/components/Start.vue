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
        <li><button type="button" @click="setForm(1)">Conversation 1</button></li>
        <li><button type="button" @click="setForm(2)">Conversation 2</button></li>
        <li><button type="button" @click="setForm(3)">Conversation 3</button></li>
        <li><button type="button" @click="setForm(4)">Conversation 4</button></li>
      </ul>
    </section>
    <!-- Loader -->
    <div class="columns" v-show="isLoading">
      <div class="column is-8 is-offset-2">
        <button class="button is-loading is-dark"></button>
      </div>
    </div>
    <!-- Content tool -->
    <button type="button" v-show="showReload" class="reload" @click="converse()">Start again</button>
    <div class="columns" v-show="!showMenu && !showAbout && !isLoading">
      <div class="column is-10 is-offset-1" id="formTarget">
      </div>
    </div>
    <div class="columns" v-show="showAbout">
      <div class="column is-10 is-offset-1 content-block  has-text-left">
        <h3>About</h3>
        <p>Nobody likes filling in lengthy paperwork or online forms.</p>
<p>The clever folks over at <a href="https://space10.com">Space10</a> have looked to address this problem by developing a conversational form framework, that takes a normal web form and converts it into a more dynamic two-way dialogue.</p>
<p>At WorkSafe Innovation we have extended on this work as a means to rapidly prototype and test new service conversations with our clients. We manage the conversation questions in a Google spreadsheet and quickly test different content variations by applying some conditional logic.</p>
<p>We would like to say thanks to Space10 for their groundwork and in the spirit of continuing the conversation with other developers/designers have made our code available for others to reuse <a href="https://bitbucket.org/worksafeinnovation/conversational-form-json/src/master/">here</a>.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ConversationalForm } from 'conversational-form'
import { GoogleSpreadsheet } from 'google-spreadsheet'

export default {
  name: 'Start',
  props: {
    msg: String
  },
  data () {
    return {
      showMenu: false,
      showAbout: false,
      sheetIndex: 1,
      templateData: {},
      formData: {},
      cf: null,
      gaCategory: 'CF Tool - Worksafe Conversation Tester',
      showReload: false,
      globalTags: {},
      isLoading: false,
      doc: null,
      sheet1: null,
      sheet2: null,
      sheet3: null,
      sheet4: null,
      rows1: null,
      rows2: null,
      rows3: null,
      rows4: null
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
    setForm (index) {
      this.isLoading = true
      this.showMenu = false
      this.sheetIndex = index
      this.formatJSONAsTags(this[`rows${index}`])
      this.isLoading = false
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
        const answers = data[q].Answers ? data[q].Answers.split(', ') : []
        const conditions = data[q].Conditions
        for (const a in answers) {
          answers[a] = answers[a].split('COMMA').join(',')
        }
        const inputType = data[q]['Input type']
        let questionContent = data[q]['Question / Content']
        // Loop the globals... replace.
        for (const g in this.globalTags) {
          const searchTerm = `{{${g}}}`
          if (questionContent.indexOf(searchTerm) !== -1) {
            questionContent = questionContent.replace(searchTerm, this.globalTags[g])
          }
        }
        tagObj['cf-questions'] = questionContent
        if (inputType === 'textarea' || inputType === 'text' || !inputType) {
          tagObj.name = `cfc-question-${step}`
          tagObj.id = data[q].Pipe || tagObj.name
          tagObj.tag = 'input'
          tagObj.type = inputType
          if (conditions) {
            const conditionSplit = conditions.split('=')
            const questionNumber = parseInt(conditionSplit[0] - 1)
            tagObj[`cf-conditional-cfc-question-${questionNumber}`] = conditionSplit[1]
          }
          if (inputType === 'textarea') tagObj.rows = 3
        } else {
          tagObj.tag = 'fieldset'
          tagObj.children = []
          for (let a = 0; a < answers.length; a++) {
            const aTag = {}
            aTag.tag = 'input'
            aTag.type = inputType
            aTag.name = `cfc-question-${step}`
            aTag.id = data[q].Pipe || `cfc-${step}-a-${a}`
            let answerValue = answers[a]
            if (answerValue.split('').indexOf('*') !== -1) {
              answerValue = answerValue.substr(1)
              aTag.disabled = 'disabled'
            }
            aTag['cf-label'] = answerValue
            aTag.value = answerValue
            if (conditions) {
              const conditionSplit = conditions.split('=')
              const questionNumber = parseInt(conditionSplit[0] - 1)
              aTag[`cf-conditional-cfc-question-${questionNumber}`] = conditionSplit[1]
            }
            tagObj.children.push(aTag)
          }
        }

        tags.push(tagObj)
      }

      const userInterfaceOptions = {
        robot: {
          chainedResponseTime: 1000
        },
        user: {
          showThinking: false,
          showThumb: false
        }
      }
      const options = {
        context: document.getElementById('formTarget'),
        theme: 'dark', // FYI this gets a few yellow overrides for our brand
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
      const gaAction = `Form ${this.sheetIndex} Step ${currentStep}/${maxSteps}`
      const gaLabel = `Form ${this.sheetIndex} Field name - ${dto.tag.name}` // We only track actual field name for reference purpose. If you want to track the actual value you may do so.
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
        event_action: `Form ${this.sheetIndex} submitted`,
        event_label: `Reached end of form ${this.sheetIndex}`
      })
      // this.cf.addRobotChatResponse('Thanks for your feedback.')
      // Kill form?
      window.jQuery('.inputWrapper > textarea').val('')
      setTimeout(() => {
        this.cf.remove()
        this.activateMenu()
      }, 3000)
    }
  },
  computed: {
  },
  created () {
    // spreadsheet key is the long id in the sheets URL
    const apiKey = process.env.VUE_APP_SHEET_API_KEY
    const sheetID = process.env.VUE_APP_SHEET_ID
    this.loadSheet = async () => {
      this.doc = new GoogleSpreadsheet(sheetID)

      // Use API key -- only for read-only access to public sheets
      this.doc.useApiKey(apiKey)

      await this.doc.loadInfo() // loads document properties and worksheets
      this.sheet1 = this.doc.sheetsByIndex[0]
      this.sheet2 = this.doc.sheetsByIndex[1]
      this.sheet3 = this.doc.sheetsByIndex[2]
      this.sheet4 = this.doc.sheetsByIndex[3]

      // read rows
      this.rows1 = await this.sheet1.getRows()
      this.rows2 = await this.sheet2.getRows()
      this.rows3 = await this.sheet3.getRows()
      this.rows4 = await this.sheet4.getRows()

      //
      this.setForm(1)
    }
    this.loadSheet()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
