<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import Header from "@/domains/reasoning/components/HeaderTop.vue";
import Exercise from "@/domains/portuguese/components/Exercise.vue";
import TitleCategories from "../components/TitleCategories.vue";

const go = (rota: string) => {
  window.location.href = rota;
};
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div>
        <Header />
      </div>

      <TitleCategories title="voltar" route="/categorias" />

      <div class="container">
       

       
          <div id="comp6" class="component component6">
          <Exercise
            img="img/abc.png"
            title="Interpretação de textos"
            link="att/int-textos"
            @click="go('att/int-textos')"
          />
        </div>
       
      
      
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 2rem;
  padding: 0rem;
  z-index: 0;
  overflow-x: auto;
  overflow-y: auto;
  width: 100%;
  height: 500px;
  scroll-behavior: smooth;
  white-space: nowrap;
  scrollbar-color: #28a745 #f5f5f5;
  scrollbar-width: thin;
}

.container::-webkit-scrollbar {
  height: 8px; /* Altura do scroll horizontal */
}

.container::-webkit-scrollbar-thumb {
  background-color: #28a745; /* Cor do scroll */
  border-radius: 10px; /* Bordas arredondadas */
}

.container::-webkit-scrollbar-track {
  background: #f5f5f5; /* Cor do fundo do scroll */
}

.component,
.component .component {
  flex: 0 0 auto; /* Garante que os componentes não encolham ou cresçam */
  width: 150px; /* Define uma largura fixa para os componentes */
  height: 150px; /* Define uma altura fixa para os componentes */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0f7e9; /* Cor de fundo verde claro */
  border-radius: 10px; /* Bordas arredondadas */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Adiciona sombra */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Animações */
}

.component1:hover,
.component2:hover,
.component3:hover {
  transform: scale(1.05); /* Aumenta o tamanho ao passar o mouse */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); /* Intensifica a sombra */
  background-color: #13457e;
  color: #e0f7e9;
}

#comp,
#comp1,
#comp3 {
  text-align: center;
  cursor: pointer;
  background-color: #3e5a7a;
}
</style>
