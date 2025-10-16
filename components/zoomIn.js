// 获取DOM元素
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');

// 打开模态框
function openZoomInModal(target) {
    modalImg.src = target.src;
    console.log(modalImg.src)
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 关闭模态框
function closeZoomInModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // 恢复背景滚动
    window.visualViewport.scale = 1;
}

// 点击模态框背景关闭
modal.addEventListener('click', closeZoomInModal);
// 键盘ESC键关闭
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeZoomInModal();
    }
});