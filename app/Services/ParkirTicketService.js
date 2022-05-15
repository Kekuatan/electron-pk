// cat.js

// constructor function for the Cat class
function Cat(name) {
    this.age = 0;
    this.name = name;
    this.ticketData =[]
}
 

// now we export the class, so other modules can create Cat objects
module.exports = {
    Cat: Cat
}