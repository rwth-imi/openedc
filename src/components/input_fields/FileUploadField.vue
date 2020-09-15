<template>
  <div>
    <b-form-file
      v-model="file1"
      :state="Boolean(file1)"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
    ></b-form-file>
    <div class="mt-3">Selected file: {{ file1 ? file1.name : '' }}</div>
  </div>
</template>

<script>
  export default {
    name: 'FileUploadField',
    data() {
      return {
        file1: null,
      }
    }
  }
</script>
