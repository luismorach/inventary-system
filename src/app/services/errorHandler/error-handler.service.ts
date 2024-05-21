import { ErrorHandler, Injectable } from '@angular/core';
import { ComunicatorComponetsService } from '../comunicator/comunicator-componets.service';
import { Alert } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(private comunicatorSvc: ComunicatorComponetsService) { }

  //manejador de errores global
  handleError(error: any): void {
    console.log('pasando por handel error')
    console.log(error)
    if (error.status === 0)
      error.error.detail=error.message
    if (error.status === 500 ||error.status === 0 ) {
      if(error.error instanceof Object)
        throw new KnowError(error, this.comunicatorSvc)
      else
      throw new KnowErrorString(error, this.comunicatorSvc)
    } else {
      throw new UserErrors(error, this.comunicatorSvc)
    }
  }
}

abstract class CustomError extends Error {
  abstract statusCode: number;
  msj: Alert = {
    type: 'Error',
    showAlert: true,
    title: '',
    description: ''
  }

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}


class KnowError extends CustomError {
  statusCode = 500;
  constructor(error: any, private comunicatorSvc: ComunicatorComponetsService) {
    super(error.error.detail);
    this.name = 'KnowError';
    console.log('error server')
    this.msj.description = 'Error al procesar la solicitud: ' + error.error.detail
    this.comunicatorSvc.setInfoAlert(this.msj)
  }
}

class KnowErrorString extends CustomError {
  statusCode = 500;
  constructor(error: any, private comunicatorSvc: ComunicatorComponetsService) {
    super(error.error);
    this.name = 'KnowError';
    console.log('error server')
    this.msj.description = 'Error al procesar la solicitud: ' + error.error
    this.comunicatorSvc.setInfoAlert(this.msj)
  }
}


class UserErrors extends CustomError {
  statusCode = 1;
  constructor(error: any, private comunicatorSvc: ComunicatorComponetsService) {
    super(error);
    this.name = '';
    this.msj.description = error
    this.comunicatorSvc.setInfoAlert(this.msj)
  }
}



