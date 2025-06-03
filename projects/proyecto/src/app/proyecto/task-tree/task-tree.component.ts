import { Component, OnInit,Output,Input,EventEmitter, ViewChild, AfterViewInit  } from '@angular/core';
import { TaskTreeService } from './task-tree.service';
import { NodeClickEventArgs } from '@syncfusion/ej2-navigations';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { TaskFormService } from '../task-form/task-form.service';

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
  @Input() recargar: EventEmitter<void>; 
  
  CurrentNode:any;
  Proyectos: Object[];
  field:Object;

  constructor( 
    private taskTreeService:TaskTreeService,
    private taskFormService:TaskFormService
  ) { }

  ngOnInit() {
    this.loadAccounts();
    if (this.recargar) {
      this.recargar.subscribe(() => {
        //this.cargarDatosKanban();
        this.loadAccounts();
      });
    }
  }

  ngOnChanges(changes: any) {
    if(changes['Proyecto'] && changes['Proyecto']['currentValue']){
      const proyectoActualizado = changes['Proyecto']['currentValue'];
      if(proyectoActualizado['Id_Proyecto'] == this.CurrentNode){
        // Actualizar nodo existente
        this.updateExistingNode(this.CurrentNode, proyectoActualizado['Nombre']);
      }else{
        // Nuevo nodo como hijo
        let item = { id: proyectoActualizado['Id_Proyecto'], name: proyectoActualizado['Nombre'], subChild: [] };
        this.addNodeAsChildOfSelected(item);
      }
    }
  }
  addNodeAsChildOfSelected(item: any) {
    const selectedId = this.treeView.selectedNodes[0];
  
    if (selectedId) {
      // Busca el nodo seleccionado (padre)
      const findNode = (nodes: any[]): any => {
        for (let node of nodes) {
          if (node.id === selectedId) {
            return node;
          }
          if (node.subChild) {
            const found = findNode(node.subChild);
            if (found) return found;
          }
        }
        return null;
      };
  
      const parentNode = findNode(this.Proyectos);
      if (!parentNode) {
        console.warn("No se encontró el nodo seleccionado");
        return;
      }
  
      if (!parentNode.subChild) {
        parentNode.subChild = [];
      }
  
      parentNode.subChild.push(item);
    } else {
      // No hay nodo seleccionado: Insertar al primer nivel
      this.Proyectos.push(item);
    }
  
    // Actualización del TreeView
    (this.treeView.fields as any).dataSource = [...this.Proyectos];
    this.treeView.refresh();
    
  }
  
  updateExistingNode(nodeId: string, newName: string) {
    const updateNodeName = (nodes: any[]) => {
      if (!Array.isArray(nodes)) return false; // 🚨 Previene el error
      for (let node of nodes) {
        if (node.id === nodeId) {
          node.name = newName;
          return true;
        }
        if (node.subChild && updateNodeName(node.subChild)) {
          return true;
        }
      }
      return false;
    };
  
    if (updateNodeName(this.Proyectos)) {
      // Actualización correcta con type assertion
      (this.treeView.fields as any).dataSource = [...this.Proyectos];
      this.treeView.refresh();
    } else {
      console.warn("Nodo no encontrado");
    }
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

  }
   
  private clickTimeout: any;
  private lastClickTime: number = 0;
  private delay: number = 300; // Tiempo en ms para diferenciar clic simple y doble clic

  // Función que se ejecuta al hacer clic en un nodo
  nodeclicked(event: any): void {
    this.onDoubleClick(event);
    /*
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
    */
  }

 
    onDoubleClick(event: NodeClickEventArgs): void {
      /*
      const nodeElement = event.node;
      const nodeId = nodeElement.getAttribute("data-uid"); // Obtiene el ID del nodo
      this.CurrentNode = nodeId;
      this.nodoSeleccionadoEnTree.emit(nodeId);
      */
     const nodeData = this.treeView.getNode(event.node);
     this.CurrentNode = nodeData['id']; // <-- AHORA ESTO ES CORRECTO
     this.nodoSeleccionadoEnTree.emit(nodeData['id']);

    }

    onNodeDragStop(args: any): void {
      const draggedNodeId = args.draggedNodeData.id; // Nodo que se movió
      const droppedNodeId = args.droppedNodeData.id; // Nodo destino
      const dropPosition = args.dropLevel; // o usar args.dropIndex si querés ordenar Nivel jerárquico destino
      
      console.log(draggedNodeId);
      console.log(droppedNodeId);
      console.log(dropPosition);

      // ⚠️ Validación básica
      if (!draggedNodeId || !droppedNodeId || draggedNodeId === droppedNodeId) return;

      // 1. Buscar el nodo arrastrado y removerlo de su padre
      const draggedNode = this.removeNodeById(this.Proyectos, draggedNodeId);

      if (!draggedNode) {
        console.warn('Nodo arrastrado no encontrado.');
        return;
      }

      // 2. Insertar el nodo en el nuevo padre
      const newParent = this.findNodeById(this.Proyectos, droppedNodeId);
      if (newParent) {
        if (!newParent.subChild) newParent.subChild = [];
        newParent.subChild.push(draggedNode);
      }

      // 3. Refrescar TreeView
      (this.treeView.fields as any).dataSource = [...this.Proyectos];
      this.treeView.refresh();
      this.generarCodigoNuevo(draggedNodeId,droppedNodeId,dropPosition);
    }
    removeNodeById(nodes: any[], nodeId: string): any {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.id === nodeId) {
          nodes.splice(i, 1);
          return node;
        }
        if (node.subChild) {
          const found = this.removeNodeById(node.subChild, nodeId);
          if (found) return found;
        }
      }
      return null;
    }

    findNodeById(nodes: any[], nodeId: string): any {
      for (let node of nodes) {
        if (node.id === nodeId) return node;
        if (node.subChild) {
          const found = this.findNodeById(node.subChild, nodeId);
          if (found) return found;
        }
      }
      return null;
    }
    async generarCodigoNuevo(Origen,Destino,Nivel){
      let data = await this.taskFormService.getLastProyectId(Destino);
      let Codigo = data['data'][0]['Codigo'];
      let CantidadHijos = data['data'][0]['Cantidad_Subproyectos'];
      let NuevoCodigo = Codigo + '.' + (parseInt(CantidadHijos) + 1);
      await this.ActualizarCodigoProyecto(Origen,NuevoCodigo,Codigo,Nivel)
    }
    async ActualizarCodigoProyecto(Origen,Codigo,Padre,Nivel){
      await this.taskFormService.updateProyectCode(Origen,Codigo,Padre,Nivel);
    }
}
