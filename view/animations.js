// Show the meteo's banner
function showMeteo() {
  let showMeteoAnimation = anime.timeline()
    .add({
      targets: '.meteo .meteo-letter',
      scale: [0, 1],
      duration: 2500,
      elasticity: 600,
      delay: (el, i) => 45 * (i + 1)
    });
  document.querySelector(".meteo").style.display = "block";
  showMeteoAnimation.restart();
}

// Hide meteo's banner
function hideMeteo() {
  let hideMeteoAnimation = anime.timeline()
    .add({
      targets: '.meteo-letter ',
      easing: 'easeInOutSine',
      translateY: -300,
      duration: 500,
      begin: function () {
        setTimeout(function () {
           document.querySelector(".meteo").style.display = "none";
        }, 500);
      }
    })
    hideMeteoAnimation.restart();
}

// Hide the error message
function textHide() {
  let textHideAnimation = anime.timeline()
    .add({
      targets: '.error .error-letter',
      opacity: 0,
      duration: 900,
      easing: "easeOutExpo",
      autoplay: false,
      begin: function () {
        setTimeout(function () {
          document.querySelector(".error").style.display = "none";
        }, 1050);
      }
    });
  textHideAnimation.restart();
}

// Show the error message
function textAppear() {
  let textAppearAnimation = anime.timeline()
    .add({
      targets: '.error .error-letter',
      rotateY: [-90, 0],
      duration: 1300,
      opacity: 100,
      delay: (el, i) => 45 * i,
      autoplay: false
    })
    document.querySelector(".error").style.display = "block";
    textAppearAnimation.restart();
}