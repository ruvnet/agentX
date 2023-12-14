```javascript
let comments = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.type) {
        case 'SAVE_COMMENT':
            saveComment(request.data);
            break;
        case 'DELETE_COMMENT':
            deleteComment(request.data);
            break;
        case 'LOAD_COMMENTS':
            loadComments(request.data);
            break;
    }
});

function saveComment(data) {
    comments.push(data);
    chrome.storage.sync.set({comments: comments}, function() {
        console.log('Comment saved');
    });
}

function deleteComment(data) {
    comments = comments.filter(comment => comment.timestamp !== data.timestamp);
    chrome.storage.sync.set({comments: comments}, function() {
        console.log('Comment deleted');
    });
}

function loadComments(url) {
    chrome.storage.sync.get(['comments'], function(result) {
        comments = result.comments.filter(comment => comment.url === url);
        chrome.runtime.sendMessage({type: 'LOAD_COMMENTS', data: comments});
    });
}

function init() {
    chrome.storage.sync.get(['comments'], function(result) {
        if(result.comments) {
            comments = result.comments;
        }
    });
}

init();
```