// Michael Todd u23540223
var bgMusic = document.getElementById('bgMusic');
bgMusic.play();
function hoverOnPortal() {
	document.querySelector('.portal').classList.add('hover');
}

function promptOnClick() {
    var portalClick = document.getElementById('portalClick');

    Swal.fire({
        title: 'Are you sure you want to make a bad decision?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        background: 'green',
        customClass: {
            title: 'my-title-class',
            content: 'my-content-class',
            confirmButton: 'my-confirm-button-class',
            cancelButton: 'my-cancel-button-class'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            portalClick.play(); // Play the portal click sound
			var imageUrls = ["img/Enemy.svg", "img/Geometron.svg", ];
			for (var i = 0; i < imageUrls.length; i++) {
				var img = new Image();
				img.onload = function() {
					this.style.position = 'fixed';
					this.style.top = '0%';
					this.style.left = '0%';
					this.style.transform = 'translate(-50%, -50%)';
					document.body.appendChild(this);
				};
				img.src = imageUrls[i];
				img.classList.add("flying-image");
			}
					} else {
            Swal.fire({
                title: 'Too late to think about it!',
                background: 'green',
                confirmButtonText: 'OK',
                customClass: {
                    title: 'my-title-class',
                    content: 'my-content-class',
                    confirmButton: 'my-confirm-button-class'
                }
            });
        }

        document.querySelector('.portal').classList.add('zoom-in');
        setTimeout(function() {
            splitScreen();
            animateLine();
            flashScreen();
            window.location.href = 'minigame.html';
        }, 8000);
    });
}

function splitScreen() {
	var leftScreen = document.createElement("div");
	leftScreen.classList.add("screen");
	leftScreen.classList.add("left-screen");
	document.body.appendChild(leftScreen);

	var rightScreen = document.createElement("div");
	rightScreen.classList.add("screen");
	rightScreen.classList.add("right-screen");
	document.body.appendChild(rightScreen);
}

function animateLine() {
	var line = document.createElement("div");
	line.classList.add("line");
	document.body.appendChild(line);

	setTimeout(function() {
		line.style.opacity = "1";
	}, 1000);
}

function flashScreen() {
    var flash = document.createElement("div");
    flash.classList.add("flash");
    document.body.appendChild(flash);

    setTimeout(function() {
        flash.style.opacity = "1";
        setTimeout(function() {
            flash.style.opacity = "0";
            setTimeout(function() {
                window.location.href = "minigame.html";
            }, 1000);
        }, 1000);
    }, 5000);
}

for (var i = 0; i < 10; i++) {
	var shape = document.createElement("div");
	shape.classList.add("shape");
	var randomShape = Math.floor(Math.random() * 3);
	if (randomShape === 0) {
		shape.classList.add("circle");
	} else if (randomShape === 1) {
		shape.classList.add("square");
	} else {
		shape.classList.add("triangle");
	}
	shape.style.top = Math.random() * window.innerHeight + "px";
	shape.style.left = Math.random() * window.innerWidth + "px";
	document.body.appendChild(shape);
}

