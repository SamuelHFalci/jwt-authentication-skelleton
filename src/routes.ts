import { Router } from 'express'

import UserController from './controllers/UserController'
import AuthMiddleware from './middlewares/AuthMiddleware'

const routes = Router()
routes.post('/authenticate', UserController.authenticate)
routes.post('/users', UserController.create)
routes.use(AuthMiddleware.authenticate)
routes.get('/users', UserController.index)
routes.get('/authtest', (req, res) => {
  res.send({ ok: true, id: req.body.userId })
})
export default routes
