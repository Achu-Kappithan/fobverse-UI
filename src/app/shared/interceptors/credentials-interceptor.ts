import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (
  req:HttpRequest<any>,
  next:HttpHandlerFn) => {
    if (req.url.includes('cloudinary.com')) {
      return next(req);
    }
    console.log("cred interceptero is working")
  const  clonedRequest = req.clone({withCredentials:true})
  return next(clonedRequest)
};
