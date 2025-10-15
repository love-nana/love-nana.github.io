let msnry = null;
let lastWidth = null;

let loadedDataList = null;

document.addEventListener('DOMContentLoaded', function () {
    if (cosConfig.secretId && cosConfig.secretKey&&localStorage.getItem('local_user')) {
        // 使用示例
        getCosUrl('foodData.json', false).then(filePath => {
            loadJSON(filePath)
            .then(data => {
                loadImgUrlAndRenderGallery(data);
            }).catch(error => {
                alert(error);
            });
        });
    } else {
        // 页面加载后显示弹框
        setTimeout(function () {
            modalOverlay.classList.add('active');
        }, 500);
    }
});

// 监听窗口大小变化（某些浏览器菜单打开会改变窗口大小）
window.addEventListener('resize', function () {
    let curWidth = document.querySelector('#waterfall').clientWidth
    if (lastWidth && lastWidth === curWidth) {
        return;
    }
    renderGallery(false);
});

function showDetail(food) {
    localStorage.setItem('foodDetails', JSON.stringify(food));
    window.open('./detail.html', '_blank');
}

PullToRefresh.init({
    mainElement: 'body', onRefresh: function () {
        window.location.reload();
    }, instructionsPullToRefresh: '下拉刷新', instructionsReleaseToRefresh: '释放刷新', instructionsRefreshing: '正在刷新'
});


function createFoodItem(food) {
    const item = document.createElement('div');
    item.className = 'item';
    if (food.images && food.images.length > 1) {
        item.innerHTML = `
                <div class="image-container">
                    <div class="pic-num">P${food.images.length}</div>
                    <img src="${food.imageUrl}&imageMogr2/quality/30" alt="${food.title}" class="food-image">
                </div>
            `;
    } else {
        item.innerHTML = `
                <div class="image-container">
                    <img src="${food.imageUrl}&imageMogr2/quality/30" alt="${food.title}" class="food-image">
                </div>
            `;
    }
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
    item.addEventListener('click', (e) => {
        showDetail(food)
    })
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

function loadImgUrlAndRenderGallery(data) {
    let fetchArrList = [];
    data.list.forEach(item => {fetchArrList.push(item.image)});
    getCosUrlList(fetchArrList).then(urlList => {
        for (let i = 0; i < data.list.length; i++) {
            data.list[i].imageUrl = urlList[i];
        }
        loadedDataList = data.list;
        totalNum = loadedDataList.length;
        renderGallery(false);
    });
}

function renderGallery(append = false) {
    const waterfall = document.getElementById('waterfall');
    if (!append) {
        resetLoadMore();
        document.querySelector('html').scrollTop = 0;
        waterfall.innerHTML = '';
    }
    if (!loadedDataList) {
        setAllLoadFinished();
        return true;
    }
    // 创建初始项目
    let foodData = loadedDataList;
    let matchedItems = [];
    foodData.forEach(food => {
        let match;
        if (currentCategoryFilter === 'all') {
            match = true;
        } else if (currentCategoryFilter === food.category) {
            match = true;
        } else {
            match = false;
        }
        if (match) {
            matchedItems.push(food);
        }
    });

    let rightIndex = curLoadItemIndex + perNum;
    if (rightIndex > matchedItems.length) {
        rightIndex = matchedItems.length;
    }

    if (rightIndex <= curLoadItemIndex) {
        msnry = new Masonry(waterfall, {
            itemSelector: '.item'
        });
        setAllLoadFinished();
        return true;
    }
    if (!append) {
        showLoading();
        waterfall.style.visibility = 'hidden';
    }
    let appendItems = matchedItems.slice(curLoadItemIndex, rightIndex);
    appendItems.forEach(food => {
        const item = createFoodItem(food);
        waterfall.appendChild(item);
    })
    imagesLoaded(waterfall, function () {
        msnry = new Masonry(waterfall, {
            itemSelector: '.item'
        });
        if (!append) {
            hiddenLoading();
            waterfall.style.visibility = 'visible';
        }
        if (appendItems.length === perNum) {
            loadingIndicatorShow();
        } else {
            setAllLoadFinished();
        }
    });
    lastWidth = waterfall.clientWidth;
    curLoadItemIndex = rightIndex;
    return false;
}



function loadMoreItems() {
    return renderGallery(true);
}

