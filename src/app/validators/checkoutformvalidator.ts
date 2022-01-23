import { FormControl, ValidationErrors } from "@angular/forms";

export class Checkoutformvalidator {
    
    // This is white space validator

    static whiteSpaceValidator(control: FormControl): ValidationErrors {

        if((control.value!=null) && (control.value.trim().length===0)){
            return {'whiteSpaceOnly':true};
        }
       else {
           return null;
       }
        
    }

}
