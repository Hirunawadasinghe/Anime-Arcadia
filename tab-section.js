const opened_location = window.location.pathname;

if (opened_location === "/populer.html" || opened_location === "/populer") {
    loadTab("Populer Anime");
}

function loadTab(select_title) {
    fetchData('database\\tab-sections.json').then(data => {
        const element = data.find(element => element.title === select_title);

        if (element) {
            let tab_section = document.createElement("div");
            tab_section.classList.add("main-tab-container");
            tab_section.innerHTML = `
            <div class="tab-title-container">
                <p class="tab-title">${element.title}</p>
            </div>
            <div class="tab-section">
                <div class="movie-cards-container" id="tab-title-${element.title}"></div>
            </div>`;

            document.getElementById("tab-section").appendChild(tab_section);

            element.content_ids.forEach(id => {
                loadCard(id, ("tab-title-" + element.title));
            });

        } else {
            console.log("tab title '" + select_title + "' not found.");
        }
    });
}

function loadCustomTab(select_title) {
    if (select_title === "Recently Added") {
        data_json_file.then(data => {
            let tab_section = document.createElement("div");
            tab_section.classList.add("main-tab-container");
            tab_section.innerHTML = `
            <div class="tab-title-container">
                <p class="tab-title">${select_title}</p>
            </div>
            <div class="tab-section">
                <div class="movie-cards-container" id="tab-title-${select_title}"></div>
            </div>`;

            document.getElementById("tab-section").appendChild(tab_section);

            for (let i = data.length; i > (data.length - 10);) {
                i = i - 1;
                loadCard(data[i].movie_id, ("tab-title-" + select_title));
            }
        });
    }
}