import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (
  req:HttpRequest<unknown>,
  next:HttpHandlerFn) => {
    if (req.url.includes('cloudinary.com')) {
      return next(req);
    }
  const  clonedRequest = req.clone({withCredentials:true})
  return next(clonedRequest)
};
