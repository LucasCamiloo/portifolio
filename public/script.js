 
       
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
       
        const sections = document.querySelectorAll('.section');
        const scrollDots = document.querySelectorAll('.scroll-dot');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop - sectionHeight / 3) {
                    current = section.getAttribute('id');
                }
            });
            
            scrollDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('data-section') === current) {
                    dot.classList.add('active');
                }
            });
            
            
            document.querySelectorAll('.skills-header, .projects-header, .contact-container').forEach(item => {
                const rect = item.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    item.classList.add('visible');
                }
            });
            
            
            document.querySelectorAll('.skill-card, .project-card').forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                }
            });
        });
        
        
        scrollDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const sectionId = dot.getAttribute('data-section');
                document.getElementById(sectionId).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
        
        class Particle {
            constructor(canvas, options) {
                this.canvas = canvas;
                this.x = options.x || Math.random() * canvas.width;
                this.y = options.y || Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = options.color || '#00ff9d';
                this.alpha = Math.random() * 0.5 + 0.05;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > this.canvas.width || this.x < 0) {
                    this.speedX = -this.speedX;
                }
                
                if (this.y > this.canvas.height || this.y < 0) {
                    this.speedY = -this.speedY;
                }
            }
            
            draw(ctx) {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        
        window.addEventListener('load', () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const container = document.getElementById('canvas-container');
            container.appendChild(canvas);
            
            function resizeCanvas() {
                canvas.width = container.offsetWidth;
                canvas.height = container.offsetHeight;
            }
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            
            const particles = [];
            const particleCount = 100;
            
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas, {
                    color: '#00ff9d'
                }));
            }
            
            function connect() {
                for (let a = 0; a < particles.length; a++) {
                    for (let b = a; b < particles.length; b++) {
                        const dx = particles[a].x - particles[b].x;
                        const dy = particles[a].y - particles[b].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 150) {
                            const opacity = 1 - distance / 150;
                            ctx.strokeStyle = `rgba(0, 255, 157, ${opacity * 0.15})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(particles[a].x, particles[a].y);
                            ctx.lineTo(particles[b].x, particles[b].y);
                            ctx.stroke();
                        }
                    }
                }
            }
            
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(particle => {
                    particle.update();
                    particle.draw(ctx);
                });
                
                connect();
                requestAnimationFrame(animate);
            }
            
            animate();
            
            
            canvas.addEventListener('mousemove', e => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                particles.forEach(particle => {
                    const dx = particle.x - x;
                    const dy = particle.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 150;
                    
                    if (distance < maxDistance) {
                        const force = maxDistance / distance;
                        const directionX = dx / distance;
                        const directionY = dy / distance;
                        particle.speedX = directionX * force * 0.02;
                        particle.speedY = directionY * force * 0.02;
                    }
                });
            });
        });