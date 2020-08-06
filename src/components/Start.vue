<template>
  <div>
    <!-- Welcome -->
    <section id="intro" class="intro  has-text-centered">
      <p>My name is Jan, I am a virtual assistant.</p>
    </section>
    <!-- Loader -->
    <div class="columns" v-show="isLoading">
      <div class="column is-8 is-offset-2">
        <button class="button is-loading is-dark"></button>
      </div>
    </div>
    <!-- Content tool -->
    <button type="button" v-show="showReload" class="reload" @click="converse()">Start again</button>
    <div class="columns" v-show="!isLoading">
      <div class="column is-10 is-offset-1" id="formTarget">
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
      sheetIndex: 1,
      templateData: {},
      formData: {},
      cf: null,
      gaCategory: 'CF Tool - Community Covid Chatbot',
      showReload: false,
      globalTags: {},
      isLoading: false,
      doc: null,
      sheet1: null,
      rows1: null
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
      this.isLoading = true
      this.sheetIndex = index
      this.formatJSONAsTags(this[`rows${index}`])
      this.isLoading = false
    },
    submit () {
      // Form submit
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
        theme: 'green', // FYI this gets a few yellow overrides for our brand
        showProgressBar: false,
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
      const gaLabel = `Form ${this.sheetIndex} Field name - ${dto.tag.name}, Value - ${dto.text}` // We only track actual field name for reference purpose. If you want to track the actual value you may do so.
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
        // this.cf.remove()
        // this.activateMenu()
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

      // read rows
      this.rows1 = await this.sheet1.getRows()

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
