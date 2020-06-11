const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const jwtKey = 'exemple_cours_secret_key';
const jwtExpirySeconds = 3600;
const transport = nodemailer.createTransport({
    host:'...',
    service: 'gmail',
    auth: {
        user: 'retardedMailSender@gmail.com',
        pass: 'J0ggers_'
    },
    tls:{
        rejectUnauthorized: false
    }
});

module.exports = (userAccountService) => {
    return {
        validateJWT(req, res, next) {
            if (req.headers.authorization === undefined) {
                res.status(401).end()
                return
            }
            const token = req.headers.authorization.split(" ")[1];
            jwt.verify(token, jwtKey, {algorithm: "HS256"},  async (err, user) => {
                if (err) {
                    console.log(err)
                    res.status(401).end()
                    return
                }
                try {
                    req.user = await userAccountService.dao.getByLogin(user.login)
                    return next()
                } catch(e) {
                    console.log(e);
                    res.status(401).end()
                }

            })
        },
        generateJWT(login) {
            return jwt.sign({login}, jwtKey, {
                algorithm: 'HS256',
                expiresIn: jwtExpirySeconds
            })
        },
        inscriptionMail(login) {
            jwt.sign({login}, jwtKey,
                {
                    algorithm: 'HS256',
                    expiresIn: '1d'
                },
                (err, emailToken) => {
                    const url = `http://localhost:3333/useraccount/confirmation/${emailToken}`;
                    if(!!err) return err;
                    transport.sendMail({
                        to: login,
                        subject: 'Confirmer votre mail',
                        html: `<p>Bonjour, <br/> 
                        Pour finaliser votre inscription sur le site de liste de course cliquez sur le lien suivant :<br/> <a href="${url}">${url}</a> <br/>
                        Si vous ne vous êtes pas inscrit sur le site, vous pouvez simplement ignorer ce mail. <br/>
                        Le lien a une durée de vie de 24 heures, si vous souhaitez activer le compte après ce délais, rendez-vous sur la page d'inscription du site et cliquez sur  le bouton ayant pour titre "Vous n'avez pas reçu votre mail de confirmation ?co". <br/>
                        A très bientôt. <br/><br/><br/>
                        <i>Merci de ne pas répondre à ce mail</i></p>`
                    });
                    },
                );
        },
        validationMail(token, res){
            return new Promise(success => {
            jwt.verify(token, jwtKey, {algorithm: "HS256"},  async (err, user) => {
                if (err) {
                    console.log(err);
                    res.status(401).end();
                    return
                }
                try {
                    user = await userAccountService.dao.getByLogin(user.login);
                    user.isconfirmed = true;
                    success(user);
                } catch(e) {
                    console.log(e);
                    res.status(401).end()
                }
            })});
        }
    };
};

