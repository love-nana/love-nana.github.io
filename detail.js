let fdStr = localStorage.getItem('foodDetails')
let food = JSON.parse(fdStr);
const container = document.querySelector('html');
const foodDate = document.getElementById('food-date');
const foodTitle = document.getElementById('food-title');
const foodDesc = document.getElementById('food-description');
const imageList = document.getElementById('image-list');
// 获取DOM元素
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');

foodDate.textContent = food.date;
if (food.user) {
    if (foodDate.textContent) {
        foodDate.textContent += ` / ${food.user}`;
    } else {
        foodDate.textContent = food.user;
    }
}


foodTitle.textContent = food.title;
foodDesc.innerHTML = food.desc.replaceAll('\n', '<br/>');
let currentIndex = 0;
let allImgUrls = [];

let picIndex = 0;
if (food.images) {
    getCosUrlList(food.images).then(imgUrls => {
        imgUrls.forEach(imgUrl => {
            imageList.appendChild(createImgItem(imgUrl, picIndex));
            allImgUrls.push(imgUrl);
            picIndex++;
        });
    });
} else {
    imageList.appendChild(createImgItem(food.image, picIndex));
}

// 创建美食项目
function createImgItem(imgUrl, picIndex) {
    const item = document.createElement('img');
    item.className = 'food-image';
    item.dataset.originalSrc = imgUrl;
    item.dataset.picIndex = picIndex;
    item.src = imgUrl + "&imageMogr2/quality/30";
    item.addEventListener('click', (e) => {
        e.preventDefault();
        openZoomInModal(e.target);
    });
    return item;
}

function showSingleImg() {
    modalImg.src = allImgUrls[currentIndex];
}

// 打开模态框
function openZoomInModal(target) {
    console.log('openZoomInModal')
    currentIndex = parseInt(target.dataset.picIndex);
    resetImageTransform();
    showSingleImg();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 关闭模态框
function closeZoomInModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // 恢复背景滚动
    modalImg.src = "";
    console.log('closeZoomInModal')
}

// 点击模态框背景关闭
modal.addEventListener('touchstart', handleTouchStart, {passive: false});
modal.addEventListener('touchmove', handleTouchMove, {passive: false});
modal.addEventListener('touchend', handleTouchEnd, {passive: false});

// 键盘ESC键关闭
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeZoomInModal();
    }
    if (e.key === 'ArrowUp' && modal.classList.contains('active')) {
        prevImage();
    }
    if (e.key === 'ArrowDown' && modal.classList.contains('active')) {
        nextImage();
    }
});

// 触摸事件相关变量
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
const swipeThreshold = 50; // 滑动阈值
const clickThreshold = 10; // 点击容差

// 缩放相关变量
let currentScale = 1;
let initialDistance = 0;
let isDragging = false;
let translateX = 0, translateY = 0;


function handleTouchStart(e) {
    // 双指触摸 - 缩放
    if (e.touches.length === 2) {
        e.preventDefault();
        initialDistance = getDistance(e.touches);
    }
    // 单指触摸 - 拖动
    else if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
    }

}

function handleTouchMove(e) {
    // 双指触摸 - 缩放
    if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);

        if (initialDistance > 0) {
            const scale = currentDistance / initialDistance;
            currentScale = Math.max(0.5, Math.min(3, currentScale * scale));
            updateImageTransform();
            initialDistance = currentDistance;
        }
    }
    // 单指触摸 - 拖动
    else if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        updateImageTransform();
    }
}

function handleTouchEnd(e) {
    // 重置状态
    if (e.touches.length < 2) {
        initialDistance = 0;
    }
    if (e.touches.length === 0) {
        isDragging = false;
    }
}


// 切换到下一张图片
function nextImage() {
    currentIndex = (currentIndex + 1) % allImgUrls.length;
    showSingleImg();
}

// 切换到上一张图片
function prevImage() {
    currentIndex = (currentIndex - 1 + allImgUrls.length) % allImgUrls.length;
    showSingleImg();
}


// 重置图片变换
function resetImageTransform() {
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    updateImageTransform();
}

// 更新图片变换
function updateImageTransform() {
    modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
}

// 计算两点之间的距离
function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}



