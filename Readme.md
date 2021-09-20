# Prueba Técnica

Entrego mi solución al desafío técnico de Goin FullStack

## Usuarios Creados

Mi solución al reto planteado consta de la creación de usuarios con diferentes roles.
El primer usuario con el rol USER-ADMIN-STORE es el encargado de crear,
actualizar y eliminar productos

    - Usuario: edwin@gmail.com
    - Password: mysuperpassword

El segundo usuario con el rol USER-CLIENT es el cliente de nuestro ecommerce aBc

    - Usuario: julia@gmail.com
    - Password: otrosuperpassword

La aplicación esta enlazada a una base de datos en mongodb atlas, puede crear
los productos y usuarios que desee

## Pasos para iniciar la aplicación

    1. clone goin-assessment
    2. cd server-graphql
    3. npm install
    4. npm run dev 
    - Esto hara que el servidor este ejecutandose en http://localhost:4000/graphql
    5. cd frontend
    6. npm install
    7. npm run dev
    8. abrir navegador en http://localhost:3000

## Tecnologías en BackEnd

    - NodeJs
    - Typescript
    - Graphql con Type-graphql y ExpressJS
    - MongoDb con el ODM @typegoose

## Tecnologías en FrontEnd

    - NextJS
    - Tailwindcss
    - React Query
    - graphql-request
