<script setup lang="ts">
import { ref, computed } from "vue";
import listaCompetencias from "../data/competencias.json";

interface Props {
  text: string;
}

const props = defineProps<Props>();
const isPopupVisible = ref(false);

// Busca a descrição apenas quando o 'text' mudar ou na primeira montagem
const descricaoCompetencia = computed(() => {
  const competencia = listaCompetencias.find(
    c => c.codigo.toLowerCase() === props.text.toLowerCase()
  );
  return competencia ? competencia.descricao : "Descrição não encontrada.";
});

const togglePopup = () => {
  isPopupVisible.value = !isPopupVisible.value;
};
</script>

<template>
  <span class="competencia-tag" @click.stop="togglePopup">
    {{ text }}
  </span>

  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isPopupVisible" class="popup-overlay" @click="togglePopup">
        <div class="popup-card" @click.stop>
          <header class="popup-header">
            <h3>{{ text }}</h3>
            <button class="close-btn" @click="togglePopup">&times;</button>
          </header>
          
          <div class="popup-body">
            <p class="label">Descrição da BNCC:</p>
            <p class="content">{{ descricaoCompetencia }}</p>
          </div>

          <footer class="popup-footer">
            <button class="confirm-btn" @click="togglePopup">Entendido</button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.competencia-tag {
  display: inline-block;
  font-family: "DM Sans", sans-serif;
  font-weight: 600;
  font-size: 13px;
  color: #0f3d3e;
  background-color: #ecc055;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: filter 0.2s;
}

.competencia-tag:hover {
  filter: brightness(0.9);
}

/* Overlay ocupando a tela toda */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.popup-card {
  background: white;
  width: 90%;
  max-width: 450px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  animation: scaleIn 0.3s ease-out;
}

.popup-header {
  padding: 15px 20px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.popup-header h3 {
  margin: 0;
  color: #249b9b;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.popup-body {
  padding: 20px;
}

.label {
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 8px;
}

.content {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
}

.popup-footer {
  padding: 15px 20px;
  text-align: right;
  border-top: 1px solid #eee;
}

.confirm-btn {
  background-color: #249b9b;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

/* Animações */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>