```javascript
let comments = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'LOAD_COMMENTS') {
        loadComments(request.url);
    } else if (request.message === 'SAVE_COMMENT') {
        saveComment(request.url, request.comment);
    } else if (request.message === 'DELETE_COMMENT') {
        deleteComment(request.url, request.commentId);
    }
});

function loadComments(url) {
    chrome.storage.sync.get(url, (result) => {
        comments = result[url] || [];
        chrome.runtime.sendMessage({
            message: 'COMMENTS_LOADED',
            comments: comments
        });
    });
}

function saveComment(url, comment) {
    comments.push({
        id: Date.now(),
        comment: comment,
        timestamp: new Date().toISOString()
    });
    chrome.storage.sync.set({ [url]: comments }, () => {
        chrome.runtime.sendMessage({
            message: 'COMMENT_SAVED',
            comment: comment
        });
    });
}

function deleteComment(url, commentId) {
    comments = comments.filter(comment => comment.id !== commentId);
    chrome.storage.sync.set({ [url]: comments }, () => {
        chrome.runtime.sendMessage({
            message: 'COMMENT_DELETED',
            commentId: commentId
        });
    });
}
```