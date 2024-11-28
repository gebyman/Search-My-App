// 全域變數
const category = document.querySelector('.category'); 
const search = document.querySelector('.search'); // 搜索框
const searchBtn = document.querySelector('.searchBtn'); // 搜索按钮
const reset = document.querySelector('.reset');
const appContainer = document.querySelector('#appContainer'); 
let appData = []; 
// 分類
const categoryData = [
    { name: "遊戲" },
    { name: "生活" },
    { name: "音樂" },
    { name: "學習" },
    { name: "兒童" },
    { name: "所有app" }
];

// 生成分類按鈕
function renderCategoryButtons() {
    let str = '';
    categoryData.forEach(function (item, index) {
        str += `<li class='categoryLi' data-num="${index}"><button class='btn btn-primary' data-type="${item.name}">${item.name}</button></li>`;
    });
    category.innerHTML = str;
}

// 綁定分類按鈕

function bindCategoryEvents() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(function (button) {
        button.addEventListener('click', function (e) {
            const type = e.target.dataset.type;
            if (type === "所有app") {
                renderCards(appData); // 顯示所有
            } else {
                const filteredData = appData.filter(function (app) {
                    return app.type === type; // 
                });
                renderCards(filteredData); //顯示分類後數據
            }
        });
    });
}

// 搜索功能
function bindSearchEvents() {
    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const keyword = search.value.trim().toLowerCase();
        if (keyword !== '') {
            const filteredData = appData.filter(item => {
                return item.title.toLowerCase().includes(keyword); //
            });
            renderCards(filteredData); // 顯示搜索结果
        } else {
            alert('請輸入內容');
            renderCards(appData); // 顯示所有數據
        }
        search.value = ''; // 清空搜索框
    });

    reset.addEventListener('click', function () {
        renderCards(appData); // 恢復顯示所有數據
    });
}

// 數據渲染
function renderCards(apps) {
    let str = '';
    console.log('Rendering cards with data:', apps);
    apps.forEach(app => {
        str += `
            <div class="card">
                <a href="#"><img src="${app.image}" alt="${app.title}"></a>
                <div class="card-body">
                    <h1 class="card-title">${app.title}</h1>
                    <p class="card-text">${app.description}</p>
                    <a href='${app.downloadLink}' target='_blank'>
                        <button class="btn btn-primary">點我下載</button>
                    </a>
                </div>
            </div>
        `;
    });
    appContainer.innerHTML = str;
}

// 初始化
function init() {
    renderCategoryButtons();
    fetch('apps.json')
        .then(res => res.json())
        .then(data => {
            appData = data; // 保存數據
            renderCards(data); // 渲染初始數據
            bindCategoryEvents(); 
            bindSearchEvents(); 
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


init();
