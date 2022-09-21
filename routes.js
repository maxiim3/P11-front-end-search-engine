const {output} = require('./module/links')
const express = require("express")

const app = express()
app.use(express.json())

const $PORT = 9821
const $LOCAL = `http://localhost:${$PORT}`
// const $ROOT = 'oc_projet_7/index.html'
// const $PATH = `${$LOCAL}/${$ROOT}`
const absolutePath = __dirname

app.listen($PORT, () => console.log(`open ${$LOCAL} ${__dirname}`))


app.use(express.static(__dirname + '/'));
app.get('/',function(req,res){
	res.sendFile(absolutePath + '/public/index.html')
});

app.get('/api',function(req,res){
	res.send(output)
});