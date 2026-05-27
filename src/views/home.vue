<script setup lang="ts">
</script>

<template>
  <h1>Bienvenido</h1>
 <!-- <RouterLink> nos sirve para que cuando vayamos a navagar por las distintas vistas/rutas 
    no recargue la pagina, que es lo que hace una SPA -->
  <RouterLink to="/admin">Ir a Admin</RouterLink>
  <RouterLink to="/client">Ir a Cliente</RouterLink>
</template>