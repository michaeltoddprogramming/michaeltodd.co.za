// Michael Todd u23540223

var elementToMove = document.querySelector('body');

var portal = document.querySelector('.index-portal');
var bgMusic = document.getElementById('bgMusic');
var portalClick = document.getElementById('portalClick');
bgMusic.play();

portal.addEventListener('click', function(event) {
    event.preventDefault();
    portalClick.play(); // Play the portal click sound

    Swal.fire({
        title: 'You are about to get closer to the portal, be careful!',
        background: 'green',
        confirmButtonText: 'OK',
        customClass: {
            title: 'my-title-class',
            content: 'my-content-class',
            confirmButton: 'my-confirm-button-class'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            document.body.classList.add('fade-out');
            setTimeout(function() {
                window.location.href = 'portal.html';
            }, 0);
        }
    });
});



setTimeout(function() {
    var arrows = document.querySelectorAll('.arrow');
    arrows.forEach(function(arrow) {
        arrow.style.display = 'block';
    });
    document.querySelector('h1').textContent = 'Oh! Look theres arrows, maybe we can move around using the arrow keys?';
}, 1000);

document.addEventListener('keydown', function(event) {
    var scrollDistance = 25; 
    switch (event.key) {
        case "ArrowUp":
            window.scrollTo({ top: window.scrollY - scrollDistance, behavior: 'smooth' });
            break;
        case "ArrowDown":
            window.scrollTo({ top: window.scrollY + scrollDistance, behavior: 'smooth' });
            break;
        case "ArrowLeft":
            window.scrollTo({ left: window.scrollX - scrollDistance, behavior: 'smooth' });
            break;
        case "ArrowRight":
            window.scrollTo({ left: window.scrollX + scrollDistance, behavior: 'smooth' });
            break;
        default:
            console.log("Other key pressed");
    }
});
