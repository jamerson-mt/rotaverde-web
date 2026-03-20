<template>
  <div class="listar-alunos">
    <h2>Listagem de Alunos</h2>
    <ul>
      <li v-if="props.checkedStudents">Nenhum aluno disponível para seleção.</li>
      <li v-for="student in checkedStudents" :key="student.id">
        {{ student.userName }}
        <button @click="selectStudent(student)">Selecionar</button>
      </li>
    </ul>
    <div class="selecionar-alunos">
      <h2>Alunos Selecionados</h2>
      <ul>
        <li v-if="!selectedStudents.length">Nenhum aluno selecionado.</li>
        <li v-for="student in selectedStudents" :key="student.id">
          {{ student.userName }}
        </li>
      </ul>
      <button v-if="selectedStudents.length" @click="finalizeSelection">Finalizar</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  classId: {
    type: Number,
    required: true,
  },
});
import { ref, onMounted } from "vue";

const API_URL = import.meta.env.VITE_API_URL;

const selectedStudents = ref([]);
const checkedStudents = ref([]);

const fetchStudents = async () => {
  try {
    const response = await fetch(`${API_URL}user`);
    if (!response.ok) throw new Error("Erro ao buscar alunos");
    checkedStudents.value = await response.json();
    // Filtra os alunos que já estão na turma e tem roles
    checkedStudents.value = checkedStudents.value.filter(
      (student) =>
        !student.roles.includes("professor") && !student.turmaId); // Filtra alunos que já estão na turma
        console.log("Alunos na turma:", checkedStudents.value);
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
  }
};

const selectStudent = (student) => {
  if (!selectedStudents.value.includes(student)) {
    selectedStudents.value.push(student);
    checkedStudents.value = checkedStudents.value.filter((s) => s.id !== student.id);
  }
};

const finalizeSelection = async () => {
  try {
    const updates = selectedStudents.value.map((student) => ({
      id: student.id.toString(),
      turmaId: props.classId.toString(),
    }));

    for (const student of updates) {
      // Agora enviamos 'student' (o objeto individual) e não 'updates' (o array)
      const response = await fetch(`${API_URL}user/${student.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student), // CORRIGIDO: enviando o objeto individual
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json(); // Tenta ler o erro do servidor
        console.error(`Erro no aluno ${student.id}:`, errorData);
        throw new Error(`Erro ao atualizar aluno ${student.id}`);
      }
    }

    alert("Alunos atualizados com sucesso!");
    selectedStudents.value = [];
    fetchStudents();
  } catch (error) {
    console.error("Erro ao finalizar seleção:", error);
    alert("Erro ao finalizar seleção. Verifique o console.");
  }
};


onMounted(fetchStudents);
</script>

<style scoped>
#username {
  color: red;
  z-index: 1000;
}
.listar-alunos {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.6rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 12px 18px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

li:hover {
  background-color: #f4f4f4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #3498db;
  color: #ffffff;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}

button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.selecionar-alunos {
  margin-top: 20px;
}

.selecionar-alunos h2 {
  font-size: 1.4rem;
  color: #34495e;
  margin-bottom: 1rem;
}

.selecionar-alunos ul {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  background-color: #f8f8f8;
}

.selecionar-alunos button {
  margin-top: 10px;
  background-color: #27ae60;
}

.selecionar-alunos button:hover {
  background-color: #1e8449;
}

button.edit-button {
  background-color: #f39c12;
}

button.edit-button:hover {
  background-color: #d35400;
}

button.remove-button {
  background-color: #e74c3c;
}

button.remove-button:hover {
  background-color: #c0392b;
}
</style>
