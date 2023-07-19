<template>
  <div id="app">
    <router-view :key="$route.path"/>
  </div>
</template>

<style lang="less">
html,
#app {
  height: 100vh;
  width: 100%;
}

body {
  margin: 0;
  padding: 0;
}
</style>
