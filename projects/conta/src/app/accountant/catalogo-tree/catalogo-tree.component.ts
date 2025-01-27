import {Component,OnInit} from '@angular/core';
import { TreeNode } from '../tree-view/tree-view.component';
import { CatalogoContableService } from '../catalogo-contable/catalogo-contable.service';
import { CentroCostoService } from '../centro-costo/centro-costo.service';
import Swal from 'sweetalert2';

// Definir la estructura de Cuenta
interface Cuenta {
  Id_Cuenta_Contable: string;
  Cuenta: string;
  Padre: string;
  Descripcion: string;
  Mayor: string;
  Deudora: string;
  Estado: string;
  Centro_Costo: string;
  D151: string;
  Balance: string;
  Moneda: string;
  NombrePadre: string;
  id: string;
}


@Component({
  selector: 'app-catalogo-tree',
  templateUrl: './catalogo-tree.component.html',
  styleUrls: ['./catalogo-tree.component.css']
})

export class CatalogoTreeComponent implements OnInit {
  treeData: TreeNode[];
  /*
  = [
    {
      name: 'Root 1',
      expanded: false,
      children: [
        { name: 'Child 1', expanded: false },
        { name: 'Child 2', expanded: false, children: [
          { name: 'Grandchild 1', expanded: false },
          { name: 'Grandchild 2', expanded: false }
        ]}
      ]
    },
    {
      name: 'Root 2',
      expanded: false,
      children: [
        { name: 'Child 3', expanded: false },
        { name: 'Child 4', expanded: false }
      ]
    }
  ];*/
 
  constructor(
    private catalogoContableService:CatalogoContableService,
    private centroCostoService:CentroCostoService
  ) { }

  PantallaCuentasPadres = false;
  Old_Cuenta = '';
  searchField = "";
  searchFieldPadres = "";

  Cuentas = [];
  Padres = [];
  Centros = [];

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  Cuenta = {
    Id_Cuenta_Contable:'',
    Cuenta:'',
    Padre:'',
    Descripcion:'',
    Mayor:'0',
    Deudora:'0',
    Estado:'1',
    Centro_Costo:'0',
    D151:'0',
    Balance:'1',
    Moneda:'0',
    NombrePadre:'',
    id:''
  }

  ngOnInit() {
    this.loadAccounts();
    this.loadCentros();
  }
  async loadAccounts(search?:any){
    let data = await this.catalogoContableService.loadCatalogo();
    if(data['total'] == 0){
      this.treeData = [];
    }else{
      this.treeData = data['data'];
    }
  }
  async loadCentros(search?:any){
    let data = await this.centroCostoService.loadCentros(this.paginacion,'',1);
    if(data['total'] == 0){
      this.Centros = [];
    }else{
      this.Centros = data['data'];
    }
  }
  async loadParents(search?:any){
    let data = await this.catalogoContableService.loadParents(this.paginacion,search);
    if(data['total'] == 0){
      this.Padres = [];
    }else{
      this.Padres = data['data'];
    }
  }
  openCuentasPanel(){
    this.loadParents();
    this.PantallaCuentasPadres = true;
  }

  nuevo(){
    const nodoEncontrado =this.findNodeByCuenta(this.treeData, this.Cuenta.Cuenta);
    console.log(nodoEncontrado.children.length);
    let nuevaCuenta = this.Cuenta.Cuenta + (nodoEncontrado.children.length + 1).toString();
    let Padre = this.Cuenta.Cuenta;
    this.Cuenta = {
      Id_Cuenta_Contable:'',
      Cuenta:'',
      Padre:'',
      Descripcion:'',
      Mayor:'1',
      Deudora:'0',
      Estado:'1',
      Centro_Costo:'999',
      D151:'0',
      Balance:'1',
      Moneda:'0',
      NombrePadre:'',
      id:''
    }
    this.Cuenta.Cuenta = nuevaCuenta;
    this.Cuenta.Padre = Padre;
    this.loadAccountName(this.Cuenta.Padre);
  }
  async grabar(){
    if(this.Cuenta.Cuenta == ""){
      Swal.fire('Favor suministrar el código de la cuenta');
      return false;
    }
    if(this.Cuenta.Descripcion == ""){
      Swal.fire('Favor suministrar el nombre de la cuenta');
      return false;
    }
    //Verificar si cambio el número de cuenta.
    if(this.Cuenta.Cuenta != this.Old_Cuenta){
      if(this.Old_Cuenta !=''){
        //El Número de cuenta actual es diferente a la cuenta Anterior.
        let data = await this.catalogoContableService.LeerCuentasUsadas(this.Old_Cuenta);
        if(data['total'] != 0){
          Swal.fire("La cuenta ya ha utilizada en asintos, no puede cambiar el número");
          this.Cuenta.Cuenta = this.Old_Cuenta
          return false;
        }
      }
    }
    let data = await this.catalogoContableService.saveAccount(this.Cuenta);
    if(data['success'] =='true'){
      Swal.fire('Cuenta grabada correctamente');
      // Validar si hay que actualizar los hijos
      if(this.Old_Cuenta !=''){
        if(this.Cuenta.Cuenta != this.Old_Cuenta){
            await this.catalogoContableService.ActualizarHIjos(this.Old_Cuenta,this.Cuenta.Cuenta);
        }
      }else{
        this.loadAccounts();
      }
    }
    return true;
  }
  async onNodeDoubleClick(node: TreeNode) {
    const nodeData = await this.convertNodeToObject(node);
    // Asignar propiedades específicas al objeto Cuenta
    this.Cuenta = {
      Id_Cuenta_Contable: nodeData['Id_Cuenta_Contable'],
      Cuenta: nodeData['Cuenta'],
      Padre: nodeData['Padre'],
      Descripcion: nodeData['Descripcion'],
      Mayor: nodeData['Mayor'],
      Deudora: nodeData['Deudora'],
      Estado: nodeData['Estado'],
      Centro_Costo: nodeData['Centro_Costo'],
      D151: nodeData['D151'],
      Balance: nodeData['Balance'],
      Moneda: nodeData['Moneda'],
      NombrePadre: nodeData['NombrePadre'],
      id: nodeData['id']
    };
    if (!this.Cuenta.D151) {
      this.Cuenta.D151 = '0'
    }
    if (!this.Cuenta.Centro_Costo) {
      this.Cuenta.Centro_Costo = '999'
    }
    this.loadAccountName(this.Cuenta.Padre);
  }
  // Función para convertir el nodo en un objeto de clave-valor
  // Función para convertir el nodo a un objeto de clave-valor
  convertNodeToObject(node: TreeNode): { [key: string]: any } {
    let result: { [key: string]: any } = {};

    // Iterar por todas las propiedades del nodo y agregarlas al objeto resultante
    for (let key of Object.keys(node)) {
      if (key !== 'children') {
        result[key] = node[key];  // Guardar la propiedad tal cual
      } else if (node[key]) {
        result[key] = node[key].map(child => this.convertNodeToObject(child));  // Convertir recursivamente los hijos
      }
    }
    return result;
  }


  searchPadres(){
    this.loadParents(this.searchFieldPadres)
  }
  keytabPadres(event){
    if (event.key === 'Enter') {
      this.searchPadres();
    }
  }
  SeleccionarPadre(padre){
    this.Cuenta.Padre = padre.Cuenta;
    this.Cuenta.NombrePadre = padre.Cuenta + '-' + padre.Descripcion;
    this.loadAccountName(padre.Cuenta);
    this.closePantallaPadres();
  }
  closePantallaPadres(){
    this.PantallaCuentasPadres = false;
  }
  cuentaPrincipal(){
    this.Cuenta.Padre = '';
    this.Cuenta.NombrePadre = ''
    this.closePantallaPadres();
  }
  async loadAccountName(Id_Cuenta_Contable){
    if(!Id_Cuenta_Contable){
      this.Cuenta.NombrePadre = 'Cuenta Principal';
      return true;
    }
    let data = await this.catalogoContableService.loadAccountFromCode(Id_Cuenta_Contable);
    if(data['total'] == 0){
      this.Cuenta.NombrePadre = 'Cuenta Principal';
    }else{
      this.Cuenta.NombrePadre = data['data'][0]['Cuenta'] + '-' + data['data'][0]['Descripcion'];
    }
    return true;
  }


  findNodeByCuenta(nodes: TreeNode[], cuenta: string): TreeNode | null {
    for (let node of nodes) {
      // Si encontramos el nodo con la cuenta que buscamos, lo retornamos
      if (node['Cuenta'] === cuenta) {
        return node;
      }
  
      // Si el nodo tiene hijos, hacemos una llamada recursiva para buscar en ellos
      if (node.children) {
        const foundInChildren = this.findNodeByCuenta(node.children, cuenta);
        if (foundInChildren) {
          return foundInChildren;  // Si encontramos en los hijos, lo retornamos
        }
      }
    }
  
    // Si no encontramos el nodo, retornamos null
    return null;
  }
}