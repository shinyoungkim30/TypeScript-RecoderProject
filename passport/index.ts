import passport from 'passport';
import local from './localStrategy';
import User from '../models/user';

export default () => {
  passport.serializeUser((user, done) => {
      done(null, user.user_id)
  })

  passport.deserializeUser(async (user_id: number, done) => {
    try {
        const user = await User.findOne({ where: { user_id }});
        done(null, user); // req.user
      } catch (error) {
        console.error(error);
        done(error);
      }
  })

  local()
}