function dayRan() {
    // 当前时间
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    // 过去时间
    const target = new Date("2025-08-03");
    target.setHours(0, 0, 0, 0);
    // 计算时间差（毫秒）
    const timeDiff = now - target;
    // 转换为天数（1000毫秒 * 60秒 * 60分钟 * 24小时）
    console.log('timeDiff:', timeDiff)
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
    return dayDiff;
}

function dayTouch() {
    // 当前时间
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    // 过去时间
    const target = new Date("2025-06-19");
    target.setHours(0, 0, 0, 0);
    // 计算时间差（毫秒）
    const timeDiff = now - target;
    // 转换为天数（1000毫秒 * 60秒 * 60分钟 * 24小时）
    console.log('timeDiff touch:', timeDiff)
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
    return dayDiff;
}

function curDateStr() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要+1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatCurDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
}

function onStart() {
    let p_dayRan = document.getElementById("p_dayRan")
    fillContent(p_dayRan, dayRan().toString())
    let p_dayTouch = document.getElementById("p_dayTouch")
    fillContent(p_dayTouch, dayTouch().toString())

    let p_now_date = document.getElementById("p_now_date")
    fillContent(p_now_date, curDateStr())
}

function fillContent(ele, replaceContent) {
    ele.innerText = ele.innerText.replace('{{}}', replaceContent)
}

window.onload = function () {
    onStart()
    music_kick()
};

function music_kick(){
    // 获取元素
    const musicButton = document.getElementById('music-player');
    const bgMusic = document.getElementById('bg-music');

// 初始状态
    let isPlaying = false;

// 点击事件处理
    musicButton.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            musicButton.textContent = '♪';
            musicButton.style.backgroundColor = '#4CAF50';
        } else {
            bgMusic.play();
            musicButton.textContent = '❚❚';
            musicButton.style.backgroundColor = '#f44336';
        }
        isPlaying = !isPlaying;
    });

// 页面加载后自动播放音乐（需要用户交互后）
//     document.addEventListener('click', function() {
//         if (!isPlaying) {
//             bgMusic.play().then(() => {
//                 isPlaying = true;
//                 musicButton.textContent = '❚❚';
//                 musicButton.style.backgroundColor = '#f44336';
//             }).catch(error => {
//                 console.log('自动播放被阻止:', error);
//             });
//         }
//     }, { once: true });
}





