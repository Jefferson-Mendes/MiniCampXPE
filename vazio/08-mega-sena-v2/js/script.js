var state = { board: [], currentGame: [], savedGames: [] };

function start() {
  createBoard();
  readLocalStorage();
  newGame();
}

function readLocalStorage() {
  if (!window.localStorage) {
    return;
  }

  var savedGameFromLocalStorage = window.localStorage.getItem('saved-games');
  if (savedGameFromLocalStorage) {
    state.savedGames = JSON.parse(savedGameFromLocalStorage);
  }
}

function writeToLocalStorage() {
  window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames));
}

function createBoard() {
  state.board = [];

  for (var i = 1; i <= 60; i++) {
    state.board.push(i);
  }
}
function newGame() {
  resetGame();
  render();
}

function render() {
  renderBoard();
  renderButtons();
  renderSavedGame();
}

function renderBoard() {
  var divBoard = document.querySelector('#megasena-board');
  divBoard.innerHTML = '';

  var ulNumbers = document.createElement('ul');
  ulNumbers.classList.add('numbers');

  for (var i = 0; i < state.board.length; i++) {
    var currentNumber = state.board[i];

    var liNUmber = document.createElement('li');
    liNUmber.textContent = currentNumber;
    liNUmber.classList.add('number');

    liNUmber.addEventListener('click', hancdleNumberClick);

    if (isNumberInGame(currentNumber)) {
      liNUmber.classList.add('selected-number');
    }

    ulNumbers.appendChild(liNUmber);
  }

  divBoard.appendChild(ulNumbers);
}

function hancdleNumberClick(event) {
  var value = Number(event.currentTarget.textContent);

  if (isNumberInGame(value)) {
    removeNumberFromGame(value);
  } else {
    addNumberToGame(value);
  }

  render();
}

function renderButtons() {
  var divButtons = document.querySelector('#megasena-buttons');
  divButtons.innerHTML = '';

  var buttonNewGame = CreateNewGameButton();
  var buttonRandomGame = createRandomGameButton();
  var buttonSaveGame = CreateSaveGameButton();

  divButtons.appendChild(buttonNewGame);
  divButtons.appendChild(buttonRandomGame);
  divButtons.appendChild(buttonSaveGame);
}

function createRandomGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Jogo aleatório';

  button.addEventListener('click', randomGame);

  return button;
}

function CreateNewGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Novo Jogo';

  button.addEventListener('click', newGame);

  return button;
}
function CreateSaveGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Salvar Jogo';
  button.disabled = !isGameComplete();

  button.addEventListener('click', saveGame);

  return button;
}

function renderSavedGame() {
  var divSavedGame = document.querySelector('#megasena-saved-games');
  divSavedGame.innerHTML = '';
  if (state.savedGames.length === 0) {
    divSavedGame.innerHTML = '<p>Nenhum jogo salve</p>';
  } else {
    var ulSavedGames = document.createElement('ul');

    for (var i = 0; i < state.savedGames.length; i++) {
      var currentGame = state.savedGames[i];

      var liGame = document.createElement('li');
      liGame.textContent = currentGame.join(', ');

      ulSavedGames.appendChild(liGame);
    }

    divSavedGame.appendChild(ulSavedGames);
  }
}

function addNumberToGame(numberToAdd) {
  if (numberToAdd < 1 || numberToAdd > 60) {
    console.error('Número Inválido', numberToAdd);
    return;
  }
  if (state.currentGame.length >= 6) {
    console.error('O jogo já está completo.');
    return;
  }
  if (isNumberInGame(numberToAdd)) {
    console.error('Este número já está no jogo.', numberToAdd);
    return;
  }
  state.currentGame.push(numberToAdd);
}
function removeNumberFromGame(numberToRemove) {
  if (numberToRemove < 1 || numberToRemove > 60) {
    console.error('Número Inválido', numberToRemove);
    return;
  }
  var newGame = [];

  for (var i = 0; i < state.currentGame.length; i++) {
    var currentNumber = state.currentGame[i];

    if (currentNumber === numberToRemove) {
      continue;
    }

    newGame.push(currentNumber);
  }
  state.currentGame = newGame;
}

function isNumberInGame(numerToCheck) {
  //  if (state.currentGame.includes(numerToCheck)) {
  //    return true;
  // }
  // return false;
  return state.currentGame.includes(numerToCheck);
}

function saveGame() {
  if (!isGameComplete()) {
    console.error('O jogo não está completo!');
    return;
  }

  state.savedGames.push(state.currentGame);
  writeToLocalStorage();
  newGame();
}

function isGameComplete() {
  return state.currentGame.length === 6;
}

function resetGame() {
  state.currentGame = [];
}

function randomGame() {
  resetGame();

  while (!isGameComplete()) {
    var randomNumber = Math.ceil(Math.random() * 60);
    addNumberToGame(randomNumber);
  }

  render();
}

start();
