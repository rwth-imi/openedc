<template>
    <div class="">
      <file-upload-field></file-upload-field>
      <checkboxes :options="options"></checkboxes>
    </div>
</template>

<script>
    import FileUploadField from '@/components/input_fields/FileUploadField.vue'
    import Checkboxes from '@/components/input_fields/Checkboxes.vue'
    export default {
        name: "Test",
        components: {
          FileUploadField,
          Checkboxes
        },
        data() {
          return {
            options: [
              { text: 'Orange', value: 'orange' },
              { text: 'Apple', value: 'apple' },
              { text: 'Pineapple', value: 'pineapple' },
              { text: 'Grape', value: 'grape' }
            ]
          }
        }
    }
</script>

<style scoped>

</style>
