var express = require('express');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var router = express.Router();
const execa = require('execa');
var port = process.env.port || 8686;
var app = express();
app.use('/',router);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}  

app.post('/compile',function(req,res) {
    swiftCode = req.files.code;
    let uuid = guid();
    var exportName = './files/' + uuid + '.swift';
    swiftCode.mv(exportName, function (err) {
        if (!err) {
            execa('swift', [exportName]).then(result => {
                res.json({success:true, message: result.stdout});
            }).catch(err => {
                error = err.stderr.substring(err.stderr.indexOf(':')+1, err.stderr.length);                
                res.json({success:false, message:error});
            });
        }
    });
})

app.listen(port);