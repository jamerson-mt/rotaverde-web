<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import { IonContent, IonPage } from '@ionic/vue';

// Componentes e Serviços
import { exercise } from "../services/attEscrita";
import TitleCategories from '@/domains/user/components/TitleCategories.vue';
import AttEscrita from "@/domains/portuguese/components/AttEscrita.vue";
import NivelModal from '../components/NivelModal.vue';

// Estados Reativos
const showNivelModal = ref(true);
const nivelSelecionado = ref<number | null>(null);
const atividadesFiltradas = ref<any[]>([]);
const itemArray = ref(0);
const att = ref<any>(null);

const router = useRouter();

// Emits
const emit = defineEmits<{
    (e: 'nextAtt', payload: boolean): void; 
}>();

// Funções de Lógica
function handleNivelSelecionado(nivel: number) {
    nivelSelecionado.value = nivel;
    atividadesFiltradas.value = exercise.filter(e => e.level === nivel);
    itemArray.value = 0;
    
    if (atividadesFiltradas.value.length > 0) {
        att.value = atividadesFiltradas.value[0];
    } else {
        att.value = null;
    }
    showNivelModal.value = false;
}

function nextAtt() {
    itemArray.value++;
    
    if (itemArray.value >= atividadesFiltradas.value.length) {
        // Se acabarem as atividades, volta para o roadmap ou home
        itemArray.value = 0;
        router.push('/att/roadMapAtividade');
    } else {
        att.value = atividadesFiltradas.value[itemArray.value];
    }
    
    // Opcional: emitir para o pai que avançou
    emit('nextAtt', true);
}

function resetNivelModal() {
    showNivelModal.value = true;
    atividadesFiltradas.value = [];
    att.value = null;
    itemArray.value = 0;
}

// Hooks de Ciclo de Vida
onMounted(() => {
    // Garante que o modal apareça ao entrar na página
    showNivelModal.value = true;
});

onBeforeRouteUpdate((to, from, next) => {
    resetNivelModal();
    next();
});
</script>

<template>
    <ion-page>
        <NivelModal 
            :isOpen="showNivelModal" 
            @nivelSelecionado="handleNivelSelecionado" 
            @close="showNivelModal = false" 
        />

        <ion-content :fullscreen="true">
            <div class="header-container">
                <img src="/img/IconsHome/relogio.png" class="icon-relogio" alt="Relógio">
                <TitleCategories 
                    class="main-title"
                    title="Atividade de Escrita"
                    route="/att/roadMapAtividade"    
                />
            </div>

            <div id="options" class="ion-padding">
                <template v-if="att">
                    <AttEscrita 
                        :title="att.title" 
                        :image="att.image" 
                        :options="att.options" 
                    />
                    
                    <div id="button-container">
                        <button @click="nextAtt" id="btn-next">
                            Próximo
                        </button>
                    </div>
                </template>

                <div v-else-if="!showNivelModal" class="empty-state">
                    <p>Nenhuma atividade encontrada para este nível.</p>
                    <button @click="resetNivelModal" class="btn-retry">Trocar Nível</button>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<style scoped>
.header-container {
    position: relative;
    padding-top: 2rem;
}

.icon-relogio {
    width: 4rem;
    height: 4rem;
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 10;
}

.main-title {
    margin: 2rem auto 1rem auto;
}

/* Ajuste fino para o parágrafo dentro do TitleCategories se necessário */
::v-deep(.title p) {
    font-size: 1.8rem;
    font-weight: bold;
}

#options {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#button-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 2rem;
}

#btn-next {
    background-color: #6D4D2F;
    color: white;
    font-weight: bold;
    padding: 1rem 2rem;
    border-radius: 25px;
    width: 70%;
    max-width: 300px;
    font-size: 1.3rem;
    border: none;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

#btn-next:active {
    transform: scale(0.98);
}

.empty-state {
    text-align: center;
    margin-top: 3rem;
    color: #666;
}

.btn-retry {
    margin-top: 1rem;
    background: none;
    color: #6D4D2F;
    text-decoration: underline;
    font-weight: bold;
}
</style>