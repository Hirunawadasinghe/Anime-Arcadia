all_the_genres.then(data => {
    data.forEach(element => {
        const tag_element = document.createElement("a");
        tag_element.href = 'search.html?search_tags=' + element.tag_name;
        tag_element.innerHTML = `<div class="genre-tag">${element.tag_name} <span>${element.taged_count}</span></div>`;
        document.getElementById("genre-section").appendChild(tag_element);
    });
});