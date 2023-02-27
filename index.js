window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 23);
          };
})();

document.addEventListener("DOMContentLoaded", function() {
window.addEventListener("resize", function(){
  document.getElementById("playArea").setAttribute("width",document.getElementById("home").clientWidth);
  document.getElementById("playArea").setAttribute("height",document.getElementById("home").clientHeight);
        width = document.getElementById("home").clientWidth;
        height =document.getElementById("home").clientHeight;
})

window.dispatchEvent(new Event('resize'));
});

var Point = function(){
  this._size = 0.5;
  this._x = 0;
  this._y = 0;
  this._direction = 0;
  this._velocity = 0;
  this._distances = [];
  this._neighboors = [];
  this._randomization = 0;

  this.__collection = null;
  
  
  this._step = function(aCollection){

    var modifiedVelocity = this._velocity*1 * ((Math.random() * this._randomization+1)/10);
    var direction = (Math.random()*2%2 >1)?-1:1;

    this._direction =  this._direction*1 + ((Math.random() * this._randomization) * direction);
    var radianAngle = this._direction * Math.PI / 180;

    
    this._x = (this._x * 1) + (modifiedVelocity * Math.cos(radianAngle) * 1);
    this._y = (this._y * 1) + (modifiedVelocity * Math.sin(radianAngle) * 1);

    if(this._x > width) this._x = 0;
    if(this._x < 0) this._x = width;
    if(this._y > height) this._y = 0;
    if(this._y < 0) this._y = height;
 
    this.__collection = aCollection;
    

  }
  
  this._computeNeighboors = function() {
    if(this.__collection == null)  return;

    aCollection = this.__collection;
    //compute the closest neighboor
    this._distances = [];
    for(i=0; i < aCollection.length; i++){
      
      if(aCollection[i]._x != this._x &&
         aCollection[i]._y != this._y){


        this._distances.push({
          pointIndex: i,
          pointObj: aCollection[i],
          distance: Math.sqrt( 
            Math.pow((this._x - aCollection[i]._x), 2) + 
            Math.pow((this._y - aCollection[i]._y), 2)
          )
        });
      }
    }
    this._distances.sort(function(a,b){ 
      defaultReturn = 0;
      if(a.distance < b.distance) defaultReturn = -1;
      if(a.distance > b.distance) defaultReturn = 1;
      return defaultReturn

    });
    
    this._neighboors = this._distances.slice(0,3);
  }

  
  this.draw = function(context){
    this._computeNeighboors();
    
    //draw connection lines
    
    context.lineWidth = 0.25;
    context.strokeStyle = '#666';
    
    context.beginPath();    
    for(i=0; i<this._neighboors.length; i++) {

        context.moveTo(this._x, this._y);
        context.lineTo(this._neighboors[i].pointObj._x,   this._neighboors[i].pointObj._y);
      
        context.lineWidth = 0.10 + 5 / this._neighboors[i].distance;
    }
    context.closePath();

    context.stroke();
    
    context.beginPath();
    context.arc(this._x, this._y, this._size*this._velocity, 0, 2 * Math.PI, false);
    context.fillStyle = '#e1ebdcff';
    
    context.strokeStyle = '#666';
    context.lineWidth = 0.5;
    context.fill();
    context.stroke();
    
    context.beginPath();
    context.arc(this._x, this._y, this._size, 0, 2 * Math.PI, false);
    context.fillStyle = '#666';
    context.fill();
    
//    ctx.fillText(this._direction.toFixed(2), this._x, this._y);
    
  }
}


var aPoints = [];
var can, ctx, interval, width, height;

//points 
const screenw = window.screen.availWidth;
console.log(screenw);
var numPoints = 30;
if(screenw < 672){
  numPoints = 15;
}
if(screenw < 400){
  numPoints = 10;
}


/* var distanceTreshold = 100; */

function init() {
  can = document.getElementById("playArea");
  ctx = can.getContext("2d");
  height = document.getElementById("home").clientHeight;
  width = document.getElementById("home").clientWidth;

  ww = document.getElementById("home-section").clientHeight;
  // console.log('d',height);

  // width = document.getElementById('home').

  for(x=0; x<numPoints; x++){
    var newPoint = new Point();
    newPoint._size = (Math.random() * (3 - 0.5) + 0.5).toFixed(2);
    newPoint._x = (Math.random() * width).toFixed(0);
    newPoint._y = (Math.random() * height).toFixed(0);
    newPoint._direction = (Math.random() * 360).toFixed(2);
    newPoint._velocity = (Math.random() * (4 - 0.1) + 0.2).toFixed(2);
    newPoint._randomization = (Math.random() * (10 - 0) + 0).toFixed(2);
    aPoints.push(newPoint);
  }

  animate();
}

function animate(){
  for(x=0; x<numPoints; x++){
    aPoints[x]._step(aPoints);
  }
  requestAnimFrame( animate );
  draw();
}

function draw(){
  ctx.save();

  ctx.clearRect(0,0,width,height);
  
  for(x=0; x<numPoints; x++){
    aPoints[x].draw(ctx);
  }
  
  ctx.restore();
}

init();








//ayush


const preventScroll = (e) => {
  e.preventDefault();
  e.stopPropagation();

  return false;
}
// const menu_btn = document.querySelector('.menu-btn');
// const navigation = document.querySelector('.navigation');
// const navbar = document.querySelector('.navbar'); //just to prevent schroll behavior
// let menuOpen = false;
// menu_btn.addEventListener("click",()=>{
//   if(!menuOpen){
//       menu_btn.classList.add("open");
//       navigation.classList.add("hamburger");
//       navbar.addEventListener("wheel", preventScroll);
//       menuOpen = true;
//   }
//   else{
//       menu_btn.classList.remove("open");
//       navigation.classList.remove("hamburger");
//       menuOpen = false;
//   }
// });

// navigation.addEventListener("click", () =>{
//   menu_btn.classList.remove("open");
//       navigation.classList.remove("hamburger");
//       menuOpen = false;
// })


// toggle accordian
const accOne = document.querySelector("#question1");
const ansOne = document.querySelector(".ans-one");
const plusOne = document.querySelector("#plus-one");
accOne.addEventListener("click", () =>{
  ansOne.classList.toggle('open-accordian');
  plusOne.classList.toggle('rotate-plus');
})

const accTwo = document.querySelector("#question2");
const ansTwo = document.querySelector(".ans-two");
const plusTwo = document.querySelector("#plus-two");
accTwo.addEventListener("click", () =>{
  ansTwo.classList.toggle('open-accordian');
  plusTwo.classList.toggle('rotate-plus');
})

const accThree = document.querySelector("#question3");
const ansThree = document.querySelector(".ans-three");
const plusThree = document.querySelector("#plus-three");
accThree.addEventListener("click", () =>{
  ansThree.classList.toggle('open-accordian');
  plusThree.classList.toggle('rotate-plus');
})

const accFour = document.querySelector("#question4");
const ansFour = document.querySelector(".ans-four");
const plusFour = document.querySelector("#plus-four");
accFour.addEventListener("click", () =>{
  ansFour.classList.toggle('open-accordian');
  plusFour.classList.toggle('rotate-plus');
})

const accFive = document.querySelector("#question5");
const ansFive = document.querySelector(".ans-five");
const plusFive = document.querySelector("#plus-five");
accFive.addEventListener("click", () =>{
  ansFive.classList.toggle('open-accordian');
  plusFive.classList.toggle('rotate-plus');
})

const accSix = document.querySelector("#question6");
const ansSix = document.querySelector(".ans-six");
const plusSix = document.querySelector("#plus-six");
accSix.addEventListener("click", () =>{
  ansSix.classList.toggle('open-accordian');
  plusSix.classList.toggle('rotate-plus');
})



//tracks


const tracksflipcard = document.querySelectorAll('.flip-card');
// console.log(tracksflipcard);
for (let i = 0; i < tracksflipcard.length; i++) {

    tracksflipcard[i].addEventListener('click',()=>{
      var e = document.querySelectorAll('.flip-card-inner');
      console.log(e[i].style);
      if(e[i].style.transform == ""){
          e[i].style.transform = "rotateY(180deg)";
      }else{
        e[i].style.transform = "";
      }
      //
      // tracksflipcard[i].target.style.color = "white";

    });
}

const nav_ham = document.querySelector(".nav-ham");
    const nav_ham_slide = document.querySelector(".nav-slide");
    nav_ham.addEventListener("click", function () {
      this.classList.toggle("is-active");
      nav_ham_slide.classList.toggle("is-active");
    });



    //schedule
const TL_switch = document.querySelectorAll('.TL-switch')[0].children;
for(var i = 0;i<TL_switch.length;i++){
  const j = i;
  const s = document.querySelectorAll('.timeline-W');
  TL_switch[i].addEventListener('click',()=>{

    if(!s[j].classList.contains('timeline-active')){
      s[j].classList.add('timeline-active');
      s[(j+1)%2].classList.remove('timeline-active');
      TL_switch[j].classList.add('TL-day-active');
      TL_switch[(j+1)%2].classList.remove('TL-day-active');
    }
  })
}