export default (board, start, middle, end) =>
  board[start] === board[middle] && board[start] === board[end] && board[start] !== null && board[start]
