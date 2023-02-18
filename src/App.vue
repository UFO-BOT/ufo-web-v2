<template>
  <v-app>
    <v-main class="content">
      <div>
        <Navbar/>
        <router-view/>
      </div>
      <div>
        <Footer/>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
}

.center {
  text-align: center;
}

img {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.img-center {
  display: block!important;
  margin: 0 auto!important;
}
</style>