import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';

interface Categories {
    id: string;
    code: string;
}

interface Classifications {
    id: string;
    code: string;
}

@Component({
    selector: 'app-status5',
    imports: [FormsModule, ReactiveFormsModule, FormsModule, Button, FileUpload, Toast, CommonModule, Select],
    templateUrl: './status5.component.html',
    styleUrl: './status5.component.scss',
    providers: [MessageService]
})
export class Status5Component {
    /*     private readonly formBuilder = inject(FormBuilder);
    protected form!: FormGroup;

    categories!: Categories[]
    selectedCategories!: Categories[];
    classifications!: Classifications[]
    selectedClassifications!: Classifications[];

    uploadedFiles: any;

    constructor(private messageService: MessageService){
        this.buildForm();
        this.classifications= [
            { code: '1111', name: 'Clasificaiones1'},
            { code: '2222', name: 'Clasificaiones2'},
            { code: '3333', name: 'Clasificaiones3'},
            { code: '4444', name: 'Clasificaiones4'},
            { code: '5555', name: 'Clasificaiones5'},
        ];
        this.categories= [
            { code: '1111', name: 'PRUEBA1'},
        ];
    }

    buildForm() {
        this.form = this.formBuilder.group({
            classification: [null, [Validators.required]],
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

    get classificationField(): AbstractControl {
        return this.form.controls['classification'];
    }
    get categorieField(): AbstractControl {
        return this.form.controls['categorie'];
    } */

    @Input() form!: FormGroup;
    uploadedFiles: any[] = [];
    categories!: Categories[];
    selectedCategories!: Categories[];
    classifications!: Classifications[];
    selectedClassifications!: Classifications[];

    constructor(private messageService: MessageService) {
        this.classifications = [
            { id: '0bae70ba-b76b-4de3-a9b8-a5f1eef6d1a4', code: 'Clasificaiones1' },
            { id: '0bae70ba-b76b-4de3-a9b8-a5f1eef6d1a4', code: 'Clasificaiones2' },
            { id: '0bae70ba-b76b-4de3-a9b8-a5f1eef6d1a4', code: 'Clasificaiones3' },
            { id: '0bae70ba-b76b-4de3-a9b8-a5f1eef6d1a4', code: 'Clasificaiones4' },
            { id: '0bae70ba-b76b-4de3-a9b8-a5f1eef6d1a4', code: 'Clasificaiones5' }
        ];
        this.categories = [{ id: '68f4d30d-e6ba-4f41-97bf-7fd9072091a6', code: 'PRUEBA1' }];
    }

    onUpload(event: any) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
    }
}
