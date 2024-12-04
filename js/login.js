const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    // 發送登入請求
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: emailValue,
            password: passwordValue,
        }),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Login failed: ' + res.statusText);
            }
            return res.json();
        })
        .then((data) => {
            if (data.message === '登入成功') {
                alert('登入成功！');
                console.log('用戶資料:', data.user);
                // 可跳轉至其他頁面，例如：window.location.href = '/dashboard';
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error('登入失敗：', error);
        });
});
