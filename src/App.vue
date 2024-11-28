<template>
  <div>
    <h1 style="position:absolute; top:60px; left:100px;">FMS Storage</h1>
    <ViewerBound />
  </div>
</template>

<script>

import ViewerBound from './components/ViewerBound.vue'

export default {
  name: 'App',
  components: {
    ViewerBound
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: #e6eef6;
}
</style>
