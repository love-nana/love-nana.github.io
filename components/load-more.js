// 是否正在加载
let isLoading = false;
// 是否所有数据已加载完毕
let allDataLoaded = false;

const loadingIndicator = document.getElementById('loadingIndicator');

const endMessage = document.getElementById('endMessage');

let curLoadItemIndex = 0;

let perNum = 10;

let totalNum = 0;

// 创建观察器
const observer = new IntersectionObserver((entries) => {
    // 如果目标元素进入视口，且不在加载状态，且还有数据可加载
    if (entries[0].isIntersecting && !isLoading && !allDataLoaded) {
        isLoading = true;
        console.log('load-more================')
        let fetchAll = loadMoreItems();
        if (fetchAll) {
            allDataLoaded = true;
            loadingIndicator.style.display = 'none';
            endMessage.style.display = 'block';
        }
        isLoading = false;
    }
}, {
    threshold: 0.1 // 当10%的元素可见时触发
});

// 观察加载指示器
observer.observe(loadingIndicator);


function resetLoadMore() {
    isLoading = false;
    allDataLoaded = false;
    curLoadItemIndex = 0;
    loadingIndicator.style.display = 'none';
    endMessage.style.display = 'none';
}

function setAllLoadFinished() {
    allDataLoaded = true;
    loadingIndicator.style.display = 'none';
    endMessage.style.display = 'block';
}

function loadingIndicatorShow() {
    loadingIndicator.style.display = 'block';
}

function loadingIndicatorHidden() {
    loadingIndicator.style.display = 'none';
}


