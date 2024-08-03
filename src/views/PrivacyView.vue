<template>
  <div class="center">
    <div class="content item-center">
      <div class="header">{{ $t('Privacy.name') }}</div>
      <div class="paragraph" v-for="(paragraph, i) in $tm('Privacy.paragraphs')">
        <div class="name">{{ i+1 }}. {{ $rt(paragraph.name) }}</div>
        <div v-for="(item, j) in paragraph.items">
          {{ i+1 }}.{{ j+1 }}. <span v-html="$rt(item)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.content {
  max-width: 90%;
}

.header {
  font-size: 2em;
  margin-top: 5px;
}

.paragraph {
  text-align: left;
  margin-bottom: 15px;
}

.name {
  font-size: 1.4em;
}
</style>