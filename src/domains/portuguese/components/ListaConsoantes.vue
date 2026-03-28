<script setup>
import { ref, reactive, computed, onBeforeUnmount } from "vue";

const estiloAtual = ref("normal");
const consoantesData = [
  { letra: "B", palavra: "Bioma", img: "/img/att-consoantes/bioma.png" },
  { letra: "C", palavra: "Caranguejo", img: "/img/att-consoantes/caranguejo.png" },
  { letra: "D", palavra: "Dendê", img: "/img/att-consoantes/dende.png" },
  { letra: "F", palavra: "Flora", img: "/img/att-consoantes/flora.png" },
  { letra: "G", palavra: "Gaiamum", img: "/img/att-consoantes/gaiamum.png" },
  { letra: "H", palavra: "Habitat", img: "/img/att-consoantes/habitat.png" },
  { letra: "J", palavra: "Jangada", img: "/img/att-consoantes/jangada.png" },
  { letra: "K", palavra: "Kiwi", img: "/img/att-consoantes/kiwi.png" },
  { letra: "L", palavra: "Litoral", img: "/img/att-consoantes/litoral.png" },
  { letra: "M", palavra: "Manguezal", img: "/img/att-consoantes/manguezal.png" },
  { letra: "N", palavra: "Nascente", img: "/img/att-consoantes/nascente.png" },
  { letra: "P", palavra: "Peixe-Boi", img: "/img/att-consoantes/peixe-boi.png" },
  { letra: "Q", palavra: "Quilombo", img: "/img/att-consoantes/quilombo.png" },
  { letra: "R", palavra: "Reciclagem", img: "/img/att-consoantes/reciclagem.png" },
  { letra: "S", palavra: "Sustentabilidade", img: "/img/att-consoantes/sustentabilidade.png" },
  { letra: "T", palavra: "Tartaruga", img: "/img/att-consoantes/tartaruga.png" },
  { letra: "V", palavra: "Vegetação", img: "/img/att-consoantes/vegetacao.png" },
  { letra: "W", palavra: "WhatsApp", img: "/img/att-consoantes/whatsapp.png" },
  { letra: "X", palavra: "Xícara", img: "/img/att-consoantes/xicara.png" },
  { letra: "Y", palavra: "YouTube", img: "/img/att-consoantes/youtube.png" },
  { letra: "Z", palavra: "Zona estuarina", img: "/img/att-consoantes/zona-estuarina.png" },
];

const showCardModal = ref(false);
const modalData = reactive({ letra: "", palavra: "", img: "" });
const isFlipping = ref(false);
let autoFlipTimeout = null;

const consoantesFormatadas = computed(() =>
  consoantesData.map((item) =>
    estiloAtual.value === "lowercase" ? item.letra.toLowerCase() : item.letra.toUpperCase()
  )
);

function falar(letra, palavra) {
  window.speechSynthesis.cancel();
  const letraTratada = letra.toUpperCase() === "E" ? "É" : letra.toUpperCase() === "O" ? "Ó" : letra;
  const utterance = new SpeechSynthesisUtterance(`${letraTratada} de ${palavra}`);
  utterance.lang = "pt-BR";
  utterance.rate = 0.7;
  utterance.pitch = 1.1;

  const vozes = window.speechSynthesis.getVoices();
  const melhorVoz = vozes.find(v => v.lang.includes("pt-BR") && (v.name.includes("Google") || v.name.includes("Natural"))) 
                   || vozes.find(v => v.lang.includes("pt-BR"));
  if (melhorVoz) utterance.voice = melhorVoz;
  window.speechSynthesis.speak(utterance);
}

function openCard(letra) {
  const found = consoantesData.find(i => i.letra.toLowerCase() === letra.toLowerCase());
  if (found) {
    modalData.letra = estiloAtual.value === 'lowercase' ? found.letra.toLowerCase() : found.letra.toUpperCase();
    modalData.palavra = found.palavra;
    modalData.img = found.img;
  }

  showCardModal.value = true;
  
  // 1. Começa virado (mostrando a IMAGEM no verso)
  isFlipping.value = true; 
  
  // 2. Fala assim que abre
  falar(modalData.letra, modalData.palavra);

  // 3. Troca para a LETRA (frente) automaticamente após 2 segundos
  if (autoFlipTimeout) clearTimeout(autoFlipTimeout);
  autoFlipTimeout = setTimeout(() => {
    isFlipping.value = false; // Vira para a frente (Letra)
  }, 2000);
}

function closeCard() {
  showCardModal.value = false;
  if (autoFlipTimeout) clearTimeout(autoFlipTimeout);
}

// Mantendo os controles de case
function mudarParaMaiuscula() {
  estiloAtual.value = "normal";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance("Letras maiúsculas"));
}

function mudarParaMinuscula() {
  estiloAtual.value = "lowercase";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance("Letras minúsculas"));
}

onBeforeUnmount(() => {
  if (autoFlipTimeout) clearTimeout(autoFlipTimeout);
});
</script>
<template>
  <div class="lista-consoantes">
    <h2 class="title-main">Consoantes</h2>

    <div class="controles-case">
      <button class="btn-case" :class="{ ativo: estiloAtual === 'normal' }" @click="mudarParaMaiuscula">ABC</button>
      <button class="btn-case" :class="{ ativo: estiloAtual === 'lowercase' }" @click="mudarParaMinuscula">abc</button>
    </div>

    <ul class="grid-horizontal">
      <li v-for="letra in consoantesFormatadas" :key="letra">
        <button class="btn-letra" @click="openCard(letra)">
          {{ letra }}
        </button>
      </li>
    </ul>

    <div v-if="showCardModal" class="card-overlay" @click.self="closeCard">
      <div class="card-modal">
        <button class="card-close" @click="closeCard">×</button>
        
        <div class="card-flip" :class="{ flipped: isFlipping }">
          <div class="card-face card-front">
             <div class="card-letter">{{ modalData.letra }}</div>
          </div>

          <div class="card-face card-back">
            <div class="back-content">
               <img :src="modalData.img" :alt="modalData.palavra" class="img-card" />
               <p class="palavra-card">{{ modalData.palavra }}</p>
            </div>
          </div>
        </div>

        <div class="card-actions">
           <button class="card-voice" @click="falar(modalData.letra, modalData.palavra)">🔊 Ouvir</button>
           <button class="card-ok" @click="closeCard">Pronto!</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.lista-consoantes {
  text-align: center;
  background: #f0fdfa;
  border-radius: 30px;
  padding: 30px;
  max-width: 800px;
  margin: auto;
}

.grid-horizontal {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  list-style: none;
  padding: 0;
}

.btn-letra {
  width: 75px;
  height: 75px;
  background: white;
  border: none;
  border-radius: 15px;
  font-size: 36px;
  font-weight: 900;
  color: #0b6b58;
  cursor: pointer;
  box-shadow: 0 4px 0 #cbd5e1;
  transition: transform 0.2s;
}

.btn-letra:hover { transform: translateY(-3px); }

/* --- CARD FLIP LOGIC --- */
.card-modal {
  background: white; width: 320px; height: 450px; border-radius: 24px; padding: 20px;
  perspective: 1000px;
}

.card-flip {
  width: 100%; height: 80%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Quando flipped é true, mostra o verso (IMAGEM) */
.card-flip.flipped { transform: rotateY(180deg); }

.card-face {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column;
}

/* FRENTE: Letra */
.card-front { transform: rotateY(0deg); }

/* VERSO: Imagem */
.card-back { transform: rotateY(180deg); }

.card-letter { font-size: 150px; font-weight: 900; color: #0b6b58; }
.img-card { max-width: 200px; border-radius: 15px; }
.palavra-card { font-size: 28px; font-weight: 900; color: #0b6b58; margin-top: 10px; }

/* Modal Styles */
.card-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.card-actions { display: flex; gap: 10px; justify-content: center; margin-top: 20px; }
.card-voice { background: #0ea5e9; color: white; border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer; font-weight: bold; }
.card-ok { background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer; font-weight: bold; }
.card-close { position: absolute; top: 15px; right: 15px; font-size: 30px; border: none; background: none; cursor: pointer; }

/* Controles Case */
.controles-case { display: flex; justify-content: center; gap: 15px; margin-bottom: 25px; }
.btn-case { padding: 10px 25px; border-radius: 50px; border: 2px solid #14b8a6; background: white; font-weight: 800; cursor: pointer; }
.btn-case.ativo { background: #14b8a6; color: white; }
</style>