//Combinators of functions

// AND
// Returns a function which receives a person and applies the two functions
const and = (f1, f2) => (person) => f1(person) && f2(person)

// Combinator not - Where f is a filter
const not = (f) => person => !f(person)

const TRUE = person => true
const FALSE = person => false
// And Combinatori of various filters
// with reduce, by default, if no initial value is passed, then the first element is taken
const and_all = (...filters) => filters.reduce((ands, f) => person => ands(person) && f(person), TRUE)

// Homework make OR, TRUE, Apply to filters services 
const or_all = (...filters) => filters.reduce((ors, f) => person => ors(person) || f(person), FALSE)



let persons = [
    { firstname: "shakira", lastname: "pique", age: 48, gender: 'F' },
    { firstname: "Juan", lastname: "Perez", age: 24, gender: 'M' },
    { firstname: "Pedro", lastname: "Gomez", age: 38, gender: 'M' },
    { firstname: "Alicia", lastname: "Machado", age: 53, gender: 'F' },
    { firstname: "Jaffet", lastname: "Soto", age: 76, gender: 'M' },
    { firstname: "Sofia", lastname: "Caraballo", age: 6, gender: 'F' },
    { firstname: "Pablito", lastname: "Escobar", age: 10, gender: 'M' },
]

console.log(persons)

const male = p => p.gender === 'M'
const female = not(male)
const adult = p => p.age >= 18
const name_starts_with_s = p => p.firstname.startsWith('S')