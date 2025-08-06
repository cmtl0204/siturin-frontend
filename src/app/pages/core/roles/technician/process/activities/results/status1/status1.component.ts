import { Component, Input} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}


@Component({
  selector: 'app-status1',
  imports: [FormsModule,
            ReactiveFormsModule,
            ButtonModule,
            FileUpload,
            FileUploadModule,
            ToastModule,
            CommonModule],
  templateUrl: './status1.component.html',
  styleUrl: './status1.component.scss',
  providers: [MessageService]
})

export class Status1Component {
    @Input() form!: FormGroup;
    uploadedFiles: any[] = [];


    constructor(private messageService: MessageService) {}

    onUpload(event:any) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }
}
