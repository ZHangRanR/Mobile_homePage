// 选择需要操作的节点
const swiperContainer = $('.swiperContainer');
const ul = $('.swiperWrapper');
const lis = $$('.swiperDotsContainer li')
let currentImg = 0; // 当前图片的下标，默认值是 0，代表第一张图片
let timer = null; // 计时器ID




// 自动轮播函数
function startAutoPlay() {
    stopAutoPlay();
    // 每间隔五秒切换一次显示的图片
    timer = setInterval(function () {
        currentImg++;
        ul.style.transition = 'all .5s';
        changeImg();
    }, 5000)
}
startAutoPlay();

// 停止自动轮播
function stopAutoPlay() {
    clearInterval(timer);
    timer = null;
}

// 根据当前的下标来改变 ul 的 left 值
function changeImg() {
    if (currentImg > 3) {
        // 当轮播图展示图片下标为 3 时, 五秒后使其跳转到下标为 0 的图片
        currentImg = 0;
        ul.style.left = '0px';
        ul.style.transition = 'none';
    } else {
        // 计算当前 ul 偏移值
        let offsetLeft = currentImg * swiperContainer.clientWidth;
        ul.style.left = -offsetLeft + 'px'
    }

    changDots(currentImg);
}


// 为图片对应的圆点添加样式
function changDots(index){
  $(".swiperDotsItemActive").classList.remove('swiperDotsItemActive');
  lis[index].classList.add('swiperDotsItemActive');

}

// 点击小圆点进行切换图片
const dotsContianer = $('.swiperDotsContainer');
dotsContianer.addEventListener("click", function (e) {
    // 只有点击元素有 swiperDotsItem 类名时,触发该事件
    if (e.target.classList.contains("swiperDotsItem")) {
        currentImg = e.target.dataset.id;
        changeImg();

        // 先停止计时器，然后再重新开始轮播
        // 使其遵循 5s 自动执行一次
        startAutoPlay();
    }
})

// 手指滑动轮播图
swiperContainer.addEventListener("touchstart", function (ev) {
    // 获取触摸点的 x 和 y 坐标
    let x = ev.touches[0].clientX;
    let y = ev.touches[0].clientY;

    // 获取当前 ul 的 left 值
    let ulLeft = parseInt(ul.style.left);

    stopAutoPlay();
    ul.style.transition = 'none';


    swiperContainer.addEventListener("touchmove", function (ev) {
        // 计算触点的移动距离
        let disX = ev.touches[0].clientX - x;
        let disY = ev.touches[0].clientY - y;

        // 如果横向移动的距离小于纵向移动的距离
        if (Math.abs(disX) < Math.abs(disY)) {
            return;
        }
        // 否则, 改变 ul 的 left 值
        let newUlLeft = ulLeft + disX;



        // 进行边界判断
        if (newUlLeft < (-3 * swiperContainer.clientWidth)) {
            // 如果当前为最后一张图片, 则无法向左滑动
            newUlLeft = -3 * swiperContainer.clientWidth
        }
        if (newUlLeft > 0) {
            // 如果当前为第一张图片, 则无法向右滑动
            newUlLeft = 0;
        }

        // 设置 ul 的 left 值
        ul.style.left = newUlLeft + 'px';
    });

    swiperContainer.addEventListener("touchend", function (ev) {
        let disX = ev.changedTouches[0].clientX - x;

        if (disX < -30 && currentImg != 3) {
            currentImg++;
        } else if (disX > 30 && currentImg != 0) {
            currentImg--;
        }

        ul.style.transition = 'all .5s';
        changeImg();
        startAutoPlay();
    })
})


// 新闻资讯
const newsTab = $('.newsTabList');
const newsTab_li = $$('.newsTabList li');

newsTab.addEventListener('click', function (e) {
    let index = e.target.dataset.id;
    for (let item of newsTab_li) {
        item.classList.remove('newsTabItemActive');
    }
    newsTab_li[index].classList.add('newsTabItemActive');

    // 请求数据
    // index 为用户点击的 li 的下标
    getNewsInfo(index);
})

// 根据 index 来发送请求，获取数据
function getNewsInfo(index) {
    switch (~~index) {
        case 0: {
            ajax({
                url: '../data/lastest.json',
                type: 'GET',
                success: function (res) {
                    // 渲染响应数据
                    renderList(JSON.parse(res))
                }
            })
            break;
        }
        case 1: {
            ajax({
                url: '../data/news.json',
                type: 'GET',
                success: function (res) {
                    renderList(JSON.parse(res))
                }
            })
            break;
        }
        case 2: {
            ajax({
                url: '../data/notice.json',
                type: 'GET',
                success: function (res) {
                    renderList(JSON.parse(res))
                }
            })
            break;
        }
        case 3: {
            ajax({
                url: '../data/event.json',
                success: function (res) {
                    renderList(JSON.parse(res))
                }
            })
            break;
        }
    }
}

const newsList = $('.newsList');

// 渲染函数
function renderList(arr) {
    // 根据传入的数组，动态渲染数据
    let result = arr.map(function (item) {
        return `
            <li>
                <a href="#" class="newsItem" title="${item.title}">
                    <p class="newsTitle">${item.title}</p>
                    <p class="newsDate">${item.date}</p>
                </a>
            </li>
        `
    }).join('');
    newsList.innerHTML = result;
}

// 请求下标为 0 的数据
getNewsInfo(0);


// 请求 footer 的内容
ajax({
    url: '../components/footer.html',
    success: function (res) {
        $('#footerScreen').innerHTML = res;
    }
})

// 滚动事件
const container = $('.container');
const header = $('.container header');
const logo = $('#firstScreen>.logo');

container.onscroll = function () {
    let scrollTop = container.scrollTop;
    if (scrollTop > 0) {
        header.classList.add('active');
        logo.style.display = 'none';
    }
    if (scrollTop === 0) {
        header.classList.remove('active');
        logo.style.display = 'block';
    }
}

// 点击按钮出现菜单
const button = $('.toggleBtn');
const headerMenu = $('.headerMenu');
const menu = $('.menu')

button.onclick = function () {
    headerMenu.classList.add('active');
}

const menuClose = $('.menuClose');
menuClose.onclick = function () {
    headerMenu.classList.remove('active');
}

// 播放视频
const openVideoBtn = $('.playBtn');
const modalBackground = $('.modalBackground');
const video = $('#videoPv')
openVideoBtn.onclick = function () {
    modalBackground.style.zIndex = 300;
    video.play(); // 播放视频
}

modalBackground.onclick = function () {
    modalBackground.style.zIndex = -1;
    video.pause(); // 暂停视频
    video.currentTime = 0; // 把视频的播放时间重新调回到 0
}