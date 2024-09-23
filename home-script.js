loadTab("Trending Anime");
loadCustomTab("Recently Added");
loadTab("Anime for Beginners");
loadTab("Populer Anime");
loadTab("Anime Movies");

let slides = [];

fetchData('database\\featured-banner.json').then(data => {
    let i = 0;
    data.forEach(element => {
        slides.push({
            movie_id: element.movie_id,
            thumbnail_image: element.thumbnail_image,
            title: element.title,
            link: 'movies.html?watch=' + element.movie_id
        });

        const image = document.createElement("div");
        image.style.backgroundImage = "url('" + element.thumbnail_image + "')"
        image.id = `slide-image-${i}`;
        image.classList.add("slideshow-image");
        document.getElementById("slideshow-images").appendChild(image);

        i += 1;
    });
    pushSlides();
});


let preview_slide = -1;
let recent_slide = '';
let slideTimeout;

function pushSlides(side) {
    if (slideTimeout) {
        clearTimeout(slideTimeout);
    }

    if (side === "left") {
        preview_slide = preview_slide - 1;
        if (preview_slide < 0) {
            preview_slide = slides.length - 1;
        }
    } else {
        preview_slide = preview_slide + 1;
        if (preview_slide > slides.length - 1) {
            preview_slide = 0;
        }
    }

    document.getElementById("slide-image-" + preview_slide).style.opacity = 1;
    document.getElementById("slide-show-title").innerText = slides[preview_slide].title;
    document.getElementById("slide-show-btn").href = slides[preview_slide].link;

    if (recent_slide !== "") {
        document.getElementById(recent_slide).style.opacity = 0;
    }
    recent_slide = "slide-image-" + (preview_slide);

    slideTimeout = setTimeout(pushSlides, 5000);
}

data_json_file.then(data => {
    for (let i = data.length - 1; i > data.length - 11; i = i - 1) {
        const element = data[i];
        const news_element = document.createElement("a");
        news_element.classList.add("news-item");
        news_element.href = "movies.html?watch=" + element.movie_id;

        let name_title = element.name;
        if (element.name.length > 20) {
            let temp_value = '';
            for (let i = 0; i < 20; i++) {
                temp_value = temp_value + element.name[i];
            }
            name_title = temp_value + '...';
        }

        news_element.innerHTML = `
        <div class="news-item-image-container">
            <img src="${element.thumbnail_image}">
        </div>
        <span>
            <h1>${name_title}</h1>
            <h2>${element.release_year}</h2>
        </span>`;

        document.getElementById("news-item-container").appendChild(news_element);
    }
});

let news_tab_scroll = false;
function toggle_news_tab_scroll() {
    const scrollingDiv = document.getElementById("news-item-container");
    const button_image = document.getElementById("news-button-icon");

    if (news_tab_scroll) {
        scrollingDiv.style.animationPlayState = 'running';
        button_image.src = 'images/assets/pause-icon.png'
    } else {
        scrollingDiv.style.animationPlayState = 'paused';
        button_image.src = 'images/assets/play-icon.png'
    }
    news_tab_scroll = !news_tab_scroll;
};