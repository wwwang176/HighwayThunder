
var DebugClock=new THREE.Clock();
var DebugClockStart=false;
var DebugTime=0;

function TrailerTruck(iConfig)
{
	var Config={
        Mass:9000,
        EngineForce:18000*2.5,
        BrakeForce:/*150*/200*2.5,			//煞車速度
        SteerAdd:22.5/7,                //轉向速度
        SteerAddLinear:0.5,             //轉向線性化
        Gear:[							//齒輪設定
            {
				Reverse:true,   //倒退檔
				TargetSpeed:30,
                TorquePer:0.5              //扭力比例
			},
            {
				Reverse:false,
				TargetSpeed:30,
                TorquePer:0.5              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:45.45454545,
                TorquePer:0.5              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:60.90909091,
                TorquePer:0.75              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:76.36363636,
                TorquePer:0.45              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:91.81818182,
                TorquePer:0.425              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:107.2727273,
                TorquePer:0.4              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:122.7272727,
                TorquePer:0.375              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:138.1818182,
                TorquePer:0.35              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:153.6363636,
                TorquePer:0.325              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:169.0909091,
                TorquePer:0.3              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:184.5454545,
                TorquePer:0.25              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:200,
                TorquePer:0.2              //扭力比例
            }
        ],
        WheelOptions:{
            radius: 0.55 ,
            directionLocal: new CANNON.Vec3(0, 0, -1),
            suspensionStiffness: 30/2,
            //suspensionRestLength: 0.5,
            suspensionRestLength: 0.0,
            frictionSlip: 3*0.9*0.7*0.7/**1.5*/,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            maxSuspensionForce: 100000,
            rollInfluence:  /*0.01*/0.25*1.5,
            axleLocal: new CANNON.Vec3(0, 1, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(0,0,0),
            maxSuspensionTravel: 0.0,
            customSlidingRotationalSpeed: -(60/2.1384),  //輪胎沒阻力的時候最高轉速
            useCustomSlidingRotationalSpeed: true
        },
        Wheel:[
            {
                Power:false,
                Steer:true,
                Position:new THREE.Vector3(-2,-2.495/2+0.1,-1.6+0.7),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:false,
                Steer:true,
                Position:new THREE.Vector3(-2,2.495/2-0.1,-1.6+0.7),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            /*{
                Power:false,
                Steer:false,
                Position:new THREE.Vector3(1.2,-2.495/2+0.1,-1.6+1.2),
                suspensionRestLength:0.7,
                maxSuspensionTravel:0.7,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:false,
                Steer:false,
                Position:new THREE.Vector3(1.2,2.495/2-0.1,-1.6+1.2),
                suspensionRestLength:0.7,
                maxSuspensionTravel:0.7,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },*/
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(2.55,-2.495/2+0.1,-1.6+0.7),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(2.55,2.495/2-0.1,-1.6+0.7),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            }
        ],
        CameraOptions:{
            Default:{
                Position:new THREE.Vector3(0,6,13+8),
                SpeedAdd:2,
                SpeedPer:0.2
            },
            LookBack:{
                Position:new THREE.Vector3(0,4,-18),
                SpeedAdd:0,
                SpeedPer:0
            },
            LookLeft:{
                Position:new THREE.Vector3(10,4,0),
                SpeedAdd:0,
                SpeedPer:0
            },
            LookRight:{
                Position:new THREE.Vector3(-10,4,0),
                SpeedAdd:0,
                SpeedPer:0
            },
            FOV:{
                Position:new THREE.Vector3(-0.5,1.2,-2.5),
                SpeedAdd:0,
                SpeedPer:0
            },
            Ended:{
                Position:new THREE.Vector3(2,0.5,-8),
                SpeedAdd:0,
                SpeedPer:0
            },
        },
        AiResetZOffset:2,
        AiTargetLaneYOffsetMax:0,
        Ready2ResetCallBack:Ready2ResetCallBack,
        ResetCallBack:ResetCallBack,
        OnRunCallBack:OnRunCallBack,
        RunCallBack:RunCallBack,
        TakeBreak:TakeBreak,
        UnTakeBreak:UnTakeBreak,
        UserResetCallBack:UserResetCallBack,
        ViewTypeChangeCallBack:ViewTypeChangeCallBack,
    };

    Config=$.extend(Config,iConfig);

    //繼承Car
    this.prototype=Object.create(Car.prototype);
    Car.call(this,Config);

    var ThisTrailerTruck=this;

    this.BodySize=new CANNON.Vec3(7.2,2.5,10);

	
    /*var geometry = new THREE.BoxBufferGeometry(2,2.5,2.8);
	var material = new THREE.MeshLambertMaterial( {color: 0xDDDDDD} );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.set(-2.4,0,0.4);
    this.MeshGroup.add(cube);
    
    var geometry = new THREE.BoxBufferGeometry(5.6,2.5,1);
	var material = new THREE.MeshLambertMaterial( {color: 0xDDDDDD} );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.set(0.25,0,-0.5);
    this.MeshGroup.add(cube);*/

    //L0
    var CarFOVModelGroup=new THREE.Group();
    CarFOVModelGroup.add(DeepClone(TrailerTruckFOVModel));
    CarFOVModelGroup.rotation.x=90*Math.PI/180;
    CarFOVModelGroup.position.x=-6.8/2;
    CarFOVModelGroup.position.y=-2.5/2;
    CarFOVModelGroup.position.z=-1;
    CarFOVModelGroup.visible=false;
    this.MeshGroup.add(CarFOVModelGroup);
    
    //L0
    var CarModelGroup=new THREE.Group();
    CarModelGroup.add(DeepClone(TrailerTruckModel));
    CarModelGroup.rotation.x=90*Math.PI/180;
    CarModelGroup.position.x=-6.8/2;
    CarModelGroup.position.y=-2.5/2;
    CarModelGroup.position.z=-1;
    this.LOD.addLevel(CarModelGroup,0);

    //L1
    var CarModelL1Group=new THREE.Group();
    var geometry = new THREE.BoxBufferGeometry(2,2.5,2.8);
	var material = new THREE.MeshLambertMaterial( {color: 0xDDDDDD} );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.set(-2.4,0,0.4);
    CarModelL1Group.add(cube);
    
    var geometry = new THREE.BoxBufferGeometry(5.6,2.5,1);
	var material = new THREE.MeshLambertMaterial( {color: 0xDDDDDD} );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.set(0.25,0,-0.5);
    CarModelL1Group.add(cube);
    this.LOD.addLevel(CarModelL1Group,200);

	this.Body.userData={
		Index:this.Index
	};

    this.Body.addShape(new CANNON.Box(new CANNON.Vec3(2/2,2.5/2,2.8/2)),new CANNON.Vec3(-2.4,0,0.4));
    this.Body.addShape(new CANNON.Box(new CANNON.Vec3(5.6/2,2.5/2,1/2)),new CANNON.Vec3(0.25,0,-0.5));

    //建立貨櫃
    this.Container=new TruckContainer({
        Position:new THREE.Vector3(
            this.Body.position.x+6,
            this.Body.position.y+0,
            this.Body.position.z+0.5
        ),
        CanReset:this.NeedReset,
    });

    var ThisContainer=this.Container;
    AllPackage.push(this.Container);

    //設定連結的卡車
    this.Container.Truck=this;

    //加入PassPackage，避免預警誤判
    this.AiPassPackageIndexArray.push(this.Container.Index);

    //建立貨櫃約束
    this.ContainerConstraint=null;
    this.ContainerConstraint = new CANNON.PointToPointConstraint(this.Body,new CANNON.Vec3(0.5,0,0.3),this.Container.Body,new CANNON.Vec3(-5.5,0,0));
    world.addConstraint(this.ContainerConstraint);

    this.SetConstraint=function(Enable)
    {
        if(Enable)
        {
            /*if(this.ContainerConstraint==null)
            {
                this.ContainerConstraint = new CANNON.PointToPointConstraint(this.Body,new CANNON.Vec3(0,0,0.3),this.Container.Body,new CANNON.Vec3(-6,0,0));
                world.addConstraint(this.ContainerConstraint);
            }*/
            ThisTrailerTruck.ContainerConstraint.enable();
        }
        else
        {
            /*if(this.ContainerConstraint!=null)
            {
                world.removeConstraint(this.ContainerConstraint);
            }*/
            ThisTrailerTruck.ContainerConstraint.disable();
        }
    }
    this.SetConstraint(false);
    
    if(Config.CanReset)
        this.Container.Ready2Reset();


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
    FRLight.position.set(-3.405,1,-0.55);
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
    FLLight.position.set(-3.405,-1,-0.55);
    FLLight.scale.set(5,5,5);
    this.MeshGroup.add(FLLight);

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
    FRSignalLight.position.set(-3.405,1.2,-0.55);
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
    FLSignalLight.position.set(-3.405,-1.2,-0.55);
    FLSignalLight.scale.set(3,3,3);
    FLSignalLight.visible=false;
    this.MeshGroup.add(FLSignalLight);

    //頭燈光線
    if(Config.HaveLight)
    {
        var LeftSpotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI/4, 0.3);
        LeftSpotLight.position.set(-3.4,-1,-0.55);
        this.MeshGroup.add( LeftSpotLight );

        var TargetObj=new THREE.Object3D();
        TargetObj.position.set(-5,-1,-0.55);
        this.MeshGroup.add( TargetObj );
        LeftSpotLight.target=TargetObj;
        
        var RightSpotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI/4, 0.3);
        RightSpotLight.position.set(-3.4,1,-0.55);
        this.MeshGroup.add( RightSpotLight );

        var TargetObj=new THREE.Object3D();
        TargetObj.position.set(-5,1,-0.55);
        this.MeshGroup.add( TargetObj );
        RightSpotLight.target=TargetObj;
    }

    function Ready2ResetCallBack(ThisTrailerTruck)
    {
        if(ThisTrailerTruck.Container)
        {
            //斷開貨櫃
            ThisTrailerTruck.SetConstraint(false);
            if(!ThisTrailerTruck.Container.NeedReset)
                ThisTrailerTruck.Container.Ready2Reset();
        }
    }

    var CarColor=[
        new THREE.Color(0xc60101),  //紅
        new THREE.Color(0x22cc00),  //綠
        new THREE.Color(0x001a84),  //藍
        new THREE.Color(0x515151),  //灰
        new THREE.Color(0xf9f9f9),  //白
        new THREE.Color(0x353535),  //黑
        new THREE.Color(0x191919),  //黑
        //new THREE.Color(0x303030),  //黑
        new THREE.Color(0xf7d600),  //黃
    ];
    var CarBodyMesh=CarModelGroup.getObjectByName('group_1');

    function ResetCallBack(ThisTrailerTruck)
    {
        var NewColor=CarColor[Math.floor(Math.random()*CarColor.length)];
        CarBodyMesh.children[0].material.color=NewColor; 
        CarModelL1Group.children[0].material.color=NewColor; 

        if(!ThisTrailerTruck.NeedReset && ThisTrailerTruck.Container)
        {
            //console.log('truck reset callback');
            //console.log(ThisTrailerTruck.Container.Body.position);

            ThisTrailerTruck.Container.Reset();
            ThisTrailerTruck.ResetContainerPosition();

            //console.log(ThisTrailerTruck.Body.position);
            //console.log(ThisTrailerTruck.Container.Body.position);
            
            //連接貨櫃
            ThisTrailerTruck.SetConstraint(true);
        }
    }

    function UserResetCallBack(ThisTrailerTruck)
    {
        ThisTrailerTruck.SetConstraint(false);
        ThisTrailerTruck.ResetContainerPosition();
        ThisTrailerTruck.SetConstraint(true);
    }

    //重新將貨櫃安穩的放到身後
    this.ResetContainerPosition=function(){

        if(this.Container)
        {
            var WorldPosition=this.Body.pointToWorldFrame(new CANNON.Vec3(6,0,0.5),new CANNON.Vec3(0,0,0));

            this.Container.Body.position.x=WorldPosition.x;
            this.Container.Body.position.y=WorldPosition.y;
            this.Container.Body.position.z=WorldPosition.z;
            this.Container.Body.quaternion.set(this.Body.quaternion.x,this.Body.quaternion.y,this.Body.quaternion.z,this.Body.quaternion.w);
            this.Container.Body.velocity.x=this.Body.velocity.x*1;
        }
        
    };

    function ViewTypeChangeCallBack(ViewType,ThisTrailerTruck)
    {
        if(ViewType==1 && (MainFocusUnit==ThisTrailerTruck))
        {
            CarFOVModelGroup.visible=true;
        }
        else
        {
            CarFOVModelGroup.visible=false;
        }
    }

    var NowSpeed=new THREE.Vector3();
    function OnRunCallBack(ThisTrailerTruck)
    {
        NowSpeed=ThisTrailerTruck.Speed;
    }

    var LaneOffsetValue=0;
    var SignalFlash=true;
    var SignalFlashTime=0;
    var SignalFlashTimeMax=10;
    var AiUseTurnLeftSignal=false; //使用右方向燈
    var AiUseTurnRighrSignal=false;//使用右方向燈
    function RunCallBack(ThisTrailerTruck)
    {
        //遠光燈
        if(Config.HaveLight)
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

        if(ThisTrailerTruck.IsAi)
        {
            //車禍 雙閃
            if(ThisTrailerTruck.AiHasCrack)
            {
                SignalFlashTime+=1*SystemStepPer;
                if(SignalFlashTime>SignalFlashTimeMax)
                {
                    SignalFlashTime=0;
                    SignalFlash=!SignalFlash;
                }

                ThisContainer.LSignalLightVisible(SignalFlash);
                ThisContainer.RSignalLightVisible(SignalFlash);
                
                //BLSignalLight.visible=SignalFlash;
                FLSignalLight.visible=SignalFlash;
                
                //BRSignalLight.visible=SignalFlash;
                FRSignalLight.visible=SignalFlash;
            }
            //切換車道 單閃
            else
            {
                if(ThisTrailerTruck.AiTargetLane!=null)
                {
                    LaneOffsetValue=(ThisTrailerTruck.AiTargetLane.Position.y - ThisTrailerTruck.Body.position.y + ThisTrailerTruck.AiTargetLaneYOffset) * ((ThisTrailerTruck.AiTargetLane.Reverse)?1:-1);
                    
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

                ThisContainer.LSignalLightVisible((AiUseTurnLeftSignal && SignalFlash));
                ThisContainer.RSignalLightVisible((AiUseTurnRighrSignal && SignalFlash));

                //BLSignalLight.visible=SignalFlash;
                FLSignalLight.visible=(AiUseTurnLeftSignal && SignalFlash);
                
                //BRSignalLight.visible=SignalFlash;
                FRSignalLight.visible=(AiUseTurnRighrSignal && SignalFlash);
            }
        }
    }

    function TakeBreak(ThisTrailerTruck)
    {
        ThisContainer.TakeBreak();
        /*BRLight.scale.set(5,5,5);
        BLLight.scale.set(5,5,5);*/
    }

    function UnTakeBreak(ThisTrailerTruck)
    {
        ThisContainer.UnTakeBreak();
        /*BRLight.scale.set(2,2,2);
        BLLight.scale.set(2,2,2);*/
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

        if(!ThisTrailerTruck.AiHasCrack)
        {
            var TheyMass=0;

            if(Math.abs(relativeVelocity)>5)
            {
                ThisTrailerTruck.AiHasCrack=true;
                ThisTrailerTruck.AiHasCrackTime=0;

                //斷開貨櫃
                //ThisTrailerTruck.ContainerConstraint.disable();
            }
                

            //console.log(relativeVelocity);
        }
    });

    
}