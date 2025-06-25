/**
 * This file controls the page logic
 *
 * depends on jQuery>=1.7
 */

(function() {
    /**
     * Returns true if this browser supports canvas
     *
     * From http://diveintohtml5.info/
     */

    var color1 = '#ff95c8';
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
    
    
    /**
     * Handle scratch event on a scratcher
     */
    function checkpct() {
        var p = 16;


        if (!triggered) {
            if (pct > 10 && pct < p) {
                //document.getElementById("scratcher3Pct").innerHTML="Scratch MORE!";
                if (CrispyToast.toasts.length===0) {
                    CrispyToast.success('Scratch MORE!', { position: 'top-center', timeout: 2000});
                } 
            }
            if (pct>p) {
                if(CrispyToast.toasts.length!=0){
                    CrispyToast.clearall();
                }
                $('#tboy').show();
                $('#tboy').text(gendertext);
                $('#tboy').css('color',colortxt);
                $('#boy').hide();
                $('.images').hide();
                $('#or').hide();
                $('#girl').hide();
                document.getElementsByTagName("body")[0].style.backgroundColor = color;
                document.getElementsByTagName("body")[0].style.backgroundImage = 'none';
                //document.getElementById("H3").insertAdjacentHTML('afterend', "<h4 id='testtext' style='white-space:normal'> Depending on the product you buy, here it will say either <br> 'It is a Girl!' or 'It is a Boy! with pink or blue background.</h4>");
                $('#this').hide();
                $('#H3').hide();
                $('#H4').hide();
                confetti_effect();
            }
        }
    };
   
   
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    };
    function confetti_effect() {
        if (triggered == true) {
            return;
        }
        if (!nosound) {
            soundHandle.volume = 0.5;
            soundHandle.play();
        }
        triggered = true;
      
            var duration = 10 * 1000;
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
            $("#resetbutton").show();
        }, 10000);
              
     };
    
    /**
     * Reset all scratchers
     */
    function onResetClicked() {
        var i;
        pct = 0;
        CrispyToast.toasts=[];
        $("#resetbutton").hide();
        
        $('#tboy').hide();
        $('#boy').show();
        $('#or').show();
        $('#girl').show();
        $('.images').show();

        document.getElementsByTagName("body")[0].style.backgroundColor = "#ffffff";
        document.getElementsByTagName("body")[0].style.backgroundImage = 'url(images/background.jpg)';
        // document.getElementById('testtext').remove();
        $('#this').show();
        $('#H3').show();
        $('#H4').show();
        triggered = false;
        soundHandle.pause();
        soundHandle.currentTime = 0;    
        return false;
    };
   
    function initPage() {
    
        var i, i1;    
        var barPositions = [];
        var totalIcons = 10; // Number of icons per bar
        var iconHeight = 80;
       // Shuffle bars at the beginning (no animation)
        $('.bar').each(function(index, el) {
            // Random position between 0 and 9
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

        document.getElementById('id01').style.display = 'block';
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
        
           
       
        document.getElementById("resetbutton").style.backgroundColor = colortxt;
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
        // Animate bars on spin button click
 $('#resetbutton').on('click', function () {
    var minCycles = 20;
    var maxCycles = 50;
    var stopPositions = [0, 5];
    var finalStop = stopPositions[Math.floor(Math.random() * stopPositions.length)];
    console.log('Final stop: ' + finalStop);

   function animateBarSequentially(index) {
    if (index >= $('.bar').length) {
        // Save the original background
        var $bars = $('.bars');
        var originalBg = $bars.css('background');
        // Remove the gradient and flash pink
        $bars.css('background', 'none').addClass('flash-pink');
        setTimeout(function() {
            //$bars.removeClass('flash-pink');
            // Restore the original background
            //$bars.css('background', originalBg);
        }, 1200); // 0.3s * 4 cycles = 1.2s
        return;
    }
    var el = $('.bar').eq(index);
    var startIndex = barPositions[index];
    barPositions[index] = finalStop;

    var cycles = Math.floor(Math.random() * (maxCycles - minCycles + 1)) + minCycles;
    var stepsToTarget = ((finalStop - startIndex + totalIcons) % totalIcons);
    var totalSteps = cycles * totalIcons + stepsToTarget;

    var currentPosPx = (startIndex * iconHeight) - iconHeight;
    var targetPosPx = (finalStop * iconHeight) + iconHeight + (cycles * totalIcons * iconHeight);

    var duration = 1200;

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
});
    };
    
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
