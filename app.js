const express = require('express');
const res = require('express/lib/response');
const app = express()
const path = require('path')
const fs = require('fs')

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

app.use('/node_modules/three', express.static(path.join(__dirname, './node_modules/three')))
// three modules such as PointerLockControls , need this /three route 

app.listen(3000, () => console.log('Visit http://127.0.0.1:3000'))
