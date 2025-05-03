// 配置管理
const CONFIG = {
    // 基础配置
    site: {
        title: '🍹 BAOER の BLOG 🍍',
        favicon: 'https://cdn.h5wan.4399sj.com/public/images/report/20250301/45815040_76593000.jpg',
        enablePasswordProtection: false,
    },
    // 分页配置
    pagination: {
        itemsPerPage: 5
    },
    // 音乐播放器配置
    musicPlayer: {
        server: "netease", // 音乐服务提供商
        type: "playlist", // 播放类型
        id: "12922385202", // 播放列表ID
        fixed: false, // 是否固定
        mini: true, // 是否迷你模式
        autoplay: false, // 是否自动播放
        theme: "var(--link-color)", // 主题颜色
        preload: "metadata", // 预加载方式
        volume: 0.7, // 音量
        listFolded: true, // 当mini为false时，播放列表是否默认折叠
        order: "random" // 播放顺序，可选值：'list'顺序播放, 'random'随机播放, 'loop'单曲循环
    },
    // 字体配置
    fonts: {
        sans: "'LXGW WenKai', 'Noto Sans SC', 'HarmonyOS Sans SC', 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Microsoft YaHei', sans-serif",
        serif: "'LXGW WenKai', 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif', source-han-serif-sc, 'PT Serif', 'SongTi SC', serif",
        mono: "'JetBrains Mono', 'LXGW WenKai Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    },
    // 主题配置
    theme: {
        dark: {
            mainBg: '#1a1a1a',
            textColor: '#e0e0e0',
            textColorSecondary: '#888888',
            borderColor: '#30363d',
            linkColor: '#60a5fa',
            headerBg: '#242424',
            contentBg: '#1e1e1e',
            hoverBg: 'rgba(255, 255, 255, 0.05)',
            codeBg: '#2d2d2d',
            blockquoteBg: '#2d2d2d',
            scrollbarColor: '#4a4a4a'
        },
        light: {
            mainBg: '#f5f5f5',
            textColor: '#2c3e50',
            textColorSecondary: '#666666',
            borderColor: '#e0e0e0',
            linkColor: '#2563eb',
            headerBg: '#f5f5f5',
            contentBg: '#fffafa',
            hoverBg: 'rgba(0, 0, 0, 0.05)',
            codeBg: '#f0f0f0',
            blockquoteBg: '#f3f4f6',
            scrollbarColor: '#c0c0c0'
        }
    },
    // 布局配置
    layout: {
        sidebarWidth: '250px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        mobileBreakpoint: '768px'
    },
    // API配置
    api: {
        cacheTime: 0, // 缓存时间（毫秒）
        maxRetries: 3, // 最大重试次数
        timeout: 8000 // 请求超时时间（毫秒）
    }

};

// 古诗词数据
const POEMS = [
    {
        content: "人生若只如初见，何事秋风悲画扇。",
        author: "纳兰性德",
        title: "木兰词·拟古决绝词柬友"
    },
    {
        content: "衣带渐宽终不悔，为伊消得人憔悴。",
        author: "柳永",
        title: "蝶恋花"
    },
    {
        content: "曾经沧海难为水，除却巫山不是云。",
        author: "元稹",
        title: "离思五首·其四"
    },
    {
        content: "落霞与孤鹜齐飞，秋水共长天一色。",
        author: "王勃",
        title: "滕王阁序"
    },
    {
        content: "人间万事消磨尽，只有清香似旧时。",
        author: "刘方平",
        title: "春怨"
    },
    {
        content: "此情可待成追忆，只是当时已惘然。",
        author: "李商隐",
        title: "锦瑟"
    },
    {
        content: "红豆生南国，春来发几枝。愿君多采撷，此物最相思。",
        author: "王维",
        title: "相思"
    },
    {
        content: "春风又绿江南岸，明月何时照我还。",
        author: "王安石",
        title: "泊船瓜洲"
    },
    {
        content: "长风破浪会有时，直挂云帆济沧海。",
        author: "李白",
        title: "行路难"
    },
    {
        content: "醉后不知天在水，满船清梦压星河。",
        author: "唐温如",
        title: "题龙阳县青草湖"
    }
];

// 工具函数
const utils = {
    // 格式化日期
    formatDate(date) {
        const beijingDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
        const year = beijingDate.getUTCFullYear();
        const month = String(beijingDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(beijingDate.getUTCDate()).padStart(2, '0');
        const hour = String(beijingDate.getUTCHours()).padStart(2, '0');
        const minute = String(beijingDate.getUTCMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}`;
    },

    // 转换为北京时间
    convertToBeiJingTime(timestamp) {
        const utcDate = new Date(Number(timestamp) * 1000);
        return new Date(utcDate.getTime() + 8 * 60 * 60 * 1000);
    },

    // 生成随机诗词
    getRandomPoem() {
        return POEMS[Math.floor(Math.random() * POEMS.length)];
    }
};

// API 处理模块
const apiHandler = {
    // 缓存对象
    cache: {
        posts: {
            data: null,
            timestamp: 0,
            etag: null,
            rateLimit: null
        }
    },

    // 带重试的请求
    async fetchWithRetry(url, options, env) {
        const delays = [1000, 2000, 4000];
        let lastError;

        const headers = {
            'User-Agent': 'CloudflareWorker',
            'Accept': 'application/vnd.github.v3+json',
            ...(options.headers || {}),
        };

        if (env.GITHUB_TOKEN) {
            headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
        }

        for (let i = 0; i < CONFIG.api.maxRetries; i++) {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), CONFIG.api.timeout);

                const response = await fetch(url, {
                    ...options,
                    headers,
                    signal: controller.signal
                });

                clearTimeout(timeout);

                const rateLimit = {
                    limit: response.headers.get('X-RateLimit-Limit'),
                    remaining: response.headers.get('X-RateLimit-Remaining'),
                    reset: response.headers.get('X-RateLimit-Reset'),
                    used: response.headers.get('X-RateLimit-Used')
                };

                console.log(`[API请求] URL: ${url}, 状态: ${response.status}, 剩余限额: ${rateLimit.remaining}`);

                if (response.status === 403 && rateLimit.remaining === '0') {
                    const resetDate = utils.convertToBeiJingTime(rateLimit.reset);
                    throw new Error(`API 限制已达上限（${rateLimit.limit}次/时），将在 ${resetDate.toLocaleString('zh-CN', { hour12: false })} 重置`);
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return { response, rateLimit };
            } catch (error) {
                lastError = error;
                if (i === CONFIG.api.maxRetries - 1) break;

                if (error.name === 'AbortError' || error.name === 'TypeError') {
                    await new Promise(resolve => setTimeout(resolve, delays[i]));
                    continue;
                }
                throw error;
            }
        }
        throw lastError;
    },

    // 获取文章内容
    async getPostContent(path, env) {
        // 添加.md后缀进行请求
        const fullPath = path.endsWith('.md') ? path : path + '.md';
        const response = await fetch(
            `https://raw.githubusercontent.com/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/main/${fullPath}`,
            {
                headers: {
                    'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
                    'User-Agent': 'CloudflareWorker'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch post content');
        }

        return await response.text();
    }
};

// HTML生成模块
const htmlGenerator = {
    // 生成API限额信息HTML
    generateApiLimitHtml(rateLimit) {
        const used = parseInt(rateLimit.used) || 0;
        const limit = parseInt(rateLimit.limit) || 1;
        const remaining = parseInt(rateLimit.remaining) || 0;
        const resetTime = utils.convertToBeiJingTime(rateLimit.reset);

        return `
            <div class="api-limit-info">
                <p>API 限额: ${remaining} / ${limit}</p>
                <p>🔑已使用: ${used}</p>
                <p>🔄重置时间: ${resetTime.toLocaleTimeString('zh-CN', { hour12: false })}</p>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${(used / limit) * 100}%"></div>
                </div>
            </div>
        `;
    },

    // 生成文章列表HTML
    async generatePostList(env) {
        try {
            const now = Date.now();
            const cache = apiHandler.cache.posts;

            if (cache.data && (now - cache.timestamp) < CONFIG.api.cacheTime) {
                return cache.data;
            }

            const apiUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/`;
            const { response, rateLimit } = await apiHandler.fetchWithRetry(apiUrl, {
                headers: { 'If-None-Match': cache.etag || '' }
            }, env);

            if (response.status === 304 && cache.data) {
                cache.timestamp = now;
                return cache.data;
            }

            const files = await response.json();
            const posts = files
                .filter(file => (file.name.endsWith('.md') || file.name.endsWith('.pdf')) && file.name !== 'README.md')
                .map(file => ({
                    name: file.name,
                    path: file.path,
                    url: `/posts/${file.name}`,
                    sha: file.sha,
                    type: file.name.endsWith('.pdf') ? 'pdf' : 'markdown'
                }));

            const postsWithDates = await Promise.all(posts.map(async post => {
                try {
                    const encodedPath = encodeURIComponent(post.path);
                    const { response: commitResponse } = await apiHandler.fetchWithRetry(
                        `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/commits?path=${encodedPath}&page=1&per_page=1`,
                        {
                            headers: {
                                'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
                                'Accept': 'application/vnd.github.v3+json',
                                'User-Agent': 'CloudflareWorker'
                            }
                        },
                        env
                    );

                    const commits = await commitResponse.json();
                    post.lastModified = commits?.[0] ? new Date(commits[0].commit.committer.date) : null;
                } catch (error) {
                    console.error(`Error fetching commit info for ${post.path}:`, error);
                    post.lastModified = null;
                }
                return post;
            }));

            postsWithDates.sort((a, b) => b.lastModified - a.lastModified);

            const totalPages = Math.ceil(postsWithDates.length / CONFIG.pagination.itemsPerPage);
            const postListHtml = this.generatePostListHtml(postsWithDates, totalPages);

            // 更新缓存
            apiHandler.cache.posts = {
                data: postListHtml,
                timestamp: now,
                etag: response.headers.get('ETag'),
                rateLimit
            };

            return postListHtml;
        } catch (error) {
            if (apiHandler.cache.posts.data) {
                return apiHandler.cache.posts.data;
            }

            return this.generateErrorHtml(error);
        }
    },

    // 生成文章列表的具体HTML
    generatePostListHtml(posts, totalPages) {
        return `
            <div class="post-list-container">
                <div class="post-list" id="postList">
                    ${posts.map((post, index) => `
                        <div class="post-item" style="display: ${index < CONFIG.pagination.itemsPerPage ? 'block' : 'none'}" data-page="${Math.floor(index / CONFIG.pagination.itemsPerPage) + 1}">
                            <a href="${post.url.replace('.md', '')}">
                                <div class="post-title">${post.type === 'pdf' ? '💾' : '📝'} ${post.name.replace('.md', '').replace('.pdf', '')}</div>
                                <div class="post-date" style="text-align: right;">${post.lastModified ? `📅 ${utils.formatDate(post.lastModified)}` : '❌ 获取时间失败'}</div>
                            </a>
                        </div>
                    `).join('')}
                </div>
                <div class="pagination">
                    <button id="prevPage" onclick="changePage(-1)" disabled>✏️</button>
                    <input type="number" id="pageInput" min="1" max="${totalPages}" value="1" 
                           style="width: 40px; text-align: center; margin: 0 5px; border: 1px solid var(--border-color); 
                                  border-radius: 4px; background: var(--content-bg); color: var(--main-text-color);"
                           onkeydown="if(event.key === 'Enter') goToPage(this.value)">
                    <span style="color: var(--main-text-color); margin-right: 5px;">/ ${totalPages}</span>
                    <button id="nextPage" onclick="changePage(1)" ${totalPages <= 1 ? 'disabled' : ''}>✒️</button>
                </div>
            </div>
            <script>
                let currentPage = 1;
                const totalPages = ${totalPages};
                
                function changePage(delta) {
                    const newPage = currentPage + delta;
                    if (newPage >= 1 && newPage <= totalPages) {
                        document.querySelectorAll('.post-item[data-page="'+currentPage+'"]')
                            .forEach(item => item.style.display = 'none');
                        
                        document.querySelectorAll('.post-item[data-page="'+newPage+'"]')
                            .forEach(item => item.style.display = 'block');
                        
                        currentPage = newPage;
                        
                        document.getElementById('prevPage').disabled = currentPage === 1;
                        document.getElementById('nextPage').disabled = currentPage === totalPages;
                        document.getElementById('pageInput').value = currentPage;
                    }
                }
                
                function goToPage(pageNum) {
                    pageNum = parseInt(pageNum);
                    
                    // 验证输入是否合法
                    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
                        // 恢复输入框为当前页码
                        document.getElementById('pageInput').value = currentPage;
                        return;
                    }
                    
                    // 如果新页码和当前页码一样，不做任何操作
                    if (pageNum === currentPage) {
                        return;
                    }
                    
                    document.querySelectorAll('.post-item[data-page="' + currentPage + '"]')
                        .forEach(item => item.style.display = 'none');
                        
                    document.querySelectorAll('.post-item[data-page="' + pageNum + '"]')
                        .forEach(item => item.style.display = 'block');
                        
                    currentPage = pageNum;
                    
                    document.getElementById('prevPage').disabled = currentPage === 1;
                    document.getElementById('nextPage').disabled = currentPage === totalPages;
                    document.getElementById('pageInput').value = currentPage;
                }
            </script>
        `;
    },

    // 生成错误提示HTML
    generateErrorHtml(error) {
        return `
            <div class="error-message" style="text-align: center; padding: 20px;">
                <p style="color: var(--text-color-secondary); margin-bottom: 15px; font-size: 1.2em;">
                    加载文章列表失败
                </p>
                <p style="color: var(--text-color-secondary); font-size: 0.9em; margin-bottom: 20px;">
                    请检查网络连接
                </p>
                <p style="color: var(--text-color-secondary); font-size: 0.8em; margin-bottom: 20px;">
                    错误详情: ${error.name} - ${error.message}
                </p>
                <button onclick="window.location.reload()" 
                    style="padding: 8px 16px; 
                    background: var(--link-color); 
                    color: white; 
                    border: none; 
                    border-radius: 4px; 
                    cursor: pointer;
                    transition: opacity 0.2s;">
                    重新加载
                </button>
            </div>
        `;
    }
};

// 样式定义
const styles = `
<style>
    /* 基础样式 */
    *, *::before, *::after {
        box-sizing: border-box;
    }

    /* 音乐播放器样式 */
    .music-player {
        position: fixed;
        top: 0;
        right: 20px;
        z-index: 1000;
        padding: 10px;
        background: var(--header-bg);
        border-radius: 0 0 8px 8px;
        box-shadow: var(--box-shadow);
        transition: all 0.3s ease;
    }

    .music-player:hover {
        transform: translateY(2px);
    }

    /* 移动端隐藏音乐播放器 */
    @media (max-width: 768px) {
        .music-player {
            display: none !important;  /* 使用 !important 确保覆盖其他可能的样式 */
        }
    }

    @media (max-width: 768px) {
        .music-player {
            position: fixed;
            bottom: 0;
            top: auto;
            right: 0;
            left: 0;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
    }

    /* 主题变量 */
    :root {
        /* 深色主题变量 */
        --dark-main-bg: #1a1a1a;
        --dark-text-color: #e0e0e0;
        --dark-text-color-secondary: #888888;
        --dark-border-color: #30363d;
        --dark-link-color: #60a5fa;
        --dark-header-bg: #242424;
        --dark-content-bg: #1e1e1e;
        --dark-hover-bg: rgba(255, 255, 255, 0.05);
        --dark-code-bg: #2d2d2d;
        --dark-blockquote-bg: #2d2d2d;
        --dark-scrollbar-color: #4a4a4a;
        
        /* 浅色主题变量 */
        --light-main-bg: #f5f5f5;
        --light-text-color: #2c3e50;
        --light-text-color-secondary: #666666;
        --light-border-color: #e0e0e0;
        --light-link-color: #2563eb;
        --light-header-bg: #f5f5f5;
        --light-content-bg: #fffafa;
        --light-hover-bg: rgba(0, 0, 0, 0.05);
        --light-code-bg: #f0f0f0;
        --light-blockquote-bg: #f3f4f6;
        --light-scrollbar-color: #c0c0c0;
        
        /* 当前主题变量 */
        --main-bg-color: var(--dark-main-bg);
        --main-text-color: var(--dark-text-color);
        --text-color-secondary: var(--dark-text-color-secondary);
        --border-color: var(--dark-border-color);
        --link-color: var(--dark-link-color);
        --header-bg: var(--dark-header-bg);
        --content-bg: var(--dark-content-bg);
        --hover-bg: var(--dark-hover-bg);
        --code-bg: var(--dark-code-bg);
        --blockquote-bg: var(--dark-blockquote-bg);
        --scrollbar-color: var(--dark-scrollbar-color);
        
        --sidebar-width: 250px;
        --box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        
        /* 字体变量 */
        --font-sans: ${CONFIG.fonts.sans};
        --font-serif: ${CONFIG.fonts.serif};
        --font-mono: ${CONFIG.fonts.mono};
    }

    /* 浅色主题类 */
    :root[data-theme='light'] {
        --main-bg-color: var(--light-main-bg);
        --main-text-color: var(--light-text-color);
        --text-color-secondary: var(--light-text-color-secondary);
        --border-color: var(--light-border-color);
        --link-color: var(--light-link-color);
        --header-bg: var(--light-header-bg);
        --content-bg: var(--light-content-bg);
        --hover-bg: var(--light-hover-bg);
        --code-bg: var(--light-code-bg);
        --blockquote-bg: var(--light-blockquote-bg);
        --scrollbar-color: var(--light-scrollbar-color);
    }

    /* 过渡效果 */
    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    /* 基础布局样式 */
    body {
        margin: 0;
        font-family: var(--font-sans);
        background-color: var(--main-bg-color);
        color: var(--main-text-color);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    /* 统一的布局容器样式 */
    .layout > * {
        border-radius: 12px;
        margin: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    /* 头部导航栏样式 */
    .header {
        background-color: var(--header-bg);
        border-bottom: 1px solid var(--border-color);
        padding: 1rem;
        box-shadow: var(--box-shadow);
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 10;
        border-radius: 0 0 12px 12px;
        margin: 0 8px 8px 8px;
    }

    /* Markdown 内容样式 */
    .markdown-body {
        background-color: var(--content-bg) !important;
        color: var(--main-text-color) !important;
        font-size: 17px !important;
        line-height: 1.8 !important;
        font-weight: 400 !important;
        padding: 30px !important;
        border-radius: 12px !important;
        border: 1px solid var(--border-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .markdown-body h1, .markdown-body h2, .markdown-body h3,
    .markdown-body h4, .markdown-body h5, .markdown-body h6 {
        margin-top: 24px;
        margin-bottom: 16px;
        font-weight: 600 !important;
        line-height: 1.25;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 0.3em;
    }

    .markdown-body h1 { font-size: 28px !important; }
    .markdown-body h2 { font-size: 24px !important; }
    .markdown-body h3 { font-size: 20px !important; }
    .markdown-body h4 { font-size: 18px !important; }
    .markdown-body h5, .markdown-body h6 { font-size: 16px !important; }

    /* 代码块样式 */
    .markdown-body pre {
        background-color: var(--code-bg) !important;
        border: 1px solid var(--border-color) !important;
        padding: 16px;
        margin: 16px 0;
        border-radius: 8px;
        position: relative;
        padding-top: 2.5em !important;
    }

    .markdown-body code {
        font-family: var(--font-mono);
        font-size: 15px !important;
        background-color: var(--code-bg) !important;
        color: var(--main-text-color) !important;
    }

    /* 目录样式 */
    .toc {
        width: var(--sidebar-width);
        padding: 20px;
        position: sticky;
        top: 0;
        height: 100vh;
        overflow-y: auto;
        border-left: 1px solid var(--border-color);
        background: var(--main-bg-color);
        scroll-behavior: smooth;
        border-radius: 12px;
    }

    .toc-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 8px 12px;
        margin: 4px 0;
        border-radius: 4px;
        position: relative;
    }

    /* 移动端适配 */
    @media (max-width: 768px) {
        .layout > * {
            margin: 4px;
            border-radius: 8px;
        }
        
        .layout {
            flex-direction: column;
            gap: 8px;
            padding: 0 4px;
        }
        
        .header {
            padding: 10px;
            margin: 0 4px 4px 4px;
            border-radius: 0 0 8px 8px;
        }

        .sidebar {
            position: static;
            width: 100%;
            height: 70vh; /* 设置为视口高度的70%，保证有足够空间 */
            max-height: calc(100vh - 150px); /* 确保有足够空间显示底部的分页控件 */
            padding: 10px;
            overflow-y: auto; /* 修改为auto，允许垂直滚动 */
            padding-bottom: 60px; /* 为底部分页控件留出空间 */
        }

        .toc {
            display: none;
        }

        .content {
            padding: 15px;
            width: 100%;
        }

        .markdown-body {
            font-size: 16px !important;
            padding: 15px !important;
        }

        .post-item {
            padding: 8px 0;
        }

        .back-top,
        .comment-button,
        .theme-toggle {
            width: 35px;
            height: 35px;
            font-size: 16px;
            border-radius: 8px;
        }
    }

    /* 添加渡效果 */
    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    /* 主题切换按钮样式 */
    .theme-toggle {
        position: fixed;
        right: 20px;
        bottom: 120px;  /* 在留言板按钮上方 */
        width: 40px;
        height: 40px;
        background: var(--link-color);
        color: #fff;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: opacity 0.3s;
        opacity: 0.75; /* 添加50%透明度 */
    }

    .theme-toggle:hover {
        opacity: 0.9; /* 悬停时提高透明度 */
    }

    @media (max-width: 768px) {
        .theme-toggle {
            right: 15px;
            bottom: 115px;
        }
    }

    body {
        margin: 0;
        font-family: var(--font-sans);
        background-color: var(--main-bg-color);
        color: var(--main-text-color);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .header {
        background-color: var(--header-bg);
        border-bottom: 1px solid var(--border-color);
        padding: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 10;
    }
    
    .header.hidden {
        transform: translateY(-100%);
    }

    /* 当鼠标悬停在header区域时显示 */
    .header:hover {
        transform: translateY(0);
    }

    /* 添加一个透明的触发区域 */
    .header::before {
        content: '';
        position: absolute;
        top: -20px;
        left: 0;
        right: 0;
        height: 20px;
    }

    .header .site-logo {
        width: 50px;  /* 增加宽度 */
        height: 50px;  /* 增加高度 */
        border-radius: 50%;
        object-fit: cover;
        margin-left: 20px;  /* 向右移动 */
        transition: transform 0.6s ease;  /* 添加过渡效果 */
    }

    .header .site-logo:hover {
        transform: rotate(360deg);  /* 悬停时旋转360度 */
    }

    .header .header-center {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    .header .header-right {
        display: flex;
        gap: 20px;
        margin-right: 20px;
        align-items: center;
    }
    .header a {
        color: var(--main-text-color);
        text-decoration: none;
        font-family: var(--font-serif);
    }
    .header .header-center a {
        font-size: 1.5rem;
        font-weight: 600;
    }
    .header .header-right a {
        font-size: 1rem;
        opacity: 0.8;
        transition: opacity 0.2s ease;
        text-decoration: none;
        color: var(--main-text-color);
    }
    .header .header-right a:hover {
        opacity: 1;
        color: var(--link-color);
    }
    .header .header-right a:not(:last-child)::after {
        content: '|';
        margin-left: 20px;
        color: var(--main-text-color); /* 使用主文本颜色 */
        opacity: 0.5;
    }
    .header .header-right a:not(:last-child)::after {
        margin-left: 20px;
    }
    .layout {
        display: flex;
        width: 100%;
    }
    .sidebar, .toc {
        width: 250px;
        flex: 0 0 250px;
        padding: 20px;
        position: sticky;
        top: 0;
        height: 100vh;
        overflow-y: auto;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    /* 侧边栏隐藏状态 */
    .sidebar.collapsed {
        transform: translateX(-100%);
        opacity: 0;
        position: absolute;
        z-index: 50;
    }

    /* 当侧边栏收起时，内容区域占满 */
    .content.full-width {
        margin-left: 0;
        width: 100%;
    }

    @media (max-width: 768px) {
        .sidebar-toggle {
            left: 15px;
            bottom: 15px;
            width: 35px;
            height: 35px;
            font-size: 16px;
        }
    }

    .content {
        flex: 1;
        min-width: 0;
        padding: 30px 50px;
        overflow-y: auto;
    }
    .post-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .post-item {
        border-radius: 8px;
        margin: 8px 0;
        transition: all 0.3s ease;
        background: var(--content-bg);  /* 添加背景色 */
        border: 1px solid var(--border-color);  /* 添加边框 */
        overflow: hidden;  /* 确保内容不会溢出圆角 */
    }
    .post-item:hover {
        transform: translateX(4px);
        background-color: var(--hover-bg);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);  /* 悬停时添加阴影 */
    }
    .post-item a {
        padding: 16px;  /* 增加内边距 */
        display: block;
        color: var(--main-text-color);
        text-decoration: none;
        transition: all 0.2s ease;
    }
    .post-title {
        font-size: 1rem;
        margin-bottom: 5px;
    }
    .post-date {
        font-size: 0.8rem;
        color: var(--main-text-color);
        opacity: 0.6;
    }
    .post-item:hover .post-title {
        color: var(--link-color);
    }
    @media (max-width: 1200px) {
        .toc {
            display: none;
        }
        .content {
            padding: 30px;
        }
    }
    @media (max-width: 900px) {
        .sidebar {
            display: none;
        }
        .content {
            padding: 20px;
        }
    }
    .zoom-counter {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 1000;
        display: none;
    }
    /* 返回顶部按钮 */
    .back-top {
        position: fixed;
        right: 20px;
        bottom: 20px;
        width: 40px;
        height: 40px;
        background: var(--link-color);
        color: #fff;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0; /* 初始状态为完全透明(隐藏) */
        transition: opacity 0.3s;
        z-index: 100;
    }

    .back-top.show {
        opacity: 0.75; /* 显示时为50%透明度 */
    }

    .back-top:hover {
        opacity: 0.9; /* 悬停时提高透明度 */
    }

    @media (max-width: 768px) {
        .back-top {
            right: 15px;
            bottom: 15px;
        }
    }
    /* 自定义滚动条样式 */
    .sidebar::-webkit-scrollbar,
    .toc::-webkit-scrollbar,
    .content::-webkit-scrollbar {
        width: 6px;
    }
    .sidebar::-webkit-scrollbar-thumb,
    .toc::-webkit-scrollbar-thumb,
    .content::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-color);
        border-radius: 3px;
    }
    .sidebar::-webkit-scrollbar-track,
    .toc::-webkit-scrollbar-track,
    .content::-webkit-scrollbar-track {
        background: transparent;
    }
    .content.markdown-body {
        background-color: var(--content-bg) !important;
        color: var(--main-text-color) !important;
        padding: 30px !important;
        border-radius: 12px !important;
        border: 1px solid var(--border-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .markdown-body {
        background-color: var(--content-bg) !important;
        color: var(--main-text-color) !important;
        font-size: 17px !important;  
        line-height: 1.8 !important;
        font-weight: 400 !important; /* 增加基础字重 */
        font-family: var(--font-sans) !important;
    }
    .markdown-body img {
        border-radius: 8px;
        margin: 16px 0;
    }
    .markdown-body pre {
        border-radius: 8px !important;
        margin: 16px 0 !important;
        font-family: var(--font-mono) !important;
    }
    .markdown-body blockquote {
        border-radius: 8px;
        background-color: var(--blockquote-bg) !important;
        padding: 16px !important;
        margin: 16px 0 !important;
        font-family: var(--font-serif) !important;
    }
    .markdown-body table {
        border-radius: 8px;
        overflow: hidden;  /* 确保表格边角是圆的 */
        border: 1px solid var(--border-color) !important;
        margin: 16px 0;
    }
    /* 代码块容器圆角 */
    .markdown-body .highlight {
        border-radius: 8px;
        overflow: hidden;
        margin: 16px 0;
    }
    /* 内联代码圆角 */
    .markdown-body code:not([class*="language-"]) {
        border-radius: 4px;
        padding: 2px 6px !important;
    }
    /* 留言板按钮 */
    .comment-button {
        position: fixed;
        right: 20px;
        bottom: 70px;  /* 位于返回顶部按钮上方 */
        width: 40px;
        height: 40px;
        background: var(--link-color);
        color: #fff;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        font-size: 20px;
        transition: opacity 0.3s;
        opacity: 0.75; /* 添加50%透明度 */
    }
    
    .comment-button:hover {
        opacity: 0.9; /* 悬停时提高透明度 */
    }
    
    @media (max-width: 768px) {
        .comment-button {
            right: 15px;
            bottom: 65px;
        }
    }
    .toc ul li {
        border-bottom: 1px solid var(--border-color);
        padding: 8px 0;
    }
    
    .toc ul li:last-child {
        border-bottom: none;
    }
    
    .toc ul li a {
        display: block;
        padding: 4px 0;
        transition: all 0.2s ease;
    }
    
    .toc ul li a:hover {
        padding-left: 8px;
        color: var(--link-color) !important;
    }

    /* 补充 markdown 内容的主题样式 */
    .markdown-body {
        color: var(--main-text-color) !important;
        background-color: var(--content-bg) !important;
    }

    .markdown-body code {
        background-color: var(--code-bg) !important;
        color: var(--main-text-color) !important;
    }

    .markdown-body pre {
        background-color: var(--code-bg) !important;
        border: 1px solid var(--border-color) !important;
    }

    .markdown-body blockquote {
        background-color: var(--blockquote-bg) !important;
        border-left-color: var(--border-color) !important;
    }

    .markdown-body table tr {
        background-color: var(--content-bg) !important;
        border-color: var(--border-color) !important;
    }

    .markdown-body table tr:nth-child(2n) {
        background-color: var(--code-bg) !important;
    }

    /* 优化滚动条样式 */
    .sidebar::-webkit-scrollbar-thumb,
    .toc::-webkit-scrollbar-thumb,
    .content::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-color);
    }

    /* 优化文章列表悬停效果 */
    .post-item:hover {
        background-color: var(--hover-bg);
    }

    /* 优化目录样式 */
    .toc ul li {
        border-color: var(--border-color);
    }

    /* 优化日期颜色 */
    .post-date {
        color: var(--main-text-color);
        opacity: 0.6;
    }

    /* 图片灯箱背景色适配 */
    .medium-zoom-overlay {
        background: var(--main-bg-color) !important;
    }

    /* 主题切换按钮优化 */
    .theme-toggle {
        background: var(--link-color);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* 返回顶部按钮优化 */
    .back-top {
        background: var(--link-color);
    }

    /* 留言按钮优化 */
    .comment-button {
        background: var(--link-color);
    }

    /* 修改代码块背景色 */
    .markdown-body pre code {
        background-color: var(--code-bg) !important;
    }

    /* 修改引用块背景色 */
    .markdown-body blockquote {
        background-color: var(--blockquote-bg) !important;
        border-left-color: var(--border-color) !important;
    }

    /* 优化 markdown 内容的样式 */
    .markdown-body {
        background-color: var(--content-bg) !important;
        color: var(--main-text-color) !important;
        font-size: 17px !important;  
        line-height: 1.8 !important;
        font-weight: 400 !important; /* 增加基础字重 */
    }

    /* 优化段落和边框 */
    .markdown-body p {
        margin: 16px 0;
        line-height: 1.8;
        font-size: 17px !important;
        font-weight: 400 !important; /* 增加段落字重 */
    }

    /* 优化标题样式 */
    .markdown-body h1 {
        font-size: 28px !important;
        margin-top: 32px;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-color);
        font-weight: 600 !important; /* 增加 h1 字重 */
    }

    .markdown-body h2 {
        font-size: 24px !important;
        margin-top: 32px;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-color);
        font-weight: 600 !important; /* 增加 h2 字重 */
    }

    .markdown-body h3 {
        font-size: 20px !important;
        margin-top: 32px;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-color);
        font-weight: 600 !important; /* 增加 h3 字重 */
    }

    .markdown-body h4 {
        font-size: 18px !important;
        margin-top: 24px;
        margin-bottom: 16px;
        font-weight: 600 !important; /* 增加 h4 字重 */
    }

    .markdown-body h5, .markdown-body h6 {
        font-size: 16px !important;
        margin-top: 24px;
        margin-bottom: 16px;
        font-weight: 600 !important; /* 增加 h5/h6 字重 */
    }

    /* 优化列表项样式 */
    .markdown-body ul li,
    .markdown-body ol li {
        padding: 4px 0;
        font-size: 17px !important;
        font-weight: 400 !important; /* 增加列表项字重 */
        border-bottom: 1px solid var(--border-color);
    }

    /* 优化代码块样式 */
    .markdown-body pre {
        background-color: var(--code-bg) !important;
        border: 1px solid var(--border-color) !important;
        padding: 16px;
        margin: 16px 0;
        border-radius: 6px;
        font-size: 15px !important;
    }

    .markdown-body code {
        font-size: 15px !important;
    }

    /* 优化引用块样式 */
    .markdown-body blockquote {
        background-color: var(--blockquote-bg) !important;
        border-left: 4px solid var(--border-color) !important;
        padding: 16px;
        margin: 16px 0;
        color: var(--main-text-color) !important;
        opacity: 0.9;
        font-size: 17px !important;
        font-weight: 400 !important; /* 增加引用块字重 */
    }

    /* 优化表格样式 */
    .markdown-body table {
        border: 1px solid var(--border-color);
        margin: 16px 0;
        border-collapse: collapse;
    }

    .markdown-body table th,
    .markdown-body table td {
        padding: 8px 16px;
        border: 1px solid var(--border-color);
    }

    .markdown-body table tr {
        background-color: var(--content-bg) !important;
        border-top: 1px solid var(--border-color);
    }

    .markdown-body table tr:nth-child(2n) {
        background-color: var(--code-bg) !important;
    }

    /* 代码块容器样式 */
    .markdown-body pre {
        position: relative;
        background-color: var(--code-bg) !important;
        border: 1px solid var(--border-color) !important;
        padding: 16px;
        margin: 16px 0;
        border-radius: 6px;
    }

    /* 机诗词样式 */
    .welcome-poem {
        text-align: center;
        padding: 60px 20px;
        max-width: 600px;
        margin: 0 auto;
    }

    .poem-content {
        font-size: 24px;
        color: var(--main-text-color);
        font-family: var(--font-serif);
        line-height: 1.8;
        margin-bottom: 20px;
    }

    .poem-author {
        font-size: 16px;
        color: var(--main-text-color);
        opacity: 0.8;
        font-family: var(--font-serif);
    }

    .poem-title {
        font-size: 16px;
        color: var(--main-text-color);
        opacity: 0.8;
        font-family: var(--font-serif);
        margin-top: 10px;
    }

    /* 目录为空时的样式 */
    .toc-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: auto;
        min-height: 150px;
        padding: 2rem;
        margin: 1rem;
        border: 2px dashed var(--border-color);
        border-radius: 8px;
        background-color: var(--content-bg);
        color: var(--main-text-color);
        opacity: 0.5;
    }

    .toc-empty-icon {
        font-size: 10rem;
        margin-bottom: 5rem;
        color: var(--text-color-secondary);
    }

    .toc-empty-text {
        font-size: 1.4rem;
        color: var(--text-color-secondary);
        font-weight: 500;
    }
    
    .pagination button {
        padding: 0.375rem 0.75rem;
        border: 1px solid var(--border-color);
        background: var(--content-bg);
        color: var(--main-text-color);
        cursor: pointer;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        min-width: 3rem;
    }
    
    .pagination button:hover:not(:disabled) {
        background: var(--hover-bg);
    }
    
    .pagination button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .pagination span {
        color: var(--main-text-color);
        font-size: 0.875rem;
        min-width: 1rem;
        text-align: center;
    }

    /* 代码高亮样式 */
    pre {
        background-color: var(--code-bg);
        border-radius: 6px;
        padding: 1rem;
        margin: 1rem 0;
        overflow-x: auto;
        position: relative;
    }

    code {
        font-family: var(--font-mono);
        font-size: 0.9em;
        line-height: 1.5;
    }

    /* 行内代码样式 */
    p code, li code {
        background-color: var(--code-bg);
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-size: 0.9em;
        color: var(--link-color);
    }

    /* 代码块语法高亮 */
    .hljs {
        display: block;
        overflow-x: auto;
        padding: 1em;
        color: var(--main-text-color);
        background: var(--code-bg);
    }

    .hljs-comment,
    .hljs-quote {
        color: #6a737d;
        font-style: italic;
    }

    .hljs-keyword,
    .hljs-selector-tag {
        color: #d73a49;
    }

    .hljs-string,
    .hljs-doctag,
    .hljs-template-variable {
        color: #032f62;
    }

    .hljs-title,
    .hljs-section,
    .hljs-selector-id {
        color: #6f42c1;
    }

    .hljs-variable,
    .hljs-template-variable {
        color: #e36209;
    }

    .hljs-type,
    .hljs-built_in {
        color: #005cc5;
    }

    .hljs-number,
    .hljs-literal {
        color: #005cc5;
    }

    .hljs-tag,
    .hljs-name,
    .hljs-selector-class,
    .hljs-selector-attr,
    .hljs-selector-pseudo {
        color: #22863a;
    }

    .hljs-attribute {
        color: #6f42c1;
    }

    .hljs-symbol,
    .hljs-bullet {
        color: #005cc5;
    }

    .hljs-subst {
        color: #24292e;
    }

    .hljs-regexp,
    .hljs-deletion {
        color: #b31d28;
        background: #ffeef0;
    }

    .hljs-addition {
        color: #22863a;
        background: #f0fff4;
    }

    .hljs-emphasis {
        font-style: italic;
    }

    .hljs-strong {
        font-weight: bold;
    }

    /* 深色主代码高亮 */
    :root[data-theme='dark'] .hljs {
        background: var(--dark-code-bg);
    }

    :root[data-theme='dark'] .hljs-comment,
    :root[data-theme='dark'] .hljs-quote {
        color: #8b949e;
    }

    :root[data-theme='dark'] .hljs-keyword,
    :root[data-theme='dark'] .hljs-selector-tag {
        color: #ff7b72;
    }

    :root[data-theme='dark'] .hljs-string,
    :root[data-theme='dark'] .hljs-doctag {
        color: #a5d6ff;
    }

    :root[data-theme='dark'] .hljs-title,
    :root[data-theme='dark'] .hljs-section,
    :root[data-theme='dark'] .hljs-selector-id {
        color: #d2a8ff;
    }

    :root[data-theme='dark'] .hljs-variable,
    :root[data-theme='dark'] .hljs-template-variable {
        color: #ffa657;
    }

    :root[data-theme='dark'] .hljs-type,
    :root[data-theme='dark'] .hljs-built_in {
        color: #79c0ff;
    }

    :root[data-theme='dark'] .hljs-number,
    :root[data-theme='dark'] .hljs-literal {
        color: #79c0ff;
    }

    :root[data-theme='dark'] .hljs-tag,
    :root[data-theme='dark'] .hljs-name,
    :root[data-theme='dark'] .hljs-selector-class,
    :root[data-theme='dark'] .hljs-selector-attr,
    :root[data-theme='dark'] .hljs-selector-pseudo {
        color: #7ee787;
    }

    :root[data-theme='dark'] .hljs-attribute {
        color: #d2a8ff;
    }

    :root[data-theme='dark'] .hljs-symbol,
    :root[data-theme='dark'] .hljs-bullet {
        color: #79c0ff;
    }

    :root[data-theme='dark'] .hljs-regexp,
    :root[data-theme='dark'] .hljs-deletion {
        color: #ffa198;
        background: #490202;
    }

    :root[data-theme='dark'] .hljs-addition {
        color: #7ee787;
        background: #033a16;
    }

    /* 代码块复制按钮样式 */
    .code-copy {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 8px 16px;
        font-size: 14px;
        color: var(--main-text-color);
        background: var(--content-bg);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        opacity: 0;
        transition: opacity 0.2s ease;
        cursor: pointer;
        z-index: 10;
        min-width: 70px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    pre {
        position: relative;
        padding-top: 2.5em !important;  /* 为复制按钮留出空间 */
    }

    pre:hover .code-copy {
        opacity: 1;
    }

    .code-copy:hover {
        background: var(--hover-bg);
    }

    .code-copy.copied {
        background: #28a745;
        color: white;
        border-color: #28a745;
    }

    /* 添加目录相的样式 */
    .toc {
        width: var(--sidebar-width);
        padding: 20px;
        position: sticky;
        top: 0;
        height: 100vh;
        overflow-y: auto;
        border-left: 1px solid var(--border-color);
        background: var(--main-bg-color);
        scroll-behavior: smooth;
        scrollbar-gutter: stable;
        /* 隐藏滚动条但保持功能 */
        -ms-overflow-style: none;
        scrollbar-width: none;
        /* 添加平滑滚动效果 */
        scroll-snap-type: y proximity;
        overscroll-behavior: contain;
        /* 添加滚动动画 */
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* 隐藏滚动条 */
    .toc::-webkit-scrollbar {
        display: none;
    }

    .toc-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .toc-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        scroll-snap-align: start;
        padding: 8px 12px;
        margin: 4px 0;
        border-radius: 4px;
    }

    .toc-item:hover {
        background: var(--hover-bg);
    }

    .toc-link {
        color: var(--main-text-color);
        text-decoration: none;
        display: block;
        line-height: 1.5;
    }

    /* 不同层级标题的样式 */
    .toc-h1 { 
        padding-left: 0;
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 0.8rem;
    }

    .toc-h2 { 
        padding-left: 1.2rem;
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 0.6rem;
    }

    .toc-h3 { 
        padding-left: 2.4rem;
        font-size: 0.8rem;
        font-weight: 500;
        margin-bottom: 0.4rem;
    }

    .toc-h4 { 
        padding-left: 3.6rem;
        font-size: 0.7rem;
        color: var(--text-color-secondary);
        margin-bottom: 0.4rem;
    }

    .toc-h5 { 
        padding-left: 4.8rem;
        font-size: 0.6rem;
        color: var(--text-color-secondary);
        margin-bottom: 0.4rem;
    }

    .toc-h6 { 
        padding-left: 6rem;
        font-size: 0.6rem;
        color: var(--text-color-secondary);
        margin-bottom: 0.4rem;
    }

    /* 目录项悬停效果 */
    .toc-item:hover .toc-link {
        color: var(--link-color);
    }

    /* 当前激活目录项 */
    .toc-item.active {
        background: var(--hover-bg);
    }

    .toc-item.active .toc-link {
        color: var(--link-color);
    }

    /* 目录为空时的样式 */
    .toc-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--main-text-color);
        opacity: 0.5;
    }

    .toc-empty-icon {
        font-size: 48px;
        margin-bottom: 10px;
    }

    .toc-empty-text {
        font-size: 14px;
    }

    /* 图片灯箱样式 */
    .medium-zoom-overlay {
        background: var(--main-bg-color) !important;
        z-index: 1000;
    }

    .medium-zoom-image--opened {
        z-index: 1001;
    }

    .zoom-counter {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 1002;
        display: none;
    }

    /* 图片样式 */
    .markdown-body img {
        max-width: 100%;
        cursor: zoom-in;
        transition: all 0.3s ease;
    }

    .markdown-body img:hover {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    /* API 限额信息样式 */
    .api-limit-info {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 16px;  /* 减小内边距 */
        background: var(--content-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        font-size: 0.85rem;  /* 减小字体大小 */
        color: var(--text-color-secondary);
        z-index: 100;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: none;
    }

    .api-limit-info p {
        margin: 2px 0;  /* 减小段落间距 */
        display: flex;
        align-items: center;
        gap: 6px;  /* 减小图标和文字的间距 */
    }

    .api-limit-info .progress-bar {
        width: 100%;
        height: 3px;  /* 减小进度条高度 */
        background: var(--border-color);
        border-radius: 1.5px;
        overflow: hidden;
        margin-top: 4px;  /* 减小部间距 */
    }

    /* 只在 PC 端主页显示 API 限额信息 */
    @media (min-width: 769px) {
        body.is-home .api-limit-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
    }

    /* 移动端样式优化 */
    @media (max-width: 768px) {
        .layout {
            flex-direction: column;
        }

        .sidebar {
            position: static;
            width: 100%;
            height: auto;
            padding: 10px;
            overflow: visible;
        }

        .toc {
            display: none;
        }

        .content {
            padding: 15px;
            width: 100%;
            box-sizing: border-box;
        }

        /* 在主页时显示文章列表 */
        body.is-home .content {
            display: none;
        }

        body.is-home .sidebar {
            display: block;
        }

        /* 在文章页面时隐藏侧栏 */
        body:not(.is-home) .sidebar {
            display: none;
        }

        body:not(.is-home) .content {
            display: block;
        }

        .header {
            padding: 10px;
        }

        .header .header-center a {
            font-size: 1.2rem;
        }

        .header .header-right {
            margin-right: 10px;
            gap: 10px;
        }

        .header .header-right a {
            font-size: 0.9rem;
        }

        .markdown-body {
            font-size: 16px !important;
        }

        .markdown-body h1 {
            font-size: 24px !important;
        }

        .markdown-body h2 {
            font-size: 20px !important;
        }

        .markdown-body h3 {
            font-size: 18px !important;
        }

        .post-item {
            padding: 8px 0;
        }

        .post-title {
            font-size: 0.9rem;
        }

        .post-date {
            font-size: 0.7rem;
        }

        .welcome-poem {
            padding: 30px 15px;
        }

        .poem-content {
            font-size: 20px;
        }

        .poem-author, .poem-title {
            font-size: 14px;
        }

        /* 移动端按钮位置调整 */
        .back-top {
            right: 15px;
            bottom: 15px;
            width: 35px;
            height: 35px;
            font-size: 16px;
        }

        .comment-button {
            right: 15px;
            bottom: 60px;
            width: 35px;
            height: 35px;
            font-size: 16px;
        }

        .theme-toggle {
            right: 15px;
            bottom: 105px;
            width: 35px;
            height: 35px;
            font-size: 16px;
        }

        /* 移动端代码块优化 */
        .markdown-body pre {
            padding: 12px;
            margin: 12px 0;
            font-size: 14px !important;
        }

        .code-copy {
            padding: 6px 12px;
            font-size: 12px;
            min-width: 60px;
            height: 30px;
        }

        /* 隐藏 API 限额信息 */
        .api-limit-info {
            display: none;
        }
    }

    /* 目录项激活状态样式 */
    .toc-item.active {
        background-color: var(--hover-bg);
        border-radius: 4px;
        position: relative;
        /* 添加过渡效果 */
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .toc-item.active::before {
        content: '';
        position: absolute;
        left: -20px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 70%;
        background-color: var(--link-color);
        border-radius: 2px;
    }

    .toc-item.active .toc-link {
        color: var(--link-color);
        font-weight: 500;
    }

    /* 优化目录项过渡效果 */
    .toc-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        scroll-snap-align: start;
        padding: 8px 12px;
        margin: 4px 0;
        border-radius: 4px;
    }

    .toc-item::before {
        content: '';
        position: absolute;
        left: -20px;
        top: 50%;
        transform: translateY(-50%);
        width: 5px;
        height: 0;
        background-color: var(--link-color);
        border-radius: 2px;
        transition: height 0.3s ease;
    }

    .toc-item:hover::before {
        height: 70%;
    }

    /* 布局容器圆角 */
    .layout > * {
        border-radius: 12px;
        margin: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;  /* 确保内容不会溢出圆角 */
    }

    /* 侧边栏圆角 */
    .sidebar {
        border-radius: 12px;
        background: var(--content-bg);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--border-color);
    }

    /* 主内容区圆角 */
    .content {
        border-radius: 12px;
        background: var(--content-bg);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--border-color);
    }

    /* 目录区域圆角 */
    .toc {
        border-radius: 12px;
        background: var(--content-bg);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--border-color);
    }

    /* 头部导航栏圆角 */
    .header {
        border-radius: 0 0 12px 12px;
        margin: 0 8px 8px 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--border-color);
        border-top: none;
    }

    /* 调整布局间距 */
    .layout {
        gap: 16px;
        padding: 0 8px;
    }

    /* 移动端适配 */
    @media (max-width: 768px) {
        .layout > * {
            margin: 4px;
            border-radius: 8px;
        }
        
        .layout {
            gap: 8px;
            padding: 0 4px;
        }
        
        .header {
            margin: 0 4px 4px 4px;
            border-radius: 0 0 8px 8px;
        }

        .post-item {
            margin: 6px 0;
            border-radius: 6px;
        }

        /* 移动端按钮圆角优化 */
        .back-top,
        .comment-button,
        .theme-toggle {
            border-radius: 8px;
        }
    }

    /* 按钮圆角统一处理 */
    button,
    .button {
        border-radius: 8px;
        overflow: hidden;
    }

    /* 代码块圆角 */
    pre {
        border-radius: 8px !important;
    }

    /* 图片圆角 */
    img:not(.site-logo) {
        border-radius: 8px;
    }

    /* 引用块圆角 */
    blockquote {
        border-radius: 8px;
    }

    /* 搜索框和输入框圆角 */
    input,
    textarea {
        border-radius: 8px;
    }

    /* API限额信息圆角 */
    .api-limit-info {
        border-radius: 8px;
    }

    /* 章列表容器样式 */
    .post-list-container {
        position: relative;
        margin-bottom: 20px;  /* 增加底部外边距 */
    }

    .post-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    /* 分页按钮组样式优化 */
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.625rem;
        position: fixed;
        bottom: 0;
        left: 0.9375rem;
        width: calc(var(--sidebar-width));
        background: var(--main-bg-color);
        border-top: 1px solid var(--border-color);
        z-index: 100;
        border-radius: 0.5rem 0.5rem 0 0;
        padding: 0.625rem;
        backdrop-filter: blur(50px);
        background-color: rgba(var(--main-bg-color), 0.8);
    }

    .pagination button {
        padding: 0.375rem 0.75rem;
        border: 1px solid var(--border-color);
        background: var(--content-bg);
        color: var(--main-text-color);
        cursor: pointer;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        min-width: 3rem;
    }

    .pagination button:hover:not(:disabled) {
        background: var(--hover-bg);
    }

    .pagination button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .pagination span {
        color: var(--main-text-color);
        font-size: 0.875rem;
        min-width: 1rem;
        text-align: center;
    }
    
    .pagination input {
        width: 2.5rem;
        text-align: center;
        padding: 0.375rem 0.5rem;
        border: 1px solid var(--border-color);
        background: var(--content-bg);
        color: var(--main-text-color);
        border-radius: 0.25rem;
        font-size: 0.875rem;
        transition: all 0.2s ease;
    }
    
    .pagination input:focus {
        outline: none;
        border-color: var(--link-color);
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    }
    
    .pagination input::-webkit-inner-spin-button,
    .pagination input::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    
    .pagination input[type=number] {
        -moz-appearance: textfield;
    }

    /* 移动端分页样式适配 */
    @media (max-width: 48rem) {
        .pagination {
            width: 100%;
            left: 0;
            padding: 0.5rem;
            border-radius: 0;
        }

        .pagination button {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            min-width: 2.5rem;
        }

        .pagination span {
            font-size: 0.75rem;
            min-width: 4rem;
        }
        
        .pagination input {
            width: 2rem;
            padding: 0.25rem;
            font-size: 0.75rem;
        }
    }

    /* 欢迎诗词样式 - 使用相对单位 */
    .welcome-poem {
        text-align: center;
        padding: 2rem 1.25rem;
        max-width: 37.5rem;
        margin: 0 auto;
    }

    .poem-content {
        font-size: 1.5rem;
        line-height: 1.8;
        margin-bottom: 1.25rem;
    }

    .poem-author,
    .poem-title {
        font-size: 1rem;
    }

    /* API 限额信息样式 - 使用相对单位 */
    .api-limit-info {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        border-radius: 0.5rem;
    }

    /* 移动端适配 */
    @media (max-width: 48rem) {
        .layout {
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.25rem;
        }

        .sidebar, .toc {
            position: static;
            width: 100%;
            height: 70vh; /* 限制高度，确保可滚动 */
            max-height: calc(100vh - 150px);
            flex: none;
            padding: 0.75rem;
            padding-bottom: 60px; /* 为分页控件留出空间 */
            overflow-y: auto; /* 允许垂直滚动 */
        }

        .content {
            padding: 0.75rem;
        }

        .header {
            padding: 0.75rem;
        }

        .post-item {
            padding: 0.75rem;
        }

        .back-top,
        .comment-button,
        .theme-toggle {
            width: 2rem;
            height: 2rem;
            font-size: 1rem;
            right: 0.75rem;
        }

        .back-top { bottom: 0.75rem; }
        .comment-button { bottom: 3rem; }
        .theme-toggle { bottom: 5.25rem; }

        .welcome-poem {
            padding: 1.5rem 0.75rem;
        }

        .poem-content {
            font-size: 1.25rem;
        }

        .poem-author,
        .poem-title {
            font-size: 0.875rem;
        }

        .code-copy {
            padding: 0.375rem 0.75rem;
            font-size: 0.75rem;
            min-width: 3rem;
            height: 1.75rem;
        }

        /* 移动端特定隐藏/显示逻辑 */
        body.is-home .content { display: none; }
        body.is-home .sidebar { display: block; }
        body:not(.is-home) .sidebar { display: none; }
        body:not(.is-home) .content { display: block; }
        .toc { display: none; }
    }

    /* 图片灯箱样式 - 使用相对单位 */
    .zoom-counter {
        padding: 0.5rem 1rem;
        border-radius: 1.25rem;
        font-size: 0.875rem;
    }

    /* 响应式图片 */
    img {
        max-width: 100%;
        height: auto;
    }

    /* 响应式表格 */
    table {
        width: 100%;
        overflow-x: auto;
        display: block;
    }

    /* 响应式代码块 */
    pre {
        max-width: 100%;
        overflow-x: auto;
    }

    /* 解锁模态框样式 */
    .unlock-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8); /* 半透明背景 */
        backdrop-filter: blur(8px); /* 背景模糊效果 */
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .unlock-content {
        background: var(--content-bg);
        padding: 2.5rem;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        text-align: center;
        max-width: 90%;
        width: 360px;
        border: 1px solid var(--border-color);
        animation: modalFadeIn 0.3s ease;
        display: flex;
        flex-direction: column;
        gap: 1.5rem; /* 添加统一的垂直间距 */
    }

    @keyframes modalFadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .unlock-content h2 {
        color: var(--main-text-color);
        font-size: 1.5rem;
        font-weight: 500;
        margin: 0; /* 移除默认边距 */
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .unlock-content input {
        width: 100%;
        padding: 1rem 1.2rem;
        border: 2px solid var(--border-color);
        border-radius: 12px;
        background: var(--main-bg-color);
        color: var(--main-text-color);
        font-size: 1rem;
        outline: none;
        transition: all 0.3s ease;
        margin: 0; /* 移除默认边距 */
    }

    .unlock-content button {
        width: 100%;
        padding: 1rem 2rem;
        border: none;
        border-radius: 12px;
        background: var(--link-color);
        color: white;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin: 0; /* 移除默认边距 */
    }

    #unlock-error {
        color: #ff4444;
        font-size: 0.9rem;
        margin: 0; /* 移除默认边距 */
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        min-height: 1.2em; /* 保持错误信息的位置稳定 */
    }

    /* 移动端适配 */
    @media (max-width: 768px) {
        .unlock-content {
            padding: 2rem;
            width: 320px;
            gap: 1.2rem; /* 移动端稍微减小间距 */
        }
        
        .unlock-content h2 {
            font-size: 1.3rem;
        }
        
        .unlock-content input {
            padding: 0.8rem 1rem;
            font-size: 0.95rem;
        }
        
        .unlock-content button {
            padding: 0.8rem 1.5rem;
            font-size: 0.95rem;
        }
    }

    /* 搜索框样式 */
    .search-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        max-width: 90%;
        z-index: 1000;
        background: var(--content-bg);
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
        border: 2px solid var(--border-color);
        padding: 20px;
        transition: all 0.3s ease;
    }

    .search-input {
        width: 100%;
        padding: 16px 24px;
        border: 2px solid var(--border-color);
        border-radius: 12px;
        background: var(--main-bg-color);
        color: var(--main-text-color);
        font-size: 18px;
        outline: none;
        transition: all 0.3s ease;
    }

    .search-input:focus {
        border-color: var(--link-color);
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    }

    .search-input::placeholder {
        color: var(--text-color-secondary);
        opacity: 0.7;
    }

    .search-results {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        background: var(--content-bg);
        border: 2px solid var(--border-color);
        border-radius: 12px;
        max-height: 400px;
        overflow-y: auto;
        display: none;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
    }

    .search-results.show {
        display: block;
    }

    .search-result-item {
        padding: 12px 20px;
        cursor: pointer;
        transition: all 0.2s ease;
        border-bottom: 1px solid var(--border-color);
    }

    .search-result-item:last-child {
        border-bottom: none;
    }

    .search-result-item:hover {
        background: var(--hover-bg);
    }

    .search-result-title {
        font-size: 16px;
        color: var(--main-text-color);
        margin-bottom: 4px;
        line-height: 1.4;
    }

    .search-result-highlight {
        color: var(--link-color);
        font-weight: 600;
        background: rgba(37, 99, 235, 0.1);
        padding: 2px 4px;
        border-radius: 4px;
    }

    /* 自定义滚动条样式 */
    .search-results::-webkit-scrollbar {
        width: 8px;
    }

    .search-results::-webkit-scrollbar-track {
        background: transparent;
    }

    .search-results::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-color);
        border-radius: 4px;
    }

    /* 移动端适配 */
    @media (max-width: 768px) {
        .search-container {
            width: 90%;
            padding: 16px;
            top: 40%;
        }

        .search-input {
            padding: 12px 16px;
            font-size: 16px;
        }

        .search-results {
            max-height: 300px;
        }

        .search-result-item {
            padding: 10px 16px;
        }

        .search-result-title {
            font-size: 14px;
        }
    }

    /* 添加搜索图标 */
    .search-icon {
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 20px;
        color: var(--text-color-secondary);
        opacity: 0.7;
        pointer-events: none;
    }

    /* 搜索框容器背景模糊效果 */
    .search-container {
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        background: rgba(var(--content-bg), 0.9);
    }

    /* 搜索结果滚动条美化 */
    .search-results {
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-color) transparent;
    }

    /* 搜索结果项动画效果 */
    .search-result-item {
        transform: translateX(0);
        transition: transform 0.2s ease, background-color 0.2s ease;
    }

    .search-result-item:hover {
        transform: translateX(8px);
    }

    /* 无结果时的样式 */
    .search-result-empty {
        padding: 24px;
        text-align: center;
        color: var(--text-color-secondary);
        font-size: 16px;
    }

    /* 搜索控制按钮样式 */
    .search-toggle {
        position: fixed;
        right: 20px;
        bottom: 165px;  /* 在主题切换按钮上方 */
        width: 40px;
        height: 40px;
        background: var(--link-color);
        color: #fff;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: opacity 0.3s;
        opacity: 0.75;
    }

    .search-toggle:hover {
        opacity: 0.9;
    }

    /* 搜索框隐藏状态 */
    .search-container.hidden {
        opacity: 0;
        visibility: hidden;
        transform: translate(-50%, -60%);
    }

    /* 搜索框显示状态的过渡效果 */
    .search-container {
        transition: all 0.3s ease;
        opacity: 1;
        visibility: visible;
    }

    @media (max-width: 768px) {
        .search-toggle {
            right: 15px;
            bottom: 160px;
            width: 35px;
            height: 35px;
            font-size: 16px;
        }
    }

    /* 按钮基础样式 */
    .back-top,
    .comment-button,
    .theme-toggle,
    .search-toggle {
        position: fixed;
        right: 1.25rem;
        width: 2.5rem;
        height: 2.5rem;
        /* 移除原有的背景色 */
        background: transparent;
        /* 添加毛玻璃效果 */
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        background: rgba(255, 255, 255, 0.1);
        color: var(--main-text-color);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        cursor: pointer;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* 按钮悬停效果 */
    .back-top:hover,
    .comment-button:hover,
    .theme-toggle:hover,
    .search-toggle:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    /* 按钮位置 */
    .back-top {
        bottom: 1.25rem;
    }

    .comment-button {
        bottom: 4.375rem;
    }

    .theme-toggle {
        bottom: 7.5rem;
    }

    .search-toggle {
        bottom: 10.625rem;
    }

    /* 移动端适配 */
    @media (max-width: 48rem) {
        .back-top,
        .comment-button,
        .theme-toggle,
        .search-toggle {
            right: 0.9375rem;
            width: 2.1875rem;
            height: 2.1875rem;
            font-size: 1rem;
        }

        .back-top {
            bottom: 0.9375rem;
        }

        .comment-button {
            bottom: 3.75rem;
        }

        .theme-toggle {
            bottom: 6.5625rem;
        }

        .search-toggle {
            bottom: 9.375rem;
        }
    }

    /* 返回顶部按钮默认隐藏 */
    .back-top {
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .back-top.show {
        opacity: 1;
        visibility: visible;
    }

    /* 搜索遮罩层 */
    .search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 99;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .search-overlay.show {
        opacity: 1;
        visibility: visible;
    }

    /* 调整搜索框层级，确保在遮罩层之上 */
    .search-container {
        z-index: 100;
    }

    /* 在 styles 中添加/修改密码错误提示的样式 */
    .unlock-modal #unlock-error {
        color: #ff4444;
        font-size: 0.9rem;
        margin: 0;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        min-height: 1.2em;
        text-align: center;
    }
</style>
`;

// HTML模板
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${CONFIG.site.title}</title>
    <link rel="icon" href="${CONFIG.site.favicon}" type="image/jpeg">
    <!-- 添加字体链接 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.1.0/style.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-mono-webfont@1.1.0/style.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@4.5.4/index.css" />
    <!-- Meting API -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css">
    <script src="https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js"></script>
    ${styles}
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.2.0/github-markdown.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/medium-zoom/dist/medium-zoom.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css">
    <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>
    <script>
        // 主题切换功能
        function initTheme() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
        }

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        }

        function updateThemeIcon(theme) {
            const themeButton = document.querySelector('.theme-toggle');
            if (themeButton) {
                themeButton.innerHTML = theme === 'dark' ? '🍅' : '🍉';
                themeButton.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
            }
        }

        // 目录初始化函数
        function initializeTOC() {
            // 检查是否是主页
            const isHomePage = window.location.pathname === '/' || window.location.pathname === '/posts';
            if (isHomePage) {
                // 如果是主页，直接显示空目录，不生成目录
                const tocDiv = document.querySelector('.toc');
                if (tocDiv) {
                    tocDiv.innerHTML = '';
                    const emptyToc = document.createElement('div');
                    emptyToc.className = 'toc-empty';
                    emptyToc.style.cssText = 'height: auto; min-height: 150px; padding: 2rem; margin: 1rem;';
                    
                    const icon = document.createElement('div');
                    icon.className = 'toc-empty-icon';
                    icon.style.cssText = 'font-size: 7rem; margin-bottom: 1rem; color: var(--text-color-secondary);';
                    icon.textContent = '📑';
                    
                    const text = document.createElement('div');
                    text.className = 'toc-empty-text';
                    text.style.cssText = 'font-size: 1.4rem; color: var(--text-color-secondary); font-weight: 500;';
                    text.textContent = '暂无目录';
                    
                    emptyToc.appendChild(icon);
                    emptyToc.appendChild(text);
                    tocDiv.appendChild(emptyToc);
                }
                return;
            }

            // 如果不是主页，继续正常的目录生成逻辑
            const contentDiv = document.querySelector('.content');
            const headings = contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const tocDiv = document.querySelector('.toc');
            
            if (headings.length === 0) {
                // 如果没有标题，显示空目录提示
                if (tocDiv) {
                    tocDiv.innerHTML = '';
                    const emptyToc = document.createElement('div');
                    emptyToc.className = 'toc-empty';
                    emptyToc.style.cssText = 'height: auto; min-height: 150px; padding: 2rem; margin: 1rem;';
                    
                    const icon = document.createElement('div');
                    icon.className = 'toc-empty-icon';
                    icon.style.cssText = 'font-size: 7rem; margin-bottom: 1rem; color: var(--text-color-secondary);';
                    icon.textContent = '📑';
                    
                    const text = document.createElement('div');
                    text.className = 'toc-empty-text';
                    text.style.cssText = 'font-size: 1.4rem; color: var(--text-color-secondary); font-weight: 500;';
                    text.textContent = '暂无目录';
                    
                    emptyToc.appendChild(icon);
                    emptyToc.appendChild(text);
                    tocDiv.appendChild(emptyToc);
                }
                return;
            }

            // 创建目录列表
            const tocList = document.createElement('ul');
            tocList.className = 'toc-list';
            
            // 创建标题ID到目录项的映射
            const tocItemsMap = new Map();
            
            headings.forEach(function(heading, index) {
                heading.id = 'heading-' + index;
                
                const li = document.createElement('li');
                li.className = 'toc-item toc-' + heading.tagName.toLowerCase();
                
                const a = document.createElement('a');
                a.href = '#' + heading.id;
                a.className = 'toc-link';
                a.textContent = heading.textContent;
                
                a.onclick = function(e) {
                    e.preventDefault();
                    heading.scrollIntoView({ behavior: 'smooth' });
                    // 更新URL hash但不触发滚动
                    history.pushState(null, null, '#' + heading.id);
                };
                
                li.appendChild(a);
                tocList.appendChild(li);
                
                // 存储映射关系
                tocItemsMap.set(heading.id, li);
            });
            
            if (tocDiv) {
                tocDiv.innerHTML = '';
                tocDiv.appendChild(tocList);
            }

            // 创建并配置 IntersectionObserver
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: Array.from({length: 100}, (_, i) => i / 100)
            };

            const observer = new IntersectionObserver((entries) => {
                // 获取所有标题元素的位置信息
                const headingPositions = Array.from(headings).map(heading => {
                    const { top } = heading.getBoundingClientRect();
                    return {
                        id: heading.id,
                        top: top,
                        element: heading
                    };
                });

                // 获取视口高度和滚动位置
                const viewportHeight = window.innerHeight;
                const scrollTop = window.scrollY;
                
                // 找到当前应该激活的标题
                let activeHeadingId = null;
                
                // 遍历所有标题位置
                for (let i = 0; i < headingPositions.length; i++) {
                    const current = headingPositions[i];
                    const next = headingPositions[i + 1];
                    
                    // 计算当前标题的内容区域
                    const contentTop = current.top + scrollTop;
                    const contentBottom = next ? next.top + scrollTop : document.documentElement.scrollHeight;
                    
                    // 检查视口是否在这个内容区域内
                    if (scrollTop >= contentTop - viewportHeight/3 && 
                        scrollTop < contentBottom - viewportHeight/3) {
                        activeHeadingId = current.id;
                        break;
                    }
                }

                // 如果没有找到活动标题，而且页面滚动到底部，激活最后一个标题
                if (!activeHeadingId && 
                    scrollTop + viewportHeight > document.documentElement.scrollHeight - 50) {
                    activeHeadingId = headingPositions[headingPositions.length - 1]?.id;
                }

                // 如果没有找到活动标题，并且页面在顶部，激活第一个标题
                if (!activeHeadingId && scrollTop < viewportHeight/2) {
                    activeHeadingId = headingPositions[0]?.id;
                }

                // 更新目录激活状态
                if (activeHeadingId) {
                    // 移除所有激活状态
                    document.querySelectorAll('.toc-item').forEach(item => {
                        item.classList.remove('active');
                    });

                    // 激活当前项
                    const tocItem = tocItemsMap.get(activeHeadingId);
                    if (tocItem) {
                        tocItem.classList.add('active');
                        
                        // 平滑滚动目录
                        const tocContainer = document.querySelector('.toc');
                        if (tocContainer) {
                            const tocRect = tocContainer.getBoundingClientRect();
                            const itemRect = tocItem.getBoundingClientRect();
                            
                            const targetScroll = tocContainer.scrollTop + 
                                (itemRect.top - tocRect.top) - 
                                (tocRect.height / 2) + 
                                (itemRect.height / 2);
                            
                            tocContainer.scrollTo({
                                top: targetScroll,
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            }, observerOptions);

            // 观察所有标题元素
            headings.forEach(heading => observer.observe(heading));
        }

        // 添加代码块复制按钮函数
        function addCopyButton(block) {
            const pre = block.parentElement;
            pre.style.position = 'relative';
            
            const button = document.createElement('button');
            button.className = 'code-copy';
            button.textContent = '复制';
            button.style.position = 'absolute';
            button.style.right = '8px';
            button.style.top = '8px';
            
            button.onclick = async () => {
                try {
                    await navigator.clipboard.writeText(block.textContent);
                    button.textContent = '已复制';
                    button.classList.add('copied');
                    setTimeout(() => {
                        button.textContent = '复制';
                        button.classList.remove('copied');
                    }, 1500);
                } catch (err) {
                    console.error('复制失败:', err);
                    button.textContent = '复制失败';
                    setTimeout(() => {
                        button.textContent = '复制';
                    }, 1500);
                }
            };
            
            pre.appendChild(button);
        }

        // 修改原有window.onload函数
        window.addEventListener('load', function() {
            // 初始化主题
            initTheme();
            
            const contentDiv = document.getElementById('content');
            if (contentDiv && contentDiv.hasAttribute('data-markdown')) {
                const markdown = decodeURIComponent(contentDiv.getAttribute('data-markdown'));
                contentDiv.removeAttribute('data-markdown');
                contentDiv.innerHTML = marked.parse(markdown);

                // 初始化图片灯箱
                const zoom = mediumZoom('img:not(.site-logo)', {
                    margin: 24,
                    background: getComputedStyle(document.documentElement)
                        .getPropertyValue('--main-bg-color'),
                    scrollOffset: 0,
                });

                // 为文章中的所有链接添加 target="_blank"
                const links = contentDiv.getElementsByTagName('a');
                for (let link of links) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }

                // 初始化目录
                initializeTOC();

                // 处理代码块
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightBlock(block);
                    addCopyButton(block);
                });
            }

            // 初始化搜索功能
            initSearch();
            
            // 初始化SPA功能
            initSPA();

            // 初始化返回顶部按钮
            initBackToTop();

            // 初始化PDF查看器功能
            initPdfViewer();
        });

        // 添加滚动监听
        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const header = document.querySelector('.header');
                    const currentScrollY = window.scrollY;
                    
                    if (currentScrollY > lastScrollY && currentScrollY > 100) {
                        header.classList.add('hidden');
                    } else {
                        header.classList.remove('hidden');
                    }
                    
                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                
                ticking = true;
            }
        });

        // 返回顶部按钮初始化函数
        function initBackToTop() {
            const backTop = document.querySelector('.back-top');
            if (backTop) {
                // 监听滚动事件，控制按钮显示/隐藏
                window.addEventListener('scroll', () => {
                    if (window.pageYOffset > 300) {
                        backTop.classList.add('show');
                    } else {
                        backTop.classList.remove('show');
                    }
                });
                
                // 点击事件处理
                backTop.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
        }

        // 在页面加载完成后重新初始化返回顶部按钮
        function reinitializePageFeatures() {
            // 重新初始化Markdown渲染
            const contentDiv = document.getElementById('content');
            if (contentDiv && contentDiv.hasAttribute('data-markdown')) {
                const markdown = decodeURIComponent(contentDiv.getAttribute('data-markdown'));
                contentDiv.removeAttribute('data-markdown');
                contentDiv.innerHTML = marked.parse(markdown);
                
                // 处理所有链接，添加新标签页打开属性
                const links = contentDiv.getElementsByTagName('a');
                for (let i = 0; i < links.length; i++) {
                    const link = links[i];
                    // 只处理外部链接，不处理页内锚点链接
                    if (!link.getAttribute('href').startsWith('#')) {
                        link.setAttribute('target', '_blank');
                        link.setAttribute('rel', 'noopener noreferrer');
                    }
                }
            }
            
            // 重新初始化代码高亮
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
                addCopyButton(block);
            });
            
            // 重新初始化图片灯箱
            const zoom = mediumZoom('img:not(.site-logo)', {
                margin: 24,
                background: getComputedStyle(document.documentElement)
                    .getPropertyValue('--main-bg-color'),
                scrollOffset: 0,
            });
            
            // 重新初始化目录
            initializeTOC();

            // 重新初始化返回顶部按钮
            initBackToTop();

            // 重新初始化PDF查看器
            initPdfViewer();

            // 添加: 重新初始化分页功能
            initPagination();
        }

        // 添加: 分页功能初始化函数
        function initPagination() {
            const prevButton = document.getElementById('prevPage');
            const nextButton = document.getElementById('nextPage');
            const pageInput = document.getElementById('pageInput');
            
            if (prevButton && nextButton && pageInput) {
                // 使用函数声明而不是箭头函数
                prevButton.onclick = function() {
                    changePage(-1);
                };
                nextButton.onclick = function() {
                    changePage(1);
                };
                
                // 添加页码输入框事件
                if (pageInput) {
                    pageInput.onkeydown = function(event) {
                        if (event.key === 'Enter') {
                            goToPage(this.value);
                        }
                    };
                }
                
                // 确保当前页码状态正确
                const currentPage = parseInt(pageInput.value);
                const totalPages = parseInt(pageInput.max);
                
                // 更新按钮状态
                prevButton.disabled = currentPage === 1;
                nextButton.disabled = currentPage === totalPages;
            }
        }

        // 修改 changePage 函数，使其成为全局函数
        window.changePage = function(delta) {
            const prevButton = document.getElementById('prevPage');
            const nextButton = document.getElementById('nextPage');
            const pageInput = document.getElementById('pageInput');
            
            if (!pageInput) return;
            
            // 获取当前页码和总页数
            const current = parseInt(pageInput.value);
            const total = parseInt(pageInput.max);
            const newPage = current + delta;
            
            if (newPage >= 1 && newPage <= total) {
                // 使用常规字符串拼接而不是模板字符串
                const currentItems = document.querySelectorAll('.post-item[data-page="' + current + '"]');
                const newItems = document.querySelectorAll('.post-item[data-page="' + newPage + '"]');
                
                // 隐藏当前页的文章
                currentItems.forEach(function(item) {
                    item.style.display = 'none';
                });
                
                // 显示新页的文章
                newItems.forEach(function(item) {
                    item.style.display = 'block';
                });
                
                // 更新按钮状态
                prevButton.disabled = newPage === 1;
                nextButton.disabled = newPage === total;
                
                // 更新输入框
                pageInput.value = newPage;
            }
        };
        
        // 添加全局页码跳转函数
        window.goToPage = function(pageNum) {
            const prevButton = document.getElementById('prevPage');
            const nextButton = document.getElementById('nextPage');
            const pageInput = document.getElementById('pageInput');
            
            if (!pageInput) return;
            
            const current = parseInt(pageInput.value);
            const total = parseInt(pageInput.max);
            pageNum = parseInt(pageNum);
            
            // 检查页码是否有效，如果无效则恢复为当前页码
            if (isNaN(pageNum) || pageNum < 1 || pageNum > total) {
                pageInput.value = current;
                return;
            }
            
            // 如果新页码与当前相同，不做任何操作
            if (pageNum === current) {
                return;
            }
            
            // 开始页面切换
            // 隐藏当前页的文章
            const currentItems = document.querySelectorAll('.post-item[data-page="' + current + '"]');
            currentItems.forEach(function(item) {
                item.style.display = 'none';
            });
            
            // 显示新页的文章
            const newItems = document.querySelectorAll('.post-item[data-page="' + pageNum + '"]');
            newItems.forEach(function(item) {
                item.style.display = 'block';
            });
            
            // 更新按钮状态
            prevButton.disabled = pageNum === 1;
            nextButton.disabled = pageNum === total;
            
            // 更新输入框
            pageInput.value = pageNum;
        };
    </script>
</head>
<body class="{{page_class}}">
    <header class="header">
        <a href="https://github.com/1143520/git-blog-share" target="_blank" rel="noopener noreferrer">
            <img src="${CONFIG.site.favicon}" alt="站点图标" class="site-logo">
        </a>
        <div class="header-center">
            <a href="/">${CONFIG.site.title}</a>
        </div>
        <div class="header-right">
            <a href="https://www.nodeseek.com/space/9191#/general" target="_blank" rel="noopener noreferrer">🥕Nodeseek</a>
            <a href="https://manji.1143520.xyz/" target="_blank" rel="noopener noreferrer">🍇漫记</a>
            <a href="https://music.163.com/" target="_blank" rel="noopener noreferrer">🍒音乐</a>
        </div>
    </header>
    <div class="layout">
        <nav class="sidebar">
            {{post_list}}
        </nav>
        <main class="content markdown-body">
            {{content}}
        </main>
        <aside class="toc">
            {{toc}}
        </aside>
    </div>
    <button class="back-top" aria-label="返回顶部">🌶️</button>
    <button class="comment-button" onclick="toggleSidebar()" aria-label="切换侧边栏">🥝</button>
    <button class="theme-toggle" onclick="toggleTheme()" aria-label="切换主题">🍅</button>
    <div class="search-overlay"></div>
    <div class="search-container hidden">
        <input type="text" class="search-input" placeholder="搜索文章..." aria-label="搜索文章">
        <span class="search-icon">🔍</span>
        <div class="search-results"></div>
    </div>
    <button class="search-toggle" onclick="toggleSearch()" aria-label="切换搜索">🔍</button>
    {{api_limit_info}}
    <div class="music-player">
        <meting-js
            server="${CONFIG.musicPlayer.server}"
            type="${CONFIG.musicPlayer.type}"
            id="${CONFIG.musicPlayer.id}"
            fixed="${CONFIG.musicPlayer.fixed}"
            mini="${CONFIG.musicPlayer.mini}"
            autoplay="${CONFIG.musicPlayer.autoplay}"
            theme="${CONFIG.musicPlayer.theme}"
            preload="${CONFIG.musicPlayer.preload}"
            volume="${CONFIG.musicPlayer.volume}"
            list-folded="${CONFIG.musicPlayer.listFolded}"
            order="${CONFIG.musicPlayer.order}">
        </meting-js>
    </div>
</body>
<script>
    // 搜索框显示/隐藏控制
    function toggleSearch() {
        const searchContainer = document.querySelector('.search-container');
        const searchInput = document.querySelector('.search-input');
        const searchToggle = document.querySelector('.search-toggle');
        const searchOverlay = document.querySelector('.search-overlay');
        
        if (searchContainer.classList.contains('hidden')) {
            searchContainer.classList.remove('hidden');
            searchOverlay.classList.add('show');
            searchInput.focus();
            searchToggle.style.opacity = '0.9';
        } else {
            searchContainer.classList.add('hidden');
            searchOverlay.classList.remove('show');
            searchInput.blur();
            searchToggle.style.opacity = '0.75';
        }
    }

    // 在ESC键处理中添加遮罩层的处理
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const searchContainer = document.querySelector('.search-container');
            const searchToggle = document.querySelector('.search-toggle');
            const searchOverlay = document.querySelector('.search-overlay');
            searchContainer.classList.add('hidden');
            searchOverlay.classList.remove('show');
            searchToggle.style.opacity = '0.75';
        }
    });

    // 点击遮罩层关闭搜索
    document.querySelector('.search-overlay').addEventListener('click', () => {
        const searchContainer = document.querySelector('.search-container');
        const searchToggle = document.querySelector('.search-toggle');
        const searchOverlay = document.querySelector('.search-overlay');
        searchContainer.classList.add('hidden');
        searchOverlay.classList.remove('show');
        searchToggle.style.opacity = '0.75';
    });

    // 搜索功能实现
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    let allPosts = [];

    // 获取所有文章数据
    function getAllPosts() {
        const postItems = document.querySelectorAll('.post-item a');
        allPosts = Array.from(postItems).map(item => ({
            // 直接获取完整标题，包含emoji
            title: item.querySelector('.post-title').textContent,
            url: item.getAttribute('href'),
            element: item
        }));
    }

    // 初始化搜索功能
    function initSearch() {
        getAllPosts();
        
        // 防抖函数
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // 搜索处理函数
        function handleSearch() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm === '') {
                searchResults.classList.remove('show');
                return;
            }

            const results = allPosts.filter(post => 
                post.title.replace(/[📝💾]\s*/, '').toLowerCase().includes(searchTerm)
            );

            if (results.length > 0) {
                const resultsHtml = results.map(result => {
                    const titleWithoutEmoji = result.title.replace(/[📝💾]\s*/, '');
                    const highlightedTitle = titleWithoutEmoji.replace(
                        new RegExp(searchTerm, 'gi'),
                        function(match) {
                            return '<span class="search-result-highlight">' + match + '</span>';
                        }
                    );
                    const emoji = result.title.match(/[📝💾]\s*/)?.[0] || '';
                    return '<div class="search-result-item" data-url="' + result.url + '">' +
                           '<div class="search-result-title">' + emoji + highlightedTitle + '</div>' +
                           '</div>';
                }).join('');

                searchResults.innerHTML = resultsHtml;
                searchResults.classList.add('show');

                // 修改搜索结果的点击事件处理
                const resultItems = searchResults.querySelectorAll('.search-result-item');
                resultItems.forEach(item => {
                    item.addEventListener('click', function(e) {
                        e.preventDefault();
                        const url = this.dataset.url;
                        // 使用loadPage函数加载页面
                        loadPage(url);
                        // 更新URL，但不重新加载页面
                        window.history.pushState({}, '', url);
                        // 隐藏搜索结果和搜索框
                        searchResults.classList.remove('show');
                        document.querySelector('.search-container').classList.add('hidden');
                        document.querySelector('.search-overlay').classList.remove('show');
                        // 清空搜索输入
                        searchInput.value = '';
                    });
                });
            } else {
                searchResults.innerHTML = '<div class="search-result-item search-result-empty">没有找到相关文章 😢</div>';
                searchResults.classList.add('show');
            }
        }

        // 添加输入事件监听
        searchInput.addEventListener('input', debounce(handleSearch, 300));

        // 点击关闭外部搜索结果
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.classList.remove('show');
            }
        });

        // 处理ESC 键关闭搜索结果
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchResults.classList.remove('show');
                searchInput.blur();
            }
        });
    }

    // 在页面加载完成后初始化搜索功能
    window.addEventListener('load', function() {
        initSearch();
        initSidebarState();
        
        // 添加滚动监听
        window.addEventListener('scroll', function() {
            const backTop = document.querySelector('.back-top');
            if (window.scrollY > 300) {  // 滚动超过300px时显示
                backTop.classList.add('show');
            } else {
                backTop.classList.remove('show');
            }
        });
    });

    // 侧边栏显示/隐藏控制
    function toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const content = document.querySelector('.content');
        const sidebarToggle = document.querySelector('.comment-button');
        
        // 切换侧边栏状态
        sidebar.classList.toggle('collapsed');
        
        // 当侧边栏收起时，内容区域占满
        content.classList.toggle('full-width');
        
        // 保存侧边栏状态到localStorage
        const isSidebarCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
        
        // 直接控制显示/隐藏，解决任何可能的样式冲突
        if (isSidebarCollapsed) {
            sidebar.style.display = 'none';
            sidebarToggle.innerHTML = '📂';
        } else {
            sidebar.style.display = '';
            sidebarToggle.innerHTML = '🥝';
        }
    }
    
    // 初始化侧边栏状态
    function initSidebarState() {
        const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        const sidebar = document.querySelector('.sidebar');
        const content = document.querySelector('.content');
        const sidebarToggle = document.querySelector('.comment-button');
        
        if (isSidebarCollapsed) {
            sidebar.classList.add('collapsed');
            content.classList.add('full-width');
            sidebar.style.display = 'none';
            sidebarToggle.innerHTML = '📂';
        }
    }
    
    // 页面加载时初始化侧边栏状态
    window.addEventListener('load', function() {
        initSidebarState();
    });
</script>
<script>
    // SPA相关功能
    function initSPA() {
        // 拦截所有链接点击
        document.addEventListener('click', function(e) {
            // 查找最近的a标签
            const link = e.target.closest('a');
            
            // 如果不是链接点击，或者是外部链接，或者是音乐播放器相关的链接，则不处理
            if (!link || 
                !link.href || 
                link.target === '_blank' || 
                link.hasAttribute('download') ||
                !link.href.startsWith(window.location.origin) ||
                link.closest('.aplayer') || 
                link.closest('.meting-js')) {
                return;
            }

            e.preventDefault();

            // 获取目标URL
            const targetUrl = new URL(link.href);
            
            // 如果是当前页面，不处理
            if (targetUrl.href === window.location.href) {
                return;
            }

            // 使用AJAX加载新内容
            loadPage(targetUrl.href);
            
            // 更新URL，但不重新加载页面
            window.history.pushState({}, '', targetUrl.href);
        });

        // 处理浏览器前进/后退
        window.addEventListener('popstate', function() {
            loadPage(window.location.href);
        });
    }

    // AJAX加载页面内容
    async function loadPage(url) {
        try {
            // 显示加载指示器
            showLoadingIndicator();
            
            const response = await fetch(url);
            const html = await response.text();
            
            // 创建临时DOM来解析HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // 更新页面标题
            document.title = doc.title;
            
            // 检查是否已解锁
            const isUnlocked = localStorage.getItem('unlockTime') && 
                              localStorage.getItem('passwordVersion') === new Date().toISOString().split('T')[0];

            // 更新主要内容区域
            const newContent = doc.querySelector('.content');
            const currentContent = document.querySelector('.content');
            if (newContent && currentContent) {
                // 如果已解锁，直接显示内容而不是锁定的内容
                if (isUnlocked) {
                    const mainContent = newContent.querySelector('#main-content');
                    if (mainContent) {
                        currentContent.innerHTML = mainContent.innerHTML;
                    } else {
                        currentContent.innerHTML = newContent.innerHTML;
                    }
                    // 移除解锁模态框
                    const unlockModal = document.querySelector('#unlock-modal');
                    if (unlockModal) {
                        unlockModal.remove();
                    }
                } else {
                    currentContent.innerHTML = newContent.innerHTML;
                }
            }
            
            // 更新侧边栏
            const newSidebar = doc.querySelector('.sidebar');
            const currentSidebar = document.querySelector('.sidebar');
            if (newSidebar && currentSidebar) {
                currentSidebar.innerHTML = newSidebar.innerHTML;
            }
            
            // 判断是否是主页
            const isHomePage = url.endsWith('/') || url.endsWith('/posts');
            
            // 更新目录
            const currentToc = document.querySelector('.toc');
            if (currentToc) {
                if (isHomePage) {
                    // 如果是主页，显示空目录
                    currentToc.innerHTML = '';
                    const emptyToc = document.createElement('div');
                    emptyToc.className = 'toc-empty';
                    emptyToc.style.cssText = 'height: auto; min-height: 150px; padding: 2rem; margin: 1rem;';
                    
                    const icon = document.createElement('div');
                    icon.className = 'toc-empty-icon';
                    icon.style.cssText = 'font-size: 7rem; margin-bottom: 1rem; color: var(--text-color-secondary);';
                    icon.textContent = '📑';
                    
                    const text = document.createElement('div');
                    text.className = 'toc-empty-text';
                    text.style.cssText = 'font-size: 1.4rem; color: var(--text-color-secondary); font-weight: 500;';
                    text.textContent = '暂无目录';
                    
                    emptyToc.appendChild(icon);
                    emptyToc.appendChild(text);
                    currentToc.appendChild(emptyToc);

                    // 生成随机诗词
                    const poems = [
                        { content: "人生若只如初见，何事秋风悲画扇。", author: "纳兰性德", title: "木兰词·拟古决绝词柬友" },
                        { content: "衣带渐宽终不悔，为伊消得人憔悴。", author: "柳永", title: "蝶恋花" },
                        { content: "曾经沧海难为水，除却巫山不是云。", author: "元稹", title: "离思五首·其四" },
                        { content: "落霞与孤鹜齐飞，秋水共长天一色。", author: "王勃", title: "滕王阁序" },
                        { content: "人间万事消磨尽，只有清香似旧时。", author: "刘方平", title: "春怨" },
                        { content: "此情可待成追忆，只是当时已惘然。", author: "李商隐", title: "锦瑟" },
                        { content: "红豆生南国，春来发几枝。愿君多采撷，此物最相思。", author: "王维", title: "相思" },
                        { content: "春风又绿江南岸，明月何时照我还。", author: "王安石", title: "泊船瓜洲" },
                        { content: "长风破浪会有时，直挂云帆济沧海。", author: "李白", title: "行路难" },
                        { content: "醉后不知天在水，满船清梦压星河。", author: "唐温如", title: "题龙阳县青草湖" }
                    ];
                    const randomPoem = poems[Math.floor(Math.random() * poems.length)];
                    
                    const welcomeContent = document.createElement('div');
                    welcomeContent.innerHTML = 
                        '<div style="text-align: center;">' +
                        '<h1 style="margin-bottom: 40px; color: var(--main-text-color);">欢迎访问我的博客🥝🍇🍅🥥🍉🎩💾📀🔭</h1>' +
                        '</div>' +
                        '<div class="welcome-poem">' +
                        '<div class="poem-content">' + randomPoem.content + '</div>' +
                        '<div class="poem-author">—— ' + randomPoem.author + '</div>' +
                        '<div class="poem-title">《' + randomPoem.title + '》</div>' +
                        '</div>';
                    currentContent.innerHTML = '';
                    currentContent.appendChild(welcomeContent);

                    // 为主页标题添加点击事件
                    const titleLink = document.querySelector('.header-center a');
                    if (titleLink) {
                        titleLink.onclick = function(e) {
                            if (window.location.pathname === '/' || window.location.pathname === '/posts') {
                                e.preventDefault();
                                const newRandomPoem = poems[Math.floor(Math.random() * poems.length)];
                                const poemContent = document.querySelector('.poem-content');
                                const poemAuthor = document.querySelector('.poem-author');
                                const poemTitle = document.querySelector('.poem-title');
                                if (poemContent && poemAuthor && poemTitle) {
                                    poemContent.textContent = newRandomPoem.content;
                                    poemAuthor.textContent = '—— ' + newRandomPoem.author;
                                    poemTitle.textContent = '《' + newRandomPoem.title + '》';
                                }
                            }
                        };
                    }
                } else {
                    // 如果是文章页面，使用新页面的目录
                    const newToc = doc.querySelector('.toc');
                    if (newToc) {
                        currentToc.innerHTML = newToc.innerHTML;
                        // 重新初始化目录
                        initializeTOC();
                    }
                }
            }
            
            // 更新页面类
            document.body.className = doc.body.className;
            
            // 如果已解锁，确保内容可见
            if (isUnlocked) {
                const mainContent = document.querySelector('#main-content');
                if (mainContent) {
                    mainContent.style.display = 'block';
                }
                const unlockModal = document.querySelector('#unlock-modal');
                if (unlockModal) {
                    unlockModal.style.display = 'none';
                }
            }

            // 重新初始化页面功能
            reinitializePageFeatures();
            
            // 滚动到顶部
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('加载页面失败:', error);
            // 显示错误提示
            showErrorMessage('加载页面失败，请刷新重试');
        } finally {
            // 隐藏加载指示器
            hideLoadingIndicator();
        }
    }

    // 重新初始化页面功能
    function reinitializePageFeatures() {
        // 重新初始化Markdown渲染
        const contentDiv = document.getElementById('content');
        if (contentDiv && contentDiv.hasAttribute('data-markdown')) {
            const markdown = decodeURIComponent(contentDiv.getAttribute('data-markdown'));
            contentDiv.removeAttribute('data-markdown');
            contentDiv.innerHTML = marked.parse(markdown);
            
            // 处理所有链接，添加新标签页打开属性
            const links = contentDiv.getElementsByTagName('a');
            for (let i = 0; i < links.length; i++) {
                const link = links[i];
                // 只处理外部链接，不处理页内锚点链接
                if (!link.getAttribute('href').startsWith('#')) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            }
        }
        
        // 重新初始化代码高亮
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
            addCopyButton(block);
        });
        
        // 重新初始化图片灯箱
        const zoom = mediumZoom('img:not(.site-logo)', {
            margin: 24,
            background: getComputedStyle(document.documentElement)
                .getPropertyValue('--main-bg-color'),
            scrollOffset: 0,
        });
        
        // 重新初始化目录
        initializeTOC();

        // 重新初始化返回顶部按钮
        initBackToTop();

        // 重新初始化PDF查看器
        initPdfViewer();

        // 添加: 重新初始化分页功能
        initPagination();
    }

    // 添加: 分页功能初始化函数
    function initPagination() {
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
        const pageInput = document.getElementById('pageInput');
        
        if (prevButton && nextButton && pageInput) {
            // 使用函数声明而不是箭头函数
            prevButton.onclick = function() {
                changePage(-1);
            };
            nextButton.onclick = function() {
                changePage(1);
            };
            
            // 添加页码输入框事件
            if (pageInput) {
                pageInput.onkeydown = function(event) {
                    if (event.key === 'Enter') {
                        goToPage(this.value);
                    }
                };
            }
            
            // 确保当前页码状态正确
            const currentPage = parseInt(pageInput.value);
            const totalPages = parseInt(pageInput.max);
            
            // 更新按钮状态
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;
        }
    }

    // 修改 changePage 函数，使其成为全局函数
    window.changePage = function(delta) {
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
        const pageInput = document.getElementById('pageInput');
        
        if (!pageInput) return;
        
        // 获取当前页码和总页数
        const current = parseInt(pageInput.value);
        const total = parseInt(pageInput.max);
        const newPage = current + delta;
        
        if (newPage >= 1 && newPage <= total) {
            // 使用常规字符串拼接而不是模板字符串
            const currentItems = document.querySelectorAll('.post-item[data-page="' + current + '"]');
            const newItems = document.querySelectorAll('.post-item[data-page="' + newPage + '"]');
            
            // 隐藏当前页的文章
            currentItems.forEach(function(item) {
                item.style.display = 'none';
            });
            
            // 显示新页的文章
            newItems.forEach(function(item) {
                item.style.display = 'block';
            });
            
            // 更新按钮状态
            prevButton.disabled = newPage === 1;
            nextButton.disabled = newPage === total;
            
            // 更新输入框
            pageInput.value = newPage;
        }
    };

    // 显示加载指示器
    function showLoadingIndicator() {
        // 如果不存在加载指示器，创建个
        let loader = document.querySelector('.page-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'page-loader';
            loader.innerHTML = '<div class="loader-spinner"></div>';
            document.body.appendChild(loader);
            
            // 添加加载指示器样式
            const style = document.createElement('style');
            style.textContent = 
                '.page-loader {' +
                    'position: fixed;' +
                    'top: 0;' +
                    'left: 0;' +
                    'width: 100%;' +
                    'height: 3px;' +
                    'background: transparent;' +
                    'z-index: 9999;' +
                '}' +
                '.loader-spinner {' +
                    'width: 100%;' +
                    'height: 100%;' +
                    'background: var(--link-color);' +
                    'transform-origin: 0 50%;' +
                    'animation: pageLoadingAnimation 1s ease-in-out infinite;' +
                '}' +
                '@keyframes pageLoadingAnimation {' +
                    '0% { transform: scaleX(0); }' +
                    '50% { transform: scaleX(0.5); }' +
                    '100% { transform: scaleX(1); }' +
                '}';
            document.head.appendChild(style);
        }
        loader.style.display = 'block';
    }

    // 隐藏加载指示器
    function hideLoadingIndicator() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    // 显示错误消息
    function showErrorMessage(message) {
        let errorDiv = document.querySelector('.page-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'page-error';
            document.body.appendChild(errorDiv);
            
            // 添加错误消息样式
            const style = document.createElement('style');
            style.textContent = 
                '.page-error {' +
                    'position: fixed;' +
                    'top: 20px;' +
                    'left: 50%;' +
                    'transform: translateX(-50%);' +
                    'background: #ff4444;' +
                    'color: white;' +
                    'padding: 12px 24px;' +
                    'border-radius: 8px;' +
                    'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);' +
                    'z-index: 9999;' +
                    'animation: errorFadeIn 0.3s ease;' +
                '}' +
                '@keyframes errorFadeIn {' +
                    'from {' +
                        'opacity: 0;' +
                        'transform: translate(-50%, -20px);' +
                    '}' +
                    'to {' +
                        'opacity: 1;' +
                        'transform: translate(-50%, 0);' +
                    '}' +
                '}';
            document.head.appendChild(style);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // 3秒后自动隐藏
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }

    // 在页面加载完成后初始化SPA功能
    window.addEventListener('load', function() {
        initSPA();
        // ... 其他初始化代码 ...
    });

    // 添加PDF查看器初始化函数
    function initPdfViewer() {
        const toggleBtn = document.getElementById('pdfToggleBtn');
        if (toggleBtn) {
            let usingPdfJs = true;
            
            toggleBtn.addEventListener('click', function() {
                const pdfViewer = document.getElementById('pdfViewer');
                const pdfFallback = document.getElementById('pdfFallback');
                
                if (usingPdfJs) {
                    pdfViewer.style.display = 'none';
                    pdfFallback.style.display = 'block';
                    toggleBtn.textContent = '🔄 切换到 PDF.js';
                } else {
                    pdfViewer.style.display = 'block';
                    pdfFallback.style.display = 'none';
                    toggleBtn.textContent = '🔄 切换到原生查看器';
                }
                usingPdfJs = !usingPdfJs;
            });

            // 监听PDF.js加载错误
            window.addEventListener('error', function(e) {
                if (e.target.id === 'pdfViewer') {
                    const pdfViewer = document.getElementById('pdfViewer');
                    const pdfFallback = document.getElementById('pdfFallback');
                    
                    pdfViewer.style.display = 'none';
                    pdfFallback.style.display = 'block';
                    toggleBtn.textContent = '🔄 切换到 PDF.js';
                    usingPdfJs = false;
                }
            }, true);
        }
    }

    // 生成空目录HTML
    function generateEmptyToc() {
        return '<div class="toc-empty" style="height: auto; min-height: 150px; padding: 2rem; margin: 1rem;">' +
               '<div class="toc-empty-icon" style="font-size: 7rem; margin-bottom: 1rem; color: var(--text-color-secondary);">📑</div>' +
               '<div class="toc-empty-text" style="font-size: 1.4rem; color: var(--text-color-secondary); font-weight: 500;">暂无目录</div>' +
               '</div>';
    }
</script>
</html>
`;

// 主处理模块
export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            const path = url.pathname;

            const postList = await htmlGenerator.generatePostList(env);
            let pageClass = '';

            // 根据路径处理不同的请求
            if (path === '/' || path === '/posts') {
                return await this.handleHomePage(postList, env);
            } else if (path.startsWith('/posts/')) {
                return await this.handlePostPage(path, postList, env, request);
            } else if (path.startsWith('/pdf-proxy/')) {
                return await this.handlePdfProxy(path, env);
            }

            return new Response('Not Found', { status: 404 });
        } catch (error) {
            return new Response('Error: ' + error.message, { status: 500 });
        }
    },

    // 处理主页请求
    async handleHomePage(postList, env) {
        const pageClass = 'is-home';
        const randomPoem = utils.getRandomPoem();
        const welcomeContent = `
            <div style="text-align: center;">
                <h1 style="margin-bottom: 40px; color: var(--main-text-color);">欢迎访问我的博客🥝🍇🍅🥥🍉🎩💾📀🔭</h1>
            </div>
            <div class="welcome-poem">
                <div class="poem-content">${randomPoem.content}</div>
                <div class="poem-author">—— ${randomPoem.author}</div>
                <div class="poem-title">《${randomPoem.title}》</div>
            </div>
        `;

        const html = HTML_TEMPLATE
            .replace('{{page_class}}', pageClass)
            .replace('{{post_list}}', postList)
            .replace('{{content}}', this.wrapWithPasswordProtection(welcomeContent, env))
            .replace('{{toc}}', this.generateEmptyToc())
            .replace('{{api_limit_info}}', apiHandler.cache.posts.rateLimit ?
                htmlGenerator.generateApiLimitHtml(apiHandler.cache.posts.rateLimit) : '');

        return new Response(html, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' }
        });
    },

    // 处理文章页请求
    async handlePostPage(path, postList, env, request) {
        const pageClass = 'is-post';
        const postPath = path.replace('/posts/', '');

        if (postPath.endsWith('.pdf')) {
            return await this.handlePdfPage(postPath, postList, env, request);
        } else {
            return await this.handleMarkdownPage(postPath, postList, env);
        }
    },

    // 处理PDF页面
    async handlePdfPage(postPath, postList, env, request) {
        const response = await fetch(
            `https://raw.githubusercontent.com/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/main/${postPath}`,
            {
                headers: {
                    'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
                    'User-Agent': 'CloudflareWorker'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        }

        const currentUrl = new URL(request.url);
        const proxyUrl = `${currentUrl.protocol}//${currentUrl.host}/pdf-proxy/${postPath}`;
        const pdfViewerHtml = this.generatePdfViewerHtml(proxyUrl);

        const html = HTML_TEMPLATE
            .replace('{{page_class}}', 'is-post')
            .replace('{{post_list}}', postList)
            .replace('{{content}}', this.wrapWithPasswordProtection(pdfViewerHtml, env))
            .replace('{{toc}}', this.generateEmptyToc())
            .replace('{{api_limit_info}}', '');

        return new Response(html, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' }
        });
    },

    // 处理Markdown页面
    async handleMarkdownPage(postPath, postList, env) {
        const content = await apiHandler.getPostContent(postPath, env);
        const html = HTML_TEMPLATE
            .replace('{{page_class}}', 'is-post')
            .replace('{{post_list}}', postList)
            .replace('{{content}}', this.wrapWithPasswordProtection(
                `<div id="content" data-markdown="${encodeURIComponent(content)}"></div>`,
                env
            ))
            .replace('{{toc}}', this.generateEmptyToc())
            .replace('{{api_limit_info}}', '');

        return new Response(html, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' }
        });
    },

    // 处理PDF代理请求
    async handlePdfProxy(path, env) {
        const pdfPath = path.replace('/pdf-proxy/', '');
        const response = await fetch(
            `https://raw.githubusercontent.com/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/main/${pdfPath}`,
            {
                headers: {
                    'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
                    'User-Agent': 'CloudflareWorker'
                }
            }
        );

        if (!response.ok) {
            return new Response('PDF not found', { status: 404 });
        }

        const pdfContent = await response.arrayBuffer();

        return new Response(pdfContent, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${pdfPath.split('/').pop()}"`,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600',
                'Vary': 'Origin'
            }
        });
    },

    // 生成空目录HTML
    generateEmptyToc() {
        return '<div class="toc-empty" style="height: auto; min-height: 150px; padding: 2rem; margin: 1rem;">' +
            '<div class="toc-empty-icon" style="font-size: 7rem; margin-bottom: 1rem; color: var(--text-color-secondary);">📑</div>' +
            '<div class="toc-empty-text" style="font-size: 1.4rem; color: var(--text-color-secondary); font-weight: 500;">暂无目录</div>' +
            '</div>';
    },

    // 生成PDF查看器HTML
    generatePdfViewerHtml(proxyUrl) {
        return `
            <div style="width: 100%; height: 100vh; display: flex; flex-direction: column;">
                <div style="padding: 10px; text-align: center; background: var(--header-bg); border-bottom: 1px solid var(--border-color);">
                    <a href="${proxyUrl}" 
                       target="_blank" 
                       style="color: var(--link-color); text-decoration: none; padding: 8px 16px; display: inline-block;">
                        📥 下载 PDF
                    </a>
                    <button id="pdfToggleBtn"
                            style="color: var(--link-color); text-decoration: none; background: none; border: none; cursor: pointer; padding: 8px 16px;">
                        🔄 切换查看模式
                    </button>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; position: relative;">
                    <iframe
                        src="https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(proxyUrl)}"
                        style="width: 100%; flex: 1; border: none;"
                        allowfullscreen
                        id="pdfViewer"
                    ></iframe>
                    <embed
                        src="${proxyUrl}#toolbar=0"
                        type="application/pdf"
                        style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; display: none;"
                        id="pdfFallback"
                    />
                </div>
            </div>
        `;
    },

    // 密码保护包装
    wrapWithPasswordProtection(content, env) {
        if (!CONFIG.site.enablePasswordProtection) {
            return content;
        }

        return `
            <div id="unlock-modal" class="unlock-modal">
                <div class="unlock-content">
                    <h2>请输入访问密码</h2>
                    <input type="password" 
                           id="password-input" 
                           placeholder="请输入密码" 
                           autocomplete="off"
                           spellcheck="false">
                    <button onclick="verifyPassword('${env.ADMIN_PASSWORD}')">🔐解锁访问</button>
                    <p id="unlock-error"></p>
                </div>
            </div>
            <div id="main-content" style="display: none;">
                ${content}
            </div>
            <script>
                function checkUnlock() {
                    const unlockTime = localStorage.getItem('unlockTime');
                    const storedPasswordVersion = localStorage.getItem('passwordVersion');
                    const currentPasswordVersion = new Date().toISOString().split('T')[0];
                    const now = new Date().getTime();
                    
                    if (unlockTime && 
                        storedPasswordVersion === currentPasswordVersion && 
                        (now - parseInt(unlockTime)) < 30 * 24 * 60 * 60 * 1000) {
                        document.getElementById('unlock-modal').style.display = 'none';
                        document.getElementById('main-content').style.display = 'block';
                    } else {
                        localStorage.removeItem('unlockTime');
                        localStorage.removeItem('passwordVersion');
                    }
                }

                function verifyPassword(correctPassword) {
                    const input = document.getElementById('password-input');
                    const error = document.getElementById('unlock-error');
                    
                    if (input.value === correctPassword) {
                        const currentPasswordVersion = new Date().toISOString().split('T')[0];
                        localStorage.setItem('unlockTime', new Date().getTime());
                        localStorage.setItem('passwordVersion', currentPasswordVersion);
                        document.getElementById('unlock-modal').style.display = 'none';
                        document.getElementById('main-content').style.display = 'block';
                        error.style.opacity = '0';
                    } else {
                        error.textContent = '密码错误，请重试';
                        error.style.opacity = '1';
                        error.style.transform = 'translateY(0)';
                        input.value = '';
                        input.focus();
                    }
                }

                document.getElementById('password-input').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        verifyPassword('${env.ADMIN_PASSWORD}');
                    }
                });

                checkUnlock();
            </script>
        `;
    }
}; 
