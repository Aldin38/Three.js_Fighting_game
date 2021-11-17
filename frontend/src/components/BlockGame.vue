<template>
  <div>
    <canvas id="scene"></canvas>
  </div>
</template>

<script>
import game from '../js/controlls';

export default {
  name: 'BlockGame',
  data() {
    return {
      // socket: {},
      // context: {},
      // keys: {
      //   left: false,
      //   right: false,
      //   space: false,
      // },
      // movement: {
      //   acceleration: 3,
      // },
      // hasReachedApex: false,
      // isJumping: false,
      // ground: null,
      // position: {
      //   x: 0,
      //   y: 0,
      // },
    };
  },
  created() {
    // this.socket = io('http://localhost:3000');
  },
  mounted() {
    game();
  },
};
</script>
