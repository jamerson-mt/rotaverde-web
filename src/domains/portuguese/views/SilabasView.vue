<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import Header from '@/domains/reasoning/components/HeaderTop.vue';
import { getUserId } from "@/utils/localStorageUtils";
import TitleCategories from "@/domains/user/components/TitleCategories.vue";

const wordsData = [
  { id: "vitoria-regia", img:"vitoria-regia.png", word: "VITÓRIA-RÉGIA", syllables: ["VI", "TÓ", "RI", "A", "-RÉ", "GI", "A"], definition: "Uma planta aquática gigante da Amazônia, com folhas circulares que podem chegar a mais de 2 metros de diâmetro." },
  { id: "desmatamento", img:"desmatamento.png", word: "DESMATAMENTO", syllables: ["DES", "MA", "TA", "MEN", "TO"], definition: "A retirada da vegetação de uma área, geralmente causada por atividades humanas como agricultura e urbanização." },
  { id: "caatinga", img:"caatinga.png", word: "CAATINGA", syllables: ["CA", "A", "TIN", "GA"], definition: "Um bioma brasileiro caracterizado pelo clima semiárido, com vegetação adaptada à seca." },
  { id: "floresta", img:"floresta.png", word: "FLORESTA", syllables: ["FLO", "RES", "TA"], definition: "Uma grande área coberta por árvores e outras formas de vegetação, abrigando uma rica biodiversidade." },
  { id: "reciclagem", img:"reciclagem.png", word: "RECICLAGEM", syllables: ["RE", "CI", "CLA", "GEM"], definition: "Processo de transformar materiais usados em novos produtos, ajudando a reduzir o lixo e preservar recursos naturais." },
  { id: "sustentavel", img:"sustentavel.png", word: "SUSTENTÁVEL", syllables: ["SUS", "TEN", "TÁ", "VEL"], definition: "Algo que pode ser mantido por muito tempo sem esgotar os recursos naturais ou prejudicar o meio ambiente." },
  { id: "poluicao", img:"poluicao.png", word: "POLUIÇÃO", syllables: ["PO", "LU", "I", "ÇÃO"], definition: "A contaminação do meio ambiente causada por substâncias nocivas, como lixo, fumaça ou produtos químicos." },
];

const currentWordIndex = ref(0);
const currentWordData = ref(wordsData[0]);
const scrambledTiles = ref([]);
const assembledTiles = ref([]);
const feedbackMessage = ref("");
const showDefinition = ref(false);
const isCorrect = ref(false);
const totalTime = ref(0); // Contador de tempo total em segundos
let activityInterval = null;

function shuffleArray(array) {
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

function stopActivityTimer() {
  clearInterval(activityInterval);
}

// async function sendResultsToAPI() {
//   let alunoId = getUserId();
//   if (!alunoId) {
//     alunoId = "default-user"; // Valor padrão
//   }
//   const payload = {
//     nome: "silabas",
//     alunoId,
//     tempo: totalTime.value,
//     palavrasCompletadas: wordsData.length,
//   };

//   console.log("Simulando envio de dados:", payload);
// }

watch(currentWordIndex, () => {
  initializeGame();
});

function speakSyllable(text) {
  if ('speechSynthesis' in window) {
    const toSpeak = text.length <= 2 ? text.split('').join(' ') : text;
    const utterance = new window.SpeechSynthesisUtterance(toSpeak);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.7;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}

function speakDescription(text) {
  if ('speechSynthesis' in window) {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
}

function speakWordAndDescription(word, description) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const wordUtter = new window.SpeechSynthesisUtterance(word);
    wordUtter.lang = 'pt-BR';
    wordUtter.rate = 0.85;
    wordUtter.onend = function() {
      speakDescription(description);
    };
    window.speechSynthesis.speak(wordUtter);
  }
}

function speakFeedback(text) {
  if ('speechSynthesis' in window) {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}

function handleTilePress(tileText, isFromScrambledPool, indexInPool) {
  if (isCorrect.value) return;

  // Fala a sílaba ao clicar
  speakSyllable(tileText);

  if (isFromScrambledPool) {
    const firstEmptyIndex = assembledTiles.value.findIndex(t => t === null);
    if (firstEmptyIndex !== -1) {
      assembledTiles.value[firstEmptyIndex] = tileText;
      scrambledTiles.value.splice(indexInPool, 1);
    }
  } else {
    const tileIndexInAssembled = assembledTiles.value.indexOf(tileText);
    if (tileIndexInAssembled !== -1) {
      assembledTiles.value[tileIndexInAssembled] = null;
      scrambledTiles.value.push(tileText);
    }
  }
}

function checkWord() {
  const assembledWord = assembledTiles.value.filter(t => t !== null).join("");
  if (assembledWord === currentWordData.value.word) {
    feedbackMessage.value = "Parabéns! Você acertou!";
    showDefinition.value = true;
    isCorrect.value = true;
    speakWordAndDescription(currentWordData.value.word, currentWordData.value.definition);

    // Verifica se é a última palavra
    if (currentWordIndex.value === wordsData.length - 1) {
      stopActivityTimer();
      // sendResultsToAPI();
    }
  } else {
    feedbackMessage.value = "Foi quase, Tente de novo!";
    showDefinition.value = false;
    isCorrect.value = false;
    speakFeedback(feedbackMessage.value);
  }
}

function goToNextWord() {
  showDefinition.value = false;
  currentWordIndex.value = (currentWordIndex.value + 1) % wordsData.length;
}

function closeModal() {
  showDefinition.value = false;
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && showDefinition.value) {
    closeModal();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  startActivityTimer(); // Inicia o contador ao montar o componente
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  stopActivityTimer(); // Para o contador ao desmontar o componente
});

function resetWord() {
  initializeGame();
}

initializeGame();
</script>

<template>
    <div><Header /></div>

  <div class="container">
    <TitleCategories title="" route="/att/roadMapPalavra"/>
    <h2 class="subtitle">Quebra-Cabeças de Palavras</h2>
    <div class="image-container" v-if="currentWordData.img">
      <img
        :src="`img/att-silabas/${currentWordData.img}`"
        :alt="currentWordData.word"
        class="word-image"
        @click="speakWordAndDescription(currentWordData.word, currentWordData.definition)"
      />
    </div>

    <div class="timer">
      <p>Tempo decorrido: {{ totalTime }} segundos</p>
    </div>

    <div class="assembled-area">
      <button
        v-for="(tile, index) in assembledTiles"
        :key="'assembled-' + index"
        class="tile"
        :class="tile ? 'filled' : 'empty'"
        @click="tile && handleTilePress(tile, false, index)"
      >
        {{ tile || '_' }}
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
      <button class="action-btn" @click="resetWord">
        Reiniciar
      </button>
    </div>

    <p
      v-if="feedbackMessage"
      :class="['feedback', isCorrect ? 'correct' : 'incorrect']"
    >
      {{ feedbackMessage }}
    </p>

    <div v-if="showDefinition" class="modal-overlay" @click.self="closeModal">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="currentWordData.word">
        <button class="modal-close" @click="closeModal" aria-label="Fechar">×</button>
        <div class="modal-content">
          <div class="modal-grid">
            <div class="modal-image" v-if="currentWordData.img">
              <img :src="`img/att-silabas/${currentWordData.img}`" :alt="currentWordData.word" />
            </div>
            <div class="modal-text">
              <h3>{{ currentWordData.word }}</h3>
              <p>{{ currentWordData.definition }}</p>
              <div class="modal-actions">
                <button class="next-btn" @click="goToNextWord">
                  Próxima Palavra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  text-align: center;
  background: #e0f2f7;
  border-radius: 10px;
  height: 100rem;
}

.title {
  font-size: 28px;
  color: #2e8b57;
}

.subtitle {
  font-size: 20px;
  color: #4682b4;
  margin-bottom: 20px;
}
.instructions {
  font-size: 16px;
  margin-bottom: 20px;
}
.assembled-area, .scrambled-area {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 15px;
}
.tile {
  padding: 10px 15px;
  margin: 5px;
  border-radius: 10px;
  border: 1px solid #6a5acd;
  font-weight: bold;
  cursor: pointer;
}
.unselected {
  background: #87ceeb;
  color: #2a2a2a;
}
.filled {
  background: #aef418;
  color: #fdfdfd;
}
.empty {
  background: #f0f8ff;
  border-style: dashed;
}
.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.action-btn {
  background: #20b2aa;
  color: white;
  padding: 10px 20px;
  border-radius: 15px;
  font-weight: bold;
  cursor: pointer;
}
.feedback {
  font-size: 18px;
  font-weight: bold;
}
.correct {
  margin-top: 1rem;
  color: green;
}
.incorrect {
  color: crimson;
  margin-top: 1rem;
}
.definition-box {
  background: #137E60;
  color: #fbf8f8;
  padding: 20px;
  border-radius: 15px;
  margin-top: 20px;
}
.next-btn {
  background: dodgerblue;
  color: white;
  padding: 15px 20px;
  border-radius: 15px;
  margin-top: 10px;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
  max-height: 220px; 
  overflow: hidden;
}
.word-image {
  width: auto;
  height: 180px; 
  max-width: 100%;
  object-fit: contain; 
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #ffffff;
  color: #1f2937;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  position: relative;
}
.modal-close {
  position: absolute;
  top: 8px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
}
.modal-content h3 {
  margin-top: 6px;
  color: #137E60;
}
.modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 16px;
  align-items: center;
}
.modal-image img {
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(19,126,96,0.16);
  background: linear-gradient(180deg, #f7fffb, #e9fff2);
  padding: 8px;
}
.modal-text p {
  text-align: left;
  color: #334155;
  line-height: 1.4;
  margin-top: 8px;
}
.next-btn {
  background: linear-gradient(90deg,#1eaab0,#137e60);
  color: white;
  padding: 10px 20px;
  border-radius: 14px;
  margin-top: 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(19,126,96,0.18);
}
.next-btn:hover { transform: translateY(-2px); }
.modal-close { font-size: 26px; color: #374151; }
.modal-close:hover { color: #111827; }

/* Responsividade: empilhar em telas pequenas */
@media (max-width: 600px) {
  .modal-grid { grid-template-columns: 1fr; }
  .modal-image img { max-height: 160px; }
  .modal { padding: 14px; }
}
.timer {
  font-size: 18px;
  font-weight: bold;
  color: #ff4500;
  margin-bottom: 15px;
}
</style>
