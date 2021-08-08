export default class Global_Manager{
    constructor(){
    }
  
  
    init(){

        // Entities Variables
        globalThis.collList = [];
        globalThis.objects = {};
        globalThis.locations = {};

        // Global Engine Variables
        globalThis.times = [];
        globalThis.fps = 0;

        // Global Label Variables
        globalThis.labelH = 21;
        globalThis.labelOffset = 9;

        // Global Score Variables
        globalThis.bounces = 0;

        // Global Grid Variables
        globalThis.gX = 45;
        globalThis.gY = 45;
        globalThis.grWidth = 16;
        globalThis.grHeight = 16;

        // Mouse Positions
        globalThis.MouseX = 0;
        globalThis.MouseY = 0;
        globalThis.activeCanvas = null;

        // Button Events
        globalThis.buttons = [];
        globalThis.Btn = null;
        globalThis.hoveredButton = false;
        globalThis.clickHold = false;

    }


    global_var(_value){
        globalThis._value;
    }


  }