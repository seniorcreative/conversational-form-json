<template>
  <div class="columns">
    <div class="column is-4">
      <textarea class="textarea high" v-model="schemaProperties"></textarea>
    </div>
    <div class="column">
      <!-- <button type="button" class="button is-primary">Click</button> -->
      <FormSchema :schema="schemaInternal" v-model="model" @submit="submit" ref="formSchema">
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
    schemaInternal: schema,
    model: {}
  }),
  methods: {
    submit (e) {
      // this.model contains the valid data according your JSON Schema.
      // You can submit your model to the server here
      // console.log(JSON.stringify(this.model))
    },
    update (e) {
      const val = `changed ${e}`
      console.log('val', val)
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
  font-size: 0.5rem;
}
</style>
