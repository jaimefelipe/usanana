import { Component, OnInit,Output,Input,EventEmitter, ViewChild, AfterViewInit  } from '@angular/core';
import { TaskTreeService } from './task-tree.service';
import { NodeClickEventArgs } from '@syncfusion/ej2-navigations';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-task-tree',
  templateUrl: './task-tree.component.html',
  styleUrls: ['./task-tree.component.css']
})
export class TaskTreeComponent implements OnInit {
  @ViewChild('treeview', { static: false }) treeView!: TreeViewComponent;
  @Output() nodoSeleccionadoEnTree = new EventEmitter<any>();
  @Input() Proyecto: any;
  ItemSelected = new EventEmitter<any>();
  
  CurrentNode:any;
  Proyectos: Object[];
  field:Object;

  constructor( 
    private taskTreeService:TaskTreeService
  ) { }

  ngOnInit() {
    this.loadAccounts();
    
  }

  ngOnChanges(changes: any) {
    if(changes['Proyecto']['currentValue']){
      if(changes['Proyecto']['currentValue']['Id_Proyecto'] == this.CurrentNode){
        this.treeView.allowEditing = true;
        this.treeView.updateNode(this.CurrentNode, changes['Proyecto']['currentValue']['Nombre']);
        this.treeView.allowEditing = false;
      }else{
        let item: { [key: string]: Object } = { id: changes['Proyecto']['currentValue']['Id_Proyecto'], name: changes['Proyecto']['currentValue']['Nombre'] };
        this.addNodeBelowSelected([item])
      }
    }
  }

  addNodeBelowSelected(item: any) {
    const selectedId = this.treeView.selectedNodes[0]; // ID del nodo seleccionado
    if (!selectedId) {
      console.warn("No hay un nodo seleccionado");
      return;
    }
  
    // Buscar el nodo en la estructura de datos
    const findNodeAndParent = (nodes: any[], parent: any = null): any => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === selectedId) {
          return { node: nodes[i], index: i, parent };
        }
        if (nodes[i].children) {
          const result = findNodeAndParent(nodes[i].children, nodes[i]);
          if (result) return result;
        }
      }
      return null;
    };
  
    const result = findNodeAndParent(this.Proyectos);
    if (!result) {
      console.warn("No se encontró el nodo seleccionado");
      return;
    }
  
    const { node: selectedNode, index, parent } = result;
    const siblings = parent ? parent.children : this.Proyectos; // Si tiene padre, usa sus hijos
  
    siblings.splice(index + 1, 0, item); // Inserta después del nodo seleccionado
  
    this.treeView.refresh(); // Refresca la vista si es necesario
  }

  async loadAccounts(search?: any) {
    let data = await this.taskTreeService.loadProyectos();
    
    if (data['total'] == 0) {
      this.Proyectos = [];
    } else {
      this.Proyectos = data['data'];
    }

    this.field = { 
      dataSource: this.Proyectos, 
      id: 'id', 
      text: 'name', 
      child: 'subChild' 
    };

    // Asegurar que el TreeView ya está inicializado antes de expandir
    setTimeout(() => {
      if (this.treeView) {
        this.treeView.expandAll();
      }
    }, 100);
  }
   
  private clickTimeout: any;
  private lastClickTime: number = 0;
  private delay: number = 300; // Tiempo en ms para diferenciar clic simple y doble clic

  // Función que se ejecuta al hacer clic en un nodo
  nodeclicked(event: any): void {
    
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - this.lastClickTime;
    
    if (timeDiff < this.delay) {
      // Es un doble clic
      clearTimeout(this.clickTimeout);
      this.onDoubleClick(event);
    } else {
      // Es un clic simple, pero esperamos para confirmarlo
      this.clickTimeout = setTimeout(() => {
        //this.onSingleClick(event);
      }, this.delay);
    }

    this.lastClickTime = currentTime;
  }

 
    onDoubleClick(event: NodeClickEventArgs): void {
      const nodeElement = event.node;
      const nodeId = nodeElement.getAttribute("data-uid"); // Obtiene el ID del nodo
      this.CurrentNode = nodeId;
      

      this.nodoSeleccionadoEnTree.emit(nodeId);
      

    }

}
