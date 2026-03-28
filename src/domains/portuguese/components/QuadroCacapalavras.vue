<script setup lang="ts">
import TitleCategories from "@/domains/user/components/TitleCategories.vue";
import { reactive, ref, toRefs, watch, onBeforeUnmount } from "vue";

const props = defineProps<{
  quadro: {
    line1: string[];
    line2: string[];
    line3: string[];
    line4: string[];
    line5: string[];
    line6: string[];
  };
  palavras: {
    [key: string]: {
      letters: string[];
      image: string;
      description: string;
    };
  };
  finalizarAtividade: () => void;
}>();

const { quadro } = toRefs(props);

let letraAcendida = reactive(
  [
    props.quadro.line1,
    props.quadro.line2,
    props.quadro.line3,
    props.quadro.line4,
    props.quadro.line5,
    props.quadro.line6,
  ].map((linha) => linha.map(() => false))
);

watch(quadro, () => {
  letraAcendida = reactive(
    Object.values(quadro.value).map((linha) => linha.map(() => false))
  );
});

const selectedWord = ref<null | { image: string; description: string }>(null);

let selectedWordTimeout: number | null = null;
function clearSelectedWordTimer() {
  if (selectedWordTimeout !== null) {
    clearTimeout(selectedWordTimeout);
    selectedWordTimeout = null;
  }
}

const todasPalavrasEncontradas = ref(false);

const confirme = () => {
  if (o1 && o2 && o3 && o4 && o5 && o6) {
    todasPalavrasEncontradas.value = true;
    document.querySelectorAll(".aviso").forEach(function (valor) {
      valor.setAttribute("style", "opacity:0.8; z-index:2;");
    });
    setTimeout(() => {
      props.finalizarAtividade();
        window.location.href = "/att/roadmap";
      window.speechSynthesis.cancel();
    }, 2000);
  }
};

const pronunciar = (texto: string, descricao?: string) => {
  // 1. Limpa qualquer fala que esteja tocando agora
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(
    texto + (descricao ? `. ${descricao}` : "")
  );
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
};

const check = (option: number) => {
  const palavraKeys = Object.keys(props.palavras);
  const palavra = props.palavras[palavraKeys[option - 1]];

  if (palavra) {
    document
      .querySelectorAll(`.${palavra.letters.join("").toLowerCase()}`)
      .forEach(function (valor) {
        valor.setAttribute("style", "background-color:gray; color:white;");
      });

    selectedWord.value = { image: palavra.image, description: palavra.description };
    pronunciar(palavra.letters.join(""), palavra.description);
    // inicia timer para fechar automaticamente após 10s
    clearSelectedWordTimer();
    selectedWordTimeout = window.setTimeout(() => {
      selectedWord.value = null;
      selectedWordTimeout = null;
    }, 10000);
    confirme();
  }
};

let o1: boolean = false;
let o2: boolean = false;
let o3: boolean = false;
let o4: boolean = false;
let o5: boolean = false;
let o6: boolean = false;

const verificaCombinacao = () => {
  if (
    letraAcendida[0][0] == true &&
    letraAcendida[0][1] == true &&
    letraAcendida[0][2] == true &&
    letraAcendida[0][3] == true &&
    o1 == false
  ) {
    o1 = true;
    check(1);
  } else if (
    letraAcendida[1][0] == true &&
    letraAcendida[1][1] == true &&
    letraAcendida[1][2] == true &&
    letraAcendida[1][3] == true &&
    letraAcendida[1][4] == true &&
    o2 == false
  ) {
    o2 = true;
    check(2);
  } else if (
    letraAcendida[2][0] == true &&
    letraAcendida[2][1] == true &&
    letraAcendida[2][2] == true &&
    o3 == false
  ) {
    o3 = true;
    check(3);
  } else if (
    letraAcendida[3][0] == true &&
    letraAcendida[3][1] == true &&
    letraAcendida[3][2] == true &&
    letraAcendida[3][3] == true &&
    letraAcendida[3][4] == true &&
    o4 == false
  ) {
    o4 = true;
    check(4);
  } else if (
    letraAcendida[4][0] == true &&
    letraAcendida[4][1] == true &&
    letraAcendida[4][2] == true &&
    letraAcendida[4][3] == true &&
    letraAcendida[4][4] == true &&
    letraAcendida[4][5] == true &&
    o5 == false
  ) {
    o5 = true;
    check(5);
  } else if (
    letraAcendida[5][0] == true &&
    letraAcendida[5][1] == true &&
    letraAcendida[5][2] == true &&
    letraAcendida[5][3] == true &&
    letraAcendida[5][4] == true &&
    o6 == false
  ) {
    o6 = true;
    check(6);
  }
};

const acenderLetra = (linhaIndex: number, celulaIndex: number) => {
  letraAcendida[linhaIndex][celulaIndex] = !letraAcendida[linhaIndex][celulaIndex];
  pronunciar(
    props.quadro[`line${linhaIndex + 1}` as keyof typeof props.quadro][celulaIndex]
  );
  verificaCombinacao();
};

const closeCard = () => {
  selectedWord.value = null;
  clearSelectedWordTimer();
};

onBeforeUnmount(() => {
  clearSelectedWordTimer();
});
</script>

<template>
  <div class="content">
    <TitleCategories title="" route="att/roadMapPalavra" />
    <div class="quadro">
      <div
        v-for="(linha, linhaIndex) in [
          props.quadro.line1,
          props.quadro.line2,
          props.quadro.line3,
          props.quadro.line4,
          props.quadro.line5,
          props.quadro.line6,
        ]"
        :key="linhaIndex"
        class="linha"
      >
        <div
          v-for="(letra, celulaIndex) in linha"
          :key="celulaIndex"
          class="celula"
          :class="{ 'letra-acendida': letraAcendida[linhaIndex][celulaIndex] }"
          @click="acenderLetra(linhaIndex, celulaIndex)"
        >
          {{ letra }}
        </div>
      </div>
    </div>
    <div v-if="selectedWord" class="word-details">
      <button class="close-button" @click="closeCard">X</button>
      <img :src="selectedWord.image" alt="Imagem da palavra" />
      <p>{{ selectedWord.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.quadro {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.linha {
  display: flex;
  gap: 10px;
}

.celula {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border: 1px solid black;
}

.letra {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* .letra:hover{
  background-color: yellow;

} */

.letra-acendida {
  background-color: yellow;
}

@media (max-width: 375px) {
  .content {
    gap: 10px;
  }

  .quadro {
    gap: 3px;
  }

  .linha {
    gap: 5px;
  }

  .celula {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  .letra-acendida {
    background-color: yellow;
  }

  h1 {
    font-size: 18px;
  }
}

.word-details {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  z-index: 10;
}

.word-details img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 10px;
}

.word-details p {
  font-size: 1.2em;
  color: #333;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #333;
}

.close-button:hover {
  color: red;
}
</style>
