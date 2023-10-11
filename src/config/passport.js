import local from 'passport-local';
import passport from 'passport';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import { userModel } from '../models/users.models.js';
import GithubStrategy from 'passport-github2';

//Defino la estrategia a utilizar

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, async (req, username, password, done) => {
        //Defino como voy a registrar al usuario
        const { first_name, last_name, email, confirmation_password, age } = req.body

        try {
            const user = await userModel.findOne({ email: email })
            if (user) {
                return done(null, false, { message: "Usuario ya existente" })
            }
            if (password !== confirmation_password) {
                return done(null, false, { message: "Las contraseñas no coinciden" })
            }
            const hashPassword = createHash(password)
            const userCreated = await userModel.create({
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: hashPassword,
                age: age
            })
            return done(null, userCreated)
        }
        catch (e) {
            return done(e)
        }
    }))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user) {
                return done(null, user)
            }

            const validate = validatePassword(password, user.password)

            if (!validate) {
                return done(null, false)
            }

            return done(null, user)
        }
        catch (e) {
            return done(e)
        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
                const user = await userModel.findOne({ email: profile._json.email });

                if (user) {
                    return done(null, user);
                } else { 
                    const hashPassword = createHash('password')
                    const newUser = await userModel.create({
                        first_name: profile._json.name,
                        last_name: ' ',
                        email: profile._json.email,
                        password: hashPassword,
                        age: 18
                    });
                    return done(null, newUser);
                }
            } catch (error) {
                return done(error); 
            }
        }
    ))

    //Inicializar la sesión del usuario
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    //Eliminar la sesión del usuario
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        return done(null, user)
    })
}

export default initializePassport;