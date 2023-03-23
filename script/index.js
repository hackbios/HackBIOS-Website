window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 23);
    }
  );
})();

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("resize", function () {
    document
      .getElementById("playArea")
      .setAttribute("width", document.getElementById("home").clientWidth);
    document
      .getElementById("playArea")
      .setAttribute("height", document.getElementById("home").clientHeight);
    width = document.getElementById("home").clientWidth;
    height = document.getElementById("home").clientHeight;
  });

  window.dispatchEvent(new Event("resize"));
});

var Point = function () {
  this._size = 0.5;
  this._x = 0;
  this._y = 0;
  this._direction = 0;
  this._velocity = 0;
  this._distances = [];
  this._neighboors = [];
  this._randomization = 0;

  this.__collection = null;

  this._step = function (aCollection) {
    var modifiedVelocity =
      this._velocity * 1 * ((Math.random() * this._randomization + 1) / 10);
    var direction = (Math.random() * 2) % 2 > 1 ? -1 : 1;

    this._direction =
      this._direction * 1 + Math.random() * this._randomization * direction;
    var radianAngle = (this._direction * Math.PI) / 180;

    this._x = this._x * 1 + modifiedVelocity * Math.cos(radianAngle) * 1;
    this._y = this._y * 1 + modifiedVelocity * Math.sin(radianAngle) * 1;

    if (this._x > width) this._x = 0;
    if (this._x < 0) this._x = width;
    if (this._y > height) this._y = 0;
    if (this._y < 0) this._y = height;

    this.__collection = aCollection;
  };

  this._computeNeighboors = function () {
    if (this.__collection == null) return;

    aCollection = this.__collection;
    //compute the closest neighboor
    this._distances = [];
    for (i = 0; i < aCollection.length; i++) {
      if (aCollection[i]._x != this._x && aCollection[i]._y != this._y) {
        this._distances.push({
          pointIndex: i,
          pointObj: aCollection[i],
          distance: Math.sqrt(
            Math.pow(this._x - aCollection[i]._x, 2) +
              Math.pow(this._y - aCollection[i]._y, 2)
          ),
        });
      }
    }
    this._distances.sort(function (a, b) {
      defaultReturn = 0;
      if (a.distance < b.distance) defaultReturn = -1;
      if (a.distance > b.distance) defaultReturn = 1;
      return defaultReturn;
    });

    this._neighboors = this._distances.slice(0, 3);
  };

  this.draw = function (context) {
    this._computeNeighboors();

    //draw connection lines

    context.lineWidth = 0.25;
    context.strokeStyle = "#666";

    context.beginPath();
    for (i = 0; i < this._neighboors.length; i++) {
      context.moveTo(this._x, this._y);
      context.lineTo(
        this._neighboors[i].pointObj._x,
        this._neighboors[i].pointObj._y
      );

      context.lineWidth = 0.1 + 5 / this._neighboors[i].distance;
    }
    context.closePath();

    context.stroke();

    context.beginPath();
    context.arc(
      this._x,
      this._y,
      this._size * this._velocity,
      0,
      2 * Math.PI,
      false
    );
    context.fillStyle = "#e1ebdcff";

    context.strokeStyle = "#666";
    context.lineWidth = 0.5;
    context.fill();
    context.stroke();

    context.beginPath();
    context.arc(this._x, this._y, this._size, 0, 2 * Math.PI, false);
    context.fillStyle = "#666";
    context.fill();

    //    ctx.fillText(this._direction.toFixed(2), this._x, this._y);
  };
};

var aPoints = [];
var can, ctx, interval, width, height;

//points
const screenw = window.screen.availWidth;
console.log(screenw);
var numPoints = 30;
if (screenw < 672) {
  numPoints = 15;
}
if (screenw < 400) {
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

  for (x = 0; x < numPoints; x++) {
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

function animate() {
  for (x = 0; x < numPoints; x++) {
    aPoints[x]._step(aPoints);
  }
  requestAnimFrame(animate);
  draw();
}

function draw() {
  ctx.save();

  ctx.clearRect(0, 0, width, height);

  for (x = 0; x < numPoints; x++) {
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
};
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
accOne.addEventListener("click", () => {
  ansOne.classList.toggle("open-accordian");
  plusOne.classList.toggle("rotate-plus");
});

const accTwo = document.querySelector("#question2");
const ansTwo = document.querySelector(".ans-two");
const plusTwo = document.querySelector("#plus-two");
accTwo.addEventListener("click", () => {
  ansTwo.classList.toggle("open-accordian");
  plusTwo.classList.toggle("rotate-plus");
});

const accThree = document.querySelector("#question3");
const ansThree = document.querySelector(".ans-three");
const plusThree = document.querySelector("#plus-three");
accThree.addEventListener("click", () => {
  ansThree.classList.toggle("open-accordian");
  plusThree.classList.toggle("rotate-plus");
});

const accFour = document.querySelector("#question4");
const ansFour = document.querySelector(".ans-four");
const plusFour = document.querySelector("#plus-four");
accFour.addEventListener("click", () => {
  ansFour.classList.toggle("open-accordian");
  plusFour.classList.toggle("rotate-plus");
});

const accFive = document.querySelector("#question5");
const ansFive = document.querySelector(".ans-five");
const plusFive = document.querySelector("#plus-five");
accFive.addEventListener("click", () => {
  ansFive.classList.toggle("open-accordian");
  plusFive.classList.toggle("rotate-plus");
});

const accSix = document.querySelector("#question6");
const ansSix = document.querySelector(".ans-six");
const plusSix = document.querySelector("#plus-six");
accSix.addEventListener("click", () => {
  ansSix.classList.toggle("open-accordian");
  plusSix.classList.toggle("rotate-plus");
});

const accSeven = document.querySelector("#question7");
const ansSeven = document.querySelector(".ans-seven");
const plusSeven = document.querySelector("#plus-seven");
accSeven.addEventListener("click", () => {
  ansSeven.classList.toggle("open-accordian");
  plusSeven.classList.toggle("rotate-plus");
});

const accEight = document.querySelector("#question8");
const ansEight = document.querySelector(".ans-eight");
const plusEight = document.querySelector("#plus-eight");
accEight.addEventListener("click", () => {
  ansEight.classList.toggle("open-accordian");
  plusEight.classList.toggle("rotate-plus");
});

const accNine = document.querySelector("#question9");
const ansNine = document.querySelector(".ans-nine");
const plusNine = document.querySelector("#plus-nine");
accNine.addEventListener("click", () => {
  ansNine.classList.toggle("open-accordian");
  plusNine.classList.toggle("rotate-plus");
});

const accTen = document.querySelector("#question10");
const ansTen = document.querySelector(".ans-ten");
const plusTen = document.querySelector("#plus-ten");
accTen.addEventListener("click", () => {
  ansTen.classList.toggle("open-accordian");
  plusTen.classList.toggle("rotate-plus");
});

const accEleven = document.querySelector("#question11");
const ansEleven = document.querySelector(".ans-eleven");
const plusEleven = document.querySelector("#plus-eleven");
accEleven.addEventListener("click", () => {
  ansEleven.classList.toggle("open-accordian");
  plusEleven.classList.toggle("rotate-plus");
});

const accTwelve = document.querySelector("#question12");
const ansTwelve = document.querySelector(".ans-twelve");
const plusTwelve = document.querySelector("#plus-twelve");
accTwelve.addEventListener("click", () => {
  ansTwelve.classList.toggle("open-accordian");
  plusTwelve.classList.toggle("rotate-plus");
});

//tracks

const tracksflipcard = document.querySelectorAll(".flip-card-front");
// console.log(tracksflipcard);
for (let i = 0; i < tracksflipcard.length; i++) {
  tracksflipcard[i].addEventListener("click", () => {
    var e = document.querySelectorAll(".flip-card-inner");
    console.log(e[i].style);
    if (e[i].style.transform == "") {
      e[i].style.transform = "rotateY(180deg)";
    } else {
      e[i].style.transform = "";
    }
    //
    // tracksflipcard[i].target.style.color = "white";
  });
}
const tracksflipcardBack = document.querySelectorAll(
  ".flip-card-back "
);
// console.log(tracksflipcardBack);
for (let i = 0; i < tracksflipcardBack.length; i++) {
  tracksflipcardBack[i].addEventListener("click", () => {
    var e = document.querySelectorAll(".flip-card-inner");
    console.log(e[i].style);
    if (e[i].style.transform == "") {
      e[i].style.transform = "rotateY(180deg)";
    } else {
      e[i].style.transform = "";
    }
    //
    // tracksflipcardBack[i].target.style.color = "white";
  });
}

// Click function for show the Modal

const showProblem1Button = document.querySelectorAll(".show-problem1-modal");
const showProblem2Button = document.querySelectorAll(".show-problem2-modal");
const showProblem3Button = document.querySelectorAll(".show-problem3-modal");
const showProblem4Button = document.querySelectorAll(".show-problem4-modal");
const showProblem5Button = document.querySelectorAll(".show-problem5-modal");
const showProblem6Button = document.querySelectorAll(".show-problem6-modal");
const mask1 = document.querySelector(".problem1-modal");
const mask2 = document.querySelector(".problem2-modal");
const mask3 = document.querySelector(".problem3-modal");
const mask4 = document.querySelector(".problem4-modal");
const mask5 = document.querySelector(".problem5-modal");
const mask6 = document.querySelector(".problem6-modal");

showProblem1Button.forEach(function (button) {
  button.addEventListener("click", function () {
    mask1.classList.add("modal-active");
  });
});

showProblem2Button.forEach(function (button) {
  button.addEventListener("click", function () {
    mask2.classList.add("modal-active");
  });
});

showProblem3Button.forEach(function (button) {
  button.addEventListener("click", function () {
    mask3.classList.add("modal-active");
  });
});

showProblem4Button.forEach(function (button) {
  button.addEventListener("click", function () {
    mask4.classList.add("modal-active");
  });
});
showProblem5Button.forEach(function (button) {
  button.addEventListener("click", function () {
    mask5.classList.add("modal-active");
  });
});

showProblem6Button.forEach(function (button) {
  button.addEventListener("click", function () {
    mask6.classList.add("modal-active");
  });
});
// Function for close the Modal

function closeModal() {
  mask1.classList.remove("modal-active");
  mask2.classList.remove("modal-active");
  mask3.classList.remove("modal-active");
  mask4.classList.remove("modal-active");
  mask5.classList.remove("modal-active");
  mask6.classList.remove("modal-active");
}

// Call the closeModal function on the clicks/keyboard
const closeButtons = document.querySelectorAll(".modal-close, .modal-mask");

closeButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    closeModal();
  });
});

document.addEventListener("keyup", function (e) {
  if (e.keyCode == 27) {
    closeModal();
  }
});

const nav_ham = document.querySelector(".nav-ham");
const nav_ham_slide = document.querySelector(".nav-slide");
nav_ham.addEventListener("click", function () {
  this.classList.toggle("is-active");
  nav_ham_slide.classList.toggle("is-active");
});

//schedule
const TL_switch = document.querySelectorAll(".TL-switch")[0].children;
for (var i = 0; i < TL_switch.length; i++) {
  const j = i;
  const s = document.querySelectorAll(".timeline-W");
  TL_switch[i].addEventListener("click", () => {
    if (!s[j].classList.contains("timeline-active")) {
      s[j].classList.add("timeline-active");
      s[(j + 1) % 2].classList.remove("timeline-active");
      TL_switch[j].classList.add("TL-day-active");
      TL_switch[(j + 1) % 2].classList.remove("TL-day-active");
    }
  });
}
