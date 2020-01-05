
var DebugClock=new THREE.Clock();
var DebugClockStart=false;
var DebugTime=0;

function TrailerTruck(iConfig)
{
    var MassOffset=new THREE.Vector3(0,0,0.25);
	var Config={
        Scene:Scene,
        World:world,
        Mass:9000,
        EngineForce:18000*7,
        BrakeForce:1000,			    //煞車速度
        SteerAdd:22.5/14*2,               //轉向速度
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
                TorquePer:0.55              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:45.45454545,
                TorquePer:0.55              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:60.90909091,
                TorquePer:0.525              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:76.36363636,
                TorquePer:0.5              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:91.81818182,
                TorquePer:0.475              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:107.2727273,
                TorquePer:0.45              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:122.7272727,
                TorquePer:0.425              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:138.1818182,
                TorquePer:0.4              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:153.6363636,
                TorquePer:0.375              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:169.0909091,
                TorquePer:0.35              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:184.5454545,
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
            suspensionStiffness: 40,
            //suspensionRestLength: 0.5,
            suspensionRestLength: 0.0,
            frictionSlip: 3*0.9*0.7*0.7*2,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            maxSuspensionForce: 100000,
            rollInfluence:  0.375/2,
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
                Position:new THREE.Vector3(-2,-2.495/2+0.1,-0.9),
                suspensionRestLength:0.55,
                maxSuspensionTravel:0.55,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:false,
                Steer:true,
                Position:new THREE.Vector3(-2,2.495/2-0.1,-0.9),
                suspensionRestLength:0.55,
                maxSuspensionTravel:0.55,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            /*{
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(1.2,-2.495/2+0.1,-1.6+0.7),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(1.2,2.495/2-0.1,-1.6+0.7),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },*/
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(2.55,-2.495/2+0.1,-0.9),
                suspensionRestLength:0.55,
                maxSuspensionTravel:0.55,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(2.55,2.495/2-0.1,-0.9),
                suspensionRestLength:0.55,
                maxSuspensionTravel:0.55,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            }
        ],
        CameraOptions:{
            Default:{
                Position:new THREE.Vector3(0,6,13+8),
                SpeedAdd:new THREE.Vector3(0,0.5,0.5),
                SpeedPer:new THREE.Vector3(0,1,1),
                RotationEffect:0.15
            },
            LookBack:{
                Position:new THREE.Vector3(0,4,18)
            },
            LookLeft:{
                Position:new THREE.Vector3(-3,4,10)
            },
            LookRight:{
                Position:new THREE.Vector3(3,4,10)
            },
            FOV:{
                Position:new THREE.Vector3(-0.6,1.2,-2.2),
                SpeedAdd:new THREE.Vector3(0,0,0.8),
                SpeedPer:new THREE.Vector3(1,1,0),
                RotationEffect:0.15
            },
            Ended:{
                Position:new THREE.Vector3(2,0.5,-8)
            },
        },
        SoundOptions:{
            ChangeGearVolumeDelay:30,
            ScreamPlaybackRate:[0.65,0.4],     //煞車聲設定
            Samples:[
                [1,1],
                //[1.5,0.5]
            ]
        },
        AiResetZOffset:0.75,
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

    //繼承Car
    this.prototype=Object.create(Car.prototype);
    Car.call(this,Config);

    var ThisCar=this;

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
    CarFOVModelGroup.position.x=-6.8/2+MassOffset.x;
    CarFOVModelGroup.position.y=-2.5/2+MassOffset.y;
    CarFOVModelGroup.position.z=-1+MassOffset.z;
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

    this.LOD.position.set(MassOffset.x,MassOffset.y,MassOffset.z);

	this.Body.userData={
		Index:this.Index
	};

    this.Body.addShape(new CANNON.Box(new CANNON.Vec3(2/2,2.5/2,2.8/2)),new CANNON.Vec3(-2.4+MassOffset.x,0+MassOffset.y,0.4+MassOffset.z));
    this.Body.addShape(new CANNON.Box(new CANNON.Vec3(5.6/2,2.5/2,1/2)),new CANNON.Vec3(0.25+MassOffset.x,0+MassOffset.y,-0.5+MassOffset.z));

    //建立貨櫃
    this.Container=new TruckContainer({
        Scene:Config.Scene,
        World:Config.World,
        Position:new THREE.Vector3(
            this.Body.position.x+6,
            this.Body.position.y+0,
            this.Body.position.z+0.5-1.25
        ),
        CanReset:this.NeedReset,
    });

    var ThisContainer=this.Container;
    
    //設定連結的卡車
    this.Container.Truck=this;

    //加入PassPackage，避免預警誤判
    this.AiPassPackageIndexArray.push(this.Container.Index);

    //建立貨櫃約束
    this.ContainerConstraint=null;
    this.ContainerConstraint = new CANNON.PointToPointConstraint(
        this.Body,
        new CANNON.Vec3(0.5+MassOffset.x,0+MassOffset.y,0.15+MassOffset.z),
        this.Container.Body,
        new CANNON.Vec3(-5.5,0,1)
    );
    Config.World.addConstraint(this.ContainerConstraint);

    this.SetConstraint=function(Enable)
    {
        if(Enable)
        {
            /*if(this.ContainerConstraint==null)
            {
                this.ContainerConstraint = new CANNON.PointToPointConstraint(this.Body,new CANNON.Vec3(0,0,0.3),this.Container.Body,new CANNON.Vec3(-6,0,0));
                world.addConstraint(this.ContainerConstraint);
            }*/
            ThisCar.ContainerConstraint.enable();
        }
        else
        {
            /*if(this.ContainerConstraint!=null)
            {
                world.removeConstraint(this.ContainerConstraint);
            }*/
            ThisCar.ContainerConstraint.disable();
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
    FRLight.position.set(-3.405+MassOffset.x,1+MassOffset.y,-0.55+MassOffset.z);
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
    FLLight.position.set(-3.405+MassOffset.x,-1+MassOffset.y,-0.55+MassOffset.z);
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
    FRSignalLight.position.set(-3.405+MassOffset.x,1.2+MassOffset.y,-0.55+MassOffset.z);
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
    FLSignalLight.position.set(-3.405+MassOffset.x,-1.2+MassOffset.y,-0.55+MassOffset.z);
    FLSignalLight.scale.set(3,3,3);
    FLSignalLight.visible=false;
    this.MeshGroup.add(FLSignalLight);

    //頭燈光線
    if(Config.HaveLight)
    {
        var LeftSpotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI/4, 0.3);
        LeftSpotLight.position.set(-3.4+MassOffset.x,-1+MassOffset.y,-0.55+MassOffset.z);
        this.MeshGroup.add( LeftSpotLight );

        var TargetObj=new THREE.Object3D();
        TargetObj.position.set(-5+MassOffset.x,-1+MassOffset.y,-0.55+MassOffset.z);
        this.MeshGroup.add( TargetObj );
        LeftSpotLight.target=TargetObj;
        
        var RightSpotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI/4, 0.3);
        RightSpotLight.position.set(-3.4+MassOffset.x,1+MassOffset.y,-0.55+MassOffset.z);
        this.MeshGroup.add( RightSpotLight );

        var TargetObj=new THREE.Object3D();
        TargetObj.position.set(-5+MassOffset.x,1+MassOffset.y,-0.55+MassOffset.z);
        this.MeshGroup.add( TargetObj );
        RightSpotLight.target=TargetObj;
    }

    //設定聲音
    for(var i=0;i<TrailerTruckSoundBuffer.length;i++)
    {
        var Sound=new THREE.PositionalAudio(MainListener);
        Sound.setBuffer(TrailerTruckSoundBuffer[i]);
        //Sound.setLoop(true);
        //Sound.setMaxDistance(20);
        Sound.setRefDistance(0.7);
        //Sound.setDistanceModel('linear');
        
        this.EngineSoundArray.push(Sound);
        this.MeshGroup.add(Sound);
    }

    function Ready2ResetCallBack(ThisCar)
    {
        if(ThisCar.Container)
        {
            //斷開貨櫃
            ThisCar.SetConstraint(false);
            if(!ThisCar.Container.NeedReset)
                ThisCar.Container.Ready2Reset();
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

    function ResetCallBack(ThisCar)
    {
        if(ThisCar.NeedReset)return;

        var NewColor=CarColor[Math.floor(Math.random()*CarColor.length)];
        CarBodyMesh.children[0].material.color=NewColor; 
        CarModelL1Group.children[0].material.color=NewColor; 

        if(!ThisCar.NeedReset && ThisCar.Container)
        {
            //console.log('truck reset callback');
            //console.log(ThisCar.Container.Body.position);

            ThisCar.Container.Reset();
            ThisCar.ResetContainerPosition();

            //console.log(ThisCar.Body.position);
            //console.log(ThisCar.Container.Body.position);
            
            //連接貨櫃
            ThisCar.SetConstraint(true);
        }
    }

    function UserResetCallBack(ThisCar)
    {
        ThisCar.SetConstraint(false);
        ThisCar.ResetContainerPosition();
        ThisCar.SetConstraint(true);
    }

    //重新將貨櫃安穩的放到身後
    this.ResetContainerPosition=function(){

        if(this.Container)
        {
            var WorldPosition=this.Body.pointToWorldFrame(new CANNON.Vec3(6,0,0.5-1.25),new CANNON.Vec3(0,0,0));

            this.Container.Body.position.x=WorldPosition.x+MassOffset.x;
            this.Container.Body.position.y=WorldPosition.y+MassOffset.y;
            this.Container.Body.position.z=WorldPosition.z+MassOffset.z;
            this.Container.Body.quaternion.set(this.Body.quaternion.x,this.Body.quaternion.y,this.Body.quaternion.z,this.Body.quaternion.w);
            this.Container.Body.velocity.x=this.Body.velocity.x*1;
        }
        
    };

    function ViewTypeChangeCallBack(ViewType,ThisCar)
    {
        if(ViewType==1 && (MainFocusUnit==ThisCar))
        {
            CarFOVModelGroup.visible=true;
        }
        else
        {
            CarFOVModelGroup.visible=false;
        }
    }

    var NowSpeed=new THREE.Vector3();
    function OnRunCallBack(ThisCar)
    {
        NowSpeed=ThisCar.Speed;
    }

    var LaneOffsetValue=0;
    var SignalFlash=true;
    var SignalFlashTime=0;
    var SignalFlashTimeMax=10;
    var AiUseTurnLeftSignal=false; //使用右方向燈
    var AiUseTurnRighrSignal=false;//使用右方向燈
    function RunCallBack(ThisCar)
    {
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

                ThisContainer.LSignalLightVisible((AiUseTurnLeftSignal && SignalFlash));
                ThisContainer.RSignalLightVisible((AiUseTurnRighrSignal && SignalFlash));

                //BLSignalLight.visible=SignalFlash;
                FLSignalLight.visible=(AiUseTurnLeftSignal && SignalFlash);
                
                //BRSignalLight.visible=SignalFlash;
                FRSignalLight.visible=(AiUseTurnRighrSignal && SignalFlash);
            }
        }
    }

    function TakeBreak(ThisCar)
    {
        ThisContainer.TakeBreak();
        /*BRLight.scale.set(5,5,5);
        BLLight.scale.set(5,5,5);*/
    }

    function UnTakeBreak(ThisCar)
    {
        ThisContainer.UnTakeBreak();
        /*BRLight.scale.set(2,2,2);
        BLLight.scale.set(2,2,2);*/
    }


	var HitPosition=new THREE.Vector3(0,0,0);
    var HitMaterial=null;
	this.Body.addEventListener("collide",function(e){

        var relativeVelocity=e.contact.getImpactVelocityAlongNormal();

        if(MainFocusUnit==ThisCar)
        {
            if(e.contact.bi==ThisCar.Body)
            {
                HitPosition.set(
                    e.contact.bi.position.x + e.contact.ri.x,
                    e.contact.bi.position.y + e.contact.ri.y,
                    e.contact.bi.position.z + e.contact.ri.z);
                
                HitMaterial=e.contact.bj.material;
            }
            else
            {
                HitPosition.set(
                    e.contact.bj.position.x + e.contact.rj.x,
                    e.contact.bj.position.y + e.contact.rj.y,
                    e.contact.bj.position.z + e.contact.rj.z);
                
                HitMaterial=e.contact.bi.material;
            }

            PlayCrashSound(relativeVelocity,HitMaterial,HitPosition);
        }

        if(Math.abs(relativeVelocity)>1 && e.body!=ThisContainer.Body)
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
                            NowSpeed.x/2,
                            NowSpeed.y/2,
                            NowSpeed.z/2
                        )
                    });

                    SparkSetIndex++;
                    if(SparkSetIndex>=SparkArray.length)SparkSetIndex=0;

                    break;
                }
            }
        }

        if(!ThisCar.AiHasCrack)
        {
            var TheyMass=0;

            if(Math.abs(relativeVelocity)>5)
            {
                ThisCar.AiHasCrack=true;
                ThisCar.AiHasCrackTime=0;

                //斷開貨櫃
                //ThisCar.ContainerConstraint.disable();
            }
                

            //console.log(relativeVelocity);
        }
    });

    ThisContainer.Body.addEventListener("collide",function(e){

        var relativeVelocity=e.contact.getImpactVelocityAlongNormal();

        if(MainFocusUnit==ThisCar)
        {
            if(e.contact.bi==ThisContainer.Body)
            {
                HitPosition.set(
                    e.contact.bi.position.x + e.contact.ri.x,
                    e.contact.bi.position.y + e.contact.ri.y,
                    e.contact.bi.position.z + e.contact.ri.z);
                
                HitMaterial=e.contact.bj.material;
            }
            else
            {
                HitPosition.set(
                    e.contact.bj.position.x + e.contact.rj.x,
                    e.contact.bj.position.y + e.contact.rj.y,
                    e.contact.bj.position.z + e.contact.rj.z);
                
                HitMaterial=e.contact.bi.material;
            }

            PlayCrashSound(relativeVelocity,HitMaterial,HitPosition);
        }
    });
    
}