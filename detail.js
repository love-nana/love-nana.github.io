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
let singleFinger = false;
const swipeThreshold = 50; // 滑动阈值
const clickThreshold = 10; // 点击容差

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    singleFinger = e.touches.length === 1;
}

function handleTouchMove(e) {
    if (e.touches.length === 1) {
        e.preventDefault();
        singleFinger = true;
    } else {
        singleFinger =false;
    }
}

function handleTouchEnd(e) {
    if (!singleFinger) {
        return
    }
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;

    const diffX = Math.abs(startX - endX);
    const diffY = Math.abs(startY - endY);
    console.log(endX, endY);
    const maxDiff = Math.max(diffX, diffY);

    if (maxDiff < clickThreshold) {
        // 检查点击位置，如果是非图片区域则关闭
        const imageRect = modalImg.getBoundingClientRect();
        const clickX = (startX + endX) / 2;
        const clickY = (startY + endY) / 2;
        // 如果点击在图片外部，关闭查看器
        if (clickX < imageRect.left || clickX > imageRect.right ||
            clickY < imageRect.top || clickY > imageRect.bottom) {
            e.preventDefault();
            closeZoomInModal();
        }
    } else {
        if (diffX > diffY) { //左右滑动
            if (startX > endX) {
                e.preventDefault();
                nextImage(); // 向左滑动，下一张
            } else {
                e.preventDefault();
                prevImage(); // 向右滑动，上一张
            }
        } else { //上下滑动
            if (startY > endY) {
                e.preventDefault();
                nextImage(); // 向下滑动，下一张
            } else {
                e.preventDefault();
                prevImage(); // 向上滑动，上一张
            }
        }
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

