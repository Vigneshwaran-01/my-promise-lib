class Mypromise{
    constructor(executor){
        this.value=undefined;
        this.state="pending";
        this.reason=undefined;
        this.thenCallbacks=[];

 
        const resolve= (val)=>{
             if(this.state =="pending"){
                this.value=val;
                this.state="fullfilled"
                this.thenCallbacks.forEach((cal)=>cal(val))
             }
        }

        const reject=(reason)=>{
            if(this.state=="pending"){
                this.reason=reason;
                this.state="rejected"
            }
            // catch functionality
        }

        try{
            executor(resolve,reject);
        }
        catch(error){
            reject(error)
        }
    }

    then(callbacks){
  return new Mypromise((res,rej)=>{
const handleCallback=()=>{
           
                try{
                    const result =callbacks(this.value)
                    res(result)
                }
                catch(error){
                    rej(error)
                }
            }
           


        if(this.state=="fullfilled"){
          return  handleCallback()
        }
        else{
            this.thenCallbacks.push(handleCallback)
        }
  })

}
}


new Mypromise((res,rej)=>{
    setTimeout(()=>{
        res(5)
    }, 3000)
})
.then((val)=>val+2)
.then((val)=>val+2)
.then((val)=>console.log(val)
)
