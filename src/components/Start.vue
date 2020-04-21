<template>
  <div class="columns">
    <div class="column is-4">
      <pre v-html="schema.properties"></pre>
    </div>
    <div class="column">
      <!-- <button type="button" class="button is-primary">Click</button> -->
      <FormSchema :schema="schema" v-model="model" @submit="submit">
        <button class="button is-primary" type="submit">Submit</button>
      </FormSchema>
    </div>
  </div>
</template>

<script>
// Reference https://gitlab.com/formschema/native
import FormSchema from '@formschema/native'
import schema from '../assets/schema/forms.json'
import $ from 'jquery'

export default {
  name: 'Start',
  props: {
    msg: String
  },
  data: () => ({
    schema,
    model: {}
  }),
  methods: {
    submit (e) {
      // this.model contains the valid data according your JSON Schema.
      // You can submit your model to the server here
      // console.log(JSON.stringify(this.model))
    }
  },
  computed: {
    viewJSON: () => {
      return JSON.stringify(this.schema)
    }
  },
  components: { FormSchema },
  mounted () {
    // Run some jQuery on elements after a short wait to add bulma classes.
    setTimeout(() => {
      $('form').addClass('form has-text-left')
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
pre {
  height: 100vh;
  width: 100%;
  margin: 0;
  overflow: scroll;
  text-align: left;
  font-size: 0.5rem;
}
</style>
