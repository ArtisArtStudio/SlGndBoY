/**
 * This file controls the page logic
 *
 * depends on jQuery>=1.7
 */
var barPositions = [];
var totalIcons = 10; // Number of icons per bar
var iconHeight;
var originalbackground;
var stopPositions = [0, 5];

var isSpinning = false;
var spinCancelled = false;
var spinTimeouts = [];
var flashTimeoutId = null;
var confettiFrameId = null;
var confettiCancelled = false;
var confettiTimeoutId = null;
var spinCount = 0;

// Utility: Fisher-Yates shuffle
function shuffleArray(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

(function() {
    /**
     * Returns true if this browser supports canvas
     *
     * From http://diveintohtml5.info/
     */

    var color1 = '#FAADD2FF';
    var color2 = '#5194f8';
    var color3 ='#969696';
    var colortxt1 = '#ff0b9a';
    var colortxt2= '#7FB1ED';
    var colortxt3= '#000000';
    //Select the background color
    var color =color1;
    //Select the text color
    var colortxt = colortxt1;
    var gendertext1 = "It is a Girl!";
    var gendertext2 = "It is a Boy!";
    var gendertext3= "It is a Demo!";
    //Select the gender text
    var gendertext = gendertext1;
    var surname;
    var soundHandle = new Audio();
    var triggered = false;
    var nosound = true;
    var params = new URLSearchParams(window.location.search.slice(1));

    function supportsCanvas() {
        return !!document.createElement('canvas').getContext;
    };
   
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    };
    function confetti_effect() {
        if (triggered == true) {
            return;
        }
        $('#t1').text(gendertext);
        $('#t1').css('color',colortxt);
        document.getElementsByTagName("body")[0].style.backgroundColor = color;
        document.getElementsByTagName("body")[0].style.backgroundImage = 'none';
        $('#H3').css('visibility', 'hidden');
        $('#H4').css('visibility', 'hidden');
        if (!nosound) {
            soundHandle.volume = 0.5;
            soundHandle.play();
        }
        triggered = true;
        confettiCancelled = false;
        var duration = 7 * 1000;
        var end = Date.now() + duration;
        var defaults = { startVelocity: 10, spread: 360, ticks: 70, zIndex: 0 };
        var particleCount = 5 ;
        function frame() {
            if (confettiCancelled) return;
            confetti({...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: [colortxt]});
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },colors: [colortxt] });
            if (Date.now() < end && !confettiCancelled) {
                confettiFrameId = requestAnimationFrame(frame);
            }
        }
        confettiFrameId = requestAnimationFrame(frame);
        if (confettiTimeoutId) {
            clearTimeout(confettiTimeoutId);
            confettiTimeoutId = null;
        }
        confettiTimeoutId = setTimeout(function(){
            $("#resetbutton").val('Start Again');
            $("#resetbutton").css('visibility', 'visible');
            confettiTimeoutId = null;
        }, 7000);
              
     };
    
    /**
     * Reset all scratchers
     */
    function onResetClicked() {
        var i;
        pct = 0;
        CrispyToast.toasts=[];  
        $("#resetbutton").val('Play!');

        $('#t1').html("<span id='boy' style='color:#7FB1ED ;white-space: normal;'>Boy</span><span id='or' style='font-size: 0.6em; color:#424242;white-space: normal;'> or </span><span id='girl' style='color:#ffc0cb;white-space: normal;'>Girl</span>");
        $('.bars').removeClass('flash-pink flash-pink-done');
        $('.bars').css('background', '');
        $('.bars').css('background-image', originalbackground);        
        document.getElementsByTagName("body")[0].style.backgroundColor = "#ffffff";
        document.getElementsByTagName("body")[0].style.backgroundImage = 'url(images/background.jpg)';
        // document.getElementById('testtext').remove();
        $('#H3').css('visibility', 'visible');
        $('#gameText').css('visibility', 'hidden');
        $('#H4').css('visibility', 'visible');
        positionBars(true); // realign to random positions
        triggered = false;
        soundHandle.pause();
        soundHandle.currentTime = 0;    
        return false;
    };
   function forceResetSpin() {
    // Stop all bar animations immediately
    $('.bar').stop(true, true);
    isSpinning = false;
    spinCancelled = true;
    // Clear all spin-related timeouts
    if (Array.isArray(spinTimeouts)) {
      spinTimeouts.forEach(function(id) { clearTimeout(id); });
      spinTimeouts = [];
    }
    // Stop flash animation
    if (flashTimeoutId) {
      clearTimeout(flashTimeoutId);
      flashTimeoutId = null;
    }
    $('.bars').removeClass('flash-pink flash-pink-done');
    // Stop confetti
    confettiCancelled = true;
    if (confettiFrameId) {
      cancelAnimationFrame(confettiFrameId);
      confettiFrameId = null;
    }
    if (confettiTimeoutId) {
      clearTimeout(confettiTimeoutId);
      confettiTimeoutId = null;
    }
    positionBars(false); // realign to last known positions
    $("#resetbutton").css('visibility', 'visible'); 
    onResetClicked(); // reset the game
   }
   function calculatesize() {
        // Calculate scaling ratio based on .bars max-width (300px) and image width (80px)
        if (isSpinning || triggered) {
            forceResetSpin();
            display_dialog("Please wait for the current spin to finish before resizing or changing orientation.");
            return;
        }
        setTimeout(function() {
        const bar = document.querySelector('.bar');
        const style = getComputedStyle(bar);
        const border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
        const barWidth = bar.getBoundingClientRect().width;
        iconHeight = barWidth-border; 
        positionBars(false);
        }, 500);
   }
   function positionBars(randomize) {
       $('.bar').each(function(index, el) {
         if (!randomize) {   
           $(el).css('background-position-y', ((barPositions[index] * iconHeight) - iconHeight) + 'px');
         } else {
           var pos = Math.floor(Math.random() * totalIcons);
           barPositions[index] = pos;
           // Set background position so that 'pos' is in the middle
           $(el).css('background-position-y', ((pos * iconHeight) - iconHeight) + 'px');
         }
       });
   }
    function display_dialog(text) {
        $( "#error" ).text(text);
                    $( function() {
                        $( "#dialog-message" ).dialog({
                            modal: true,
                            width: 'auto',
                            height: 'auto',
                            buttons: {
                                Ok: function() {
                                $( this ).dialog( "close" );
                                }
                            },
                            show: {
                                effect: "highlight",
                                duration: 1000
                              },
                        });
                    });
                    $(".ui-widget-overlay").css({
                        background:"rgb(0, 0, 0)",
                        opacity: ".10 !important",
                        filter: "Alpha(Opacity=10)",
                    });
    }
    function initPage() {
        var i, i1;
        originalbackground = $('.bars').css('background-image');
        $( window ).on({
            orientationchange: function(e) {
                calculatesize();
            },resize: function(e) {
                calculatesize();
            }
        });            
        calculatesize();

        // Shuffle bars at the beginning (no animation)
        positionBars(true);
        surname = params.get('surname');
        if (surname !=null && surname.replace(/\s/g, '').length) {
            $("#baby").text('Baby ' + surname);
        } else {
            $("#baby").text('the Baby');
            document.getElementById('surname').style.fontWeight="normal";
            $('#baby').css('font-weight', 'normal');

        }
        
        //document.getElementById('intro').innerHTML= "This is a gender reveal scratch off for <strong>" + surname + "</strong> family. It contains sound when the gender is revealed. Do you want to continue with sound?";
        document.getElementById('surname').innerHTML= surname;

        //document.getElementById('id01').style.display = 'block';
        $('.nosoundbtn').on("click", function (e) {
            document.getElementById('id01').style.display = 'none';
            nosound = true;
        });
        $('.withsoundbtn').on("click", function (e) {
            document.getElementById('id01').style.display = 'none';
            nosound = false;
            if (soundHandle.currentTime != 0) { return; }
                soundHandle = document.getElementById('soundHandle');  
                soundHandle.autoplay = true;
            soundHandle.muted = false;
                soundHandle.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
                soundHandle.src = 'audio/celebrate.mp3';
                soundHandle.play();
                soundHandle.pause();
        });
        document.addEventListener(
            "visibilitychange",
            function (evt) {
              if (document.visibilityState != "visible") {
                soundHandle.pause();
                    soundHandle.currentTime = 0;
                }
            },
            false,
          );
        // const mediaQueryList = window.matchMedia("(orientation: portrait)");
        // mediaQueryList.addEventListener("change", handleOrientationChange);
        // handleOrientationChange(mediaQueryList);
        
           
       
   // Add cubic easing if not present
        if (!jQuery.easing.easeOutCubic) {
            jQuery.easing.easeOutCubic = function (x, t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            };
        }
        if (!jQuery.easing.easeOutBack) {
            jQuery.easing.easeOutBack = function (x, t, b, c, d, s) {
                if (s === undefined) s =0.5;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            };
        }
     $('#resetbutton').on('click', onSpinButtonClick); 
    
};
function spinBars(allowedStops, uniquePerBar) {
    isSpinning = true;
    spinCancelled = false;
    // Clear any previous timeouts just in case
    if (Array.isArray(spinTimeouts)) {
      spinTimeouts.forEach(function(id) { clearTimeout(id); });
      spinTimeouts = [];
    }
    return new Promise((resolve) => {
        var minCycles = 20;
        var maxCycles = 50;
        var spinDuration = 7000;
        var numBars = $('.bar').length;
        var finalStops;
        if (uniquePerBar) {
          // Shuffle allowedStops and assign one unique stop per bar
          finalStops = shuffleArray(allowedStops).slice(0, numBars);
        } else {
          // All bars land on the same stop
          var stop = allowedStops[Math.floor(Math.random() * allowedStops.length)];
          finalStops = Array(numBars).fill(stop);
        }
        function animateBarSequentially(index) {
            if (spinCancelled) return; // Stop animation chain if cancelled
            if (index >= numBars) return;
            var el = $('.bar').eq(index);
            var startIndex = barPositions[index];
            barPositions[index] = finalStops[index];
            var cycles = Math.floor(Math.random() * (maxCycles - minCycles + 1)) + minCycles;
            var stepsToTarget = ((finalStops[index] - startIndex + totalIcons) % totalIcons);
            // var totalSteps = cycles * totalIcons + stepsToTarget;
            var currentPosPx = (startIndex * iconHeight) - iconHeight;
            var targetPosPx = (finalStops[index] * iconHeight) + iconHeight + (cycles * totalIcons * iconHeight);
            var duration = spinDuration * 0.8;
            $({pos: currentPosPx}).animate({pos: targetPosPx}, {
                duration: duration,
                easing: 'easeOutBack',
                step: function (now) {
                    if (spinCancelled) return false; // Stop animation immediately
                    el.css('background-position-y', now + 'px');
                }
            });
            var timeoutId = setTimeout(function () {
                if (!spinCancelled) animateBarSequentially(index + 1);
            }, duration / 3);
            spinTimeouts.push(timeoutId);
        }
        animateBarSequentially(0);
        var duration = spinDuration * 0.8;
        var totalSpinTime = ((numBars - 1) * (duration / 3)) + duration;
        var resolveTimeoutId = setTimeout(() => {
            if (!spinCancelled) resolve();
        }, totalSpinTime);
        spinTimeouts.push(resolveTimeoutId);
    });
}
function flashBars() {
  const bars = document.querySelector('.bars');
  $('.bars').css('background', 'none'); // Remove background image
  bars.classList.add('flash-pink');
  // After animation, remove flash-pink and add flash-pink-done
  if (flashTimeoutId) {
    clearTimeout(flashTimeoutId);
    flashTimeoutId = null;
  }
  flashTimeoutId = setTimeout(() => {
    bars.classList.remove('flash-pink');
    bars.classList.add('flash-pink-done');
    flashTimeoutId = null;
  }, 1200); // 0.3s * 4 (duration * iterations)
}

async function onSpinButtonClick() {
  if (triggered) {
    onResetClicked();
    spinCount = 0;
    $("#gameText").text("").removeClass('pulsate');
    return;
  }
  $("#resetbutton").css('visibility', 'hidden');
  spinCount = spinCount || 0;
  let isFinalSpin = (spinCount === 2);
  let isFirstSpin = (spinCount === 0);
  let isSecondSpin = (spinCount === 1);
  let allowedStops;
  let uniquePerBar = false;
  // Show spinning message with pulsate effect
  $('#gameText').css('visibility', 'visible');
  $("#gameText").text("🎲 Spinning... The moment of truth! 🎲").addClass('pulsate');
  if (isFinalSpin) {
    allowedStops = stopPositions;
  } else {
    // All possible stops except those in stopPositions
    allowedStops = Array.from({length: totalIcons}, (_, i) => i).filter(i => !stopPositions.includes(i));
    uniquePerBar = true;
  }
  await spinBars(allowedStops, uniquePerBar);
  isSpinning = false;
  $("#gameText").removeClass('pulsate');
  spinCount++;
  if (isFirstSpin) {
    $("#gameText").text("👶 The baby is keeping it a secret! 👶");
    $("#resetbutton").val('Spin Again');
    $("#resetbutton").css('visibility', 'visible');
  } else if (isSecondSpin) {
    $("#gameText").text("🤔 Hmm, mixed signals! Try again! 🤔");
    $("#resetbutton").val('Final Spin');
    $("#resetbutton").css('visibility', 'visible');
  } else if (isFinalSpin) {
    // Do the reveal after a short delay for effect
    setTimeout(() => {
      flashBars();
      confetti_effect();
      $("#gameText").text("");
    }, 500);
    spinCount = 0; // Reset for next game
  }
}
    /**
     * Handle page load
     */
    $(function () {
        if (supportsCanvas()) {
            initPage();
        } else {
            $('#lamebrowser').show();
        }
    });
    
    })();
