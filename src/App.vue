<template>
  <v-app>
    <v-main class="content">
      <div>
        <Navbar/>
        <router-view v-slot="{ Component }">
          <v-fade-transition :duration="150">
            <component :is="Component"/>
          </v-fade-transition>
        </router-view>
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

.item-center {
  display: block!important;
  margin: 0 auto!important;
}

.fit-content {
  width: fit-content!important;
}

.tooltip {
  background-color: rgb(var(--v-theme-tooltip))!important;
  color: white!important;
  opacity: 1!important;
}

code {
  padding: .3rem .5rem!important;
  font-size: .875em!important;
  color: #c62f5a !important;
  background-color: rgb(var(--v-theme-codeBG))!important;
  box-shadow: 3px 3px 6px -3px rgb(var(--v-theme-shadow))!important;
  border-radius: .25rem!important;
  margin: 0 2px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

::-moz-selection {
  background: #4444ff;
  color: white;
}

::selection {
  background: #4f47d5;
  color: white;
}

::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgb(var(--v-theme-scrollbarTrack));
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(var(--v-theme-scrollbarThumb));
  border-radius: 10px;
}
</style>