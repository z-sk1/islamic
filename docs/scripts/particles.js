document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");

  const mouse = {
    x: null,
    y: null,
    radius: 100,
  };

  const texture = new Image();
  texture.src = "assets/particle.png";

  const finalSettings = {
    speed: 100,
    size: 500,
    maxParticles: 10000,
  };

  window.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });

  window.addEventListener("click", function (event) {
    for (let i = 0; i < 10; i++) {
      addParticle(mouse.x, mouse.y);
    }
  });

  const controls = document.querySelectorAll("button, a, input[type='range']"); // all buttons/links
  controls.forEach((el) => {
    el.addEventListener("click", (e) => e.stopPropagation());

    el.addEventListener("input", (e) => e.stopPropagation());
  });

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  let particles = [];

  class Particle {
    constructor(x = null, y = null) {
      this.x = x !== null ? x : Math.random() * canvas.width;
      this.y = y !== null ? y : Math.random() * canvas.height;
      this.baseSize = Math.random() * 7 + 1;
      this.speedX = Math.random() - 0.5;
      this.speedY = Math.random() - 0.5;
      this.image = texture;
      this.angle = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    }

    update() {
      this.x += this.speedX * (finalSettings.speed / 100);
      this.y += this.speedY * (finalSettings.speed / 100);

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

      // react to mouse
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        let angle = Math.atan2(dy, dx);
        let force = (mouse.radius - dist) / mouse.radius;
        this.x -= Math.cos(angle) * force * 3;
        this.y -= Math.sin(angle) * force * 3;
      }
    }

    draw() {
      const size = this.baseSize * (finalSettings.size / 100);

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      ctx.drawImage(this.image, -size / 2, -size / 2, size, size);

      ctx.restore();

      this.angle += this.rotationSpeed;
    }
  }

  function addParticle(x, y) {
    if (particles.length >= finalSettings.maxParticles) particles.shift();
    particles.push(new Particle(x, y));
  }

  function init() {
    particles = [];
    for (let i = 0; i < 2000; i++) {
      addParticle(Math.random() * canvas.width, Math.random() * canvas.height);
    }
  }
  init();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (particles.length >= finalSettings.maxParticles) {
      particles.length = finalSettings.maxParticles;
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
});
