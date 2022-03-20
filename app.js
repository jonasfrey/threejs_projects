const express = require('express');
const res = require('express/lib/response');
const app = express()
const path = require('path')
const http = require('http');
const https = require('https');

const fs = require('fs')

const n_port_http = 3000
const n_port_https = 3001

const http_app = express()
http_app.get("*", (req, res)=>{
    var a_parts = req.headers.host.split(":")
    // console.log(req.protocol)
    console.log(req.protocol)

    if(req.protocol !== 'https'){
        res.redirect('https://' + a_parts.shift()+":"+n_port_https + req.url);
    }

})

    app.use(express.static(__dirname + '/public'))

    app.get('/available_modules', (req, res) => {

        var a_js_filenames = []
        fs.readdir("./public", (err, a_filenames) => {
            a_filenames.forEach(s_file => {
                if(s_file.indexOf(".js") != -1){
                    a_js_filenames.push(s_file)
                }
            }); 
            res.send(JSON.stringify(a_js_filenames))
        });
        //   res.send("test"); 
    });

    app.post('/app_css_json', function(o_request, o_response) {
        var s_body = '';
        var s_filepath_filename = __dirname + '/public/app_css_variables/app_css.json';
        var s_filepath_filename_module = __dirname + '/public/app_css_variables/app_css.mjs';
        var s_filepath_filename_new = __dirname + '/public/app_css_variables/app_css.cached.json';
        var s_filepath_filename_module_new = __dirname + '/public/app_css_variables/app_css.cached.mjs';

        try {
            
            fs.rename(
                s_filepath_filename,
                s_filepath_filename_new,
                function (o_error) {
                    // if (o_error) throw o_error
                    console.log(`renamed ${s_filepath_filename} to ${s_filepath_filename_new}`)
                    // console.log('Successfully renamed - AKA moved!')
                }
            )
            fs.rename(
                s_filepath_filename_module,
                s_filepath_filename_module_new,
                function (o_error) {
                    // if (o_error) throw o_error
                    console.log(`renamed ${s_filepath_filename} to ${s_filepath_filename_new}`)
                    // console.log('Successfully renamed - AKA moved!')
                }
            )

            o_request.on('data', function(data) {
                s_body += data;
            });
        
            o_request.on('end', function (){
                fs.writeFileSync(s_filepath_filename, s_body, function() {
                    o_response.end('success');
                });
        
                var s_module = `
                    const o_app_css_variables_static = ${s_body};
                    export default o_app_css_variables_static
                `; 
        
                fs.writeFileSync(s_filepath_filename_module, s_module, function() {
                    o_response.end("success");
                });

                o_response.end("success");


            });
        } catch (error) {
            
        }

        o_response.end("success");


    });

    app.use('/node_modules/three', express.static(path.join(__dirname, './node_modules/three')))
    app.use('/node_modules/math_tau_module', express.static(path.join(__dirname, './node_modules/math_tau_module')))
    app.use('/node_modules/o_hidstatusmap', express.static(path.join(__dirname, './node_modules/o_hidstatusmap')))
    // three modules such as PointerLockControls , need this /three route 




var key = fs.readFileSync(__dirname + '/selfsigned_certificates/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/selfsigned_certificates/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};



var o_https_server = https.createServer(options, app);
o_https_server.listen(n_port_https, () => console.log('Visit https://127.0.0.1:'+n_port_https))


var o_http_server = http.createServer(http_app);
o_http_server.listen(n_port_http, () => console.log('Visit http://127.0.0.1:'+n_port_http))

