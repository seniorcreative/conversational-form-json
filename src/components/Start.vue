<template>
  <section>

    <div class="columns">
      <div class="column is-4 has-text-left">
        <textarea class="textarea high" v-model="schemaProperties"></textarea>
        <br>
        <button type="button" class="button " @click="converse">Start conversation</button>
      </div>
      <div class="column">
        <!-- <button type="button" class="button is-primary">Click</button> -->
        <FormSchema :schema="schemaInternal" v-model="model" @submit="submit" ref="formSchema">
          <button class="button is-primary" type="submit">Submit</button>
        </FormSchema>
      </div>
    </div>

    <aside>
      <!-- Conversation will be rendered into here -->
    </aside>

  </section>
</template>

<script>
// Reference https://gitlab.com/formschema/native
import FormSchema from '@formschema/native'
import schema from '../assets/schema/forms.json'
import { ConversationalForm } from 'conversational-form'
import $ from 'jquery'

export default {
  name: 'Start',
  props: {
    msg: String
  },
  data: () => ({
    schemaInternal: schema,
    model: {}
  }),
  methods: {
    submit (e) {
      // this.model contains the valid data according your JSON Schema.
      // You can submit your model to the server here
      // console.log(JSON.stringify(this.model))
    },
    converse () {
      console.log('Converse kicked off')
      const cfInstance = new ConversationalForm({
        formEl: $('form[cf-form]'),
        context: $('aside')
      })
    }
  },
  computed: {
    schemaProperties: {
      get () {
        return JSON.stringify(schema.properties)
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
      $('form').addClass('form has-text-left')
      $('form').attr('cf-form', true)
      $('input').wrap('<div class="control">')
      $('textarea').wrap('<div class="control">')
      $('select').wrap('<div class="control"><div class="select">')
      $('label').css('color', 'grey')
      $('div[data-fs-field-input]').addClass('field')
      $('label').addClass('label')
      $('input').addClass('input')
      $('input[type="checkbox"').removeClass('input')
      $('textarea').addClass('textarea')
      $('select').addClass('select')
      $('div[data-fs-field]').addClass('field')
      $('div[id*="form-schema"] > h1').remove()
      $('div[id*="form-schema"] > p').remove()
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
  height: 100vh;
  width: 100%;
  margin: 0;
  overflow: scroll;
  text-align: left;
  font-size: 0.7rem;
  line-height: 1.4;
}
</style>
