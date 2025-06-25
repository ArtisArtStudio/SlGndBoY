(window.onload = function() {
var inputLtc = document.getElementById("Surname");
//var sharebtn = document.getElementById("sharebtn");
var add = "https://artisartstudio.github.io/BScrtchffGFdy/index.html?surname="
inputLtc.addEventListener('keyup',OnKeyUp);
var inputBtc = document.getElementById("address");
inputBtc.textContent = add;
document.addEventListener("mousedown",function(e){
   var target = e.target;
   //if((target.contains(inputBtc) || target.contains(sharebtn)) && !inputLtc.value){
   var surname = inputLtc.value;
   console.log(surname.replace(/\s/g, '').length);
   if(target.contains(inputBtc) && (!inputLtc.value || surname.replace(/\s/g, '').length==0)){
      //console.log("click");
      window.alert("Please enter a valid surname!");
      inputBtc.style.pointerEvents = "none";
      sharebtn.disabled =true;
   } 
});
var constantNumber = 2;

function OnKeyUp(e) {
   var result = inputLtc.value;
   if (result){
      result = add + result.charAt(0).toUpperCase() + result.slice(1);
      //sharebtn.disabled =false;
      inputBtc.style.pointerEvents = "auto";

   } else {
      result=add;
      //sharebtn.disabled =true;
      inputBtc.style.pointerEvents = "none";

   }
   inputBtc.textContent = result;
   inputBtc.href= result;
};


// $("#emailLinkbtn").on("click", function(){
//    txt_email = $("#emailSendLink").val()
//    txt_link = $("#address").text()
//    txt_surname = $("#Surname").val()
//    $("#modalClose").trigger("click")
//    var mail = document.createElement("a");
//    mail.href = `mailto:${txt_email}?subject=Your link for ${txt_surname}-baby scratch off card&body=${txt_link}`;
//    mail.click();
//    alert(`The link ${txt_link} is sent to ${txt_email}`)
//  })
 });