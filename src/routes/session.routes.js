import {Router} from 'express';
import { userModel } from '../models/users.models.js';
import passport from 'passport';
import { validatePassword } from '../utils/bcrypt.js';

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login') , async (req, res) => {
    console.log(req.user);
    try {
        if(!req.user){
            return res.status(401).send({mensaje:"Usuario o contraseña invalidos"})
        }

        req.session.user ={
            first_name:req.user.first_name,
            last_name:req.user.last_name,
            email:req.user.email,
            role:req.user.role,
            age:req.user.age
        }
        res.status(200).redirect('../../')

    } catch (error) {
        res.status(500).send({mensaje:"Error en la consulta: ", error})
    }
})

sessionRouter.get('/github',passport.authenticate('github', {scope: ['user:email']}), async(req, res) => {
    console.log(1);
    res.status(200).redirect('../../')
})

sessionRouter.get('/githubSession',passport.authenticate('github',{failureRedirect:'../../login'}),async(req, res) => {
    req.session.user =req.user
    res.redirect('/')
})

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(() => {
    })
    res.redirect('../../')
})

export default sessionRouter
    