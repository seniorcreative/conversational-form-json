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
    <!-- Dev panels -->
    <section id="devpanel" class="is-invisible">
      <div class="columns">
        <div class="column">
          <DynamicTemplate :templateData="templateData"></DynamicTemplate>
        </div>
      </div>
    </section>
    <!-- Conversation tool -->
    <div class="columns" v-show="!showMenu">
      <div class="column is-8 is-offset-2" id="formTarget">
      </div>
    </div>
  </div>
</template>

<script>
import DynamicTemplate from './dynamictemplate'
// import templateJson from '../assets/schema/template.json'
import csv from '../assets/csv/sheet1.csv'

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
      csvData: { data: [] }
    }
  },
  methods: {
    converse () {
      window.jQuery('form').conversationalForm({ context: document.getElementById('formTarget'), theme: 'dark' })
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
    }
  },
  computed: {
  },
  components: { DynamicTemplate },
  mounted () {
    //
    const data = { form: [] }
    csv.map((row, i) => {
      // console.log('row', row)
      // console.log('row Selectors / Input type', row['Selectors / Input type'])
      row['Selectors / Input type'] = row['Selectors / Input type'].split(', ')
      // console.log('row selectors before', row['Selectors / Input type'])
      const rebuildAnswers = []
      for (const a in row['Selectors / Input type']) {
        const answer = row['Selectors / Input type'][a]
        console.log(`a ${a}, answer ${answer}`)
        rebuildAnswers.push(
          {
            type: 'input',
            attrs: {
              type: 'radio',
              value: answer,
              name: `answer-${i}`,
              id: `answer-${i}-${a}`
            }
          })
        rebuildAnswers.push(
          {
            type: 'label',
            attrs: {
              for: `answer-${i}-${a}`
            },
            elements: [
              {
                type: 'span',
                value: answer
              }
            ]
          }
        )
      }
      row['Selectors / Input type'] = rebuildAnswers
      console.log('row selectors after', row['Selectors / Input type'])
      const element = {
        type: 'fieldset',
        attrs: {
          'cf-questions': row['Question / Content']
        },
        elements: row['Selectors / Input type']
      }
      data.form.push(element)
    })
    this.csvData.data.push(data)
    console.log('made form data', this.csvData.data[0])
    // console.log('Got your CSV', csv)
    this.templateData = this.csvData.data[this.formIndex - 1]
    setTimeout(() => {
      this.setForm(1)
    }, 500)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
