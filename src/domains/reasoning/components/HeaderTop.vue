<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { getUserData, removeUserData } from '@/utils/localStorageUtils';


const router = useRouter();
const user = getUserData();
const isLoggedIn = ref(!!user);
const username = ref(user?.userName || '');
console.log("User data:", user);

function goToHome() {
  router.push("/categorias");
}

function login() {
  window.location.href = "/login";
}

const API_URL = import.meta.env.VITE_API_URL;

async function logout() {
  try {
    const response = await fetch(`${API_URL}auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Erro ao deslogar:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao deslogar:", error);
  }

  // Remove os dados do usuário do localStorage
  removeUserData();

  // Redireciona para a página inicial
  window.location.href = "/home";
}
</script>

<template>
  <div class="toolbar">
    <div class="user-section">
      <div class="user" @click="falar('boasvindas', '', '#')">
        <img src="/public/img/capas/user2.png" />
      </div>
      <span v-if="username" class="username">{{ username }}</span>
    </div>
    <div id="image" class="w-16 left-5" @click="goToHome">
      <img src="/public/img/iconesSustentabilidade/reciclagem.png" />
      <img src="/public/img/iconesSustentabilidade/planta.png" />
      <img src="/public/img/iconesSustentabilidade/agua.png" />
    </div>
    <div class="menu">
      <div>
        <img src="/public/img/IconsHome/grupo.png" alt="" />
        <p>Turma 1</p>
      </div>
      <div>
        <img src="/public/img/IconsHome/formatura.png" alt="" />
        <p>1° Ano</p>
      </div>
      <div>
        <img src="/public/img/IconsHome/vitoria.png" alt="" />
        <p>1° Lugar</p>
      </div>
    </div>
    <!-- Botão de login/logout -->
    <button v-if="!isLoggedIn" class="login-button" @click="login">Login</button>
    <button v-else class="login-button" @click="logout">Logout</button>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 0px -40px;
  position: relative;
  top: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  width: 100%;
  background-color: #137e60;
}

.user-section {
  position: absolute;
  top: 25px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user {
  width: 3rem;
  cursor: pointer;
}

.user img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.username {
  color: white;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
}

#title {
  text-align: center;
  font-size: 24px;
  color: white;
}

#image {
  position: relative;
  top: 12%;
  width: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
}

#image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu {
  position: relative;
  top: 20%;
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
}

.menu div {
  display: flex;
  align-items: center;
}

.menu img {
  width: 20px;
  height: 20px;
  object-fit: cover;
}

.menu p {
  margin-left: 5px;
  color: white;
  font-size: 14px;
}

.login-button {
  position: absolute;
  top: 25px;
  right: 12px;
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  color: #137e60;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.login-button:hover {
  background-color: #f0f0f0;
}
</style>
