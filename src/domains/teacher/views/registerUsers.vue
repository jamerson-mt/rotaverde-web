<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
} from "@ionic/vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");

const registerUser = async () => {
  const user = {
    displayName: username.value,
    email: email.value,
    password: password.value,
    photoURL: "",
  };

  await sendUserToAPI(user);
};

const sendUserToAPI = async (user: any) => {
  try {
    const response = await fetch("http://127.0.0.1:5245/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        username: user.displayName,
        photoURL: user.photoURL,
        password: user.password,
      }),
    });
    const data = await response.json();
    console.log(data);
    // router.push({ name: 'Login', params: { user: data } });
    router.push("/login");
  } catch (error) {
    console.error(error);
    router.push("/login");
  }
};
</script>

<template>
  <ion-page>
    <ion-content>
      <div class="img">
        <img src="img/capas/estudo.jpeg" alt="Capacita Digital" />
      </div>
      <div class="back"></div>
      <ion-grid>
        <ion-row>
          <ion-col>
            <TitleCategories title="Criar Turma" route="/professor" />

            <div class="title">
              <h1>Registro</h1>
              <p>Informe seus dados de login</p>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-grid>
        <ion-row class="content">
          <ion-col class="register">
            <ion-input
              v-model="username"
              label="Nome de usuário"
              label-placement="floating"
              fill="outline"
              placeholder="Seu nome"
              class="input"
              color="tertiary"
            ></ion-input>
            <ion-input
              v-model="email"
              label="E-mail"
              label-placement="floating"
              fill="outline"
              placeholder="meuemail@gmail.com"
              class="input"
              color="tertiary"
            ></ion-input>
            <ion-input
              v-model="password"
              label="Senha"
              label-placement="floating"
              fill="outline"
              placeholder="Sua senha"
              class="input"
              color="tertiary"
            ></ion-input>
          </ion-col>
          <div class="login">
            <ion-button @click="registerUser" class="route">Registrar</ion-button>
          </div>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");

.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 1)
  );
  z-index: -1;
}

.input {
  display: flex;
  position: relative;
  width: 90%;
  height: 3.5rem;
  top: 16rem;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-color: #1e1f24;
  color: azure;
  font-weight: bold;
  border-radius: 5px;
  margin: 8px 0;
  --border-color: none;
}

.title {
  display: flex;
  position: relative;
  top: 16rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

.title h1 {
  font-size: 2rem;
  font-weight: 700;
}

.title p {
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  color: #d4d1d1;
}

.buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.register {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  justify-content: center;
  align-items: center;
  color: azure;
  font-weight: bold;
  border-radius: 5p;
}

.login .route {
  color: azure;
  font-weight: bold;
}

.content {
  justify-content: center;
  align-items: center;
}

.route {
  width: 100%;
  height: 3.4rem;
  --background: blueviolet;
  --border-radius: 5px;
}

.login {
  display: flex;
  position: relative;
  width: 90%;
  height: 3.5rem;
  top: 18rem;
  justify-content: center;
  align-items: center;
  padding: 15px;
  color: azure;
  font-weight: bold;
}
</style>
