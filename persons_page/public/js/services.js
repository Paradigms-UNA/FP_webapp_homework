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
    let p = new Promise(
        then => setTimeout(() => then(JSON.stringify(persons.map(p => p.toObj())),
            delay % 1000 * 1000)
        )
    )
    return p
}


const person_filter = (person, queryOptions) => {
    if (queryOptions.ageRange) {
        if (
            person.age <= queryOptions.ageRange.min ||
            person.age >= queryOptions.ageRange.max
        ) {
            return false;
        } 
    } else if (queryOptions.gender) {
        if (person.gender !== queryOptions.gender) {
            return false;
        }
    }

    return true;
}

function toPromise(arr, delay = 3) {
    let p = new Promise(
        then => setTimeout(() => then(JSON.stringify(arr.map(p => p.toObj())),
            delay % 1000 * 1000)
        )
    )
    return p
}


export function getPersonsBySelection(URI = "/person", queryOptions, delay = 3) {
    let filtered_persons = persons.filter((person) => person_filter(person, queryOptions));
    return toPromise(filtered_persons);
}

export function getPersonById(URI = "/person", id) {
    let person = persons.find(p => p.id === id);
    return toPromise([person]);
}