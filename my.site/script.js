window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');
    const progress = document.getElementById('progress');
    const percent = document.getElementById('load-percent');
    const loaderText = document.getElementById('loader-text');
    const enterSite = document.getElementById('enter-site');
    
    const music = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const bars = document.querySelectorAll('.eq-bar');
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    let load = 0;
    const interval = setInterval(() => {
        let step = load < 50 ? 5 : load < 80 ? 3 : 1;
        load += step;
        
        if (load >= 100) {
            load = 100;
            clearInterval(interval);
            loaderText.style.display = 'none';
            enterSite.style.display = 'block';
        }
        
        progress.style.width = load + '%';
        percent.innerText = load + '%';
    }, 100);

    loader.addEventListener('click', () => {
        music.volume = 0.3;
        music.play().catch(() => {}); 
        
        musicToggle.classList.add('visible');
        musicToggle.classList.add('playing');
        
        startEqAnimation();
        
        loader.style.opacity = '0';
        setTimeout(() => { 
            loader.style.display = 'none'; 
            content.classList.add('show');
        }, 1000);
    });

    function updateTime() {
        const timeEl = document.getElementById('time');
        if(!timeEl) return;
        const now = new Date();
        const options = { timeZone: 'Asia/Novosibirsk', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        timeEl.innerText = now.toLocaleTimeString('ru-RU', options);
    }
    setInterval(updateTime, 1000);
    updateTime();

    let isPlaying = true;
    let eqInterval = null;

    function startEqAnimation() {
        if (eqInterval) clearInterval(eqInterval);
        eqInterval = setInterval(() => {
            if (!isPlaying) return;
            bars.forEach((bar) => {
                let newHeight = Math.random() * 16 + 4;
                bar.style.height = newHeight + 'px';
            });
        }, 150); 
    }

    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
            musicToggle.classList.remove('playing');
            music.pause();
            isPlaying = false;
            if (eqInterval) clearInterval(eqInterval);
            bars.forEach(bar => bar.style.height = '4px'); 
        } else {
            music.play();
            musicToggle.classList.add('playing');
            isPlaying = true;
            startEqAnimation();
        }
    });

    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (html.getAttribute('data-theme') === 'dark') {
            html.setAttribute('data-theme', 'light');
            themeToggle.innerText = '☀️';
        } else {
            html.setAttribute('data-theme', 'dark');
            themeToggle.innerText = '🌙';
        }
    });

    const canvas = document.getElementById('snow-canvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const flakes = [];
    for (let i = 0; i < 300; i++) {
        flakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 3 + 1,
            speedY: Math.random() * 1 + 0.3,
            speedX: Math.random() * 1 - 0.5,
            opacity: Math.random() * 0.5 + 0.3
        });
    }

    function drawSnow() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < flakes.length; i++) {
            let f = flakes[i];
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
            ctx.fill();
            
            f.y += f.speedY;
            f.x += f.speedX;
            
            if (f.y > height + 10) { f.y = -10; f.x = Math.random() * width; }
            if (f.x > width + 10) f.x = -10;
            if (f.x < -10) f.x = width + 10;
        }
        requestAnimationFrame(drawSnow);
    }
    drawSnow();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
});