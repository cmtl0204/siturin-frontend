import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button} from 'primeng/button';
import { FileUpload} from 'primeng/fileupload';
import { Select } from 'primeng/select';
import { Toast} from 'primeng/toast';

interface Categories {
    id: string;
    code: string;
}

@Component({
  selector: 'app-status4',
  imports: [
            Button,
            FileUpload,
            Toast,
            CommonModule,
            Select,
            FormsModule,
            ReactiveFormsModule,
            FormsModule,
            ],
  templateUrl: './status4.component.html',
  styleUrl: './status4.component.scss',
  providers: [MessageService]
})
export class Status4Component {
/*
    private readonly formBuilder = inject(FormBuilder);
    protected form!: FormGroup;

    categories!: Categories[]
    selectedCategories!: Categories[];
    uploadedFiles: any;

    constructor(private messageService: MessageService){
        this.buildForm();
        this.categories= [
            { code: '1111', name: 'PRUEBA1'},
        ];

    }
    buildForm() {
        this.form = this.formBuilder.group({
        categorie: [null, [Validators.required]],
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

    get categorieField(): AbstractControl {
        return this.form.controls['categorie'];
    } */

    @Input() form!: FormGroup;
    uploadedFiles: any[] = [];
    categories!: Categories[]
    selectedCategories!: Categories[];


    constructor(private messageService: MessageService){
        this.categories= [
            { id: '68f4d30d-e6ba-4f41-97bf-7fd9072091a6', code: 'PRUEBA1'},
        ];

    }

    onUpload(event:any) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }
}
