function Lane(iConfig)
{
	var Config={
        Index:0,
        Next:[],
        Reverse:false,
        Position:new THREE.Vector3(0,0,0),
        TargetSpeed:100,
        OnRunCallBack:function(){},
        RunCallBack:function(){}
    };
    Config=$.extend(Config,iConfig);

    var FrontRaycaster=new THREE.Raycaster();
    var BackRaycaster=new THREE.Raycaster();

    FrontRaycaster.set(
                new THREE.Vector3((-530+Config.Position.x)*((Config.Reverse)?-1:1),0+Config.Position.y,1+Config.Position.z),
                new THREE.Vector3(1*((Config.Reverse)?-1:1),0,0)
            );
    FrontRaycaster.far=1060;
    BackRaycaster.set(
                new THREE.Vector3((530+Config.Position.x)*((Config.Reverse)?-1:1),0+Config.Position.y,1+Config.Position.z),
                new THREE.Vector3(-1*((Config.Reverse)?-1:1),0,0)
            );
    BackRaycaster.far=1060;

    this.Index=Config.Index;
    this.Next=Config.Next;
    var CanPutCarTime=Rand(20);
    var CanPutCarTimeMax=Config.TargetSpeed/3.6;
    this.CanPutCar=false;
    this.Reverse=Config.Reverse;
    this.Position=Config.Position;
    this.TargetSpeed=Config.TargetSpeed;
    //this.FrontDistance=1000;
    //this.BackDistance=1000;


    this.PutCar=function(){

    	CanPutCarTime=0;
    	CanPutCarTimeMax=Config.TargetSpeed/3.6*3 + Rand(60);
    	this.CanPutCar=false;
    };


    this.UpdateDistance=function(){


    };


    this.Run=function(){

    	if(!this.CanPutCar)
    		CanPutCarTime+=(Math.abs(-SystemRelativePosition.x + this.TargetSpeed/60/3.6)*0.75+UserMileagePer*0.25) * SystemStepPer;
    	
    	if(CanPutCarTime>CanPutCarTimeMax)
    		this.CanPutCar=true;

    };

}