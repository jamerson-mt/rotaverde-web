import { RouteRecordRaw } from 'vue-router';
import CacaPalavras from '../views/CacaPalavras.vue';
import Silabario from '../views/Silabario.vue';
import EscritaPort from '../views/EscritaAtividade.vue';
import Letras from '../views/LetrasAtividade.vue';
import Silabas from '../views/SilabasView.vue';
import Consoantes from '../views/ContainerConsoantes.vue';
import Vogais from '../views/ContainerVogais.vue';
import InterTextos from '../views/Inter-Textos.vue';

const portugueseRoutes: Array<RouteRecordRaw> = [
    { path: '/att/pt/escrita', name: 'Escrita Portugues', component: EscritaPort },
    { path: '/att/pt/cacapalavras', name: 'Atividade Caça Palavras', component: CacaPalavras },
    { path: '/att/pt/silabario', name: 'atividade das silabas', component: Silabario },
    { path: '/att/pt/letras', name: 'Atividade Letras', component: Letras },
    { path: '/att/silabas', component: Silabas },
    { path: '/att/consoantes', component: Consoantes },
    { path: '/att/vogais', component: Vogais },
    { path: '/att/int-textos',  component: InterTextos }
]

export default portugueseRoutes;