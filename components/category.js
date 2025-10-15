//分类
const categoryButtons = document.querySelectorAll('.category-btn');
const categoriesContainer = document.getElementById('categories');
const entryEditBtn = document.querySelector('.entry-edit-btn');
// 当前状态
let currentCategoryFilter = 'all';

// 设置事件监听器
function setupEventListeners() {
    // 分类按钮点击事件
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 更新活动按钮
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // 更新当前分类
            currentCategoryFilter = this.getAttribute('data-category');
            renderGallery(false);
        });
    });

    // 触摸滑动支持
    let startX;
    categoriesContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });

    categoriesContainer.addEventListener('touchend', function(e) {
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        if (Math.abs(diffX) > 10) {
            categoriesContainer.scrollBy({
                left: diffX
            });
        }
    });

    if (entryEditBtn) {
        entryEditBtn.addEventListener('click', function(e) {
            window.open('./gallery-edit.html', '_blank');
        })
    }

}

document.addEventListener('DOMContentLoaded', setupEventListeners);
