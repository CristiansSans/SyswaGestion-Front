<template>
    <nav :style="screen < 768 ? 'padding:0%' : 'padding:2%'" class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white" id="sidenav-main">
        <div class="container-fluid">

            <!--Toggler-->
            <navbar-toggle-button v-if="screen < 768" style="margin-bottom: 3%;" @click.native="showSidebar">
                <span class="navbar-toggler-icon"></span>
            </navbar-toggle-button>
            <navbar-toggle-button v-else @click.native="showSidebar">
                <span class="navbar-toggler-icon"></span>
            </navbar-toggle-button>
            
            <img v-if="screen < 768" style="width:0%;margin-left: 40px;margin-bottom: 3%;" :src="logo" alt="...">
            <img v-else style="width: 100%" :src="logoB" alt="...">
            
            <slot name="mobile-right">
                <ul class="nav align-items-center d-md-none">
                    <li class="nav-item dropdown">
              <a v-on:click="validateNotifications()" class="nav-link" role="button" data-toggle="dropdown" shape="circle" aria-haspopup="true" aria-expanded="false">
                <i class="ni ni-bell-55" :class="pxSep" style="font-size:18px;z-index:1;"></i>
                <badge v-if="activeNotifications > 0" class="notifyNumber text-white" type="primary" style="font-size:14px;z-index:2;background-color: rgba(61, 141, 242, 1);">{{activeNotifications}}</badge>
              </a>
            <div style="z-index:10000; min-width: 350px; right: -100px;" class="dropdown-menu dDesteM  dropdown-menu-xl  dropdown-menu-right  py-0 overflow-hidden">
              
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
                    <li class="nav-item" :disabled="validRoute('sucursales', 'cambiar') ? false : true">
                      <base-dropdown position="right">
                        <a slot="title" class="nav-link" href="#" role="button">
                          <div class="media align-items-center">
                            <a-button type="primary" shape="circle">
                              {{branchName[0]}} 
                            </a-button>
                          </div>
                        </a>
                        <template v-for="branch of branches">
                          <a-button type="link" :key="branch._id+'/'+branch.name" v-if="branch.active" class="dropdown-item" @click="selectBranch(branch._id+'/'+branch.name)">{{branch.name}} </a-button>
                        </template>
                      </base-dropdown>
                    </li>
                    <li class="nav-item">
                      <base-dropdown  position="right">
                          <a slot="title" class="nav-link" href="#" role="button">
                              <div class="media align-items-center">
                                <span class="avatar avatar-sm rounded-circle">
                                  <img alt="Image placeholders" style="width:30px;height:30px;"  v-if="haveImage == ''" src="img/theme/profile-default.png">
                                  <img alt="Image placeholdesr" style="width:30px;height:30px;"  v-else :src="imgUser">
                                  
                                </span>
                              </div>
                          </a>

                          <div class=" dropdown-header noti-title">
                              <h6 class="text-overflow m-0">Bienvenido!</h6>
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
                          <div class="dropdown-divider"></div>
                          <router-link to="/login" class="dropdown-item">
                              <i class="ni ni-user-run"></i>
                              <span>Cerrar sesión</span>
                          </router-link>
                      </base-dropdown>
                    </li>
                </ul>
            </slot>
            <slot></slot>
            <div v-if="loader" class="preloader">
              <div class="preloader-body">
                <div class="cssload-container">
                  <div class="cssload-speeding-wheel"></div>
                  <h1>Cargando sucursal</h1>
                </div>
              </div>
            </div>
            <div v-show="$sidebar.showSidebar" class="navbar-collapse collapse show pt-0" id="sidenav-collapse-main">

                <div class="navbar-collapse-header d-md-none">
                    <div class="row">
                        <div class="col-6 collapse-brand">
                            <router-link to="/">
                                <img style="width: 100%; height: auto;" :src="logo">
                            </router-link>
                        </div>
                        <div class="col-6 collapse-close">
                            <navbar-toggle-button @click.native="closeSidebar"></navbar-toggle-button>
                        </div>
                    </div>
                </div>

                <ul class="navbar-nav">
                    <slot name="links">
                    </slot>
                </ul>
            </div>
            </div>
    </nav>
</template>
<script>
  import NavbarToggleButton from '@/components/NavbarToggleButton'
  import endPoint from '.../../../config-endpoint/endpoint.js'
  import EventBus from '../EventBus'
  import io from 'socket.io-client';
  import router from '../../router'
  import { Empty } from 'ant-design-vue'
  import axios from 'axios'
  import jwtDecode from 'jwt-decode'
  import vueCustomScrollbar from 'vue-custom-scrollbar'
  export default {
    name: 'sidebar',
    components: {
      NavbarToggleButton,
      vueCustomScrollbar
    },
    data() {
      return {
        socket : io(endPoint.endpointTarget),
        haveImage: localStorage.imageUser,
        activeNotifications: 0,
        imgUser:  localStorage.imageUser,
        idUser: localStorage._id,
        screen: screen.width,
        auth: [],
        loader: false,
        notifications: [],
        all: true,
        pxSep: '',
        branches: [],
        branchName: localStorage.branchName,
        branch: localStorage.branch
      }
    },
    props: {
      logo: {
        type: String,
        default: 'img/brand/syswa-gestion2.png',
        description: 'Sidebar app logo'
      },
      logoB: {
        type: String,
        default: 'img/brand/syswa-gestion2.png',
        description: 'Sidebar app logo'
      },
      autoClose: {
        type: Boolean,
        default: true,
        description: 'Whether sidebar should autoclose on mobile when clicking an item'
      }
    },
    provide() {
      return {
        autoClose: this.autoClose
      };
    },
    beforeCreate() {
      this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
    },
    created(){
      this.getToken()
      this.getBranches()
      this.getNotifications()
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
      getAll() {
        const configHeader = {
          headers: {
              "x-database-connect": endPoint.database, 
              "x-access-token": localStorage.userToken
          }
        }
        setTimeout(() => {
          $(".dDesteM").dropdown('toggle')
        }, 100);
        axios.get(endPoint.endpointTarget+'/notifications/getall/'+ this.idUser, configHeader) 
        .then(res => {
          this.notifications = res.data.data
          this.all = false
        })
      },
      pushLink(link){
        var valid = false
        var valid2 = false
        if(router.app._route.path == "/agendamiento"){
          valid = true 
        }if(router.app._route.path == "/Ventas"){
          valid2 = true
        }
        router.push(link)
        setTimeout(() => {
          if(valid){
            EventBus.$emit('notifyLink', 'reload') 
          }if(valid2){
            EventBus.$emit('notifyLinkSales', 'reload') 
          }
        }, 1000);
      },
      formatDetail(detail,notification){
        if (detail.includes('~')) {
          return detail.split('~')[0]
        }
        else{
          return detail
        }
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
      closeSidebar() {
        this.$sidebar.displaySidebar(false)
      },
      showSidebar() {
        this.$sidebar.displaySidebar(true)
      },
      validRoutee(route){
        for (let index = 0; index < this.auth.length; index++) {
          const element = this.auth[index];
          if (element.ruta == route) {
            return true
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
      selectBranch(value){
        if (value.split('/')[0] != this.branch) {
          this.loader = true
          localStorage.setItem('branch', value.split('/')[0])
          localStorage.setItem('branchName', value.split('/')[1])
          this.branch = value.split('/')[0]
          this.branchName = value.split('/')[1]
          EventBus.$emit('changeBranch'+router.app._route.path.toLowerCase(), router.app._route.path)
        }
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
      }
    },
    mounted() {
      EventBus.$on('pageLoaded', (status) => {
        if (status) {
          this.loader = false
        }
      })
      EventBus.$on('loggedin', status => {
        this.getToken()
      })
      this.socket.on('notify', (data) => {
        this.notifications.push(data)
        this.activeNotifications++
      });
    },
    beforeDestroy() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.showSidebar = false;
      }
    }
  };
</script>
