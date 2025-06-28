/**
 * This file controls the page logic
 *
 * depends on jQuery>=1.7
 */
var barPositions = [];
var totalIcons = 10; // Number of icons per bar
var iconHeight;
var originalbackground;
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
        //document.getElementById("H3").insertAdjacentHTML('afterend', "<h4 id='testtext' style='white-space:normal'> Depending on the product you buy, here it will say either <br> 'It is a Girl!' or 'It is a Boy! with pink or blue background.</h4>");
        $('#H3').css('visibility', 'hidden');
        $('#H4').css('visibility', 'hidden');
        if (!nosound) {
            soundHandle.volume = 0.5;
            soundHandle.play();
        }
        triggered = true;
      
            var duration = 7 * 1000;
             var end = Date.now() + duration;
             var defaults = { startVelocity: 10, spread: 360, ticks: 70, zIndex: 0 };
             var particleCount = 5 ;
             (function frame() {
             // launch a few confetti from the left edge
             confetti({...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: [colortxt]}
             );
             // and launch a few from the right edge
             confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },colors: [colortxt] }
             );
          
             // keep going until we are out of time
             if (Date.now() < end) {
                 requestAnimationFrame(frame);
                 
                 return;
             }
            }());
          
        setTimeout(function(){
            $("#resetbutton").val('Start Again');
            $("#resetbutton").css('visibility', 'visible');
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
        $('#H4').css('visibility', 'visible');
        triggered = false;
        soundHandle.pause();
        soundHandle.currentTime = 0;    
        return false;
    };
   
    function initPage() {
        var i, i1;
        originalbackground = $('.bars').css('background-image');    
        // Calculate scaling ratio based on .bars max-width (300px) and image width (80px)
        const bars = document.querySelector('.bars');
        const bar = document.querySelector('.bar');
        // .bar width is flex: 1 1 0, so for 3 bars: (300px - 2*margin) / 3
        // We'll use offsetWidth for actual rendered width
        const style = getComputedStyle(bar);
        const border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
        const barWidth = bar.getBoundingClientRect().width;
        iconHeight = barWidth-border; // or just barWidth if icons are square        console.log('iconHeight:'+ iconHeight+" "+ bar.offsetWidth);

        // Shuffle bars at the beginning (no animation)
        $('.bar').each(function(index, el) {
            var pos = Math.floor(Math.random() * totalIcons);
            barPositions[index] = pos;
            // Set background position so that 'pos' is in the middle
            $(el).css('background-position-y', ((pos * iconHeight) - iconHeight) + 'px');
        });
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
function spinBars() {
  return new Promise((resolve) => {
    // Start spin animation for each bar
    // For example, using setTimeout to simulate spin duration
    // Replace this with your actual spin logic and callback
    // Animate bars on spin button click
    var minCycles = 20;
    var maxCycles = 50;
    var stopPositions = [0, 5];
    var spinDuration = 7000; // Change this value to control spin length
    var finalStop = stopPositions[Math.floor(Math.random() * stopPositions.length)];

   function animateBarSequentially(index) {
    
    var el = $('.bar').eq(index);
    var startIndex = barPositions[index];
    barPositions[index] = finalStop;

    var cycles = Math.floor(Math.random() * (maxCycles - minCycles + 1)) + minCycles;
    var stepsToTarget = ((finalStop - startIndex + totalIcons) % totalIcons);
    var totalSteps = cycles * totalIcons + stepsToTarget;

    var currentPosPx = (startIndex * iconHeight) - iconHeight;
    var targetPosPx = (finalStop * iconHeight) + iconHeight + (cycles * totalIcons * iconHeight);

      var duration = spinDuration * 0.8; // 80% of total spin time

    $({pos: currentPosPx}).animate({pos: targetPosPx}, {
        duration: duration,
        easing: 'easeOutBack',
        step: function (now) {
            el.css('background-position-y', now + 'px');
        }
    });

    // Start the next bar halfway through this one's animation
    setTimeout(function () {
        animateBarSequentially(index + 1);
    }, duration / 3);
}
    animateBarSequentially(0);
    // Calculate total time: first bar starts at 0, second at duration/3, third at 2*duration/3, etc.
    // Last bar finishes at: (number of bars - 1) * (duration/3) + duration
    var numBars = $('.bar').length;
    var duration = spinDuration * 0.8;
    var totalSpinTime = ((numBars - 1) * (duration / 3)) + duration;

    setTimeout(() => {
      resolve();
    }, totalSpinTime);
  });
}
function flashBars() {
  const bars = document.querySelector('.bars');
  $('.bars').css('background', 'none'); // Remove background image
  bars.classList.add('flash-pink');
  // After animation, remove flash-pink and add flash-pink-done
  setTimeout(() => {
    bars.classList.remove('flash-pink');
    bars.classList.add('flash-pink-done');
  }, 1200); // 0.3s * 4 (duration * iterations)
}

async function onSpinButtonClick() {
  if (triggered) {
    onResetClicked();
    return;
  }
    $("#resetbutton").css('visibility', 'hidden');
    await spinBars();    // Wait for spin to finish
    flashBars();
    // Then start flash animation
    confetti_effect();
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
