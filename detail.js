let fdStr = localStorage.getItem('foodDetails')
let food = JSON.parse(fdStr);
const container = document.querySelector('html');
const foodDate = document.getElementById('food-date');
const foodTitle = document.getElementById('food-title');
const foodDesc = document.getElementById('food-description');
const imageList = document.getElementById('image-list');
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

if (food.images) {
    getCosUrlList(food.images).then(imgUrls => {
        imgUrls.forEach(imgUrl => {
            imageList.appendChild(createImgItem(imgUrl));
        });
    });
} else {
    imageList.appendChild(createImgItem(food.image));
}

// 创建美食项目
function createImgItem(imgUrl) {
    const item = document.createElement('img');
    item.className = 'food-image';
    item.src = imgUrl;
    item.addEventListener('click', (e) => {
       e.preventDefault();
        openZoomInModal(e.target);
    });
    return item;
}


