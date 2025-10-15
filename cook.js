let curCol = 0;
let loadedDataList = null;



// 创建美食项目
function createFoodItem(food) {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
                <div class="image-container">
                    <img src="${food.image}" alt="${food.title}" class="food-image">
                </div>
            `;
    let imgContent = `<div class="food-content">`;
    if (food.date) {
        imgContent += `<span class="food-country">${food.date}</span>`
    }
    if (food.title) {
        imgContent += `<h3 class="food-title single-line-ellipsis">${food.title}</h3>`
    }
    imgContent += `</div>`;
    if (food.date || food.title || food.desc) {
        item.innerHTML += imgContent;
    }
    item.addEventListener('click', (e) => {showDetail(food)})
    return item;
}


// 加载本地JSON文件
async function loadJSON(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

let msnry = null;

function renderGallery() {
    console.log('start render Gallery');
    if (!loadedDataList) {
        return;
    }
    const waterfall = document.getElementById('waterfall');
    waterfall.innerHTML = '';
    // 创建初始项目
    let foodData = loadedDataList;
    console.log('render data:', foodData);
    foodData.forEach(food => {
        food.images = null;
        const item = createFoodItem(food);
        waterfall.appendChild(item);
    });
    var elem = document.querySelector('#waterfall');
    imagesLoaded(elem, function () {
        msnry = new Masonry(elem, {
            // options
            itemSelector: '.item'
        });
    });
    lastWidth = elem.clientWidth;
}

// 使用示例
loadJSON(`https://aurora-1259397844.cos.ap-nanjing.myqcloud.com/nana/foodData.json?t=${new Date().getTime()}`)
    .then(data => {
        console.log('Loaded data:', data);
        loadedDataList = data.list;
        renderGallery();
    });

// 获取DOM元素
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');

// 打开模态框
function openModal(target) {
    modalImg.src = target.src;
    console.log(modalImg.src)
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 关闭模态框
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // 恢复背景滚动
}

// 点击模态框背景关闭
modal.addEventListener('click', closeModal);
// 键盘ESC键关闭
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

let lastWidth = null;
// 监听窗口大小变化（某些浏览器菜单打开会改变窗口大小）
window.addEventListener('resize', function () {
    let curWidth = document.querySelector('#waterfall').clientWidth
    if (lastWidth && lastWidth === curWidth) {
        return;
    }
    renderGallery();
});

function showDetail(food) {
    localStorage.setItem('foodDetails', JSON.stringify(food));
    window.open('./detail.html', '_blank');
}

PullToRefresh.init({
    mainElement: 'body',
    onRefresh: function() {
       console.log('refresh');
       window.location.reload();
    },
    instructionsPullToRefresh: '下拉刷新',
    instructionsReleaseToRefresh: '释放刷新',
    instructionsRefreshing: '正在刷新'
});
