// 固定链接数据
const fixedLinks = [
    { name: '党务知识库', url: 'https://metaso.cn/s/SJutkeR', icon: 'https://metaso.cn/favicon.ico' },
    { name: '豆包AI', url: 'https://www.doubao.com', icon: 'https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/logo-doubao-overflow.png' },
    { name: 'DeepSeek', url: 'https://www.deepseek.com', icon: 'https://www.deepseek.com/favicon.ico' },
    { name: 'WPS灵犀', url: 'https://lingxi.wps.cn', icon: 'https://www.wps.cn/favicon.ico' },
    { name: '讲话对比生成', url: 'https://tbox.alipay.com/share/202503AP2kyg00306840?platform=WebService', icon: 'https://www.alipay.com/favicon.ico' },
    { name: '讲话全模生成', url: 'https://tbox.alipay.com/share/202503APfyC200305431?platform=WebService', icon: 'https://www.alipay.com/favicon.ico' },
    { name: '讲话数据库', url: 'https://jhsjk.people.cn/', icon: 'http://www.people.com.cn/favicon.ico' },
    { name: '党章党规', url: 'https://www.12371.cn/special/dnfg/', icon: 'https://www.12371.cn/favicon.ico' },
    { name: '深言达意', url: 'https://www.shenyandayi.com/', icon: 'https://www.shenyandayi.com/favicon.ico' }
];

// DOM元素
const navbar = document.querySelector('.navbar');
const toggleNavBtn = document.getElementById('toggleNav');
const addLinkBtn = document.getElementById('addLink');
const addLinkModal = document.getElementById('addLinkModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const linkForm = document.getElementById('linkForm');
const linksGrid = document.getElementById('linksGrid');
const linkCountEl = document.getElementById('linkCount');
const currentTimeEl = document.getElementById('currentTime');
const toggleIcon = toggleNavBtn.querySelector('i');

// 内容区域DOM元素
const welcomeSection = document.getElementById('welcomeSection');
const websiteContainer = document.getElementById('websiteContainer');
const websiteIframe = document.getElementById('websiteIframe');
const websiteTitle = document.getElementById('websiteTitle');
const websiteUrl = document.getElementById('websiteUrl');
const backBtn = document.getElementById('backBtn');

// 存储键名
const STORAGE_KEY = 'navigation_links';

// 初始化函数
function init() {
    // 从本地存储加载链接
    let links = loadLinks();
    
    // 如果本地存储为空，则使用固定链接初始化
    if (links.length === 0) {
        links = [...fixedLinks];
        saveLinks(links);
    }
    
    // 渲染链接
    renderLinks(links);
    
    // 初始化事件监听器
    initEventListeners();
    
    // 启动时间更新
    startClock();
    
    // 更新链接数量
    updateLinkCount(links);
}

// 从本地存储加载链接
function loadLinks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('加载链接失败:', error);
        return [];
    }
}

// 保存链接到本地存储
function saveLinks(links) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
        return true;
    } catch (error) {
        console.error('保存链接失败:', error);
        return false;
    }
}

// 渲染链接
function renderLinks(links) {
    linksGrid.innerHTML = '';
    
    links.forEach((link, index) => {
        const linkCard = createLinkCard(link, index);
        linksGrid.appendChild(linkCard);
    });
    
    // 更新链接数量
    updateLinkCount(links);
}

// 创建链接卡片
function createLinkCard(link, index) {
    const card = document.createElement('div');
    card.className = 'link-card';
    
    // 创建删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.title = '删除链接';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteLink(index);
    };
    
    // 创建图标
    const icon = document.createElement('img');
    icon.className = 'link-icon';
    icon.src = link.icon || 'https://cdn-icons-png.flaticon.com/512/25/25231.png';
    icon.alt = link.name;
    icon.onerror = () => {
        icon.src = 'https://cdn-icons-png.flaticon.com/512/25/25231.png';
    };
    
    // 创建名称
    const name = document.createElement('h3');
    name.className = 'link-name';
    name.textContent = link.name;
    
    // 创建URL
    const url = document.createElement('p');
    url.className = 'link-url';
    url.textContent = link.url;
    
    // 组装卡片
    card.appendChild(deleteBtn);
    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(url);
    
    // 添加点击事件
    card.addEventListener('click', () => {
        showWebsite(link);
    });
    
    return card;
}

// 删除链接
function deleteLink(index) {
    let links = loadLinks();
    
    // 检查是否是固定链接
    const isFixedLink = fixedLinks.some(fixed => 
        fixed.name === links[index].name && fixed.url === links[index].url
    );
    
    // 固定链接不能删除
    if (isFixedLink) {
        alert('固定链接不能删除！');
        return;
    }
    
    // 确认删除
    if (confirm(`确定要删除链接 "${links[index].name}" 吗？`)) {
        links.splice(index, 1);
        saveLinks(links);
        renderLinks(links);
    }
}

// 更新链接数量
function updateLinkCount(links) {
    linkCountEl.textContent = links.length;
}

// 显示网站内容
function showWebsite(link) {
    // 自动折叠导航栏
    if (!navbar.classList.contains('collapsed')) {
        toggleNavbar();
    }
    
    // 检查是否是需要在新标签页打开的网站（有防止嵌入机制）
    const sitesToOpenInNewTab = ['metaso.cn'];
    const shouldOpenInNewTab = sitesToOpenInNewTab.some(site => link.url.includes(site));
    
    if (shouldOpenInNewTab) {
        // 在新标签页打开
        window.open(link.url, '_blank', 'noopener,noreferrer');
    } else {
        // 在iframe中显示
        // 显示网站容器，隐藏欢迎区域
        welcomeSection.style.display = 'none';
        websiteContainer.style.display = 'flex';
        
        // 更新网站信息
        websiteTitle.textContent = link.name;
        websiteUrl.textContent = link.url;
        
        // 设置iframe的src
        websiteIframe.src = link.url;
    }
}

// 返回首页
function backToHome() {
    // 显示欢迎区域，隐藏网站容器
    websiteContainer.style.display = 'none';
    welcomeSection.style.display = 'flex';
    
    // 清空iframe的src，释放资源
    websiteIframe.src = 'about:blank';
}

// 初始化事件监听器
function initEventListeners() {
    // 导航栏切换
    toggleNavBtn.addEventListener('click', toggleNavbar);
    
    // 打开添加链接模态框
    addLinkBtn.addEventListener('click', openAddLinkModal);
    
    // 关闭模态框
    closeModalBtn.addEventListener('click', closeAddLinkModal);
    cancelBtn.addEventListener('click', closeAddLinkModal);
    
    // 点击模态框外部关闭
    addLinkModal.addEventListener('click', (e) => {
        if (e.target === addLinkModal) {
            closeAddLinkModal();
        }
    });
    
    // 提交表单
    linkForm.addEventListener('submit', handleAddLink);
    
    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (addLinkModal.classList.contains('show')) {
                closeAddLinkModal();
            } else if (websiteContainer.style.display === 'flex') {
                backToHome();
            }
        }
    });
    
    // 返回首页按钮
    backBtn.addEventListener('click', backToHome);
}

// 切换导航栏显示/隐藏
function toggleNavbar() {
    navbar.classList.toggle('collapsed');
    
    // 更新图标
    if (navbar.classList.contains('collapsed')) {
        toggleIcon.classList.remove('fa-chevron-up');
        toggleIcon.classList.add('fa-chevron-down');
    } else {
        toggleIcon.classList.remove('fa-chevron-down');
        toggleIcon.classList.add('fa-chevron-up');
    }
}

// 打开添加链接模态框
function openAddLinkModal() {
    addLinkModal.classList.add('show');
    // 清空表单
    linkForm.reset();
    // 聚焦到第一个输入框
    document.getElementById('linkName').focus();
}

// 关闭添加链接模态框
function closeAddLinkModal() {
    addLinkModal.classList.remove('show');
}

// 处理添加链接
function handleAddLink(e) {
    e.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(linkForm);
    const name = formData.get('name').trim();
    const url = formData.get('url').trim();
    const icon = formData.get('icon').trim();
    
    // 简单验证
    if (!name || !url) {
        alert('请填写名称和网址！');
        return;
    }
    
    // 验证URL格式
    try {
        new URL(url);
    } catch (error) {
        alert('请输入有效的网址（如：https://example.com）！');
        return;
    }
    
    // 加载现有链接
    let links = loadLinks();
    
    // 创建新链接
    const newLink = {
        name,
        url,
        icon: icon || ''
    };
    
    // 添加到链接列表
    links.push(newLink);
    
    // 保存并重新渲染
    saveLinks(links);
    renderLinks(links);
    
    // 关闭模态框
    closeAddLinkModal();
    
    // 显示成功提示
    showNotification('链接添加成功！', 'success');
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s ease-out;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 3秒后隐藏并移除
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 启动时钟
function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

// 更新时钟
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    currentTimeEl.textContent = timeString;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);