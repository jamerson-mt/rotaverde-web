
// ------------------------ ATIVIDADES DE ESCRITA -----------------------//

export interface Exercise {
    title: string;
    image: string;
    options: 
    { 
        option1: string;
        option2: string;
        option3: string;
        option4: string;
        response: string;
        [key: string]: string;
    }
    level: number;
}

export const exercise: Exercise[] = [
    {
        title:"Selecione a palavra correspondente a imagem",
        image: "../img/peixe.jpg",
        options: {
            option1: "peixe",
            option2: "peixi",
            option3: "pexe",
            option4: "peiche",
            response: "peixe",
        },
        level: 1
    },
     {
        title:"Qual a escrita correta para a imagem abaixo?",
        image: "../img/casa.png",
        options: {
            option1: "casa",
            option2: "caza",
            option3: "casaa",
            option4: "cazaa",
            response: "casa",
        },
        level: 1
    },
    {
        title: "Selecione a palavra correspondente a imagem",
        image: "../img/marisco.jpg",
        options: {
            option1: "marisco",
            option2: "marrisco",
            option3: "mariscu",
            option4: "marissco",
            response: "marisco",
        },
        level: 2
    },
    {
        title: "Qual a escrita correta para a imagem abaixo?",
        image: "../img/curuja.png",
        options: {
            option1: "coruja",
            option2: "curuja",
            option3: "corujaa",
            option4: "curujaa",
            response: "coruja",
        },
        level: 1
    },
    {
        title: "Selecione a palavra correspondente a imagem",
        image: "../img/canoa.jpg",
        options: {
            option1: "canoa",
            option2: "canoua",
            option3: "camoa",
            option4: "kanoa",
            response: "canoa",
        },
        level: 1
    },
    {
        title: "Selecione a palavra correspondente a imagem",
        image: "../img/anzol.jpg",
        options: {
            option1: "anzol",
            option2: "ansol",
            option3: "anzou",
            option4: "azoul",
            response: "anzol",
        },
        level: 2
    },
    {
        title: "Qual a escrita correta para a imagem abaixo?",
        image: "../img/carro.jpg",
        options: {
            option1: "caro",
            option2: "carro",
            option3: "corra",
            option4: "corre",
            response: "carro",
        },
        level: 2
    },
    {
        title: "Selecione a palavra correspondente a imagem",
        image: "../img/rio.jpg",
        options: {
            option1: "rio",
            option2: "riu",
            option3: "rrio",
            option4: "ril",
            response: "rio",
        },
        level: 1
    },
];