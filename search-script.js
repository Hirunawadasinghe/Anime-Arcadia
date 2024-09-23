// search by the type not working

function start_search() {
    const search_types = getAllQueryParams();

    data_json_file.then(data => {
        let filter_array = data;

        search_types.forEach(type => {
            let search_bar = document.getElementById("searchbar_#1");

            if (type.type === "search_text") {
                if (type.values.includes(" ") || isFinite(type.values)) {
                    filter_array = searchDataBase(splitWords((type.values).toLocaleLowerCase(), [" ", "–", ":", ",", "|", "/", "(", ")", "'"]), ["name", "alt_name", "tags", "release_year", "description"], filter_array);
                } else {
                    filter_array = do_spelling_search(type.values, filter_array);
                }
                search_bar.value = type.values;

            } else if (type.type === "search_tags") {
                filter_array = searchDataBase(splitWords((type.values).toLocaleLowerCase(), []), ["tags"], filter_array);
                if (search_bar.value === '') {
                    search_bar.value = type.values;
                }
            } else if (type.type === "search_type") {
                filter_array = searchDataBase(splitWords((type.values).toLocaleLowerCase(), []), ["type"], filter_array);
                if (search_bar.value === '') {
                    search_bar.value = type.values;
                }
            }
        });
        if (filter_array.length > 0) {
            document.getElementById("search-none").style.display = "none";

            filter_array.sort((a, b) => b.priorty - a.priorty);

            filter_array.forEach(element => {
                // console.log(element.priorty, element.name);
                loadCard(element.movie_id, "search-results-container");
            });
        }
    });
}


// search_aray = search text | in lowercase | eg. ["this", "is", "a", "sample", "text"] or ["Action", "Adventure"]
// search_keys = dtabase key tag | eg. ["name", "alt_name", "description", "tags"]
// json_data = json data | eg. fetched json data of data.json file
function searchDataBase(search_aray, search_keys, json_data) {
    let return_array = [];
    json_data.forEach(element => {
        for (let i = 0; i < search_keys.length; i++) {
            let element_aray = [];

            if (search_keys[i] === "name") {
                element_aray = splitWords((element.name).toLocaleLowerCase(), [" ", "-", "–", ":", ",", "|", "/", "(", ")", "'"]);

            } else if (search_keys[i] === "alt_name") {
                element_aray = splitWords((element.alt_name).toLocaleLowerCase(), [" ", "-", "–", ":", ",", "|", "/", "(", ")", "'"]);

            } else if (search_keys[i] === "description") {
                element_aray = splitWords((element.description).toLocaleLowerCase(), [" ", "-", "–", ":", ",", "|", "/", "(", ")", "'"]);

            } else if (search_keys[i] === "release_year") {
                element_aray = splitWords((element.release_year).toLocaleLowerCase(), [" ", ",", "-"]);

            } else if (search_keys[i] === "type") {
                element_aray = [element.type, "undefined"];
                console.log(element_aray);

            } else if (search_keys[i] === "tags") {
                element.tags.forEach(tag => {
                    element_aray.push(tag.toLocaleLowerCase());
                });
            }

            const search_result = findCommonElements(search_aray, element_aray);
            // if (search_keys[i] === "name" || search_keys[i] === "alt_name" || search_keys[i] === "tags") {
            //     element.priorty = element.priorty + search_result.length;
            // } else if (search_keys[i] === "description") {
            //     element.priorty = element.priorty + 1;
            // }
            if (element.priorty === undefined) {
                element.priorty = search_result.length;
            } else {
                element.priorty = element.priorty + search_result.length;
            }
        }
        if (element.priorty > 0) {
            return_array.push(element);
        }
    });
    return return_array
}


function findCommonElements(arr1, arr2) {
    return arr1.filter(element => arr2.includes(element));
}


function getAllQueryParams() {
    let urlParams = new URLSearchParams(window.location.search);
    let params = [];
    urlParams.forEach((value, key) => {
        params.push({
            "type": key,
            "values": value
        });
    });
    return params;
}


// inputString = The string value that need to be devided | eg. "This is an example string"
// devide_characters = Array that containg the characters and symbols that are using to devide the string | eg. [" ", "-", "–", ":", ",", "|", "/", "(", ")", "'"]
function splitWords(inputString, devide_characters) {
    let words = [];
    let leter = '';
    for (let i = 0; i < inputString.length + 1; i++) {
        if (devide_characters.includes(inputString[i]) | i === inputString.length) {
            if (leter !== '') {
                words.push(leter);
            }
            leter = '';
        } else {
            leter = leter + inputString[i];
        }
    }
    return words;
}