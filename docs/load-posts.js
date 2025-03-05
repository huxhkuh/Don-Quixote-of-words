class BlogSystem {
    constructor() {
        this.GITHUB_REPO = 'Don-Quixote-of-words/docs';
        this.POSTS_FILE = 'posts.json';
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 דקות בmilliseconds
    }

    async loadPosts() {
        try {
            // בדיקה אם יש גרסה מקומית עדכנית
            const cachedData = localStorage.getItem('postsCache');
            if (cachedData) {
                const { timestamp, posts } = JSON.parse(cachedData);
                if (Date.now() - timestamp < this.CACHE_DURATION) {
                    console.log('Loading posts from cache');
                    return posts;
                }
            }

            // טעינה מהשרת
            const response = await fetch(`https://raw.githubusercontent.com/${this.GITHUB_REPO}/main/${this.POSTS_FILE}`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            
            const data = await response.json();
            
            // עדכון המטמון המקומי
            localStorage.setItem('postsCache', JSON.stringify({
                timestamp: Date.now(),
                posts: data.posts
            }));

            return data.posts;

        } catch (error) {
            console.error('Error loading posts:', error);
            // אם יש שגיאה, ננסה להשתמש בגרסה המקומית
            const cachedData = localStorage.getItem('postsCache');
            if (cachedData) {
                return JSON.parse(cachedData).posts;
            }
            return [];
        }
    }

    // פונקציה להכנת פוסט חדש להעלאה
    prepareNewPost(postData) {
        const post = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            author: "huxhkuh",
            ...postData
        };

        return {
            content: post,
            instructions: this.generateInstructions(post)
        };
    }

    // יוצר הוראות להעלאת פוסט חדש
    generateInstructions(post) {
        return `
כדי להעלות את הפוסט החדש:

1. גש ל-repository שלך בכתובת:
   https://github.com/${this.GITHUB_REPO}

2. פתח את הקובץ ${this.POSTS_FILE}

3. לחץ על כפתור העריכה (עיפרון)

4. הוסף את הפוסט החדש לתוך מערך ה-posts:

${JSON.stringify(post, null, 2)}

5. הוסף הודעת commit: "הוספת פוסט חדש: ${post.title}"

6. לחץ על "Commit changes"
        `;
    }
}