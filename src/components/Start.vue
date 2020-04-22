<template>
  <section>
    <div class="has-text-left">
      <button type="button" @click="toggleJSON()" class="button is-dark">Toggle JSON</button>
    </div>
    <br>
    <div class="columns">
      <div class="column has-text-left" v-show="showCode">
        <textarea class="textarea high" v-model="schemaProperties"></textarea>
        <!-- <vue-json-pretty
          :data="schemaProperties"
          @change="updateSchema">
        </vue-json-pretty> -->
        <!-- <JsonEditor
            :options="{
                confirmText: 'confirm',
                cancelText: 'cancel',
            }"
            :objData="schemaProperties"
            v-model="schemaProperties" >
        </JsonEditor> -->
      </div>
      <div class="column ">
        <!-- <button type="button" class="button is-primary">Click</button> -->
        <FormSchema :schema="schemaInternal" v-model="model" @submit="submit" ref="formSchema">
          <button class="button is-primary" type="submit">Submit</button>
        </FormSchema>
        <button type="button" class="button " @click="converse()">Start conversation</button>
      </div>
      <div class="column" id="formTarget">
          <button type="button" class="button  is-dark" @click="clear()">&times;</button>
      </div>
    </div>
  </section>
</template>

<script>
// Reference https://gitlab.com/formschema/native
import FormSchema from '@formschema/native'
import schema from '../assets/schema/forms.json'
// import VueJsonPretty from 'vue-json-pretty'
// import $ from 'jquery'
// import { ConversationalForm } from 'conversational-form'

export default {
  name: 'Start',
  props: {
    msg: String
  },
  data: () => ({
    schemaInternal: schema,
    model: {},
    showCode: true
  }),
  methods: {
    submit (e) {
      // this.model contains the valid data according your JSON Schema.
      // You can submit your model to the server here
      // console.log(JSON.stringify(this.model))
    },
    converse () {
      window.jQuery('form').conversationalForm({ context: document.getElementById('formTarget') })
    },
    toggleJSON () {
      this.showCode = !this.showCode
    },
    updateSchema (a, b) {
      console.log('updating schema', a, b)
    }
  },
  computed: {
    schemaProperties: {
      get () {
        return JSON.stringify(schema.properties, null, 2)
      },
      set (value) {
        schema.properties = JSON.parse(value)
        this.schemaInternal.properties = schema.properties
        this.$refs.formSchema.load(this.schemaInternal)
      }
    }
  },
  components: { FormSchema },
  mounted () {
    // Run some jQuery on elements after a short wait to add bulma classes.
    setTimeout(() => {
      window.jQuery('form').addClass('form has-text-left')
      // window.jQuery('form').attr('cf-form', true)
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
    }, 100)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
form {
  text-align: left;
}
.high {
  font-family:'Courier New', Courier, monospace;
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
