# Day 1: Understanding Custom Promise Implementation - Deep Dive

## ✅ What I Learned

I created a class called `MyPromise` to understand how native Promises work internally. Here's a breakdown of my understanding:

### 🧠 Concept: Custom `MyPromise` Class and the `executor`

The constructor of the `MyPromise` class takes one argument: the `executor` function. The `executor` is a function that *you* provide when creating a new `MyPromise` instance, and it receives two arguments: `resolve` and `reject`. `resolve` and `reject` are themselves functions that you call *inside* the `executor` to signal whether the asynchronous operation succeeded (resolve) or failed (reject).

new MyPromise((res, rej) => {
  // Asynchronous operation here (e.g., setTimeout, API call)
  if (/* operation succeeded */) {
    res("Success value"); // Call resolve with the result
  } else {
    rej("Error message"); // Call reject with the error
  }
});

### 🏗️ Internal Structure and `this`

Inside the `MyPromise` class, we declare several variables using `this`:

*   `this.state = "pending";`: The initial state of the promise, indicating that the asynchronous operation hasn't completed yet.
*   `this.value = undefined;`: This will hold the result of the asynchronous operation if it succeeds (i.e., when `resolve` is called).
*   `this.reason = undefined;`: This will hold the reason for the failure if the asynchronous operation fails (i.e., when `reject` is called).
*   `this.thenCallbacks = [];`: This array stores the callbacks that are attached to the promise using the `.then()` method.

**Why `this`?** `this` refers to the *current object instance* of the `MyPromise` class. When we create different `MyPromise` objects, `this` allows us to associate the state, value, reason, and callbacks with *that specific* promise. Each instance has its own set of these variables.

### ⚙️ `Resolve` & `Reject` Functions

These are the functions passed to the `executor` function:

*   **`resolve(value)`:**
    *   It first checks if the promise's `state` is still "pending". This is to prevent accidentally resolving a promise multiple times.
    *   If the state is "pending", it changes the `state` to "fulfilled".
    *   It then stores the `value` (the result of the asynchronous operation) in `this.value`.
    *   Crucially, it calls `this.thenCallbacks.forEach(cb => cb(this.value));`. This is where the callbacks registered with `.then()` are executed when the promise resolves.
*   **`reject(reason)`:**
    *   Similar to `resolve`, it checks if the promise's `state` is "pending".
    *   If so, it changes the `state` to "rejected".
    *   It stores the `reason` for the rejection in `this.reason`. (Note: The current code doesn't yet *use* this reason, which is where `.catch()` would come in later).

### 🧪 Executor and the `try...catch`

The `executor` function is called immediately inside a `try...catch` block. This is important because:

*   It ensures that the code inside the `executor` is executed *synchronously* when the `MyPromise` is created.
*   The `try...catch` handles any exceptions that might occur within the `executor`. If an exception is thrown, it's caught, and the `reject` function is called with the error.

### 🔁 The `.then()` Method

The `.then()` method is how you attach callbacks to a promise that will be executed when the promise resolves (i.e., when `resolve` is called).

*   **When the Promise is Already Fulfilled:** If, when you call `.then()`, the promise's `state` is already "fulfilled", the `onFulfilled` callback is called *immediately* with the `this.value`.
*   **When the Promise is Still Pending:** If the promise's `state` is still "pending", the `onFulfilled` callback is added to the `this.thenCallbacks` array. This is how the callback is stored to be executed *later* when the promise resolves.

**Key Insight: How `.then()` Works in Conjunction with `resolve()`** When `resolve()` is called, it iterates through all the callbacks in `this.thenCallbacks` and executes each one, passing in the resolved value (`this.value`). This is how the code in your `.then()` block finally gets executed *after* the asynchronous operation completes.

## 🤔 Remaining Questions and Future Learning

*   **`.thenCallbacks.forEach(cb => cb(this.value))` - Still Needs Clarification:** I still need a deeper understanding of exactly *how* the callbacks are stored and then retrieved and executed. Specifically, I want to better visualize the flow of data from the `executor` -> `resolve()` -> storing in `this.value` -> retrieving the value in `.then()` via the callback.
*   **Promise Chaining:** I need to implement chaining to allow multiple `.then()` calls to be chained together (e.g., `promise.then(...).then(...)`).
*   **`.catch()` and `.finally()`:** Implement error handling using a `.catch()` method and a `.finally()` method for code that should always run regardless of the promise's outcome.