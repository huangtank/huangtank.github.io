let secretNumber = generateSecretNumber();
let history = [];
let visitorCount = localStorage.getItem('visitorCount') || 0;
let time = 0;

document.getElementById('visitorCount').innerText = visitorCount;

function generateSecretNumber() {
    let digits = [];
    while (digits.length < 4) {
        let randomDigit = Math.floor(Math.random() * 10).toString();
        if (!digits.includes(randomDigit)) {
            digits.push(randomDigit);
        }
    }
    return digits.join('');
}

function makeGuess() {
    let guess = document.getElementById('guessInput').value;
    if (guess.length !== 4 || !/^\d+$/.test(guess)) {
        alert('請輸入四位數密碼');
        return;
    }
    
    let [a, b] = checkGuess(guess, secretNumber);
    history.push(`${guess}: ${a}A${b}B`);
    updateHistory();
    
    if (a === 4) {
        alert(`恭喜，你猜到了，總共花了 ${time} 次`);
        restartGame();
    }else {
        time += 1;
    }
}

function checkGuess(guess, secret) {
    let a = 0, b = 0;
    for (let i = 0; i < 4; i++) {
        if (guess[i] === secret[i]) {
            a++;
        } else if (secret.includes(guess[i])) {
            b++;
        }
    }
    return [a, b];
}

function updateHistory() {
    let historyElement = document.getElementById('history');
    historyElement.innerHTML = history.map(item => `<p>${item}</p>`).join('');
}

function restartGame() {
    secretNumber = generateSecretNumber();
    history = [];
    updateHistory();
    document.getElementById('guessInput').value = '';
}

// Update visitor count
visitorCount++;
localStorage.setItem('visitorCount', visitorCount);
document.getElementById('visitorCount').innerText = visitorCount;
