
const params=new URLSearchParams(window.location.search);
const gen=params.get("gen")||"?";
document.getElementById("title").textContent="GÉNÉRATEUR "+gen;

const repairBtn=document.getElementById("repair");
const startBtn=document.getElementById("start");
const sabotageBtn=document.getElementById("sabotage");
const ledRepair=document.getElementById("led-repair");
const ledStart=document.getElementById("led-start");
const ledSabotage=document.getElementById("led-sabotage");
const timerText=document.getElementById("timer");
const progressContainer=document.getElementById("progress-container");
const progressBar=document.getElementById("progress-bar");

const repairSound=new Audio("sounds/repair.mp3");
const startSound=new Audio("sounds/start.mp3");
const sabotageSound=new Audio("sounds/sabotage.mp3");
const activatedSound=new Audio("sounds/activated.mp3");

repairSound.loop=true;
startSound.loop=true;
sabotageSound.loop=true;

let startInterval=null;

function disableAll(){
 repairBtn.disabled=true;
 startBtn.disabled=true;
 sabotageBtn.disabled=true;
}

function activateLed(l,c){
 [ledRepair,ledStart,ledSabotage].forEach(x=>x.classList.remove("active"));
 l.classList.add("active",c);
}

function startProgress(d,cb){
 let t=d;
 progressContainer.style.display="block";
 progressBar.style.width="0%";
 const i=setInterval(()=>{
  t--;
  timerText.textContent=t+"s";
  progressBar.style.width=((d-t)/d)*100+"%";
  if(t<=0){clearInterval(i);cb();}
 },1000);
}

repairBtn.onclick=()=>{
 disableAll();activateLed(ledRepair,"yellow");
 repairSound.play();
 startProgress(60,()=>{
  repairSound.pause();
  startBtn.disabled=false;
  sabotageBtn.disabled=false;
 });
};

startBtn.onclick=()=>{
 disableAll();activateLed(ledStart,"green");
 sabotageBtn.disabled=false;
 startSound.play();
 let t=120;
 startInterval=setInterval(()=>{
  t--;timerText.textContent=t+"s";
  progressBar.style.width=((120-t)/120)*100+"%";
  if(t<=0){
   clearInterval(startInterval);
   startSound.pause();
   activatedSound.play();
   document.body.innerHTML='<div class="green-screen">GÉNÉRATEUR '+gen+' ACTIVÉ</div>';
   setTimeout(()=>{
    const loop=new Audio("sounds/start.mp3");
    loop.loop=true;loop.play();
   },800);
  }
 },1000);
};

sabotageBtn.onclick=()=>{
 if(startInterval)clearInterval(startInterval);
 startSound.pause();
 progressContainer.style.display="none";
 disableAll();activateLed(ledSabotage,"red");
 sabotageSound.play();
 let t=30;
 progressContainer.style.display="block";
 const i=setInterval(()=>{
  t--;timerText.textContent=t+"s";
  progressBar.style.width=((30-t)/30)*100+"%";
  if(t<=0){clearInterval(i);location.reload();}
 },1000);
};
