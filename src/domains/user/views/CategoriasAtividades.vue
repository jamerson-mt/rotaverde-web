<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import Header from "@/domains/reasoning/components/HeaderTop.vue";
import CardLevels from "../components/CardLevels.vue";
import TitleCategories from "../components/TitleCategories.vue";
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div>
        <Header />
      </div>
      <TitleCategories title="Módulos" route="/home" />
      <div class="containerModules">
        <CardLevels
          fala1="modulo1pt"
          title="Módulo 1"
          descripition="Conheça as letras do alfabeto e seus sons"
          competencia="EF01LP01"
          competencia2="EF01LP02"
          image="img/icons/letras.png"
          link="/att/roadMapletras"
          atividade="Português"
          :isBlocked="false"
        />

        <CardLevels
          fala1="modulo2"
          title="Módulo 2"
          descripition="Selecione e escreva palavras iniciais"
          competencia="EF01LP04"
          image="img/icons/letras.png"
          link="/att/roadMapAtividade"
          atividade="Português"
          time="20 min"
          :isBlocked="true"
        />

        <CardLevels
          fala1="modulo3"
          title="Módulo 3"
          descripition="Construa palavras com temas relacionados à sustentabilidade"
          competencia="EF02LP05"
          image="img/icons/frases.png"
          link="/att/roadMapPalavra"
          atividade="Português"
          time="30 min"
          :isBlocked="true"
        />

        <CardLevels
          fala1="modulo4"
          title="Módulo 4"
          descripition="Desenvolva textos sobre preservação ambiental"
          competencia="EF03LP06"
          image="img/icons/textos.png"
          link="/att/roadMapFrase"
          atividade="Português"
          time="40 min"
          :isBlocked="true"
        />
      </div>
    </ion-content>
  </ion-page>
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

.containerModules {
  display: flex;
  flex-direction: column;
  max-height: 60vh; /* Altura máxima baseada na altura da viewport */
  align-items: center;
  justify-content: flex-start; /* Ajustado para alinhar itens ao início */
  margin-top: 1rem;
  gap:1.5em;
  padding-top: 0.5rem;
  overflow-y: auto; /* Permite rolagem vertical */
  padding-right: 0.5rem; /* Espaço para evitar sobreposição com a barra de rolagem */
  scrollbar-width: thin; /* Largura fina para Firefox */
  scrollbar-color: #249b9b #f0f0f0; /* Cor da barra e do fundo */
  border: 0px solid #1e7a7a; /* Borda leve para destacar a área */
  border-radius: 10px; /* Bordas arredondadas */
 
}

.content > * {
  flex-shrink: 0; /* Garante que os itens não sejam comprimidos */
}

.content::-webkit-scrollbar {
  width: 12px; /* Largura da barra de rolagem */
}

.content::-webkit-scrollbar-track {
  background: #f0f0f0; /* Cor do fundo da barra */
}

.content::-webkit-scrollbar-thumb {
  background-color: #249b9b; /* Cor da barra de rolagem */
  border-radius: 6px; /* Bordas arredondadas */
  border: 3px solid #f0f0f0; /* Espaço entre a barra e o fundo */
}

.content::-webkit-scrollbar-thumb:hover {
  background-color: #1e7a7a; /* Cor ao passar o mouse */
}
</style>
