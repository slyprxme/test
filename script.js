document.addEventListener("DOMContentLoaded", function () {
  initHeartAnimation();
  initTimer();
  initHeartRain();

  // Heart Animation
  const heartPath = document.querySelector(".heart-path path");
  const heartSolid = document.querySelector(".heart-solid");

  // Create heart drawing timeline
  const heartTimeline = gsap.timeline();

  // 1. Draw heart path
  heartTimeline.fromTo(
    heartPath,
    { strokeDashoffset: 1000 },
    {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.inOut",
    }
  );

  // 2. Reveal solid heart and fade out path
  heartTimeline
    .to(
      heartSolid,
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.5"
    )
    .to(
      heartPath,
      {
        opacity: 0,
        duration: 0.5,
      },
      "-=0.5"
    );

  // 3. Continuous rotation
  // Replace rotation animation with:
  heartTimeline.to(heartSolid, {
    duration: 5,
    repeat: -1,
    ease: "sine.inOut",
    keyframes: [
      { rotationY: 180, scale: 1.1 },
      { rotationY: 360, scale: 1 },
    ],
  });
});

function initHeartAnimation() {
  const container = document.querySelector(".heart-container");

  // Clear any existing SVG
  const existingSvg = container.querySelector(".heart-drawing");
  if (existingSvg) container.removeChild(existingSvg);

  // Create new SVG
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "heart-drawing");
  svg.setAttribute("viewBox", "0 0 200 200");
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.position = "absolute";

  // Create heart path
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M100,36 C120,10 160,20 180,60 C200,100 100,160 100,160 C100,160 0,100 20,60 C40,20 80,10 100,36 Z"
  );

  svg.appendChild(path);
  document.querySelector(".heart-container").prepend(svg);

  const heartSolid = document.querySelector(".heart-solid");
  const drawingPath = document.querySelector(".heart-drawing path");

  // Animation timeline
  const tl = gsap.timeline();

  // 1. Draw the heart path
  tl.fromTo(
    drawingPath,
    { strokeDashoffset: 1000 },
    {
      strokeDashoffset: 0,
      duration: 2.5,
      ease: "power2.inOut",
    }
  );

  // 2. Simultaneously fade in solid heart as drawing completes
  tl.to(
    heartSolid,
    {
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
    },
    "-=1"
  ); // Overlap with drawing animation

  // 3. Fade out drawing path
  tl.to(
    drawingPath,
    {
      opacity: 0,
      duration: 1,
      onComplete: () => svg.remove(),
    },
    "-=0.5"
  );

  // 4. Continuous rotation
  tl.to(heartSolid, {
    rotationY: 360,
    duration: 12,
    repeat: -1,
    ease: "none",
    transformOrigin: "center center",
  });
}
// Enhanced Timer Implementation
function initTimer() {
  const timerDisplay = document.querySelector(".timer-display");
  const startDate = moment("2024-05-02");

  // Create timer units
  const units = [
    { name: "years", label: "Years" },
    { name: "months", label: "Months" },
    { name: "days", label: "Days" },
    { name: "hours", label: "Hours" },
    { name: "minutes", label: "Minutes" },
    { name: "seconds", label: "Seconds" },
  ];

  // Build timer structure
  timerDisplay.innerHTML = units
    .map(
      (unit) => `
        <div class="timer-unit" id="${unit.name}-container">
            <div class="timer-value" id="${unit.name}">0</div>
            <div class="timer-label">${unit.label}</div>
        </div>
    `
    )
    .join("");

  // Previous values
  let prevValues = {};

  // Add floating hearts decoration
  for (let i = 0; i < 8; i++) {
    const heart = document.createElement("div");
    heart.innerHTML = "❤️";
    heart.style.position = "absolute";
    heart.style.fontSize = `${Math.random() * 20 + 15}px`;
    heart.style.opacity = "0.6";
    heart.style.animation = `float ${
      Math.random() * 5 + 5
    }s ease-in-out infinite`;
    heart.style.top = `${Math.random() * 100}%`;
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.zIndex = "1";
    document.querySelector(".timer-container").appendChild(heart);
  }

  function updateTimer() {
    const now = moment();
    const duration = moment.duration(now.diff(startDate));

    const values = {
      years: duration.years(),
      months: duration.months(),
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };

    // Animate changes
    units.forEach((unit) => {
      const element = document.getElementById(unit.name);
      if (prevValues[unit.name] !== values[unit.name]) {
        // Add animation class
        element.classList.add("animating");

        // Update value after slight delay
        setTimeout(() => {
          element.textContent = values[unit.name];
          element.classList.remove("animating");
        }, 150);
      }
    });

    prevValues = values;
  }

  // Update every second
  setInterval(updateTimer, 1000);
  updateTimer();
}

function initHeartRain() {
  const textContainer = document.querySelector(".text-container");
  const heartRain = document.querySelector(".heart-rain");

  const heartStyles = ["❤️", "💖", "💗", "💓"];
  const loveMessages = ["Forever", "Always", "Yours", "Love", "Adore"];

  textContainer.addEventListener("click", function () {
    // Clear previous hearts and activate
    heartRain.innerHTML = "";
    heartRain.classList.add("active");

    // Adjust heart count based on device
    const isMobile = window.innerWidth <= 768;
    const heartCount = isMobile ? 15 : 25; // Fewer hearts on mobile

    const heartPositions = [];

    // Create hearts
    for (let i = 0; i < heartCount; i++) {
      setTimeout(() => {
        createHeart(i, heartPositions, isMobile);
      }, i * (isMobile ? 150 : 120)); // Slower on mobile
    }

    // Schedule burst effects
    setTimeout(
      () => {
        heartPositions.forEach((pos) => {
          createHeartBurst(pos.x, pos.y, pos.color, isMobile);
        });
      },
      isMobile ? 2800 : 3200
    );

    // Smooth fade out
    setTimeout(
      () => {
        heartRain.classList.remove("active");
        setTimeout(() => {
          heartRain.innerHTML = "";
        }, 1200);
      },
      isMobile ? 4000 : 4500
    );
  });

  function createHeart(index, heartPositions, isMobile) {
    const heart = document.createElement("div");
    heart.className = "falling-heart";
    heart.innerHTML = heartStyles[index % heartStyles.length];

    // Size adjustments for mobile
    const size = isMobile ? 18 + Math.random() * 10 : 22 + Math.random() * 12;
    const leftPos = 8 + Math.random() * 84;
    const delay = Math.random() * 0.4;
    const color = `hsl(${330 + Math.random() * 25}, 90%, 65%)`;

    heart.style.left = `${leftPos}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.color = color;

    // Store position
    const finalTop = isMobile ? 80 : 85;
    heartPositions.push({
      x: leftPos,
      y: finalTop,
      color: color,
    });

    // Fewer love notes on mobile
    if (Math.random() > (isMobile ? 0.7 : 0.8)) {
      createLoveNote(leftPos, delay, isMobile);
    }

    heartRain.appendChild(heart);
  }

  function createLoveNote(leftPos, delay, isMobile) {
    const note = document.createElement("div");
    note.className = "love-note";
    note.textContent =
      loveMessages[Math.floor(Math.random() * loveMessages.length)];
    note.style.left = `${Math.max(
      12,
      Math.min(88, leftPos + (Math.random() - 0.5) * 15)
    )}%`;
    note.style.animationDelay = `${delay + 0.3}s`;
    heartRain.appendChild(note);
  }

  function createHeartBurst(xPercent, yPercent, color, isMobile) {
    const burstCount = isMobile ? 4 : 6; // Fewer bursts on mobile
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    const xPos = (xPercent / 100) * containerWidth;
    const yPos = (yPercent / 100) * containerHeight;

    for (let i = 0; i < burstCount; i++) {
      const mini = document.createElement("div");
      mini.className = "mini-heart";
      mini.innerHTML = "❤️";
      mini.style.left = `${xPos}px`;
      mini.style.top = `${yPos}px`;
      mini.style.color = color;

      const distance = isMobile ? 40 : 60;
      const angle = (i / burstCount) * Math.PI * 2;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      mini.style.setProperty("--end-x", `${endX}px`);
      mini.style.setProperty("--end-y", `${endY}px`);

      heartRain.appendChild(mini);

      setTimeout(() => {
        if (mini.parentNode) mini.remove();
      }, 1800);
    }
  }
}

// Add resize listener to handle orientation changes
window.addEventListener("resize", function () {
  // Re-initialize heart rain if needed
  if (document.querySelector(".heart-rain.active")) {
    document.querySelector(".heart-rain").innerHTML = "";
  }
});
