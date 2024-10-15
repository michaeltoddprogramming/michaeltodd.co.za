//  Michael Todd u23540223

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

var shootSound = document.getElementById('shootSound');
var enemyHitSound = document.getElementById('enemyHitSound');
var playerHitSound = document.getElementById('playerHitSound');
var gameOverSound = document.getElementById('gameOverSound');
const playerImage = new Image();
playerImage.src = 'img/Geometron.svg';
playerImage.id = 'playerImage';

const EnemyImage = new Image();
EnemyImage.src = 'img/Enemy.svg';

const playerBullets = [];
const enemyBullets = [];

const enemy = {
	x: Math.random() * canvas.width,
	y: 150,
	width: 100,
	height: 100,
	health: 80,
	speed: 2,
	directionX: Math.random() < 0.5 ? -1 : 1,
	directionY: 1,
	draw: function() {
        ctx.drawImage(EnemyImage, this.x, this.y, this.width, this.height);
    },
	update: function() {
		this.x += this.speed * this.directionX;
		this.y += this.speed * this.directionY;
		if (this.x < 0) {
			this.x = 0;
			this.directionX *= -1;
		} else if (this.x + this.width > canvas.width) {
			this.x = canvas.width - this.width;
			this.directionX *= -1;
		}
		if (this.y < 0) {
			this.y = 0;
			this.directionY *= -1;
		} else if (this.y + this.height > canvas.height) {
			this.y = canvas.height - this.height;
			this.directionY *= -1;
		}
	},
	attack: function() {
		if (Math.random() < 0.01) {
			const bullet = {
				x: this.x + this.width / 2,
				y: this.y + this.height,
				width: 80,
				height: 30,
				color: "red",
				draw: function() {
					ctx.fillStyle = this.color;
					ctx.beginPath();
					ctx.moveTo(this.x, this.y);
					ctx.lineTo(this.x + this.width / 2, this.y + this.height);
					ctx.lineTo(this.x + this.width, this.y);
					ctx.closePath();
					ctx.fill();
				},
				update: function() {
					this.y += 3;
				}
			};
			
			enemyBullets.push(bullet);
		}
	}
};


const player = {
	x: canvas.width / 2,
	y: canvas.height - 90,
	width: 100,
	height: 100,
	color: "blue",
	speed: 3,
	isMovingLeft: false,
	isMovingRight: false,
	health: 100,
	score: 0,
	image: null,
	stillImage: null,
	movingImage: null,
	draw: function() {
		ctx.save(); 
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
		ctx.shadowColor = 'green';
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 10;
		if (this.isMovingLeft || this.isMovingRight) {
			const angle = Math.sin(Date.now() / 200) / 4;
			ctx.rotate(angle);
		}
		ctx.drawImage(playerImage, -this.width / 2, -this.height / 2, this.width, this.height);
		ctx.restore();
    },
	gunTemperature: 0,
	maxGunTemperature: 100,
	shoot: function() {
		if (this.gunTemperature < this.maxGunTemperature) {
			var shootSoundClone = shootSound.cloneNode();
        	shootSoundClone.play(); // Play the shoot sound
		const bullet = {
			x: this.x + 63  ,
			y: this.y + 20,
			width: 10,
			height: 10,
			color: "lightblue",
			draw: function() {
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(this.x + this.width / 2, this.y - this.height);
				ctx.lineTo(this.x + this.width, this.y);
				ctx.closePath();
				ctx.fill();
			},
			update: function() {
				this.y -= 5;
			}
		};
		
			playerBullets.push(bullet);
			this.gunTemperature += 20;
		}
	},
	update: function() {
		if (this.isMovingLeft) {
			this.x -= this.speed;
		}
		if (this.isMovingRight) {
			this.x += this.speed;
		}
		this.gunTemperature = Math.max(0, this.gunTemperature - 1); // Decrease gun temperature
	}
};

function isColliding(player, bullet) {
	return player.x < bullet.x + bullet.width &&
	player.x + player.width > bullet.x &&
	player.y < bullet.y + bullet.height &&
	player.y + player.height > bullet.y;
}

const bullets = [];


document.addEventListener("keydown", function(event) {
	if (event.key === "ArrowLeft") {
		player.isMovingLeft = true;
    } else if (event.key === "ArrowRight") {
		player.isMovingRight = true;
    } else if (event.code === "Space") {
		player.shoot();
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowLeft") {
        player.isMovingLeft = false;
    } else if (event.key === "ArrowRight") {
        player.isMovingRight = false;
    }
});

let gameRunning = true;


function gameLoop() {
	if (!gameRunning) return;
	document.getElementById('gameOver').style.display = 'none';
	document.getElementById('gunTemperature').textContent = "Gun Temperature: " + player.gunTemperature + "°C";

	 if (player.gunTemperature <= 30) {
        document.getElementById("gunTemperature").style.color = 'green';
    } else if (player.gunTemperature <= 70) {
        document.getElementById("gunTemperature").style.color = 'orange';
    } else {
        document.getElementById("gunTemperature").style.color = 'red';
    }


	ctx.clearRect(0, 0, canvas.width, canvas.height);

	player.update();

	enemyBullets.forEach(function(bullet) {
		bullet.update();
		bullet.draw();
		if (isColliding(player, bullet)) {
			playerHitSound.play(); // Play the player hit sound
			console.log("Player hit by bullet!");
			const bulletIndex = enemyBullets.indexOf(bullet);
			enemyBullets.splice(bulletIndex, 1);
			player.health -= 10;
			console.log("Player's current health: " + player.health);
			document.getElementById('playerCurrentHealth').style.width = player.health + '%';
			document.getElementById('playerHealthNumber').textContent = player.health;

			if (player.health <= 0) {
				gameRunning = false;
				console.log("Game Over! Enemy wins!");
				document.getElementById('gameOver').textContent = "Game Over! Enemy wins!";
				document.getElementById('gameOver').style.display = "block";
				gameOverSound.play(); // Play the game over sound
				setTimeout(function() {
					window.location.href = "comic/transitionPage.pdf"; // Replace with your relative path to the PDF
				}, 5000); // Wait 5 seconds before transitioning
			}
		}
	});

	enemy.update();
	enemy.attack();

	playerBullets.forEach(function(bullet) {
		bullet.update();
		bullet.draw();
		if (isColliding(enemy, bullet)) {
			enemyHitSound.play(); // Play the enemy hit sound
			console.log("Enemy hit by bullet!");
			const bulletIndex = playerBullets.indexOf(bullet);
			playerBullets.splice(bulletIndex, 1);
			enemy.health -= 10;
			player.score += 10;
			console.log("Enemy's current health: " + enemy.health);
			console.log("Player's current score: " + player.score);
			document.getElementById('enemyCurrentHealth').style.width = enemy.health + '%';
			document.getElementById('enemyHealthNumber').textContent = enemy.health;
			document.getElementById('playerScore').textContent = "Score: " + player.score;

			if (enemy.health <= 0) {
				gameRunning = false;
				console.log("Game Over! Player wins!");
				document.getElementById('gameOver').textContent = "Game Over! Player wins!";
				document.getElementById('gameOver').style.display = "block";
				gameOverSound.play(); // Play the game over sound
				setTimeout(function() {
					window.location.href = "comic/transitionPage.pdf"; // Replace with your relative path to the PDF
				}, 5000); // Wait 5 seconds before transitioning
			}
		}
	});

	player.draw();
	enemy.draw();

	if (gameRunning) requestAnimationFrame(gameLoop);
}
gameLoop();