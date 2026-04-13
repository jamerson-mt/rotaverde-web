<script setup>
import {
  IonButton,
  IonContent,
  IonPage,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
} from "@ionic/vue";
import {
  volumeHighOutline,
  closeOutline,
  bookOutline,
  schoolOutline,
  leafOutline,
  settingsOutline,
  helpCircleOutline,
  accessibilityOutline,
  personCircleOutline,
  alertCircleOutline,
} from "ionicons/icons";
import FalarComponent from "@/components/specific/FalarComponent.vue";
import { inject, ref, onMounted } from "vue";
import { getUserData } from "@/utils/localStorageUtils";

const isPlaying = inject("isPlaying");
const loginClickCount = ref(0);
const isLoggedIn = ref(!!getUserData());
const isGuideOpen = ref(false);

onMounted(() => {
  if (isLoggedIn.value) {
    window.location.href = "/home";
  }
});

function lerTrecho(text) {
  try {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      const voices = synth.getVoices();
      const bestVoice =
        voices.find(
          (v) =>
            v.lang.includes("pt-BR") &&
            (v.name.includes("Google") || v.name.includes("Natural"))
        ) || voices.find((v) => v.lang.includes("pt-BR"));
      if (bestVoice) utterance.voice = bestVoice;
      synth.speak(utterance);
    }
  } catch (e) {
    console.error("Erro ao reproduzir voz:", e);
  }
}

function openGuide() {
  isGuideOpen.value = true;
  setTimeout(() => {
    lerTrecho(
      "Guia rápido de uso aberto. Deslize para ler todo o Apêndice C e aperte nos quadros para ouvir as instruções."
    );
  }, 500);
}

function closeGuide() {
  window.speechSynthesis.cancel();
  isGuideOpen.value = false;
}

function handleLoginClick() {
  if (isLoggedIn.value) {
    window.location.href = "/home";
    return;
  }
  loginClickCount.value++;
  if (loginClickCount.value === 1) {
    lerTrecho("Você será levado para a tela de identificação.");
  } else if (loginClickCount.value === 2) {
    window.location.href = "/login";
  }
}
</script>

<template>
  <ion-page class="welcome-page">
    <ion-content class="main-content" :fullscreen="true">
      <div class="hero-image">
        <img src="/public/img/capas/itapissuma.png" alt="Capa Itapissuma" />
        <div class="overlay"></div>
      </div>

      <div class="content-container">
        <header class="header-section">
          <h1 class="main-title">Rota Verde</h1>
          <p class="main-subtitle">Alfabetização & Meio Ambiente</p>
        </header>

        <div class="actions-section">
          <IonButton
            class="btn-main btn-guest"
            @click="
              $refs.falarComponent.falar(
                'welcome',
                'boasvindas',
                'moduloseformulario',
                '/home'
              )
            "
          >
            <ion-icon slot="start" :icon="leafOutline"></ion-icon>
            ENTRAR SEM SENHA
          </IonButton>

          <IonButton class="btn-main btn-login" @click="handleLoginClick">
            <ion-icon slot="start" :icon="schoolOutline"></ion-icon>
            ENTRAR COM SENHA
          </IonButton>

          <IonButton fill="clear" class="btn-help" @click="openGuide">
            <ion-icon slot="start" :icon="bookOutline"></ion-icon>
            GUIA RÁPIDO DE USO
          </IonButton>
        </div>

        <footer class="footer-icons">
          <div class="icon-bubble">
            <img src="/public/img/iconesSustentabilidade/reciclagem.png" />
          </div>
          <div class="icon-bubble">
            <img src="/public/img/iconesSustentabilidade/planta.png" />
          </div>
          <div class="icon-bubble">
            <img src="/public/img/iconesSustentabilidade/agua.png" />
          </div>
        </footer>
      </div>

      <div class="user-trigger">
        <FalarComponent ref="falarComponent" audio1="" audio2="" rota="#" />
      </div>

      <ion-modal :is-open="isGuideOpen" @didDismiss="closeGuide" class="guide-modal">
        <ion-header class="ion-no-border">
          <ion-toolbar color="primary">
            <ion-title>Guia Rota Verde</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeGuide">
                <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="guide-scrollable-content">
          <div class="guide-inner">
            <div
              class="guide-intro"
              @click="
                lerTrecho(
                  'Apêndice C. Guia rápido de uso do Rota Verde para leigos. Toque nos cartões para ouvir.'
                )
              "
            >
              <h2>Apêndice C</h2>
              <p>
                Toque nos cartões para ouvir
                <ion-icon :icon="volumeHighOutline"></ion-icon>
              </p>
            </div>

            <div
              class="guide-card"
              @click="
                lerTrecho(
                  '1. O que é o Rota Verde? É um jogo que ensina leitura e cuidado com a natureza para jovens e adultos.'
                )
              "
            >
              <div class="card-icon"><ion-icon :icon="leafOutline"></ion-icon></div>
              <div class="card-text">
                <h3>1. O que é o Rota Verde</h3>
                <p>Jogo que une alfabetização e educação ambiental para a EJA.</p>
              </div>
            </div>

            <div
              class="guide-card"
              @click="
                lerTrecho(
                  '2. O que é necessário para usar? Celular, tablet ou computador com internet.'
                )
              "
            >
              <div class="card-icon"><ion-icon :icon="settingsOutline"></ion-icon></div>
              <div class="card-text">
                <h3>2. O que é necessário</h3>
                <p>Aparelho com navegador e acesso à internet (Wi-Fi).</p>
              </div>
            </div>

            <div
              class="guide-card"
              @click="
                lerTrecho(
                  '4. Como jogar sem login. Recomendado para iniciantes. Aperte em Entrar sem senha, escolha uma missão e siga as instruções de voz.'
                )
              "
            >
              <div class="card-icon"><ion-icon :icon="helpCircleOutline"></ion-icon></div>
              <div class="card-text">
                <h3>4. Acesso sem login</h3>
                <p>Para iniciantes: escolha a atividade e ouça as instruções.</p>
              </div>
            </div>

            <div
              class="guide-card"
              @click="
                lerTrecho(
                  '6. Missões. No jogo temos identificação de letras, caça-palavras, escrita correta e leitura de textos.'
                )
              "
            >
              <div class="card-icon"><ion-icon :icon="bookOutline"></ion-icon></div>
              <div class="card-text">
                <h3>6. Missões do Jogo</h3>
                <p>Letras iniciais, caça-palavras, escrita e leitura.</p>
              </div>
            </div>

            <div
              class="guide-card accent-card"
              @click="
                lerTrecho(
                  '7. Dicas de acessibilidade. Use o som para ouvir as palavras. Se puder, jogue em duplas para um ajudar o outro na leitura.'
                )
              "
            >
              <div class="card-icon">
                <ion-icon :icon="accessibilityOutline"></ion-icon>
              </div>
              <div class="card-text">
                <h3>7. Dicas de Acessibilidade</h3>
                <p>Utilize o áudio e trabalhe em duplas para facilitar o uso.</p>
              </div>
            </div>

            <div
              class="guide-card teacher-card"
              @click="
                lerTrecho(
                  '8. Guia do Professor. Antes da aula, teste o link. Durante a aula, ajude os alunos com perguntas sobre o que as palavras significam.'
                )
              "
            >
              <div class="card-icon">
                <ion-icon :icon="personCircleOutline"></ion-icon>
              </div>
              <div class="card-text">
                <h3>8. Guia do Professor</h3>
                <p>Dicas para aplicar em aula e acompanhar o desempenho da turma.</p>
              </div>
            </div>

            <div
              class="guide-card danger-card"
              @click="
                lerTrecho(
                  '9. Problemas. Se o jogo travar, atualize a página. Se o som sumir, aumente o volume lateral do seu aparelho.'
                )
              "
            >
              <div class="card-icon">
                <ion-icon :icon="alertCircleOutline"></ion-icon>
              </div>
              <div class="card-text">
                <h3>9. Solução de Problemas</h3>
                <p>Confira a internet, o volume ou recarregue a página.</p>
              </div>
            </div>

            <IonButton
              expand="block"
              color="success"
              class="btn-done"
              @click="closeGuide"
            >
              ENTENDI, VAMOS JOGAR!
            </IonButton>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<style scoped>
/* ESTRUTURA PRINCIPAL */
.main-content {
  --background: #0f3d3e;
  font-family: "Roboto", sans-serif;
}

.hero-image {
  position: absolute;
  top: 0;
  width: 100%;
  height: 55%;
  z-index: 0;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent, #0f3d3e);
}

.content-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 20px;
  padding-bottom: 40px;
}

/* HEADER */
.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.main-title {
  font-size: 4rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0;
  text-shadow: 2px 4px 10px rgba(0, 0, 0, 0.3);
}

.main-subtitle {
  font-size: 1.4rem;
  color: #aed581;
  margin: 5px 0 0 0;
  font-weight: 300;
  letter-spacing: 1px;
}

/* BOTÕES */
.actions-section {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.btn-main {
  --height: 75px;
  --border-radius: 20px;
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.btn-main:active {
  transform: scale(0.95);
}

.btn-guest {
  --background: #137e60;
  --color: white;
}
.btn-login {
  --background: #0a6ebd;
  --color: white;
}

.btn-help {
  --color: #ffffff;
  font-size: 1.1rem;
  text-transform: uppercase;
  font-weight: bold;
  opacity: 0.9;
  margin-top: 10px;
}

/* FOOTER ICONS */
.footer-icons {
  display: flex;
  gap: 20px;
  margin-top: 40px;
}

.icon-bubble {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 12px;
  border-radius: 50%;
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.icon-bubble img {
  width: 40px;
}

/* MODAL STYLES */
.guide-modal {
  --border-radius: 30px 30px 0 0;
}
.guide-inner {
  padding: 10px 20px 40px 20px;
  background: #f8f9fa;
}

.guide-intro {
  text-align: center;
  background: #e8f5e9;
  padding: 20px;
  border-radius: 20px;
  border: 2px dashed #137e60;
  margin-bottom: 25px;
}

.guide-intro h2 {
  color: #0f3d3e;
  font-size: 1.8rem;
  margin: 0;
}
.guide-intro p {
  font-size: 1.2rem;
  color: #2e7d32;
  margin-top: 5px;
}

.guide-card {
  display: flex;
  align-items: center;
  background: white;
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 22px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  transition: background 0.2s;
}

.guide-card:active {
  background: #f1f1f1;
}

.card-icon {
  background: #137e60;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  margin-right: 15px;
  flex-shrink: 0;
}

.card-text h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #137e60;
  font-weight: bold;
}
.card-text p {
  margin: 5px 0 0 0;
  font-size: 1.1rem;
  color: #555;
  line-height: 1.3;
}

/* VARIANTES DE CARDS */
.accent-card {
  border-left: 6px solid #ff9800;
}
.accent-card .card-icon {
  background: #ff9800;
}

.teacher-card {
  border-left: 6px solid #673ab7;
}
.teacher-card .card-icon {
  background: #673ab7;
}

.danger-card {
  border-left: 6px solid #d32f2f;
}
.danger-card .card-icon {
  background: #d32f2f;
}

.btn-done {
  --height: 70px;
  --border-radius: 20px;
  font-size: 1.4rem;
  margin-top: 30px;
}

.user-trigger {
  position: absolute;
  top: 30px;
  left: 20px;
  z-index: 10;
}
</style>
