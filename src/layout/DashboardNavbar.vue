<template>
    <base-nav class="navbar-top sticky-top navbar-dark"
              id="navbar-main"
              :show-toggle-button="false"
              expand>
        <!-- <form class="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <div class="form-group mb-0">
                <base-input placeholder="Search"
                            class="input-group-alternative"
                            alternative=""
                            addon-right-icon="fas fa-search">
                </base-input>
            </div>
        </form> -->
        
        <ul class="navbar-nav align-items-center  ml-md-auto ">
          <li class="nav-item">
            <a-dropdown :disabled="validRoute('sucursales', 'cambiar') ? false : true">
              <a-menu slot="overlay" @click="selectBranch">
                <template v-for="branch of branches">
                  <a-menu-item class="font-weight-bold" :key="branch._id+'/'+branch.name" v-if="branch.active"> 
                    <a-icon type="shop" style="vertical-align:1px;" />{{branch.name}} 
                  </a-menu-item>
                </template>
              </a-menu>
              <a-button class="mb-2 bg-default text-white font-weight-bold w-100" style="border:none;" > {{branchName}} <a-icon type="down" style="vertical-align:1px;" /> </a-button>
            </a-dropdown>
          </li>
          <li class="nav-item dropdown">
              <a v-on:click="validateNotifications()" class="nav-link" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="ni ni-bell-55" :class="pxSep" style="font-size:18px;z-index:1;"></i>
                <badge v-if="activeNotifications > 0" class="notifyNumber text-white" type="primary" style="font-size:14px;z-index:0;">{{activeNotifications}}</badge>
              </a>
            <div style="z-index:10000" class="dropdown-menu dDeste  dropdown-menu-xl  dropdown-menu-right  py-0 overflow-hidden">
              
              <!-- List group -->
              <vue-custom-scrollbar class="w-100" style="height:50vh;overflow:hidden;overflow-x: hidden;overflow-y:hidden;">
              <div class="list-group list-group-flush" style="z-index:10000">
                
                <a v-for="notification in notifications" :key="notification._id" href="#!" class="list-group-item list-group-item-action">
                  
                    <div v-on:click="pushLink(notification.link)" class="row align-items-center">
                      <div class="col-auto">
                        <!-- Avatar -->
                        <img alt="Image placeholder" v-if="notification.userImg == '' || notification.userImg == null" src="img/theme/profile-default.png" class="avatar rounded-circle">
                        <img alt="Image placeholder" v-else :src="notification.userImg" class="avatar rounded-circle">
                      </div>
                      <div class="col ml--2">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <h4 class="mb-0 text-sm">{{notification.userName}}</h4>
                          </div>
                          <div class="text-right text-muted">
                            <small>{{notification.createdAt | moment("from", "now")}}</small>
                          </div>
                        </div>
                        <p class="text-sm mb-0">{{formatDetail(notification.detail)}} <br> {{notification.detail.split('~')[1]}}</p>
                      </div>
                    </div>
                </a>
                
                <a-empty v-if="notifications.length == 0" :image="simpleImage">
                  <span slot="description"> No posees notificaciones nuevas </span>
                  
                </a-empty>
              </div>
              </vue-custom-scrollbar>
              <!-- View all -->
              <span v-on:click="getAll" v-if="all" style="cursor:pointer" class="dropdown-item-text text-center text-primary font-weight-bold py-3">Ver todas</span>
              
            </div>
          </li>
          <!-- <li class="nav-item dropdown">
            <a class="nav-link" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="ni ni-ungroup"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-dark bg-default  dropdown-menu-right ">
              <div class="row shortcuts px-4">
                <a href="#!" class="col-4 shortcut-item">
                  <span class="shortcut-media avatar rounded-circle bg-gradient-red">
                    <i class="ni ni-calendar-grid-58"></i>
                  </span>
                  <small>Calendar</small>
                </a>
                <a href="#!" class="col-4 shortcut-item">
                  <span class="shortcut-media avatar rounded-circle bg-gradient-orange">
                    <i class="ni ni-email-83"></i>
                  </span>
                  <small>Email</small>
                </a>
                <a href="#!" class="col-4 shortcut-item">
                  <span class="shortcut-media avatar rounded-circle bg-gradient-info">
                    <i class="ni ni-credit-card"></i>
                  </span>
                  <small>Payments</small>
                </a>
                <a href="#!" class="col-4 shortcut-item">
                  <span class="shortcut-media avatar rounded-circle bg-gradient-green">
                    <i class="ni ni-books"></i>
                  </span>
                  <small>Reports</small>
                </a>
                <a href="#!" class="col-4 shortcut-item">
                  <span class="shortcut-media avatar rounded-circle bg-gradient-purple">
                    <i class="ni ni-pin-3"></i>
                  </span>
                  <small>Maps</small>
                </a>
                <a href="#!" class="col-4 shortcut-item">
                  <span class="shortcut-media avatar rounded-circle bg-gradient-yellow">
                    <i class="ni ni-basket"></i>
                  </span>
                  <small>Shop</small>
                </a>
              </div>
            </div>
          </li> -->
        </ul>
        <div v-if="loader" class="preloader">
          <div class="preloader-body">
            <div class="cssload-container">
              <div class="cssload-speeding-wheel"></div>
              <h1>Cargando sucursal</h1>
            </div>
          </div>
        </div>
        <ul class="navbar-nav align-items-center d-none d-md-flex">
            <li class="nav-item dropdown">
                <base-dropdown class="nav-link pr-0">
                    <div class="media align-items-center" slot="title">
                <span class="avatar avatar-sm rounded-circle">
                  <img alt="Image placeholders" style="width:30px;height:30px;"  v-if="haveImage == ''" src="img/theme/profile-default.png">
                  <img alt="Image placeholdesr" style="width:30px;height:30px;"  v-else :src="imgUser">
                </span>
                        <div style="cursor:pointer" class="media-body ml-2 d-none d-lg-block">
                            <span class="mb-0 text-sm  font-weight-bold">{{nombre}}</span>
                        </div>
                    </div>

                    <template>
                        <div class=" dropdown-header noti-title">
                            <h6 class="text-overflow m-0">¡Bienvenido!</h6>
                        </div>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-single-02"></i>
                            <span>Mi perfil</span>
                        </router-link>
                        <router-link v-if="validRoutee('sucursales')" to="/sucursales" class="dropdown-item">
                            <a-icon type="shop" style="vertical-align:1px;" />
                            <span>Sucursales</span>
                        </router-link>
                        <router-link v-if="validRoutee('bodega')" to="/store" class="dropdown-item">
                            <i class="ni ni-box-2"></i>
                            <span>Bodega</span>
                        </router-link>
                        <!-- <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-calendar-grid-58"></i>
                            <span>Actividad</span>
                        </router-link> -->
                        <!-- <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-support-16"></i>
                            <span>Soporte</span>
                        </router-link> -->
                        <div class="dropdown-divider"></div>
                        <router-link to="/login" class="dropdown-item">
                            <i class="ni ni-user-run"></i>
                            <span>Cerrar sesión</span>
                        </router-link>

                        
                    </template>
                </base-dropdown>
            </li>
        </ul>
    </base-nav>
    
</template>
<script>
  //Back - End 
  import axios from 'axios'
  import endPoint from '../../config-endpoint/endpoint.js'
  import EventBus from '../components/EventBus'
  import io from 'socket.io-client';
  import router from '../router'
  import jwtDecode from 'jwt-decode'
  import { Empty } from 'ant-design-vue';
  import vueCustomScrollbar from 'vue-custom-scrollbar'

  export default {
    components: {
        vueCustomScrollbar
    },
    data() {
      return {
        socket : io(endPoint.endpointTarget),
        activeNotifications: 0,
        showMenu: false,
        searchQuery: '',
        loader: false,
        nombre: localStorage.firstname + ' ' + localStorage.lastname,
        imgUser: localStorage.imageUser,
        haveImage: localStorage.imageUser,
        idUser: localStorage._id,
        imgEndpoint: endPoint.imgEndpoint,
        secondDetail:'',
        notifications: [],
        count:0,
        all: true,
        pxSep: '',
        branches: [],
        branchName: localStorage.branchName,
        branch: localStorage.branch,
        auth: []
      };
    },
    beforeCreate() {
      this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
    },
    created() {
      this.getNotifications()
      this.getBranches()
    },
    methods: {
      pushLink(link){
        var valid = false
        var valid2 = false
        if(router.app._route.path.toLowerCase() == "/ventas"){
          valid2 = true
        }
        router.push(link)
        setTimeout(() => {
          EventBus.$emit('notifyLink', 'reload')
          if(valid2){
            EventBus.$emit('notifyLinkSales', 'reload') 
          }
        }, 1000);
      },
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      getToken(){
        const token = localStorage.userToken
        if (token) {
          const decoded = jwtDecode(token)
          this.auth = decoded.access
          this.branch = localStorage.branch
          for (const branch of this.branches) {
            if (branch._id == this.branch) {
              this.branchName = branch.name
              localStorage.setItem('branchName', this.branchName)
              break
            }
          }
        }
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
      validRoutee(route){
        for (let index = 0; index < this.auth.length; index++) {
          const element = this.auth[index];
          if (element.ruta == route) {
            return true
          }
        }
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
        
      },
      formatDetail(detail,notification){
        if (detail.includes('~')) {
          return detail.split('~')[0]
        }
        else{
          return detail
        }
      },
      selectBranch(value){
        
        if (value.key.split('/')[0] != this.branch) {
          this.loader = true
          localStorage.setItem('branch', value.key.split('/')[0])
          localStorage.setItem('branchName', value.key.split('/')[1])
          this.branch = value.key.split('/')[0]
          this.branchName = value.key.split('/')[1]
          EventBus.$emit('changeBranch'+router.app._route.path.toLowerCase(), router.app._route.path)
        }
      },
      async getBranches() {
        const configHeader = {
          headers: {
              "x-database-connect": endPoint.database, 
              "x-access-token": localStorage.userToken
          }
        }
        try {
          const getBranches = await axios.get(endPoint.endpointTarget+'/branches', configHeader)
          if (getBranches.data.status == 'ok') {
            this.branches = getBranches.data.data
            this.getToken()
          }
        }catch(err){console.log(err)}
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      getNotifications(){
        const configHeader = {
          headers: {
              "x-database-connect": endPoint.database, 
              "x-access-token": localStorage.userToken
          }
        }
        axios.get(endPoint.endpointTarget+'/notifications/noviews/'+this.idUser, configHeader) 
        .then(res => {
          this.notifications = res.data.data
          this.activeNotifications = res.data.data.length
          if (this.activeNotifications < 10) {
            this.pxSep = "pxSix"
          }else if (this.activeNotifications < 100) {
            this.pxSep = "pxSixPlus"
          }else if (this.activeNotifications < 999) {
            this.pxSep = "pxSixPlusTwo"
          }
          this.all = true
        })
      },
      validateNotifications(){
        const configHeader = {
          headers: {
              "x-database-connect": endPoint.database, 
              "x-access-token": localStorage.userToken
          }
        }
        axios.get(endPoint.endpointTarget+'/notifications/validateviews/'+this.idUser, configHeader) 
        .then(res => {
          this.notifications = res.data.data
          this.activeNotifications = 0
          this.all = true
        })
      },
      getAll() {
        const configHeader = {
          headers: {
              "x-database-connect": endPoint.database, 
              "x-access-token": localStorage.userToken
          }
        }
        setTimeout(() => {
          $(".dDeste").dropdown('toggle')
        }, 100);
        axios.get(endPoint.endpointTarget+'/notifications/getall/'+ this.idUser, configHeader) 
        .then(res => {
          this.notifications = res.data.data
          this.all = false
        })
      },

    },
    mounted() {
      EventBus.$on('loggedin', status => {
        this.getBranches()
      })
      EventBus.$on('dataChange', (status) => {
        this.nombre = status.name + ' ' + status.lastname
        if (status.image != "") {
          this.imgUser = status.image
        }
      })
      EventBus.$on('newBranch', status => {
        this.getBranches()
      })
      EventBus.$on('pageLoaded', (status) => {
        if (status) {
          this.loader = false
        }
      })
      this.socket.on('notify', (data) => {
        this.notifications.push(data)
        this.activeNotifications++
      });
    }
  };
</script>
<style lang="scss">
  .pxSix{margin-right: 6px}
  .pxSixPlus{margin-right: 10px}
  .pxSixPlusTwo{margin-right: 16px}

  
</style>