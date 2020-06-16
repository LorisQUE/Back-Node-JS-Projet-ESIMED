const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const jwtKey = 'exemple_cours_secret_key';
const jwtExpirySeconds = 3600;
const baseUrl = 'http://ec2-3-209-101-117.compute-1.amazonaws.com:3333/useraccount';
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
                    console.log(err);
                    res.status(401).end();
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
                    const url = `${baseUrl}/confirmation/${emailToken}`;
                    if(!!err) return err;
                    transport.sendMail({
                        to: login,
                        subject: 'Confirmer votre mail',
                        html: `<p>Bonjour, <br/> 
                        Pour finaliser votre inscription sur le site de liste de course cliquez sur le lien suivant :<br/> <a href="${url}">${url}</a> <br/>
                        Si vous ne vous êtes pas inscrit sur le site, vous pouvez simplement ignorer ce mail. <br/>
                        Le lien a une durée de vie de 24 heures, si vous souhaitez activer le compte après ce délais, rendez-vous sur la page d'inscription du site et cliquez sur  le bouton ayant pour titre "Vous n'avez pas reçu votre mail de confirmation ?". <br/>
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
        },
        reinitMail(user, login) {
            jwt.sign({login}, user.challenge,
                {
                    algorithm: 'HS256',
                    expiresIn: '30m'
                },
                (err, emailToken) => {
                    const url = `${baseUrl}/reinitialisation/form/${user.id}/${emailToken}`;
                    if(!!err) return err;
                    transport.sendMail({
                        to: login,
                        subject: 'Réinitialisation de votre mot de passe',
                        html: `<p>Bonjour, <br/> 
                        Pour réinitialiser votre mot de passe sur le site de liste de course cliquez sur le lien suivant :<br/> <a href="${url}">${url}</a> <br/><br/>
                        Si vous n'avez pas demandé de réinitialisation sur le site, vous pouvez simplement ignorer ce mail. <br/><br/>
                        Le lien a une durée de vie de 30 minutes, si vous le souhaitez vous pouvez refaire une demande de réinitialisation de mot de passe sur le site. <br/>
                        A très bientôt. <br/><br/><br/>
                        <i>Merci de ne pas répondre à ce mail</i></p>`
                    });
                },
            );
        },
        reinitConfirm(token, user, res){
            return new Promise(success => {
                jwt.verify(token, user.challenge, {algorithm: "HS256"},  async (err, gg) => {
                    if (err) {
                        console.log('Mauvais token ou expiré : ', err);
                        res.status(401).end();
                        return
                    }
                    try {
                        success(res.status(200).end());
                    } catch(e) {
                        console.log(e);
                        res.status(401).end()
                    }
                })});
        },
    };
};

