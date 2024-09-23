// dgyS7NJzqug&t

let lg_try = 0;
function checkLogin() {
    lg_try = lg_try + 1;
    let uname = document.getElementById("input-username");
    let pass = document.getElementById("input-password");
    let d1 = hashString(uname.value);
    let d2 = hashString(pass.value);
    if (lg_try - 1 < 5) {
        if (d1 === 1158 & d2 === 1223) {
            localStorage.setItem('login_success', Date.now() + 30 * 60 * 1000);
            location.reload();
        } else {
            uname.value = '';
            pass.value = '';
            alert("Invalid Username or Password");
        }
    } else {
        uname.value = '';
        pass.value = '';
        alert("Invalid Username or Password");
    }
}

let file_save = true;

function checkTime() {
    if (localStorage.getItem('login_success') !== false) {
        if (Date.now() > localStorage.getItem('login_success')) {
            // The stored time has passed.
            localStorage.removeItem('login_success');
        } else {
            // The stored time has not yet passed.
            file_save = false;
            document.getElementById("login-container").style.display = "none";
            document.getElementById("apc").style.display = "block";
        }
    } else {
        // No time stored in localStorage.
        localStorage.setItem('login_success', false);
    }
}
checkTime();

toggleVisualTab("div");
function toggleVisualTab(tab) {
    if (tab === "div") {
        document.getElementsByClassName("b2")[0].style.backgroundColor = "white";
        document.getElementsByClassName("b2")[1].style.backgroundColor = "lavender";
    } else {
        document.getElementsByClassName("b2")[1].style.backgroundColor = "white";
        document.getElementsByClassName("b2")[0].style.backgroundColor = "lavender";
    }
    if (tab === "div") {
        document.getElementById("preview").style.display = "flex";
        document.getElementById("json-output").style.display = "none";
        loadPreview();
    } else {
        document.getElementById("json-output").style.display = "block";
        document.getElementById("preview").style.display = "none";
    }
}

let text_input_count = document.getElementsByClassName("input-bar");
text_input_count = text_input_count.length;

for (let i = 0; i < text_input_count; i++) {
    document.getElementsByClassName("input-bar")[i].addEventListener('focus', function () {
        this.select();
    });
}

function loadPreview() {
    const data = JSON.parse(document.getElementById("json-output").value);
    document.getElementById("preview").innerHTML = '';
    document.getElementsByClassName("b2")[0].innerText = "Preview (" + data.length + ")";

    data.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="item">
            <img src="${item.thumbnail_image}" alt="thumbnail image">
            <div>
                <div class="c1">
                    <p class="item-title">Movie id:</p>
                    <p class="item-value">${item.movie_id}</p>
                </div>
                <div class="c1">
                    <p class="item-title">Name:</p>
                    <p class="item-value">${item.name}</p>
                </div>
                <div class="c1">
                    <p class="item-title">Alt-name:</p>
                    <p class="item-value">${item.alt_name}</p>
                </div>
                <div class="c1">
                    <p class="item-title">description:</p>
                    <p class="item-value">${item.description}</p>
                </div>
                <div class="c1">
                    <p class="item-title">Language:</p>
                    <p class="item-value">${item.language}</p>
                    <p class="item-title">Release year:</p>
                    <p class="item-value">${item.release_year}</p>
                </div>
                <div class="c1">
                    <p class="item-title">Type:</p>
                    <p class="item-value">${item.type}</p>
                    <p class="item-title">Total Episodes:</p>
                    <p class="item-value">${item.total_episodes}</p>
                </div>
                <div class="c1">
                    <p class="item-title">Tags:</p>
                    <button class="list-toggle-btn" onclick="toggleListFlex(this, 'tags-container-${item.movie_id}')">►</button>
                    <div class="c1" id="tags-container-${item.movie_id}"></div>
                </div>
                <div class="c1">
                    <p class="item-title">Links (${item.links.length}):</p>
                    <button class="list-toggle-btn" onclick="toggleListFlex(this, 'links-container-${item.movie_id}')">►</button>
                    <div class="c1" id="links-container-${item.movie_id}"></div>
                </div>
            </div>
        </div>`;
        document.getElementById("preview").appendChild(div);

        item.tags.forEach(tag => {
            const new_tag = document.createElement("p");
            new_tag.classList.add("item-value");
            if (tag !== item.tags[item.tags.length - 1]) {
                new_tag.innerText = tag + ",";
            } else {
                new_tag.innerText = tag;
            }
            document.getElementById("tags-container-" + item.movie_id).appendChild(new_tag);
        });

        for (let i = 0; i < item.links.length; i++) {
            const link = item.links[i];
            const new_tag = document.createElement("p");
            new_tag.classList.add("item-value");
            if (link !== item.links[item.links.length - 1]) {
                new_tag.innerText = "(" + (i + 1) + ") " + link + ",";
            } else {
                new_tag.innerText = "(" + (i + 1) + ") " + link;
            }
            document.getElementById("links-container-" + item.movie_id).appendChild(new_tag);
        }
    });
    document.getElementById("preview").scrollTop = document.getElementById("preview").scrollHeight;
}

function toggleListFlex(button, container) {
    const e = document.getElementById(container);
    if (e.style.flexDirection !== "column") {
        e.style.flexDirection = "column";
        button.style.rotate = "90deg";
    } else {
        e.style.flexDirection = "row";
        button.style.rotate = "0deg";
    }
}

function separate(input, containerId) {
    const value = input.value.trim();
    const items = value.split(',').map(item => item.trim()).filter(item => item !== '');
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach(item => {
        const span = document.createElement('span');
        span.textContent = item;
        span.className = 'tag';
        container.appendChild(span);
    });
}

const jsonOutput = document.getElementById('json-output');

async function fetchData(jsonUrl) {
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData("https://hirunawadasinghe.github.io/database/online-links-data.json").then(data => {
    if (data !== undefined) {
        jsonOutput.value = JSON.stringify(data, null, 4);
    } else {
        jsonOutput.value = "[]";
    }
    loadPreview();
});

function updateJson() {
    let input_error = true;
    for (let i = 0; i < text_input_count; i++) {
        if (document.getElementById("input-" + (i + 1)).value === "") {
            input_error = false
            document.getElementById("input-" + (i + 1)).placeholder = "Please fill the input";
        }
    }

    if (input_error) {
        file_save = false;
        let item_id = 0;
        let exist_value = document.getElementById("json-output").value;
        if (exist_value === '') {
            exist_value = [];
        } else {
            exist_value = JSON.parse(exist_value);
            if (exist_value.length === 0) {
                exist_value = [];
            } else {
                item_id = exist_value[exist_value.length - 1].movie_id;
            }
        }

        item_id = +item_id;
        item_id = item_id + 1;

        let zeros_value = '';
        for (let i = 0; i < 10 - item_id.toString().length; i++) {
            zeros_value = zeros_value + "0";
        }

        const input_tags = [];
        document.getElementById('input-9').value.split(',').forEach(tag => {
            if (tag.trim() !== "") {
                input_tags.push(tag.trim());
            }
        });
        const input_links = [];
        document.getElementById('input-10').value.split(',').forEach(link => {
            if (link.trim() !== "") {
                input_links.push(link.trim());
            }
        });

        const data = {
            movie_id: zeros_value + item_id,
            name: document.getElementById('input-1').value,
            alt_name: document.getElementById('input-2').value,
            thumbnail_image: document.getElementById('input-3').value,
            description: document.getElementById('input-4').value,
            language: document.getElementById('input-5').value,
            release_year: document.getElementById('input-6').value,
            type: document.getElementById('input-7').value,
            total_episodes: document.getElementById('input-8').value,
            tags: input_tags,
            links: input_links
        };
        exist_value.push(data);
        jsonOutput.value = JSON.stringify(exist_value, null, 4);
        loadPreview();

        for (let i = 1; i < text_input_count + 1; i++) {
            document.getElementById("input-" + i).placeholder = '';
        }
    }
}

function removeLast() {
    let exist_value = document.getElementById("json-output").value;
    if (exist_value !== '') {
        exist_value = JSON.parse(exist_value);
        exist_value = exist_value.slice(0, -1);
        jsonOutput.value = JSON.stringify(exist_value, null, 4);
    }
    loadPreview();
}

function clearForm() {
    for (let i = 1; i < text_input_count + 1; i++) {
        document.getElementById("input-" + i).value = '';
        document.getElementById("input-" + i).placeholder = '';
    }
    document.getElementById("in-1").innerHTML = '';
    document.getElementById("in-2").innerHTML = '';
}

function hashString(str) {
    return str.split('').reduce((hash, char) => {
        return hash + char.charCodeAt(0);
    }, 0);
}

// import json file
document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('json-output').value = e.target.result;
            loadPreview();
        };
        reader.readAsText(file);
    } else {
        alert("Please select a valid JSON file");
    }
});

// export json file
function exportJson() {
    let divText = document.getElementById("json-output").value;
    if (JSON.parse(divText).length > 0) {
        let blob = new Blob([divText], { type: "application/json" });

        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;

        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1; // Months are zero-based (0 = January, 11 = December)
        let day = today.getDate();
        a.download = `Data - ${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}.json`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        file_save = true;
    } else {
        alert("No data found in the json text to export!");
    }
}

window.addEventListener('beforeunload', function (e) {
    if (file_save === false) {
        var confirmationMessage = 'Are you sure you want to leave this page? Your unsaved progress will be lost';
        e.preventDefault();
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    }
});


// async function sendData() {
//     const jsonContent = document.getElementById('json-output').value;
//     const base64Content = btoa(jsonContent);

//     const repoOwner = 'Hirunawadasinghe'; // Replace with your GitHub username
//     const repoName = 'database'; // Replace with your GitHub repository name
//     const filePath = 'files/data.json'; // Replace with the path where you want to store the file
//     const token = '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'; // Replace with your GitHub Personal Access Token

//     const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

//     try {
//         // Get the SHA of the existing file (if it exists)
//         const existingFileResponse = await fetch(apiUrl, {
//             headers: {
//                 'Authorization': `token ${token}`,
//                 'Accept': 'application/vnd.github.v3+json'
//             }
//         });

//         let sha = '';
//         if (existingFileResponse.ok) {
//             const existingFileData = await existingFileResponse.json();
//             sha = existingFileData.sha;
//         }

//         const uploadResponse = await fetch(apiUrl, {
//             method: 'PUT',
//             headers: {
//                 'Authorization': `token ${token}`,
//                 'Accept': 'application/vnd.github.v3+json'
//             },
//             body: JSON.stringify({
//                 message: "Upload JSON file via API",
//                 content: base64Content,
//                 sha: sha
//             })
//         });

//         if (uploadResponse.ok) {
//             alert('JSON uploaded successfully!');
//         } else {
//             alert('Failed to upload JSON. Check console for more details.');
//             console.error(await uploadResponse.json());
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred. Check the console for details.');
//     }
// }


