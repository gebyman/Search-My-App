const addComment =document.querySelector('.addComment')
const commentModal = document.getElementById('commentModal'); 
const closeModal = document.getElementById('closeModal'); 
const submitComment = document.getElementById('submitComment'); 
const commentInput = document.getElementById('commentInput');
const nameInput = document.getElementById('nameInput');
const commentText = document.querySelector('.commentText')
let commentData = [];

addComment.addEventListener('click', function () {
    commentModal.style.display = 'flex';
});


closeModal.addEventListener('click', function () {
    commentModal.style.display = 'none';
});

// 提交留言
submitComment.addEventListener('click', function () {
    const comment = commentInput.value.trim();
    const name = nameInput.value.trim();
    if (comment&&name) {
        
        alert(`提交成功！留言内容：${comment}`);
        commentData.push({
            comment:comment,
            name:name,
        });
        renderComment ()
        console.log(commentData)
        commentInput.value = '';
        commentModal.style.display = 'none'; 
    } else {
        alert('请输入留言内容！');
    }
});


window.addEventListener('click', function (e) {
    if (e.target === commentModal) {
        commentModal.style.display = 'none';
    }
});


function renderComment (){
    let str = ''
    commentData.forEach(function(item){
        str+=` <h2>${item.name}</h2>
            <h3>${item.comment}</h3>
        <div class='lineComment'></div>`
    })
    commentText.innerHTML=str;
}

renderComment ()