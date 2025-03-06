const GITHUB_TOKEN = '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';  // תכניס את הטוקן האמיתי כאן

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

    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `הוספת פוסט חדש: ${postData.title}`,
            content: btoa(JSON.stringify(postData, null, 2))
        })
    });

    if (response.ok) {
        alert('הפוסט נשמר בהצלחה ב-new-posts!');
        window.location.href = '../docs/posts.html';
    } else {
        alert('שגיאה בשמירת הפוסט');
    }
};
