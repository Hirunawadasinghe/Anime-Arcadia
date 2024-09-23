data_json_file.then(data => {
    document.getElementById("az-list-tab-title").innerText = document.getElementById("az-list-tab-title").outerText + " (" + (data.length + 192) + ")";
    const movies = data.map(item => ({
        movie_id: item.movie_id,
        name: item.name
    }));
    movies.sort((a, b) => a.name.localeCompare(b.name));

    movies.forEach(e => {
        const element = data.find(element => element.movie_id === e.movie_id);

        const t = document.createElement("div");
        t.classList.add("playlist-item");

        t.innerHTML = `<p class="az-list-item"><a href="${'movies.html?watch=' + element.movie_id}">${element.name} (${element.language})</a></p>`;
        document.getElementById("az-list").appendChild(t);
    });
});