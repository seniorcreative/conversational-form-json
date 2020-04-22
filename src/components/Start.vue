<template>
  <div>
    <nav>
      <button type="button" class="plain" @click="activateMenu()">Menu</button>
      <button type="button" class="plain" @click="activateDev()">Settings</button>
      <div v-show="showMenu" class="has-text-right"><a @click="deactivateMenu()"><strong>&nbsp;&times;&nbsp;</strong></a></div>
      <!-- Dev controls -->
      <div v-show="devMode">
        <button type="button" class="button is-dark" @click="setForm(1)" >Form 1</button>&nbsp;
        <button type="button" class="button is-dark" @click="setForm(2)" >Form 2</button>&nbsp;
        <button type="button" @click="toggle('showCode')" class="button is-dark">Toggle Code</button>&nbsp;
        <button type="button" @click="toggle('showForm')" class="button is-dark">Toggle Form</button>&nbsp;
        <button type="button" class="button is-dark" @click="converse()">Start Conversation</button>
      </div>
    </nav>
    <section id="intro" v-show="!showMenu && !devMode" class="intro  has-text-centered">
      <p>
        Welcome to the<br>
<span>WorkSafe Victoria</span><br>
conversation tester</p>
    </section>
    <section id="menu" v-show="showMenu">
      <ul>
        <li><a @click="setForm(1)" >Conversation 1</a></li>
        <li><a @click="setForm(2)" >Conversation 2</a></li>
      </ul>
    </section>
    <!-- Dev panels -->
    <section id="devpanel" v-show="showCode || showForm">
      <div class="columns">
        <div class="column has-text-left" v-show="showCode">
          <textarea class="textarea code" v-model="schemaProperties"></textarea>
        </div>
        <div class="column" v-show="showForm">
          <!-- <button type="button" class="button is-primary">Click</button> -->
          <FormSchema :schema="schemaInternal" v-model="model" @submit="submit" ref="formSchema">
            <button class="button is-primary" type="submit">Submit</button>
          </FormSchema>
        </div>
      </div>
    </section>
    <!-- Conversation tool -->
    <section id="conversations" v-show="showConversation">
      <div class="columns">
        <div class="column is-8 is-offset-2" id="formTarget">
            <!-- <button type="button" class="button  is-dark" @click="clear()">&times;</button> -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// Reference https://gitlab.com/formschema/native
import FormSchema from '@formschema/native'
import schema from '../assets/schema/forms.json'

export default {
  name: 'Start',
  props: {
    msg: String
  },
  data: () => ({
    model: {},
    showCode: false,
    showForm: false,
    showConversation: true,
    showMenu: false,
    devMode: false,
    formIndex: 1,
    schemaInternal: schema[0]
  }),
  methods: {
    converse () {
      window.jQuery('form').conversationalForm({ context: document.getElementById('formTarget'), theme: 'dark' })
    },
    toggle (paramName) {
      this[paramName] = !this[paramName]
    },
    setForm (index) {
      this.formIndex = index
      const scope = this
      this.schemaInternal = schema[this.formIndex - 1]
      scope.$refs.formSchema.load(this.schemaInternal)
      /* this.showMenu = false
      this.showConversation = true
      setTimeout(() => {
        this.decorateForm()
      }, 200)
      setTimeout(() => {
        this.converse()
      }, 500) */
    },
    submit () {
      // Form submit
    },
    decorateForm () {
      window.jQuery('form').addClass('form has-text-left')
      window.jQuery('input').wrap('<div class="control">')
      window.jQuery('textarea').wrap('<div class="control">')
      window.jQuery('select').wrap('<div class="control"><div class="select">')
      window.jQuery('label').css('color', 'grey')
      window.jQuery('div[data-fs-field-input]').addClass('field')
      window.jQuery('label').addClass('label')
      window.jQuery('input').addClass('input')
      window.jQuery('input[type="checkbox"').removeClass('input')
      window.jQuery('textarea').addClass('textarea')
      window.jQuery('select').addClass('select')
      window.jQuery('div[data-fs-field]').addClass('field')
      window.jQuery('div[id*="form-schema"] > h1').remove()
      window.jQuery('div[id*="form-schema"] > p').remove()
    },
    activateDev () {
      this.devMode = !this.devMode
      // this.showMenu = false
      // this.showCode = true
      // this.showForm = true
    },
    activateMenu () {
      this.showMenu = !this.showMenu
      this.showConversation = false
    },
    deactivateMenu () {
      this.showMenu = false
    }
  },
  computed: {
    schemaProperties: {
      get () {
        return JSON.stringify(schema[this.formIndex - 1].properties, null, 2)
      },
      set (value) {
        schema[this.formIndex - 1].properties = JSON.parse(value)
        this.schemaInternal = schema[this.formIndex - 1]
        this.$refs.formSchema.load(this.schemaInternal)
      }
    }
  },
  components: { FormSchema },
  mounted () {
    // Run some jQuery on elements after a short wait to add bulma classes.
    setTimeout(() => {
      this.decorateForm()
    }, 100)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
