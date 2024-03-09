const categoryBtnSection = document.getElementById('category-btn-section');
const videoGridSection = document.getElementById('video-grid-section');
const notFoundSection = document.getElementById('not-found-section');
const sortByViewBtn = document.getElementById('sort-by-view-btn');
let viewCount = [];


fetch('https://openapi.programming-hero.com/api/videos/categories')
.then(res => res.json())
.then(data => {
    console.log(data.message);
    const btnCategories = data.data;
    btnCategories.forEach(btnCategory => {
        const btn = document.createElement('button');
        btn.innerText = btnCategory.category;
        btn.classList.add("text-[#252525b3]", "bg-[#25252526]", "py-2", "px-5", "rounded", "hover:opacity-80");
        btn.setAttribute('id', btnCategory.category_id);
        categoryBtnSection.appendChild(btn);
        btn.addEventListener('click', () => {
            getVideoData(btnCategory.category_id);
            toggleBtn(btn);
        });
    });
    getVideoData(1000);
});

function getVideoData(categoryId) {
    fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`)
    .then(res => res.json())
    .then(data => {
        videoGridSection.innerHTML = '';
        showVideos(data);
        viewCount = [];
        addViewCountToList(data);
        sortByViewBtn.addEventListener('click', () => {
            sortByView(data);
        });
    });
    toggleBtn(categoryBtnSection.children[0]);
}

function showVideos(videoData) {
    const videoDataObj = videoData.data;
    const status = videoData.status;
    if (!status) {
        notFoundSection.classList.remove('hidden');
    } else {
        notFoundSection.classList.add('hidden');
    }
    videoDataObj.forEach((videoDataItem) => {
        const videoCard = document.createElement('div');
        videoCard.classList.add('w-80', 'rounded-lg', 'h-[342px]');
        const thumbnail = videoDataItem.thumbnail;
        const title = videoDataItem.title;
        const postedDate = videoDataItem.others.posted_date;
        const profilePicture = videoDataItem.authors[0].profile_picture;
        const profileName = videoDataItem.authors[0].profile_name;
        const verified = videoDataItem.authors[0].verified;
        const views = videoDataItem.others.views;
        videoCard.innerHTML = `
            <figure class="relative rounded-lg mb-5 w-full h-[180px]">
                <img src="${thumbnail}" class="rounded-lg w-full h-full" alt="${title}">
                <figcaption class="bg-[#171717] rounded-sm text-white text-center text-[10px] font-normal w-[28%] absolute right-3 bottom-3">${postedDate? secondsToHoursAndMinutes(postedDate) : ''}</figcaption>
            </figure>
            <div class="flex items-start gap-3">
                <img src="${profilePicture}" class="rounded-full w-10 h-10" alt="">
                <h4 class="text-[#171717] text-base font-bold">${title}</h4>
            </div>
            <div class="ml-[52px]">
                <p class="text-[#171717b3] text-sm font-normal">${profileName} ${verified? '<img src="./images/verified-tic-icon.png" class="inline mr-2" alt="">' : ''}</p>
                <p class="text-[#171717b3] text-sm font-normal">${views} views</p>
            </div>
        `;
        videoGridSection.appendChild(videoCard);
    })
}

function addViewCountToList(dataObj) {
    let data = dataObj.data;
    data.forEach((dataItem) => {
        let view = dataItem.others.views;
        viewCount.push(parseFloat(view));
    });
}

function toggleBtn(btnElement) {
    for (let i = 0; i < categoryBtnSection.children.length; i++) {
        const btn = categoryBtnSection.children[i];
        
        if (btn.getAttribute('id') === btnElement.getAttribute('id')) {
            btn.classList.add('bg-[#FF1F3D]', 'text-white');
            btn.classList.remove('bg-[#25252526]', 'text-[#252525b3]');
        } else {
            btn.classList.remove('bg-[#FF1F3D]', 'text-white');
            btn.classList.add('bg-[#25252526]', 'text-[#252525b3]');
        }
    }
}

function sortByView(dataObj) {
    const data = dataObj.data.sort((a, b) => {
        return parseFloat(b.others.views) - parseFloat(a.others.views);
    })
    videoGridSection.innerHTML = '';
    data.forEach((dataItem) => {
        const videoCard = document.createElement('div');
        videoCard.classList.add('w-80', 'rounded-lg', 'h-[342px]');
        const thumbnail = dataItem.thumbnail;
        const title = dataItem.title;
        const postedDate = dataItem.others.posted_date;
        const profilePicture = dataItem.authors[0].profile_picture;
        const profileName = dataItem.authors[0].profile_name;
        const verified = dataItem.authors[0].verified;
        const views = dataItem.others.views;
        videoCard.innerHTML = `
            <figure class="relative rounded-lg mb-5 w-full h-[180px]">
                <img src="${thumbnail}" class="rounded-lg w-full h-full" alt="${title}">
                <figcaption class="bg-[#171717] rounded-sm text-white text-center text-[10px] font-normal w-[28%] absolute right-3 bottom-3">${postedDate? secondsToHoursAndMinutes(postedDate) : ''}</figcaption>
            </figure>
            <div class="flex items-start gap-3">
                <img src="${profilePicture}" class="rounded-full w-10 h-10" alt="">
                <h4 class="text-[#171717] text-base font-bold">${title}</h4>
            </div>
            <div class="ml-[52px]">
                <p class="text-[#171717b3] text-sm font-normal">${profileName} ${verified? '<img src="./images/verified-tic-icon.png" class="inline mr-2" alt="">' : ''}</p>
                <p class="text-[#171717b3] text-sm font-normal">${views} views</p>
            </div>
        `;
        videoGridSection.appendChild(videoCard);
    })
}

function secondsToHoursAndMinutes(seconds) {
    seconds = Number(seconds);

    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor(seconds % 3600 / 60);
    return `${hours}hrs ${minutes} min ago`;
}