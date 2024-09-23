const mainVideoContainer = document.getElementById("main-video-container");
const videoContainer = document.getElementById("video-container");
const playlistContainer = document.getElementById("playlist-container");
const errorText = document.getElementById("error-text");
const video_preview = document.getElementById("video-preview");
const iframe_preview = document.getElementById("iframe-preview");

let current_player;

let episode;
window.onload = async function () {
    const movie = getSearchParam("watch");
    episode = getSearchParam("episode");
    if (episode === null | episode === "") {
        episode = 1;
    } else {
        episode = +episode;
    }

    if (movie.length < 10) {
        window.location = "index.html";

    } else {
        mainVideoContainer.style.display = "block";

        data_json_file.then(data => {
            const element = data.find(element => element.movie_id === movie);

            if (!element) { // check if the video id exist
                console.log("couldn't find the video id.");
                errorText.style.display = "block";

            } else {
                console.log("video id found.");
                document.getElementsByTagName("title")[0].innerText = element.name + " Ep. " + episode + " - " + document.getElementsByTagName("title")[0].outerText;
                load_playlist(element);
                load_comment_section(element);
                add_share_buttons(element);

                document.getElementById("related-section-title").innerText = document.getElementById("related-section-title").outerText + " " + element.name;
                load_related_tab(element);

                if (!element.links[episode - 1]) { // check if the episode link exist
                    console.log("link not found.");
                    errorText.style.display = "block";

                } else {
                    console.log("link found.");
                    videoContainer.style.display = "block";

                    const video_player = getSearchParam("player");
                    if (video_player !== "2") {
                        current_player = "iframe";
                        iframe_preview.src = element.links[episode - 1];
                        iframe_preview.style.display = "block";
                    } else {
                        data_direct_link_json_file.then(d => {
                            const e = d.find(element => element.movie_id === movie);
                            if (e) {
                                current_player = "video";
                                video_preview.src = e.links[episode - 1];
                                video_preview.style.display = "block";
                            } else {
                                alert("Couldn't load the video from Player 2");
                            }
                        });
                    }

                    document.getElementById("thumbnail-image").src = element.thumbnail_image;
                    document.getElementById("video-description").innerText = element.description;
                    if (element.language !== "Japanese") {
                        document.getElementById("video-title").innerText = element.name;
                        if (element.name !== element.alt_name) {
                            document.getElementById("video-alt-title").innerText = "(" + element.alt_name + ")";
                        }
                    } else {
                        document.getElementById("video-title").innerText = element.alt_name;
                        if (element.name !== element.alt_name) {
                            document.getElementById("video-alt-title").innerText = "(" + element.name + ")";
                        }
                    }

                    document.getElementById("data-container").innerHTML = `
                    <div class="data-tag">
                        <p>Language:</p>
                        <span>${element.language}</span>
                    </div>
                    <div class="data-tag">
                        <p>Release Date:</p>
                        <span>${element.release_year}</span>
                    </div>
                    <div class="data-tag">
                        <p>Episodes:</p>
                        <span>${element.links.length}</span>
                    </div>`;

                    fetchData(`https://www.omdbapi.com/?t=${encodeURIComponent(element.name)}&apikey=217028fd`).then(imdb_data => {
                        if (imdb_data.Response === "True") {
                            const data_item = document.createElement("div");
                            data_item.innerHTML = `
                        <div class="data-tag">
                            <p>IMDB Rating:</p>
                            <span id="imdb-ratings">${imdb_data.imdbRating}</span>
                        </div>`;
                            document.getElementById("data-container").appendChild(data_item);
                        } else {
                            console.log("Anime '" + element.name + "' not found in IMDB");
                        }
                    });

                    element.tags.forEach(tag => {
                        const t = document.createElement("div");
                        t.innerHTML = `
                        <a href="search.html?search_tags=${tag}" target="_blank">
                            <button class="tags" style="background-color: ${get_tag_color(tag)}">${tag}</button>
                        </a>`;
                        document.getElementById("tags-container").appendChild(t);
                    });

                    load_player_buttons(element);
                }
            }
        });
    }
};

function load_playlist(element) {
    if (element.links.length > 1) {
        for (let i = 0; i < element.links.length; i++) {
            const t = document.createElement("div");
            t.classList.add("playlist-item");

            let movie_name = element.name;
            if (element.name.length > 35) {
                let temp_value = '';
                for (let i = 0; i < 36; i++) {
                    temp_value = temp_value + movie_name[i]
                }
                movie_name = temp_value + "...";
            }

            if (episode === i + 1) {
                t.classList.add("box-select");
                t.innerHTML = `
                <div class="center">
                    <a href="${'movies.html?watch=' + element.movie_id + '&episode=' + (i + 1)}"><p class="playlist-item-title">${movie_name + ' Episode ' + (i + 1)}</p></a>
                </div>
                <div class="playlist-item-btn-container center">
                    <a href="${'movies.html?watch=' + element.movie_id + '&episode=' + (i + 1)}"><button class="playlist-item-btn">Now Playing</button></a>
                </div>`;
            } else {
                t.innerHTML = `
                <div class="center">
                    <a href="${'movies.html?watch=' + element.movie_id + '&episode=' + (i + 1)}"><p class="playlist-item-title">${movie_name + ' Episode ' + (i + 1)}</p></a>
                </div>
                <div class="playlist-item-btn-container center">
                    <a href="${'movies.html?watch=' + element.movie_id + '&episode=' + (i + 1)}"><button class="playlist-item-btn">Watch now</button></a>
                </div>`;
            }

            document.getElementById("playlist").appendChild(t);
        }
        playlistContainer.style.display = "block";
        console.log("playlist loaded.");

    } else {
        console.log("no playlist detected.");
    }
}

function load_player_buttons(element) {
    // Extract the hostname (domain) and the last part of the link
    let parsedUrl = new URL(element.links[episode - 1]);
    let domain = parsedUrl.hostname;
    let pathSegments = parsedUrl.pathname.split('/');
    let video_code = pathSegments[2];

    create_player_download_button(`https://${domain}/v/${video_code}`, "Indirect Download");
    create_player_switch_button("Player 1", `https://${domain}/e/${video_code}`);

    data_direct_link_json_file.then(d => {
        const e = d.find(e => e.movie_id === element.movie_id);
        if (e) {
            create_player_download_button(e.links[episode - 1], "Direct Download");
            create_player_switch_button("Player 2", e.links[episode - 1]);
        }
    });
}

function create_player_download_button(link, title) {
    const button = document.createElement("a");
    button.href = link;
    button.target = "_blank";
    button.innerHTML = `<button class="b1" style="background-color: var(--light-blue-color)">${title}</button>`;
    document.getElementById("optional-download-btn-container").appendChild(button);
}

function create_player_switch_button(player, link) {
    const button = document.createElement("span");
    button.innerHTML = `<button class="b1" style="background-color: #e5a802">${player}</button>`;
    button.onclick = () => {
        if (player === "Player 1") {
            if (current_player !== "iframe") {
                iframe_preview.src = link;
                iframe_preview.style.display = "block";
                history.replaceState(null, '', `https://${window.location.host}${window.location.pathname}?watch=${getSearchParam('watch')}&episode=${episode}&player=1`);
                video_preview.src = "#";
                video_preview.style.display = "none";
                current_player = "iframe";
            }

        } else {
            if (current_player !== "video") {
                video_preview.src = link;
                video_preview.style.display = "block";
                history.replaceState(null, '', `https://${window.location.host}${window.location.pathname}?watch=${getSearchParam('watch')}&episode=${episode}&player=2`);
                iframe_preview.src = "#";
                iframe_preview.style.display = "none";
                current_player = "video";
            }
        }
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    document.getElementById("optional-player-btn-container").appendChild(button);
}

function load_related_tab(element) {
    data_json_file.then(data => {
        let related_elements = [];

        element.tags.forEach(tag => {
            let search_results = searchDataBase([tag.toLocaleLowerCase()], ["tags"], data);
            search_results = search_results.filter(e => e !== element);

            if (search_results.length > 10) {
                let i = 0;
                while (i < 10 / element.tags.length && related_elements.length < 10) {
                    const random_element = search_results[Math.round(Math.random() * (search_results.length - 1))];
                    if (related_elements.includes(random_element) === false) {
                        related_elements.push(random_element);
                        i = i + 1;
                    }
                }
            } else {
                related_elements = search_results;
            }
        });

        related_elements.sort((a, b) => b.priorty - a.priorty);
        related_elements.forEach(element => {
            // console.log(element.priorty, element.name);
            loadCard(element.movie_id, "related-section");
        });
    });
}

function load_comment_section(element) {
    const comment_section_html = document.createElement("script");
    comment_section_html.innerHTML = `
    // RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    // LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables

    var disqus_config = function () {
        this.page.url = "${window.location.href}";  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = "${element.movie_id}"; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    
    (function () { // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        s.src = 'https://animearcadia.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();`;
    document.getElementById("disqus_thread").appendChild(comment_section_html);
}

function add_share_buttons(element) {
    const text_message = `Watch ${element.name} English Sub/Dub online Free on AnimeArcadia.org.lk`;
    const share_link = `${window.location.origin + window.location.pathname}?watch=${element.movie_id}`;

    document.getElementById("facebook-share-link").href = `https://www.facebook.com/sharer/sharer.php?u=${share_link}`;
    document.getElementById("copy-share-link").onclick = function () {
        navigator.clipboard.writeText(share_link);
        document.getElementById("copy-share-link").classList.add("copy-button-click-effect");
        setTimeout(function () {
            document.getElementById("copy-share-link").classList.remove("copy-button-click-effect");
        }, 250);
    };
    document.getElementById("whatsapp-share-link").href = `https://api.whatsapp.com/send?text=${text_message}%0a🔖 Link: ${share_link}`;
    document.getElementById("twitter-share-link").href = `https://twitter.com/intent/tweet?url=${share_link}&text=${text_message}`;
    document.getElementById("telegram-share-link").href = `https://t.me/share/url?url="${share_link}&text=${text_message}&to=`;
}