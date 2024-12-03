const form = document.getElementById('form')
const username = document.getElementById('username')
const email = document.getElementById('email')
const password = document.getElementById('password')
const password2 = document.getElementById('password2')

const data =[]
//阻止表單默認提交,可立即反饋錯誤訊息,無需等待太久,所以放最前面
form.addEventListener('submit',e=>{
    e.preventDefault()

    vaildateInputs()
})
//設定出錯時的反應
const setError = (element,message) =>{
    const inputControl = element.parentElement;//取得input（即 div.input-control）
    const errorDisplay = inputControl.querySelector('.error')//獲取裡面的error

    errorDisplay.innerHTML = message;
    inputControl.classList.add('error')
    inputControl.classList.remove('success')
}   
//設定成功時的反應
const setSuccess = element =>{
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error')//獲取裡面的error

    errorDisplay.innerHTML='';
    inputControl.classList.add('success')
    inputControl.classList.remove('error')
}
//判斷電子郵件格式
const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());//用test判斷傳入的email是否為true or false
};

//主要驗證
const vaildateInputs = () => {
    const usernameValue = username.value.trim()
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    let isValid = true;

    if(usernameValue===''){
        setError(username,'Username is required')
        isValid = false;
    }else{
        setSuccess(username)
    }
    if(emailValue===''){
        setError(email,'email is required')
        isValid = false;
    }else if(!isValidEmail(emailValue)){
        setError(email,'請提供正確的email')
        isValid = false;
    }else{
        setSuccess(email)
    }
    if(passwordValue ===''){
        setError(password,'password is required')
        isValid = false;
    }else if(passwordValue.length<8){
        setError(password,'密碼請大於八個字數')
        isValid = false;
    }else{
        setSuccess(password)
    }
    if(password2Value ===''){
        setError(password2,'password is required');
        isValid = false;
    }else if(password2Value!==passwordValue||password2Value.length<8){
        setError(password2,'請確認是否輸入一致')
        isValid = false;
    }else{
        setSuccess(password2)
    }
    
    if (isValid) {
        const formData = {
            username: usernameValue,
            email: emailValue,
            password: passwordValue
        };
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameValue,
                email: emailValue,
                password: passwordValue
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === '註冊成功') {
                    alert('註冊成功！');
                    console.log(data.user); // 伺服器回傳的資料
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('註冊失敗：', error);
            });
        
    }
    
 
}
