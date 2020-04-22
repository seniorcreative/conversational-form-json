<template>
  <section>
    <div class="controls has-text-left">
      <button type="button" @click="setForm(1)" class="button is-dark">Form 1</button>&nbsp;
      <button type="button" @click="setForm(2)" class="button is-dark">Form 2</button>&nbsp;
      <button type="button" @click="toggle('showCode')" class="button is-dark">Toggle Code</button>&nbsp;
      <button type="button" @click="toggle('showForm')" class="button is-dark">Toggle Form</button>&nbsp;
      <button type="button" class="button is-dark" @click="converse()">Start Conversation</button>
    </div>
    <br>
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
      <div class="column" id="formTarget">
          <button type="button" class="button  is-dark" @click="clear()">&times;</button>
      </div>
    </div>
  </section>
</template>

<script>
// Reference https://gitlab.com/formschema/native
import Vue from 'vue'
import FormSchema from '@formschema/native'
import schema from '../assets/schema/forms.json'

export default {
  name: 'Start',
  props: {
    msg: String
  },
  data: () => ({
    model: {},
    showCode: true,
    showForm: true,
    showConversation: true,
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
      Vue.nextTick(() => {
        scope.$refs.formSchema.load(this.schemaInternal)
        setTimeout(() => {
          this.decorateForm()
        }, 100)
      })
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
form {
  text-align: left;
}
.code {
  font-family: monospace;
  height: 100vh;
  width: 100%;
  margin: 0;
  overflow: scroll;
  text-align: left;
  font-size: 0.8rem;
  color: #000;
  line-height: 1.8;
}
</style>
