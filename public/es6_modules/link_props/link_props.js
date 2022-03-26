var someObject_a = {
    a: 1,
    b: 2
};
var someObject_b = {
    a:1, 
    b:2
}
function f_get_ref_obj_to_property(object, prop) {
    return {
        get value () {
            return object[prop]
        },
        set value (val) {
            object[prop] = val;
        }
    };
}
var s_prop_a= 'b'
var s_prop_b= 'a'

var o_ref_a = f_get_ref_obj_to_property(someObject_a, s_prop_a);
var o_ref_b = f_get_ref_obj_to_property(someObject_b, s_prop_b);

var tmp = linkedObject[s_prop]; 

Object.defineProperty(
    linkedObject,
    s_prop,
    {

        set: function(value) {
            o_ref.value = value;
        },
        get: function() {
            return o_ref.value
        }
    }
);
linkedObject[s_prop] = tmp 

someObject.b = 333 /// linkedObject.b is also 333 now
console.log(someObject.b) //  333 
console.log(linkedObject.b)// 333

linkedObject.b = {"test": 2}
console.log(someObject.b) //  {test:2}
console.log(linkedObject.b)// {test:2}

someObject.b.test = 3 
console.log(someObject.b) // {test:3}
console.log(linkedObject.b)//{test:3}