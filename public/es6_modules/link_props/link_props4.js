

    class O_other{
        constructor(object){
            this.object = object
            this.a_s_prop_this = [] // property of this object to be linked
            this.a_s_prop_other = [] // property of other object, which is linked
            return this
        }

        f_link_properties(s_prop_this, s_prop_other){
            this.a_s_prop_this.push(s_prop_this)
            this.a_s_prop_other.push(s_prop_other)
        }
    }

var someObject_a = {
    a: 1,
    b: 2
};
var someObject_b = {
    a:1, 
    b:2
}
var someObject_c = {
    a:1, 
    b:2
}

someObject_a = new Proxy(someObject_a, {
    get(object,s_prop){
        console.log("get called")
        return object[s_prop]
    },
    set(object,s_prop,value){
        if(s_prop != "a_o_other"){
            for(var n_index in object.a_o_other){
                var o_other = object.a_o_other[n_index]
                var n_index_s_prop_other = o_other.a_s_prop_other.indexOf(s_prop)
                if(n_index_s_prop_other != -1){
                    o_other.object[o_other.a_s_prop_this[n_index_s_prop_other]] = value
                }

            }
        }
        console.log("set called")
        return object[s_prop] = value
    }
})

someObject_a.a_o_other = []
someObject_a.a_o_other.push(
    new O_other(someObject_b)
)
var other_b = someObject_a.a_o_other.filter(o=>o.object == someObject_b)[0]

if(!other_b){
    var other_b = new O_other(someObject_b)
}

//link someObject_a.prop_a to someObject_b.prop_b
other_b.f_link_properties("prop_b", "prop_a")




someObject_b = new Proxy(someObject_b, {
    get(object,s_prop){
        console.log("get called")
        return object[s_prop]
    },
    set(object,s_prop,value){
        if(s_prop != "a_o_other"){
            for(var n_index in object.a_o_other){
                var o_other = object.a_o_other[n_index]
                var n_index_s_prop_other = o_other.a_s_prop_other.indexOf(s_prop)
                if(n_index_s_prop_other != -1){
                    o_other.object[o_other.a_s_prop_this[n_index_s_prop_other]] = value
                }

            }
        }
        console.log("set called")
        return object[s_prop] = value
    }
})

someObject_b.a_o_other = []
someObject_b.a_o_other.push(
    new O_other(someObject_a)
)
var other_a = someObject_b.a_o_other.filter(o=>o.object == someObject_a)[0]

if(!other_a){
    var other_a = new O_other(someObject_a)
}

//link someObject_b.prop_a to someObject_b.prop_b
other_a.a_s_prop_this.push('prob_a')
other_a.a_s_prop_other.push('prob_b')



someObject_c = new Proxy(someObject_c, {
    get(object,s_prop){
        console.log("get called")
        return object[s_prop]
    },
    set(object,s_prop,value){
        if(s_prop != "a_o_other"){
            for(var n_index in object.a_o_other){
                var o_other = object.a_o_other[n_index]
                var n_index_s_prop_other = o_other.a_s_prop_other.indexOf(s_prop)
                if(n_index_s_prop_other != -1){
                    o_other.object[o_other.a_s_prop_this[n_index_s_prop_other]] = value
                }

            }
        }
        console.log("set called")
        return object[s_prop] = value
    }
})

someObject_c.a_o_other = []
someObject_c.a_o_other.push(
    new O_other(someObject_a)
)
var other_a = someObject_c.a_o_other.filter(o=>o.object == someObject_a)[0]

if(!other_a){
    var other_a = new O_other(someObject_a)
}

//link someObject_b.prop_a to someObject_b.prop_b
other_a.a_s_prop_this.push('prob_c')
other_a.a_s_prop_other.push('prob_a')