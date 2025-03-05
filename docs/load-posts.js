class BlogSystem {
    constructor() {
        this.GITHUB_REPO = 'Don-Quixote-of-words/docs';
        this.POSTS_URL = `https://raw.githubusercontent.com/${this.GITHUB_REPO}/main/posts.json`;
    }

    async loadPosts() {
        try {
            console.log('מנסה לטעון פוסטים מהשרת...');
            const response = await fetch(this.POSTS_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('פוסטים נטענו בהצלחה:', data);
            return data.posts || [];

        } catch (error) {
            console.error('שגיאה בטעינת הפוסטים:', error);
            return [];
        }
    }

    prepareNewPost(postData) {
        const post = {
            id: Date.now().toString(),
            title: postData.title,
            summary: postData.summary,
            content: postData.content,
            tags: postData.tags,
            date: new Date().toISOString(),
            author: "huxhkuh"
        };

        return {
            post,
            instructions: this.generateInstructions(post)
        };
    }

    generateInstructions(post) {
        return `
כדי להוסיף את הפוסט החדש:

1. פתח את הקישור הבא:
   https://github.com/${this.GITHUB_REPO}/edit/main/posts.json

2. הוסף את הפוסט החדש למערך "posts" (בתחילת המערך):

{
    "posts": [
        ${JSON.stringify(post, null, 2)},
        ... שאר הפוסטים הקיימים ...
    ],
    "lastUpdate": "${new Date().toISOString()}"
}

3. בתחתית העמוד, תחת "Commit changes":
   - כתוב: "הוספת פוסט: ${post.title}"
   - לחץ על "Commit changes"

4. הפוסט יופיע באתר תוך מספר דקות
`;
    }
}
