import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './select/select.component';
import { TableComponent } from './table/table.component';
import { TableFilterPipeModule } from '../pipes/table-filter.pipe.module';



@NgModule({
  declarations: [
    InputComponent,
    SelectComponent,
    TableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableFilterPipeModule
  ],
  exports:[
    InputComponent,
    SelectComponent,
    TableComponent,
  ],
  
})
export class UtilsComponentsModule { }
