import { Router } from "@angular/router";
import { ComunicatorComponetsService } from "../services/comunicator/comunicator-componets.service";
import { AlertFunctions } from "./AlertFuntions";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class DinamicComponent extends AlertFunctions {
  option1: boolean = true
  option2: boolean = false
  title: string[] = [];

  constructor(protected override comunicatorSvc: ComunicatorComponetsService,
    protected router: Router) {
    super(comunicatorSvc);
  }

  setOptions(isOption1: boolean, isOption2: boolean) {
    this.option1 = isOption1;
    this.option2 = isOption2;
  }
  selectedClass(isActive: boolean) {
    return {
      'sub-option-active': isActive,
      'sub-option': !isActive
    };
  }
  setTitleAndIcon(indexRoute: number, icon: string) {
    setTimeout(() => {
      // Get the current route and extract the component title
      let currentRoute = this.router.url.split('/')[indexRoute]
      if (currentRoute) {
        currentRoute = currentRoute.split('?')[0];
        // Add the title icon to the array
        if (currentRoute.includes('actualizar'))
          this.title.push("fa fa-arrows-rotate")
        else
          this.title.push(icon);

        // Add the title to the array in uppercase format
        this.title.push(decodeURI(currentRoute).toUpperCase());

        // Set the title array in the observer for other components to access
        this.comunicatorSvc.setTitleComponent(this.title);
      }
    });
  }

  percentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && typeof(control.value)==='string') {
        const value = control.value.split('.');
        if (value.length > 2) {
          return { 'decimalPointExist': { error: true } };
        }
      }
      return null;
    };
  }
  equalsValidator(otherControl: AbstractControl, equalCamp: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const otherValue = otherControl.get(equalCamp)?.value;
      if (otherValue === value) {
        otherControl.get(equalCamp)?.setErrors(null);
        return null;
      } else {
        return { 'notEquals': { value, otherValue } };
      }
    };
  }

  entryValidate(event: any, hasDecimal: boolean) {
    let key;
    let regex;

    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain')
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key)
    }

    if (hasDecimal) {
      regex = /[0-9]|\./;
    } else {
      regex = /[0-9]/;
    }
    if (!regex.test(key) || ((key === '.') && event.target.value.includes('.'))) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault()
      }
    }
  }

}