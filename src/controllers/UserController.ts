import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../schemas/User'
import jwt from 'jsonwebtoken'
const secret = '83439f12d9cf1b1743483dbf811b5a0a'
function generateToken (params = {}): string {
  const token = jwt.sign(params, secret, {
    expiresIn: 86400
  })
  return token
}

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    const users = await User.find()
    return res.json(users)
  }

  public async create (req: Request, res: Response): Promise<Response> {
    const { email } = req.body
    try {
      if (await User.findOne({ email })) { return res.status(400).send({ error: 'User already exists' }) }

      const user = await User.create(req.body)
      user.password = ''
      return res.json({ user, token: generateToken({ id: user.id }) })
    } catch (error) {
      return res.status(400).send({ error: 'Registration Failed' })
    }
  }

  public async authenticate (req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user) return res.status(400).send({ error: 'User not found' })

    if (!await bcrypt.compare(password, user.password)) return res.status(400).send({ error: 'Invalid email or password' })
    user.password = ''
    return res.send({ user, token: generateToken({ id: user.id }) })
  }
}

export default new UserController()
