<script setup lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import Card from "@/domains/user/components/Card.vue";
import Header from "@/domains/reasoning/components/HeaderTop.vue";
import FalarComponent from "@/components/specific/FalarComponent.vue";
import { inject, ref } from "vue";
import { getUserData } from "@/utils/localStorageUtils";
import TitleCategories from "../components/TitleCategories.vue";

const isPlaying = inject("isPlaying"); // Certifique-se de que o estado está sendo injetado corretamente

// Verifica se o usuário está logado com base nos dados do localStorage
const userData = ref(getUserData() || {}); // Garantir que userData seja um objeto vazio se getUserData retornar null

// Verifica a role do usuário com base nos dados do localStorage

// Verifica se o usuário possui a role "professor"
const isProfessor = ref(userData.value.roles?.includes("professor") || false);

// Defina a interface para o tipo do FalarComponent
interface FalarComponentType {
  falar(language: string, subject: string, module: string, route: string): void;
  stopAudio(): void;
}

// Tipar a referência do FalarComponent
const falarComponent = ref<FalarComponentType | null>(null);

function handleFalar(language: string, subject: string, module: string, route: string) {
  if (falarComponent.value) {
    falarComponent.value.falar(language, subject, module, route);
  } else {
    console.error("FalarComponent não está disponível.");
  }
}

function goPage(link: string) {
  window.location.href=link;
}

function stopAudio() {
  if (falarComponent.value) {
    falarComponent.value.stopAudio();
  } else {
    console.error("FalarComponent não está disponível.");
  }
}
</script>

<template>
  <head>
    <meta name="mobile-web-app-capable" content="yes" />
  </head>
  <ion-page>
    <ion-content :fullscreen="true">
      <div>
        <Header />
        <TitleCategories title="Voltar" route="/"/>
      </div>
     

      <div id="container">
        <Card
          v-if="!isProfessor"
          @click="handleFalar('pt', 'modulos1', 'seusmodulos', '/categorias')"
          title="Módulos"
          image="img/iconesSustentabilidade/arvore.png"
          link="/home?q=pt"
          link2="/att/roadMap"
          bgc="#fff"
        />
        <!-- Exibe o card "formulários" para todos os usuários -->
        <Card
          @click="goPage('forms')"
          title="formulários"
          image="img/list/list1.jpg"
          link="/forms?q=pt"
          bgc="#fff" 
        />
        <!-- Exibe o card do dashboard apenas se o usuário for professor -->
        <Card
          v-if="isProfessor"
          @click="goPage('professor')"
          title="Dashboard Professor"
          image="img/prata.png"
          link="/profesor"
          bgc="#fff"
        />
        
        
        <!-- Certifique-se de que o componente está sempre presente -->
        <FalarComponent ref="falarComponent" />

        <!-- Exibe o GIF e o botão "Cancelar" quando o áudio está tocando -->
        <div v-if="isPlaying" class="audio-overlay">
          <img src="/public/img/speaker.gif" alt="Executando áudio" />
          <button class="cancel-button" @click="stopAudio">Cancelar</button>
        </div>
        

      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
#container {
  display: flex;
  margin-top: 100px;
  justify-content: space-around;
  padding: 0px 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.audio-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.audio-overlay img {
  width: 100px;
  height: 100px;
}

.cancel-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.login-button {
  position: absolute;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
</style>
