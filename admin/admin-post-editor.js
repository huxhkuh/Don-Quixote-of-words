const GITHUB_TOKEN = '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';  // תדביק את הטוקן החדש כאן!

function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

document.getElementById('postForm').onsubmit = async function (e) {
    e.preventDefault();

    const content = tinymce.get('content').getContent();

    const postData = {
        id: Date.now().toString(),
        title: document.getElementById('title').value,
        summary: document.getElementById('summary').value,
        content: content,
        tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
        date: new Date().toISOString(),
        author: "huxhkuh"
    };

    const repo = 'huxhkuh/Don-Quixote-of-words';
    const filePath = `new-posts/post-${postData.id}.json`;

    console.log('📤 שולח פוסט חדש ל-GitHub:', postData);
    console.log('🔗 נתיב בקובץ:', filePath);

    try {
        const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `הוספת פוסט חדש: ${postData.title}`,
                content: utf8ToBase64(JSON.stringify(postData, null, 2))
            })
        });

        console.log('📥 תגובת GitHub:', response);

        if (response.ok) {
            alert('✅ הפוסט נשמר בהצלחה ב-new-posts!');
            window.location.href = '../docs/posts.html';
        } else {
            const errorData = await response.json();
            console.error('❌ GitHub API Error:', errorData);
            alert(`❌ שגיאה בשמירת הפוסט: ${errorData.message || 'שגיאה לא ידועה'}`);
        }
    } catch (err) {
        console.error('🌐 שגיאת רשת:', err);
        alert('❌ שגיאת רשת: לא הצלחנו להתחבר ל-GitHub.');
    }
};
