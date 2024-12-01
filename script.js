document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts');

    // 投稿を取得して表示する関数
    async function loadPosts() {
        try {
            const response = await fetch('posts.json');
            const posts = await response.json();

            // 投稿を日付の降順（最新が上）でソート
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

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

    // 投稿を読み込む
    loadPosts();
});