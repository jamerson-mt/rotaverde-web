<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
});

function goBack() {
  window.location.href = props.route;
}
</script>

<template>
  <div class="content">
    <div @click="goBack()" class="title">
      <img src="/public/img/IconsHome/voltar.png" />
      <p>voltar</p>
    </div>
  </div>
</template>

<style scoped>
.title {
  margin-top: 2rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title img {
  width: 2rem;
  height: 2rem;
  margin-right: 10px;
}

.title p {
  font-size: 1.5rem;
  color: #1e1e1e;
}
</style>
