<script setup lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import ListaConsoantes from "../components/ListaConsoantes.vue";
import Header from "@/domains/reasoning/components/HeaderTop.vue";
import TitleCategories from "@/domains/user/components/TitleCategories.vue";
import { ref } from "vue";

const showInfoCard = ref(false);
const toggleInfoCard = () => {
  showInfoCard.value = !showInfoCard.value;
};
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <Header />
      <TitleCategories title="atividade" route="/att/roadMapletras" />
      <lista-consoantes />
    </ion-content>
    <div id="navButton">
      <button class="floating-button" @click="toggleInfoCard">ℹ️</button>
    </div>

    <div v-if="showInfoCard" class="info-card">
      <h3>Objetivo da Atividade</h3>
      <p>
       Na Base Nacional Comum Curricular (BNCC), o aprendizado sobre letras, vogais e consoantes está concentrado no eixo de Alfabetização, principalmente nos anos iniciais do Ensino Fundamental (1º e 2º anos) e na Educação Infantil.
      </p>
      <h5>Conexão com a BNCC</h5>
      <ul>
        <li><strong>EF01LP04:</strong> Distinguir as letras do alfabeto de outros sinais gráficos.</li>
        <li><strong>EF01LP10:</strong> Nomear as letras do alfabeto e recitá-lo em ordem.</li>
      </ul>
      <button @click="toggleInfoCard">Fechar</button>
    </div>
  </ion-page>
</template>

<style scoped>
ion-content {
  --background: #f0f8ff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}


.floating-button {
  position: fixed;
  bottom: 20px; /* Retornou para a posição original */
  right: 20px; /* Retornou para a posição original */
  background-color: #0056b3; /* Azul mais suave */
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.floating-button:hover {
  transform: scale(1.1);
  background-color: #004494;
}

.info-card {
  position: fixed;
  bottom: 80px; /* Retornou para a posição original */
  right: 20px; /* Retornou para a posição original */
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.info-card h3,h5 {
  margin-top: 0;
  color: #222; /* Cor mais escura para o título */
}

.info-card p {
  color: #444; /* Cor mais escura para o texto */
}

.info-card ul {
  color: #444; /* Cor mais escura para os itens da lista */
}

.info-card li {
  margin-bottom: 5px;
}

.info-card button {
  margin-top: 10px;
  background-color: #0056b3;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.info-card button:hover {
  background-color: #004494;
}


.lista-consoantes {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 600px;
  margin: auto;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
</style>
