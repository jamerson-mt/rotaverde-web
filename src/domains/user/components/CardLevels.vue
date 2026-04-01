<script setup lang="ts">
import { defineProps, ref } from "vue";
import FalarComponent from "@/components/specific/FalarComponent.vue";
import Competencia from "@/domains/user/components/CompetenciaComponent.vue";

defineProps({
  title: {
    type: String,
    required: true,
  },
  fala1: {
    type: String,
    required: true,
  },
  descripition: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  atividade: {
    type: String,
    required: true,
  },
  competencia: {
    type: String,
    required: false,
  },
  competencia2: {
    type: String,
    required: false,
  },
  competencia3: {
    type: String,
    required: false,
  },
  competencia4: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  isBlocked: {
    type: Boolean,
    required: true,
  },
});

import type FalarComponentType from "@/components/specific/FalarComponent.vue";

const falarComponent = ref<InstanceType<typeof FalarComponentType> | null>(null);

function handleCardClick(card: string, module: string, activity: string, link: string) {
  if (falarComponent.value) {
    falarComponent.value.falar(card, module, activity, link);
  } else {
    console.error("FalarComponent não está disponível.");
  }
}
</script>

<template>
  <div class="card" :class="{ blocked: isBlocked }">
    <div class="card" @click="handleCardClick('card1', fala1, 'suasatividades', link)">
      <div class="content">
        <p class="title">{{ title }}</p>
        <p class="descripition">{{ descripition }}</p>
        <div class="competencias">
          <Competencia v-if="competencia" :text="competencia" :descricao="descripition"/>
          <Competencia v-if="competencia2" :text="competencia2" :descricao="descripition" />
          <Competencia v-if="competencia3" :text="competencia3" :descricao="descripition"/>
          <Competencia v-if="competencia4" :text="competencia4" :descricao="descripition" />
        </div>
      </div>
    </div>
    <FalarComponent ref="falarComponent" />
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap");

.card {
  margin-top: 0rem;
  display: flex;
  padding: 5px;
  flex-direction: row;
  position: relative;
  width: 90%;
  background-color: #249b9b;
  border-radius: 10px;
  align-items: center;
  margin-bottom: auto;
}
.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  color: white;
  align-items: flex-start; /* Adicionado para alinhar verticalmente */
}

.title {
  font-family: "DM Sans", sans-serif;
  font-weight: 700;
  font-style: bold;
  font-size: 20px;
}

.descripition {
  font-family: "DM Sans", sans-serif;
  font-weight: 400;
  font-style: normal;
  line-height: 24px;
  font-size: 18px;
}

.competencias {
  display: flex;
  flex-direction: row; /* Alterado para alinhar verticalmente */
  justify-content: flex-start;
  margin-left: 20px; /* Ajustado para alinhar com o título e descrição */
  gap: 4px;
}

p {
  margin-left: 20px;
  margin-bottom: 5px;
}

.link {
  position: relative;
  color: rgb(3, 15, 74);
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  background-color: white;
  padding: 4px 8px;
  border-radius: 39px;
}

.img {
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  width: 4rem;
  height: 4rem;
}

.img img {
  margin-top: 0.2rem;
}

.img p {
  position: relative;
  top: -8%;
  width: 100%;
  font-family: "DM Sans", sans-serif;
  border-radius: 10px;
  font-weight: 500;
  font-style: medium;
  font-size: 15px;
  color: #ffffff;
  text-align: center;
  padding: 5px;
  background-color: #ffffff33;
}
</style>
