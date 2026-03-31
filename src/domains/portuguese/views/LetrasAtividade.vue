<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { IonContent, IonPage } from "@ionic/vue";

// Componentes e Serviços
import { exercise } from "../services/attLetras.ts";
import AttEscrita from "@/domains/portuguese/components/AttLetras.vue";
import Header from "@/domains/reasoning/components/HeaderTop.vue";
import NivelModal from "../components/NivelModal.vue";
import { falar } from "@/utils/falar";

// Estados Reativos
const itemArray = ref(0);
const att = ref<any>(null);
const atividadesFiltradas = ref<any[]>([]);
const showNivelModal = ref(true);
const nivelSelecionado = ref<number | null>(null);

const router = useRouter();

// Emits

// Funções de Áudio

// Lógica de Navegação e Exercícios
function nextAtt() {
  itemArray.value++;

  if (itemArray.value >= atividadesFiltradas.value.length) {
    itemArray.value = 0;
    router.push("/att/roadMapAtividade");
  } else {
    att.value = atividadesFiltradas.value[itemArray.value];
  }
}

function handleNivelSelecionado(nivel: number) {
  nivelSelecionado.value = nivel;
  atividadesFiltradas.value = exercise.filter((e) => e.level === nivel);
  itemArray.value = 0;

  if (atividadesFiltradas.value.length > 0) {
    att.value = atividadesFiltradas.value[0];
  } else {
    att.value = null;
  }
  showNivelModal.value = false;
}

function resetNivelModal() {
  showNivelModal.value = true;
  atividadesFiltradas.value = [];
  att.value = null;
  itemArray.value = 0;
}

// Ciclo de Vida e Watchers
watch(itemArray, (newValue) => {
  if (atividadesFiltradas.value[newValue]) {
    att.value = atividadesFiltradas.value[newValue];
  }
});

onMounted(() => {
  // Timeout para evitar conflitos de renderização de áudio inicial
  setTimeout(() => {
    falar("attLetras", "", "#");
  }, 1000);
});

onBeforeRouteUpdate((to, from, next) => {
  resetNivelModal();
  next();
});
</script>

<template>
  <ion-page>
    <NivelModal
      :isOpen="showNivelModal"
      @nivelSelecionado="handleNivelSelecionado"
      @close="showNivelModal = false"
    />

    <ion-content :fullscreen="true">
      <Header />
     

      <div id="options" class="ion-padding">
       <TitleCategories title="Voltar" route="/" />
        <AttEscrita
          v-if="att"
          ref="attEscritaRef"
          :image="att.image"
          :title="att.title"
          :options="att.options"
          @nextAtt="nextAtt"
        />

        <div v-else-if="!showNivelModal" class="no-data">
          <p>Nenhuma atividade disponível para este nível.</p>
          <ion-button @click="resetNivelModal" fill="clear">Voltar</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
#options {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80%;
}

.no-data {
  text-align: center;
  margin-top: 50px;
  font-size: 1.2rem;
  color: #666;
}

#router {
  background-color: #6d4d2f;
  font-size: 1.5rem;
}
</style>
