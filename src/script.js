import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// PLUGIN GSAP
gsap.registerPlugin(ScrollTrigger)

// VARIABLES
const spriteIdle = document.querySelector('.idle');
const spriteWalk1 = document.querySelector('.walk1');
const spriteWalk2 = document.querySelector('.walk2');
let progressInt = 0;
let prevProgressInt = -1;
const bubbleCard1 = document.querySelector('.card-1');
const bubbleCard2 = document.querySelector('.card-2');

// LENIS CONFIG
const lenis = new Lenis({
  // lerp: 0.02
  lerp: 0.035
})

lenis.on('scroll', (e) => {


})




function raf(time) {
  lenis.raf(time)
  ScrollTrigger.update();
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// GSAP CHARACTER ANIMATION
if(window.innerWidth < 900) {
  const charaTl = gsap.timeline({
    scrollTrigger : {
      trigger: ".welcome_section",
      markers: true,
      start: "top 15%",
      end: "bottom 50%",
      scrub: true,
      onUpdate: (self) =>  {
        progressInt = Math.round(self.progress * 10);
        console.log(progressInt.toFixed(4))
        if(progressInt !== prevProgressInt) {
          prevProgressInt = progressInt;

          if(progressInt === 0) {
            spriteIdle.style.visibility = "visible";
            spriteWalk1.style.visibility = "hidden"
            spriteWalk2.style.visibility = "hidden"
            
          }else if (progressInt % 2 === 0 && progressInt !== 0) {
            spriteWalk1.style.visibility = "visible";
            spriteWalk2.style.visibility = "hidden"
            spriteIdle.style.visibility = "hidden"
  
          }else{
            spriteWalk2.style.visibility = "visible"
            spriteWalk1.style.visibility = "hidden"
            spriteIdle.style.visibility = "hidden"
          }
  
          if(progressInt === 10) {
            console.log("coucouc")
            spriteIdle.style.visibility = "visible";
            spriteWalk1.style.visibility = "hidden";
            lenis.stop();
            
          }
          setTimeout(() => {
            lenis.start();
          },2000)
        }
      }
    },

  });

  charaTl.to('.sprite', {
    scaleX: -1,
    duration: 0.001,
  })
  .to('.card-1', {
    ease: "power1.inOut",
    scale: 0, transformOrigin: "100% 0%",
  })
  .to('.sprite', {
    ease: "none",
    y: "20vh",
  })
  .to('.sprite',{
    ease: "none",
    x: "-75vw",
  })
  .to('.sprite', {
    scaleX: 1,
    duration: 0.001,
  })
}

