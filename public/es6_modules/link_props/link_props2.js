    var someObject_a = {
        a: 1,
        b: 2
    };
    var someObject_b = {
        a:1, 
        b:2
    }

    class O_other{
        constructor(object, s_prop_name){
            this.object = object 
            this.s_prop_name = s_prop_name
            return this
        }
    }

    class O_proxy{
        constructor(original){
            var tmp  = original
            original  = new Proxy(original, this)
            this.a_o_other = []
            return original
        }

        set(o_object, s_prop, value){
            if(s_prop == "add_o_other"){
                return this.add_o_other(value)
            }
            console.log(this)
            console.log('set called')
            for(var n_index in this.a_o_other){
                var o_other = this.a_o_other[n_index]
                o_other.object[o_other.s_prop_name] = value
            }
            debugger
            this.__target__[s_prop] = value 
            return o_object[s_prop]= value
        }
        get(o_object, s_prop){
            console.log('get called')
            return o_object[s_prop]
        }
        add_o_other(o_other){
            this.a_o_other.push(o_other)
        }
    }

    someObject_a = new O_proxy(someObject_a)
    someObject_b = new O_proxy(someObject_b)

    var o_input = document.createElement("input")
    var o_input_old = o_input
    document.body.appendChild(o_input)
    // o_input = new O_proxy(o_input)

    var o_heading = document.createElement("h1")
    var o_heading_old = o_heading
    document.body.appendChild(o_heading)
    // o_heading = new O_proxy(o_heading)


    // // 
    // someObject_a.add_o_other(new O_other(someObject_b, "b"))
    
    Object.defineProperty(o_input_old, "value", {

        set(a,b,c){
            console.log(a,b,c)
            // return a[b] = c
            return this.value 
        },
        get(a,b){
            console.log(a,b)
            // return a[b]
            return this.value 
        }
    })




    const target = {
        message1: "hello",
        message2: "everyone",
        a_o_other:[], 
      };
      
      const targe2 = {
        message1: "hello",
        message2: "everyone",
        a_o_other:[], 
      };
      const handler3 = {
        get(target, prop, receiver) {
            console.log("get")
          return Reflect.get(...arguments);
        },
        set(a,b,c){
            console.log("set")

            // debugger
            for(var n_index in a.a_o_other){
                var o_other = a.a_o_other[n_index]
                o_other.object[o_other.s_prop_name] = c
            }
            return Reflect.set(...arguments)
        }
      };
      
      const proxy3 = new Proxy(target, handler3);

      proxy3.a_o_other.push(new O_other(targe2, "message1"))

      const proxy4 = new Proxy(targe2, handler3);

      console.log(proxy3.message1); // hello
      console.log(proxy3.message2); // world


      const proxy_o_input_old = new Proxy(o_input_old, handler3);

      proxy3.a_o_other.push(new O_other(proxy_o_input_old, "value"))

