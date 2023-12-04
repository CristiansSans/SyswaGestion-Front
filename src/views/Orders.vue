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
                        <h1 class="display-2 text-white">Gift Cards</h1>
                        <p class="text-white mt-0 mb-2">Esta es la sección administrativa de tus pedidos, aquí podrás visualizar todos tus pedidos.</p>
                        
                        <base-button v-if="validRoute('clientes', 'filtrar')" @click="modals.modal1 = true" type="success">Crear Gift Card</base-button>
                        <!-- <base-button v-if="validRoute('clientes', 'filtrar')" @click="showFilter" type="default">Filtrar</base-button> -->
                        <!-- <base-button type="primary">Pedidos por confirmar: {{rowsPending.length}}</base-button>
                        
                        <base-button type="secondary">{{totalText}}: <span class="text-success">$ {{formatPrice(totalOrder)}}</span> </base-button> -->
                    </div>
                </div>
            </div>
        </base-header>
        <modal :show.sync="modals.modal5"
                body-classes="p-0"
                modal-classes="modal-dialog-centered modal-md">
                <h6 slot="header" class="modal-title" id="modal-title-default"></h6>
            <card type="secondary" shadow
                    header-classes="bg-white pb-5"
                    body-classes="px-lg-5"
                    class="border-0">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h1>Datos del cliente</h1> 
                    </div>
                </template>
                <template>
                    <form role="form">
                            <base-input alternative
                                class="mb-3"
                                placeholder="Nombre"
                                v-model="registerClient.firstName"
                                v-on:keyup="validRegister()"
                                addon-left-icon="ni ni-single-02">
                            </base-input>
                            <base-input alternative
                                class="mb-3"
                                placeholder="Apellido"
                                v-model="registerClient.lastName"
                                v-on:keyup="validRegister()"
                                addon-left-icon="ni ni-single-02">
                            </base-input>
                            <base-input alternative
                                type="text"
                                placeholder="Correo"
                                v-model="registerClient.email"
                                v-on:keyup="validRegister()"
                                addon-left-icon="fa fa-address-card">
                            </base-input>
                            <div class="col-12 mb-4 p-0">
                                <VuePhoneNumberInput 
                                v-model="registerClient.phone.formatNational" 
                                @update="phoneData = $event, registerClient.phone = $event, validRegister()" 
                                :default-phoner-number="registerClient.phone.nationalNumber"
                                :default-country-code="registerClient.phone.countryCode"
                                :translations="{
                                    countrySelectorLabel: 'Código de país',
                                    countrySelectorError: 'Elije un país',
                                    phoneNumberLabel: 'Número de teléfono',
                                    example: 'Ejemplo :'
                                }"/>
                            </div>
                            <base-input addon-left-icon="ni ni-calendar-grid-58">
                                <flat-picker 
                                        slot-scope="{focus, blur}"
                                        @on-open="focus"
                                        @on-close="blur"
                                        @on-change="validRegister()"
                                        :config="configDate"
                                        class="form-control datepicker"
                                        placeholder="Seleccione una fecha"
                                        v-model="registerClient.birthday">
                                </flat-picker>
                            </base-input>
                            <base-input alternative
                                type="text"
                                placeholder="Instagram"
                                v-model="registerClient.instagram"
                                addon-left-icon="fa fa-address-card">
                            </base-input>
                            
                            <div class="text-center">
                                <base-button type="default" :disabled="registerClient.valid ? false : true" v-on:click="registerClients()"  class="my-4">Registrar</base-button>
                                
                            </div> 
                        </form>
                </template>
            </card>
            </modal>
        <a-modal v-model="modals.modal1" width="95%" :footer="false">
            <template>
                <div class="text-muted text-center">
                    <h3>Creación de Gift Card</h3>
                </div>
            </template>
            <template>
                <div>
                    <form-wizard @on-complete="finalFunctionG" color="#174c8e" back-button-text="Atrás" next-button-text="Siguiente" finish-button-text="¡Finalizar!" ref="wizardG"> 
                        <h2 v-if="validWizard" slot="title">Datos de la Gift Card </h2>
                        <h2 v-else slot="title" class="text-danger">¡Debe completar los datos!</h2>
                        <tab-content class="mt-4" title="Servicios" icon="fa fa-layer-group" :before-change="validateFirstStepG" >
                            <div v-if="desactive">
                                <center>
                                    <h1 class="text-center w-50 mt-4">
                                        Por motivos de fuerza mayor, no estamos atendiendo en nuestro loca. Una vez se levante la cuarentena retomaremos los agendamientos.
                                    </h1>
                                </center>
                            </div>  
                            <div v-else class="row">
                                <div class="showDevice col-md-12 row">
                                    <div style="width:auto;" class="col-12 ml-3" >
                                        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                            <li v-for="(category, index) of categories" :key="category.name"  class="nav-item responsiveItem" role="presentation">
                                                <button class="categoryButton text-uppercase responsiveItem" :id="'catG'+index" data-toggle="pill" :href="'#v-pillsG-'+category._id" role="tab" aria-controls="v-pills-home" aria-selected="true" v-on:click="selectCatG('catG'+index)">{{category.name}}</button>
                                            </li>
                                        </ul>   
                                    </div>
                                    <div class="separateService col-md-8">
                                        <div class="tab-content" id="pills-tabContent">
                                            <div v-for="category of categories" :key="category.name" class="tab-pane fade " :id="'v-pillsG-'+category._id" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                                <div class="row mt-2 ml-4">
                                                    <template v-for="(service, index) of services">
                                                        <div :key="service.name" class="col-md-4 px-2" v-if="service.category == category.name && service.active == true">
                                                            <div class="card-service row mt-2" :id="'GcardS'+index">
                                                                <h3 class="name-service w-100"> {{service.name}}</h3>
                                                                <div class="col-12 pl-0">
                                                                    <img src="img/brand/calendar.png" alt="">
                                                                </div>
                                                                <p class="ml-1 mb-0 w-100" style="margin-top:-15px;">
                                                                    <a-icon type="clock-circle" style="vertical-align:1.5px;" /> {{fixedHours(service.duration)}}
                                                                </p>
                                                                <p class="ml-1 w-100">{{service.additionalName}}</p> 
                                                                
                                                                <div class="col-md-6 col-sm-12 mt-1" style="padding: 0px !important;padding-top: 5px !important;">
                                                                    <div class="price-service ">$ {{formatPrice(service.price)}}</div> 
                                                                </div>
                                                                <div class="col-md-6 col-sm-12 mt-1" style="padding: 0px !important;margin-top:-5px;">
                                                                    <div class="button-service-group">
                                                                        
                                                                        <button v-on:click="lessServiceGift(index, service.name, service.duration, 'cardS'+index, service.price, serviceCountG[index].count)" class="button-service-left" ><i class="fa fa-minus" ></i></button>
                                                                        <span class="span-button-service">{{serviceCountG[index].count}}</span>
                                                                        <button class="button-service-right" 
                                                                        v-on:click="plusServiceGift(index, service.name, service._id, service.duration, service.commission, service.price, service.employes, true, 'cardS'+index, service.discount)"
                                                                        ><i class="fa fa-plus"></i></button>
                                                                    </div> 
                                                                </div>  
                                                            </div>
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <h2 style="margin-top:-50px;">Servicios seleccionados</h2>
                                        <vuescroll :ops="ops" v-if="registerDateGift.serviceSelectds[0]"  style="height:40vh;overflow:hidden;overflow-x: hidden;">
                                        <template >
                                            <div v-for="(service, index) in registerDateGift.serviceSelectds" :key="service._id+'asda'+index" class="w-100 px-4" >
                                                <div class="card-service row mt-4" style="border-bottom: solid 8px #174c8e">
                                                    <h3 class="name-service"> {{service.name}}</h3>
                                                    <div class="col-12 pl-0">
                                                        <img src="img/brand/calendar.png" alt="">
                                                    </div>
                                                    
                                                    <div class="col-md-6 col-sm-12 mt-2" style="padding: 0px !important;padding-top: 5px !important;">
                                                        <div class="price-service ">$ {{formatPrice(service.price)}}</div> 
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                        </vuescroll>
                                        <div v-else>
                                            <h2 class="text-center">No ha seleccionado ningún servicio.</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="showPhone col-md-12 p-0 pb-2">
                                    <base-dropdown class="w-100 mx-auto mb-3 styleDropdown">
                                        <base-button style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" slot="title" type="default" class="dropdown-toggle w-100">
                                            {{CatSelected}}
                                        </base-button>
                                        <b v-for="category of categories" :key="category.name" v-on:click="selectCategoryPhone(category.name)" class="dropdown-item w-100" style="color:#fff;"> {{category.name}} 
                                        </b>
                                    </base-dropdown>
                                    <base-dropdown class="w-100 mx-auto styleDropdown" v-if="servicesPhoneShow">
                                        <base-button style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" slot="title" type="default" class="dropdown-toggle w-100">
                                            Servicios 
                                        </base-button>
                                        <template v-for="service of servicesCat">
                                            <b :key="service.name" v-on:click="selectServicePhone(service._id)" v-if="service.active == true" class="dropdown-item w-100" style="color:#fff;"> {{service.name}} </b>
                                        </template>
                                    </base-dropdown>
                                    
                                    <template v-if="registerDateGift.serviceSelectds[0]">
                                        <h2 class="mt-3 text-center">Servicios seleccionados</h2>
                                        <hr>
                                        <div v-for="(service, index) in registerDateGift.serviceSelectds" :key="service._id+'asda'+index" class="w-100" >
                                            <div class="card-service mt-4" style="border-bottom: solid 8px #174c8e">
                                                <h2 class="name-service"> {{service.name}}</h2>
                                                <p class="ml-1 mb-0 w-100" style="margin-top:-8px;">
                                                    <a-icon type="clock-circle" style="vertical-align:1.5px;" /> 
                                                    {{fixedHours(service.duration)}}<br>
                                                    {{service.additionalName}}
                                                </p>
                                                <div class="col-12 mt-2 p-0">
                                                    <!-- <template v-if="ifMicro">
                                                        <a-tooltip placement="top">
                                                            <template slot="title">
                                                                <span>Haga click en los adicionales que desea para este servicio. Se le sumara el costo al total del servicio.</span>
                                                            </template>
                                                            <span class="ml-1 mt-2 mb-0 font-weight-bold" style="font-size: 1.2em;">Adicionales: </span>
                                                            <br>
                                                            <div v-for="(micro, indexM) in service.microServices" :key="micro.microService" v-on:click="SelectMicro(index, indexM, micro)" style="display: inline-block; cursor: pointer;margin-left: 4px;">
                                                                <badge style="z-index:100" :type="micro.checked ? 'primary' : 'secondary'" class="text-default mb-1">
                                                                    <p style="font-size:1.2em;font-weight: bold;" class="fs-5 mb-0">{{micro.microService}}</p>
                                                                </badge>
                                                            </div>
                                                        </a-tooltip>
                                                    </template> -->
                                                    <img style="z-index:0" src="img/brand/calendar.png" alt="">
                                                </div>
                                                <div class="row p-1">
                                                    <div class="col-8 mt-4 p-1" >
                                                        <div class="price-service w-100">$ {{formatPrice(service.price)}}</div> 
                                                    </div>
                                                    <div class="col-4 mt-4 p-1" >
                                                        <div style="border: solid 1px #174c8e;float:right;margin-right:5px;" class="price-service w-50"><a-icon style="vertical-align:1px;" type="close" v-on:click="lessServicePhone(index, service.price)" /></div> 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </tab-content>
                        
                        <tab-content title="Información" icon="fa fa-question-circle">
                            <div class="row">
                                <div class="col-md-8 col-sm-12" >
                                    <vuescroll :ops="ops" v-if="registerDateGift.serviceSelectds[0]"  style="height:40vh;overflow:hidden;overflow-x: hidden;">
                                    <div class="row">
                                        
                                        <div class="card-services-information col-lg-6" v-for="(data, index) in registerDateGift.serviceSelectds" :key="data.servicio" >
                                            <div class="p-3">
                                                <center>
                                                <span class="mb-1 w-100" style="color:#000;font-weight:500;">Servicio {{index + 1}}</span> 
                                                </center>
                                                
                                                    <base-button type="secondary" class="w-100 text-center mb-1" style="background-color:#d5dadd;color:#1c2021;border:none">
                                                        <badge class="mx-auto ml-2" type="default" style="background-color:#174c8e;">
                                                            
                                                            <span style="color:#fff;font-size:1.4em;text-transform:none;">{{data.name}}
                                                                
                                                            </span> 
                                                        </badge>
                                                        <br>
                                                    </base-button>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    </vuescroll>
                                </div>
                                <div class="col-md-4 col-sm-12 pt-5">
                                    <center>
                                        <div class="row">
                                            <div class="col-10">
                                                <a-select
                                                    show-search
                                                    placeholder="Prueba cliente"
                                                    option-filter-prop="children"
                                                    :filter-option="filterOption"
                                                    :allowClear="true"
                                                    class="mb-2 w-100 clientSelect"
                                                    :class="screenWidthInput"
                                                    v-model="registerClient.select"
                                                    @search="handleSearchG"
                                                    @change="chooseClient">
                                                    <a-select-option v-for="d in clientsRegex" :key="d._id" :value="d._id">
                                                        {{d.name}}
                                                    </a-select-option>
                                                </a-select>
                                            </div>
                                            <div class="col-2">
                                                <a-button   @click="modals.modal5 = true" class="float-left" type="primary" shape="round">
                                                    <i class="fa fa-user-plus" style="font-size:1.5em;"></i>
                                                </a-button>
                                            </div>
                                        </div>
                                        
                                        <base-dropdown class="mt-1 col-12 responsiveButtonsPercent styleDropdown">
                                            <base-button slot="title" type="succes" class="dropdown-toggle w-100 dropdownPay" style="border-radius:14px; border: 1px solid #174c8e">
                                                Selecciona un tipo de pago
                                            </base-button>
                                            <b class="dropdown-item w-100" style="color:white;" v-on:click="selectPayG('Presencial efectivo')">Presencial efectivo</b>
                                            <b class="dropdown-item w-100" style="color:white;" v-on:click="selectPayG('Presencial Débito')">Presencial Débito</b>
                                            <b class="dropdown-item w-100" style="color:white;" v-on:click="selectPayG('Presencial Crédito')">Presencial Crédito</b>
                                            <!-- <b class="dropdown-item w-100" style="color:#32325d;" v-on:click="selectPay('WebPay')">WebPay</b>  -->
                                        </base-dropdown><br>
                                        
                                        <base-button class="mt-3 col-12 responsiveButtonsPercent mx-auto" type="secondary" style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;">
                                            Total: <strong class="text-uppercase">$ {{formatPrice(totalPriceG)}}</strong>
                                        </base-button>
                                    </center><br>
                                </div>
                            </div>
                        </tab-content>
                    </form-wizard>
                </div>     
            </template>
        </a-modal>

       
        <modal :show.sync="modals.modal4"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-md">
               <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                        Detalles de servicios
                    </div>
                </template>
                <template>
                    <a-table :columns="columnsServices"  :data-source="orderServices" :scroll="getScreen">
                        <div
                        slot="filterDropdown"
                        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                        style="padding: 8px"
                        >
                        <a-input
                            v-ant-ref="c => (searchInput = c)"
                            :placeholder="`Buscar por ${column.title.toLowerCase()}`"
                            :value="selectedKeys[0]"
                            style="width: 188px; margin-bottom: 8px; display: block;"
                            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                            @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                        />
                        <a-button
                            type="primary"
                            icon="search"
                            size="small"
                            style="width: 90px; margin-right: 8px"
                            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                        >
                            Buscar
                        </a-button>
                        <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
                            Restablecer
                        </a-button>
                        </div>
                        <a-icon
                            slot="filterIcon"
                            slot-scope="filtered"
                            type="search"
                            :style="{ color: filtered ? '#108ee9' : undefined }"
                        />
                        <template slot="price" slot-scope="record,column">
                            $ {{ formatPrice(column.price) }} 
                        </template>


                        <template slot="dateExpired-slot" slot-scope="record,column">
                            {{column.expiredDate | formatDate}} 
                        </template>
                        
                        
                    </a-table>

                    <div class="text-center">
                            <base-button type="primary" v-on:click="modals.modal4 =false"  class="my-4">Cerrar</base-button>
                        </div>
                    
                </template>
            </card>
        </modal>
        <modal :show.sync="modals.modal2"
               :gradient="modals.type"
               modal-classes="modal-danger modal-dialog-centered">
            <div class="py-3 text-center">
                <i :class="modals.icon"></i>
                <h1 class="heading mt-5">{{modals.message}}</h1>
            </div>
        </modal>
        <modal :show.sync="modals.modal3"
               modal-classes="modal-dialog-centered">
            <div class="py-3 text-center">
                <h1 class="heading mt-5">¿Seguro que desea confirmar este pedido?</h1>
                <base-button type="success" v-on:click="confirmar()" class="my-4">Si</base-button>
                <base-button type="danger" v-on:click="modals.modal3 = false, idPedido = ''" class="my-4">No</base-button>
            </div>
        </modal>
        

        <!-- TABLA DE ordenes -->
        <tabs fill class="flex-column flex-md-row">
            <card shadow>
                <tab-pane v-on:click="changeOrderView('pending')">
                    <span slot="title" >
                        <i class="ni ni-cart"></i>
                        Gift Cards por confirmar
                    </span>
                    
                    <a-table :columns="columns"  :data-source="rowsPending" :scroll="getScreen">
                        <div
                        slot="filterDropdown"
                        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                        style="padding: 8px"
                        >
                        <a-input
                            v-ant-ref="c => (searchInput = c)"
                            :placeholder="`Buscar por ${column.title.toLowerCase()}`"
                            :value="selectedKeys[0]"
                            style="width: 188px; margin-bottom: 8px; display: block;"
                            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                            @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                        />
                        <a-button
                            type="primary"
                            icon="search"
                            size="small"
                            style="width: 90px; margin-right: 8px"
                            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                        >
                            Buscar
                        </a-button>
                        <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
                            Restablecer
                        </a-button>
                        </div>
                        <a-icon
                            slot="filterIcon"
                            slot-scope="filtered"
                            type="search"
                            :style="{ color: filtered ? '#108ee9' : undefined }"
                        />
                        <template slot="date-slot" slot-scope="record,column">
                            {{column.createdAt | formatDate}} 
                        </template>

                        <template slot="dateExpired-slot" slot-scope="record,column">
                            {{column.expiredDate | formatDate}} 
                        </template>

                        <template slot="price" slot-scope="record,column">
                            $ {{ formatPrice(column.total) }} 
                        </template>

                        <template slot="action" slot-scope="record,column">
                            <a-tooltip placement="top">
                                <template slot="title">
                                    <span>Ver servicios</span>
                                </template>
                                <base-button class="mt-1" size="sm" v-on:click="seeServices(column.products)" type="primary" icon="ni ni-align-center"></base-button>
                            </a-tooltip>

                            <a-tooltip placement="top">
                                <template slot="title">
                                    <span>Confirmar</span>
                                </template>
                                <base-button class="mt-1" size="sm" v-on:click="confirmOrder(column._id)" type="success" icon="ni ni-check-bold"></base-button>
                            </a-tooltip>
                        </template>

                        
                        
                        
                    </a-table>

                    <div class="container-fluid d-flex align-items-center my-4">
                        <div class="row">
                            <div class="col-12">
                                <base-button style="margin-top: -130px;" outline type="primary">Pedidos por confirmar: {{rowsPending.length}}</base-button>
                                
                                <base-button style="margin-top: -130px;" outline class="ml-4" type="success">Monto total por confirmar: $ {{formatPrice(totalPending)}}</base-button>
                            </div>
                        </div>
                    </div>
                </tab-pane>

                <tab-pane title="Profile">
                    <span slot="title" v-on:click="changeOrderView('confirmed')">
                        <i class="ni ni-check-bold"></i>
                        Pedidos confirmados
                    </span>
                    
                    <a-table :columns="columnsConfirmed"  :data-source="rowsConfirmed" :scroll="getScreen">
                        <div
                        slot="filterDropdown"
                        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                        style="padding: 8px"
                        >
                        <a-input
                            v-ant-ref="c => (searchInput = c)"
                            :placeholder="`Buscar por ${column.title.toLowerCase()}`"
                            :value="selectedKeys[0]"
                            style="width: 188px; margin-bottom: 8px; display: block;"
                            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                            @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                        />
                        <a-button
                            type="primary"
                            icon="search"
                            size="small"
                            style="width: 90px; margin-right: 8px"
                            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                        >
                            Buscar
                        </a-button>
                        <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
                            Restablecer
                        </a-button>
                        </div>
                        <a-icon
                            slot="filterIcon"
                            slot-scope="filtered"
                            type="search"
                            :style="{ color: filtered ? '#108ee9' : undefined }"
                        />
                        <template slot="date-slot" slot-scope="record,column">
                            {{column.createdAt | formatDate}} 
                        </template>

                        <template slot="price" slot-scope="record,column">
                            $ {{ formatPrice(column.total) }} 
                        </template>

                        <template slot="dateExpired-slot" slot-scope="record,column">
                            {{column.expiredDate | formatDate}} 
                        </template>

                        <template slot="action" slot-scope="record,column">
                            <a-tooltip placement="top">
                                <template slot="title">
                                    <span>Ver servicios</span>
                                </template>
                                <base-button class="mt-1" size="sm" v-on:click="seeServices(column.products)" type="primary" icon="ni ni-align-center"></base-button>
                            </a-tooltip>
                        </template>
                        
                        
                    </a-table>
                    <!-- <vue-bootstrap4-table class="tableClient" :rows="rowsConfirmed" :columns="columnsConfirmed" :classes="classes" :config="config">
                        
                        <template slot="date" slot-scope="props">
                            <b>
                                {{formatDate(props.row.date)}}
                            </b>
                        </template>
                        <template slot="dateConfirm" slot-scope="props">
                            <b>
                               
                                {{formatDates(props.row.dateConfirm)}}
                              
                                
                            </b>
                        </template>
                        <template slot="pagination-info" slot-scope="props">
                            Actuales {{props.currentPageRowsLength}} | 
                            Registros totales {{props.originalRowsLength}}
                        </template>
                        <template slot="selected-rows-info" slot-scope="props">
                            Total Number of rows selected : {{props.selectedItemsCount}}
                        </template>
                    </vue-bootstrap4-table> -->
                    <div class="container-fluid d-flex align-items-center my-4">
                        <div class="row">
                            <div class="col-12">
                                <base-button style="margin-top: -130px;" outline type="primary">Pedidos confirmados: {{rowsConfirmed.length}}</base-button>
                                
                                <base-button style="margin-top: -130px;" outline class="ml-4" type="success">Monto total confirmado: $ {{formatPrice(totalConfirmed)}}</base-button>
                            </div>
                        </div>
                    </div>
                </tab-pane>

                <tab-pane>
                    <span slot="title" v-on:click="changeOrderViewUsed('used')">
                        <i class="ni ni-folder-17"></i>
                        Pedidos procesados / vencidos
                    </span>
                    <a-table :columns="columnsProccess"  :data-source="rowsUsed" :scroll="getScreen">
                        <div
                        slot="filterDropdown"
                        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                        style="padding: 8px"
                        >
                        <a-input
                            v-ant-ref="c => (searchInput = c)"
                            :placeholder="`Buscar por ${column.title.toLowerCase()}`"
                            :value="selectedKeys[0]"
                            style="width: 188px; margin-bottom: 8px; display: block;"
                            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                            @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                        />
                        <a-button
                            type="primary"
                            icon="search"
                            size="small"
                            style="width: 90px; margin-right: 8px"
                            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                        >
                            Buscar
                        </a-button>
                        <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
                            Restablecer
                        </a-button>
                        </div>
                        <a-icon
                            slot="filterIcon"
                            slot-scope="filtered"
                            type="search"
                            :style="{ color: filtered ? '#108ee9' : undefined }"
                        />
                        <template slot="date-slot" slot-scope="record,column">
                            {{column.createdAt | formatDate}} 
                        </template>

                        <template slot="price" slot-scope="record,column">
                            $ {{ formatPrice(column.total) }} 
                        </template>
                        
                        <template slot="dateU-slot" slot-scope="record,column">
                            <span v-if="column.status == 'expired'">Expirado</span>
                            <span v-else>{{column.processDate | formatDate}} </span>
                        </template>
                        
                        
                    </a-table>
                    <div class="container-fluid d-flex align-items-center my-4">
                        <div class="row">
                            <div class="col-12 mt-2">
                                <base-button outline style="margin-top: -130px;" type="primary">Pedidos usados / vencidos: {{rowsUsed.length}}</base-button>
                                
                                <base-button outline style="margin-top: -130px;" class="ml-4" type="success">Monto total usado: $ {{formatPrice(totalUsed)}} </base-button>
                            </div>
                        </div>
                    </div>
                    <!-- <vue-bootstrap4-table class="tableClient" :rows="rowsUsed" :columns="columnsProccess" :classes="classes" :config="config">
                        <template slot="date" slot-scope="props">
                            <b>
                                
                                {{formatDate(props.row.date)}}
                                    
                                
                                
                            </b>
                        </template>
                        <template slot="dateProccess" slot-scope="props">
                            <b>
                                <div v-if="props.row.estado == 'usado'">
                                    {{formatDates(props.row.dateProccess)}}  
                                </div>
                                <a-tooltip  v-else placement="top">
                                    <template slot="title">
                                    <span>Pedido vencido el {{formatDates(props.row.dateProccess)}}  </span>
                                    </template>
                                    <base-button size="sm" type="danger"  >Vencido</base-button>
                                </a-tooltip>
                                
                            </b>
                        </template>
                        <template slot="pagination-info" slot-scope="props">
                            Actuales {{props.currentPageRowsLength}} | 
                            Registros totales {{props.originalRowsLength}}
                        </template>
                        <template slot="selected-rows-info" slot-scope="props">
                            Total Number of rows selected : {{props.selectedItemsCount}}
                        </template>
                    </vue-bootstrap4-table> -->
                </tab-pane>
            </card>
        </tabs>

        

        <!-- END -->

    </div> 
</template>

<script>
//Back - End 
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import VueBootstrap4Table from 'vue-bootstrap4-table'
import EventBus from '../components/EventBus'
import jwtDecode from 'jwt-decode'
import router from '../router'
import locale from 'ant-design-vue/es/date-picker/locale/es_ES';
import moment from 'moment'
import flatPicker from "vue-flatpickr-component";
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'moment/locale/es';
import vuescroll from 'vuescroll';
moment.locale('es');
import es_ES from 'ant-design-vue/lib/locale-provider/es_ES';


import mixinES from '../mixins/mixinES'
// COMPONENTS

import mixinUserToken from '../mixins/mixinUserToken'
export default {
    mixins: [mixinUserToken],
    components: {
        VueBootstrap4Table,
        vuescroll,
        flatPicker,
        VuePhoneNumberInput
    },
    data() {
      return {
        auth: [],
        idPedido:'',
        moment,
        locale,
        es_ES,
        totalText: 'Monto total por confirmar',
        identidadPedido:'',
        codePedido:'',
        articuloPedido:'',
        searchInput: null,
        clientePedido:'',
        successRegister:false,
        clientsNames: [],
        searchText: '',
        orderServices: [],
        searchedColumn: '',
        tipeForm: '',
        services:'',
        servicesPhoneShow:false,
        validPayG: false,
        modals: {
            modal1: false,
            modal2: false,
            modal3: false,
            modal4: false,
            modal5: false,
            message: "",
            icon: '',
            type:''
        },
        ops:{
            rail: {
                background: '#01a99a',
                opacity: 0,
                size: '9px',
                specifyBorderRadius: false,
                gutterOfEnds: null,
                gutterOfSide: '0px',
                keepShow: false
            },
            bar: {
                showDelay: 1500,
                onlyShowBarOnScroll: true,
                keepShow: false,
                background: '#c1c1c1',
                opacity: .5,
                specifyBorderRadius: false,
                minSize: 0,
                size: '6px',
                disable: false
            },
            scrollPanel: {
                scrollingX: false,
                scrollingY: true,
            }
        },
        rowsPending: [],
        rowsConfirmed: [],
        rowsUsed: [],
        totalPending:0,
        validWizard: true,
        configDate: {
            allowInput: true, 
            dateFormat: 'd-m-Y',
        },
        columnsServices: [
            
            {
                title: 'Servicio',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => {
                     if (a.name > b.name) {
                        return -1;
                    }
                    if (b.name > a.name) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'namesC-slot',
                },
                onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },

            
            
            {
                title: 'Precio',
                dataIndex: 'price',
                key: 'price',
                scopedSlots: { customRender: 'price' },
                sorter: (a, b) => a.price - b.price,
            },
            
        ],
        columnsConfirmed: [
            { 
                title: 'Fecha de creación',
                dataIndex: 'createdAt',
                defaultSortOrder: 'descend',
                sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                scopedSlots: { customRender: 'date-slot' } 
            },
            
            {
                title: 'N° de pedido',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                sorter: (a, b) => {
                     if (a.orderNumber > b.orderNumber) {
                        return -1;
                    }
                    if (b.orderNumber > a.orderNumber) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'number-slot',
                },
                onFilter: (value, record) => record.orderNumber.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Comprador',
                dataIndex: 'client.name',
                key: 'client.name',
                sorter: (a, b) => {
                     if (a.client.name > b.client.name) {
                        return -1;
                    }
                    if (b.client.name > a.client.name) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'namesC-slot',
                },
                onFilter: (value, record) => record.client.name.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },

            {
                title: 'Email',
                dataIndex: 'client.email',
                key: 'client.email',
                sorter: (a, b) => {
                     if (a.client.email > b.client.email) {
                        return -1;
                    }
                    if (b.client.email > a.client.email) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'namesE-slot',
                },
                onFilter: (value, record) => record.client.email.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },

            {
                title: 'Medio de pago',
                dataIndex: 'payType',
                key: 'payType',
                sorter: (a, b) => {
                     if (a.payType > b.payType) {
                        return -1;
                    }
                    if (b.payType > a.payType) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'namesE-slot',
                },
                onFilter: (value, record) => record.payType.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                scopedSlots: { customRender: 'price' },
                sorter: (a, b) => a.total - b.total,
            },
            {
                title: 'Acciones',
                dataIndex: '_id',
                key: '_id',
                scopedSlots: { customRender: 'action' }
            }
        ],

        columnsProccess: [
            { 
                title: 'Fecha de creación',
                dataIndex: 'createdAt',
                defaultSortOrder: 'descend',
                sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                scopedSlots: { customRender: 'date-slot' } 
            },
            
            {
                title: 'N° de pedido',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                sorter: (a, b) => {
                     if (a.orderNumber > b.orderNumber) {
                        return -1;
                    }
                    if (b.orderNumber > a.orderNumber) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'number-slot',
                },
                onFilter: (value, record) => record.orderNumber.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Comprador',
                dataIndex: 'client.name',
                key: 'client.name',
                sorter: (a, b) => {
                     if (a.client.name > b.client.name) {
                        return -1;
                    }
                    if (b.client.name > a.client.name) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'namesC-slot',
                },
                onFilter: (value, record) => record.client.name.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },

            {
                title: 'Email',
                dataIndex: 'client.email',
                key: 'client.email',
                sorter: (a, b) => {
                     if (a.client.email > b.client.email) {
                        return -1;
                    }
                    if (b.client.email > a.client.email) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'namesE-slot',
                },
                onFilter: (value, record) => record.client.email.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },

            {
                title: 'Código',
                dataIndex: 'code',
                key: 'code',
                sorter: (a, b) => {
                     if (a.code > b.code) {
                        return -1;
                    }
                    if (b.code > a.code) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'number-slot',
                },
                onFilter: (value, record) => record.code.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },

            {
                title: 'Medio de pago',
                dataIndex: 'payType',
                key: 'payType',
                sorter: (a, b) => {
                     if (a.payType > b.payType) {
                        return -1;
                    }
                    if (b.payType > a.payType) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'namesE-slot',
                },
                onFilter: (value, record) => record.payType.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },

            { 
                title: 'Fecha de uso',
                dataIndex: 'processDate',
                defaultSortOrder: 'descend',
                sorter: (a, b) => new Date(a.processDate).getTime() - new Date(b.processDate).getTime(),
                scopedSlots: { customRender: 'dateU-slot' } 
            },

            
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                scopedSlots: { customRender: 'price' },
                sorter: (a, b) => a.total - b.total,
            },
            
        ],
        columns: [
            { 
                title: 'Fecha de creación',
                dataIndex: 'createdAt',
                defaultSortOrder: 'descend',
                sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                scopedSlots: { customRender: 'date-slot' } 
            },
            
            {
                title: 'N° de pedido',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                sorter: (a, b) => {
                     if (a.orderNumber > b.orderNumber) {
                        return -1;
                    }
                    if (b.orderNumber > a.orderNumber) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'number-slot',
                },
                onFilter: (value, record) => record.orderNumber.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Comprador',
                dataIndex: 'client.name',
                key: 'client.name',
                sorter: (a, b) => {
                     if (a.client.name > b.client.name) {
                        return -1;
                    }
                    if (b.client.name > a.client.name) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'namesC-slot',
                },
                onFilter: (value, record) => record.client.name.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },

            {
                title: 'Email',
                dataIndex: 'client.email',
                key: 'client.email',
                sorter: (a, b) => {
                     if (a.client.email > b.client.email) {
                        return -1;
                    }
                    if (b.client.email > a.client.email) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'namesE-slot',
                },
                onFilter: (value, record) => record.client.email.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },

            {
                title: 'Medio de pago',
                dataIndex: 'payType',
                key: 'payType',
                sorter: (a, b) => {
                     if (a.payType > b.payType) {
                        return -1;
                    }
                    if (b.payType > a.payType) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'namesE-slot',
                },
                onFilter: (value, record) => record.payType.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },

            { 
                title: 'Fecha de vencimiento',
                dataIndex: 'expiredDate',
                key: 'expiredDate',
                sorter: (a, b) => new Date(a.expiredDate).getTime() - new Date(b.expiredDate).getTime(),
                scopedSlots: { customRender: 'dateExpired-slot' } 
            },
            
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                scopedSlots: { customRender: 'price' },
                sorter: (a, b) => a.total - b.total,
            },
            {
                title: 'Acciones',
                dataIndex: '_id',
                key: '_id',
                scopedSlots: { customRender: 'action' }
            }
        ],
        config: {
            card_title: "Tabla de pedidos",
            checkbox_rows: false,
            rows_selectable : true,
            highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
            rows_selectable: true,
            per_page_options: [5, 10, 20, 30, 40, 50, 80, 100],
            global_search: {
                placeholder: "Filtre sus pedidos",
                visibility: true,
                case_sensitive: false
            },
            show_refresh_button: false,
            show_reset_button: false,  
            selected_rows_info: true,
            preservePageOnDataChange : true,
            pagination_info : true
        },
        configHeader: {
            headers:{
                "x-database-connect": endPoint.database,
                'x-access-token':localStorage.userToken
                }
        },
        classes: {
            table: "table-bordered table-striped"
        },
        registerDateGift : {
            employeSelect: '',
            date: '',
            duration: 0,
            restTime:'',
            class: '',
            employeResTime: '',
            serviceSelectds: [],
            design:'nada',
            start: '',
            sort: '',
            end: ''
        },
        registerClient: {
            firstName: '',
            lastName: '',
            email: '',
            phone: {
                "countryCode": "CL", 
                "isValid": false, 
                "phoneNumber": "", 
                "countryCallingCode": "", 
                "formattedNumber": "", 
                "nationalNumber": "", 
                "formatInternational": "", 
                "formatNational": "", 
                "uri": "", 
                "e164": ""
            },
            name: '',
            payG:'',
            instagram: '',
            birthday: '',
            discount: false,
            recommender: '',
            select: 'Seleccione',
            valid: false,
        },
        totalUsed: 0,
        categories:[],
        totalConfirmed: 0,
        totalOrder:0,
        branch: '',
        desactive: false,
        CatSelected: 'Categorias',
        servicesPhoneShow: false,
        totalPriceG: 0,
        serviceCountG: [],
        clientsRegex: [],
        configurations:[],
        serviceSelected: [],
        servicePhoneCount: [],
        servicesCat: []
      };
    },
    created(){
		this.getOrders();
        this.getToken();
        this.getCategories();
        this.getServices();
        this.getConfiguration()
    },
    methods: {
        getToken(){
            const token = localStorage.userToken
            const decoded = jwtDecode(token)  
            this.auth = decoded.access
            this.branch = localStorage.branch
        },
        async selectServicePhone(id){
            for (let j = 0; j < this.serviceSelected.length; j++) {
                const element = this.serviceSelected[j];
                if (element.set == false) {
                    this.serviceSelected.splice(j, 1)
                    this.servicePhoneCount.splice(j, 1)
                }
            }
            try {
                const service = await axios.get(endPoint.endpointTarget+'/services/getServiceInfo/'+id, this.configHeader)
                if (service.data.status == 'ok') {
                    service.data.data.set = false
                    
                    this.serviceSelected.unshift(service.data.data)
                    this.servicePhoneCount.unshift({count: 0})
                    this.plusServiceGift(new Date().getTime(), service.data.data.name, service.data.data._id, service.data.data.duration, service.data.data.commission, service.data.data.price, service.data.data.employes, false)
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Error técnico.',
                        showConfirmButton: false,
                        timer: 2500
                    })
                }
            }catch(err){
            console.log("🚀 ~ file: Orders.vue ~ line 1310 ~ selectServicePhone ~ err", err)
                
                if (!err.response) {
                    this.$swal({
                        icon: 'error',
                        title: 'Error de conexión1',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
        },
        async selectCategoryPhone(name){
            for (let j = 0; j < this.serviceSelected.length; j++) {
                const element = this.serviceSelected[j];
                if (element.set == false) {
                    this.serviceSelected.splice(j, 1)
                    this.servicePhoneCount.splice(j, 1)
                }
            }
            this.servicesPhoneShow = false
            this.servicesCat = []
            try {
                const services = await  axios.post(endPoint.endpointTarget+'/services/servicesByCategory', {
                    name: name,
                    branch: this.branch
                }, this.configHeader)
                if (services.data.status == 'ok') {
                    this.servicesPhoneShow = true
                    this.servicesCat = services.data.data
                    this.CatSelected = name
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Categoria sin servicios.',
                        showConfirmButton: false,
                        timer: 2500
                    })
                }
            }catch (err){
                if (!err.response) {
                    this.$swal({
                        icon: 'error',
                        title: 'Error de conexión',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
        },
        
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        async getConfiguration(){
            try {
                const getConfig = await axios.get(endPoint.endpointTarget+'/configurations/'+this.branch, this.configHeader)
                if (getConfig.data.status == 'ok') {
                    this.configurations = getConfig.data.data
                    console.log("🚀 ~ file: Orders.vue ~ line 1291 ~ getConfiguration ~ this.configurations", this.configurations.giftCard)
                    
                    
                }else{
                    this.configurations = {}
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
        },
        async handleSearchG(value) {
            if (value != '') {
                this.clientsRegex = []
                try {
                    const getClient = await axios.get(endPoint.endpointTarget+'/clients/regex/'+ value, this.configHeader)
                    if (getClient.data.status == 'ok') {
                        this.clientsRegex = getClient.data.data
                    }
                }catch(err){
                    console.log(err)
                }
            }else{
                this.clientsRegex = []
            }
            
        },
        async getCategories(){
            try {
                const categories = await axios.get(endPoint.endpointTarget+'/services/getCategoriesForClients/'+this.branch, this.configHeader)
                if (categories.data.status == 'ok') {
                    this.categories = categories.data.data
                }else{
                    this.categories = []
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
        },
        plusServiceGift(index, service, id, duration, commission, price, employes, valid, card, discount){
            if (card) {
                $('#G'+card).css({'border-bottom': 'solid 8px #174c8e'})
            }
            
            this.ifServicesG = true
            if (valid) {
                this.serviceCountG[index].count++
            }
            
            
            
            this.registerDateGift.serviceSelectds.push({commission: commission, duration: duration, price: price, discount: discount, id: '', name: service, service_id: id})

            
            this.totalPriceG = this.totalPriceG + price
        },
        lessServicePhone(index, price){
            this.registerDateGift.serviceSelectds.splice(index, 1)
            if (this.registerDateGift.serviceSelectds.length == 0) {
                this.ifServices = false
                
            }
            this.totalPriceG = this.totalPriceG - price
        },
        lessServiceGift(index, service, time, card, precio, count){
                if (count > 0) {
                    if (this.serviceCountG[index].count > 0) {
                        this.serviceCountG[index].count--
                        if (this.serviceCountG[index].count == 0) {
                            $('#G'+card).css({'border-bottom': 'solid 8px #e2e3de'})
                        }
                    }
                    for (var i = 0; i < this.registerDateGift.serviceSelectds.length; i++) {
                        if (this.registerDateGift.serviceSelectds[i].name == service ) {
                            this.registerDateGift.serviceSelectds.splice(i, 1)
                            break
                        }
                    }

                    if (this.registerDateGift.serviceSelectds.length == 0) {
                        this.ifServicesG = false
                    }

                    this.totalPriceG = this.totalPriceG - precio
                } 
            },
        async getServices(){
            try {
                const services = await axios.get(endPoint.endpointTarget+'/services/servicesForClients/'+this.branch, this.configHeader)
                if (services.data.status == 'ok') {
                    this.services = services.data.data 
                    for (let index = 0; index < this.services.length; index++) {
                        this.serviceCountG.push({count: 0})
                    }
                }else{
                    this.services = []
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
        },
        selectPayG(pay){
            $('.dropdownPay').text(pay)
            $('.dropdownPay').css({'color':'#090909'})
            this.registerClient.payG = pay
            this.validPayG = true
        },
        validateFirstStepG() {
                window.scrollTo(0, 0);
                var validService = true
                if (this.ifServicesG && validService) {
                    this.validWizard = true
                    return this.ifServicesG
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Debe seleccionar al menos un servicio',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    this.validWizard = false
                    return false
                }
                
            },
        fixedHours(duration){
            const hours = parseInt(duration / 60) + ' hr'
            const minutes = duration - (parseInt(duration / 60) * 60 )  + ' min'

            return hours+' '+minutes
        },
        formatPrice(value) {
            let val = (value/1)
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        selectCatG(cat){
            $('.categoryButton').css({'padding':'10px', 'background-color': '#d5dadd', 'color': '#434a54', 'box-shadow':'0px 0px 0px 0px rgba(0,0,0,0)'})
            $('#'+cat).css({'padding-top':'14px', 'background-color': '#174c8e', 'color': '#fff', '-webkit-box-shadow':'0px 9px 25px -7px rgba(0,0,0,0.75)', 'box-shadow':'0px 9px 25px -7px rgba(0,0,0,0.75)'})
        },  
        finalFunctionG(){
            if (this.validPayG) {
                if (this.registerClient.payG == 'Transferencia') {
                    this.modals.modal9 = true
                }else{
                    this.finallyAgendG()
                }
            }else{
                $('.dropdownPay').css({'color': 'red'})
                this.$swal({
                    icon: 'error',
                    title: 'Por favor, Seleccione el tipo de pago',
                    showConfirmButton: false,
                    timer: 3000
                })
            }
        },
        validRegister(){
            if (this.registerClient.firstName.length == 1) {
                this.registerClient.firstName = this.registerClient.firstName.toUpperCase()
            }

            if (this.registerClient.lastName.length == 1) {
                this.registerClient.lastName = this.registerClient.lastName.toUpperCase()
            }
            setTimeout(() => {
                if (this.registerClient.firstName != '' && this.registerClient.lastName != '' && this.registerClient.email != '' && this.registerClient.phone.isValid && this.registerClient.birthday != '') {
                    if (this.registerClient.email.split('@').length == 2) {
                        if (this.registerClient.email.split('@')[1].split('.').length >= 2) {
                            this.registerClient.valid = true
                        }else{
                            this.registerClient.valid = false
                        }
                    }else{
                        this.registerClient.valid = false
                    }
                }else{
                    this.registerClient.valid = false
                }
            }, 200);
            
        },
        async finallyAgendG(){
                this.ifDisabled = true
                this.spinningDate = true
                
                try {
                    const createOrder = await axios.post(endPoint.endpointTarget+'/orders',{
                        products: this.registerDateGift.serviceSelectds,
                        client: this.registerClient,
                        payType: this.registerClient.payG,
                        total: this.totalPriceG,
                        branch: {
                            branch: this.branch,
                            politics: this.configurations.giftCard,
                            name: this.configurations.businessName,
                            logo: this.configurations.businessLogo,
                            location: this.configurations.businessLocation
                        }
                    }, this.configHeader)

                        this.$swal({
                            icon: 'success',
                            title: '¡Todo listo!',
                            text: 'El cliente seleccionado recibira un correo con toda la información',
                            showConfirmButton: true
                        })
                        this.serviceCountG.forEach((element,index) => {
                            element.count = 0
                            $('#GcardS'+index).css({'border-bottom': 'solid 8px #e2e3de'})
                        });
                        this.$refs.wizardG.reset()
                        this.spinningDate = false
                        this.ifServicesG = false
                        this.registerDateGift.serviceSelectds = []
                        this.totalPriceG = 0
                        this.modals.modal8 = false
                        this.getOrders()
                } catch (error) {
                    console.log(error)
                }
                
            },
        async chooseClient(value){
            if (value) {
                try {
                    const getClient = await axios.get(`${endPoint.endpointTarget}/clients/findOne/${value}`, this.configHeader)
                    //this.newClient.text = "Editar cliente"
                    //this.ifEdit = true
                    // this.editClientId = getClient.data.data._id
                    this.registerClient.firstName = getClient.data.data.firstName
                    this.registerClient.lastName = getClient.data.data.lastName
                    this.registerClient.email = getClient.data.data.email
                    this.registerClient.phone = getClient.data.data.phone.formattedNumber
                    this.registerClient.instagram = getClient.data.data.instagram
                    // this.readyClient = false
                    this.registerClient.select = getClient.data.data.firstName + ' ' + getClient.data.data.lastName
                    this.registerClient.name = getClient.data.data.firstName + ' ' + getClient.data.data.lastName
                    // this.validRegister(2)
                    // this.registerClient.birthday = ''
                    console.log(this.registerClient)
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
            }else{
                this.newClient.text = "Nuevo cliente"
                this.registerClient.firstName = ""
                this.registerClient.select = "Seleccione"
                this.registerClient.lastName = ""
                this.registerClient.email = ""
                this.registerClient.birthday = ""
                this.registerClient.phone = {
                    "countryCode": "CL", 
                    "isValid": false, 
                    "phoneNumber": "", 
                    "countryCallingCode": "", 
                    "formattedNumber": "", 
                    "nationalNumber": "", 
                    "formatInternational": "", 
                    "formatNational": "", 
                    "uri": "", 
                    "e164": ""
                }
                this.registerClient.instagram = ""
                this.readyClient = true
                this.validRegister()
            }
        },
        getOrders(){
            this.totalPending = 0
            this.totalConfirmed = 0
            this.rowsUsed = 0

            axios.get(endPoint.endpointTarget+'/orders/pending', this.configHeader)
            .then(res => {
                this.rowsPending = res.data.data
                
                for (let i = 0; i < this.rowsPending.length; i++) {
                    const element = this.rowsPending[i].total;
                    
                    this.totalPending = parseFloat(this.totalPending)+parseFloat(element)
                    
                }

                this.totalOrder = this.totalPending
            }).catch(err =>{
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
            axios.get(endPoint.endpointTarget+'/orders/confirmed', this.configHeader)
            .then(res => {
                this.rowsConfirmed = res.data.data

                for (let i = 0; i < this.rowsConfirmed.length; i++) {
                    const element = this.rowsConfirmed[i].total;
                    
                    this.totalConfirmed = parseFloat(this.totalConfirmed)+parseFloat(element)
                }
                EventBus.$emit('pageLoaded', true)
            }).catch(err => {
                EventBus.$emit('pageLoaded', true)
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
            axios.get(endPoint.endpointTarget+'/orders/used', this.configHeader)
            .then(res => {
                this.rowsUsed = res.data.data
                
                for (let i = 0; i < this.rowsUsed.length; i++) {
                    const element = this.rowsUsed[i].total;

                    if (this.rowsUsed[i].status == 'used') {
                        this.totalUsed = parseFloat(this.totalUsed)+parseFloat(element)
                    }
                    
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
        },
        seeServices(services){
            this.orderServices = services
            this.modals.modal4 = true
        },
        changeOrderView(view){
            console.log("🚀 ~ file: Orders.vue ~ line 1274 ~ changeOrderView ~ view", view)
            if (view == 'confirm') {
                this.totalText = "Monto confirmado"
                this.totalOrder = this.totalConfirmed
            }
            if (view == 'pending') {
                this.totalText = "Monto por confirmar"
                this.totalOrder = this.totalPending
            }
            if (view == 'used') {
                this.totalText = "Monto usados"
                this.totalOrder = this.totalUsed
            }
        },
        changeOrderViewUsed(view){
            console.log("🚀 ~ file: Orders.vue ~ line 1274 ~ changeOrderView ~ view", view)
            if (view == 'confirm') {
                this.totalText = "Monto confirmado"
                this.totalOrder = this.totalConfirmed
            }
            if (view == 'pending') {
                this.totalText = "Monto por confirmar"
                this.totalOrder = this.totalPending
            }
            if (view == 'used') {
                this.totalText = "Monto usados"
                this.totalOrder = this.totalUsed
            }
        },
        registerClients(){
            var date = this.registerClient.birthday
            if (this.registerClient.birthday.split('-')[1]) {
                var split = this.registerClient.birthday.split('-')
                date = split[1]+'-'+split[0]+'-'+split[2]
            }
            var idRecomender = ''
            if (this.registerClient.recommender != '') {
                for (let i = 0; i < this.clientIds.length; i++) {
                    const spId = this.clientIds[i].split("-")
                    if (spId[0] == this.registerClient.recommender) {
                        idRecomender = spId[1]
                    } 
                }
            }
            var ifCheck = this.registerClient.discount ? 0 : 1
            axios.post(endPoint.endpointTarget+'/clients', {
                firstName: this.registerClient.firstName,
                lastName: this.registerClient.lastName,
                email: this.registerClient.email,
                recommender: this.registerClient.recommender,
                idRecommender: idRecomender,
                phone: this.registerClient.phone.isValid ? this.registerClient.phone : '',
                birthday: date,
                instagram: this.registerClient.instagram,
                ifCheck: ifCheck
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'client create') {
                    this.$swal({
                        icon: 'success',
                        title: 'Cliente registrado.',
                        text: 'Ya puede puede selecionarlo en el campo de selección de cliente',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    
                    this.modals.modal5 = false
                    // this.getClient()
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'El cliente ya existe.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }).catch(err =>{
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
        },
        confirmOrder(id){
            this.$swal({
                title: '¿Confirmar pedido?',
                text: '¡Recuerda! No es posible revertir esta acción',
                type: 'warning',
                icon:'warning',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
                showCloseButton: true,
                showLoaderOnConfirm: true
            })
            .then(result => {
                if (result.value) {
                    axios.put(endPoint.endpointTarget+'/orders/confirmorder/' + id,{}, this.configHeader)
                    .then(res => {
                            this.$swal({
                                icon: 'success',
                                title: 'Confirmado con éxito',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.getOrders()
                    })
                    .catch(err => {
                    console.log("🚀 ~ file: Orders.vue ~ line 1349 ~ confirmOrder ~ err", err)
                        
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
                }
            })
        },
        handleSearch(selectedKeys, confirm, dataIndex) {
            confirm();
            this.searchText = selectedKeys[0];
            this.searchedColumn = dataIndex;
        },
        handleReset(clearFilters) {
            clearFilters();
            this.searchText = '';
        },
        MaysPrimera(string){
			return string.charAt(0).toUpperCase() + string.slice(1);
        },
        initialState(val){
            this.registerClient= {
                name:'',
                id:'',
                contactOne:'',
                discount:false,
                contactTwo:'',
                recommender:null,
                valid:false
            }
            if (val == 1) {
                this.modals = {
                    modal1: false,
                    modal2:false,
                    modal3:false,
                }
            }
            if (val == 2) {
                this.tipeForm = 'Registrar'
            }
            if (val == 3) {
                this.tipeForm = 'Editar'
            }
        },
        pushData(nombre,id,correo,ig,participacion,recomendacion,recomendaciones,ultimaFecha,fecha,_id){
            this.registerClient= {
                name:nombre,
                id:id,
                contactOne:correo,
                discount:false,
                contactTwo:ig,
                recommender:recomendacion,
                valid:true,
                valid2:true,
                recommenders:recomendaciones,
                lastDate:this.formatDate(ultimaFecha),
                date:this.formatDate(fecha),
                participation:participacion,
                _id:_id
            }

        },
        formatDate(date) {
            let dateFormat = new Date(date)
            dateFormat.setDate(dateFormat.getDate() +1)
            return moment(dateFormat).format("DD-MM-YYYY")
        },
        formatDates(date){
            let dateFormat = new Date(date)
            return moment(dateFormat).format("DD-MM-YYYY")
        },
        deleteClient(id){
			this.$swal({
				title: '¿Está seguro de borrar el cliente?',
				text: 'No puedes revertir esta acción',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Estoy seguro',
				cancelButtonText: 'No, evitar acción',
				showCloseButton: true,
				showLoaderOnConfirm: true
			}).then((result) => {
				if(result.value) {
					axios.put(endPoint.endpointTarget+'/clients/deleteClient/'+id)
					.then(res => {
                        if (res.data.status == 'ok') {
                            this.modals = {
                                modal2: true,
                                message: "Cliente borrado con éxito",
                                icon: 'ni ni-check-bold ni-5x',
                                type: 'success'
                            }
                            setTimeout(() => {
                                this.modals = {
                                    modal1: false,
                                    modal2: false,
                                    modal3:false,
                                    message: "",
                                    icon: '',
                                    type:''
                                }
                                this.getClients()
                                // EventBus.$emit('reloadClients', 'reload')
                            }, 1500);
							// this.getClientsThree()
							// this.ServicesQuantityChartFunc();
							// this.emitMethodTwo()
						}
					}).catch(err =>{
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
				}
				else{
					this.modals = {
                        modal2: true,
                        message: "Acción cancelada",
                        icon: 'ni ni-check-bold ni-5x',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3:false,
                            message: "",
                            icon: '',
                            type:''
                        }
                    }, 1500);
				}
			})
        },
        clientEdit(){
            axios.put(endPoint.endpointTarget+'/clients/'+this.registerClient._id, {
                nombreClienteEditar: this.registerClient.name,
                identidadClienteEditar: this.registerClient.id,
                correoClienteEditar: this.registerClient.contactOne,
                instagramClienteEditar: this.registerClient.contactTwo,
            })
            .then(res => {
                if (res.data.status == 'Servicio actualizado') {
                    this.modals = {
                        modal2: true,
                        message: "el cliente editó con éxito",
                        icon: 'ni ni-check-bold ni-5x',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3:false,
                            message: "",
                            icon: '',
                            type:''
                        }
                        this.getClients();
                        this.initialState(1)
                        // EventBus.$emit('reloadClients', 'reload')
                    }, 1500);
                }else{
                    this.modals = {
                        modal2: true,
                        message: "El cliente ya existe",
                        icon: 'ni ni-fat-remove ni-5x',
                        type: 'danger'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3:false,
                            message: "",
                            icon: '',
                            type: ''
                        }
                    }, 1500);
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
        },
        showFilter(){
            $('.tableClient .vbt-table-tools').toggle()
        },
        validRoute(route, type){
            for (let index = 0; index < this.auth.length; index++) {
                const element = this.auth[index];
                if (element.ruta == route) {
                    for (let i = 0; i < element.validaciones.length; i++) {
                        if (type == element.validaciones[i]) { 
                            return true
                        } 
                    }
                }
            }
        },
        selectTemplate(select){
            this.modals = {
                modal1: false,
                modal2: false,
                modal3:false,
                message: "",
                icon: '',
                type: ''
            }
            setTimeout(() => {
               localStorage.setItem('selectTemplate', select)
                router.push({path: 'Correo'}) 
            }, 200);
			
        },
        confirmar(){
            axios.put(endPoint.endpointTarget+'/pedidos/'+this.idPedido, {
                nombreClienteEditar: this.registerClient.name,
                identidadClienteEditar: this.registerClient.id,
                correoClienteEditar: this.registerClient.contactOne,
                instagramClienteEditar: this.registerClient.contactTwo,
            })
            .then(res => {
                if (res.data.status == 'Servicio actualizado') {
                    axios.post(endPoint.endpointTarget+'/pedidos/sendEmailPedido',{
                        to : this.identidadPedido,
                        code : this.codePedido,
                        article : this.articuloPedido,
                        client: this.clientePedido
                    })
                    this.modals = {
                        modal2: true,
                        message: "Pedido confirmado",
                        icon: 'ni ni-check-bold ni-5x',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3:false,
                            message: "",
                            icon: '',
                            type:''
                        }
                        this.getOrders();
                        this.initialState(1)
                        // EventBus.$emit('reloadClients', 'reload')
                    }, 1500);
                }else{
                    this.modals = {
                        modal2: true,
                        message: "Falla de conexion a internet",
                        icon: 'ni ni-fat-remove ni-5x',
                        type: 'danger'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3:false,
                            message: "",
                            icon: '',
                            type: ''
                        }
                    }, 1500);
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
        },
        
        formatCaducity(date) {
            let dateFormat = new Date(date)
            dateFormat.setDate(dateFormat.getDate() + 7)
            return moment(dateFormat).format("DD-MM-YYYY")
        },
        formatPrice(value) {
          let val = (value/1).toFixed(2).replace('.', ',')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },

    },
    mounted (){
        EventBus.$on('changeBranch/pedidos', (status) => {
            this.getOrders()
        })
    },
    computed: {
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 280 }
        },
        screenWidthInput: () => {
            return screen.width < 780 ? "w-100" : "w-50"
        },
    },
  };
</script>
<style lang="scss">
    .card-header{
        font-size: 2.5vw;
    }
    .cursor-pointer{
        cursor: pointer;
    }
    .positionAlert{
        position: absolute;
        top:14%;
        left: 32%;
        z-index: 100000;
    }
    .tableClient .vbt-table-tools{
        display:none;
    }
    .tableClient .vbt-table-tools .vbt-global-search .form-group{
        width: 30%;
    }
    .template{
		padding: 2px;
		// background-color: #e4e8ec;
		cursor: pointer;
		-webkit-transition: all 0.5s ease-out;
        opacity:.6;
	}
	.template:hover{
		background-color: rgb(90, 90, 90);
        opacity:1;
	}

</style>