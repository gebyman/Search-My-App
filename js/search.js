const search = document.querySelector('.search'); // 搜索框
const searchBtn = document.querySelector('.searchBtn'); // 搜索按鈕
const reset = document.querySelector('.reset'); // 重置按鈕
const appContainer = document.querySelector('#appContainer'); // 卡片容器
let appData = []; // 存儲應用數據

// 初始化數據加載
function searchData() {
    fetch('apps.json')
        .then(res => res.json())
        .then(data => {
            appData = data; // 保存數據
            renderCards(data); // 渲染數據
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // 搜索按鈕點擊事件
    searchBtn.addEventListener('click', function (e) {
        e.preventDefault(); // 防止默認行為
        let keyword = search.value.trim().toLowerCase(); // 獲取搜索關鍵字
        if (keyword !== '') {
            filter(keyword); // 過濾數據
        } else {
            renderCards(appData); // 如果關鍵字為空，顯示所有數據
        }
        search.value = ''; // 清空搜索框
    });

    // 重置按鈕點擊事件
    reset.addEventListener('click', function () {
        renderCards(appData); // 恢復顯示所有數據
    });
}

// 過濾數據
function filter(keyword) {
    let target = appData.filter(item => {
        return item.title.toLowerCase().includes(keyword); // 根據 title 進行過濾
    });
    renderCards(target); // 渲染過濾結果
}

// 渲染數據到頁面
function renderCards(apps) {
    let str = '';
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
    appContainer.innerHTML = str; // 更新頁面內容
}

// 初始化
searchData();



