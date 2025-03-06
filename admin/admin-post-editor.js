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
    const token = 'YOUR_PERSONAL_ACCESS_TOKEN';  // נדאג לשפר את זה בהמשך

    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `הוספת פוסט חדש: ${postData.title}`,
            content: btoa(JSON.stringify(postData, null, 2))
        })
    });

    if (response.ok) {
        alert('הפוסט נשמר בהצלחה ב-new-posts!');
        window.location.href = '../docs/posts.html';  // או כל דף שאתה רוצה לחזור אליו
    } else {
        alert('שגיאה בשמירת הפוסט');
    }
};
