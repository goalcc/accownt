import { NextFunction, Response, Request } from 'express';
import { finishPasswordlessLogin } from 'lib/login/passwordless/finish';
import { ACCOWNT_WEB_URL } from 'constants/config';

export function api_finishPasswordlessLogin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.redirect = true;
  finishPasswordlessLogin(req.jwt)
    .then(token => {
      res.cookie('jwt', token);
      res.redirect(ACCOWNT_WEB_URL);
    })
    .catch(next);
}
