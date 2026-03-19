<script setup lang="ts">
import { ref, onMounted } from "vue";

const nome = ref("");
const email = ref("jjmt@discente.ifpe.edu.br"); // Email padrão
const isPopupVisible = ref(false);
const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_PASSWORD = import.meta.env.VITE_DEFAULT_PASSWORD;
const password = ref("@Lunoifp3"); // Usa a senha padrão inicialmente

function fecharPopup() {
  isPopupVisible.value = false;
  window.location.reload(); // Recarrega a página para atualizar os dados
}

async function adicionarAluno() {
  if (!nome.value || !email.value || !password.value) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
   const response = await fetch(`${API_URL}auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: nome.value,
        email: email.value,
        password: password.value,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null); // Tenta obter JSON, caso contrário retorna null
      const errorMessage = errorData || "Erro ao adicionar aluno.";
      throw new Error(errorMessage);
    }

    alert("Aluno adicionado com sucesso!");
    fecharPopup();
    nome.value = "";
    email.value = "jjmt@discente.ifpe.edu.br";
    password.value = DEFAULT_PASSWORD;
    window.location.reload();
    // Atualize os dados localmente, se necessário, em vez de recarregar a página
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
    alert(`Erro: ${errorMessage}`);
    console.error("Erro ao adicionar aluno:", error);
  }
}

onMounted(() => {
  isPopupVisible.value = true;
});
</script>

<template>
  <div>
    <div v-if="isPopupVisible" class="popup">
      <h3>Adicionar Aluno</h3>
      <label>
        Nome:
        <input v-model="nome" type="text" />
      </label>
      <label>
        Email:
        <input v-model="email" type="email" />
      </label>
      <label>
        Senha
        <input v-model="password" type="password" />
      </label>
      <div class="popup-actions">
        <button @click="adicionarAluno" class="confirm-button">Confirmar</button>
        <button @click="fecharPopup" class="cancel-button">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 300px;
  text-align: center;
  margin: 2rem auto; /* Centraliza o popup */
}

.popup h3 {
  margin-bottom: 1rem;
}

.popup label {
  display: block;
  margin-bottom: 1rem;
  text-align: left;
}

.popup input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.popup-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.confirm-button {
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #218838;
}

.cancel-button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #c82333;
}

.open-popup-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.open-popup-button:hover {
  background-color: #0056b3;
}
</style>
