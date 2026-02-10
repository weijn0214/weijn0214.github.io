function initPageInteractions() {
    if (typeof githubButtons !== 'undefined' && githubButtons.render) {
        // githubButtons.render();
    }

    loadHitokoto(); // 暂时注释掉，使用新的 Hero 区域
    
    // 初始化主题图标状态
    updateThemeIcon();
}

document.addEventListener('DOMContentLoaded', initPageInteractions);

// 将函数暴露给全局，以便 loader.js 调用
window.initPageInteractions = initPageInteractions;

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const sunIcon = themeToggle.querySelector('.icon-sun');
    const moonIcon = themeToggle.querySelector('.icon-moon');
    
    if (sunIcon && moonIcon) {
        if (isDark) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
}

// 监听主题切换事件（在 loader.js 中触发，或者这里添加点击事件）
// 注意：loader.js 中已经有点击事件绑定，我们需要确保点击时更新图标

async function loadHitokoto() {
    // 保留此函数以防未来需要，或者作为备用
    const fromEl = document.getElementById('hitokoto_from');
    const textEl = document.getElementById('hitokoto_hitokoto');
    if (!fromEl || !textEl) return;
    fromEl.innerText = '获取中...';
    textEl.innerText = '获取中...';

    let cached;
    try {
        cached = JSON.parse(sessionStorage.getItem('hitokoto') || 'null');
    } catch {
        cached = null;
    }
    if (cached && cached.from && cached.hitokoto) {
        fromEl.innerText = cached.from;
        textEl.innerText = cached.hitokoto;
    }

    try {
        const res = await fetch('https://v1.hitokoto.cn/?c=f&c=c&c=l&c=h&c=j&encode=json', { cache: 'no-store' });
        const data = await res.json();
        const payload = { from: data.from || '', hitokoto: data.hitokoto || '' };
        sessionStorage.setItem('hitokoto', JSON.stringify(payload));
        fromEl.innerText = payload.from || '未知来源';
        textEl.innerText = payload.hitokoto || '';
    } catch {
        if (!cached) {
            fromEl.innerText = '加载失败';
            textEl.innerText = '请稍后重试';
        }
    }
}

