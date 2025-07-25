class MyPromise {
    constructor(executor) {
      this.state = "pending";
      this.value = undefined;
      this.reason = undefined;
      this.thenCallbacks = [];
  
      const resolve = (value) => {
        if (this.state === "pending") {
          this.state = "fulfilled";
          this.value = value;
          this.thenCallbacks.forEach(cb => cb(this.value));
        }
      };
  
      const reject = (reason) => {
        if (this.state === "pending") {
          this.state = "rejected";
          this.reason = reason;
          // handle rejection later
        }
      };
  
      try {
        executor(resolve, reject);
      } catch (error) {
        reject(error);
      }
    }
  
    then(onFulfilled) {
      if (this.state === "fulfilled") {
        onFulfilled(this.value);
      } else {
        this.thenCallbacks.push(onFulfilled);
      }
      return this;
    }
  }
  