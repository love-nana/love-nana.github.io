/* 输入口令 */
const modalOverlay = document.getElementById('modalOverlay');
const loginForm = document.getElementById('loginForm');
const cancelBtn = document.getElementById('cancelBtn');
const cosIdInput = document.getElementById('cosId');
const cosTokenInput = document.getElementById('cosToken');
const userSelect = document.getElementById('user');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');


// 取消按钮点击事件
cancelBtn.addEventListener('click', function () {
    modalOverlay.classList.remove('active');
});

// 表单提交事件
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;
    // 验证ID
    if (cosIdInput.value.trim() === '') {
        usernameError.style.display = 'block';
        isValid = false;
    } else {
        usernameError.style.display = 'none';
    }
    // 验证Key
    if (cosTokenInput.value.trim() === '') {
        passwordError.style.display = 'block';
        isValid = false;
    } else {
        passwordError.style.display = 'none';
    }
    if (isValid) {
        localStorage.setItem('local_cosId', cosIdInput.value);
        localStorage.setItem('local_cosToken', cosTokenInput.value);
        localStorage.setItem('local_user', userSelect.value);
        modalOverlay.classList.remove('active');
        loginForm.reset();
        window.location.reload();
    }
});

// 输入时隐藏错误信息
cosIdInput.addEventListener('input', function () {
    if (cosIdInput.value.trim() !== '') {
        usernameError.style.display = 'none';
    }
});

cosTokenInput.addEventListener('input', function () {
    if (cosTokenInput.value.trim() !== '') {
        passwordError.style.display = 'none';
    }
});
