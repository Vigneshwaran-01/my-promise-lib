/*  
  I created a class called MyPromise. Inside the class, there's a constructor function
  that receives one argument: `executor`.

  ▸ What is executor?  
    I wasn't sure initially, but now I understand it's the function passed when
    creating a new Promise instance like: 
      new MyPromise((resolve, reject) => { ... })

  ▸ Inside the constructor:
    - 4 variables are declared using `this.variableName`
    - `this` always refers to the current object instance
    - So, when we create different objects from the class, it assigns values specific to each instance

  ▸ We define two arrow functions:
    - `resolve(value)`
    - `reject(reason)`
    Both functions take one argument and are responsible for changing the state.

  ▸ Inside `resolve`:
    - It checks if `this.state` is "pending"
    - If true, it:
      • Updates the state to "fulfilled"
      • Stores the passed value in `this.value`
      • Loops through `this.thenCallbacks` using forEach to execute stored callbacks

    I wasn’t clear earlier about the forEach, but now I know it:
      - Runs all `.then()` callbacks collected before resolution

  ▸ In the try-catch block:
    - It calls `executor(resolve, reject)`
    - So the passed function gets executed immediately when we create a new MyPromise

  ▸ There’s a `then()` method:
    - I didn’t understand initially if it was like an `if` condition or the native `.then()`
    - Now I know it’s a method that behaves just like the native Promise `.then()`
      • It either executes the callback immediately (if already fulfilled)
      • Or stores the callback to be run later (if still pending)
*/


class MyPromise {
  constructor(executor) {
    this.state = "pending";         // Default state
    this.value = undefined;         // Resolved value
    this.reason = undefined;        // Rejection reason (unused currently)
    this.thenCallbacks = [];        // Stores .then() callbacks

    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";   // Update state
        this.value = value;         // Store the resolved value

        // Execute all stored callbacks with the resolved value
        this.thenCallbacks.forEach(cb => cb(this.value));
      }
    };

    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        // Rejection not handled yet
      }
    };

    try {
      executor(resolve, reject);    // Immediately call executor function
      console.log(this.thenCallbacks);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled) {
    if (this.state === "fulfilled") {
      onFulfilled(this.value);      // Run callback immediately if resolved
    } else {
      this.thenCallbacks.push(onFulfilled);  // Store callback to run later
    }
    return this; // Return this to allow chaining (not fully functional yet)
  }
}


// Usage example
let a = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("hello");               // Resolve after 3 seconds
  }, 3000);
});

a.then(() => {
  console.log("executed after 3 sec"); // Will execute after promise resolves
});
