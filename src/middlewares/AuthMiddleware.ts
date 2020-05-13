import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
const secret = '83439f12d9cf1b1743483dbf811b5a0a'
class AuthMiddleware {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public static authenticate (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).send({ error: 'No token provided' })

    const parts: string[] = authHeader.split(' ')

    if (parts.length !== 2) return res.status(401).send({ error: 'Token error' })

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) return res.status(401).send({ error: 'Token malformatted' })

    jwt.verify(token, secret, (err, decoded: any) => {
      if (err) return res.status(401).send({ error: 'Token invalid' })

      req.body.userId = decoded.id
      return next()
    })
  }
}
export default AuthMiddleware
