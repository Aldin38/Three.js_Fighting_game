<template>
  <div class="home">
    <BlockGame />
  </div>
</template>

<script>
// @ is an alias to /src
import BlockGame from '@/components/BlockGame.vue';

export default {
  name: 'Home',
  components: {
    BlockGame,
  },
};
</script>
