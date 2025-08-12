// Enhanced Rock Paper Scissors Battle Arena

class BattleArena {
    constructor() {
        this.choices = ["rock", "paper", "scissors"];
        this.choiceEmojis = {
            rock: "✊",
            paper: "✋",
            scissors: "✌️"
        };
        this.choiceButtons = document.querySelectorAll(".choice-btn");
        this.playerScoreSpan = document.getElementById("player-score");
        this.computerScoreSpan = document.getElementById("computer-score");
        this.roundCountSpan = document.getElementById("round-count");
        this.resultMessage = document.getElementById("result-message");
        this.playAgainBtn = document.getElementById("play-again");
        this.playerHand = document.getElementById("player-hand");
        this.computerHand = document.getElementById("computer-hand");
        this.battleEffects = document.getElementById("battle-effects");
        this.particleField = document.getElementById("particle-field");

        this.playerScore = 0;
        this.computerScore = 0;
        this.round = 1;
        this.maxRounds = 5;
        this.isPlaying = false;

        this.init();
    }

    init() {
        this.createParticles();
        this.bindEvents();
        this.updateDisplay();
    }

    createParticles() {
        // Create floating particles for background effect
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 200);
        }

        // Continue creating particles
        setInterval(() => {
            this.createParticle();
        }, 1000);
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';

        this.particleField.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 8000);
    }

    bindEvents() {
        this.choiceButtons.forEach(btn => {
            btn.addEventListener("click", (e) => this.handleChoice(e));
        });
        this.playAgainBtn.addEventListener("click", () => this.resetGame());
    }

    getComputerChoice() {
        const idx = Math.floor(Math.random() * 3);
        return this.choices[idx];
    }

    getWinner(player, computer) {
        if (player === computer) return "tie";
        if (
            (player === "rock" && computer === "scissors") ||
            (player === "scissors" && computer === "paper") ||
            (player === "paper" && computer === "rock")
        ) {
            return "player";
        }
        return "computer";
    }

    async animateHands(playerChoice, computerChoice) {
        // Reset hands
        this.playerHand.querySelector('.hand-gesture').textContent = '✊';
        this.computerHand.querySelector('.hand-gesture').textContent = '✊';

        // Add battle animation
        document.querySelector('.battle-stage').classList.add('battle-animation');

        // Countdown animation
        for (let i = 3; i > 0; i--) {
            this.resultMessage.innerHTML = `<div class="countdown">${i}</div>`;
            await this.delay(600);
        }

        this.resultMessage.innerHTML = '<div class="countdown">BATTLE!</div>';
        await this.delay(400);

        // Reveal choices with dramatic effect
        this.playerHand.querySelector('.hand-gesture').textContent = this.choiceEmojis[playerChoice];
        this.computerHand.querySelector('.hand-gesture').textContent = this.choiceEmojis[computerChoice];

        // Remove battle animation
        setTimeout(() => {
            document.querySelector('.battle-stage').classList.remove('battle-animation');
        }, 500);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    createBattleEffect(winner) {
        // Create visual effects based on winner
        const effect = document.createElement('div');
        effect.className = 'battle-effect';

        if (winner === 'player') {
            effect.innerHTML = '🎉 VICTORY! 🎉';
            effect.style.color = '#00ff00';
        } else if (winner === 'computer') {
            effect.innerHTML = '💥 DEFEAT! 💥';
            effect.style.color = '#ff0040';
        } else {
            effect.innerHTML = '⚡ DRAW! ⚡';
            effect.style.color = '#ffff00';
        }

        effect.style.position = 'absolute';
        effect.style.top = '50%';
        effect.style.left = '50%';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.fontSize = '2rem';
        effect.style.fontWeight = 'bold';
        effect.style.textShadow = '0 0 20px currentColor';
        effect.style.animation = 'battleEffectPop 1s ease-out forwards';

        this.battleEffects.appendChild(effect);

        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
    }

    updateDisplay() {
        this.playerScoreSpan.textContent = this.playerScore;
        this.computerScoreSpan.textContent = this.computerScore;
        this.roundCountSpan.textContent = this.round;
    }

    async updateUI(player, computer, winner) {
        // Add selection effect to chosen button
        this.choiceButtons.forEach(btn => {
            btn.classList.remove('choice-selected');
            if (btn.getAttribute('data-choice') === player) {
                btn.classList.add('choice-selected');
            }
        });

        let msg = `<div class="battle-result">`;
        msg += `<div>You chose <strong>${player.toUpperCase()}</strong></div>`;
        msg += `<div>AI chose <strong>${computer.toUpperCase()}</strong></div>`;

        if (winner === "player") {
            msg += `<div class="win-effect">🏆 YOU WIN THIS ROUND! 🏆</div>`;
            this.resultMessage.classList.add('win-effect');
        } else if (winner === "computer") {
            msg += `<div class="lose-effect">🤖 AI WINS THIS ROUND! 🤖</div>`;
            this.resultMessage.classList.add('lose-effect');
        } else {
            msg += `<div class="tie-effect">⚡ IT'S A TIE! ⚡</div>`;
            this.resultMessage.classList.add('tie-effect');
        }
        msg += `</div>`;

        this.resultMessage.innerHTML = msg;
        this.createBattleEffect(winner);
        this.updateDisplay();

        // Remove effect classes after animation
        setTimeout(() => {
            this.resultMessage.classList.remove('win-effect', 'lose-effect', 'tie-effect');
            this.choiceButtons.forEach(btn => btn.classList.remove('choice-selected'));
        }, 2000);
    }

    async endGame() {
        let finalMsg = "";
        let effectClass = "";

        if (this.playerScore > this.computerScore) {
            finalMsg = `
                <div class="game-over-message">
                    <div class="victory-title">🎊 CHAMPION! 🎊</div>
                    <div>You conquered the AI!</div>
                    <div class="final-score">Final Score: ${this.playerScore} - ${this.computerScore}</div>
                </div>
            `;
            effectClass = "win-effect";
        } else if (this.computerScore > this.playerScore) {
            finalMsg = `
                <div class="game-over-message">
                    <div class="defeat-title">🤖 AI DOMINANCE 🤖</div>
                    <div>The machines have won...</div>
                    <div class="final-score">Final Score: ${this.playerScore} - ${this.computerScore}</div>
                </div>
            `;
            effectClass = "lose-effect";
        } else {
            finalMsg = `
                <div class="game-over-message">
                    <div class="tie-title">⚡ STALEMATE ⚡</div>
                    <div>An epic battle with no victor!</div>
                    <div class="final-score">Final Score: ${this.playerScore} - ${this.computerScore}</div>
                </div>
            `;
            effectClass = "tie-effect";
        }

        this.resultMessage.innerHTML = finalMsg;
        this.resultMessage.classList.add(effectClass);
        this.playAgainBtn.style.display = "inline-block";
        this.choiceButtons.forEach(btn => btn.disabled = true);

        // Add game over glow effect
        document.querySelector('.game-arena').classList.add('game-over');
    }

    async handleChoice(e) {
        if (this.round > this.maxRounds || this.isPlaying) return;

        this.isPlaying = true;
        const playerChoice = e.currentTarget.getAttribute("data-choice");
        const computerChoice = this.getComputerChoice();

        // Disable buttons during animation
        this.choiceButtons.forEach(btn => btn.disabled = true);

        // Animate the battle
        await this.animateHands(playerChoice, computerChoice);

        const winner = this.getWinner(playerChoice, computerChoice);
        if (winner === "player") this.playerScore++;
        else if (winner === "computer") this.computerScore++;

        await this.updateUI(playerChoice, computerChoice, winner);

        if (this.round === this.maxRounds) {
            setTimeout(() => this.endGame(), 1500);
        } else {
            // Re-enable buttons for next round
            setTimeout(() => {
                this.choiceButtons.forEach(btn => btn.disabled = false);
                this.isPlaying = false;
            }, 2000);
        }

        this.round++;
    }

    resetGame() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.round = 1;
        this.isPlaying = false;

        this.updateDisplay();
        this.resultMessage.innerHTML = "";
        this.resultMessage.classList.remove('win-effect', 'lose-effect', 'tie-effect');
        this.playAgainBtn.style.display = "none";
        this.choiceButtons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('choice-selected');
        });

        // Reset hands
        this.playerHand.querySelector('.hand-gesture').textContent = '✊';
        this.computerHand.querySelector('.hand-gesture').textContent = '❓';

        // Remove game over effects
        document.querySelector('.game-arena').classList.remove('game-over');
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new BattleArena();
});

// Add CSS for battle effects
const style = document.createElement('style');
style.textContent = `
    @keyframes battleEffectPop {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }

    .countdown {
        font-family: 'Orbitron', monospace;
        font-size: 3rem;
        font-weight: 900;
        color: #00ffff;
        text-shadow: 0 0 30px #00ffff;
        animation: countdownPulse 0.6s ease-in-out;
    }

    @keyframes countdownPulse {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
    }

    .game-over-message {
        font-family: 'Orbitron', monospace;
        text-align: center;
        line-height: 1.8;
    }

    .victory-title, .defeat-title, .tie-title {
        font-size: 2rem;
        font-weight: 900;
        margin-bottom: 10px;
    }

    .final-score {
        font-size: 1.2rem;
        margin-top: 15px;
        opacity: 0.8;
    }
`;
document.head.appendChild(style);
