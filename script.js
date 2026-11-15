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
    const langToggle = document.getElementById('lang-toggle');
    const html = document.documentElement;

    const translations = {
        ru: {
            click_here: "Кликните в любом месте", click_sub: "чтобы попасть на сайт",
            nav_projects: "Проекты", nav_about: "Обо мне", nav_setup: "Сетап", nav_contact: "Связь",
            hero_desc: "Пишу код, ломаю системы, экспериментирую с железом. Если есть идеи — пиши.",
            btn_tg: "Написать в Telegram ↗", btn_projects: "Проекты",
            h2_projects: "Проекты",
            p1_title: "Neon Snake (Игра)", 
            p1_desc: "Классическая змейка на HTML5 Canvas с неоновой графикой и поддержкой свайпов.", 
            p1_btn: "Играть",
            p2_title: "Сайт для Сереги", 
            p2_desc: "Интерактивный квест-поздравление с конфетти, музыкой и вопросами.", 
            p2_btn: "Открыть",
            h2_about: "Обо мне", profile: "Профиль", name: "Имя", region: "Регион", time: "Время",
            skills: "Навыки",
            sport: "Спорт", discipline: "Дисциплина", basketball: "Баскетбол", format: "Формат", format_val: "Кардио • Плавание • Бег",
            hardware: "Железо", pc: "ПК", periph: "Периферия", phone: "Телефон",
            h2_timeline: "Таймлайн",
            tl_2024_title: "Начало пути", 
            tl_2024_desc: "Начал учить Python, делать первые скрипты.",
            tl_2025_title: "Первые проекты", 
            tl_2025_desc: "Написал Telegram-бота и мод для tModLoader (потеряно).",
            tl_2026_title: "Запуск сайта", 
            tl_2026_desc: "Сделал это портфолио и сайт-подарок для друга.",
            h2_setup: "Сетап", setup_title: "Рабочее место & Девайсы", setup_desc: "Моя конфигурация для учебы, написания кода и игр.",
            keyboard: "Клавиатура", mouse: "Мышь", cpu: "Процессор", gpu: "Видеокарта",
            h2_contact: "Связь", footer: "Сделано вручную."
        },
        en: {
            click_here: "Click anywhere", click_sub: "to enter the site",
            nav_projects: "Projects", nav_about: "About", nav_setup: "Setup", nav_contact: "Contact",
            hero_desc: "I write code, break systems, experiment with hardware. If you have ideas — write to me.",
            btn_tg: "Write to Telegram ↗", btn_projects: "Projects",
            h2_projects: "Projects",
            p1_title: "Neon Snake (Game)", 
            p1_desc: "Classic snake game on HTML5 Canvas with neon graphics and swipe support.", 
            p1_btn: "Play",
            p2_title: "Site for Sergey", 
            p2_desc: "Interactive quest greeting with confetti, music and questions.", 
            p2_btn: "Open",
            h2_about: "About me", profile: "Profile", name: "Name", region: "Region", time: "Time",
            skills: "Skills",
            sport: "Sport", discipline: "Discipline", basketball: "Basketball", format: "Format", format_val: "Cardio • Swimming • Running",
            hardware: "Hardware", pc: "PC", periph: "Peripherals", phone: "Phone",
            h2_timeline: "Timeline",
            tl_2024_title: "Start of the path", 
            tl_2024_desc: "Started learning Python, making first scripts.",
            tl_2025_title: "First projects", 
            tl_2025_desc: "Wrote Telegram bot and tModLoader mod (lost).",
            tl_2026_title: "Site launch", 
            tl_2026_desc: "Made this portfolio and a gift site for a friend.",
            h2_setup: "Setup", setup_title: "Workspace & Devices", setup_desc: "My configuration for study, coding and games.",
            keyboard: "Keyboard", mouse: "Mouse", cpu: "CPU", gpu: "GPU",
            h2_contact: "Contact", footer: "Made by hand."
        }
    };

    let currentLang = 'ru';

    function setLanguage(lang) {
        currentLang = lang;
        if (lang === 'en') langToggle.classList.add('en');
        else langToggle.classList.remove('en');

        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (translations[lang][key]) el.innerText = translations[lang][key];
        });
        document.title = lang === 'ru' ? '@onozis — Портфолио' : '@onozis — Portfolio';
    }

    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setLanguage(currentLang === 'ru' ? 'en' : 'ru');
    });

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
    for (let i = 0; i < 100; i++) {
        let layer = Math.floor(Math.random() * 3);
        let size, speed;
        if (layer === 0) { size = Math.random() * 1.5 + 0.5; speed = 0.2; }
        else if (layer === 1) { size = Math.random() * 2 + 1.5; speed = 0.6; }
        else { size = Math.random() * 3 + 2.5; speed = 1.2; }
        
        flakes.push({
            x: Math.random() * width, y: Math.random() * height, r: size,
            speedY: speed + Math.random() * 0.5, speedX: (Math.random() - 0.5) * speed,
            opacity: layer === 0 ? 0.3 : layer === 1 ? 0.5 : 0.8
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

    setLanguage('ru');
});