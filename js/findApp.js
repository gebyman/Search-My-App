const category = document.querySelector('.category'); 
const categoryData = [
    { name: "遊戲" },
    { name: "生活" },
    { name: "音樂" },
    { name: "學習" },
    { name: "兒童" },
    { name: "所有app" }
];
let findAppData = []; 

//上方種類按鈕
function renderCategoryButtons() {
    let str = '';
    categoryData.forEach(function (item, index) {
        str += `<li class='categoryLi' data-num="${index}"><button class='btn btn-primary' data-type="${item.name}">${item.name}</button></li>`;
    });
    category.innerHTML = str;
}

// 分類按鈕
function bindCategoryEvents() {
    const buttons = document.querySelectorAll('.btn'); 
    buttons.forEach(function (button) {
        button.addEventListener('click', function (e) {
            const type = e.target.dataset.type; 
            if (type === "所有app") {
                renderCards(findAppData); //點選所有app顯示全部
            } else {
                const filteredData =appData.filter(function(app){
                    return app.type===type
                })  
                renderCards(filteredData); 
            }
        });
    });
}

// 卡片渲染
function renderCards(apps) {
    const appContainer = document.getElementById('appContainer');
    let str = '';
    apps.forEach(app => {
        str += `
            <div class="card">
                <a href="#"><img src="${app.image}" alt="${app.title}"></a>  
                <div class="card-body">
                    <h1 class="card-title">${app.title}</h1>
                    <p class="card-text">${app.description}</p>
                    <a href="${app.downloadLink}" target="_blank"><button class="btn btn-primary">點我下載</button></a>
                </div>
            </div>
        `;
    });
    appContainer.innerHTML = str; 
}


function init() {
    renderCategoryButtons();
    fetch('apps.json')
        .then(res => res.json())
        .then(data => {
            findAppData = data; 
            renderCards(data); 
            bindCategoryEvents(); 
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

init();
