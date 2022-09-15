import { get_persons } from "./services.js";
const PERSONS_TAG = 'persons'
const BUTTONS_TAG = 'button_persons'
const DEFAULT_URI = '/persons'


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
    object_array.map(
        person => Object
            .entries(person)
            .reduce((t, [key, val]) => {
                t
                    .appendChild(document.createElement('td'))
                    .append(val);
                return t;
            }, document.createElement('tr'))
    );

function view_persons(URI = DEFAULT_URI) {
    const persons_tag = document.getElementById(PERSONS_TAG)
    get_persons(URI).then(persons => {
        // Remove last table inside the PERSONS_TAG.
        persons_tag.innerHTML = '';

        // Create a new one to be populated
        persons_tag.appendChild(document.createElement('table'));
        generate_trs(JSON.parse(persons))
            //Append each tr of the generated array to the table.
            .forEach(tr => persons_tag
                .querySelector('table')
                .appendChild(tr)
            );
    }
    ).catch(err => alert(err))

}


// Bind button
const button_tag = document.getElementById(BUTTONS_TAG)
button_tag.addEventListener('click', view_persons, false)

