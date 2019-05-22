<template>
  <b-table :data="response.results.bindings">
    <template slot-scope="props">
      <b-table-column
        v-for="(col, i) in response.head.vars"
        :key="i"
        :label="col"
      >
        <a
          v-if="props.row[col].type == 'uri'"
          :href="
            props.row[col].value.replace('https://prismdb.takanakahiko.me', '')
          "
          >{{ props.row[col].value }}</a
        >
        <span v-else>{{ props.row[col].value }}</span>
      </b-table-column>
    </template>
    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon icon="emoticon-sad" size="is-large"></b-icon>
          </p>
          <p>Nothing here.</p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<script>
export default {
  props: {
    response: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
a,
span {
  word-break: break-all;
}
</style>
