import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../../interfaces/role.interface';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { RolesHttpService } from '../role-http.service';

@Component({
  selector: 'app-role-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    InputTextModule
  ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
  providers: [MessageService]
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  roleForm: FormGroup;
  displayModal = false;
  isEdit = false;
  selectedRole: Role | null = null;

  constructor(private fb: FormBuilder, private messageService: MessageService, private rolesService: RolesHttpService) {
    this.roleForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    // Llamada al servicio para obtener los roles desde el backend 
    // ** IMPORTANTE: ASEGURARSE DE QUE EL SERVICIO ESTÉ CON LA RUTA CORRECTA DESDE EL BACKEND **
    // this.rolesService.getAll().subscribe(roles => this.roles = roles);
    // datos estáticos para pruebas
    this.roles = [
      { code: 'ADMIN', name: 'Administrador' },
      { code: 'EXTERNAL', name: 'Usuario Externo' },
      { code: 'INTERNAL', name: 'Usuario Interno' },
      { code: 'GUEST', name: 'Invitado' }
    ];
  }

  openNew() {
    this.roleForm.reset();
    this.isEdit = false;
    this.displayModal = true;
    this.selectedRole = null;
  }

  openEdit(role: Role) {
    this.roleForm.patchValue(role);
    this.isEdit = true;
    this.displayModal = true;
    this.selectedRole = role;
  }

  saveRole() {
    if (this.roleForm.invalid) return;
    const role: Role = this.roleForm.value;
    if (this.isEdit && this.selectedRole) {
      this.rolesService.update(this.selectedRole.id!, role).subscribe(() => {
        this.loadRoles();
        this.messageService.add({severity:'success', summary:'Actualizado', detail:'Rol actualizado'});
        this.displayModal = false;
      });
    
    } else {
      // Crear
      this.rolesService.create(role).subscribe(() => {
        this.loadRoles();
        this.messageService.add({severity:'success', summary:'Creado', detail:'Rol creado'});
        this.displayModal = false;
      });
    }
    this.displayModal = false;
  }

  deleteRole(role: Role) {
    this.rolesService.delete(role.id!).subscribe(() => {
      this.loadRoles();
      this.messageService.add({severity:'success', summary:'Eliminado', detail:'Rol eliminado'});
    });
  }
}
