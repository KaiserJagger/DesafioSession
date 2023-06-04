import passport from "passport"
import local from 'passport-local'
import UserModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from "../utils.js"

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { first_name, last_name, age, email } = req.body
        try {
            const user = await UserModel.findOne({ email: username })
            if (user) {
                console.log('User already exists!')
                return done(null, false)
            }
            const newUser = {
                first_name, last_name, age, email,
                password: createHash(password)
            }
            const result = await UserModel.create(newUser)
            return done(null, result)
        } catch(error) {
            return done('Error en passport REGISTER ' + error)
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const user = await UserModel.findOne({ email: username })
            if (!user) {
                console.log('User does not exists')
                return done(null, user)
            }

            if (!isValidPassword(user, password)) return done(null, false)

            return done(null, user)
        } catch(error) {
            done('error')
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport