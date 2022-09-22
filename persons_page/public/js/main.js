import { get_persons, getPersonsBySelection, getPersonById } from "./services.js";
const PERSONS_TAG = "persons";
const BUTTONS_TAG = "button_persons";
const DEFAULT_URI = "/persons";
const BUTTON_SELECT_GENDER = "genders";
const BUTTON_SELECT_AGE = "age";
const INPUT_ID = "id";

/**
 * Converts an array of objects in an array of table row DOM
 * Objects (<td>). The corresponding properties of the objects
 * inside the array are converted to nested "td" DOM objects inside
 * the created tr.
 *
 * @param object_array: array
 * @return array
 */
const generate_trs = (object_array) =>
    object_array.map((person) =>
        Object.entries(person).reduce((t, [key, val]) => {
            t.appendChild(document.createElement("td")).append(val);
            return t;
        }, document.createElement("tr"))
    );

function view_persons(URI = DEFAULT_URI) {
    const persons_tag = document.getElementById(PERSONS_TAG);
    get_persons(URI)
        .then((persons) => {
            // Remove last table inside the PERSONS_TAG.
            let table_body = persons_tag.querySelector("table").querySelector("tbody");
            table_body.innerHTML = "";
            // Create a new one to be populated
            generate_trs(JSON.parse(persons))
                //Append each tr of the generated array to the table.
                .forEach((tr) => table_body.appendChild(tr));
        })
        .catch((err) => alert(err));
}


function get_queryOptions() {
    
    let queryOptions = {};
    
    // First getting the gender
    let gender = document.getElementById(BUTTON_SELECT_GENDER).value;

    if(gender === 'all') queryOptions.gender = null;
    else queryOptions.gender = parseInt(gender);


    //Secondly get the age
    let ageSelection = document.getElementById(BUTTON_SELECT_AGE).value;
    switch(ageSelection) {
        case "child": queryOptions.ageRange = {min: 0, max: 11}; break;
        case "teenager": queryOptions.ageRange = {min: 12, max: 20}; break;
        case "adult": queryOptions.ageRange = {min: 21, max: 63}; break;
        case "senior": queryOptions.ageRange = {min: 64, max: 122}; break;
        default: queryOptions.ageRange = null;
    }
    
    return queryOptions;
}


function filter_person(URI = DEFAULT_URI) {
    let queryOptions = get_queryOptions();
    const persons_tag = document.getElementById(PERSONS_TAG);
    getPersonsBySelection(URI, queryOptions)
        .then((persons) => {
            // Remove last table inside the PERSONS_TAG.
            let table_body = persons_tag.querySelector("table").querySelector("tbody");
            table_body.innerHTML = "";
            // Create a new one to be populated
            generate_trs(JSON.parse(persons))
                //Append each tr of the generated array to the table.
                .forEach((tr) => table_body.appendChild(tr));
        })
        .catch((err) => alert(err));
}

function filter_by_id(event, URI = DEFAULT_URI) {
    const persons_tag = document.getElementById(PERSONS_TAG);
    getPersonById(URI, parseInt(event.target.value))
        .then((persons) => {
            // Remove last table inside the PERSONS_TAG.
            let table_body = persons_tag.querySelector("table").querySelector("tbody");
            table_body.innerHTML = "";
            // Create a new one to be populated
            generate_trs(JSON.parse(persons))
                //Append each tr of the generated array to the table.
                .forEach((tr) => table_body.appendChild(tr));
        })
        .catch((err) => alert(err));
}


document.addEventListener('DOMContentLoaded', () => {

    // Bind button
    const button_tag = document.getElementById(BUTTONS_TAG);
    button_tag.addEventListener("click", view_persons, false);


    // Filters for queryOptions
    const select_gender = document.getElementById(BUTTON_SELECT_GENDER);
    const select_age = document.getElementById(BUTTON_SELECT_AGE);

    // Binding Selects
    select_gender.addEventListener("change", filter_person);
    select_age.addEventListener("change", filter_person);

    // We declare the ID input and then bind it
    const input_id = document.getElementById(INPUT_ID);
    input_id.addEventListener("change", filter_by_id);
});



//getPersonsBySelection(URI:"/person", {queryOptions: {ageRange: {min:number, max:number}, gender:string}} )
