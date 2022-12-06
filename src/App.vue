<script setup>
import { reactive, computed, watch } from 'vue'

const boardStartingState = {
  '0.0': null, // top left
  0.1: null,
  0.2: null,
  '1.0': null,
  1.1: null, // center
  1.2: null,
  '2.0': null,
  2.1: null,
  2.2: null, // bottom right
}

// coord (string) - one of the keys from boardStartingState
// sets the boarders on the squares to form the board via :class bindings
const borders = coord => {
  const x = coord.split('.')[1]
  const y = coord.split('.')[0]
  return {
    'border-t-4': y == 1 || y == 2,
    'border-r-4': x == 0 || x == 1,
  }
}

const state = reactive({
  board: { ...boardStartingState }, // tracks the board
  score: {
    // tracks the score board
    x: 0,
    o: 0,
    tie: 0,
  },
})

// returns either 'o' or 'x' which represents the player whos turn it currently is
const playersTurn = computed(() =>
  Object.values(state.board).filter(sq => sq === 'x').length >=
  Object.values(state.board).filter(sq => sq === 'o').length
    ? 'o'
    : 'x'
)

// todo - maybe place this in a separate file
const path = (start, middle, end) =>
  state.board[start] === state.board[middle] &&
  state.board[start] === state.board[end] &&
  state.board[start] !== null &&
  state.board[start]

// returns either "x" (x won), "o" (o won), "tie" (game is a draw) or false (game in progress)
const result = computed(() => {
  // each array element is a winning board condition
  // if the win condition is met either "x" or "o" is returned representing the winning symbol
  // if the win condition is not met, false is returned
  let winningResults = [
    // horizontal wins
    path('0.0', '1.0', '2.0'),
    path('0.1', '1.1', '2.1'),
    path('0.2', '1.2', '2.2'),
    // vertical wins
    path('0.0', '0.1', '0.2'),
    path('1.0', '1.1', '1.2'),
    path('2.0', '2.1', '2.2'),
    // diag wins
    path('0.0', '1.1', '2.2'),
    path('0.2', '1.1', '2.0'),
  ]
  const winner = winningResults.filter(Boolean).length > 0 ? winningResults.filter(Boolean)[0] : false
  const tie = !winner && Object.values(state.board).filter(Boolean).length == 9 && 'tie'
  return winner || tie
})

// increments scoreboard if there is a result
watch(result, (newResult, oldResult) => {
  if (newResult == 'o') state.score.o++
  if (newResult == 'x') state.score.x++
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
  <div class="board mt-4 w-full flex justify-center">
    <div class="grid grid-cols-3 grid-rows-3 gap-0 w-44">
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
