<template>
  <div class="lista-vogais">
    <h2 class="title-main">Vogais</h2>
    
    <div class="controles-case">
      <button 
        class="btn-case" 
        :class="{ ativo: estiloAtual === 'normal' }"
        @click="mudarParaMaiuscula"
      >
        ABC
      </button>

      <button 
        class="btn-case" 
        :class="{ ativo: estiloAtual === 'lowercase' }"
        @click="mudarParaMinuscula"
      >
        abc
      </button>
    </div>

    <ul class="grid-vogais">
      <li v-for="vogal in vogaisFormatadas" :key="vogal">
        <button
          class="btn-vogal"
          @click="openCard(vogal)"
          :style="{ fontStyle: estiloAtual === 'italic' ? 'italic' : 'normal' }"
        >
          {{ vogal }}
        </button>
      </li>
    </ul>

    <div v-if="showCardModal" class="card-overlay" @click.self="closeCard">
      <div class="card-modal">
        <button class="card-close" @click="closeCard">×</button>
        
        <div class="card-corner top-left">{{ modalData.letra }}</div>
        <div class="card-corner bottom-right">{{ modalData.letra }}</div>

        <div
          class="card-flip"
          :class="{ flipped: isFlipping }"
          @click="playFlip"
        >
          <div class="card-face card-front">
            <div class="card-inner-content">
              <div class="card-letter">{{ modalData.letra }}</div>
              <div class="card-info">
                <h3 class="card-title">{{ modalData.palavra }}</h3>
                <p>Clique para ver a foto!</p>
              </div>
            </div>
          </div>

          <div class="card-face card-back">
            <div class="back-image-wrap">
              <img :src="modalData.img" :alt="modalData.palavra" />
              <div class="back-caption">{{ modalData.palavra }}</div>
            </div>
          </div>
        </div>

        <div class="card-actions">
          <button class="card-voice" @click="falar(modalData.letra, modalData.palavra)">
            <span>🔊</span> Ouvir
          </button>
          <button class="card-ok" @click="closeCard">Pronto!</button>
        </div>
      </div>
    </div>
  </div>
</template><style scoped>
/* Container Principal */
.lista-vogais {
  text-align: center;
  background: #f0fdfa;
  border-radius: 30px;
  padding: 40px 20px;
  max-width: 650px;
  margin: 20px auto;
  border: 2px solid #ccfbf1;
  box-shadow: 0 15px 35px rgba(11, 107, 88, 0.1);
}

.title-main {
  color: #0f766e;
  font-size: 2.2rem;
  margin-bottom: 30px;
  font-weight: 900;
}

/* Controles de Tamanho (ABC / abc) */
.controles-case {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
}

.btn-case {
  padding: 12px 28px;
  border: 2px solid #14b8a6;
  border-radius: 50px;
  background: white;
  color: #14b8a6;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-case.ativo {
  background: #14b8a6;
  color: white;
  box-shadow: 0 5px 15px rgba(20, 184, 166, 0.4);
}

/* Grid das Vogais */
.grid-vogais {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  list-style: none;
  padding: 0;
  justify-content: center;
}

.btn-vogal {
  width: 110px;
  height: 110px;
  font-size: 70px !important;
  font-weight: 900;
  cursor: pointer;
  background: white;
  color: #0f766e;
  border: none;
  border-radius: 24px;
  box-shadow: 0 6px 0 #cbd5e1, 0 8px 15px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.btn-vogal:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 0 #cbd5e1, 0 12px 20px rgba(0,0,0,0.1);
}

.btn-vogal:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #cbd5e1;
}

/* --- ESTILO DA CARTA (MODAL) --- */
.card-overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 107, 88, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.card-modal {
  background: white;
  width: 340px;
  height: 480px;
  border-radius: 30px;
  position: relative;
  padding: 20px;
  display: flex;
  flex-direction: column;
  perspective: 1000px; /* Necessário para o efeito 3D */
}

.card-flip {
  width: 100%;
  height: 80%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.card-flip.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.card-back {
  transform: rotateY(180deg);
  background: #ffffff;
}

.card-letter {
  font-size: 150px;
  font-weight: 900;
  color: #0f766e;
  line-height: 1;
}

.card-title {
  font-size: 1.5rem;
  color: #14b8a6;
  margin-top: 10px;
}

.back-image-wrap img {
  max-width: 220px;
  max-height: 220px;
  border-radius: 15px;
  object-fit: cover;
}

.back-caption {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f766e;
  margin-top: 15px;
}

/* Botões de Ação no Modal */
.card-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
  justify-content: center;
}

.card-voice, .card-ok {
  padding: 12px 20px;
  border-radius: 15px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-voice { background: #0ea5e9; color: white; }
.card-ok { background: #10b981; color: white; }

.card-close {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 30px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
}

.card-corner {
  position: absolute;
  font-size: 24px;
  font-weight: 900;
  color: #14b8a6;
  opacity: 0.3;
}
.top-left { top: 20px; left: 20px; }
.bottom-right { bottom: 20px; right: 20px; transform: rotate(180deg); }
</style>
<script setup>
import { ref, reactive, computed, onBeforeUnmount } from "vue";

const estiloAtual = ref("normal");
const vogaisData = [
  { letra: "A", palavra: "Algas", img: "/img/att-vogais/algas.png" },
  { letra: "E", palavra: "Estuario", img: "/img/att-vogais/estuario.png" },
  { letra: "I", palavra: "Igarapé", img: "/img/att-vogais/igarape.png" },
  { letra: "O", palavra: "Oceano", img: "/img/att-vogais/oceano.png" },
  { letra: "U", palavra: "Umidade", img: "/img/att-vogais/umidade.png" },
];
const corBotao = ref("#007bff");
const showCardModal = ref(false);
const modalData = reactive({ letra: "", palavra: "", img: "" });
const isFlipping = ref(false);

// Função para falar e mudar para Maiúscula
function mudarParaMaiuscula() {
  if (estiloAtual.value === "normal") return; // Já está ativo

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance("Mudar para letras maiúsculas");
  utterance.lang = "pt-BR";
  window.speechSynthesis.speak(utterance);

  estiloAtual.value = "normal";
}

// Função para falar e mudar para Minúscula
function mudarParaMinuscula() {
  if (estiloAtual.value === "lowercase") return; // Já está ativo

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance("Mudar para letras minúsculas");
  utterance.lang = "pt-BR";
  window.speechSynthesis.speak(utterance);

  estiloAtual.value = "lowercase";
}
const vogaisFormatadas = computed(() =>
  vogaisData.map((item) =>
    estiloAtual.value === "lowercase"
      ? item.letra.toLowerCase()
      : item.letra.toUpperCase()
  )
);

function playFlip() {
  isFlipping.value = false;
  void document.body.offsetWidth;
  isFlipping.value = true; //
  setTimeout(() => {
    isFlipping.value = false;
  }, 4000);
}

function onKeyDownCard(e) {
  if (e.key === "Escape" && showCardModal.value) closeCard();
}

function falar(letra, palavra) {
  // 1. Limpa qualquer fala que esteja tocando agora
  window.speechSynthesis.cancel();
  const letraTratada =
    letra.toUpperCase() === "E" ? "É" : letra.toUpperCase() === "O" ? "Ó" : letra;
  const utterance = new SpeechSynthesisUtterance(`${letraTratada} de ${palavra}`);
  utterance.lang = "pt-BR";
  utterance.rate = 0.7; // Velocidade levemente reduzida para clareza
  utterance.pitch = 1.1; // Um tom levemente mais agudo costuma soar menos "metálico"

  // 2. Tenta encontrar uma voz de alta qualidade (Google ou Microsoft)
  const vozes = window.speechSynthesis.getVoices();

  // Procuramos por vozes que contenham "Google" ou "Microsoft" no nome
  const melhorVoz =
    vozes.find(
      (voz) =>
        voz.lang.includes("pt-BR") &&
        (voz.name.includes("Google") || voz.name.includes("Natural"))
    ) || vozes.find((voz) => voz.lang.includes("pt-BR"));

  if (melhorVoz) {
    utterance.voice = melhorVoz;
  }

  window.speechSynthesis.speak(utterance);
}

// IMPORTANTE: As vozes são carregadas de forma assíncrona.
// Esse comando garante que elas estejam prontas para uso.
window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};

function openCard(letra) {
  const found = vogaisData.find(
    (item) => item.letra.toLowerCase() === letra.toLowerCase()
  );
  if (found) {
    modalData.letra = found.letra;
    modalData.palavra = found.palavra;
    modalData.img = found.img;
  } else {
    modalData.letra = letra;
    modalData.palavra = "";
    modalData.img = "";
  }
  showCardModal.value = true;
  isFlipping.value = true;
  falar(modalData.letra, modalData.palavra);
  setTimeout(() => {
    isFlipping.value = false;
  }, 2000);
  window.addEventListener("keydown", onKeyDownCard);
}

function closeCard() {
  showCardModal.value = false;
  modalData.letra = "";
  modalData.palavra = "";
  modalData.img = "";
  window.removeEventListener("keydown", onKeyDownCard);
}

function lerTextoBotao() {
  const texto = estiloAtual.value === "lowercase" ? "MAIÚSCULA" : "minúscula";
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "pt-BR";
  window.speechSynthesis.speak(utterance);
  alternarEstilo();
  corBotao.value = corBotao.value === "#007bff" ? "#28a745" : "#007bff";
}

function alternarEstilo() {
  estiloAtual.value = estiloAtual.value === "normal" ? "lowercase" : "normal";
}

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDownCard);
});
</script>
