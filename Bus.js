
var DebugClock=new THREE.Clock();
var DebugClockStart=false;
var DebugTime=0;

function Bus(iConfig)
{
	var MassOffset=new THREE.Vector3(0,0,0.5);
	var Config={
        Mass:15000,
        EngineForce:18000*4,
        BrakeForce:/*150*/800,			//煞車速度
        AiTargetLaneYOffsetMax:0.5,
        AiResetZOffset:1,
		Gear:[	
            {
				Reverse:true,   //倒退檔
				TargetSpeed:60,
                TorquePer:0.5              //扭力比例
			},						//齒輪設定
			{
				Reverse:false,
				TargetSpeed:60,
                TorquePer:0.55              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:88,
                TorquePer:0.45              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:116,
                TorquePer:0.4              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:144,
                TorquePer:0.35              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:172,
                TorquePer:0.3              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:200,
                TorquePer:0.25              //扭力比例
            }
        ],
        WheelOptions:{
            radius: 0.55 ,
            directionLocal: new CANNON.Vec3(0, 0, -1),
            suspensionStiffness: 30,
            //suspensionRestLength: 0.5,
            suspensionRestLength: 0.0,
            frictionSlip: 3*0.9*0.7*0.7*2,
            dampingRelaxation: 2.3/2,
            dampingCompression: 4.4/2,
            maxSuspensionForce: 100000,
            rollInfluence:  /*0.01*/0.25*1.5,
            axleLocal: new CANNON.Vec3(0, 1, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(0,0,0),
            maxSuspensionTravel: 0.0,
            customSlidingRotationalSpeed: -60,  //輪胎沒阻力的時候最高轉速
            useCustomSlidingRotationalSpeed: true
        },
        Wheel:[
            {
                Power:false,
                Steer:true,
                Position:new THREE.Vector3(-3.43,-2.495/2+0.2,-0.95),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:false,
                Steer:true,
                Position:new THREE.Vector3(-3.43,2.495/2-0.2,-0.95),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(2.73,-2.495/2+0.2,-0.95),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(2.73,2.495/2-0.2,-0.95),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            }
        ],
        CameraOptions:{
            Default:{
                Position:new THREE.Vector3(0,4,13),
                SpeedAdd:new THREE.Vector3(0,0.5,0.5),
                SpeedPer:new THREE.Vector3(0,1,1),
                RotationEffect:0.15
            },
            LookBack:{
                Position:new THREE.Vector3(0,4,18)
            },
            LookLeft:{
                Position:new THREE.Vector3(0,4,10)
            },
            LookRight:{
                Position:new THREE.Vector3(0,4,10)
            },
            FOV:{
                Position:new THREE.Vector3(0,0.8,-1),
                SpeedAdd:new THREE.Vector3(0,0,0.8),
                SpeedPer:new THREE.Vector3(1,1,0),
                RotationEffect:0.15
            },
            Ended:{
                Position:new THREE.Vector3(2,0,-10)
            },
        },
        OnRunCallBack:function(){},
        RunCallBack:RunCallBack,
        TakeBreak:TakeBreak,
        UnTakeBreak:UnTakeBreak,
        ResetCallBack:ResetCallBack
    };

    //質量偏移
    Config.CameraOptions.Default.Position.x+=MassOffset.y;
    Config.CameraOptions.Default.Position.y+=MassOffset.z;
    Config.CameraOptions.Default.Position.z+=MassOffset.x;

    Config.CameraOptions.LookBack.Position.x+=MassOffset.y;
    Config.CameraOptions.LookBack.Position.y+=MassOffset.z;
    Config.CameraOptions.LookBack.Position.z+=MassOffset.x;

    Config.CameraOptions.LookLeft.Position.x+=MassOffset.y;
    Config.CameraOptions.LookLeft.Position.y+=MassOffset.z;
    Config.CameraOptions.LookLeft.Position.z+=MassOffset.x;

    Config.CameraOptions.LookRight.Position.x+=MassOffset.y;
    Config.CameraOptions.LookRight.Position.y+=MassOffset.z;
    Config.CameraOptions.LookRight.Position.z+=MassOffset.x;

    Config.CameraOptions.FOV.Position.x+=MassOffset.y;
    Config.CameraOptions.FOV.Position.y+=MassOffset.z;
    Config.CameraOptions.FOV.Position.z+=MassOffset.x;

    Config.CameraOptions.Ended.Position.x+=MassOffset.y;
    Config.CameraOptions.Ended.Position.y+=MassOffset.z;
    Config.CameraOptions.Ended.Position.z+=MassOffset.x;
    
    for(var i=0;i<Config.Wheel.length;i++)
    {
        Config.Wheel[i].Position.x+=MassOffset.x;
        Config.Wheel[i].Position.y+=MassOffset.y;
        Config.Wheel[i].Position.z+=MassOffset.z;
    }

    Config=$.extend(Config,iConfig);

    //繼承Car
    this.prototype=Object.create(Car.prototype);
    Car.call(this,Config);

    var ThisBus=this;

    this.BodySize=new CANNON.Vec3(12.5,2.5,10);

    /*var geometry = new THREE.BoxBufferGeometry(3.9, 1.4, 0.6);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(0,0,0.3);
    this.MeshGroup.add(cube);
    
    var geometry = new THREE.BoxBufferGeometry(3.9-0.6, 1.4, 0.6);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(0,0,0.3);
    this.MeshGroup.add(cube);
    
    var geometry = new THREE.CylinderBufferGeometry(0.6/2,0.6/2,1.4);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(-1.65,0,0.3);
    this.MeshGroup.add(cube);
    
    var geometry = new THREE.CylinderBufferGeometry(0.6/2,0.6/2,1.4);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(1.65,0,0.3);
    this.MeshGroup.add(cube);*/
    
	
    /*var geometry = new THREE.BoxBufferGeometry(1.7, 1.3, 0.7);
	var material = new THREE.MeshLambertMaterial( {color: 0xDDDDDD} );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.set(0.3,0,0.6);
    this.MeshGroup.add(cube);*/
    
    

    var CarModelGroup=new THREE.Group();
    CarModelGroup.add(DeepClone(BusModel[0]));
    CarModelGroup.rotation.x=90*Math.PI/180;
    CarModelGroup.position.x=-12.2/2;
    CarModelGroup.position.y=-2.5/2;
    CarModelGroup.position.z=-1;
    this.LOD.addLevel(CarModelGroup,0);

    var CarModelL1Group=new THREE.Group();
    CarModelL1Group.add(DeepClone(BusModel[1]));
    CarModelL1Group.rotation.x=90*Math.PI/180;
    CarModelL1Group.position.x=-12.2/2;
    CarModelL1Group.position.y=-2.5/2;
    CarModelL1Group.position.z=-1;
    this.LOD.addLevel(CarModelL1Group,100);

    var CarModelL2Group=new THREE.Group();
    var geometry = new THREE.BoxBufferGeometry(12.2,2.5,2.87);
	var material = new THREE.MeshLambertMaterial( {color: 0xDDDDDD} );
	var cube = new THREE.Mesh( geometry, material );
    cube.position.set(0,0,0.5);
    CarModelL2Group.add(cube);
    this.LOD.addLevel(CarModelL2Group,200);

    this.LOD.position.set(MassOffset.x,MassOffset.y,MassOffset.z);

	this.Body.userData={
		Index:this.Index
	};


	this.Body.addShape(new CANNON.Box(new CANNON.Vec3(12.2/2,2.5/2,2.87/2)),new CANNON.Vec3(0+MassOffset.x,0+MassOffset.y,0.5+MassOffset.z));

    //this.Body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),Math.PI);
    

    //後方煞車燈
    var material = new THREE.SpriteMaterial({
        map: LightTexture, 
        color: 0xff0000, 
        transparent: true, 
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true
    });
    var BRLight = new THREE.Sprite( material );
    BRLight.position.set(6.105+MassOffset.x,1.05+MassOffset.y,-0.06+MassOffset.z);
    BRLight.scale.set(3,3,3);
    this.MeshGroup.add(BRLight);

    var material = new THREE.SpriteMaterial({
        map: LightTexture, 
        color: 0xff0000, 
        transparent: true, 
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true
    });
    var BLLight = new THREE.Sprite( material );
    BLLight.position.set(6.105+MassOffset.x,-1.05+MassOffset.y,-0.06+MassOffset.z);
    BLLight.scale.set(3,3,3);
    this.MeshGroup.add(BLLight);

    //前方車燈
    var material = new THREE.SpriteMaterial({
        map: LightTexture, 
        color: 0xffffff, 
        transparent: true, 
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true
    });
    var FRLight = new THREE.Sprite( material );
    FRLight.position.set(-6.105+MassOffset.x,0.95+MassOffset.y,-0.64+MassOffset.z);
    FRLight.scale.set(5,5,5);
    this.MeshGroup.add(FRLight);

    var material = new THREE.SpriteMaterial({
        map: LightTexture, 
        color: 0xffffff, 
        transparent: true, 
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true
    });
    var FLLight = new THREE.Sprite( material );
    FLLight.position.set(-6.105+MassOffset.x,-0.95+MassOffset.y,-0.64+MassOffset.z);
    FLLight.scale.set(5,5,5);
    this.MeshGroup.add(FLLight);

    //後方向車燈
    var material = new THREE.SpriteMaterial({
        map: LightTexture, 
        color: 0xeac100, 
        transparent: true, 
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true
    });
    var BRSignalLight = new THREE.Sprite( material );
    BRSignalLight.position.set(6.105+MassOffset.x,1.05+MassOffset.y,0.23+MassOffset.z);
    BRSignalLight.scale.set(3,3,3);
    BRSignalLight.visible=false;
    this.MeshGroup.add(BRSignalLight);

    var material = new THREE.SpriteMaterial({
        map: LightTexture, 
        color: 0xeac100, 
        transparent: true, 
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true
    });
    var BLSignalLight = new THREE.Sprite( material );
    BLSignalLight.position.set(6.105+MassOffset.x,-1.05+MassOffset.y,0.23+MassOffset.z);
    BLSignalLight.scale.set(3,3,3);
    BLSignalLight.visible=false;
    this.MeshGroup.add(BLSignalLight);

    //前方向燈
    var material = new THREE.SpriteMaterial({
        map: LightTexture, 
        color: 0xeac100, 
        transparent: true, 
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true
    });
    var FRSignalLight = new THREE.Sprite( material );
    FRSignalLight.position.set(-6.105+MassOffset.x,1.2+MassOffset.y,-0.64+MassOffset.z);
    FRSignalLight.scale.set(3,3,3);
    FRSignalLight.visible=false;
    this.MeshGroup.add(FRSignalLight);

    var material = new THREE.SpriteMaterial({
        map: LightTexture, 
        color: 0xeac100, 
        transparent: true, 
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true
    });
    var FLSignalLight = new THREE.Sprite( material );
    FLSignalLight.position.set(-6.105+MassOffset.x,-1.2+MassOffset.y,-0.64+MassOffset.z);
    FLSignalLight.scale.set(3,3,3);
    FLSignalLight.visible=false;
    this.MeshGroup.add(FLSignalLight);

    //頭燈光線
    if(Config.HaveLight)
    {
        var LeftSpotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI/4, 0.3);
        LeftSpotLight.position.set(-6.105+MassOffset.x,-0.95+MassOffset.y,-0.64+MassOffset.z);
        this.MeshGroup.add( LeftSpotLight );

        var TargetObj=new THREE.Object3D();
        TargetObj.position.set(-7+MassOffset.x,-0.95+MassOffset.y,-0.64+MassOffset.z);
        this.MeshGroup.add( TargetObj );
        LeftSpotLight.target=TargetObj;
        
        var RightSpotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI/4, 0.3);
        RightSpotLight.position.set(-6.105+MassOffset.x,0.95+MassOffset.y,-0.64+MassOffset.z);
        this.MeshGroup.add( RightSpotLight );

        var TargetObj=new THREE.Object3D();
        TargetObj.position.set(-7+MassOffset.x,0.95+MassOffset.y,-0.64+MassOffset.z);
        this.MeshGroup.add( TargetObj );
        RightSpotLight.target=TargetObj;
    }

    function TakeBreak(ThisCar)
    {
        BRLight.scale.set(5,5,5);
        BLLight.scale.set(5,5,5);
    }

    function UnTakeBreak(ThisCar)
    {
        BRLight.scale.set(2,2,2);
        BLLight.scale.set(2,2,2);
    }

    var CarColor=[
        new THREE.Color(0xc60101),  //紅
        new THREE.Color(0x22cc00),  //綠
        new THREE.Color(0x001a84),  //藍
        new THREE.Color(0xb2b2b2),  //灰
        //new THREE.Color(0xcccccc),  //灰
        //new THREE.Color(0x6d6d6d),  //灰
        new THREE.Color(0x515151),  //灰
        new THREE.Color(0xf9f9f9),  //白
        new THREE.Color(0x353535),  //黑
        //new THREE.Color(0x191919),  //黑
        //new THREE.Color(0x303030),  //黑
        new THREE.Color(0xf7d600),  //黃
    ];

    var CarBodyMesh=CarModelGroup.getObjectByName('group_0');
    var CarL1BodyMesh=CarModelL1Group.getObjectByName('group_0');

    function ResetCallBack(ThisCar)
    {
        var NewColor=CarColor[Math.floor(Math.random()*CarColor.length)];

        CarBodyMesh.children[0].material.color=NewColor; 
        CarL1BodyMesh.children[0].material.color=NewColor; 
        CarModelL2Group.children[0].material.color=NewColor;
        
    }

    var LaneOffsetValue=0;
    var SignalFlash=true;
    var SignalFlashTime=0;
    var SignalFlashTimeMax=10;
    var AiUseTurnLeftSignal=false; //使用右方向燈
    var AiUseTurnRighrSignal=false;//使用右方向燈
    var NowSpeed=new THREE.Vector3();
    function RunCallBack(ThisCar)
    {
        NowSpeed=ThisCar.Speed;

        //遠光燈
        if(!ThisCar.Stay && Config.HaveLight)
        {
            if(CheckKeyBoardPress(UserKeyboardSetting.Bright))
            {
                LeftSpotLight.distance=150;
                RightSpotLight.distance=150;
                FRLight.scale.set(7,7,7);
                FLLight.scale.set(7,7,7);
            }
            else
            {
                LeftSpotLight.distance=30;
                RightSpotLight.distance=30;
                FRLight.scale.set(5,5,5);
                FLLight.scale.set(5,5,5);
            }
        }

        if(ThisCar.IsAi)
        {
            //車禍 雙閃
            if(ThisCar.AiHasCrack)
            {
                SignalFlashTime+=1*SystemStepPer;
                if(SignalFlashTime>SignalFlashTimeMax)
                {
                    SignalFlashTime=0;
                    SignalFlash=!SignalFlash;
                }

                BLSignalLight.visible=SignalFlash;
                FLSignalLight.visible=SignalFlash;
                
                BRSignalLight.visible=SignalFlash;
                FRSignalLight.visible=SignalFlash;
            }
            //切換車道 單閃
            else
            {
                if(ThisCar.AiTargetLane!=null)
                {
                    LaneOffsetValue=(ThisCar.AiTargetLane.Position.y - ThisCar.Body.position.y + ThisCar.AiTargetLaneYOffset) * ((ThisCar.AiTargetLane.Reverse)?1:-1);
                    
                    if(Math.abs(LaneOffsetValue)>1)
                    {
                        if(LaneOffsetValue>0)AiUseTurnLeftSignal=true;
                        else if(LaneOffsetValue<0)AiUseTurnRighrSignal=true;
                    }
                    else
                    {
                        AiUseTurnLeftSignal=false;
                        AiUseTurnRighrSignal=false;
                    }
                }

                SignalFlashTime+=1*SystemStepPer;
                if(SignalFlashTime>SignalFlashTimeMax)
                {
                    SignalFlashTime=0;
                    SignalFlash=!SignalFlash;
                }

                BLSignalLight.visible=(AiUseTurnLeftSignal && SignalFlash);
                FLSignalLight.visible=(AiUseTurnLeftSignal && SignalFlash);
                
                BRSignalLight.visible=(AiUseTurnRighrSignal && SignalFlash);
                FRSignalLight.visible=(AiUseTurnRighrSignal && SignalFlash);
            }
        }
    }

	this.Body.addEventListener("collide",function(e){
        
        var relativeVelocity=e.contact.getImpactVelocityAlongNormal();

        if(Math.abs(relativeVelocity)>1)
        {
            for(var i=0;i<SparkArray.length;i++)
            {
                if(!SparkArray[i].Alive)
                {
                    SparkArray[i].ReUse({
                        AliveTime:10+Rand(20)+Math.abs(relativeVelocity)*2,
                        Position:new THREE.Vector3(
                            e.contact.bj.position.x + e.contact.rj.x,
                            e.contact.bj.position.y + e.contact.rj.y,
                            e.contact.bj.position.z + e.contact.rj.z
                        ),
                        MoveVector:new THREE.Vector3(
                            NowSpeed.x,
                            NowSpeed.y,
                            NowSpeed.z
                        )
                    });

                    SparkSetIndex++;
                    if(SparkSetIndex>=SparkArray.length)SparkSetIndex=0;

                    break;
                }
            }
        }

        if(!ThisBus.AiHasCrack)
        {
            var TheyMass=0;

            if(Math.abs(relativeVelocity)>5)
            {
                ThisBus.AiHasCrack=true;
                ThisBus.AiHasCrackTime=0;
            }
                

            //console.log(relativeVelocity);


            /*if(relativeVelocity>2)
            {
                TheyMass=Math.min(e.contact.bj.mass,e.contact.bi.mass);

                //撞擊海面
                if(e.contact.bj.id==GroundBody.id)
                {
                    TheyMass=e.contact.bi.mass;
                }
                else if(e.contact.bi.id==GroundBody.id)
                {
                    TheyMass=e.contact.bj.mass;
                }
            } */
        }
    });

    
}