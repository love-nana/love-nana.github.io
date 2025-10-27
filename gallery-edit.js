// 定义展示项目数组
let images = [];
// 存储选中的文件
let selectedFiles = [];
// DOM元素
const imageGallery = document.getElementById('imageGallery');
const addImageBtn = document.getElementById('addImageBtn');
const appendPicBtn = document.getElementById('appendPicBtn');
const fileInput = document.getElementById('fileInput');
const appendFileInput = document.getElementById('appendFileInput');
const dropZone = document.getElementById('dropZone');
const uploadPreview = document.getElementById('uploadPreview');
const previewList = document.getElementById('previewList');
const cancelUpload = document.getElementById('cancelUpload');
const confirmUpload = document.getElementById('confirmUpload');
const editModal = document.getElementById('editModal');
const cancelEdit = document.getElementById('cancelEdit');
const submitEdit = document.getElementById('submitEdit');
const imageForm = document.getElementById('imageForm');
const editIndex = document.getElementById('editIndex');
const imageTitle = document.getElementById('imageTitle');
const imageDate = document.getElementById('imageDate');
const imageCategory = document.getElementById('imageCategory');

const imageDescription = document.getElementById('imageDescription');
let editPreviewList = document.getElementById('editPreviewList');

// 当前拖动的元素
let draggedItem = null;
// 加载JSON数据
let cur_timestamp = new Date().getTime()

// 移动端触摸事件处理函数
let touchStartX, touchStartY;
let draggedElement = null;
let dragStartIndex = null;
let touchTimeout = null;
let curEditImage = null;
let appendUploadFileMap = new Map();

document.addEventListener('DOMContentLoaded', function () {
    ignoreContextmenuEvent(editPreviewList);
    if (cosConfig.secretId && cosConfig.secretKey && localStorage.getItem('local_user')) {
        getCosUrl('foodData.json', false).then(filePath => {
            loadJSON(filePath)
                .then(data => {
                    loadImgUrlAndRenderGallery(data);
                });
        });
    } else {
        // 页面加载后显示弹框
        setTimeout(function () {
            modalOverlay.classList.add('active');
        }, 500);
    }
});

// 事件监听
addImageBtn.addEventListener('click', () => {
    fileInput.click();
});
appendPicBtn.addEventListener('click', () => {
    appendFileInput.click();
});
fileInput.addEventListener('change', handleFileSelect);
appendFileInput.addEventListener('change', handleAppendFileSelect);
cancelEdit.addEventListener('click', closeEditModal);
cancelUpload.addEventListener('click', cancelUploadImages);
confirmUpload.addEventListener('click', confirmUploadImages);
imageDate.addEventListener('click', (e) => {
    e.preventDefault();
});
// 表单提交
imageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //需要上传图片
    let uploadImageList = [];
    let imgIndexList = [];
    const index = editIndex.value;
    images[index].title = imageTitle.value;
    images[index].date = imageDate.value;
    images[index].desc = imageDescription.value;
    images[index].category = imageCategory.value;
    if (curEditImage.imageUrls) {
        images[index].imageUrl = curEditImage.imageUrls[0];
    } else {
        images[index].imageUrl = null;
    }
    if (appendUploadFileMap) {
        showLoading();
        appendUploadFileMap.forEach((value, key) => {
            uploadImageList.push(value);
            imgIndexList.push(key);
        });
        console.log('appendUploadFileMap', appendUploadFileMap);
        uploadFiles(uploadImageList).then((results) => {
            for (let i = 0; i < results.length; i++) {
                let picIndex = imgIndexList[i];
                curEditImage.images[picIndex] = results[i];
            }
            console.log('curEditImage', curEditImage.images);
            curEditImage.image = curEditImage.images[0];
            images[index].images = curEditImage.images;
            images[index].image = curEditImage.image;
            hiddenLoading();
            closeEditModal();
            saveChanges();
            renderGallery();
        });
    } else {
        images[index].images = curEditImage.images;
        images[index].image = curEditImage.image;
        closeEditModal();
        saveChanges();
        renderGallery();
    }

});
// 拖放区域事件
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});


['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('active');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('active');
    }, false);
});
dropZone.addEventListener('drop', handleFileSelect);


// 初始化日期选择器
const picker = new Pikaday({
    field: document.getElementById('imageDate'),
    format: 'YYYY-MM-DD',
    i18n: {
        previousMonth: '上一月',
        nextMonth: '下一月',
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        weekdaysShort: ['日', '一', '二', '三', '四', '五', '六']
    },
    onSelect: function (date) {
        // 当选择日期时更新显示
        console.log(parseDate(date));
        document.getElementById('imageDate').value = parseDate(date);
    }
});

// ------------------------------------------------------------------------------
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
        console.error('loadJSON error: ', error);
        delAuthInfo();
        console.error('Error loading JSON:', error);
    }
}


function loadImgUrlAndRenderGallery(data) {
    let fetchArrList = [];
    data.list.forEach(item => {
        fetchArrList.push(item.image)
    });
    getCosUrlList(fetchArrList).then(urlList => {
        for (let i = 0; i < data.list.length; i++) {
            data.list[i].imageUrl = urlList[i] + '&imageMogr2/quality/30';
        }
        images = data.list;
        renderGallery();
    });
}

// 初始化画廊
function renderGallery(append = false, keepCount = false) {
    let lastCount = 0;
    if (keepCount) {
        lastCount = curLoadItemIndex;
    }
    if (!append) {
        resetLoadMore();
        imageGallery.innerHTML = '';
    }
    if (images.length === 0) {
        imageGallery.innerHTML = `
                    <div class="empty-state">
                        <h3>还没有图片</h3>
                        <p>点击"添加图片"按钮上传您的第一张图片</p>
                    </div>
                `;
        return true;
    }
    let matchedItems = [];
    let matchedItemIndexs = [];
    images.forEach((food, index) => {
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
            matchedItemIndexs.push(index);
        }
    });
    let rightIndex;
    if (keepCount) {
        rightIndex = lastCount;
    } else {
        rightIndex = curLoadItemIndex + perNum;
    }
    if (rightIndex > matchedItems.length) {
        rightIndex = matchedItems.length;
    }
    if (rightIndex <= curLoadItemIndex) {
        setAllLoadFinished();
        return true;
    }

    let appendItems = matchedItems.slice(curLoadItemIndex, rightIndex);
    let appendItemIndexs = matchedItemIndexs.slice(curLoadItemIndex, rightIndex);
    appendItems.forEach((image, index) => {
        const imageCard = document.createElement('div');
        imageCard.className = 'image-card';
        imageCard.draggable = true;
        imageCard.dataset.index = appendItemIndexs[index];

        if (image.images && image.images.length > 1) {
            imageCard.innerHTML = `
                    <div class="image-container">
                        <img src="${image.imageUrl}" alt="${image.title}" class="img-style">
                        <div class="pic-num">P${image.images.length}</div>
                    </div>
                    `
        } else {
            imageCard.innerHTML = `
                    <div class="image-container">
                        <img src="${image.imageUrl}" alt="${image.title}" class="img-style">
                    </div>
                    `
        }
        imageCard.innerHTML += `
                    <div class="image-info">
                        <p class="image-date single-line-ellipsis">${image.date}</p>
                        <h3 class="image-title single-line-ellipsis">${image.title}</h3>
                        <p class="image-description single-line-ellipsis">${image.desc}</p>
                    </div>
                    <div class="image-actions">
                        <button class="action-btn edit-btn" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                            </svg>
                            编辑
                        </button>
                        <button class="action-btn delete-btn" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                            删除
                        </button>
                    </div>
                `;
        imageGallery.appendChild(imageCard);
        ignoreContextmenuEvent(imageCard);
        // 添加事件监听器
        addEventListeners(imageCard);
    });
    curLoadItemIndex = rightIndex;
    if (appendItems.length < perNum) {
        return true;
    } else {
        loadingIndicatorShow();
        return false;
    }
}

// 上传文件到腾讯云COS
function uploadFilesToCOS() {
    showLoading();
    uploadFiles(selectedFiles).then(results => {

        getCosUrl(results[0]).then(url => {
            let newImage = {
                image: results[0],
                title: '',
                date: '',
                desc: '',
                imageUrl: url,
                images: results,
                imageUrls: [],
                user: localStorage.getItem('local_user')
            };
            images.unshift(newImage);
            hiddenLoading();
            renderGallery();
            saveChanges();
        })
    }).finally(() => {
        // 重置上传状态
        cancelUploadImages();
    });
}

// 添加事件监听器
function addEventListeners(imageCard) {
    // 编辑按钮
    imageCard.querySelector('.edit-btn')
        .addEventListener('click', (e) => {
            const index = parseInt(imageCard.dataset.index);
            openEditModal(index);
        });

    // 删除按钮
    imageCard.querySelector('.delete-btn')
        .addEventListener('click', (e) => {
            const index = parseInt(imageCard.dataset.index);
            deleteImage(index);
        });
    // 拖放功能
    imageCard.addEventListener('dragstart', handleDragStart);
    imageCard.addEventListener('dragend', handleDragEnd);
    imageCard.addEventListener('dragover', handleDragOver);
    imageCard.addEventListener('dragenter', handleDragEnter);
    imageCard.addEventListener('dragleave', handleDragLeave);
    imageCard.addEventListener('drop', handleDrop);
    imageCard.addEventListener('touchstart', handleTouchStart, {passive: false});
    imageCard.addEventListener('touchmove', handleTouchMove, {passive: false});
    imageCard.addEventListener('touchend', handleTouchEnd);
    imageCard.addEventListener('touchcancel', handleTouchEnd);
    imageCard.querySelector('.image-container').addEventListener('click', (e) => {
        showDetail(images[parseInt(imageCard.dataset.index)]);
    })
}

function addEditPicMoveEvent(previewItem) {
    // 拖放功能
    previewItem.addEventListener('dragstart', handleDragStart);
    previewItem.addEventListener('dragend', handlePreviewPicDragEnd);
    previewItem.addEventListener('dragover', handleDragOver);
    previewItem.addEventListener('dragenter', handleDragEnter);
    previewItem.addEventListener('dragleave', handleDragLeave);
    previewItem.addEventListener('drop', handlePreviewPicDrop);
    previewItem.addEventListener('touchstart', handleAppendPicTouchStart, {passive: false});
    previewItem.addEventListener('touchmove', handleAppendPicTouchMove, {passive: false});
    previewItem.addEventListener('touchend', handleAppendPicTouchEnd);
    previewItem.addEventListener('touchcancel', handleAppendPicTouchEnd);
}


// 拖放相关函数
function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.image-card').forEach(card => {
        card.classList.remove('over');
    });
}

function handlePreviewPicDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('#editPreviewList .preview-item').forEach(card => {
        card.classList.remove('over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    e.stopPropagation();
    if (draggedItem !== this) {
        const fromIndex = parseInt(draggedItem.dataset.index);
        const toIndex = parseInt(this.dataset.index);

        // 交换数组中的元素
        [images[fromIndex], images[toIndex]] = [images[toIndex], images[fromIndex]];

        // 重新渲染画廊
        renderGallery(false, true);
        saveChanges();
    }

    return false;
}

function handlePreviewPicDrop(e) {
    e.stopPropagation();
    if (draggedItem !== this) {
        const fromIndex = parseInt(draggedItem.dataset.index);
        const toIndex = parseInt(this.dataset.index);
        if (fromIndex === toIndex) {
            return false;
        }
        handleSwapAppendPic(this, draggedItem, fromIndex, toIndex);
    }
    return false;
}

function handleSwapAppendPic(target, drapEle, fromIndex, toIndex) {
    // 交换数组中的元素
    [curEditImage.images[fromIndex], curEditImage.images[toIndex]] = [curEditImage.images[toIndex], curEditImage.images[fromIndex]];
    [curEditImage.imageUrls[fromIndex], curEditImage.imageUrls[toIndex]] = [curEditImage.imageUrls[toIndex], curEditImage.imageUrls[fromIndex]];
    drapEle.dataset.index = toIndex;
    target.dataset.index = fromIndex;
    if (appendUploadFileMap.get(fromIndex) != null && appendUploadFileMap.get(toIndex) != null) {
        let tmp = appendUploadFileMap.get(toIndex);
        appendUploadFileMap.set(toIndex, appendUploadFileMap.get(fromIndex));
        appendUploadFileMap.set(fromIndex, tmp);
    } else if (appendUploadFileMap.get(fromIndex) != null) {
        appendUploadFileMap.set(toIndex, appendUploadFileMap.get(fromIndex));
        appendUploadFileMap.delete(fromIndex);
    } else if (appendUploadFileMap.get(toIndex) != null) {
        appendUploadFileMap.set(fromIndex, appendUploadFileMap.get(toIndex));
        appendUploadFileMap.delete(toIndex);
    }
    if (fromIndex < toIndex) {
        swapChildren(editPreviewList, fromIndex, toIndex);
    } else {
        swapChildren(editPreviewList, toIndex, fromIndex);
    }
    curEditImage.image = curEditImage.images[0];
    curEditImage.imageUrl = curEditImage.imageUrls[0];
}


// 交换两个指定索引的子元素
function swapChildren(parent, index1, index2) {
    console.log('swapChildren', parent, index1, index2);
    const children = parent.children;
    if (index1 < 0 || index2 < 0 || index1 >= children.length || index2 >= children.length) {
        return;
    }

    const node1 = children[index1];
    const node2 = children[index2];
    // 先插入node1到node2的位置
    parent.insertBefore(node1, node2);
    // 再插入node2到node1原来的位置
    parent.insertBefore(node2, children[index1]);
}


function handleTouchStart(e) {
    if (!e.target.classList.contains('action-btn')) {
        touchTimeout = setTimeout(() => {
            draggedElement = this;
            dragStartIndex = parseInt(this.dataset.index);
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            this.classList.add('dragging');
            // 添加移动端拖拽时的视觉反馈
            document.body.style.overflow = 'hidden';
        }, 1000);
    }
}


function handleTouchMove(e) {
    console.log('handleTouchMove')
    if (!draggedElement) return;
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    // 更新元素位置
    draggedElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // 检测碰撞并交换位置
    const elements = Array.from(document.querySelectorAll('.image-card:not(.dragging)'));
    const draggedRect = draggedElement.getBoundingClientRect();

    let swapElement = null;

    for (const element of elements) {
        const rect = element.getBoundingClientRect();

        // 简单的碰撞检测
        if (
            draggedRect.left < rect.right &&
            draggedRect.right > rect.left &&
            draggedRect.top < rect.bottom &&
            draggedRect.bottom > rect.top
        ) {
            let draggedRectCenterX = (draggedRect.left + draggedRect.right) / 2;
            let draggedRectCenterY = (draggedRect.top + draggedRect.bottom) / 2;
            let rectCenterX = (rect.left + rect.right) / 2;
            let rectCenterY = (rect.top + rect.bottom) / 2;
            if (Math.abs(draggedRectCenterX - rectCenterX) < 50 && Math.abs(draggedRectCenterY - rectCenterY) < 50) {
                swapElement = element;
                break;
            }
        }
    }

    if (swapElement && swapElement !== draggedElement) {
        const swapIndex = parseInt(swapElement.dataset.index);

        // 交换数据
        [images[dragStartIndex], images[swapIndex]] = [images[swapIndex], images[dragStartIndex]];
        // 更新索引
        dragStartIndex = swapIndex;

        // 重新渲染画廊
        renderGallery(false, true);
        saveChanges();
    }
}

function handleTouchEnd(e) {
    console.log('handleTouchEnd', e)
    // 重置样式
    if (touchTimeout) {
        console.log('clear touchTimeout')
        clearTimeout(touchTimeout)
    }
    let card_list = document.querySelectorAll('.image-card');
    card_list.forEach(item => {
        item.classList.remove('dragging');
    });
    if (!draggedElement) return;
    draggedElement.style.transform = '';
    draggedElement.classList.remove('dragging');
    document.body.style.overflow = '';
    draggedElement = null;
}

function handleAppendPicTouchStart(e) {
    let card_list = document.querySelectorAll('#editPreviewList .preview-item');
    card_list.forEach(item => {
        item.classList.remove('dragging');
    });
    if (!e.target.classList.contains('remove-btn')) {
        e.preventDefault();
        e.stopPropagation();
        touchTimeout = setTimeout(() => {
            draggedElement = this;
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            this.classList.add('dragging');
            // 添加移动端拖拽时的视觉反馈
            document.getElementById('modalContent').style.overflow = 'hidden';
        }, 100);
    }
}


function handleAppendPicTouchMove(e) {
    console.log('handleTouchMove')
    if (!draggedElement) return;
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    // 更新元素位置
    draggedElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
}


function handleAppendPicTouchEnd(e) {
    // 重置样式
    if (touchTimeout) {
        clearTimeout(touchTimeout)
    }
    if (!draggedElement) return;
    e.preventDefault();
    e.stopPropagation();
    // 检测碰撞并交换位置
    const elements = Array.from(document.querySelectorAll('#editPreviewList .preview-item:not(.dragging)'));
    const draggedRect = draggedElement.getBoundingClientRect();
    let swapElement = null;
    for (const element of elements) {
        const rect = element.getBoundingClientRect();
        // 简单的碰撞检测
        if (
            draggedRect.left < rect.right &&
            draggedRect.right > rect.left &&
            draggedRect.top < rect.bottom &&
            draggedRect.bottom > rect.top
        ) {
            let draggedRectCenterX = (draggedRect.left + draggedRect.right) / 2;
            let draggedRectCenterY = (draggedRect.top + draggedRect.bottom) / 2;
            let rectCenterX = (rect.left + rect.right) / 2;
            let rectCenterY = (rect.top + rect.bottom) / 2;
            if (Math.abs(draggedRectCenterX - rectCenterX) < 50 && Math.abs(draggedRectCenterY - rectCenterY) < 50) {
                swapElement = element;
                break;
            }
        }
    }
    console.log('swapElement', swapElement);
    if (swapElement && swapElement !== draggedElement) {
        handleSwapAppendPic(swapElement, draggedElement, parseInt(draggedElement.dataset.index), parseInt(swapElement.dataset.index));
    }
    let card_list = document.querySelectorAll('#editPreviewList .preview-item');
    card_list.forEach(item => {
        item.classList.remove('dragging');
    });
    draggedElement.style.transform = '';
    draggedElement.classList.remove('dragging');
    document.getElementById('modalContent').style.overflow = '';
    draggedElement = null;
}


function ignoreContextmenuEvent(target) {
    // 监听上下文菜单事件（长按触发）
    target.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        console.log('菜单已激活 (长按)');
    });
}


// 打开编辑模态框
function openEditModal(index) {
    const image = images[index];
    editIndex.value = index;
    imageTitle.value = image.title;
    imageDescription.value = image.desc;
    imageCategory.value = image.category;
    imageDate.value = image.date;
    editModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    showEditPics(image);
}

function showEditPics(image) {
    curEditImage = deepCloneJSON(image);
    appendUploadFileMap = new Map();
    editPreviewList.innerHTML = '';
    if (!curEditImage.images) {
        return;
    }
    getCosUrlList(curEditImage.images).then((urls) => {
        urls.forEach((url, index) => {
            curEditImage.imageUrls[index] = url;
            const previewItem = document.createElement('div');
            previewItem.dataset.index = index;
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                        <img src="${url}"><i class="fa-solid fa-circle-xmark remove-btn" data-index="${index}"></i>
                        `;
            editPreviewList.appendChild(previewItem);
            // 添加移除按钮事件
            previewItem.querySelector('.remove-btn').addEventListener('click', function () {
                const idx = parseInt(previewItem.dataset.index);
                curEditImage.images.splice(idx, 1);
                curEditImage.imageUrls.splice(idx, 1);
                editPreviewList.removeChild(previewItem);
                for (let i = idx; i < editPreviewList.children.length; i++) {
                    editPreviewList.children[i].dataset.index = i;
                    console.log('editPreviewList.children[i]', i);
                }
                if (appendUploadFileMap) {
                    const sortedKeys = Array.from(appendUploadFileMap.keys()).sort();
                    sortedKeys.forEach((key) => {
                        if (key === idx) {
                            appendUploadFileMap.delete(key);
                        } else if (key < idx) {
                            //
                        } else {
                            appendUploadFileMap.set(key - 1, appendUploadFileMap.get(key));
                            appendUploadFileMap.delete(key);
                        }
                    })
                }
            });
            ignoreContextmenuEvent(previewItem);
            ignoreContextmenuEvent(previewItem.querySelector('img'));
            addEditPicMoveEvent(previewItem);
        });
    });
}

function appendEditPics() {
    if (!appendUploadFiles) {
        return;
    }
    let beforeAddCnt = curEditImage.images.length;
    handleFilesAsync(appendUploadFiles);
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function handleFilesAsync(files) {
    let beforeAddCnt = curEditImage.images.length;
    for (let index = 0; index < files.length; index++) {
        try {
            let file = files[index];
            const dataUrl = await readFileAsDataURL(file);
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            let pIndex = index + beforeAddCnt;
            previewItem.dataset.index = pIndex;
            previewItem.innerHTML = `
                        <img src="${dataUrl}"><i class="fa-solid fa-circle-xmark remove-btn" data-index="${pIndex}"></i>
                        `;
            editPreviewList.appendChild(previewItem);
            curEditImage.images.push(dataUrl);
            curEditImage.imageUrls.push(dataUrl);
            appendUploadFileMap.set(curEditImage.images.length - 1, file);
            // 添加移除按钮事件
            previewItem.querySelector('.remove-btn').addEventListener('click', function () {
                const idx = parseInt(previewItem.dataset.index);
                curEditImage.images.splice(idx, 1);
                curEditImage.imageUrls.splice(idx, 1);
                editPreviewList.removeChild(previewItem);
                for (let i = idx; i < editPreviewList.children.length; i++) {
                    editPreviewList.children[i].dataset.index = i;
                    console.log('editPreviewList.children[i]', i);
                }
                if (appendUploadFileMap) {
                    const sortedKeys = Array.from(appendUploadFileMap.keys()).sort();
                    sortedKeys.forEach((key) => {
                        if (key === idx) {
                            appendUploadFileMap.delete(key);
                        } else if (key < idx) {
                            //
                        } else {
                            appendUploadFileMap.set(key - 1, appendUploadFileMap.get(key));
                            appendUploadFileMap.delete(key);
                        }
                    })
                }
            });
            ignoreContextmenuEvent(previewItem);
            ignoreContextmenuEvent(previewItem.querySelector('img'));
            addEditPicMoveEvent(previewItem);
        } catch (error) {
            console.error('Error reading file:', error);
        }
    }
}

// 假设 files 是通过 input[type="file"][multiple] 获取的文件列表
const inputElement = document.querySelector('input[type="file"]');
inputElement.addEventListener('change', function(event) {
    const files = event.target.files;
    handleFilesAsync(files);
});





// 关闭编辑模态框
function closeEditModal() {
    document.getElementById('modalContent').scrollTop = 0;
    editModal.style.display = 'none';
    imageForm.reset();
    document.body.style.overflow = 'auto'; //恢复
}

// 删除图片
function deleteImage(index) {
    if (confirm('确定要删除这张图片吗？')) {
        console.log('deleteImage', index, images[index]);
        images.splice(index, 1);
        saveChanges();
        renderGallery(false, true);
    }
}

// 处理文件选择
function handleFileSelect(e) {
    const files = e.target.files || e.dataTransfer.files;

    if (files.length > 0) {
        selectedFiles = Array.from(files);
        showPreview(selectedFiles);
    }
}

// 处理文件选择
function handleAppendFileSelect(e) {
    const files = e.target.files || e.dataTransfer.files;
    if (files.length > 0) {
        appendUploadFiles = Array.from(files);
        appendEditPics();
        appendUploadFiles = [];
    }
}


// 显示文件预览
async function showPreview(files) {
    previewList.innerHTML = '';
    for (let index = 0; index < files.length; index++) {
        let file = files[index];
        const dataUrl = await readFileAsDataURL(file);
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
                        <img src="${dataUrl}" alt="${file.name}">
                        <i class="fa-solid fa-circle-xmark remove-btn" data-index="${index}"></i>
                    `;
        previewList.appendChild(previewItem);
        // 添加移除按钮事件
        previewItem.querySelector('.remove-btn').addEventListener('click', function () {
            const idx = parseInt(this.dataset.index);
            selectedFiles.splice(idx, 1);
            showPreview(selectedFiles);
        });
    }
    uploadPreview.style.display = 'block';
}

// 确认上传图片
function confirmUploadImages() {
    if (selectedFiles.length === 0) {
        alert('请选择要上传的图片');
        return;
    }

    uploadFilesToCOS();
}

// 取消上传
function cancelUploadImages() {
    selectedFiles = [];
    uploadPreview.style.display = 'none';
    fileInput.value = '';
}

function deepCloneJSON(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// 保存更改
function saveChanges() {
    // 在实际应用中，这里应该将数据发送到服务器
    showLoading();
    //foodData.json文件名
    const fileName = `foodData.json`;
    let saveObj = deepCloneJSON({'list': images});
    saveObj.list.forEach((image, index) => {
        image.imageUrl = null
        image.imageUrls = []
        if (image.images) {
            image.image = image.images[0];
        } else {
            image.image = null;
        }
    })
    let uploadContent = JSON.stringify(saveObj);
    uploadStrFile(fileName, uploadContent).then((err, data) => {
        hiddenLoading()
        if (err) {
            showNotification('error', '保存失败', err);
        } else {
            // showNotification('success', '成功', '已保存')
        }
    }).catch((error) => {
        hiddenLoading()
        showNotification('error', '保存失败', error);
    });

}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function parseDate(date) {
    // 获取年月日
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1); // 月份从0开始，需要+1
    const day = String(date.getDate());
    // 格式化为 YYYY-MM-DD
    const dateString = `${year}.${month}.${day}`;
    return dateString;
}

function delAuthInfo() {
    localStorage.removeItem("local_cosId")
    localStorage.removeItem("local_cosToken")
}

//拖拽文本框
// 自定义textarea高度调整功能
const textarea = document.getElementById('imageDescription');
const handle = document.getElementById('resize-handle');
let isResizing = false;
let startY, startHeight;
// 鼠标/触摸事件监听
handle.addEventListener('mousedown', initResize);
handle.addEventListener('touchstart', initResize);

function initResize(e) {
    e.preventDefault();
    isResizing = true;
    // 记录初始位置和高度
    startY = e.clientY || e.touches[0].clientY;
    startHeight = parseInt(document.defaultView.getComputedStyle(textarea).height, 10);
    // 添加事件监听
    document.addEventListener('mousemove', resize);
    document.addEventListener('touchmove', resize);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('touchend', stopResize);
    // 添加激活样式
    handle.style.backgroundColor = '#2980b9';
}

function resize(e) {
    if (!isResizing) return;
    e.preventDefault();
    // 计算新的高度
    const currentY = e.clientY || e.touches[0].clientY;
    const deltaY = currentY - startY;
    let newHeight = startHeight + deltaY;
    // 限制最小和最大高度
    newHeight = Math.max(100, Math.min(500, newHeight));
    // 应用新高度
    textarea.style.height = newHeight + 'px';
}

function stopResize() {
    isResizing = false;
    // 移除事件监听
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('touchmove', resize);
    document.removeEventListener('mouseup', stopResize);
    document.removeEventListener('touchend', stopResize);
    // 恢复手柄样式
    handle.style.backgroundColor = '#3498db';
}

function loadMoreItems() {
    return renderGallery(true);
}


function showDetail(item) {
    localStorage.setItem('foodDetails', JSON.stringify(item));
    window.open('./detail.html', '_blank');
}

getCosUrl('assert/header-bg.jpg').then(res => {
    document.getElementById('header-bg').style.backgroundImage = 'url(' + res + ')';
});


