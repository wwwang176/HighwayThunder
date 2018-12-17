
var DebugClock=new THREE.Clock();
var DebugClockStart=false;
var DebugTime=0;

function WEX(iConfig)
{
	var Config={
        Scene:Scene,
        HaveLight:false,
        Mass:1800,                      //質量
        EngineForce:19500,              //引擎力量
        BrakeForce:200,                 //煞車力量
        HaveO2N2:true,					//氮氣
        O2N2Max:60*5,					//氮氣最大量
        AutoGear:false,					//是否是自排
        Gear:[							//齒輪設定
            {
                Reverse:true,   //倒退檔
				TargetSpeed:66,
                TorquePer:0.5              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:66,
                TorquePer:0.5              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:132,
                TorquePer:0.4              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:198,
                TorquePer:0.3              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:264,
                TorquePer:0.2              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:330,
                TorquePer:0.1              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:396,
                TorquePer:0.05              //扭力比例
            }
        ],
        WheelOptions:{
            radius: 0.28 ,
            directionLocal: new CANNON.Vec3(0, 0, -1),
            suspensionStiffness: 30/4*2,
            //suspensionRestLength: 0.5,
            suspensionRestLength: 0.0,
            frictionSlip: 3*0.9*0.7*0.7/**1.5*/,
            dampingRelaxation: 2.3/3,
            dampingCompression: 4.4/3,
            maxSuspensionForce: 100000,
            rollInfluence:  /*0.01*/0.375*1.2,
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
                Position:new THREE.Vector3(-1,-0.72,0.15),
                suspensionRestLength:0.25*2/4,
                maxSuspensionTravel:0.25*2/4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:false,
                Steer:true,
                Position:new THREE.Vector3(-1,0.72,0.15),
                suspensionRestLength:0.25*2/4,
                maxSuspensionTravel:0.25*2/4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(1.22,-0.75,0.14),
                suspensionRestLength:0.25*2/4,
                maxSuspensionTravel:0.25*2/4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(1.22,0.75,0.14),
                suspensionRestLength:0.25*2/4,
                maxSuspensionTravel:0.25*2/4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            }
        ],
        CameraOptions:{
            Default:{
                Position:new THREE.Vector3(0,2,5),  //+右-左，+上-下，+後-前
                SpeedAdd:0.5,
                SpeedPer:0.2
            },
            LookBack:{
                Position:new THREE.Vector3(0,2,-10),
                SpeedAdd:0,
                SpeedPer:0
            },
            LookLeft:{
                Position:new THREE.Vector3(5,2,0),
                SpeedAdd:0,
                SpeedPer:0
            },
            LookRight:{
                Position:new THREE.Vector3(-5,2,0),
                SpeedAdd:0,
                SpeedPer:0
            },
            FOV:{
                Position:new THREE.Vector3(0,0.75,-0.75),
                SpeedAdd:0,
                SpeedPer:0
            },
            Ended:{
                Position:new THREE.Vector3(1.25,0.5,-4.5),
                SpeedAdd:0,
                SpeedPer:0
            },
        },
        OnRunCallBack:function(){},
        RunCallBack:RunCallBack,
        TakeBreak:TakeBreak,
        UnTakeBreak:UnTakeBreak,
        ResetCallBack:ResetCallBack,
        ChangeGearCallBack:ChangeGearCallBack
    };

    Config=$.extend(Config,iConfig);

    //繼承Car
    this.prototype=Object.create(Car.prototype);
    Car.call(this,Config);

    var ThisCar=this;

    this.BodySize=new CANNON.Vec3(3.75,1.7,10);

    /*var geometry = new THREE.BoxBufferGeometry(3.7-0.6, 1.6, 0.5);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(0,0,0.3);
    this.MeshGroup.add(cube);
    
    var geometry = new THREE.BoxBufferGeometry(2, 1.4, 0.4);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(0.5,0,0.6);
    this.MeshGroup.add(cube);
    
    var geometry = new THREE.CylinderBufferGeometry(0.6/2,0.6/2,1.6);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(-1.55,0,0.3);
    this.MeshGroup.add(cube);
    
    var geometry = new THREE.CylinderBufferGeometry(0.6/2,0.6/2,1.6);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(1.55,0,0.3);
    this.MeshGroup.add(cube);*/
    
	
    /*var geometry = new THREE.BoxBufferGeometry(1.7, 1.3, 0.7);
	var material = new THREE.MeshLambertMaterial( {color: 0xDDDDDD} );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.set(0.3,0,0.6);
    this.MeshGroup.add(cube);*/

    var ModelLeft=DeepClone(WEXModel[0]);
    var ModelRight=DeepClone(WEXModel[0]);

    var WheelModel=DeepClone(WEXModel[1]);
    var WheelOtherModel=DeepClone(WEXModel[2]);

    ModelRight.position.z=-0.837*2; //0.4185
    ModelRight.scale.y*=-1;
    
    var CarModelGroup=new THREE.Group();
    CarModelGroup.add(ModelLeft);
    CarModelGroup.add(ModelRight);
    
    CarModelGroup.rotation.x=90*Math.PI/180;
    CarModelGroup.position.x=-3.75/2;
    CarModelGroup.position.y=-0.837;
    this.LOD.addLevel(CarModelGroup,0);

    var CarBodyLeftMesh=ModelLeft.getObjectByName('group_10');
    var CarBodyRightMesh=ModelRight.getObjectByName('group_10');

    
    var LeftSpoilerMesh=ModelLeft.getObjectByName('group_6');
    var RightSpoilerMesh=ModelRight.getObjectByName('group_6');
    var SpoilerPositionZMin=LeftSpoilerMesh.position.z*1;
    var SpoilerPositionZMax=28;
    var NowSpoilerPositionZ=SpoilerPositionZMin*1;
    
    //CarBodyLeftMesh.children[1].material.color=new THREE.Color(0x333333);
    //CarBodyRightMesh.children[1].material.color=new THREE.Color(0x333333);
    

    var CarModelL1Group=new THREE.Group();
    CarModelL1Group.add(DeepClone(CarModel[1]));
    CarModelL1Group.rotation.x=90*Math.PI/180;
    CarModelL1Group.position.x=-3.75/2;
    CarModelL1Group.position.y=-0.837;
    this.LOD.addLevel(CarModelL1Group,75);

    var CarModelL2Group=new THREE.Group();
    var geometry = new THREE.BoxBufferGeometry(4, 1.4, 0.6);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.z=0.3;
    CarModelL2Group.add(cube);
    var geometry = new THREE.BoxBufferGeometry(2, 1.2, 0.5);
	var material = new THREE.MeshLambertMaterial( {color: 0x000000} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x=0.217;
    cube.position.z=0.739;
    CarModelL2Group.add(cube);
    this.LOD.addLevel(CarModelL2Group,100);

	this.Body.userData={
		Index:this.Index
    };


    this.Body.addShape(new CANNON.Box(new CANNON.Vec3(3.1/2,1.6/2,0.5/2)),new CANNON.Vec3(0,0,0.3));

    var q = new CANNON.Quaternion();
    q.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI / 2);
    this.Body.addShape(new CANNON.Cylinder(0.6/2,0.6/2,1.6,4),new CANNON.Vec3(-1.55,0,0.3),q);
    this.Body.addShape(new CANNON.Cylinder(0.6/2,0.6/2,1.6,4),new CANNON.Vec3(1.55,0,0.3),q);
    
    this.Body.addShape(new CANNON.Box(new CANNON.Vec3(2/2,1.4/2,0.4/2)),new CANNON.Vec3(0.5,0,0.6));
    
    //煞車模型
    this.WheelBrakeMashArray=[];

    //清除車輪
    for(var i=0;i<ThisCar.WheelMashArray.length;i++)
    {
        Config.Scene.remove(ThisCar.WheelMashArray[i]);
    }
    ThisCar.WheelMashArray.length=0;

    //重新建構車輪
    for(var i=0;i<Config.Wheel.length;i++)
    {
        var WheelObject=DeepClone(WheelModel);

        if(i%2!=0)WheelObject.scale.y*=-1;

        var WheelLOD=new THREE.LOD();
        WheelLOD.addLevel(WheelObject,0);
        ThisCar.WheelMashArray.push(WheelLOD);
        Config.Scene.add(WheelLOD);

        var WheelBrakeObject=DeepClone(WheelOtherModel);

        //右側翻轉
        if(i%2!=0)WheelBrakeObject.scale.y*=-1;

        //後方翻轉
        if(i>=2)
            WheelBrakeObject.scale.x*=-1;

        this.WheelBrakeMashArray.push(WheelBrakeObject);
        Config.Scene.add(WheelBrakeObject);
    }
    
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
    BRLight.position.set(2,0.46,0.52);
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
    BLLight.position.set(2,-0.46,0.52);
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
    FRLight.position.set(-1.9,0.46,0.338);
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
    FLLight.position.set(-1.9,-0.46,0.338);
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
    BRSignalLight.position.set(2.1,0.6,0.52);
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
    BLSignalLight.position.set(2.1,-0.6,0.52);
    BLSignalLight.scale.set(3,3,3);
    BLSignalLight.visible=false;
    this.MeshGroup.add(BLSignalLight);

    //前方向車燈
    var material = new THREE.SpriteMaterial({
        map: LightTexture, 
        color: 0xeac100, 
        transparent: true, 
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true
    });
    var FRSignalLight = new THREE.Sprite( material );
    FRSignalLight.position.set(-2,0.6,0.338);
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
    FLSignalLight.position.set(-2,-0.6,0.338);
    FLSignalLight.scale.set(3,3,3);
    FLSignalLight.visible=false;
    this.MeshGroup.add(FLSignalLight);

    //後倒退燈
    var material = new THREE.SpriteMaterial({
        map: LightTexture, 
        color: 0xffffff, 
        transparent: true, 
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true
    });
    var ReversingRightLight = new THREE.Sprite( material );
    ReversingRightLight.position.set(2.1,0.5,0.51);
    ReversingRightLight.scale.set(2,2,2);
    ReversingRightLight.visible=false;
    this.MeshGroup.add(ReversingRightLight);

    var material = new THREE.SpriteMaterial({
        map: LightTexture, 
        color: 0xffffff, 
        transparent: true, 
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true
    });
    var ReversingLeftLight = new THREE.Sprite( material );
    ReversingLeftLight.position.set(2.1,-0.5,0.51);
    ReversingLeftLight.scale.set(2,2,2);
    ReversingLeftLight.visible=false;
    this.MeshGroup.add(ReversingLeftLight);

    //頭燈光線
    if(Config.HaveLight)
    {
        var LeftSpotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI/4, 0.3);
        LeftSpotLight.position.set(-2,-0.46,0.35);
        this.MeshGroup.add( LeftSpotLight );

        var TargetObj=new THREE.Object3D();
        TargetObj.position.set(-5,-0.46,0.1);
        this.MeshGroup.add( TargetObj );
        LeftSpotLight.target=TargetObj;
        
        var RightSpotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI/4, 0.3);
        RightSpotLight.position.set(-2,0.46,0.35);
        this.MeshGroup.add( RightSpotLight );

        var TargetObj=new THREE.Object3D();
        TargetObj.position.set(-5,0.46,0.1);
        this.MeshGroup.add( TargetObj );
        RightSpotLight.target=TargetObj;
    }

    //排氣管點火
    var LastThrottleState=false;
    var ShowBackFireTime=0;
    var BackFireGroup=new THREE.Group();
    this.MeshGroup.add(BackFireGroup);

    for(var i=0;i<5;i++)
    {
        var material = new THREE.SpriteMaterial({
            map: FireTexture[i], 
            color: 0xffffff, 
            transparent: true,
            depthWrite: false,
            depthTest: true
        });
        var BackFire = new THREE.Sprite( material );
        BackFire.position.set(i*0.7,0,0);
        BackFire.scale.set((i+1)*0.5,(i+1)*0.5,1);
        BackFireGroup.add(BackFire);
    }
    BackFireGroup.position.x=2;
    BackFireGroup.position.z=0.3;
    BackFireGroup.scale.set(0.1,0.2,0.2);

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
        new THREE.Color(0x001a84),  //藍
        new THREE.Color(0xb2b2b2),  //灰
        new THREE.Color(0xcccccc),  //灰
        new THREE.Color(0x6d6d6d),  //灰
        new THREE.Color(0x515151),  //灰
        new THREE.Color(0xf9f9f9),  //白
        new THREE.Color(0x353535),  //黑
        new THREE.Color(0x191919),  //黑
        new THREE.Color(0x303030),  //黑
        new THREE.Color(0x0f0f0f),  //黑
        new THREE.Color(0xf7d600),  //黃
    ];

    var CarBodyMesh=CarModelGroup.getObjectByName('group_1');
    var CarL1BodyMesh=CarModelL1Group.getObjectByName('group_0');
    function ResetCallBack(ThisCar)
    {
        var NewColor=CarColor[Math.floor(Math.random()*CarColor.length)];

        CarBodyMesh.children[2].material.color=NewColor; 

        CarL1BodyMesh.children[0].material.color=NewColor;  //車體
        CarL1BodyMesh.children[2].material.color=NewColor;  //車頂
        CarModelL2Group.children[0].material.color=NewColor;  //車頂
        
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
        //取得油門狀態
        var NewThrottleState=ThisCar.GetThrottle();
        if(NewThrottleState==false && LastThrottleState==true)
        {
            ShowBackFireTime=5;
        }

        LastThrottleState=NewThrottleState;

        if(ShowBackFireTime>0)
        {
            ShowBackFireTime--;

            BackFireGroup.visible=true;

            for(var i=0;i<BackFireGroup.children.length;i++)
            {
                BackFireGroup.children[i].position.y=RandF(0.2)-0.1;
                BackFireGroup.children[i].position.z=RandF(0.2)-0.1;
                BackFireGroup.children[i].material.opacity=RandF(1);
                BackFireGroup.children[i].material.rotation+=RandF(3);
            }
        }
        else
        {
            BackFireGroup.visible=false;
        }

        //更新輪胎位置
    	for (var i = 0,j=ThisCar.Vehicle.wheelInfos.length; i < j; i++) {
            ThisCar.Vehicle.updateWheelTransform(i);
            var t = ThisCar.Vehicle.wheelInfos[i].worldTransform;

            //fix worldTransform is NaN bug
            if(isNaN(t.quaternion.x) || isNaN(t.quaternion.y) || isNaN(t.quaternion.z) || isNaN(t.quaternion.w))
            {
                t.quaternion.x=0;
                t.quaternion.y=0;
                t.quaternion.z=0;
                t.quaternion.w=1;
            }

            ThisCar.WheelBrakeMashArray[i].position.copy(t.position);
            ThisCar.WheelBrakeMashArray[i].quaternion.copy(ThisCar.Body.quaternion);

            if(!isNaN(ThisCar.Vehicle.wheelInfos[i].steering))
                ThisCar.WheelBrakeMashArray[i].rotateZ(ThisCar.Vehicle.wheelInfos[i].steering);
        }

        NowSpeed=ThisCar.Speed;

        //擾流板作動
        if(-NowSpeed.x*60*3.6>=200)
        {
            NowSpoilerPositionZ+=0.1;

            if(NowSpoilerPositionZ>SpoilerPositionZMax)
                NowSpoilerPositionZ=SpoilerPositionZMax;

            ThisCar.Body.applyLocalForce(new CANNON.Vec3(0,0,-1000*Math.abs(NowSpeed.x)),new CANNON.Vec3(0,0,0));
        }
        else
        {
            NowSpoilerPositionZ-=0.1;

            if(NowSpoilerPositionZ<SpoilerPositionZMin)
                NowSpoilerPositionZ=SpoilerPositionZMin;
        }

        LeftSpoilerMesh.position.z=NowSpoilerPositionZ;
        RightSpoilerMesh.position.z=NowSpoilerPositionZ;

        //後方倒退燈
        ReversingLeftLight.visible=ReversingRightLight.visible=(ThisCar.GetNowGear()==0);

        //遠光燈
        if(!Config.Stay && Config.HaveLight)
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

    function ChangeGearCallBack(ThisCar)
    {
        ShowBackFireTime=5;
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
        

        if(!ThisCar.AiHasCrack)
        {
            var TheyMass=0;
            if(Math.abs(relativeVelocity)>5)
            {
                ThisCar.AiHasCrack=true;
                ThisCar.AiHasCrackTime=0;
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