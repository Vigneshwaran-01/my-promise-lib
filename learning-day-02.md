/*
📌 Custom Promise Library - MyPromise
🧠 What I Learned Today:

✅ 1. Why use `class`?
- Classes are used to create multiple instances with shared behavior but separate internal states.
- Each `MyPromise` object tracks its own state, value, and callback queue.

✅ 2. Role of `constructor(executor)`:
- Accepts a callback function (just like native Promises) that immediately gets executed with `resolve` and `reject` functions.
- Initializes internal state:
    - `state` = "pending"
    - `value` = undefined
    - `reason` = undefined
    - `thenCallbacks` = [] (to store `.then()` callbacks)

✅ 3. `resolve(val)`:
- Called when async task succeeds.
- Updates state to `"fulfilled"`, stores value, and runs all stored callbacks.

✅ 4. `reject(reason)`:
- Called when task fails.
- Updates state to `"rejected"` and stores the reason (future scope: `.catch()`).

✅ 5. `then(callback)`:
- Supports chaining by returning a new `MyPromise`.
- Handles 2 cases:
    1. If already fulfilled → execute callback immediately.
    2. If still pending → store callback in `thenCallbacks`.

✅ 6. Chaining Works:
- `.then()` returns a new promise each time.
- Each `then()` gets the result from the previous one.

📦 Example Flow:
new MyPromise((res, rej) => {
    setTimeout(() => res(5), 3000);
})
.then(val => val + 2)  // 7
.then(val => val + 2)  // 9
.then(val => console.log(val));  // 9 (logged after 3 sec)

⚠️ Still Missing:
- `.catch()` for error handling.
- `.finally()` for cleanup logic.
- Handling `rejected` state in `.then()` (we're ignoring it for now).

🚀 Next Steps:
- Implement `.catch()` method.
- Handle async error propagation.
- Optional: Build a task queue to make it more like native JS promises.


