<script setup lang="ts">
import { ref, reactive, computed, onBeforeUnmount } from "vue";
import TitleCategories from "@/domains/user/components/TitleCategories.vue";
import Header from "@/domains/reasoning/components/HeaderTop.vue";
import { exercises } from "../services/attTextos";

const currentExerciseIndex = ref(0);
const rawText = ref(exercises[currentExerciseIndex.value].text);

function alternateOrder<T>(arr: T[]) {
  const res: T[] = [];
  let i = 0;
  let j = arr.length - 1;
  while (i <= j) {
    if (i === j) res.push(arr[i]);
    else {
      res.push(arr[i]);
      res.push(arr[j]);
    }
    i++;
    j--;
  }
  return res;
}

const cards = reactive<Array<{ id: number; text: string; img: string }>>(
  alternateOrder(exercises[currentExerciseIndex.value].words).map((w) => ({
    id: w.id,
    text: w.word,
    img: w.img,
  }))
);

const answers = reactive<Record<number, number>>({});

let nextExerciseTimeout: number | null = null;

const showImageModal = ref(false);
const modalImageSrc = ref("");
const modalImageAlt = ref("");

let modalTimeout: number | null = null;

function openImageModal(img: string, alt: string = "", duration: number = 3000) {
  modalImageSrc.value = img;
  modalImageAlt.value = alt;
  showImageModal.value = true;

  if (modalTimeout !== null) clearTimeout(modalTimeout);

  modalTimeout = window.setTimeout(() => {
    closeImageModal();
    modalTimeout = null;
  }, duration);
}

function speakDescription(text: string) {
  try {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;

      // 1. Interrompe qualquer fala em andamento imediatamente
      synth.cancel();

      // 2. Cria a instância de fala
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";

      // 3. Velocidade: 0.9 é ideal para frases longas (claro, mas não arrastado)
      utterance.rate = 0.9;
      utterance.pitch = 1.0; // Tom neutro para descrições

      // 4. Seleção de Voz Premium (Google/Microsoft)
      const voices = synth.getVoices();
      const bestVoice =
        voices.find(
          (v) =>
            v.lang.includes("pt-BR") &&
            (v.name.includes("Google") || v.name.includes("Natural"))
        ) || voices.find((v) => v.lang.includes("pt-BR"));

      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // 5. Executa
      synth.speak(utterance);
    }
  } catch (e) {
    console.error("Erro ao reproduzir voz:", e);
  }
}

function closeImageModal() {
  showImageModal.value = false;
  modalImageSrc.value = "";
  modalImageAlt.value = "";
  if (modalTimeout !== null) {
    clearTimeout(modalTimeout);
    modalTimeout = null;
  }
}

function loadAnswersForExercise(index: number) {
  Object.keys(answers).forEach((k) => delete answers[Number(k)]);
  const ex = exercises[index];
  ex.words.forEach((w) => {
    answers[w.id] = w.id;
  });
}

loadAnswersForExercise(currentExerciseIndex.value);

const selectedCard = ref<{ id: number; text: string; img?: string } | null>(null);
const placedWords = reactive<Record<number, { id: number; text: string; img?: string }>>(
  {}
);
const placedStatus = reactive<Record<number, "correct" | "wrong" | null>>({});
const statusMessage = ref("");
const feedbackType = ref<null | "success" | "failure">(null);
const showFeedback = ref(false);
let feedbackTimeout: number | null = null;

function hideFeedback() {
  if (feedbackTimeout !== null) {
    clearTimeout(feedbackTimeout);
    feedbackTimeout = null;
  }
  showFeedback.value = false;
  feedbackType.value = null;
}

type Segment = { type: "text"; value: string } | { type: "blank"; id: number };
const parsedText = computed<Segment[]>(() => {
  const parts: Segment[] = [];
  const regex = /\{(\d+)\}/g;
  let lastIndex = 0;
  let match;
  const text = rawText.value;
  while ((match = regex.exec(text)) !== null) {
    const idx = match.index;
    if (idx > lastIndex) parts.push({ type: "text", value: text.slice(lastIndex, idx) });
    parts.push({ type: "blank", id: Number(match[1]) });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push({ type: "text", value: text.slice(lastIndex) });
  return parts;
});

function loadExercise(index: number) {
  if (index < 0 || index >= exercises.length) return;
  currentExerciseIndex.value = index;
  rawText.value = exercises[index].text;
  cards.splice(
    0,
    cards.length,
    ...alternateOrder(exercises[index].words).map((w) => ({
      id: w.id,
      text: w.word,
      img: w.img,
    }))
  );
  loadAnswersForExercise(index);
  Object.keys(placedWords).forEach((k) => delete placedWords[Number(k)]);
  Object.keys(placedStatus).forEach((k) => delete placedStatus[Number(k)]);
  selectedCard.value = null;
  statusMessage.value = "";
}

function onDragStart(card: { id: number; text: string }, ev: DragEvent) {
  if (!ev.dataTransfer) return;
  ev.dataTransfer.setData("text/plain", String(card.id));
  selectedCard.value = { id: card.id, text: card.text, img: (card as any).img };
  speakDescription(card.text);
}

function onDrop(blankId: number, ev: DragEvent) {
  ev.preventDefault();
  if (!ev.dataTransfer) return;
  const idStr = ev.dataTransfer.getData("text/plain");
  const cardId = Number(idStr);
  const card = cards.find((c) => c.id === cardId);
  if (!card) return;
  placeCardAt(blankId, card);
}

function selectCard(card: { id: number; text: string; img?: string }) {
  if (isPlaced(card.id)) return;
  if (selectedCard.value && selectedCard.value.id === card.id) {
    selectedCard.value = null;
  } else {
    selectedCard.value = { ...card };
    speakDescription(card.text);
    if (card.img) openImageModal(card.img, card.text);
  }
}

function placeSelectedAt(blankId: number) {
  if (!selectedCard.value) return;
  if (isPlaced(selectedCard.value.id)) return;
  placeCardAt(blankId, selectedCard.value);
  selectedCard.value = null;
}

function placeCardAt(blankId: number, card: { id: number; text: string; img?: string }) {
  placedWords[blankId] = { id: card.id, text: card.text, img: (card as any).img };
  placedStatus[blankId] = null;
}

function removePlaced(blankId: number) {
  const placed = placedWords[blankId];
  if (!placed) return;
  selectedCard.value = { id: placed.id, text: placed.text, img: placed.img };
  delete placedWords[blankId];
  placedStatus[blankId] = null;
}

function isPlaced(cardId: number) {
  return Object.values(placedWords).some((p) => p.id === cardId);
}

function checkAnswers() {
  const blanks = parsedText.value.filter(
    (s): s is { type: "blank"; id: number } => s.type === "blank"
  );
  let correct = 0;
  const total = blanks.length;
  blanks.forEach((b) => {
    const placed = placedWords[b.id];
    if (placed && answers[b.id] === placed.id) {
      correct++;
      placedStatus[b.id] = "correct";
    } else {
      if (placed) placedStatus[b.id] = "wrong";
      else placedStatus[b.id] = null;
    }
  });
  if (correct === total) {
    statusMessage.value = "Parabéns — todas as palavras estão corretas!";
    feedbackType.value = "success";
    if (nextExerciseTimeout !== null) {
      clearTimeout(nextExerciseTimeout);
      nextExerciseTimeout = null;
    }
    nextExerciseTimeout = window.setTimeout(() => {
      const next = currentExerciseIndex.value + 1;
      if (next < exercises.length) {
        loadExercise(next);
      } else {
        statusMessage.value = "Você completou todos os exercícios!";
        window.setTimeout(() => {
          loadExercise(0);
          window.location.href = "/att/roadmap";
        }, 2000);
      }
      nextExerciseTimeout = null;
    }, 1200);
  } else {
    statusMessage.value = `Você acertou ${correct} de ${total}.`;
    feedbackType.value = "failure";
  }
  if (statusMessage.value) speakDescription(statusMessage.value);
  showFeedback.value = true;
  if (feedbackTimeout !== null) clearTimeout(feedbackTimeout);
  feedbackTimeout = window.setTimeout(() => {
    hideFeedback();
  }, 2000);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function resetAll() {
  Object.keys(placedWords).forEach((k) => delete placedWords[Number(k)]);
  selectedCard.value = null;
  statusMessage.value = "";
  Object.keys(placedStatus).forEach((k) => delete placedStatus[Number(k)]);
}

function readFullSentence() {
  const currentEx = exercises[currentExerciseIndex.value];
  let fullText = currentEx.text;

  // Substituir cada {id} pela palavra correspondente
  currentEx.words.forEach((word) => {
    fullText = fullText.replace(`{${word.id}}`, word.word);
  });

  speakDescription(fullText);
}

onBeforeUnmount(() => {
  if (modalTimeout !== null) {
    clearTimeout(modalTimeout);
    modalTimeout = null;
  }
  if (feedbackTimeout !== null) {
    clearTimeout(feedbackTimeout);
    feedbackTimeout = null;
  }
  if (nextExerciseTimeout !== null) {
    clearTimeout(nextExerciseTimeout);
    nextExerciseTimeout = null;
  }
});
</script>

<template>
  <Header />
  <div class="inter-textos">
    <div class="container">
      <TitleCategories title="voltar" route="/att/roadMap" />
      <h1 class="title">Montando sentido</h1>
      <h2 class="subtitle">Complete o texto com as palavras</h2>
    </div>
    <div class="activity-wrapper">
      <transition name="fade">
        <div
          v-if="showImageModal"
          class="image-modal-backdrop"
          @click.self="closeImageModal"
        >
          <div class="image-modal-content">
            <button class="modal-close" @click="closeImageModal">×</button>
            <img :src="modalImageSrc" :alt="modalImageAlt" />
            <p v-if="modalImageAlt">{{ modalImageAlt }}</p>
          </div>
        </div>
      </transition>
      <div class="cards">
        <div
          v-for="card in cards"
          :key="card.id"
          class="word-card"
          :class="{
            picked: selectedCard && selectedCard.id === card.id,
            placed: isPlaced(card.id),
          }"
          draggable="true"
          @dragstart="onDragStart(card, $event)"
          @click="selectCard(card)"
          role="button"
          tabindex="0"
          :aria-pressed="!!selectedCard && selectedCard.id === card.id"
        >
          {{ card.text }}
        </div>
      </div>

      <div class="text-area">
        <p>
          <template v-for="(segment, idx) in parsedText" :key="idx">
            <span v-if="segment.type === 'text'">{{ segment.value }}</span>
            <span
              v-else
              class="blank"
              :data-blank-id="segment.id"
              @dragover.prevent
              @drop="onDrop(segment.id, $event)"
              @click="placeSelectedAt(segment.id)"
              tabindex="0"
              @keydown.enter.prevent="placeSelectedAt(segment.id)"
              :aria-label="`Lacuna ${segment.id}`"
            >
              <template v-if="placedWords[segment.id]">
                <span class="placed-wrapper">
                  <span
                    :class="['placed-text', placedStatus[segment.id]]"
                    role="button"
                    tabindex="0"
                    @click.stop="removePlaced(segment.id)"
                    @keydown.enter.prevent="removePlaced(segment.id)"
                    :aria-label="`Remover palavra colocada: ${
                      placedWords[segment.id].text
                    }`"
                  >
                    {{ placedWords[segment.id].text }}
                  </span>
                </span>
              </template>
              <template v-else> ________ </template>
            </span>
          </template>
        </p>
      </div>

      <div class="actions">
        <button
          class="btn btn-listen"
          @click="readFullSentence"
          title="Ouvir a frase completa"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Ouvir frase
        </button>
        <button class="btn btn-primary" @click="checkAnswers">Verificar respostas</button>
        <!-- <button class="btn btn-secondary" @click="resetAll">Reiniciar</button> -->
      </div>
      <transition name="feedback-fade">
        <div v-if="showFeedback" class="feedback" :class="feedbackType">
          <div class="feedback-icon" aria-hidden>
            <svg
              v-if="feedbackType === 'success'"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="feedback-text">{{ statusMessage }}</div>
          <button class="feedback-close" @click="hideFeedback">×</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 5px;
  text-align: center;
  border-radius: 10px;
}

.title {
  font-size: 28px;
  color: #2e8b57;
  margin-bottom: 0;
}

.subtitle {
  font-size: 20px;
  color: #4682b4;
}

.inter-textos {
  padding: 18px;
  max-width: 900px;
  margin: -1.1rem auto;
  color: #05221a;
}
.activity-wrapper {
  background: #f3fbf7;
  padding: 16px;
  border-radius: 10px;
  color: #05221a;
}
.image-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.image-modal-content {
  position: relative;
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  max-width: 90%;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
  animation: modal-pop 0.3s ease-out;
}

.image-modal-content img {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 12px;
  object-fit: contain;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  margin-bottom: 12px;
}

.image-modal-content p {
  font-weight: 600;
  color: #064e3b;
  text-align: center;
  margin: 0;
}

.modal-close {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 1.6rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@keyframes modal-pop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.cards {
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.word-card {
  padding: 8px 12px;
  border-radius: 8px;
  background: #0b6b58;
  color: #ffffff;
  border: 1px solid rgba(6, 107, 88, 0.12);
  cursor: pointer;
  user-select: none;
  box-shadow: 0 2px 6px rgba(4, 34, 24, 0.06);
}
.word-card.picked {
  box-shadow: 0 0 0 6px rgba(11, 107, 88, 0.12);
  outline: none;
}
.word-card.placed {
  opacity: 0.7;
  filter: saturate(0.95);
}
.text-area p {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #05221a;
}
.blank {
  display: inline-block;
  min-width: 90px;
  margin: 0 6px;
  padding: 6px 10px;
  border-bottom: 2px dashed rgba(6, 107, 88, 0.7);
  cursor: pointer;
  background: linear-gradient(180deg, #ffffff, #e9fff0);
  border-radius: 6px;
  color: #05221a;
  font-weight: 600;
}
.placed-text {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 800;
}
.placed-text.correct {
  background: linear-gradient(180deg, #dcfce7, #bbf7d0);
  color: #064e3b;
  border: 1px solid rgba(6, 107, 88, 0.12);
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.06);
}
.placed-text.wrong {
  background: linear-gradient(180deg, #fee2e2, #fecaca);
  color: #7f1d1d;
  border: 1px solid rgba(239, 68, 68, 0.12);
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.04);
  animation: shake 650ms;
}

.placed-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
  100% {
    transform: translateX(0);
  }
}
.actions {
  margin-top: 2.5rem;
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}
.btn {
  padding: 10px 14px;
  width: 90%;
  text-align: center;
  height: 3.5rem;
  border-radius: 10px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease-in-out;
  box-shadow: 0 4px 10px rgba(6, 107, 88, 0.12);
  user-select: none;
}
.btn:focus {
  outline: 3px solid rgba(11, 107, 88, 0.18);
  box-shadow: 0 4px 10px rgba(6, 107, 88, 0.12);
}
.btn-primary {
  background: linear-gradient(180deg, #2e8b57);
  color: #fff;
  box-shadow: 0 6px 18px rgba(6, 107, 88, 0.12);
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(6, 245, 201, 0.16);
}
.btn-listen {
  background: linear-gradient(180deg, #4682b4, #3a6fa0);
  color: #fff;
  box-shadow: 0 6px 18px rgba(70, 130, 180, 0.18);
}
.btn-listen:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(70, 130, 180, 0.25);
}
.btn-secondary {
  background: transparent;
  color: #0b6b58;
  border: 2px solid rgba(11, 107, 88, 0.14);
}
.btn-secondary:hover {
  background: rgba(11, 107, 88, 0.04);
}
.status {
  margin-left: 8px;
  font-weight: 700;
  color: #0b6b58;
}

.feedback {
  position: fixed;
  left: 50%;
  top: 10%;
  transform: translateX(-50%) scale(1);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: #fff;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  z-index: 3000;
  min-width: 320px;
  max-width: 90vw;
}
.feedback.success {
  background: linear-gradient(90deg, #10b981, #059669);
}
.feedback.failure {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}
.feedback-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.feedback-text {
  font-weight: 800;
}
.feedback-close {
  margin-left: auto;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  cursor: pointer;
}

/* animação */
.feedback-fade-enter-active,
.feedback-fade-leave-active {
  transition: all 300ms cubic-bezier(0.2, 0.9, 0.3, 1);
}
.feedback-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) scale(0.9);
}
.feedback-fade-enter-to {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
.feedback-fade-leave-from {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
.feedback-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.9);
}
</style>
