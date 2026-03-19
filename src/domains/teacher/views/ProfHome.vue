<script setup lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import { ref, onMounted } from "vue";

import CardIonic from "@/domains/teacher/components/CardIonic.vue";
import TitleCategories from "@/domains/user/components/TitleCategories.vue";
import AlunosLista from "@/domains/teacher/components/AlunosLista.vue";
import TurmaCard from "@/domains/teacher/components/TurmaCard.vue";
import TurmaPopup from "@/domains/teacher/components/TurmaPopup.vue";

const alunos = ref([]); // Define os dados dos alunos como uma referência reativa
const turmas = ref<{ id: number; [key: string]: any }[]>([]); // Define os dados das turmas como uma referência reativa com tipo explícito

const selectedTurma = ref(null);
const selectedAlunosCount = ref(0);

const openPopup = (data: { turma: any; alunosCount: number }) => {
  selectedTurma.value = data.turma;
  selectedAlunosCount.value = data.alunosCount;
};

const closePopup = () => {
  selectedTurma.value = null;
};

const turmasMinimized = ref(false); // Estado para controlar a minimização das turmas

const toggleTurmas = () => {
  turmasMinimized.value = !turmasMinimized.value;
};

const alunosMinimized = ref(false); // Estado para controlar a minimização dos alunos

const toggleAlunos = () => {
  alunosMinimized.value = !alunosMinimized.value;
};

// URL da API obtida da variável de ambiente
const API_URL = import.meta.env.VITE_API_URL;

// Função para buscar os usuários da API
const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}user`, {
      headers: {
        'Cache-Control': 'no-cache', // Evita cache para garantir dados atualizados
        'Content-Type': 'application/json', // Define o tipo de conteúdo
      },
      credentials: 'include', // Inclui cookies para autenticação, se necessário
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar usuários");
    }
    const allUsers = await response.json();
    // Filtrar apenas usuários sem roles (alunos)
    alunos.value = allUsers.filter(user => 
      !user.roles || user.roles.length === 0
    );
    console.log("Alunos filtrados:", alunos.value); // Log para verificar os alunos filtrados
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  }
};

// Função para buscar as turmas da API
const fetchTurmas = async () => {
  try {
    const response = await fetch(`${API_URL}turma`);
    if (!response.ok) {
      throw new Error("Erro ao buscar turmas");
    }
    turmas.value = await response.json();
    console.log("Turmas carregadas:", turmas.value); // Log para verificar as turmas carregadas
  } catch (error) {
    console.error("Erro ao carregar turmas:", error);
  }
};

// Busca os usuários e as turmas ao montar o componente
onMounted(() => {
  fetchUsers();
  fetchTurmas();
});
</script>

<template>
  <div class="page">
    <ion-page>
      <ion-content>
        <div class="content">
          <div class="areas">
            <TitleCategories title="Painel Professor" route="teste" />

            <div class="title">
              <h1>Turmas</h1>
              <h2>Mais Recentes</h2>
              <button class="toggle-button" @click="toggleTurmas">
                {{ turmasMinimized ? "Mostrar" : "Minimizar" }}
              </button>
            </div>
            <div
              class="turmas-list"
              v-show="!turmasMinimized"
            >
              <TurmaCard
                v-for="turma in turmas"
                :key="turma.id"
                :turma="turma"
                @click="openPopup"
              />
              <CardIonic
                title="Criar Turma"
                image="img/IconsHome/grupo.png"
                bg-color="#fff"
                shape-color="#00664f"
                link="/professor/create-turma"
              />
            </div>

            <div class="title">
              <h1>Alunos</h1>
              <h2>Lista Completa</h2>
              <button class="toggle-button" @click="toggleAlunos">
                {{ alunosMinimized ? "Mostrar" : "Minimizar" }}
              </button>
            </div>
            <div v-show="!alunosMinimized">
              <AlunosLista :alunos="alunos" />
            </div>
          </div>
        </div>
      </ion-content>
    </ion-page>
    <TurmaPopup
      v-if="selectedTurma"
      :turma="selectedTurma"
      :alunosCount="selectedAlunosCount"
      @close="closePopup"
    />
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

* {
  /* Removed the  
 global background setting */
  font-family: "Poppins", sans-serif;
}

.content {
  position: relative;
  bottom: 0;
  width: 100%;
  background: #fff;
  border-radius: 40px 0 0 0;
}

.areas{
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  padding-bottom: 4rem;
  
}
.background-green {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #00664f;
  z-index: -1;
}

.vetor {
  position: relative;
  top: 2.1rem;
  right: -7.5rem;
  width: 70%;
  height: 30%;
  z-index: -1;
}

.livro {
  position: relative;
  top: -6.5rem;
  right: -10.8rem;
  width: 55%;
  height: 30%;
  z-index: 1;
}

.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}


.navButton {
  position: absolute;
  bottom: 0;
}

.title {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title h1 {
  font-weight: bold;
  font-size: 20px;
  color: #212523;
  margin: 0;
}

.title h2 {
  margin: 0;
  font-size: 14px;
  color: #bcc1cd;
}

.cards {
  margin-top: 1rem;
  display: flex;
  gap: 0.8rem;
}

.cards a {
  padding: 0;
}

.cards-alunos {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-height: 380px; /* Define uma altura máxima para o container */
  overflow-y: auto; /* Adiciona scroll vertical */
  border: 1px solid #e0e0e0; /* Adiciona uma borda para destacar o container */
  padding: 0.5rem; /* Adiciona um espaçamento interno */
}

/* Estiliza a barra de rolagem */
.cards-alunos::-webkit-scrollbar {
  width: 8px;
}

.cards-alunos::-webkit-scrollbar-thumb {
  background: #00664f; /* Cor da barra de rolagem */
  border-radius: 4px;
}

.cards-alunos::-webkit-scrollbar-thumb:hover {
  background: #004d3a; /* Cor ao passar o mouse */
}

.cards-alunos::-webkit-scrollbar-track {
  background: #f0f0f0; /* Cor do fundo da barra de rolagem */
}

.filter {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 80px;
  background-color: #ffffff; /* Alterado para branco */
}

.high-time {
  border-left: 5px solid red; /* Barra vermelha para alunos com tempo alto */
}

.good-time {
  border-left: 5px solid green; /* Barra verde para alunos com bom tempo */
}

.medium-time {
  border-left: 5px solid yellow; /* Barra amarela para alunos com tempo médio */
}

.bad-time {
  border-left: 5px solid red; /* Barra vermelha para alunos com tempo ruim */
}

input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #00664f; /* Cor personalizada para o checkbox */
  background-color: #ffffff; /* Fundo branco por padrão */
}

input[type="checkbox"]:not(:checked) {
  background-color: #ffffff; /* Fundo branco quando não marcado */
}

.turmas {
  margin-top: 2rem;
}

.turmas-list {
  display: flex;
  padding: 1rem;
  width: 100%;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 1rem; /* Adiciona espaçamento entre os itens */
  scroll-snap-type: x mandatory; /* Habilita o snap para o carrossel */
}

.turmas-list > * {
  scroll-snap-align: start; /* Alinha os itens no início ao rolar */
  flex: 0 0 auto; /* Garante que os itens não encolham ou cresçam */
}

.turmas-list::-webkit-scrollbar {
  height: 8px; /* Define a altura da barra de rolagem */
}

.turmas-list::-webkit-scrollbar-thumb {
  background: #00664f; /* Cor da barra de rolagem */
  border-radius: 4px;
}

.turmas-list::-webkit-scrollbar-thumb:hover {
  background: #004d3a; /* Cor ao passar o mouse */
}

.turmas-list::-webkit-scrollbar-track {
  background: #f0f0f0; /* Cor do fundo da barra de rolagem */
}

.toggle-button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #fff;
  color: #00664f;
  border: 2px solid #00664f;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.toggle-button:hover {
  background-color: #00664f;
  color: #fff;
}

.page {
  height: 100vh; /* Garante que a página ocupe toda a altura da viewport */
  overflow-y: auto; /* Habilita a rolagem vertical */
  scroll-behavior: smooth; /* Adiciona rolagem suave */
}

.page::-webkit-scrollbar {
  width: 8px; /* Define a largura da barra de rolagem */
}

.page::-webkit-scrollbar-thumb {
  background: #00664f; /* Cor da barra de rolagem */
  border-radius: 4px;
}

.page::-webkit-scrollbar-thumb:hover {
  background: #004d3a; /* Cor ao passar o mouse */
}

.page::-webkit-scrollbar-track {
  background: #f0f0f0; /* Cor do fundo da barra de rolagem */
}

</style>
