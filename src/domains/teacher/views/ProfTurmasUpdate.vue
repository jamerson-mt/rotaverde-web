<script>
import TitleCategories from '@/domains/user/components/TitleCategories.vue';
const API_URL = import.meta.env.VITE_API_URL;

export default {
  components: { TitleCategories },
  data() {
    return {
      turma: {
        id: null,
        nome: "",
        anoLetivo: "",
        turno: "",
        criadorId: "",
        alunos: [], 
      },
      todosAlunosSemRole: [],
      alunosRemovidos: [], // NOVO: Para desvincular alunos no banco
      novoAlunoId: null,
    };
  },
  computed: {
    alunosFiltradosDisponiveis() {
      const idsNaTurma = this.turma.alunos.map(a => a.id);
      return this.todosAlunosSemRole.filter(aluno => 
        !idsNaTurma.includes(aluno.id) && (!aluno.turmaId || aluno.turmaId === null)
      );
    }
  },
  methods: {
    async fetchTurmaData() {
      try {
        const turmaId = window.location.pathname.split("/").pop();
        const tResp = await fetch(`${API_URL}turma/${turmaId}`);
        const tData = await tResp.json();
        this.turma = { ...tData, alunos: [] };

        const uResp = await fetch(`${API_URL}user`);
        const users = await uResp.json();

        this.todosAlunosSemRole = users.filter(u => !u.roles || u.roles.length === 0);
        this.turma.alunos = this.todosAlunosSemRole.filter(u => u.turmaId == turmaId);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    },

    adicionarAluno() {
      const aluno = this.todosAlunosSemRole.find(a => a.id === this.novoAlunoId);
      if (aluno) {
        this.turma.alunos.push(aluno);
        // Se ele estava na lista de removidos nesta sessão, tira de lá
        this.alunosRemovidos = this.alunosRemovidos.filter(id => id !== aluno.id);
        this.novoAlunoId = null;
      }
    },

    removerAluno(aluno) {
      this.turma.alunos = this.turma.alunos.filter(a => a.id !== aluno.id);
      // Guarda o ID para setar turmaId como null no banco
      this.alunosRemovidos.push(aluno.id);
    },

    async updateTurma() {
      try {
        // 1. Atualiza os dados básicos da Turma
        const payloadTurma = {
          id: this.turma.id,
          nome: this.turma.nome,
          anoLetivo: this.turma.anoLetivo,
          turno: this.turma.turno || "Matutino",
          criadorId: this.turma.criadorId
        };

        const respTurma = await fetch(`${API_URL}turma/${this.turma.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadTurma),
        });

        if (!respTurma.ok) throw new Error("Erro ao atualizar dados da turma");

        // 2. Atualiza os Alunos (Vínculos)
        // Criamos uma lista de promessas para atualizar cada aluno individualmente
        const promisesVincular = this.turma.alunos.map(aluno => {
          return fetch(`${API_URL}user/${aluno.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: aluno.id, turmaId: String(this.turma.id) }),
          });
        });

        const promisesDesvincular = this.alunosRemovidos.map(id => {
          return fetch(`${API_URL}user/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id, turmaId: null }),
          });
        });

        await Promise.all([...promisesVincular, ...promisesDesvincular]);

        alert("Configurações salvas com sucesso!");
        this.$router.push("/professor");
      } catch (error) {
        alert("Erro na sincronização: " + error.message);
      }
    }
  },
  async mounted() {
    await this.fetchTurmaData();
  },
};
</script>