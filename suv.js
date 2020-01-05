
var DebugClock=new THREE.Clock();
var DebugClockStart=false;
var DebugTime=0;

function suv(iConfig)
{
	var Config={
        Scene:Scene,
        HaveLight:false,
        HaveBackFire:false,
        Mass:4000,                      //質量
        EngineForce:33000,              //引擎力量
        BrakeForce:400,                 //煞車力量
        HaveO2N2:true,					//氮氣
        O2N2Max:60*5,					//氮氣最大量
        AutoGear:false,					//是否是自排
        Gear:[							//齒輪設定
            {
                Reverse:true,   //倒退檔
				TargetSpeed:59,
                TorquePer:0.5              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:59,
                TorquePer:0.75              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:118,
                TorquePer:0.5              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:178,
                TorquePer:0.4              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:237,
                TorquePer:0.3              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:297,
                TorquePer:0.2              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:356,
                TorquePer:0.1              //扭力比例
            }
        ],
        WheelOptions:{
            radius: 0.3136*1.2 ,
            directionLocal: new CANNON.Vec3(0, 0, -1),
            suspensionStiffness: 40,
            //suspensionRestLength: 0.5,
            suspensionRestLength: 0.0,
            frictionSlip: 3*0.9*0.7*0.7*1.5/**1.5*/,
            dampingRelaxation: 2.3/3*1.5,
            dampingCompression: 4.4/3*1.5,
            maxSuspensionForce: 100000,
            rollInfluence:  /*0.01*/0.375*0.9/**1.2*/,
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
                Position:new THREE.Vector3(-1.36,-0.81,0.16),
                suspensionRestLength:0.19,
                maxSuspensionTravel:0.19,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:false,
                Steer:true,
                Position:new THREE.Vector3(-1.36,0.81,0.16),
                suspensionRestLength:0.19,
                maxSuspensionTravel:0.19,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(1.5,-0.84,0.15),
                suspensionRestLength:0.19,
                maxSuspensionTravel:0.19,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(1.5,0.84,0.15),
                suspensionRestLength:0.19,
                maxSuspensionTravel:0.19,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            }
        ],
        CameraOptions:{
            Default:{
                Position:new THREE.Vector3(0,2.2,6.5),  //+右-左，+上-下，+後-前
                SpeedAdd:new THREE.Vector3(0,0.5,0.5),
                SpeedPer:new THREE.Vector3(0,1,1),
                RotationEffect:0.15,
            },
            LookBack:{
                Position:new THREE.Vector3(0,2,10)
            },
            LookLeft:{
                Position:new THREE.Vector3(0,2,5)
            },
            LookRight:{
                Position:new THREE.Vector3(0,2,5)
            },
            FOV:{
                Position:new THREE.Vector3(0,1.1,-1.45),
                SpeedAdd:new THREE.Vector3(0,0,0.8),
                SpeedPer:new THREE.Vector3(0,0,0),
                RotationEffect:0
            },
            Ended:{
                Position:new THREE.Vector3(1.5,1,-5)
            },
        },
        SoundOptions:{
            ChangeGearVolumeDelay:15,
            ScreamPlaybackRate:[1,0.4],     //煞車聲設定
            Samples:[
                [1,0.5],
                [0.7,1],
                [0.6,0.5],
            ]
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

    this.BodySize=new CANNON.Vec3(4.9,1.9,10);

    /*var geometry = new THREE.BoxBufferGeometry(3.9, 1.85, 0.95);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(0.1,0,0.45);
    this.MeshGroup.add(cube);

    var geometry = new THREE.BoxBufferGeometry(0.3, 1.5, 0.7);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(2.35,0,0.55);
    this.MeshGroup.add(cube);
    
    var geometry = new THREE.BoxBufferGeometry(2.7, 1.2, 0.5);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(0.8,0,1.2);
    this.MeshGroup.add(cube);
    
    var geometry = new THREE.CylinderBufferGeometry(0.926/2,0.926/2,0.95);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(-1.85,0.926/2,0.45);
    cube.rotateX(Math.PI/2);
    this.MeshGroup.add(cube);

    var geometry = new THREE.CylinderBufferGeometry(0.926/2,0.926/2,0.95);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(-1.85,-0.926/2,0.45);
    cube.rotateX(Math.PI/2);
    this.MeshGroup.add(cube);

    var geometry = new THREE.CylinderBufferGeometry(1.3/2,1.3/2,0.95);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(-1.9,0/2,0.45);
    cube.rotateX(Math.PI/2);
    this.MeshGroup.add(cube);*/

    var ModelLeft=DeepClone(SUVModel[0]);
    var ModelRight=DeepClone(SUVModel[0]);

    var WheelModel=DeepClone(SUVModel[1]);
    var WheelOtherModel=DeepClone(SUVModel[2]);

    ModelRight.position.z=-0.926*2;
    ModelRight.scale.y*=-1;
    
    var CarModelGroup=new THREE.Group();
    CarModelGroup.add(ModelLeft);
    CarModelGroup.add(ModelRight);
    
    CarModelGroup.rotation.x=90*Math.PI/180;
    CarModelGroup.position.x=-4.9/2;
    CarModelGroup.position.y=-0.926;
    this.LOD.addLevel(CarModelGroup,0);

    var LeftTopAlertMesh = ModelLeft.getObjectByName('top_alert');
    var RightTopAlertMesh = ModelRight.getObjectByName('top_alert');
    var LeftTopAlertGrayColor = new THREE.Color(0x730000);
    var RightTopAlertGrayColor = new THREE.Color(0x000073);
    var LeftTopAlertColor = new THREE.Color(0xff0000);
    var RightTopAlertColor = new THREE.Color(0x0000ff);
    LeftTopAlertMesh.material.color = LeftTopAlertGrayColor;
    RightTopAlertMesh.material.color = RightTopAlertGrayColor;

    /*var CarBodyLeftMesh=ModelLeft.getObjectByName('group_10');
    var CarBodyRightMesh=ModelRight.getObjectByName('group_10');

    
    var LeftSpoilerMesh=ModelLeft.getObjectByName('group_6');
    var RightSpoilerMesh=ModelRight.getObjectByName('group_6');
    var SpoilerPositionZMin=LeftSpoilerMesh.position.z*1;
    var SpoilerPositionZMax=SpoilerPositionZMin+3;
    var NowSpoilerPositionZ=SpoilerPositionZMin*1;
    
    //CarBodyLeftMesh.children[1].material.color=new THREE.Color(0x333333);
    //CarBodyRightMesh.children[1].material.color=new THREE.Color(0x333333);

    CarBodyLeftMesh.children[1].geometry.computeVertexNormals(true);
    CarBodyRightMesh.children[1].geometry.computeVertexNormals(true);*/
    

    var CarModelL1Group=new THREE.Group();
    CarModelL1Group.add(DeepClone(CarModel[1]));
    CarModelL1Group.rotation.x=90*Math.PI/180;
    CarModelL1Group.position.x=-4.1993/2;
    CarModelL1Group.position.y=-0.9398;
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


    this.Body.addShape(new CANNON.Box(new CANNON.Vec3(3.9/2,1.85/2,0.95/2)),new CANNON.Vec3(0.1,0,0.45));

    this.Body.addShape(new CANNON.Box(new CANNON.Vec3(0.3/2,1.5/2,0.7/2)),new CANNON.Vec3(2.35,0,0.55));
    
    this.Body.addShape(new CANNON.Box(new CANNON.Vec3(2.7/2,1.2/2,0.5/2)),new CANNON.Vec3(0.8,0,1.2));

    var q = new CANNON.Quaternion();
    q.setFromAxisAngle(new CANNON.Vec3(1,0,0),0);
    this.Body.addShape(new CANNON.Cylinder(0.926/2,0.926/2,1.95/2,6),new CANNON.Vec3(-1.85,0.926/2,0.45),q);
    
    q.setFromAxisAngle(new CANNON.Vec3(1,0,0),0);
    this.Body.addShape(new CANNON.Cylinder(0.926/2,0.926/2,1.95/2,6),new CANNON.Vec3(-1.85,-0.926/2,0.45),q);

    q.setFromAxisAngle(new CANNON.Vec3(1,0,0),0);
    this.Body.addShape(new CANNON.Cylinder(1.3/2,1.3/2,1.95/2,6),new CANNON.Vec3(-1.9,0,0.45),q);
    
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
    BRLight.position.set(2.53,0.83,0.7);
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
    BLLight.position.set(2.53,-0.83,0.7);
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
    FRLight.position.set(-2.3,0.7,0.64);
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
    FLLight.position.set(-2.3,-0.7,0.64);
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
    BRSignalLight.position.set(2.34,0.6,0.52);
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
    BLSignalLight.position.set(2.34,-0.6,0.52);
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
    FRSignalLight.position.set(-2.23,0.6,0.338);
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
    FLSignalLight.position.set(-2.23,-0.6,0.338);
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
    ReversingRightLight.position.set(2.55,0.84,0.75);
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
    ReversingLeftLight.position.set(2.55,-0.84,0.75);
    ReversingLeftLight.scale.set(2,2,2);
    ReversingLeftLight.visible=false;
    this.MeshGroup.add(ReversingLeftLight);

    //頭燈光線
    if(Config.HaveLight)
    {
        var LeftSpotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI/4, 0.3);
        LeftSpotLight.position.set(-2.13,-0.46,0.35);
        this.MeshGroup.add( LeftSpotLight );

        var TargetObj=new THREE.Object3D();
        TargetObj.position.set(-5,-0.46,0.1);
        this.MeshGroup.add( TargetObj );
        LeftSpotLight.target=TargetObj;
        
        var RightSpotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI/4, 0.3);
        RightSpotLight.position.set(-2.13,0.46,0.35);
        this.MeshGroup.add( RightSpotLight );

        var TargetObj=new THREE.Object3D();
        TargetObj.position.set(-5,0.46,0.1);
        this.MeshGroup.add( TargetObj );
        RightSpotLight.target=TargetObj;
    }

    //天線
    var geometry = new THREE.CylinderBufferGeometry(0.01,0.01,1,3);
    geometry.translate(0,1/2,0);
	var material = new THREE.MeshLambertMaterial( {color: 0xAAAAAA} );
    this.RadioMesh = new THREE.Mesh( geometry, material );
    this.RadioMesh.position.set(2.2,-0.8,1);
    this.RadioMesh.rotateX(Math.PI/2);
    this.MeshGroup.add(this.RadioMesh);

    //天線搖晃
    var LastSpeed = new THREE.Vector3(0,0,0);
    var RadioSpeed = {x:0, y:0};
    var RadioSpeedEffct = {x:0, y:0};
    var RadioRotate = {x:4.5, y:0};
    this.UpdateRadio=function(Speed)
    {
        RadioSpeedEffct.x = (0-RadioRotate.x) + (Speed.x-LastSpeed.x)*100;
        RadioSpeedEffct.y = (0-RadioRotate.y) + (Speed.y-LastSpeed.y)*100;
        LastSpeed.x = Speed.x*1;
        LastSpeed.y = Speed.y*1;

        RadioSpeed.x = RadioSpeed.x *0.98 + RadioSpeedEffct.x *0.02;
        RadioSpeed.y = RadioSpeed.y *0.98 + RadioSpeedEffct.y *0.02;

        RadioRotate.x += RadioSpeed.x;
        RadioRotate.y += RadioSpeed.y;

        if(RadioRotate.x>4.5)RadioRotate.x = 4.5;
        if(RadioRotate.x<-4.5)RadioRotate.x = -4.5;
        if(RadioRotate.y>4.5)RadioRotate.y = 4.5;
        if(RadioRotate.y<-4.5)RadioRotate.y = -4.5;
        
        ThisCar.RadioMesh.rotation.x = Math.PI/180*(90+RadioRotate.y*10);
        ThisCar.RadioMesh.rotation.z = Math.PI/180*(RadioRotate.x*10);
    }

    //頭頂警示燈
    var TopAlertLeftColor = new THREE.Color(0xff2222);
    var TopAlertRightColor = new THREE.Color(0x2222ff);
    var TopAlertLight;
    if(Config.HaveLight)
    {
        TopAlertLight = new THREE.PointLight(TopAlertLeftColor, 1 ,30);
        TopAlertLight.position.set(0.2,-0.58,1.65);
        this.MeshGroup.add( TopAlertLight );
    }

    var Alert=false;
    var AlertShake=false;
    var AlertShakeTimer=0;
    var AlertLRTimer=0;
    var AlertLR=true;
    this.UpdateAlert=function()
    {
        AlertLRTimer++;
        AlertShakeTimer++;

        if(AlertShakeTimer>=3)
        {
            AlertShakeTimer=0;
            AlertShake=!AlertShake;
        }

        if(AlertLRTimer>30)
        {
            AlertLRTimer=0;
            AlertLR=!AlertLR;
        }

        TopAlertLight.distance=(AlertShake)?15:0.1;
        TopAlertLight.intensity=(AlertShake)?1:0;

        if(AlertLR)
        {
            TopAlertLight.color=TopAlertLeftColor;
            TopAlertLight.position.y=-0.58;

            LeftTopAlertMesh.material.color = (AlertShake)?LeftTopAlertColor:LeftTopAlertGrayColor;
            RightTopAlertMesh.material.color = RightTopAlertGrayColor;
        }
        else
        {
            TopAlertLight.color=TopAlertRightColor;
            TopAlertLight.position.y=0.58;

            LeftTopAlertMesh.material.color = LeftTopAlertGrayColor;
            RightTopAlertMesh.material.color = (AlertShake)?RightTopAlertColor:RightTopAlertGrayColor;
        }
    }

    if(Config.HaveBackFire)
    {
        //排氣管點火
        this.LeftBackFireGroup=new THREE.Group();
        this.RightBackFireGroup=new THREE.Group();
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
            BackFire.scale.set((i+1)*0.4,(i+1)*0.4,1);
            this.LeftBackFireGroup.add(BackFire);

            var material = new THREE.SpriteMaterial({
                map: FireTexture[i], 
                color: 0xffffff, 
                transparent: true,
                depthWrite: false,
                depthTest: true
            });
            var BackFire = new THREE.Sprite( material );
            BackFire.position.set(i*0.7,0,0);
            BackFire.scale.set((i+1)*0.4,(i+1)*0.4,1);
            this.RightBackFireGroup.add(BackFire);
        }
        
        this.LeftBackFireGroup.position.set(2.3,-0.46,0.1);
        this.LeftBackFireGroup.scale.set(0.15,0.2,0.2);

        this.RightBackFireGroup.position.set(2.3,0.46,0.1);
        this.RightBackFireGroup.scale.set(0.15,0.2,0.2);

        this.BackFireGroup.add(this.LeftBackFireGroup);
        this.BackFireGroup.add(this.RightBackFireGroup);

        //氮氣點火
        this.LeftBackBlueFireGroup=new THREE.Group();
        this.RightBackBlueFireGroup=new THREE.Group();
        for(var i=0;i<5;i++)
        {
            var material = new THREE.SpriteMaterial({
                map: BlueFireTexture[i], 
                color: 0xffffff, 
                transparent: true,
                depthWrite: false,
                depthTest: true
            });
            var BackFire = new THREE.Sprite( material );
            BackFire.position.set(i*0.7,0,0);
            BackFire.scale.set((i+1)*0.4,(i+1)*0.4,1);
            this.LeftBackBlueFireGroup.add(BackFire);

            var material = new THREE.SpriteMaterial({
                map: BlueFireTexture[i], 
                color: 0xffffff, 
                transparent: true,
                depthWrite: false,
                depthTest: true
            });
            var BackFire = new THREE.Sprite( material );
            BackFire.position.set(i*0.7,0,0);
            BackFire.scale.set((i+1)*0.4,(i+1)*0.4,1);
            this.RightBackBlueFireGroup.add(BackFire);
        }

        this.LeftBackBlueFireGroup.position.set(2.3,-0.46,0.1);
        this.LeftBackBlueFireGroup.scale.set(0.15,0.2,0.2);

        this.RightBackBlueFireGroup.position.set(2.3,0.46,0.1);
        this.RightBackBlueFireGroup.scale.set(0.15,0.2,0.2);

        this.BackBlueFireGroup.add(this.LeftBackBlueFireGroup);
        this.BackBlueFireGroup.add(this.RightBackBlueFireGroup);
    }

    //設定聲音
    for(var i=0;i<SUVSoundBuffer.length;i++)
    {
        var Sound=new THREE.PositionalAudio(MainListener);
        Sound.setBuffer(SUVSoundBuffer[i]);
        //Sound.setLoop(true);
        //Sound.setMaxDistance(20);
        Sound.setRefDistance(0.7);
        //Sound.setDistanceModel('linear');
        
        this.EngineSoundArray.push(Sound);
        this.MeshGroup.add(Sound);
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
        // console.log(ThisCar.Speed.y);

        // ThisCar.RadioMesh.rotateX(Math.PI/2);
        
        // ThisCar.RadioMesh.rotation.x = Math.PI/2;
        // ThisCar.RadioMesh.rotation.x = Math.PI/180*(90+ThisCar.Speed.y*50);
        // ThisCar.RadioMesh.rotation.z = Math.PI/180*(45);
        ThisCar.UpdateRadio(ThisCar.Speed);

        if(Config.HaveBackFire)
        {
            if(ThisCar.OnBackFireVisible)
            {
                for(var i=0;i<ThisCar.LeftBackFireGroup.children.length;i++)
                {
                    ThisCar.LeftBackFireGroup.children[i].position.y=RandF(0.2)-0.1;
                    ThisCar.LeftBackFireGroup.children[i].position.z=RandF(0.2)-0.1;
                    ThisCar.LeftBackFireGroup.children[i].material.opacity=RandF(0.7);
                    ThisCar.LeftBackFireGroup.children[i].material.rotation+=RandF(3);
                }
                for(var i=0;i<ThisCar.RightBackFireGroup.children.length;i++)
                {
                    ThisCar.RightBackFireGroup.children[i].position.y=RandF(0.2)-0.1;
                    ThisCar.RightBackFireGroup.children[i].position.z=RandF(0.2)-0.1;
                    ThisCar.RightBackFireGroup.children[i].material.opacity=RandF(0.7);
                    ThisCar.RightBackFireGroup.children[i].material.rotation+=RandF(3);
                }
                
            }

            if(ThisCar.OnBackBlueFireVisible)
            {
                for(var i=0;i<ThisCar.LeftBackBlueFireGroup.children.length;i++)
                {
                    ThisCar.LeftBackBlueFireGroup.children[i].position.y=RandF(0.2)-0.1;
                    ThisCar.LeftBackBlueFireGroup.children[i].position.z=RandF(0.2)-0.1;
                    ThisCar.LeftBackBlueFireGroup.children[i].material.opacity=RandF(0.7);
                    ThisCar.LeftBackBlueFireGroup.children[i].material.rotation+=RandF(3);
                }
                for(var i=0;i<ThisCar.RightBackBlueFireGroup.children.length;i++)
                {
                    ThisCar.RightBackBlueFireGroup.children[i].position.y=RandF(0.2)-0.1;
                    ThisCar.RightBackBlueFireGroup.children[i].position.z=RandF(0.2)-0.1;
                    ThisCar.RightBackBlueFireGroup.children[i].material.opacity=RandF(0.7);
                    ThisCar.RightBackBlueFireGroup.children[i].material.rotation+=RandF(3);
                }
            }
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

            //輪胎半徑超過0.28則會出現錯誤
            ThisCar.WheelBrakeMashArray[i].position.copy(t.position);
            ThisCar.WheelBrakeMashArray[i].position.z+=/*0.0168*/0.07616;
            ThisCar.WheelBrakeMashArray[i].quaternion.copy(ThisCar.Body.quaternion);

            if(!isNaN(ThisCar.Vehicle.wheelInfos[i].steering))
                ThisCar.WheelBrakeMashArray[i].rotateZ(ThisCar.Vehicle.wheelInfos[i].steering);
        }

        NowSpeed=ThisCar.Speed;

        //後方倒退燈
        ReversingLeftLight.visible=ReversingRightLight.visible=(ThisCar.GetNowGear()==0);

        ThisCar.UpdateAlert();

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

    function ChangeGearCallBack(ThisCar)
    {
        ShowBackFireTime=5;
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