What You Learned Today (Recap):

❓ Questions I get :
## Why do we store a function () => handleCallback(this.value) instead of directly passing this.value?
🔹 Because this.value is not available yet — it will only be known later when the Promise resolves. So we store a function, not the result.
🔹 When resolved, we call this function and only then use this.value.

## How does .then() chaining work if it's a new instance each time?
🔹 Each .then() returns a new Mypromise, but each one closes over the previous promise’s resolved value.
🔹 The new instance waits for the previous one to resolve, then uses the result (this.value) to resolve itself via the callback.

## How does the new promise created inside .then() know the value of the previous one?
🔹 Because we define handleCallback(this.value) in the closure. The outer promise manages this.value, and when resolved, the new promise uses that value.

## What if the original promise is still pending when we call .then()?
🔹 Then we push the handleCallback function into the thenCallback[] array and run it later when resolve() is called.

## What happens when we call .then() on a promise that is already resolved?
🔹 It runs the callback immediately with the already available this.value.