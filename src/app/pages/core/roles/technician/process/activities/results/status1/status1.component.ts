import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InspectionStatusService } from '@/pages/core/roles/technician/process/services/inspection-status.service';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
    selector: 'app-status1',
    imports: [FormsModule, ReactiveFormsModule, ButtonModule, FileUpload, FileUploadModule, ToastModule, CommonModule],
    templateUrl: './status1.component.html',
    styleUrl: './status1.component.scss',
    providers: [MessageService]
})
export class Status1Component {
    @Input() processId!: string;
    @Input() stateId!: string;

    private inspectionStatusService = inject(InspectionStatusService);
    protected form!: FormGroup;

    uploadedFiles: any[] = [];

    constructor() {}

    onUpload(event: any) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
    }

    createState() {
        this.inspectionStatusService.createRatifiedInspectionState(this.form.value).subscribe({
            next: (res) => {}
        });
    }
}
