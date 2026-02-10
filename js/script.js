function initPageInteractions() {
    if (typeof githubButtons !== 'undefined' && githubButtons.render) {
        // githubButtons.render();
    }

    loadHitokoto();
}

document.addEventListener('DOMContentLoaded', initPageInteractions);

// 将函数暴露给全局，以便 loader.js 调用
window.initPageInteractions = initPageInteractions;

async function loadHitokoto() {
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

