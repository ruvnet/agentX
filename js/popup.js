```javascript
let comments = [];

document.addEventListener('DOMContentLoaded', init);

function init() {
    document.getElementById('saveButton').addEventListener('click', saveComment);
    document.getElementById('deleteButton').addEventListener('click', deleteComment);
    chrome.runtime.sendMessage({type: 'LOAD_COMMENTS'}, loadComments);
}

function saveComment() {
    let commentInput = document.getElementById('commentInput');
    let comment = commentInput.value.trim();
    if (comment) {
        let commentObj = {
            url: window.location.href,
            comment: comment,
            timestamp: new Date().getTime()
        };
        comments.push(commentObj);
        chrome.runtime.sendMessage({type: 'SAVE_COMMENT', data: commentObj});
        commentInput.value = '';
        displayComments();
    }
}

function deleteComment(event) {
    let commentIndex = event.target.dataset.index;
    comments.splice(commentIndex, 1);
    chrome.runtime.sendMessage({type: 'DELETE_COMMENT', data: {index: commentIndex}});
    displayComments();
}

function loadComments(response) {
    if (response && response.data) {
        comments = response.data;
        displayComments();
    }
}

function displayComments() {
    let commentList = document.getElementById('commentList');
    commentList.innerHTML = '';
    comments.forEach((commentObj, index) => {
        let commentElement = document.createElement('div');
        commentElement.textContent = commentObj.comment;
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.index = index;
        deleteButton.addEventListener('click', deleteComment);
        commentElement.appendChild(deleteButton);
        commentList.appendChild(commentElement);
    });
}
```