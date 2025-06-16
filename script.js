let NUMBER_LENGTH = 3; // 자리수 (동적으로 변경)
const MAX_CHANCE = 9;

let answer = [];
let chance = MAX_CHANCE;
let gameActive = false;
let history = [];

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const inputArea = document.getElementById('input-area');
const numberInputs = document.getElementById('number-inputs');
const submitBtn = document.getElementById('submit-btn');
const resultArea = document.getElementById('result-area');
const chanceArea = document.getElementById('chance-area');
const digitSelect = document.getElementById('digit-select');
const answerArea = document.getElementById('answer-area');
const answerValue = document.getElementById('answer-value');
const historyList = document.getElementById('history-list');

function generateAnswer() {
  const nums = [];
  while (nums.length < NUMBER_LENGTH) {
    const n = Math.floor(Math.random() * 10); // 0~9
    if (!nums.includes(n)) nums.push(n);
  }
  return nums;
}

function resetGame() {
  NUMBER_LENGTH = parseInt(digitSelect.value, 10);
  answer = generateAnswer();
  chance = MAX_CHANCE;
  gameActive = true;
  history = [];
  resultArea.textContent = '';
  chanceArea.textContent = `남은 기회: ${chance}`;
  inputArea.classList.remove('hidden');
  restartBtn.classList.add('hidden');
  startBtn.classList.add('hidden');
  answerArea.classList.remove('hidden');
  answerValue.textContent = answer.join('');
  numberInputs.innerHTML = '';
  historyList.innerHTML = '';
  digitSelect.parentElement.style.display = 'none'; // 자리수 선택 감춤
  for (let i = 0; i < NUMBER_LENGTH; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.max = 9;
    input.maxLength = 1;
    input.addEventListener('input', (e) => {
      if (e.target.value.length > 1) e.target.value = e.target.value[0];
    });
    numberInputs.appendChild(input);
  }
}

function addHistory(guess, resultText) {
  const li = document.createElement('li');
  li.textContent = `${guess.join('')} → ${resultText}`;
  historyList.appendChild(li);
}

function checkInput() {
  if (!gameActive) return;
  const guess = Array.from(numberInputs.children).map(input => parseInt(input.value, 10));
  if (guess.some(isNaN) || new Set(guess).size !== NUMBER_LENGTH) {
    resultArea.textContent = '0~9까지 중복 없이 입력하세요!';
    return;
  }
  let strike = 0, ball = 0;
  for (let i = 0; i < NUMBER_LENGTH; i++) {
    if (guess[i] === answer[i]) strike++;
    else if (answer.includes(guess[i])) ball++;
  }
  const out = NUMBER_LENGTH - strike - ball;
  chance--;
  chanceArea.textContent = `남은 기회: ${chance}`;
  let resultText = `${ball}볼 ${strike}스트라이크 ${out}아웃`;
  addHistory(guess, resultText);
  if (strike === NUMBER_LENGTH) {
    resultArea.textContent = `🎉 정답! (${answer.join('')})`;
    addHistory(guess, '🎉 정답!');
    endGame(true);
    return;
  }
  if (chance === 0) {
    resultArea.textContent = `실패! 정답은 ${answer.join('')}입니다.`;
    addHistory(guess, `실패! 정답: ${answer.join('')}`);
    endGame(false);
    return;
  }
  resultArea.textContent = resultText;
}

function endGame(success) {
  gameActive = false;
  inputArea.classList.add('hidden');
  restartBtn.classList.remove('hidden');
  digitSelect.parentElement.style.display = 'block'; // 자리수 선택 다시 보이기
}

startBtn.addEventListener('click', resetGame);
restartBtn.addEventListener('click', resetGame);
submitBtn.addEventListener('click', checkInput);
digitSelect.addEventListener('change', () => {
  NUMBER_LENGTH = parseInt(digitSelect.value, 10);
});
// 엔터키로 입력
numberInputs.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkInput();
});
