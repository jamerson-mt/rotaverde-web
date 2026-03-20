<script>
import ListarAlunos from "../components/ListarAlunos.vue";
import TitleCategories from "@/domains/user/components/TitleCategories.vue";
import { getUserId } from "@/utils/localStorageUtils";
 import { ref } from "vue";
const API_URL = import.meta.env.VITE_API_URL;

export default {
  components: {
    ListarAlunos,
    TitleCategories,
  },
  data() {
    return {
      step: 1, // Etapa atual do processo
      selectedStudents: [],
      students: [],
      classData: {
        name: "EJA",
        anoLetivo: 2026, // Alterado para número
        turno: 0, // Adicionado para armazenar o turno selecionado
      },
      classId: null, // Adicionado para armazenar o ID da turma criada
    };
  },
  created() {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await fetch(`${API_URL}user`); // Substitua pela URL da API
        this.students = await response.json();
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      }
    },
    handleSelect(student) {
      this.selectedStudents.push(student);
      this.students = this.students.filter((s) => s.id !== student.id);
    },
    handleAddStudent(newStudent) {
      this.students.push({ id: Date.now(), ...newStudent });
    },
    nextStep() {
      if (this.step === 1 && this.classData.name && this.classData.year) {
        this.step++;
      } else {
        alert("Preencha os dados da turma antes de prosseguir.");
      }
    },
    previousStep() {
      if (this.step > 1) {
        this.step--;
      }
    },
    async createClass() {
      if (this.step === 1) {

        // Validação dos dados antes de enviar a requisição
        if (!this.classData.name || !this.classData.anoLetivo) { // Verifica se o turno também foi selecionado
          console.warn("Dados incompletos:", this.classData); 
          alert("Por favor, preencha todos os campos obrigatórios.");
          return;
        }

        const creatorId = getUserId();
        if (!creatorId) {
          alert("Usuário não autenticado. Faça login novamente.");
          return;
        }

        try {
          const payload = {
            nome: this.classData.name, // Remove espaços extras
            anoLetivo: this.classData.anoLetivo,
            turno: this.classData.turno, // Converte para string se necessário
            criadorId: creatorId,
          };

          console.log("Enviando dados para a API:", payload); // Log para depuração

          const response = await fetch(`${API_URL}turma`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Erro na resposta da API:", errorDetails);
            throw new Error("Erro ao criar turma");
          }

          const data = await response.json();
          this.classId = data.id; // Armazena o ID da turma criada
          window.alert("Turma criada com sucesso! ID: " + data.id);
          this.step++; // Avança para a próxima etapa
        } catch (error) {
          console.error("Erro ao criar turma:", error);
          alert("Ocorreu um erro ao criar a turma. Tente novamente.");
        }
      }
    },
    async updateStudentClass(student) {
      try {
        await fetch(`${API_URL}user/${student.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ turmaId: this.classId }),
        });
      } catch (error) {
        console.error(`Erro ao atualizar turma do aluno ${student.id}:`, error);
      }
    },
  },
};
</script>

<template>
  <div class="prof-turmas">
    <TitleCategories title="Criar Turma" route="teacher/home" />
    <h1>Criar Turma</h1>
    <div class="step-indicator">
      <span :class="{ active: step === 1 }">Etapa 1: Dados da Turma</span>
      <span :class="{ active: step === 2 }">Etapa 2: Seleção de Alunos</span>
    </div>
    <div v-if="step === 1">
      <form @submit.prevent="createClass()">
        <input v-model="classData.name" placeholder="Nome da Turma" required />
        <input v-model.number="classData.anoLetivo" placeholder="Ano Letivo" type="number" required />
        <select v-model.number="classData.turno" required class="turno-select" >
          <option value="0">Matutino</option>
          <option value="1">Vespertino</option>
          <option value="2">Noturno</option>
        </select>
        <button type="submit">Próximo</button>
      </form>
    </div>
    <div v-else-if="step === 2">
      <ListarAlunos :classId="classId" />
    </div>
  </div>
</template>

<style scoped>
.prof-turmas {
  height: 100%;
  background-color: white;
  color: #333;
  font-family: Arial, sans-serif;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
}
.turno-select{
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  
}
h1 {
  color: #2c3e50;
}
form {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
form input {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
form button {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}
form button:hover {
  background-color: #27ae60;
}
.step-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: bold;
}
.step-indicator span {
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #ecf0f1;
  color: #7f8c8d;
}
.step-indicator span.active {
  background-color: #2ecc71;
  color: white;
}
.btn-back {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}
.btn-back:hover {
  background-color: #2980b9;
}
.btn-finish {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-finish:hover {
  background-color: #c0392b;
}
</style>
