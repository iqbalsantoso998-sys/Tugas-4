const tiltElements = document.querySelectorAll('.tilt-element');

tiltElements.forEach((element) => {
    element.addEventListener('mousemove', (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -15;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 15;

        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        element.style.transition = 'transform 0.5s ease';
    });

    element.addEventListener('mouseenter', () => {
        element.style.transition = 'transform 0.1s ease';
    });
});

const canvas = document.getElementById('bg-canvas');

if (canvas) {
    const context = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let index = 0; index < particleCount; index += 1) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            alpha: Math.random() * 0.7 + 0.3
        });
    }

    function drawParticles() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let first = 0; first < particleCount; first += 1) {
            for (let second = first + 1; second < particleCount; second += 1) {
                const deltaX = particles[first].x - particles[second].x;
                const deltaY = particles[first].y - particles[second].y;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                if (distance < 130) {
                    context.beginPath();
                    context.moveTo(particles[first].x, particles[first].y);
                    context.lineTo(particles[second].x, particles[second].y);
                    context.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - distance / 130)})`;
                    context.lineWidth = 1;
                    context.stroke();
                }
            }
        }

        particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            context.fillStyle = `rgba(0, 240, 255, ${particle.alpha})`;
            context.shadowBlur = 10;
            context.shadowColor = '#00f0ff';
            context.fill();
        });

        window.requestAnimationFrame(drawParticles);
    }

    drawParticles();
}
