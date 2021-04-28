function sayHello(name) {
    console.log("Hello you", name)
}

var name = "Johannes";

sayHello(name);

module.exports.log = sayHello;
module.exports.name = name;