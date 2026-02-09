function initPageInteractions() {
    // 获取按钮和提示文字元素
    const clickBtn = document.getElementById('clickBtn');
    const tipText = document.getElementById('tipText');

    if (clickBtn && tipText) {
        // 移除旧的事件监听器（如果存在），防止重复绑定（简单场景下可选，但严谨起见）
        // 这里采用克隆节点的方式快速清除所有监听器，或者依赖逻辑本身的幂等性
        // 由于 SPA 切换是替换整个 DOM，所以重新获取的元素是新的，不用担心重复绑定
        
        // 给按钮添加点击事件
        clickBtn.addEventListener('click', function() {
            // 切换提示文字的显示/隐藏
            if (tipText.style.display === 'none') {
                tipText.style.display = 'block';
            } else {
                tipText.style.display = 'none';
            }
        });
    }

    // 这里可以添加其他页面的初始化逻辑
    // 例如：重新加载 GitHub 按钮
    if (typeof githubButtons !== 'undefined' && githubButtons.render) {
        // githubButtons.render(); // 需要确认 GitHub Buttons 的 API
    }
}

document.addEventListener('DOMContentLoaded', initPageInteractions);

// 将函数暴露给全局，以便 loader.js 调用
window.initPageInteractions = initPageInteractions;

