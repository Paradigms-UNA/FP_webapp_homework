/**
* Simulates a web service yielding persons
@author loricarlos@gmail.com
@version demo

*/

import data from "./data.json" assert {type: 'json'}

const Gender = {
    MALE: 2,
    FEMALE: 4
}

class Person {
    static #id_counter = 0
    #id
    #firstname;
    #lastname;
    #age;
    #gender;
    constructor(firstname, lastname, age, gender) {
        [this.#firstname, this.#lastname, this.#age, this.#gender] =
            [firstname, lastname, age, gender]
        this.#id = Person.#id_counter++
    }
    get id() { return this.#id }
    get firstname() { return this.#firstname }
    get lastname() { return this.#lastname }
    get age() { return this.#age }
    get gender() { return this.#gender }
    toObj() {
        return {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            age: this.age,
            gender: this.gender == Gender.MALE ? "M" : "F"
        }
    }
}
const persons = data.persons.map(person => new Person(person.firstname, person.lastname, person.age, person.gender))


export function get_persons(url = "/person", delay = 3) {
    return to_promise(persons, delay);
}

/**
 * Receives an array of objects Person and stringifies it inside a promise.
 * 
 * @param {*} arr 
 * @param {*} delay 
 * @returns a Promise which resolvees into the stringified array of persons.
 */
function to_promise(arr, delay = 3) {
    let p = new Promise(
        then => setTimeout(() => then(JSON.stringify(arr.map(p => p.toObj())),
            delay % 1000 * 1000)
        )
    )
    return p
}

// TRUE Function
const True = person => true

//Combinator of functions
const apply_filters = (queryOptions, ...filters) => filters.reduce( 
    (prev_filters, current_filter) => person => 
        prev_filters(person, queryOptions) && current_filter(person, queryOptions), True)


const apply_filters2 = (...filters) => queryOptions => filters.reduce(
    (prev_filters, current_filter) => 
        person => prev_filters(person, queryOptions) && current_filter(person, queryOptions), True)

// Gender - filter
const gender_filter = (person, {gender}) => gender ? person.gender === gender : true

// Age - filter
const age_filter = (person, {ageRange}) => ageRange ? person.age >= ageRange.min && person.age <= ageRange.max : true

/**
 * This function tests wheter a single person meets the requirements
 * inside the queryOptions object. If any of the queryOptions is NULL
 * then the test is considered passed.
 * 
 * @param {*} person 
 * @param {*} queryOptions {ageRange: {min: number, max: number}, gender: number }
 * @returns 
 */

// const person_filter = (person, queryOptions) => {
//     if (queryOptions.ageRange) {
//         if ( person.age <= queryOptions.ageRange.min || person.age >= queryOptions.ageRange.max )  
//         return false;
//     }
//     if (queryOptions.gender) {
//         if (person.gender !== queryOptions.gender) {
//             return false;
//         }
//     }
//     return true;
// }



export function getPersonsBySelection(URI = "/person", queryOptions, delay = 3) {
    let filtered_persons = persons.filter(apply_filters2(gender_filter, age_filter)(queryOptions));
    return to_promise(filtered_persons);
}

export function getPersonById(URI = "/person", id) {
    let person = persons.find(p => p.id === id);
    return to_promise([person]);
}