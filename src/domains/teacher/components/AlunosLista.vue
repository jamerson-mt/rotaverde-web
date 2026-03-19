<script setup lang="ts">
import { ref } from "vue";

// Define the API URL
const API_URL = import.meta.env.VITE_API_URL;
import AdicionarAluno from "./AdicionarAlunoPopup.vue";

interface Aluno {
  id: number;
  userName: any;
  email: any;
}

const props = defineProps<{
  alunos: Aluno[];
}>();

const mostrarPopup = ref(false);
const mostrarLista = ref(false);
const alunoEditando = ref<Aluno | null>(null);
const mostrarEditarPopup = ref(false);

function adicionarAluno() {
  mostrarPopup.value = true;
}

function mostrarListaAlunos() {
  mostrarLista.value = true;
}



async function removerAluno(id: number) {
  try {
    const response = await fetch(`${API_URL}user/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao remover aluno");
    }
    alert("Aluno removido com sucesso!");
    window.location.reload();
  } catch (error) {
    console.error("Erro ao remover aluno:", error);
    alert("Não foi possível remover o aluno.");
  }
}

function editarAluno(aluno: Aluno) {
  mostrarLista.value = false;
  alunoEditando.value = { ...aluno };
  mostrarEditarPopup.value = true;
}

async function salvarEdicao() {
  if (!alunoEditando.value) return;

  try {
    const updates = {
      UserName: alunoEditando.value.userName,
      Email: alunoEditando.value.email,
    };

    const response = await fetch(`${API_URL}user/${alunoEditando.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
      credentials: "include",
    });


    if (!response.ok) {
      throw new Error("Erro ao editar aluno");
    }

    alert("Aluno atualizado com sucesso!");
    window.location.reload();
  } catch (error) {
    console.error("Erro ao editar aluno:", error);
    alert("Não foi possível editar o aluno.");
  } finally {
    mostrarEditarPopup.value = false;
  }
}
</script>

<template>
  <div class="alunos-lista">
    <div class="title">
    </div>
    <div class="buttons-container">
      <button @click="mostrarListaAlunos" class="show-button">Mostrar Lista</button>
      <button @click="adicionarAluno" class="add-button">Adicionar Aluno</button>
    </div>

    <div v-if="mostrarPopup" class="popup-overlay">
      <AdicionarAluno />
    </div>
    <div v-if="mostrarEditarPopup" class="popup-overlay">
      <div class="popup" style="z-index: 1000;">
        <h3>Editar Aluno</h3>
        <label>
          Nome:
          <input v-if="alunoEditando" v-model="alunoEditando.userName" />
        </label>
        <label>
          Email:
          <input v-if="alunoEditando" v-model="alunoEditando.email" />
        </label>
        <div class="popup-buttons">
          <button @click="salvarEdicao" class="save-button">Salvar</button>
          <button @click="mostrarEditarPopup = false" class="cancel-button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
    <div v-if="mostrarLista" class="popup-overlay">
      <div class="popup lista-popup">
        <h3>Lista de Alunos</h3>
        <div class="alunos-container">
          <ul>
            <li v-for="(aluno, index) in alunos" :key="index">
              <strong>{{ aluno.userName }}</strong>
              <div class="button-user">
                <button @click="removerAluno(aluno.id)" class="remove-button"></button>
                <button @click="editarAluno(aluno)" class="edit-button"></button>
              </div>
            </li>
          </ul>
        </div>
        <div class="popup-buttons">
          <button @click="mostrarLista = false" class="cancel-button">Minimizar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alunos-lista {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.alunos-container {
  overflow-y: auto;
  max-height: 400px;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

strong {
  flex: 1;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

strong::before {
  content: "👤";
  margin-right: 10px;
  font-size: 1.2rem;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title h2 {
  font-size: 1.8rem;
  color: #34495e;
  margin: 0;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  font-size: 1rem;
  color: #2c3e50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border: 1px solid #e1e8ed;
  border-radius: 10px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

li:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.buttons-container {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
.add-button,
.show-button {
  padding: 10px 15px;
  font-size: 1rem;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-button:hover,
.show-button:hover {
  background-color: #0056b3;
}


.remove-button {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.remove-button::before {
  content: "🗑️";
  margin-right: 5px;
}

.remove-button:hover {
  background: linear-gradient(135deg, #ee5a52 0%, #dc4545 100%);
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(238, 90, 82, 0.3);
}

.edit-button {
  background: linear-gradient(135deg, #ffd93d 0%, #ffb347 100%);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.edit-button::before {
  content: "✏️";
  margin-right: 5px;
}

.edit-button:hover {
  background: linear-gradient(135deg, #ffb347 0%, #ff8c00 100%);
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(255, 179, 71, 0.3);
}
.button-user{
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
} 

.remove-button,
.edit-button {
  width: auto;
  text-align: center;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  text-align: left;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
}

.lista-popup {
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.popup h3 {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 1rem;
}

.popup label {
  display: block;
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.popup input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.popup input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.save-button,
.cancel-button {
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button {
  background-color: #28a745;
}

.save-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #6c757d;
}

.cancel-button:hover {
  background-color: #5a6268;
}
</style>
