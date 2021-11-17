<template>
  <div>
    <canvas ref="game" width="640" height="480" class="border border-black"> </canvas>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'BlockGame',
  data() {
    return {
      socket: {},
      context: {},
      position: {
        x: 0,
        y: 0,
      },
    };
  },
  created() {
    this.socket = io('http://localhost:3000');
  },
  mounted() {
    this.context = this.$refs.game.getContext('2d');
    this.socket.on('position', (data) => {
      this.position = data;
      this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
      this.context.fillRect(this.position.x, this.position.y, 20, 20);
    });
  },
  methods: {
    move(direction) {
      this.socket.emit('move', direction);
    },
  },
};
</script>
