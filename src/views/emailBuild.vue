<template>
    <div>
        <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center"
                     style="min-height: 50px; background-image: url(img/theme/clients.jpg); background-size: cover; background-position: center top;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-12">
                        <h1 class="display-2 text-white">Administrador de envio de correos</h1>
                        <!-- <p class="text-white mt-0 mb-2">Edita la plantilla, el asunto del correo, y administra los correos de tus clientes.</p> -->
                    </div>
                </div>
            </div>
        </base-header>
        <modal :show.sync="modals.modal1" modal-classes="modal-lg">
            <template v-slot:header>
                <h5 class="modal-title" id="exampleModalLabel">Importar clientes desde un Excel <span v-if="hasSelected"> <b>- {{ `${dataExcel.length} Cliente(s) importados` }}</b> </span></h5>
            </template>
            <div style="margin-top:-20px">
                <upload-excel-component :on-success="handleSuccess"  />
                <hr>
                <a-table v-if="hasSelected" :columns="columns" :data-source="dataExcel">
                    
                </a-table>
            </div>
            <template v-slot:footer>
                <base-button type="default" @click="modals.modal1 = false">Listo</base-button>
            </template>
        </modal>
        <modal :show.sync="modals.modal2" modal-classes="modal-lg">
            <template v-slot:header>
                <h5 class="modal-title">Carga imagen</h5>
            </template>
            <div style="margin-top:-20px" class="row">
                <label class="col-md-10" for="file">Seleccione imagen</label>
                <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" >
                <button class="col-md-2 buttonUpload" v-on:click="uploadImage()">
                    <i class="ni ni-send" style="font-size: 1.4em;'"></i>
                </button>
                <br>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text bg-default" id="basic-addon2">URL:</span>
                    </div>
                    <input v-model="image_url" type="text" class="form-control pl-2" placeholder="Url de la imagen" aria-label="imagen url" aria-describedby="basic-addon2">
                </div>
            </div>
            <template v-slot:footer>
                <base-button type="default" @click="modals.modal2 = false">Listo</base-button>
            </template>
        </modal>
        <EmailEditor 
            v-if="screenClases == 'desktop'"
            class="w-100 h-100" 
            ref="emailEditor"
            :tools="tools"
            :locale="locale">
        <!-- </div> -->
        <div class="container-fluid p-0">
            <div class="row p-2" >
                <div class="col-4">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-default" id="basic-addon1">Asunto:</span>
                        </div>
                        <input v-model="subject" type="text" class="form-control pl-2" placeholder="Asunto.." aria-label="Username" aria-describedby="basic-addon1">
                    </div>
                </div>
                <div class="col-6">
                    <!-- <label for="text">*Estas enviando el E-Mail a {{mailsQuantity}} personas</label><br> -->
                    <div class="input-group">
                        <div class="input-group-prepend">
                            
                        </div>
                        <input v-model="mails" type="text" class="form-control pl-2" placeholder="ejemplo@ejemplo.com" aria-label="Username" aria-describedby="basic-addon1"/>
                    </div>
                </div>
                <div class="col-2">
                    <input v-model="mails" type="text" class="form-control pl-2" placeholder="ejemplo@ejemplo.com" aria-label="Username" aria-describedby="basic-addon1"/>
                    <button class="btn btn-default" v-on:click="SendMail">
                        <i class="fa fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
            </EmailEditor>        
        <div v-else class="container w-100">
            <h1>Constructor deshabilitado en vista movil</h1>
        </div>
        <div class="container-fluid row pb-3">
            <div class="col-md-5 mt-1">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text bg-default" id="basic-addon1">Asunto:</span>
                    </div>
                    <input v-model="subject" type="text" class="form-control pl-2" placeholder="Asunto.." aria-label="Username" aria-describedby="basic-addon1">
                </div>
            </div>
            <div class="col-md-3 col-7 mt-1">
                <input v-model="mails" type="text" class="form-control pl-2" placeholder="ejemplo@ejemplo.com" aria-label="Username" aria-describedby="basic-addon1"/>
            </div>
            <div class="col-4 mt-1">
                <div class="row">
                    <base-button style="border-radius: 0.375rem;" type="success" v-on:click="modals.modal1 = true" icon="ni ni-collection">Importar clientes</base-button>
                    <button :class="screenClases == 'phone' ? 'w-100' : ''" class="btn btn-default" v-on:click="SendMail">
                        <i class="fa fa-paper-plane"></i>
                    </button>
                    <button :class="screenClases == 'phone' ? 'w-100' : ''" class="btn btn-danger" v-on:click="modals.modal2 = true">
                        <i class="fa fa-upload"></i>
                    </button>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
import endPoint from '../../config-endpoint/endpoint.js'
// import EventBus from './EventBus'
import axios from 'axios'
import router from '../router'
import mixinUserToken from '../mixins/mixinUserToken'
import { EmailEditor } from 'vue-email-editor';
import UploadExcelComponent from '../components/importExcel'
import VueBootstrap4Table from 'vue-bootstrap4-table'
import moment from 'moment';
import 'moment/locale/es';
import es_ES from 'ant-design-vue/lib/locale-provider/es_ES';
moment.locale('es');
export default {
    mixins: [mixinUserToken],
    data() {
        return {
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
            image_url: "",
            hasSelected: false,
            columns : [
                
                {
                    title: 'Nombre',
                    dataIndex: 'Nombres',
                    key: 'Nombres',
                },
                {
                    title: 'Correo',
                    dataIndex: 'Email',
                    key: 'Email',
                },
                {
                    title: 'Ultima atención',
                    key: 'Ultima atencion',
                    dataIndex: 'Ultima atencion'
                },
                {
                    title: 'Cliente desde',
                    key: 'Cliente desde',
                    dataIndex: 'Cliente desde'
                }
            ],
            dataExcel: '',
            mails: '',
            moment,
            es_ES,
            subject: '',
            minHeight: '80vh',
            modals:{
                modal1:false,
                modal2: false
            },
            dateFind:'',
            clients:[],
            
            classes: {
                table: "table-bordered table-striped tableClientsEmail",
                row: "myRow",
                cell: "myCell"
            },
            columnsLender: [
                {
                    label: "Nombre",
                    name: "firstName",
                    // filter: {
                    //     type: "simple",
                    //     placeholder: "id"
                    // },
                    sort: true,
                },
                {
                    label: "Correo",
                    name: "email",
                    slot_name:"validationnnn",
                    sort: false,
                },
                {
                    label: "Atención",
                    name: "lastAttend",
                    slot_name:"date-format",
                    sort: false,
                }
            ],
            configLender: {
                checkbox_rows: true,
                rows_selectable : false,
                highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
                rows_selectable: true,
                per_page_options: [5, 10, 20, 30, 40, 50, 80, 100],
                show_refresh_button: false,
                show_reset_button: false,  
                selected_rows_info: false,
                preservePageOnDataChange : false,
                pagination_info : false,
                pagination: true,
                global_search: {
                    placeholder: "Busque el prestador",
                    visibility: true,
                    case_sensitive: false,
                    showClearButton: true,
                    searchOnPressEnter: false,
                    searchDebounceRate: 200,                      
                },
            },
            selectedRowKeys: [],
            locale: 'es',
            projectId: 0,
            branch: localStorage.branch,
            tools: {
                button: { enabled: true },
                divider: { enabled: true },
                form: { enabled: true },
                heading: { enabled: true },
                image: { enabled: true },
                menu: { enabled: true },
                social: { enabled: true },
                text: { enabled: true },
                timer: { enabled: true },
                html: { enabled: true },
                userUploads: {enabled: true}
            },
            appearance: {
                theme: 'dark',
                panels: {
                    tools: {
                        dock: 'right',
                    },
                },
            },
            email: '',
            file: ""
        };
        
    },
    components: {
        EmailEditor,
        VueBootstrap4Table,
        UploadExcelComponent
    },
    created(){
        this.getMails()
        this.getEmailSend()
        this.getClients()
    },
    computed: {
        // hasSelected() {
        //     return this.selectedRowKeys.length > 0;
        // },
    },
    methods: {
        handleSuccess({ results }) {
            this.dataExcel = []
            this.dataExcel = results
            this.hasSelected = true
            this.mails = ''

            results.forEach((element, index) => {
                if (index == 0) {
                    this.mails = element.Email
                }else{
                    this.mails = this.mails + "," + element.Email
                }
            });
        },
        async filterClients(){
            this.inspectorFilter = true
            try {
                const clients = await axios.post(endPoint.endpointTarget+'/clients/findClientsByDate', {
                    dates: this.dateFind
                }, this.configHeader)
                if (clients.data.status == 'clients does not exist') {
                    this.clients = []
                    this.$swal({
                        icon: 'error',
                        title: 'No se encontraron clientes',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else{
                    this.clients = clients.data.data
                }
            }catch(error){
                if (!err.response) {
                    this.$swal({
                        icon: 'error',
                        title: 'Error de conexión',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else if (err.response.status == 401) {
                    this.$swal({
                        icon: 'error',
                        title: 'Session caducada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        router.push("login")
                    }, 1550);
                }
            }
        },
        selectDate(date, dateString){
            if (date) {
                this.dateFind = dateString
            }else{
                this.dateFind = []
            }
        },
        onSelectChange(selectedRowKeys,selected) {
            this.mails = ''
            selected.forEach((element, index) => {
                if (index == 0) {
                    this.mails = element.email
                }else{
                    this.mails = this.mails + "," + element.email
                }
            });
            
            this.selectedRowKeys = selectedRowKeys;
        },
        selectRow(value){
            this.mails = ''
            value.selected_items.forEach((element, index) => {
                if (index == 0) {
                    this.mails = element.email
                }else{
                    this.mails = this.mails + "," + element.email
                }
            });
        },
        unselect(value){
            this.mails = ''
            value.selected_items.forEach((element, index) => {
                if (index == 0) {
                    this.mails = element.email
                }else{
                    this.mails = this.mails + "," + element.email
                }
            });
        },
        selectAll(value){
            this.mails = ''
            this.clients.forEach((element, index) => {
                if (index == 0) {
                    this.mails = element.email
                }else{
                    this.mails = this.mails + "," + element.email
                }
            });
        },
        unselectAll(value){
            this.mails = ''
        },
        async getClients(){
            // this.progress = false
            try {
                const getAllClients = await axios.get(endPoint.endpointTarget+'/clients', this.configHeader)
                if (getAllClients.data.data.length > 0) {
                    this.clients = getAllClients.data.data
                    // for (let index = 0; index < getAllClients.data.data.length; index++) {
                    //     this.clientsNames.push(getAllClients.data.data[index].firstName + " / " + getAllClients.data.data[index].email)
                    //     this.clientIds.push(getAllClients.data.data[index].firstName + " / " + getAllClients.data.data[index].email + "-" + getAllClients.data.data[index]._id)
                    // }
                    // this.progress = true
                    // this.clientState = false
                }else{
                    // this.clientState = false
                }
            }catch (err) {
                if (!err.response) {
                    this.$swal({
                        icon: 'error',
                        title: 'Error de conexión',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else if (err.response.status == 401) {
                    this.$swal({
                        icon: 'error',
                        title: 'Session caducada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        router.push("login")
                    }, 1550);
                }
            }
        },
        async getMails(){
            try {
                const getEmail = await axios.get(`${endPoint.endpointTarget}/clients/getEmails`, this.configHeader)
                if (getEmail.data.status == 'ok') {
                    this.mails = getEmail.data.data
                    this.mails = ""
                }
            }catch(err){
                if (!err.response) {
                    this.$swal({
                        icon: 'error',
                        title: 'Error de conexión',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else if (err.response.status == 401) {
                    this.$swal({
                        icon: 'error',
                        title: 'Session caducada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        router.push("login")
                    }, 1550);
                }
            }
        },
        handleFileUpload(){
            this.file = this.$refs.file.files[0]   
        },
        async getEmailSend(){
            try {
                const getEmail = await axios.get(`${endPoint.endpointTarget}/configurations/${this.branch}`, this.configHeader)
                if (getEmail.data.status == 'ok') {
                    this.email = getEmail.data.data.businessEmail
                    // this.email = "carlos.gomes349@gmail.com"
                }
            }catch(err){
                if (!err.response) {
                    this.$swal({
                        icon: 'error',
                        title: 'Error de conexión',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else if (err.response.status == 401) {
                    this.$swal({
                        icon: 'error',
                        title: 'Session caducada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        router.push("login")
                    }, 1550);
                }
            }
        },
        async uploadImage(){
            if (this.file == "") {
                this.$swal({
                    icon: 'info',
                    title: 'Debe seleccionar una imagen',
                    showConfirmButton: false,
                    timer: 1500
                })
            }else{
                var formData = new FormData()
                formData.append('image', this.file)
                const config = {headers: {'Content-Type': 'multipart/form-data', 'x-access-token': localStorage.userToken, "x-database-connect": endPoint.database }}
    
                try{
                    const uploadImage = await axios.post(endPoint.endpointTarget+'/configurations/uploadLogo', formData, config)
                    if (uploadImage.data.status == 'ok') {
                        this.image_url = uploadImage.data.file
                    }else{
                        this.$swal({
                            icon: 'error',
                            title: 'Problemas al subir imagen',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }catch(err){
                  if (!err.response) {
                    this.$swal({
                        icon: 'error',
                        title: 'Error de conexión',
                        showConfirmButton: false,
                        timer: 1500
                    })
                  }
                }
            }
        },
        SendMail() {
            this.$refs.emailEditor.editor.exportHtml((data) => {
                axios.post(`${endPoint.endpointTarget}/clients/sendPromotionEmail`, {
                    email: this.email,
                    clients: this.mails,
                    subject: this.subject,
                    html: data.html,
                    branch: this.branch
                }, this.configHeader)
                .then(res => {
                    if (res.data.status == 'ok') {
                        this.$swal({
                            icon: 'success',
                            title: 'Correo enviado con éxito',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }).catch(err => {
                    if (!err.response) {
                        this.$swal({
                            icon: 'error',
                            title: 'Error de conexión',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }else if (err.response.status == 401) {
                        this.$swal({
                            icon: 'error',
                            title: 'Session caducada',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            router.push("login")
                        }, 1550);
                    }
                })
            });
        },
    },
    computed: {
        screenClases: () => {
            return screen.width < 780 ? 'phone' : 'desktop'
        }
    }
}
</script>
<style>
    iframe{
        height: 80vh !important;
    }
    iframe .blockbuilder-branding{
        display: none !important;
    }
    .textarea {
        cursor: pointer;
        background-color:#ecebea;
        border-radius:5px
    }
    .sombreado{
        box-shadow: 0 2px 5px 0 rgba(0,0,0,.14)
    }
    .ck-content{
        max-height: 70vh;
    }
    .ck-file-dialog-button{
        display: none;
    }
    .ck-styles{
        width: 80%;
        
    }
    .templates{
        border:5px solid #f7fafc;
        height:auto;
        background-color:#fff;
        padding-bottom: 10px;
    }
    .myCell{
        padding: 5px !important;
    }
    .myRow td {
        padding: 0px;
    }
    .tableClientsEmail thead tr th {
        padding-bottom: 5px;
        padding-top: 5px;
        padding-left: 1.5rem !important;
    }
    .buttonUpload{
        border:none;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        color:#fff;
        background-color: #2dce89;
        height: 37px !important;
    }
    #file {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    label[for="file"] {
        font-size: 12px;
        font-weight: 600;
        color: #0095ff;
        border: solid 2px #e9ecef;
        background-color: #fff;
        display: inline-block;
        transition: all .5s;
        cursor: pointer;
        padding: 8.1px !important;
        text-decoration-line: underline;
        text-transform: uppercase;
        width: 100%;
        text-align: center;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
</style>