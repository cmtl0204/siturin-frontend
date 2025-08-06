import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';

interface Causes {
  code: string;
  name: string;
}

@Component({
  selector: 'app-status3',
  imports: [FormsModule,
            ReactiveFormsModule,
            MultiSelectModule,
            ButtonModule,
            FileUpload,
            FileUploadModule,
            ToastModule,
            CommonModule],
  templateUrl: './status3.component.html',
  styleUrl: './status3.component.scss',
  providers: [MessageService]
})
export class Status3Component {

    /* causes!: Causes[]
    selectedCauses!: Causes[];

    uploadedFiles: any[] = [];

    private readonly formBuilder = inject(FormBuilder);
    protected form!: FormGroup;

    constructor(private messageService: MessageService){
        this.buildForm();
        this.causes= [
            { code: '1111', name: 'PRUEBA1', category: 'STATUS'},
            { code: '2222', name: 'PRUEBA2', category: 'STATUS'},
            { code: '3333', name: 'PRUEBA3', category: 'STATUS'},
            { code: '4444', name: 'PRUEBA4', category: 'STATUS'},
            { code: '5555', name: 'PRUEBA5', category: 'STATUS'}
        ];
    }

    buildForm() {
        this.form = this.formBuilder.group({
        causesOfNonCompliance: [null, [Validators.required]],
        });
    }

    onUpload(event:any) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }

    checkForm(){
        console.log(this.form.value)
    }

    get causesOfNonComplianceField(): AbstractControl {
        return this.form.controls['causesOfNonCompliance'];
    } */
    @Input() form!: FormGroup;
    uploadedFiles: any[] = [];

    constructor(private messageService: MessageService){
    }

    causes: Causes[] = [
        { code: '1111', name: 'PRUEBA1' },
        { code: '2222', name: 'PRUEBA2' },
        { code: '3333', name: 'PRUEBA3' },
    ];

    checkForm(){
        console.log(this.form.value)
    }

    onUpload(event:any) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }
}
