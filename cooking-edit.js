// 定义展示项目数组
let images = [];

// 腾讯云COS配置
// 注意：在实际应用中，这些敏感信息应该从后端获取，而不是直接写在前端代码中
const cosConfig = {
    bucket: 'aurora-1259397844', // 替换为您的存储桶名称
    region: 'ap-nanjing',       // 替换为您的存储桶所在地域
    secretId: localStorage.getItem('local_cosId'), // 从后端获取，不要写死在前端
    secretKey: localStorage.getItem('local_cosToken') // 从后端获取，不要写死在前端
};
// 初始化COS SDK
let cos = new COS({
    SecretId: cosConfig.secretId,
    SecretKey: cosConfig.secretKey
});


// 存储选中的文件
let selectedFiles = [];

// DOM元素
const imageGallery = document.getElementById('imageGallery');
const addImageBtn = document.getElementById('addImageBtn');
const fileInput = document.getElementById('fileInput');
const saveBtn = document.getElementById('saveBtn');
const dropZone = document.getElementById('dropZone');
const uploadPreview = document.getElementById('uploadPreview');
const previewList = document.getElementById('previewList');
const cancelUpload = document.getElementById('cancelUpload');
const confirmUpload = document.getElementById('confirmUpload');
const editModal = document.getElementById('editModal');
const closeModal = document.getElementById('closeModal');
const cancelEdit = document.getElementById('cancelEdit');
const imageForm = document.getElementById('imageForm');
const editIndex = document.getElementById('editIndex');
const imageTitle = document.getElementById('imageTitle');
const imageDate = document.getElementById('imageDate');

const cosTokenInput = document.getElementById('cosToken');
const cosIdIdInput = document.getElementById('cosId');
const cosTokenContainer = document.getElementById('cosTokenContainer');
const cosIdContainer = document.getElementById('cosIdContainer');
const imageDescription = document.getElementById('imageDescription');
const loadingOverlay = document.getElementById('loadingOverlay');
const notification = document.getElementById('notification');
const notificationTitle = document.getElementById('notificationTitle');
const notificationMessage = document.getElementById('notificationMessage');
// 当前拖动的元素
let draggedItem = null;

//隐藏token输入
if (cosConfig.secretKey && cosConfig.secretId) {
    hideInputToken();
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

// 加载JSON数据
let cur_timestamp = new Date().getTime()
loadJSON(`https://aurora-1259397844.cos.ap-nanjing.myqcloud.com/nana/foodData.json?t=${cur_timestamp}`)
    .then(data => {
        console.log('Loaded data:', data);
        images = data.list;
        renderGallery();
    });

// 初始化画廊
function renderGallery() {
    // images.sort((a, b) => a.id - b.id);
    imageGallery.innerHTML = '';
    if (images.length === 0) {
        imageGallery.innerHTML = `
                    <div class="empty-state">
                        <h3>还没有图片</h3>
                        <p>点击"添加图片"按钮上传您的第一张图片</p>
                    </div>
                `;
        return;
    }

    images.forEach((image, index) => {
        const imageCard = document.createElement('div');
        imageCard.className = 'image-card';
        imageCard.draggable = true;
        imageCard.dataset.index = index;

        imageCard.innerHTML = `
                    <div class="image-container">
                        <img src="${image.image}" alt="${image.title}" class="img-style">
                    </div>
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
    });
    // 添加事件监听器
    addEventListeners();
}

// 上传文件到腾讯云COS
function uploadFilesToCOS() {
    rebindToken();
    showLoading();
    const uploadPromises = selectedFiles.map((file, index) => {
        return new Promise((resolve, reject) => {
            // 生成文件名（时间戳+随机数）
            const fileExtension = file.name.split('.').pop();
            const fileName = `nana/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
            cos.putObject({
                Bucket: cosConfig.bucket,
                Region: cosConfig.region,
                Key: fileName,
                Body: file
            }, (err, data) => {
                if (err) {
                    hiddenLoading();
                    reject(err);
                } else {
                    // 构建访问URL
                    const imageUrl = `https://${cosConfig.bucket}.cos.${cosConfig.region}.myqcloud.com/${fileName}`;
                    resolve({fileName: file.name, url: imageUrl});
                }
            });
        });
    });

    // 等待所有文件上传完成
    Promise.all(uploadPromises)
        .then(results => {
            selectedFiles = []
            results.forEach(result => {
                let newImage = {
                    image: result.url,
                    title: '',
                    date: '',
                    desc: ''
                };
                images.unshift(newImage)
            });
            hiddenLoading();
            hideInputToken();
            renderGallery();
        })
        .catch(err => {
            hiddenLoading()
            showNotification('error', '失败', err.message);
            showInputToken();
        }).finally(() => {
        // 重置上传状态
        cancelUploadImages();
    });
}


function rebindToken() {
    let inputCosToken = cosTokenInput.value?cosTokenInput.value.trim():'';
    if (inputCosToken && inputCosToken !== '') {
        cosConfig.secretKey = inputCosToken;
        cos = new COS({
            SecretId: cosConfig.secretId,
            SecretKey: cosConfig.secretKey
        });
    }
    let cosId = cosIdIdInput.value?cosIdIdInput.value.trim():'';
    if (cosId && cosId !== '') {
        cosConfig.secretId = cosId;
        cos = new COS({
            SecretId: cosConfig.secretId,
            SecretKey: cosConfig.secretKey
        });
    }
}


// 添加事件监听器
function addEventListeners() {
    // 编辑按钮
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            openEditModal(index);
        });
    });

    // 删除按钮
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            deleteImage(index);
        });
    });

    // 拖放功能
    document.querySelectorAll('.image-card').forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('dragenter', handleDragEnter);
        card.addEventListener('dragleave', handleDragLeave);
        card.addEventListener('drop', handleDrop);

        card.addEventListener('touchstart', handleTouchStart, { passive: false });
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd);
        card.addEventListener('touchcancel', handleTouchEnd);
    });
}

// 拖放相关函数
function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    console.log('handleDragEnd', e);
    this.classList.remove('dragging');
    document.querySelectorAll('.image-card').forEach(card => {
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
        renderGallery();
    }

    return false;
}

// 移动端触摸事件处理函数
let touchStartX, touchStartY;
let draggedElement = null;
let dragStartIndex = null;
let touchTimeout = null;

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
            swapElement = element;
            break;
        }
    }

    if (swapElement && swapElement !== draggedElement) {
        const swapIndex = parseInt(swapElement.dataset.index);

        // 交换数据
        [images[dragStartIndex], images[swapIndex]] = [images[swapIndex], images[dragStartIndex]];
        // 更新索引
        dragStartIndex = swapIndex;

        // 重新渲染画廊
        renderGallery();
    }
}

function handleTouchEnd(e) {
    console.log('handleTouchEnd',e)
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

function ignoreContextmenuEvent(target) {
    // 监听上下文菜单事件（长按触发）
    target.addEventListener('contextmenu', function(e) {
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
    imageDate.value = image.date;
    editModal.style.display = 'flex';
}

// 关闭编辑模态框
function closeEditModal() {
    editModal.style.display = 'none';
    imageForm.reset();
}

// 删除图片
function deleteImage(index) {
    if (confirm('确定要删除这张图片吗？')) {
        images.splice(index, 1);
        renderGallery();
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

// 显示文件预览
function showPreview(files) {
    previewList.innerHTML = '';

    files.forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';

            previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="${file.name}">
                        <button class="remove-btn" data-index="${index}">&times;</button>
                    `;

            previewList.appendChild(previewItem);

            // 添加移除按钮事件
            previewItem.querySelector('.remove-btn').addEventListener('click', function () {
                const idx = parseInt(this.dataset.index);
                selectedFiles.splice(idx, 1);
                showPreview(selectedFiles);
            });
        };

        reader.readAsDataURL(file);
    });

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

// 保存更改
function saveChanges() {
    // 在实际应用中，这里应该将数据发送到服务器
    showLoading();
    rebindToken();
    //foodData.json文件名
    const fileName = `nana/foodData.json`;
    console.log('save data:', images)
    try {
        cos.putObject({
            Bucket: cosConfig.bucket,
            Region: cosConfig.region,
            Key: fileName,
            Body: JSON.stringify({'list': images})
        }, (err, data) => {
            console.log(data)
            hiddenLoading()
            if (err) {
                showNotification('error', '保存失败', err);
            } else {
                showNotification('success', '成功', '已保存')
            }
        });
    }catch (error) {
        hiddenLoading()
        showNotification('error', '保存失败', error);
    }
}

// 事件监听
addImageBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', handleFileSelect);
saveBtn.addEventListener('click', saveChanges);
cancelEdit.addEventListener('click', closeEditModal);
cancelUpload.addEventListener('click', cancelUploadImages);
confirmUpload.addEventListener('click', confirmUploadImages);

imageDate.addEventListener('click', (e)=> {
    e.preventDefault();
});

// 表单提交
imageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const index = editIndex.value;
    images[index].title = imageTitle.value;
    images[index].date = imageDate.value;
    images[index].desc = imageDescription.value;
    renderGallery();
    closeEditModal();
});

// 拖放区域事件
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

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


function showInputToken() {
    cosTokenContainer.style.display = "block";
    cosIdContainer.style.display = "block";
    localStorage.removeItem('local_cosToken');
    localStorage.removeItem('local_cosId');

}

function hideInputToken() {
    cosTokenContainer.style.display = "none";
    cosIdContainer.style.display = "none";
    localStorage.setItem('local_cosToken', cosConfig.secretKey);
    localStorage.setItem('local_cosId', cosConfig.secretId);
}


function showLoading() {
    loadingOverlay.classList.add('active');
}

function hiddenLoading() {
    loadingOverlay.classList.remove('active');
}

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


function parseDate(date) {
    // 获取年月日
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1); // 月份从0开始，需要+1
    const day = String(date.getDate());
    // 格式化为 YYYY-MM-DD
    const dateString = `${year}.${month}.${day}`;
    return dateString;
}

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
    onSelect: function(date) {
        // 当选择日期时更新显示
        console.log(parseDate(date));
        document.getElementById('imageDate').value = parseDate(date);
    }
});


