import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TreeNode {
  name: string;
  children?: TreeNode[];
  expanded?: boolean;
  [key: string]: any;  // Cualquier propiedad adicional
}

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent {
  @Input() nodes: TreeNode[] = [];
  @Output() nodeDoubleClicked: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();  // Evento para emitir el nodo

  // Alternar expansión/colapso
  toggleNode(node: TreeNode): void {
    node.expanded = !node.expanded;
  }

  // Función que se dispara al hacer doble clic
  onNodeDoubleClick(node: TreeNode): void {
    this.nodeDoubleClicked.emit(node);  // Emitir el nodo con todos los datos
  }
}
