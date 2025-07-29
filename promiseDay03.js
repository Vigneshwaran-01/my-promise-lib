// Define a custom Promise-like class
class Mypromise {
    constructor(executor) {
        // Initial state is pending
        this.state = 'pending';
        this.value = undefined; // Will hold the resolved value
        this.reason = undefined; // Will hold the rejection reason
        this.thenCallback = []; // Stores .then() callbacks to run later when resolved

        // Function to resolve the promise
        const resolve = (value) => {
            if (this.state === 'pending') {
                this.value = value; // Save the resolved value
                this.state = 'fullfilled'; // Update state
                // Run all stored callbacks with the resolved value
                this.thenCallback.forEach(cal => cal(value));
            }
        };

        // Function to reject the promise
        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                // Note: No rejection handlers implemented in this custom version
            }
        };

        // Try to execute the executor function (the one passed by user)
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error); // Handle synchronous errors in executor
        }
    }

    // Custom .then() implementation
    then(callbacks) {
        // Return a new instance of Mypromise to support chaining
        return new Mypromise((res, rej) => {
            // Define how the callback should run
            const handleCallback = (value) => {
                try {
                    // Run user's .then() callback with value
                    const result = callbacks(value);
                    // Resolve the next promise with the result
                    res(result);
                } catch (error) {
                    // If error happens, reject the next promise
                    rej(error);
                }
            };

            // If the promise is already resolved, run the callback immediately
            if (this.state === 'fullfilled') {
                handleCallback(this.value);
            } else {
                // If it's still pending, store the callback to run later
                // Wrap the callback in a function that takes this.value at resolution time
                this.thenCallback.push(() => handleCallback(this.value));
            }
        });
    }
}
