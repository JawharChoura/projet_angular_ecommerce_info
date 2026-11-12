import {Component, OnInit} from '@angular/core';
import { MemberService } from '../../services/member.service';
import { MatTableDataSource } from '@angular/material/table';
import { Member } from '../../models/Member';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
})

export class MemberComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'cin', 'name', 'type', 'createdDate', 'actions'];
  
  constructor(private memberService: MemberService) { }
  
  ngOnInit() {
    this.memberService.GetAllMembers().subscribe(
      (data: Member[]) => {
        this.dataSource.data = data;
      },
      (error: any) => {
        console.error('Error fetching members:', error);
      }
    );
  }
  
  
}
