const notification = document.getElementById('notification');
const notificationTitle = document.getElementById('notificationTitle');
const notificationMessage = document.getElementById('notificationMessage');
// 隐藏通知函数
function hideNotification() {
    notification.classList.remove('active');
}

// 显示通知函数
function showNotification(type, title, message) {
    // 移除之前的类型类
    notification.classList.remove('success', 'error', 'warning', 'info');

    // 添加新的类型类
    notification.classList.add(type);

    // 设置标题和内容
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;

    // 显示通知
    notification.classList.add('active');

    // 5秒后自动隐藏
    setTimeout(() => {
        if (notification.classList.contains('active')) {
            hideNotification();
        }
    }, 3000);
}