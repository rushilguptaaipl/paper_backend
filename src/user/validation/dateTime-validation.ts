import { BadRequestException, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsDateConstraint implements ValidatorConstraintInterface {
  async validate(date: any, args: ValidationArguments) {
    var regdate = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

    if(date){

      if (regdate.test(date)) {
        return true;
      } else {
        return false;
      }
    }else{
      return true;
    }
    
  }
}

export function DateFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateConstraint,
    });
  };
}



//*************** Time Format Validation *********************** */

@ValidatorConstraint({ async: true })
@Injectable()
export class IsTimeConstraint implements ValidatorConstraintInterface {
  async validate(session_time_slots: any, args: ValidationArguments) {

    var regTime = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    
    for (var i = 0; i < session_time_slots.length; i++) {

      if (!regTime.test(session_time_slots[i])) {

        return false;

      }
    }
    return true;
  }
}

export function TimeFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimeConstraint,
    });
  };
}