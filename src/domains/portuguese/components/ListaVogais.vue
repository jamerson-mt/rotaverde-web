<template>
  <div class="lista-vogais">
    <h2>Vogais</h2>
    <button
      class="btn-toggle-case btn-echo"
      @click="lerTextoBotao"
      :style="{ backgroundColor: corBotao, color: '#ffffff', '--btn-color': corBotao }"
    >
      {{ estiloAtual === "lowercase" ? "minúscula" : "MAIÚSCULA" }}
    </button>
    <ul>
      <li v-for="vogal in vogaisFormatadas" :key="vogal">
        <button
          @click="openCard(vogal)"
          :style="{
            fontStyle: estiloAtual === 'italic' ? 'italic' : 'normal',
            backgroundColor: '#f0f8ff',
            color: '#000000',
          }"
        >
          {{ vogal }}
        </button>
      </li>
    </ul>

    <div v-if="showCardModal" class="card-overlay" @click.self="closeCard">
      <div
        class="card-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="`Carta ${modalData.letra}`"
      >
        <button class="card-close" @click="closeCard" aria-label="Fechar">×</button>
        <div class="card-corner top-left">{{ modalData.letra }}</div>
        <div class="card-corner bottom-right">{{ modalData.letra }}</div>

        <div
          class="card-flip"
          :class="{ flipped: isFlipping }"
          @click="playFlip"
          role="button"
          tabindex="0"
        >
          <div class="card-face card-front">
            <div class="card-inner">
              <div class="card-left">
                <div class="card-letter">{{ modalData.letra }}</div>
              </div>
              <div class="card-right">
                <h3 class="card-title">{{ modalData.palavra }}</h3>
                <p class="card-text">
                  Exemplo: <strong>{{ modalData.palavra }}</strong>
                </p>
              </div>
            </div>
          </div>

          <div class="card-face card-back">
            <div class="back-image-wrap">
              <img :src="modalData.img" :alt="modalData.palavra" loading="lazy" />
            </div>
            <div class="back-caption">{{ modalData.palavra }}</div>
          </div>
        </div>

        <div class="card-actions">
          <button class="card-voice" @click="falar(modalData.letra, modalData.palavra)">
            Ouvir
          </button>
          <button class="card-ok" @click="closeCard">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

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
  utterance.rate = 0.8; // Velocidade levemente reduzida para clareza
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
  setTimeout(() => {
    isFlipping.value = false;
  }, 500);
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

<style scoped>
.lista-vogais {
  text-align: center;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 600px;
  margin: auto;
}

.lista-vogais ul {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  list-style: none;
  padding: 0;
  justify-content: center;
}

.lista-vogais li {
  margin: 0;
}

.lista-vogais button {
  font-size: 1.5rem;
  padding: 10px 20px;
  cursor: pointer;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  transition: background 0.3s;
}

.lista-vogais button:hover {
  opacity: 0.9;
}

.btn-toggle-case {
  position: relative;
  z-index: 1;
  overflow: visible;
}
.btn-echo::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(1);
  width: 110%;
  height: 110%;
  border-radius: 999px;
  background: transparent;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.02),
    0 0 0 0 var(--btn-color, rgba(255, 255, 255, 0.12));
  z-index: 0;
  opacity: 0;
  pointer-events: none;
  animation: echoPulse 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
}

@keyframes echoPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.92);
    opacity: 0;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.02), 0 0 0 0 var(--btn-color);
  }
  45% {
    transform: translate(-50%, -50%) scale(1.06);
    opacity: 0.18;
    box-shadow: 0 0 0 6px rgba(0, 0, 0, 0.02), 0 0 0 6px var(--btn-color);
  }
  100% {
    transform: translate(-50%, -50%) scale(1.18);
    opacity: 0;
    box-shadow: 0 0 0 14px rgba(0, 0, 0, 0.02), 0 0 0 14px var(--btn-color);
  }
}

@media (prefers-reduced-motion: reduce) {
  .btn-echo::after {
    animation: none;
    opacity: 0;
  }
}

.card-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}
.card-modal {
  background: linear-gradient(180deg, #ffffff, #fcfff9);
  width: 320px;
  max-width: 86vw;
  height: 460px;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(2, 48, 36, 0.25);
  padding: 18px;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 80px;
}

.card-close {
  position: absolute;
  top: 8px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.card-inner {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 100%;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transition: transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.flip-animation {
  transform: rotateY(180deg);
}

@keyframes cardFlip {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(180deg);
  }
}
.card-left {
  flex: 0 0 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-letter {
  margin-top: 5rem;
  font-size: 140px;
  font-weight: 900;
  color: #0b6b58;
  font-family: "Georgia", "Times New Roman", serif;
  text-shadow: 0 2px 0 rgba(255, 255, 255, 0.6);
}
.card-right {
  flex: 1;
  text-align: center;
  padding-left: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card-title {
  margin: 0 0 6px 0;
  color: #096b4f;
}
.card-text {
  margin: 0 0 12px 0;
  color: #334155;
}
.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  position: absolute;
  bottom: 40px;
  right: 18px;
}
.card-voice,
.card-ok {
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
.card-voice {
  background: #06b6d4;
  color: #fff;
}
.card-ok {
  background: #10b981;
  color: #fff;
}

/* Cantos decorativos (letra pequena) */
.card-corner {
  position: absolute;
  font-size: 18px;
  font-weight: 800;
  color: rgba(6, 107, 88, 0.95);
  font-family: "Georgia", serif;
}
.card-corner.top-left {
  top: 10px;
  left: 12px;
}
.card-corner.bottom-right {
  bottom: 10px;
  right: 12px;
  transform: rotate(180deg);
}

/* Mais parecido com carta: acabamento interno */
.card-modal:before {
  content: "";
  position: absolute;
  inset: 10px;
  border-radius: 8px;
  pointer-events: none;
  box-shadow: inset 0 0 0 1px rgba(6, 107, 88, 0.03);
}

/* Flip container e faces */
.card-flip {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  perspective: 1200px;
  transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1);
  cursor: pointer;
}
.card-flip.flipped {
  transform: rotateY(180deg);
}
.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 10px;
}
.card-front {
  z-index: 2;
  transform: rotateY(0deg);
}
.card-back {
  transform: rotateY(180deg);
  background: linear-gradient(180deg, #fbfff9, #eafff1);
}
.back-image-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-image-wrap img {
  max-width: 80%;
  max-height: 70%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  background: white;
  padding: 8px;
}
.back-caption {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 700;
  color: #0b6b58;
}

@media (max-width: 480px) {
  .card-inner {
    flex-direction: column;
    align-items: stretch;
  }
  .card-left {
    flex: none;
  }
  .card-letter {
    font-size: 96px;
  }
  .card-actions {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
  }
}
</style>
