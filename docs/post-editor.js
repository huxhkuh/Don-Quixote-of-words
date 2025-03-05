// אתחול עורך התוכן העשיר
tinymce.init({
    selector: '#content',
    directionality: 'rtl',
    height: 500,
    menubar: true,
    plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' +
        'bold italic backcolor | alignright aligncenter alignleft alignjustify | ' +
        'bullist numlist outdent indent | ' +
        'removeformat | help',
    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px }'
});

// טיפול בשליחת הטופס
document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const postData = {
        title: document.getElementById('title').value,
        summary: document.getElementById('summary').value,
        content: tinymce.get('content').getContent(),
        tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
        date: new Date().toISOString(),
        author: 'huxhkuh' // שם המשתמש הנוכחי
    };

    // כאן צריך להוסיף את הלוגיקה לשמירת הפוסט
    // לדוגמה, שמירה ב-localStorage:
    saveToPosts(postData);
});

// שמירת טיוטה
function saveDraft() {
    const draftData = {
        title: document.getElementById('title').value,
        summary: document.getElementById('summary').value,
        content: tinymce.get('content').getContent(),
        tags: document.getElementById('tags').value,
        lastSaved: new Date().toISOString()
    };

    localStorage.setItem('postDraft', JSON.stringify(draftData));
    alert('הטיוטה נשמרה בהצלחה!');
}

// טעינת טיוטה אם קיימת
window.addEventListener('load', () => {
    const savedDraft = localStorage.getItem('postDraft');
    if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        document.getElementById('title').value = draft.title;
        document.getElementById('summary').value = draft.summary;
        document.getElementById('tags').value = draft.tags;
        // נחכה לאתחול TinyMCE
        tinymce.get('content').on('init', () => {
            tinymce.get('content').setContent(draft.content);
        });
    }
});

// פונקציה לשמירת פוסטים
function saveToPosts(postData) {
    let posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.push(postData);
    localStorage.setItem('posts', JSON.stringify(posts));
    alert('הפוסט פורסם בהצלחה!');
    // ניקוי הטופס
    document.getElementById('postForm').reset();
    tinymce.get('content').setContent('');
    localStorage.removeItem('postDraft');
}