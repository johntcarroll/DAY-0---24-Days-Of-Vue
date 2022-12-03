<script setup>
import { reactive, computed, watch } from 'vue'
const boardStartingState = {
  '0.0': null,
  0.1: null,
  0.2: null,
  '1.0': null,
  1.1: null,
  1.2: null,
  '2.0': null,
  2.1: null,
  2.2: null,
}

const borders = coord => {
  const x = coord.split('.')[1]
  const y = coord.split('.')[0]
  return {
    'border-t-4': y == 1 || y == 2,
    'border-r-4': x == 0 || x == 1,
  }
}

const state = reactive({
  board: { ...boardStartingState },
  score: {
    x: 0,
    o: 0,
    tie: 0,
  },
})

const playersTurn = computed(() =>
  Object.values(state.board).filter(sq => sq === 'x').length >=
  Object.values(state.board).filter(sq => sq === 'o').length
    ? 'o'
    : 'x'
)

const result = computed(() => {
  let winningResults = [
    // horizontal wins
    state.board['0.0'] === state.board['0.1'] &&
      state.board['0.0'] === state.board['0.2'] &&
      state.board['0.0'] !== null &&
      state.board['0.0'],
    state.board['1.0'] === state.board['1.1'] &&
      state.board['1.0'] === state.board['1.2'] &&
      state.board['1.0'] !== null &&
      state.board['1.0'],
    state.board['2.0'] === state.board['2.1'] &&
      state.board['2.0'] === state.board['2.2'] &&
      state.board['2.0'] !== null &&
      state.board['2.0'],
    // vertical wins
    state.board['0.0'] === state.board['1.0'] &&
      state.board['1.0'] === state.board['2.0'] &&
      state.board['0.0'] !== null &&
      state.board['0.0'],
    state.board['0.1'] === state.board['1.1'] &&
      state.board['0.1'] === state.board['2.1'] &&
      state.board['0.1'] !== null &&
      state.board['0.1'],
    state.board['0.2'] === state.board['1.2'] &&
      state.board['0.2'] === state.board['2.2'] &&
      state.board['0.2'] !== null &&
      state.board['0.2'],
    // diag wins
    state.board['0.0'] === state.board['1.1'] &&
      state.board['0.0'] === state.board['2.2'] &&
      state.board['0.0'] !== null &&
      state.board['0.0'],
    state.board['0.2'] === state.board['1.1'] &&
      state.board['0.2'] === state.board['2.0'] &&
      state.board['0.2'] !== null &&
      state.board['0.2'],
  ]
  if (winningResults.filter(Boolean).length > 0) return `${winningResults.filter(Boolean)[0]} wins`
  if (winningResults.filter(Boolean).length == 0 && Object.values(state.board).filter(Boolean).length == 9) return 'tie'
  else return false
})

watch(result, (newResult, oldResult) => {
  if (newResult == 'o wins') state.score.o++
  if (newResult == 'x wins') state.score.x++
  if (newResult == 'tie') state.score.tie++
})
</script>
<template>
  <div class="w-full flex content-center justify-center">
    <div class="text-3xl pr-4 border-r-1">[X] Wins: {{ state.score.x }}</div>
    <div class="text-3xl pr-4 border-r-1">[O] Wins: {{ state.score.o }}</div>
    <div class="text-3xl pr-4">Ties: {{ state.score.tie }}</div>
  </div>
  <div class="w-full flex content-center justify-center">
    <span class="text-3xl"
      >Its your turn: <span class="uppercase"> [{{ playersTurn }}]</span></span
    >
  </div>
  <div class="w-full board mt-4">
    <div class="grid grid-cols-3 grid-rows-3 gap-0">
      <div v-for="coord in Object.keys(state.board)" :key="`sq-${coord}`" :class="borders(coord)">
        <button
          class="w-full h-full place-content-center p-4 uppercase"
          @click="state.board[coord] = playersTurn"
          :disabled="Boolean(state.board[coord]) || result"
        >
          {{ state.board[coord] || '_' }}
        </button>
      </div>
    </div>
  </div>
  <div class="w-full flex" v-if="result">
    <button @click="state.board = { ...boardStartingState }" class="text-3xl">{{ result }} - start new game</button>
  </div>
</template>
