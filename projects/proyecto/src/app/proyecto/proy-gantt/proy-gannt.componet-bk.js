import { Component, OnInit,Input,ViewChild,ElementRef  } from '@angular/core';
import { ProyGanttService } from './proy-gantt.service';
import { Output, EventEmitter } from '@angular/core';
import { GanttItem,GanttToolbarOptions,GanttViewType,GanttBarClickEvent,GanttDragEvent } from '@worktile/gantt';
import {DayPilot, DayPilotSchedulerComponent} from "daypilot-pro-angular";


@Component({
  selector: 'app-proy-gantt',
  templateUrl: './proy-gantt.component.html',
  styleUrls: ['./proy-gantt.component.css']
})
export class ProyGanttComponent implements OnInit {
  @Input() ItemSelected: EventEmitter<string>; 
  @Input() TabSelected: EventEmitter<string>; 
  @Output() SeleccionarItem = new EventEmitter<any>();



  constructor(
    private proyGanttService:ProyGanttService
  ) { }
 
  dp = new DayPilot.Scheduler("dp", {
    startDate: "2024-09-01",
    days: 365,
    scale: "Day",
    timeHeaders: [
        {groupBy: "Month", format: "MMMM yyyy"},
        {groupBy: "Day", format: "d"}
    ],
    treeEnabled: true,
    treePreventParentUsage: true,
    heightSpec: "Max",
    height: 900,
    eventMovingStartEndEnabled: true,
    eventResizingStartEndEnabled: true,
    timeRangeSelectingStartEndEnabled: true,
    contextMenu: new DayPilot.Menu({
        items: [
            {
                text: "Edit",
                onClick: (args) => {
                    this.dp.events.edit(args.source);
                }
            },
            {
                text: "Delete",
                onClick: (args) => {
                    this.dp.events.remove(args.source);
                }
            },
            {text: "-"},
            {
                text: "Select",
                onClick: (args) => {
                    this.dp.multiselect.add(args.source);
                }
            },
        ]
    }),
    bubble: new DayPilot.Bubble({
        onLoad: (args) => {
            const e = args.source;
            const text = DayPilot.Util.escapeHtml(e.text());
            const start = e.start().toString("M/d/yyyy h:mm tt");
            const end = e.end().toString("M/d/yyyy h:mm tt");
            args.html = `<div><b>${text}</b></div><div>Start: ${start}</div><div>End: ${end}</div>`;
        }
    }),
    onEventMoved: (args) => {
      console.log(args)  
      const text = args.e.text();
        this.dp.message(`The event has been moved (${text})`);
    },
    onEventMoving: (args) => {
        // see more examples at https://doc.daypilot.org/scheduler/event-moving-customization/
        if (args.e.resource() === "A" && args.resource === "B") {  // don't allow moving from A to B
            args.left.enabled = false;
            args.right.html = "You can't move an event from Room 1 to Room 2";

            args.allowed = false;
        }
        else if (args.resource === "B") {  // must start on a working day, maximum length one day
            while (args.start.getDayOfWeek() === 0 || args.start.getDayOfWeek() === 6) {
                args.start = args.start.addDays(1);
            }
            args.end = args.start.addDays(1);  // fixed duration
            args.left.enabled = false;
            args.right.html = "Events in Room 2 must start on a workday and are limited to 1 day.";
        }
    },
    onEventResized: (args) => {
        this.dp.message("Resized: " + args.e.text());
    },
    onTimeRangeSelected: async (args) => {
        const modal = await DayPilot.Modal.prompt("New event name:", "New Event")
        this.dp.clearSelection();
        if (modal.canceled) {
            return;
        }
        const name = modal.result;
        this.dp.events.add({
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            resource: args.resource,
            text: name
        });
        this.dp.message("Created");
    },
    onEventMove: (args) => {
        if (args.ctrl) {
            this.dp.events.add({
                start: args.newStart,
                end: args.newEnd,
                text: "Copy of " + args.e.text(),
                resource: args.newResource,
                id: DayPilot.guid()  // generate random id
            });

            // notify the server about the action here
            args.preventDefault(); // prevent the default action - moving event to the new location
        }
    },
    onEventClick: (args) => {
        DayPilot.Modal.alert(args.e.data.text);
    },
    separators: [
      {location: new DayPilot.Date("2024-09-01"), color: "red"},
    ],
});

barColor(i) {
  const colors = ["#3c78d8", "#6aa84f", "#f1c232", "#cc0000"];
  return colors[i % 4];
}
barBackColor(i) {
  const colors = ["#a4c2f4", "#b6d7a8", "#ffe599", "#ea9999"];
  return colors[i % 4];
}

loadData() {
  const resources = [
    {
      name: "Jaime", id: "1"
    },
    /*
      {
          name: "Locations", id: "G1", expanded: true, children: [
              {name: "Room 1", id: "A"},
              {name: "Room 2", id: "B"},
              {name: "Room 3", id: "C"},
              {name: "Room 4", id: "D"},
          ]
      },
      {
          name: "People", id: "G2", expanded: true, children: [
              {name: "Person 1", id: "E"},
              {name: "Person 2", id: "F"},
              {name: "Person 3", id: "G"},
              {name: "Person 4", id: "H"}
          ]
      },
      {
          name: "Tools", id: "G3", expanded: true, children: [
              {name: "Tool 1", id: "I"},
              {name: "Tool 2", id: "J"},
              {name: "Tool 3", id: "K"},
              {name: "Tool 4", id: "L"}
          ]
      },
      {
          name: "Other Resources", id: "G4", expanded: true, children: [
              {name: "Resource 1", id: "R1"},
              {name: "Resource 2", id: "R2"},
              {name: "Resource 3", id: "R3"},
              {name: "Resource 4", id: "R4"}
          ]
      },
      */
  ];

  const events = [];
  for (let i = 0; i < 12; i++) {
      const duration = Math.floor(Math.random() * 6) + 1; // 1 to 6
      const durationDays = Math.floor(Math.random() * 6) + 1; // 1 to 6
      const start = Math.floor(Math.random() * 6) + 2; // 2 to 7

      const e = {
          start: new DayPilot.Date("2024-09-05T12:00:00").addDays(start),
          end: new DayPilot.Date("2024-09-05T12:00:00").addDays(start).addDays(durationDays).addHours(duration),
          id: i + 1,
          resource: '1',//String.fromCharCode(65 + i),
          text: "Event " + (i + 1),
          // bubbleHtml: "Event " + (i + 1),
          barColor: this.barColor(i),
          barBackColor: this.barBackColor(i),
      };
      
      events.push(e);
  }
  console.log(events);
  this.dp.update({resources, events});
}



  toolbarOptions: GanttToolbarOptions = {
    viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
  };
  options = {
      viewType: GanttViewType.day
  };

  items: GanttItem[] = [
    { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197,itemDraggable: true, expandable: true },
    { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, itemDraggable: true, links: ['000003', '000004', '000000'], expandable: true },
    { id: '000002', title: 'Task 2', start: 1610536397, end: 1610622797, itemDraggable: true, },
    { id: '000003', title: 'Task 3', start: 1628507597, end: 1633345997,itemDraggable: true, expandable: true },
    { id: '000004', title: 'Task 4', start: 1624705997,itemDraggable: true, expandable: true },
    { id: '000005', title: 'Task 5', start: 1628075597, end: 1629544397,itemDraggable: true, color: '#709dc1' },
    { id: '000006', title: 'Task 6', start: 1641121997, end: 1645528397,itemDraggable: true, },
    { id: '000007', title: 'Task 7', start: 1639393997, end: 1640862797,itemDraggable: true, },
    { id: '000008', title: 'Task 8', end: 1628783999, color: '#709dc1' },
    { id: '000009', title: 'Task 9', start: 1639307597, end: 1640344397 },
    { id: '0000010', title: 'Task 10', start: 1609067597, end: 1617275597 },
    { id: '0000011', title: 'Task 11', start: 1611918797, end: 1611918797 },
    { id: '0000012', title: 'Task 12', start: 1627816397, end: 1631358797 },
    { id: '0000013', title: 'Task 13', start: 1625051597, end: 1630667597, links: ['0000012'] },
    { id: '0000014', title: 'Task 14', start: 1627920000, end: 1629129599 },
    { id: '0000015', title: 'Task 15', start: 1633259597, end: 1639480397 },
    { id: '0000016', title: 'Task 16', start: 1624965197, end: 1627211597 },
    { id: '0000017', title: 'Task 17', start: 1641035597, end: 1649157197 },
    { id: '0000018', title: 'Task 18', start: 1637061197, end: 1642677197 },
    { id: '0000019', title: 'Task 19', start: 1637925197, end: 1646305997 },
    { id: '0000020', title: 'Task 20', start: 1628334797, end: 1629889997 },
    { id: '0000021', title: 'Task 21', start: 1622891597, end: 1627643597 },
    { id: '0000022', title: 'Task 22', start: 1616238797, end: 1620731597 },
    { id: '0000023', title: 'Task 23', start: 1626693197, end: 1630149197 },
    { id: '0000024', title: 'Task 24', start: 1626174797, end: 1626952397 },
    { id: '0000025', title: 'Task 25', start: 1631013197, end: 1637493197 },
    { id: '0000026', title: 'Task 26', start: 1635937997, end: 1643886797 },
    { id: '0000027', title: 'Task 27', start: 1637665997, end: 1644059597 },
    { id: '0000028', title: 'Task 28', start: 1611400397, end: 1615547597 },
    { id: '0000029', title: 'Task 29', start: 1618053197, end: 1619176397 }
];

  viewOptions = {
    showWeekend: true
};

  Task_Id = '';
  Tab_Id = '';
  Tareas = [];
 
  //gantt: any;

 
  ngOnInit() {
    this.dp.init();
    this.loadData();
    this.dp.scrollTo("2024-09-01");
    this.subscribeToParentEmitter();
  }
  barClick(event: GanttBarClickEvent) {
    alert (event.item.title);
  }
  dragMoved(event: GanttDragEvent) {}
  dragEnded(e){
    console.log(e)
  }
  dobleClick(e){
    console.log(e);
  }
  lineClick(e){};
  
  subscribeToParentEmitter(): void { 
    this.ItemSelected.subscribe((data: any) => { 
      this.Task_Id = data;
      this.leerTareas();
    }); 
    this.TabSelected.subscribe((data: any) => { 
        this.Tab_Id = data;
        this.leerTareas();
    });
  } 


  async leerTareas(){
    if(this.Tab_Id == '4'){
      let data = await this.proyGanttService.leerItems(this.Task_Id);
      this.Tareas = data['data'];
     
    }
  }
  SelItem(Item){
    this.SeleccionarItem.emit(Item);
  }
}



/** */


/*
  dp = new DayPilot.Scheduler("dp", {
    startDate: "2024-03-01",
    days: 31,
    scale: "Day",
    timeHeaders: [
        {groupBy: "Month", format: "MMMM yyyy"},
        {groupBy: "Day", format: "d"}
    ],
    //treeEnabled: true,
    //treePreventParentUsage: true,
    //heightSpec: "Max",
    height: 900,
    eventMovingStartEndEnabled: true,
    eventResizingStartEndEnabled: true,
    timeRangeSelectingStartEndEnabled: true,
    onEventMoved: (args) => {
      console.log(args)  
      const text = args.e.text();
      //this.dp.message(`The event has been moved (${text})`);
    },
    onEventMoving: (args) => {
        // see more examples at https://doc.daypilot.org/scheduler/event-moving-customization/
        if (args.e.resource() === "A" && args.resource === "B") {  // don't allow moving from A to B
            args.left.enabled = false;
            args.right.html = "You can't move an event from Room 1 to Room 2";

            args.allowed = false;
        }
        else if (args.resource === "B") {  // must start on a working day, maximum length one day
            while (args.start.getDayOfWeek() === 0 || args.start.getDayOfWeek() === 6) {
                args.start = args.start.addDays(1);
            }
            args.end = args.start.addDays(1);  // fixed duration
            args.left.enabled = false;
            args.right.html = "Events in Room 2 must start on a workday and are limited to 1 day.";
        }
    },
    onEventResized: (args) => {
        //this.dp.message("Resized: " + args.e.text());
    },
    
    onEventMove: (args) => {
        if (args.ctrl) {
            this.dp.events.add({
                start: args.newStart,
                end: args.newEnd,
                text: "Copy of " + args.e.text(),
                resource: args.newResource,
                id: DayPilot.guid()  // generate random id
            });

            // notify the server about the action here
            args.preventDefault(); // prevent the default action - moving event to the new location
        }
    },
    onEventClick: (args) => {
        DayPilot.Modal.alert(args.e.data.text);
    },
    separators: [
      {location: new DayPilot.Date("2024-09-01"), color: "red"},
    ],
});
*/

  
barColor(i) {
  const colors = ["#3c78d8", "#6aa84f", "#f1c232", "#cc0000"];
  return colors[i % 4];
}
barBackColor(i) {
  const colors = ["#a4c2f4", "#b6d7a8", "#ffe599", "#ea9999"];
  return colors[i % 4];
}

async loadData() {
  await this.LeerMiembros();
  const resources = this.Miembros;
  const events = [];
  
  for(let i = 0;i < this.Tareas.length; i++){
    const e = {
      start:new DayPilot.Date(this.Tareas[i]['start']),
      end:new DayPilot.Date(this.Tareas[i]['end']),
      id:this.Tareas[i]['Id'],
      resource:'30983,28267',
      text:this.Tareas[i]['Descripcion']
    }
    /*
    for(let y=0;y<this.Tareas[i]['Miembros'].length;y++){
      e.resource = this.Tareas[i]['Miembros'][y]['Id_Persona'];
    }*/
    events.push(e);
  }

  this.dp.update({resources, events});
}
 