var express = require('express')
var app = express()
var body_parser = require('body-parser')
var redis = require('redis')
var redis_client = redis.createClient()
const {promisify} = require('util');
const getAsync = promisify(redis_client.get).bind(redis_client);

let short_code_key = 'short_code'

redirect_router = express.Router()
add_url_router = express.Router()

function update_short_code() {
    redis_client.incr(short_code_key)
}

add_url_router.use((req, res) => {
    update_short_code()
    getAsync(short_code_key).then((code) => {
        var short_code = parseInt(code).toString(36)
        var url = req.get('url')
        if(url.substring(0,4) != 'http') url = 'http://' + url
        redis_client.set(short_code, url, () => {
            res.status(200).send(short_code)
        })
    })
})

redirect_router.get('/:short_code',
    (req, res) => {
        getAsync(req.params.short_code).then((result) => {
            if(result) {
                res.redirect(303, result)
            } else {
                res.status(404).send()
            }
        })
    })

app.use(body_parser.urlencoded({extended:true}));
app.use(body_parser.json({extended:true}));
app.use(express.static('site'))
app.use('/s/', redirect_router)
app.use('/a/', add_url_router)
app.listen(3000)
