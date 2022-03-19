var o_app_css_variables = {}

// const o_xml_httprequest_app_css = new XMLHttpRequest();
const s_app_css_startstring = "variables_start"
const s_app_css_endstring = "variables_end"
const o_computed_css_style = getComputedStyle(document.documentElement); 
// o_xml_httprequest_app_css.open(
//     'GET',
//     './../app.css'
// ); 
// o_xml_httprequest_app_css.onload = function(){
//     if(this.status == 200){

//         // console.log(o_app_css_variables)
//         // if(n_index_s_app_css_endstring == -1 || n_index_s_app_css_startstring == -1){

//         // }
//     }
// }
// o_xml_httprequest_app_css.send()


// export {o_app_css_variables}


// fetch request
const o_app_css_variables2 = fetch('./../app.css') // fetch is the new XMLHttpRequest
    .then(function(o_response){
        let s_response_text_promise = o_response.text();
        return s_response_text_promise.then(function(s_response_text){
            // console.log(result)
            var res = f_o_extract_css_variables_from_string(s_response_text)
            // console.log(res)
            return res
        }, function(error){
            console.error('test')
        })
        console.log(s_response_text_promise)
  });


var f_o_extract_css_variables_from_string = function(s_string){
    // console.log(s_string)
    var o_variables = {}
    var n_index_s_app_css_startstring = 0; 
    var n_index_s_app_css_endstring = 0; 
    while(n_index_s_app_css_startstring != -1){
        var n_index_s_app_css_startstring_old = n_index_s_app_css_startstring
        n_index_s_app_css_startstring = s_string.indexOf(s_app_css_startstring, n_index_s_app_css_startstring_old+1)
        n_index_s_app_css_endstring = s_string.indexOf(s_app_css_endstring, n_index_s_app_css_startstring_old+1)
        var s_lines_between_start_end = s_string.substring(
            n_index_s_app_css_startstring,
            n_index_s_app_css_endstring,
        )
        // credits https://stackoverflow.com/questions/3984380/regular-expression-to-remove-css-comments
        // remove css comments
        const  s_css_comments_regex = new RegExp(/\s*(?!<\")\/\*[^\*]+\*\/(?!\")\s*/g);
        s_lines_between_start_end.replaceAll(
            s_css_comments_regex,
            ""
        )
        const a_lines_between_start_end = s_lines_between_start_end.split('\n')
        // preg_replace(  , '' , $s_lines_between_start_end );
        
        for(var n_s_lines_between_start_end_key in a_lines_between_start_end){
            var s_line = a_lines_between_start_end[n_s_lines_between_start_end_key]
            s_line = s_line.trim()
            if(s_line == ""){
                continue
            }
            var n_index_of_colon = s_line.indexOf(":")
            var n_index_of_semiolon = s_line.indexOf(";")
            var s_property = s_line.substring(0, n_index_of_colon).trim()
            var s_value_beforecomputed = s_line.substring(n_index_of_colon, n_index_of_semiolon)
            var s_value = o_computed_css_style.getPropertyValue(s_property).trim()
            o_variables[s_property] = s_value
            o_variables[s_property+"_beforecomputed"] = s_value_beforecomputed
            o_variables[s_property.substring(2)] = s_value
            // console.log(s_value)
            
        }

        return o_variables


    }
}
export default await o_app_css_variables2;