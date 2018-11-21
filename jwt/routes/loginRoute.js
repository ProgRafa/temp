const jwt = require('jsonwebtoken');
const Datasource = require('../dao/datasource.js');
var bodyParser = require('../node_modules/body-parser');

urlencodeParser = bodyParser.urlencoded({extended: false});

module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.post('/login', (req, res, next) => {
        const datasource = new Datasource();
        console.log(req.body);
        const login = req.body.login;
        const pass = req.body.pass;

        datasource.isUserRegistered(login, pass)
            .then((isRegistred) => {
                console.log('Result', isRegistred);
                if(isRegistred) {
                    datasource.getUserIdByLoginAndPassword(login, pass)
                        .then((userId) => {
                            let token = jwt.sign({userId}, process.env.SECRET, {
                                expiresIn: 300
                            });
                            res.status(200).send(
                                {auth: true, token: token}
                            );
                        });
                } else {
                    res.status(500).send({auth: false, message: "Login Inválido"});
                }
            });
    });
};