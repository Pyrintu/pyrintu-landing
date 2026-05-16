document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader Logic
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            // Start hero animation after loader
            document.querySelector('#hero').classList.add('revealed');
            document.querySelector('.hero-logo').style.opacity = '1';
        }, 1000);
    });

    // 1.1 Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        // Smooth lerping for cursor
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px)`;

        // Even smoother lerping for follower
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;

        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover effects for cursor
    document.querySelectorAll('a, button, .badge').forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.style.transform += ' scale(1.5)';
            follower.style.background = 'rgba(6, 182, 212, 0.2)';
            cursor.style.transform += ' scale(0.5)';
        });
        el.addEventListener('mouseleave', () => {
            follower.style.transform = follower.style.transform.replace(' scale(1.5)', '');
            follower.style.background = 'rgba(6, 182, 212, 0.05)';
            cursor.style.transform = cursor.style.transform.replace(' scale(0.5)', '');
        });
    });

    // 2. Particle Canvas Animation
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            // Mouse repulsion
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const force = 100;
            
            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * (force / distance);
                this.y -= Math.sin(angle) * (force / distance);
            }

            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // 3. Scroll Reveal Logic
    const observerOptions = {
        threshold: 0.3
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Specific triggers
                if (entry.target.id === 'stats') {
                    startCounting();
                }
                if (entry.target.id === 'task-anchor') {
                    entry.target.querySelector('.dashboard-mockup').classList.add('reveal');
                }
                if (entry.target.id === 'statement-2') {
                    entry.target.querySelector('.underline-reveal').classList.add('active');
                }
                if (entry.target.id === 'cta') {
                    entry.target.querySelector('.radial-glow').style.opacity = '1';
                    entry.target.querySelector('.cta-logo').style.opacity = '1';
                    entry.target.querySelector('.cta-form-container').style.opacity = '1';
                    entry.target.querySelector('.cta-form-container').style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-section').forEach(section => {
        revealObserver.observe(section);
    });

    // 4. Stats Counting Animation
    function startCounting() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000;
            const startTime = performance.now();
            
            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentVal = Math.floor(progress * target);
                
                if (target >= 1000) {
                    stat.innerText = '$' + currentVal.toLocaleString() + '+';
                } else if (target === 10) {
                    stat.innerText = currentVal + '+';
                } else if (target === 23) {
                    stat.innerText = currentVal + ' min';
                } else {
                    stat.innerText = currentVal;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                }
            }
            requestAnimationFrame(updateCount);
        });
    }

    // 5. Cinematic Background Parallax
    const blobs = document.querySelectorAll('.blob');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.1;
            blob.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        blobs.forEach((blob, index) => {
            const factor = (index + 1) * 20;
            blob.style.left = `${(index === 0 ? -100 : -100) + (x * factor)}px`;
            blob.style.top = `${(index === 0 ? -100 : -100) + (y * factor)}px`;
        });
    });

    // 6. Supabase Initialization
    const supabaseUrl = 'https://gtzzqljpvbzociinqegh.supabase.co';
    const supabaseKey = 'sb_publishable_CoNCjuHnkSrBRVIn2Ip58g_69_4_q-G';
    const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

    // 7. Waitlist Form Handler
    const waitlistForm = document.getElementById('waitlist-form');
    const formMessage = document.getElementById('form-message');

    if (waitlistForm && supabase) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim().toLowerCase();
            const submitBtn = waitlistForm.querySelector('button');

            // Feedback state
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Joining...';
            formMessage.innerText = '';
            formMessage.className = 'form-message';

            try {
                // 1. Check for duplicates first
                const { data: existing, error: checkError } = await supabase
                    .from('waitlist')
                    .select('email')
                    .eq('email', email)
                    .single();

                if (existing) {
                    formMessage.innerText = 'You are already on the list! We will be in touch soon.';
                    formMessage.classList.add('success');
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                    return;
                }

                // 2. Insert new entry
                const { error: insertError } = await supabase
                    .from('waitlist')
                    .insert([{ email }]);

                if (insertError) throw insertError;
                
                formMessage.innerText = 'Welcome to the inner circle. We will be in touch.';
                formMessage.classList.add('success');
                waitlistForm.reset();
                submitBtn.innerText = 'Joined';
            } catch (error) {
                console.error('Waitlist Error:', error);
                formMessage.innerText = 'Something went wrong. Please try again.';
                formMessage.classList.add('error');
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    } else if (!supabase) {
        console.error('Supabase failed to initialize. Check CDN script.');
    }
});
