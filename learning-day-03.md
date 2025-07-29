# Day 3: Understanding `.then()` Chaining in Custom Promise Implementation

## ✅ What I Learned

Today, I leveled up my understanding of **how `.then()` works under the hood**, especially when **multiple `.then()` calls are chained**. This is crucial to mastering **asynchronous workflows in JavaScript** — both in frontend frameworks and backend pipelines.

---

### 🧠 Concept: `.then()` Returns a New Promise

Each call to `.then()` returns **a completely new instance** of `MyPromise`.

```js
const p1 = new MyPromise(...);
const p2 = p1.then(...); // p2 is a NEW MyPromise
```

But these are **not isolated** — they are **linked** via the callback system and value flow.  
`p2` depends on the **resolved value of `p1`**.

---

### 🔄 How `.then()` Chains Work Internally

#### Inside `.then()`:

* We return a new `MyPromise`.
* We define a function (`handleCallback`) that:
  * Accepts the value from the previous promise.
  * Runs the user-provided `.then()` callback.
  * Resolves the new promise (`res(result)`).
* We decide whether to run the callback **immediately or store it**:
  * If the current promise is fulfilled ➜ run the callback now.
  * If still pending ➜ store it in `thenCallbacks[]`.

```js
if (this.state === 'fullfilled') {
    handleCallback(this.value); // run immediately
} else {
    this.thenCallback.push(() => handleCallback(this.value)); // run later
}
```

---

### 🔑 Key Insight:

> The new promise returned from `.then()` knows what to do **because the previous promise resolves and calls the stored callback**, passing in the correct value.

---

### 🧪 Example Chain

```js
const p1 = new MyPromise((res, rej) => {
    setTimeout(() => res(10), 1000);
});

const p2 = p1.then(val => val + 5); // Gets 10 → returns 15
const p3 = p2.then(val => val * 2); // Gets 15 → returns 30
```

* `p1` resolves with `10`.
* `p2` runs its `.then()` callback with `10`, returns `15`.
* `p3` waits for `p2`, then runs its `.then()` with `15`, returns `30`.

---

### 🧠 Concept: Why We Use `() => handleCallback(this.value)`

When promise is still pending, we store the function:

```js
this.thenCallback.push(() => handleCallback(this.value));
```

> We're storing a **reference** to a function that will run **later**, after the value is available.

Why this works:

* JavaScript closures keep the reference to `this.value`.
* Once `resolve()` sets the value, the function will use the correct one.

---

### 🔄 Each Promise is a Separate Instance

Each `.then()` creates a **new isolated promise** with its own:

* `state`
* `value`
* `reason`
* `thenCallback[]`

But they're **logically connected** through:

1. `resolve()` of previous promise
2. Callback returning a value
3. That value passed into `res()` of the next one

---

## 🔍 Deepened Understanding

### ✅ Q: How does a new `.then()` get the value of the previous promise?

**Answer**: Because the previous promise calls the `.then()` callback with its resolved value. That callback runs, produces a result, and that result is passed into the `resolve()` of the new promise.

---

### ✅ Q: What if `.then()` is called before the promise is resolved?

**Answer**: The callback is **stored** in `this.thenCallback[]`.  
When the promise is resolved, we loop through that array and run all the stored callbacks with the resolved value.

---

### ✅ Q: What value is passed to `.then()` if `this.value` isn’t ready yet?

**Answer**: At that moment, nothing is passed. But the callback isn’t run yet — only stored.  
Later, when `resolve(value)` is called, we finally run the callback **with the correct value**. This is thanks to how closures and function references work in JS.

---

## 🚀 What’s Next / Future Work

* [ ] Implement `.catch()` to handle rejected promises.
* [ ] Add `.finally()` to support cleanup logic.
* [ ] Add microtask queue behavior to simulate real Promise behavior more accurately.
* [ ] Refactor `reject()` to trigger rejection callbacks.
* [ ] Visualize how promise chains create **dependency graphs**.
