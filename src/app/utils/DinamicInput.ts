import { FormGroup } from "@angular/forms";
import { AlertFunctions } from "./AlertFuntions";
import { ComunicatorComponetsService } from "../services/comunicator/comunicator-componets.service";

export class DinamicInput extends AlertFunctions{

  elementHasFocus: boolean[] = [];
  positionLabel: boolean[] = [];
  form!: FormGroup
  input!: string
  constructor(protected override comunicatorSvc: ComunicatorComponetsService){
    super(comunicatorSvc)
  }

  isFocused(index: number, form: FormGroup, input: string) {
    this.form=form
    this.input=input
    this.elementHasFocus[index] = !this.elementHasFocus[index];
    this.positionLabel[index] = form.get(input)?.value
      ? false : true

  }
  
/**
 * This function generates styles for label animation based on form input
 * @param form - The form group from which to get input values
 * @param input - The input field to get values from
 * @returns Object containing CSS properties for label animation
 */
animationLabel(form: FormGroup, input: string,) {
    type property={[key:string]:string}
    const styles:property={    };
    if (form.get(input)?.value || input === 'select') {
      styles["top"]= "0"; // Move label to the top
      styles["font-size"]= "1rem"; // Set font size to 1rem
    
    } 
    if ((form.get(input)?.dirty || form.get(input)?.touched)&&form.get(input)?.errors) {
        if (form.get(input)?.errors) {
          styles["color"]="red"; // Set label color to red
          
        } else {
          styles["color"]= "#009688"; // Set label color to green
          
        }
    }
    return styles;
  }
  
  styleForeground(form: FormGroup, input: string,) {
    let styles!: object;

    if (form.get(input)?.dirty || form.get(input)?.touched) {
      if (form.get(input)?.errors) {
        styles = {
          "color": "red"
        }
      } 
    }
    return styles;
  }
  verifyStyleInput(form: FormGroup, input: string){
    let verify:Boolean=true;
    if (form.get(input)?.dirty || form.get(input)?.touched) {
      if (form.get(input)?.errors) {
        verify=false;
      }else{
        verify=true;
      } 
    }
    return verify;
  }
  
 
}