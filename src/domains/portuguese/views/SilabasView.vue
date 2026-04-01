<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import Header from "@/domains/reasoning/components/HeaderTop.vue";
import TitleCategories from "@/domains/user/components/TitleCategories.vue";

// Dados das palavras
const wordsData = [
  {
    id: "desmatamento",
    img: "desmatamento.png",
    word: "DESMATAMENTO",
    syllables: ["DES", "MA", "TA", "MEN", "TO"],
    definition:
      "A retirada da vegetação de uma área, geralmente causada por atividades humanas como agricultura e urbanização.",
  },
  {
    id: "caatinga",
    img: "caatinga.png",
    word: "CAATINGA",
    syllables: ["CA", "A", "TIN", "GA"],
    definition:
      "Um bioma brasileiro caracterizado pelo clima semiárido, com vegetação adaptada à seca.",
  },
  {
    id: "floresta",
    img: "floresta.png",
    word: "FLORESTA",
    syllables: ["FLO", "RES", "TA"],
    definition:
      "Uma grande área coberta por árvores e outras formas de vegetação, abrigando uma rica biodiversidade.",
  },
  {
    id: "reciclagem",
    img: "reciclagem.png",
    word: "RECICLAGEM",
    syllables: ["RE", "CI", "CLA", "GEM"],
    definition:
      "Processo de transformar materiais usados em novos produtos, ajudando a reduzir o lixo e preservar recursos naturais.",
  },
  {
    id: "sustentavel",
    img: "sustentavel.png",
    word: "SUSTENTÁVEL",
    syllables: ["SUS", "TEN", "TÁ", "VEL"],
    definition:
      "Algo que pode ser mantido por muito tempo sem esgotar os recursos naturais ou prejudicar o meio ambiente.",
  },
  {
    id: "poluicao",
    img: "poluicao.png",
    word: "POLUIÇÃO",
    syllables: ["PO", "LU", "I", "ÇÃO"],
    definition:
      "A contaminação do meio ambiente causada por substâncias nocivas, como lixo, fumaça ou produtos químicos.",
  },
  {
    id: "vitoria-regia",
    img: "vitoria-regia.png",
    word: "VITÓRIA-RÉGIA",
    syllables: ["VI", "TÓ", "RI", "A", "-RÉ", "GI", "A"],
    definition:
      "Uma planta aquática gigante da Amazônia, com folhas circulares que podem chegar a mais de 2 metros de diâmetro.",
  },
];

// Estados Reativos
const currentWordIndex = ref(0);
const currentWordData = ref(wordsData[0]);
const scrambledTiles = ref<string[]>([]);
const assembledTiles = ref<(string | null)[]>([]);
const feedbackMessage = ref("");
const showDefinition = ref(false);
const showInfoCard = ref(false);
const isCorrect = ref(false);
const totalTime = ref(0);
let activityInterval: any = null;

// Lógica para selecionar voz feminina
let femaleVoice: SpeechSynthesisVoice | null = null;

const loadVoices = () => {
  const voices = window.speechSynthesis.getVoices();
  // Tenta encontrar a voz do Google em PT-BR (geralmente feminina e de alta qualidade)
  femaleVoice =
    voices.find((voice) => voice.name === "Google português do Brasil") || null;

  // Se não encontrar, tenta qualquer voz feminina em português
  if (!femaleVoice) {
    femaleVoice =
      voices.find(
        (voice) => voice.lang.startsWith("pt") && voice.name.includes("Female")
      ) || null;
  }

  // Fallback para a primeira voz em português se nenhuma feminina específica for encontrada
  if (!femaleVoice) {
    femaleVoice = voices.find((voice) => voice.lang.startsWith("pt")) || null;
  }
};

// Carrega as vozes imediatamente e quando elas mudarem (necessário para alguns navegadores)
if ("speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}
const setupUtterance = (text: string, rate = 0.85, pitch = 1.1) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR"; // Garante a fonética brasileira
  utterance.rate = rate;
  utterance.pitch = pitch;

  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }
  return utterance;
};
function speakSyllable(text: string) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    
    let phoneticText = text.toLowerCase();

    // DICIONÁRIO DE AJUSTES (Para o som sair perfeito)
    const corrections: Record<string, string> = {
      "ci": "si",      // Força o som de "si" e evita que soletre C-I
           // Garante o som fechado de "mên"
    };

    // Aplica a correção se a sílaba estiver no dicionário
    if (corrections[phoneticText]) {
      phoneticText = corrections[phoneticText];
    }

    const utterance = setupUtterance(phoneticText, 0.6, 1.1); 
    window.speechSynthesis.speak(utterance);
  }
}

function speakWordAndDescription(word: string, description: string) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();

    const wordUtter = setupUtterance(word, 0.8, 1.1);

    wordUtter.onend = () => {
      // Pequena pausa antes da descrição
      setTimeout(() => {
        const descUtter = setupUtterance(description, 0.9, 1.05); // Velocidade normal para descrição
        window.speechSynthesis.speak(descUtter);
      }, 300);
    };

    window.speechSynthesis.speak(wordUtter);
  }
}

function speakFeedback(text: string) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = setupUtterance(text, 0.95, 1.1);
    window.speechSynthesis.speak(utterance);
  }
}

// Jogo e Timer (mantidos)
function shuffleArray(array: string[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initializeGame() {
  const word = wordsData[currentWordIndex.value];
  currentWordData.value = word;
  scrambledTiles.value = shuffleArray([...word.syllables]);
  assembledTiles.value = Array(word.syllables.length).fill(null);
  feedbackMessage.value = "";
  showDefinition.value = false;
  isCorrect.value = false;
}

function startActivityTimer() {
  clearInterval(activityInterval);
  activityInterval = setInterval(() => {
    totalTime.value += 1;
  }, 1000);
}

function handleTilePress(tileText: string, isFromPool: boolean, index: number) {
  if (isCorrect.value) return;
  speakSyllable(tileText);

  if (isFromPool) {
    const emptyIdx = assembledTiles.value.findIndex((t) => t === null);
    if (emptyIdx !== -1) {
      assembledTiles.value[emptyIdx] = tileText;
      scrambledTiles.value.splice(index, 1);
    }
  } else {
    assembledTiles.value[index] = null;
    scrambledTiles.value.push(tileText);
  }
}

function checkWord() {
  const assembledWord = assembledTiles.value.join("");
  const correctWord = currentWordData.value.syllables.join("");

  if (assembledWord === correctWord) {
    feedbackMessage.value = "Parabéns! Você acertou!";
    showDefinition.value = true;
    isCorrect.value = true;
    speakWordAndDescription(currentWordData.value.word, currentWordData.value.definition);
    if (currentWordIndex.value === wordsData.length - 1) clearInterval(activityInterval);
  } else {
    feedbackMessage.value = "Foi quase, tente de novo!";
    speakFeedback(feedbackMessage.value);
  }
}

watch(currentWordIndex, initializeGame);

onMounted(() => {
  window.addEventListener(
    "keydown",
    (e) => e.key === "Escape" && (showDefinition.value = false)
  );
  startActivityTimer();
});

onBeforeUnmount(() => clearInterval(activityInterval));
initializeGame();
</script>

<template>
  <Header />

  <div class="container">
    <TitleCategories title="" route="/att/roadMapPalavra" />

    <div class="header-game">
      <h2 class="subtitle">Quebra-Cabeças de Palavras</h2>
      <div class="timer">⏱️ {{ totalTime }}s</div>
    </div>

    <div class="image-container" v-if="currentWordData.img">
      <img
        :src="`img/att-silabas/${currentWordData.img}`"
        :alt="currentWordData.word"
        class="word-image"
        @click="speakWordAndDescription(currentWordData.word, currentWordData.definition)"
      />
    </div>

    <div class="assembled-area">
      <button
        v-for="(tile, index) in assembledTiles"
        :key="'assembled-' + index"
        class="tile"
        :class="tile ? 'filled' : 'empty'"
        @click="tile && handleTilePress(tile, false, index)"
      >
        {{ tile || "_" }}
      </button>
    </div>

    <div class="scrambled-area">
      <button
        v-for="(tile, index) in scrambledTiles"
        :key="'scrambled-' + index"
        class="tile unselected"
        @click="handleTilePress(tile, true, index)"
      >
        {{ tile }}
      </button>
    </div>

    <div class="button-container">
      <button
        class="action-btn"
        @click="checkWord"
        :disabled="assembledTiles.includes(null) || isCorrect"
      >
        Verificar
      </button>
      <button class="action-btn reset" @click="initializeGame">Reiniciar</button>
    </div>

    <Transition name="fade">
      <p
        v-if="feedbackMessage"
        :class="['feedback', isCorrect ? 'correct' : 'incorrect']"
      >
        {{ feedbackMessage }}
      </p>
    </Transition>

    <Teleport to="body">
      <div
        v-if="showDefinition"
        class="modal-overlay"
        @click.self="showDefinition = false"
      >
        <div class="modal">
          <button class="modal-close" @click="showDefinition = false">×</button>
          <div class="modal-grid">
            <div class="modal-image centralize">
              <img
                :src="`img/att-silabas/${currentWordData.img}`"
                :alt="currentWordData.word"
              />
            </div>
            <div class="modal-text">
              <h3>{{ currentWordData.word }}</h3>
              <p>{{ currentWordData.definition }}</p>
              <button
                class="next-btn"
                @click="
                  () => {
                    showDefinition = false;
                    currentWordIndex = (currentWordIndex + 1) % wordsData.length;
                  }
                "
              >
                Próxima Palavra ➡️
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <button class="floating-button" @click="showInfoCard = !showInfoCard">ℹ️</button>

    <Transition name="fade">
      <div v-if="showInfoCard" class="info-card">
        <h3>Objetivo da Atividade</h3>
        <p>
          Desenvolver a consciência fonológica e a habilidade de segmentação silábica.
        </p>
        <h5>BNCC</h5>
        <ul>
          <li><strong>EF01LP06</strong></li>
          <li><strong>EF01LP08</strong></li>
        </ul>
        <button class="close-info" @click="showInfoCard = false">Fechar</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap");

.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  text-align: center;
  background: #f0f9ff;
  border-radius: 20px;
  min-height: 85vh;
  font-family: "DM Sans", sans-serif;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  position: relative;
}

.header-game {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}
.subtitle {
  color: #4682b4;
  margin: 0;
  font-size: 1.5rem;
}
.timer {
  font-weight: bold;
  color: #ff4500;
  font-size: 1.2rem;
  background: white;
  padding: 5px 15px;
  border-radius: 20px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
}

/* --- MELHORIA: CENTRALIZAÇÃO DA IMAGEM --- */
.image-container {
  display: flex;
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente se houver altura definida */
  margin: 0 auto 25px auto;
  width: 100%;
  text-align: center;
}

.word-image {
  height: 200px; /* Aumentado um pouco */
  max-width: 100%;
  object-fit: contain; /* Garante que a imagem não distorça */
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: white;
  padding: 10px;
}

.word-image:hover {
  transform: scale(1.05) translateY(-5px); /* Efeito de pulo leve */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Áreas de Jogo */
.assembled-area,
.scrambled-area {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
  min-height: 60px; /* Garante espaço mesmo vazia */
}

.tile {
  padding: 15px 25px;
  font-size: 1.4rem;
  font-weight: 700;
  border-radius: 14px;
  border: 2px solid #6a5acd;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "DM Sans", sans-serif;
  text-transform: uppercase;
}

.unselected {
  background: #87ceeb;
  color: white;
  border: none;
  box-shadow: 0 4px 0 #5f9ea0;
}
.unselected:hover {
  transform: translateY(-2px);
  background: #a4e2fb;
}
.unselected:active {
  transform: translateY(2px);
  box-shadow: 0 0 0 #5f9ea0;
}

.filled {
  background: #aef418;
  color: #0f3d3e;
  border: none;
  box-shadow: 0 4px 0 #8cbd12;
}
.empty {
  background: #fff;
  border: 2px dashed #ccc;
  color: #ccc;
  box-shadow: none;
}

/* Botões de Ação */
.button-container {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.action-btn {
  padding: 15px 30px;
  border-radius: 50px;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  background: #20b2aa;
  color: white;
  box-shadow: 0 4px 0 #1a9690;
}
.action-btn:hover:not(:disabled) {
  background: #32c5bd;
  transform: translateY(-2px);
}
.action-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 0 0 #1a9690;
}

.action-btn.reset {
  background: #94a3b8;
  box-shadow: 0 4px 0 #64748b;
}
.action-btn.reset:hover {
  background: #cbd5e1;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.feedback {
  margin-top: 25px;
  font-weight: 700;
  font-size: 1.2rem;
  min-height: 1.4em;
}
.correct {
  color: #059669;
  animation: popIn 0.3s ease;
}
.incorrect {
  color: #dc2626;
  animation: shake 0.4s ease;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}
.modal {
  background: white;
  padding: 30px;
  border-radius: 24px;
  max-width: 600px;
  width: 90%;
  position: relative;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  animation: slideDown 0.4s ease;
}
.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 25px;
  align-items: center;
}
.modal-image.centralize {
  display: flex;
  justify-content: center;
  background: #f8fafc;
  padding: 15px;
  border-radius: 15px;
}
.modal-image img {
  max-height: 180px;
  max-width: 100%;
  object-fit: contain;
}
.modal-close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 30px;
  border: none;
  background: none;
  cursor: pointer;
  color: #94a3b8;
  line-height: 1;
}
.modal-close:hover {
  color: #1e293b;
}

.modal-text h3 {
  margin: 0 0 10px 0;
  color: #137e60;
  font-size: 1.6rem;
}
.modal-text p {
  color: #334155;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: left;
}

.next-btn {
  background: #137e60;
  color: white;
  border: none;
  width: 100%;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.next-btn:hover {
  background: #0e664e;
}

/* Floating Button & Info Card */
.floating-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #0056b3;
  color: white;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 86, 179, 0.3);
  z-index: 1000;
  transition: transform 0.2s;
}
.floating-button:hover {
  transform: scale(1.1) rotate(5deg);
}

.info-card {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 320px;
  background: white;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  text-align: left;
}
.info-card h3 {
  margin: 0 0 12px 0;
  font-size: 1.2rem;
  color: #0056b3;
}
.info-card p {
  color: #475569;
  font-size: 0.95rem;
  margin-bottom: 15px;
  line-height: 1.5;
}
.info-card h5 {
  margin: 0 0 8px 0;
  color: #1e293b;
}
.info-card ul {
  margin: 0;
  padding-left: 20px;
  color: #475569;
  font-size: 0.9rem;
}
.info-card li {
  margin-bottom: 5px;
}
.close-info {
  width: 100%;
  margin-top: 20px;
  background: #f1f5f9;
  border: none;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  color: #475569;
  font-weight: 500;
}
.close-info:hover {
  background: #e2e8f0;
}

/* Animations & Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes popIn {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  70% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20%,
  60% {
    transform: translateX(-5px);
  }
  40%,
  80% {
    transform: translateX(5px);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .container {
    padding: 15px;
    margin: 10px;
  }
  .modal-grid {
    grid-template-columns: 1fr;
    gap: 15px;
    text-align: center;
  }
  .modal-text p {
    text-align: center;
  }
  .header-game {
    flex-direction: column;
    gap: 10px;
  }
  .subtitle {
    font-size: 1.2rem;
  }
  .tile {
    padding: 10px 18px;
    font-size: 1.1rem;
  }
  .word-image {
    height: 150px;
  }
}
</style>
