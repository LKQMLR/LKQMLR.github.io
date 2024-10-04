import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// PLUGIN GSAP
gsap.registerPlugin(ScrollTrigger);

// VARIABLES
const spriteIdle = document.querySelector(".idle");
const spriteWalk1 = document.querySelector(".walk1");
const spriteWalk2 = document.querySelector(".walk2");
let progressInt;

// LENIS CONFIG
const lenis = new Lenis({
  // lerp: 0.02
  lerp: 0.035,
});

lenis.on("scroll", (e) => {});

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP CHARACTER ANIMATION
if (window.innerWidth < 900) {
  
  // WELCOME SECTION TIMELINE SETTING
  const welcomeSectionTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".welcome_section",
      // markers: true,
      start: "top 20%",
      end: "bottom 45%",
      scrub: true,
      onUpdate: (self) => {
        progressInt = Math.round(Math.floor(self.progress * 10));
        console.log(progressInt)
        handleCharacterProgress(progressInt);
      },
    },
  });

  // WELCOME TIMELINE
  welcomeSectionTl.to('.sprite', {
    scaleX: "-1",
    duration: "0.001"
  })
  .to('.card-1', {
    ease: "none",
    scale : 0, transformOrigin: "100% 100%",
  })
  .to('.sprite', {
    y: "30vh"
  }, "-=0.5")
  .to('.sprite', {
    x: "-75vw"
  })
  .to('.card-2', {
    ease: "none",
    scale : 1, transformOrigin: "0% 100%"
  })
}

// APROPOS SECTION TIMELINE SETTING
const aproposSectionTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".apropos_section",
    markers: true,
    start: "top 45%",
    end: "bottom 65%",
    scrub: true,
    onUpdate: (self) => {
      progressInt = Math.round(Math.floor(self.progress * 10));
      console.log(progressInt)
      handleCharacterProgress(progressInt);
    }
  }
})
// APROPOS TIMELINE
aproposSectionTl.to('.sprite', {
    scaleX: "1",
    duration: "0.001"
})
.to('.sprite', {
  y: "80vh"
})

// FUNCTION
function handleCharacterProgress(progressInt) {
  if(progressInt === 0) {
    spriteIdle.style.visibility = "visible";
    spriteWalk1.style.visibility = "hidden";
    spriteWalk2.style.visibility = "hidden";
    return;
  }
  if(progressInt === 10) {
    console.log("progressInt vaut 10");
    spriteWalk1.style.visibility = "hidden";
    spriteWalk2.style.visibility = "hidden";
    spriteIdle.style.visibility = "visible";
    lenis.stop();
    timerDelay();
    return;
  }
  if (progressInt % 2 === 0 && progressInt !== 0) {
    spriteWalk1.style.visibility = "visible";
    spriteWalk2.style.visibility = "hidden";
    spriteIdle.style.visibility = "hidden";
    return;
  }else {
    spriteWalk2.style.visibility = "visible";
    spriteWalk1.style.visibility = "hidden";
    spriteIdle.style.visibility = "hidden";
  }
}

function timerDelay() {
  console.log("temps d'attente");
  setTimeout(() => {
    console.log("temps d'attente terminée");
    lenis.start();
  }, 500)
}
