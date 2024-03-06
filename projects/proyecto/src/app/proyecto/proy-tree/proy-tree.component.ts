import { Component,OnInit,ViewChild,Input,Output,EventEmitter} from '@angular/core';
import { jqxTreeComponent } from 'jqwidgets-ng/jqxtree';
import { ProyTreeService } from './proy-tree.service';

@Component({ 
  selector: 'app-proy-tree',
  templateUrl: './proy-tree.component.html',
  styleUrl: './proy-tree.component.css'
})
export class ProyTreeComponent implements OnInit {
    @ViewChild('myTree', { static: false }) myTree: jqxTreeComponent;
    @Input() AddItem: EventEmitter<string>; 
    @Input() UpdateItem: EventEmitter<string>; 
    @Output() ItemSelection = new EventEmitter<any>();

    constructor(
        private proyTreeService:ProyTreeService
    ) { }

    data: any[] = [{
        Codigo: "",
        Nombre: "",
        Padre : "",
        rowid : ""
    }  
    ]
  // prepare the data
  source:any;
  dataAdapter: any;
  records:any;
  // create data adapter & perform Data Binding.
  
  searchField = ""
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  ngOnInit(): void {
    this.cargarProyectos();
    this.subscribeToParentEmitter();
    
  }
  subscribeToParentEmitter(): void { 
    this.AddItem.subscribe((data: any) => { 
      this.addItemToTree(data);
    }); 
    this.UpdateItem.subscribe((data: any) => { 
      this.updateItemTotree(data);
    }); 
  }
  addItemToTree(data){
    let selectedItem = this.myTree.getSelectedItem();

    if (selectedItem != null) {
        this.myTree.addTo({ label: data.Nombre,value:data.Id_Proyecto }, selectedItem.element);
        this.myTree.render();
        this.myTree.expandItem(selectedItem.element);
    }
  }
  updateItemTotree(data){
    let selectedItem = this.myTree.getSelectedItem();
    if (selectedItem != null) {
       this.myTree.updateItem({ label: data.Nombre,value:data.Id_Proyecto }, selectedItem.element)
    }

  }
  crearTree(){
    this.source = {
        datatype: 'json',
        datafields: [
            { name: 'Id_Proyecto' },
            { name: 'Codigo' },
            { name: 'Nombre' },
            { name: 'Padre' },
            { name: 'rowid' }
        ],
        id: 'Codigo',
        localdata: this.data
    };
    this.dataAdapter = new jqx.dataAdapter(this.source, { autoBind: true });
    // get the tree items. The first parameter is the item's id. The second parameter is the parent item's id. The 'items' parameter represents 
    // the sub items collection name. Each jqxTree item has a 'label' property, but in the JSON data, we have a 'text' field. The last parameter 
    // specifies the mapping between the 'text' and 'label' fields.  
    this.records = this.dataAdapter.getRecordsHierarchy('Codigo', 'Padre', 'items', [{ name: 'Nombre', map: 'label'},{name:'Id_Proyecto',map:'value'}]);


  }
  async cargarProyectos(){
    let data = await this.proyTreeService.cargarProyectos(this.paginacion,this.searchField);
    this.data = data['data'];
    this.crearTree();
}
  select(event){
    let selectedItem = this.myTree.getSelectedItem();
    this.ItemSelection.emit(selectedItem);
  }
  expandAll(){
    let selectedItem = this.myTree.getSelectedItem();
    if (selectedItem != null) {
        this.myTree.expandItem(selectedItem.element);
    }
  }
}
