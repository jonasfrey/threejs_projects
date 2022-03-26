var someObject_a = {
    a: 1,
    b: 2
};
var someObject_b = {
    a:1, 
    b:2
}

var o_input = document.createElement("input")
document.body.appendChild(o_input)



Object.defineProperty(o_input, "value", {

    set(value){
        console.log(value)
        // Reflect.set(this, "value", value)
        
        this["_value"] = value
        // this.onchange()
        // console.log(this)

        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            this.dispatchEvent(evt);
        }
        else
            this.fireEvent("onchange");
        return true
        // return this.value 
    },
    get(){
        console.log()
        return this["_value"] 
        // return this.value 
    }
})


o_input.value = 2 