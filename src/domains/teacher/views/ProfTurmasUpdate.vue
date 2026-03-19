<template>
  <div class="prof-turmas-update">
    <h1>Configurar Turma</h1>
    <form @submit.prevent="updateTurma">
      <!-- Dados da turma -->
      <div class="form-group">
        <label for="nome">Nome da Turma:</label>
        <input id="nome" v-model="turma.nome" type="text" class="input-field" />
      </div>
      <div class="form-group">
        <label for="anoLetivo">Ano Letivo:</label>
        <input
          id="anoLetivo"
          v-model="turma.anoLetivo"
          type="text"
          class="input-field"
          readonly
        />
      </div>
      <!-- Lista de alunos -->
      <div class="alunos-section">
        <h2>Alunos</h2>
        <ul v-if="turma.alunos && turma.alunos.length" class="alunos-list">
          <li v-for="aluno in turma.alunos" :key="aluno.id" class="aluno-item">
            {{ aluno.userName }}
            <button @click="removerAluno(aluno.id)" class="remove-btn">Remover</button>
          </li>
        </ul>
        <p v-else class="no-data">Nenhum aluno na turma.</p>
        <div class="form-group">
          <label for="novoAluno">Adicionar Aluno:</label>
          <select id="novoAluno" v-model="novoAlunoId" class="select-field">
            <option v-for="aluno in alunosDisponiveis" :key="aluno.id" :value="aluno.id">
              {{ aluno.userName }}
            </option>
          </select>
          <p v-if="!alunosDisponiveis.length" class="no-data">
            Nenhum aluno disponível para adicionar.
          </p>
          <div v-if="alunosDisponiveis.length" @click="adicionarAluno" class="add-btn">
            Adicionar
          </div>
        </div>
      </div>
      <button type="submit" class="submit-btn">Salvar Alterações</button>
    </form>
  </div>
</template>

<script>
const API_URL = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      turma: {
        nome: "",
        anoLetivo: "",
        alunos: [], // Alunos da turma atual
        id: null, // ID da turma para facilitar as operações
      },
      alunosDisponiveis: [], // Alunos sem turma
      novoAlunoId: null,
    };
  },
  methods: {
    async fetchTurmaData() {
      try {
        const turmaId = window.location.pathname.split("/").pop();
        if (!turmaId) {
          console.error("ID da turma não encontrado na URL");
          return;
        }
        console.log("ID da turma extraído da URL:", );
        // Busca os dados da turma
        const turmaResponse = await fetch(`${API_URL}turma/${turmaId}`);
        if (!turmaResponse.ok) {
          throw new Error("Erro ao buscar dados da turma");
        }
        const turmaData = await turmaResponse.json();
        this.turma = {
          ...turmaData,
          alunos: [], // Inicializa como vazio
        };

        // Busca todos os alunos
        const alunosResponse = await fetch(`${API_URL}user`);
        if (!alunosResponse.ok) {
          throw new Error("Erro ao buscar alunos");
        }
        const alunos = await alunosResponse.json();
        console.log("Alunos buscados:", alunos);
        //faca o filtr de nao pegr os que tem roles
        const alunosSemRoles = alunos.filter((aluno) => !aluno.roles || aluno.roles.length === 0);

        // Filtra os alunos que pertencem à turma atual
        this.turma.alunos = alunosSemRoles.filter((aluno) => aluno.turmaId == turmaId);
        console.log("Alunos na turma:", this.turma.alunos);

        // Filtra os alunos disponíveis (sem turma ou com turmaId nulo)
        this.alunosDisponiveis = alunosSemRoles.filter((aluno) => !aluno.turmaId || aluno.turmaId === null);
        console.log("Alunos disponíveis para adicionar:", this.alunosDisponiveis);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    },
    async updateTurma() {
  try {
    const turmaId = this.turma.id;
    if (!turmaId) {
      console.error("ID da turma não encontrado ou inválido");
      return;
    }

    // Criamos o payload completo, incluindo os usuários (alunos)
    const payload = {
      id: turmaId,
      nome: this.turma.nome,
      anoLetivo: this.turma.anoLetivo,
      turno: this.turma.turno, // Não esqueça do turno que é 'required' no C#
      criadorId: this.turma.criadorId, 
      // Mapeamos os alunos para o formato que o C# espera (lista de objetos com ID)
      usuarios: this.turma.alunos.map(aluno => ({
        id: aluno.id
      }))
    };

    console.log("Enviando payload único para atualizar turma e alunos:", payload);

    const response = await fetch(`${API_URL}turma/${turmaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text(); // text() é mais seguro se o retorno for vazio
      console.error("Erro ao salvar alterações:", errorText);
      throw new Error("Erro ao salvar alterações da turma");
    }

    console.log("Turma e vínculos de alunos atualizados com sucesso!");
    
  } catch (error) {
    console.error("Falha na atualização:", error);
  }
},
    async updateAlunosTurma() {
      try {        if (!this.turma.alunos.length) {
          console.log("Nenhum aluno para atualizar");
          return;
        }

        console.log("TurmaId dos alunos atualizados com sucesso");

        // Redirecionar para a rota /professor
        this.$router.push("/professor");
      } catch (error) {
        console.error("Erro ao salvar alterações da turma:", error);
      }
    },
    async updateAlunos() {
      try {
        if (!this.turma.alunos.length) {
          console.log("Nenhum aluno para atualizar");
          return;
        }

        for (const aluno of this.turma.alunos) {
          const payload = { turmaId: this.turma.id };

          const response = await fetch(`${API_URL}user/${aluno.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`Erro ao atualizar aluno ${aluno.id}`);
          }
        }

        console.log("Alunos atualizados com sucesso");
      } catch (error) {
        console.error("Erro ao atualizar alunos:", error);
      }
    },
    removerAluno(alunoId) {
      this.turma.alunos = this.turma.alunos.filter((aluno) => aluno.id !== alunoId);
    },
    adicionarAluno() {
      if (!this.novoAlunoId) {
        console.error("Nenhum aluno selecionado para adicionar.");
        return;
      }
      const aluno = this.alunosDisponiveis.find((aluno) => aluno.id === this.novoAlunoId);
      console.log("Aluno selecionado para adicionar:", aluno);

      if (aluno) {
        // Garante que turma.alunos seja um array antes de adicionar
        if (!Array.isArray(this.turma.alunos)) {
          this.turma.alunos = [];
        }
        // Verifica se o aluno já está na lista para evitar duplicatas
        const jaAdicionado = this.turma.alunos.some((a) => a.id === aluno.id);
        if (!jaAdicionado) {
          this.turma.alunos.push(aluno);
          console.log("Aluno adicionado à lista localmente:", aluno);
        } else {
          console.warn("Aluno já está na lista.");
        }
        this.novoAlunoId = null;
      }
    },
  },
  async mounted() {
    await this.fetchTurmaData();
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  color: #333;
  margin: 0;
  padding: 0;
}

.prof-turmas-update {
  max-width: 700px; /* Aumenta a largura máxima */
  margin: 2rem auto;
  padding: 2.5rem; /* Adiciona mais espaçamento interno */
  background-color: #ffffff; /* Fundo branco para maior contraste */
  border-radius: 10px; /* Bordas mais arredondadas */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); /* Sombra mais suave */
}

h1 {
  font-size: 2rem; /* Aumenta o tamanho da fonte */
  margin-bottom: 2rem; /* Maior espaçamento inferior */
  text-align: center;
  color: #34495e; /* Cor mais escura para maior contraste */
}

form .form-group {
  margin-bottom: 2rem; /* Maior espaçamento entre os grupos */
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.input-field,
.textarea-field,
.select-field {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: var(--color-input-background);
  color: var(--color-input-text);
  border: 1px solid var(--color-input-border);
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  border: 1px solid #bdc3c7; /* Cor de borda mais clara */
  transition: box-shadow 0.3s, border-color 0.3s; /* Adiciona transição para sombra */
}

.input-field:focus,
.textarea-field:focus,
.select-field:focus {
  border-color: var(--color-border-hover);
  outline: none;
  border-color: #3498db; /* Cor de foco mais vibrante */
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5); /* Adiciona sombra ao foco */
}

.textarea-field {
  resize: vertical;
}

.alunos-section {
  margin-top: 2.5rem; /* Maior espaçamento superior */
}

.alunos-list {
  list-style: none;
  margin: 1rem 0;
  padding: 0;
}

.aluno-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0; /* Maior espaçamento interno */
  border-bottom: 1px solid #ecf0f1; /* Cor de borda mais clara */
}

.remove-btn,
.add-btn,
.submit-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem; /* Botões maiores */
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem; /* Texto maior */
  transition: background-color 0.3s ease;
}

.remove-btn {
  background-color: #e74c3c;
}

.remove-btn:hover,
.add-btn:hover,
.submit-btn:hover {
  background-color: #1abc9c; /* Cor de hover mais vibrante */
}

.remove-btn:hover {
  background-color: #c0392b;
}

.submit-btn {
  display: block;
  width: 100%;
  margin-top: 2rem;
}

.submit-btn:hover {
  background-color: #2c3e50;
}

.no-data {
  color: #e74c3c; /* Vermelho para destacar */
  font-weight: bold;
  text-align: center;
  font-size: 1.1rem; /* Texto maior */
  margin-top: 1rem; /* Adiciona espaçamento superior */
}
</style>
