document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts');
    const tabButtons = document.querySelectorAll('.tab-button');

    // タブ切り替えの処理
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // アクティブなタブのスタイルを変更
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const tabType = button.dataset.tab;
            switchContent(tabType);
        });
    });

    // タブコンテンツの切り替え
    function switchContent(tabType) {
        switch(tabType) {
            case 'posts':
                loadPosts();
                break;
            case 'media':
                postsContainer.innerHTML = '<p class="post">メディア投稿はまだありません。</p>';
                break;
            case 'likes':
                postsContainer.innerHTML = '<p class="post">いいねはできません。</p>';
                break;
        }
    }

    // 投稿を取得して表示する関数
    async function loadPosts() {
        try {
            const response = await fetch('posts.json');
            const posts = await response.json();

            // 投稿を日付の降順（最新が上）でソート
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            // コンテナをクリア
            postsContainer.innerHTML = '';

            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                
                const formattedDate = new Date(post.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                postElement.innerHTML = `
                    <div class="post-header">
                        <img src="./profile.jpg" alt="投稿者のプロフィール画像" class="post-profile-image">
                        <span class="post-author">shiina</span>
                    </div>
                    <div class="post-content">${escapeHTML(post.content)}</div>
                    <div class="post-date">${formattedDate}</div>
                `;

                postsContainer.appendChild(postElement);
            });
        } catch (error) {
            console.error('投稿の読み込みエラー:', error);
            postsContainer.innerHTML = '<p>投稿を読み込めませんでした。</p>';
        }
    }

    // HTMLエスケープ関数（XSS対策）
    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 初期表示時は投稿タブを表示
    loadPosts();
});