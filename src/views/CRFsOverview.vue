<template>
<div class="mainPage">
  <h1>CRFs Overview</h1>
  <div class="" align="right">
    <b-button pill variant="success" to="/CreateCRF">Add</b-button>
  </div>
  <b-table striped hover :items="crfs" :fields="fields">
    <template v-slot:cell(name)="data">
      <router-link :to="{ name: 'CRF', params: {crfId: data.item.id, section: 0} }">{{ data.value }}</router-link>
    </template>
    <template v-slot:cell(countFilled)="data">
      <router-link :to="{ name: 'CRFsFilled', params: {crfId: data.item.id} }">{{ data.value }}</router-link>
    </template>
    <template v-slot:cell(createdAt)="data">
      {{ data.value.toDateString() }}
    </template>
    <template v-slot:cell(settings)="">
      <b-button pill variant="outline-success">Edit</b-button>
      <b-button pill variant="outline-success">Export</b-button>
      <b-button pill variant="outline-danger">Delete</b-button>
    </template>
  </b-table>
</div>
</template>

<script>
export default {
  name: "CRFs",
  components: {},
  data() {
    return {
      fields: [{
          key: 'name',
          sortable: true
        },
        {
          key: 'countFilled',
          label: 'Count',
          sortable: true
        },
        {
          key: 'createdAt',
          sortable: true,
        },
        'Settings'
      ],
      crfs: [{
        name: "First CRF",
        countFilled: 2,
        createdAt: new Date(),
        id: 0
      },
      {
        name: "Second CRF",
        countFilled: 4,
        createdAt: new Date(),
        id: 1
      }]
    }
  }
}
</script>

<style scoped>

</style>
