document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已经在运行 SPA 模式（避免重复 fetch）
    if (window.isHeaderLoaded) return;

    const isSubPage = location.pathname.includes('/pages/');
    const base = isSubPage ? '..' : '.';
    
    // 并行加载头部和尾部
    Promise.all([
        fetch(base + '/components/header.html').then(res => res.text()),
        fetch(base + '/components/footer.html').then(res => res.text())
    ]).then(([headerData, footerData]) => {
        document.getElementById('header-container').innerHTML = headerData;
        document.getElementById('footer-container').innerHTML = footerData;
        
        window.isHeaderLoaded = true; // 标记已加载
        
        adjustNavLinks(base); // 恢复调用：修正导航链接路径
        initThemeToggle();
        initRouter(); // 初始化 SPA 路由
    }).catch(error => console.error('Error loading components:', error));
});

function initRouter() {
    // 拦截所有内部导航链接点击
    document.body.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        // 排除外部链接、锚点、非 HTTP(S) 链接
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;
        
        // 排除 target="_blank"
        if (link.target === '_blank') return;

        e.preventDefault();
        navigateTo(href);
    });

    // 处理浏览器前进/后退
    window.addEventListener('popstate', function() {
        navigateTo(location.pathname, false);
    });

    // 初始化高亮
    updateActiveLink();
}

function navigateTo(url, pushState = true) {
    // 显示加载状态（可选）
    document.body.style.opacity = '0.7';

    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // 替换中间内容容器
            const newContent = doc.querySelector('.container');
            const currentContent = document.querySelector('.container');
            if (newContent && currentContent) {
                currentContent.replaceWith(newContent);
            }
            
            // 更新标题
            document.title = doc.title;
            
            // 更新 URL
            if (pushState) {
                history.pushState(null, '', url);
            }
            
            // 恢复透明度
            document.body.style.opacity = '1';
            
            // 重新运行页面初始化逻辑
            if (window.initPageInteractions) {
                window.initPageInteractions();
            }
            
            // 更新导航高亮
            updateActiveLink();
            
            // 每次路由切换后，重新计算导航链接路径（因为 base 可能变了）
            const isSubPage = location.pathname.includes('/pages/');
            const base = isSubPage ? '..' : '.';
            adjustNavLinks(base);

            // 滚动到顶部
            window.scrollTo(0, 0);
        })
        .catch(error => {
            console.error('Navigation error:', error);
            window.location.href = url; // 降级处理：出错则直接跳转
        });
}

function updateActiveLink() {
    // 简单的高亮逻辑：匹配当前 pathname
    const currentPath = location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        // 需要处理相对路径转换对比，或者简单对比
        // 这里做一个简单的模糊匹配
        if (href === currentPath || (href === '/' && (currentPath === '/' || currentPath === '/index.html'))) {
            link.style.color = 'var(--accent-color)';
        } else {
            link.style.color = '';
        }
    });
}

function initThemeToggle() {
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    if (saved) {
        root.setAttribute('data-theme', saved);
    }
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    // Helper to update icons
    const updateIcons = (isDark) => {
        const sunIcon = btn.querySelector('.icon-sun');
        const moonIcon = btn.querySelector('.icon-moon');
        if (sunIcon && moonIcon) {
            if (isDark) {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        }
    };

    // 初始化开关外观
    const isDark = root.getAttribute('data-theme') === 'dark';
    updateToggleUI(btn, isDark);
    updateIcons(isDark);

    btn.addEventListener('click', () => {
        const isDark = root.getAttribute('data-theme') === 'dark';
        const next = isDark ? 'light' : 'dark';
        // 丝滑动画通过 CSS transition 实现
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateToggleUI(btn, next === 'dark');
        updateIcons(next === 'dark');
    });
}

function adjustNavLinks(base) {
    const links = document.querySelectorAll('[data-path]');
    links.forEach(link => {
        const path = link.getAttribute('data-path');
        link.setAttribute('href', base + '/' + path);
    });
}

function updateToggleUI(btn, active) {
    if (active) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
}
