import { CatalogoContableService } from '../catalogo-contable/catalogo-contable.service';
import { CentroCostoService } from '../centro-costo/centro-costo.service';
import { Component, OnInit,ViewChild } from '@angular/core';
import { ITreeOptions,TreeComponent,TreeNode } from '@circlon/angular-tree-component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo-tree',
  templateUrl: './catalogo-tree.component.html',
  styleUrls: ['./catalogo-tree.component.css']
})
export class CatalogoTreeComponent implements OnInit {
  @ViewChild('tree') tree: TreeComponent;
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
      this.Cuentas = [];
    }else{
      this.Cuentas = data['data'];
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

  options: ITreeOptions = {
    displayField: 'name',
    useVirtualScroll: false,
    nodeHeight: 25,
    allowDrag: false,
    allowDrop: false
  };
  selectedNode;
  columns = ['Deudora', 'Mayor'];

  onActivateNode(event: any) {
    this.selectedNode = event.node.children;
    // Do stuff with selected node
  }

  copyNode(node: any, tree) {
    const parentNode = node.realParent ? node.realParent : node.treeModel.virtualRoot;
    const copyNode = JSON.stringify(node.children);
    const newNode = JSON.parse(copyNode);
    this.deleteIds(newNode);
    parentNode.children.children.push(newNode);
    tree.treeModel.update();
  }

  deleteIds(node: TreeNode) {
    node.id = null;
    if (node.children) {
      node.children.forEach(child => this.deleteIds(child));
    }
  }

  addNode(node?: any) {
    if(node.data.Id_Cuenta_Contable == ''){
      Swal.fire("Debe Grabar la cuenta para poder generar cuentas hijas");
      return false;
    }
    if(!node){
      return false;
      //node = this.tree.treeModel.nodes
    }
    this.Old_Cuenta = '';
    let largo = 1;
    if (node.data.children) {
      largo = node.data.children.length + 1;
    }
    let NuevaCuenta = "";
    if(largo < 10){
      if(node.data.Cuenta.length <2){
        NuevaCuenta = node.data.Cuenta + largo;
      }else{
        NuevaCuenta = node.data.Cuenta + '0'+ largo;
      }
    }else{
      NuevaCuenta = node.data.Cuenta + largo;
    }

    let Padre = node.data.Cuenta + '-' + node.data.Descripcion
    const newNode = {
      Id_Cuenta_Contable:'',
      Padre:node.data.Cuenta,
      Estado:'1',
      Centro_Costo:'999',
      D151:'0',
      NombrePadre:Padre,
      Descripcion: 'Cuenta Nueva',
      Balance:node.data.Balance,
      Cuenta:NuevaCuenta,
      Deudora:node.data.Deudora,
      Mayor:node.data.Mayor,
      Moneda:node.data.Moneda,
      id:''
    };
    this.Cuenta = newNode;
    if (!node.data.children) {
      node.data.children = [];
    }
    node.data.children.push(newNode);
    this.tree.treeModel.update();
    const someNode = this.tree.treeModel.getNodeById(node.id);
    someNode.expand();
    let lastNode = this.tree.treeModel.getNodeById(node.data.children[node.data.children.length-1]['id']);
    //lastNode.setActiveAndVisible();
    //this.tree.treeModel.getNodeById(node.data.children[node.data.children.length-1]['id']).setActiveAndVisible();
    this.Cuenta.id = node.data.children[node.data.children.length-1]['id'];
    //this.selectedNode = node.data.children;
    return true;
  }

  deleteNode(node, tree) {
    const parentNode = node.realParent ? node.realParent : node.treeModel.virtualRoot;
    parentNode.children.children = parentNode.children.children.filter(child => {
      return child !== node.children;
    });
    tree.treeModel.update();
    if (node && node.parent && node.parent.children && node.parent.children.children.length === 0) {
      node.parent.children.hasChildren = false;
    }

    if (this.selectedNode?.id === node.children.id) {
      this.selectedNode = null;
    }
  }
  async editNode(node,tree){
    this.Old_Cuenta = '';
    this.Cuenta = node.data;
    this.loadAccount(node.data.Id_Cuenta_Contable);
  }
  async loadAccount(Id_Cuenta_Contable){
    let data = await this.catalogoContableService.loadAccount(Id_Cuenta_Contable);
    this.Cuenta.Padre = data['data'][0]['Padre'];
    this.Cuenta.NombrePadre = data['data'][0]['NombrePadre'];
    this.Cuenta.Centro_Costo = data['data'][0]['Centro_Costo'];
    if(this.Cuenta.Centro_Costo == ''){
      this.Cuenta.Centro_Costo = '999';
    }
    if(this.Cuenta.Centro_Costo == '0'){
      this.Cuenta.Centro_Costo = '999';
    }
    this.Cuenta.D151 = data['data'][0]['D151'];
    this.Old_Cuenta = this.Cuenta.Cuenta;
    this.loadAccountName(this.Cuenta.Padre);

  }

  async loadAccountName(Id_Cuenta_Contable){
    if(!Id_Cuenta_Contable){
      this.Cuenta.NombrePadre = 'Cuenta Principal';
      return true;
    }
    let data = await this.catalogoContableService.loadAccountFromCode(Id_Cuenta_Contable,3);
    if(data['total'] == 0){
      this.Cuenta.NombrePadre = 'Cuenta Principal';
    }else{
      this.Cuenta.NombrePadre = data['data'][0]['Cuenta'] + '-' + data['data'][0]['Descripcion'];
    }
    return true;
  }

  openCuentasPanel(){
    this.loadParents();
    this.PantallaCuentasPadres = true;
  }
  async loadParents(search?:any){
    let data = await this.catalogoContableService.loadParents(this.paginacion,search);
    if(data['total'] == 0){
      this.Padres = [];
    }else{
      this.Padres = data['data'];
    }
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
  searchPadres(){
    this.loadParents(this.searchFieldPadres)
  }
  keytabPadres(event){
    if (event.key === 'Enter') {
      this.searchPadres();
    }
  }
  cuentaPrincipal(){
    this.Cuenta.Padre = '';
    this.Cuenta.NombrePadre = ''
    this.closePantallaPadres();
  }
  closePantallaPadres(){
    this.PantallaCuentasPadres = false;
  }
  SeleccionarPadre(padre){
    this.Cuenta.Padre = padre.Cuenta;
    this.Cuenta.NombrePadre = padre.Cuenta + '-' + padre.Descripcion;
    //this.loadAccountName(padre.Cuenta);
    this.closePantallaPadres();
  }
  nuevo(){
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
    this.Cuenta.Cuenta = (this.tree.treeModel.nodes.length+ 1).toString();
  }
}
