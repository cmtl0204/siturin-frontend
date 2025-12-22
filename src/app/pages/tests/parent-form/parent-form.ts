import { Component } from '@angular/core';
import { ChildrenListFormComponent } from '@/pages/tests/children-list-form/children-list-form.component';
import { FromChildList } from '../from-child-list/from-child-list';
import { StarForm } from '../star-form/star-form';
import { HomeForm } from '../home-form/home-form';
import { CandyListForm } from '../candy-list-form/candy-list-form';

@Component({
    selector: 'app-parent-form',
    imports: [ChildrenListFormComponent, FromChildList, StarForm, HomeForm, CandyListForm],
    templateUrl: './parent-form.html',
    styleUrl: './parent-form.scss'
})
export class ParentForm {}
