function Car(iConfig)
{
	var Config={
        Scene:Scene,
        World:world,
        Stay:false,                     //是否不能被操控
        Mass:2000,                      //質量
        EngineForce:18000,              //引擎力量
        BrakeForce:200,                 //煞車力量
        HaveO2N2:true,					//氮氣
        SteerMax:45,                    //轉向最大角度
        SteerAdd:22.5/2,                //轉向速度
        SteerAddLinear:0.5,             //轉向線性化
        AiSteerAdd:22.5,                //Ai轉向速度
        AiSteerAddLinear:0,             //Ai轉向線性化
        O2N2Max:60*5,					//氮氣最大量
        DriftLimit:3,                 //輪胎側滑臨界值，越高越不容易側滑
        DriftControl:1,              //前輪摩擦力加權(數字小甩尾困難，數字大轉向過度)
        AutoGear:false,					//是否是自排
        Gear:[							//齒輪設定
            {
                Reverse:true,   //倒退檔
				TargetSpeed:60,
                TorquePer:0.5              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:60,
                TorquePer:0.5              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:120,
                TorquePer:0.4              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:180,
                TorquePer:0.3              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:240,
                TorquePer:0.2              //扭力比例
			},
			{
				Reverse:false,
				TargetSpeed:300,
                TorquePer:0.1              //扭力比例
            },
            {
				Reverse:false,
				TargetSpeed:360,
                TorquePer:0.05              //扭力比例
            }
        ],
        WheelOptions:{
            radius: 0.28 ,
            directionLocal: new CANNON.Vec3(0, 0, -1),
            suspensionStiffness: 30,
            //suspensionRestLength: 0.5,
            suspensionRestLength: 0.0,
            frictionSlip: 3*0.9*0.7*0.7*1.8/**1.5*/,
            dampingRelaxation: 2.3/3*1.5,
            dampingCompression: 4.4/3*1.5,
            maxSuspensionForce: 100000,
            rollInfluence:  /*0.01*/0.375,
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
                Position:new THREE.Vector3(-1.265,-1.7/2+0.2,0.15),
                suspensionRestLength:0.25*2/3,
                maxSuspensionTravel:0.25*2/3,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:false,
                Steer:true,
                Position:new THREE.Vector3(-1.265,1.7/2-0.2,0.15),
                suspensionRestLength:0.25*2/3,
                maxSuspensionTravel:0.25*2/3,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(1.11,-1.7/2+0.2,0.1),
                suspensionRestLength:0.25*2/3,
                maxSuspensionTravel:0.25*2/3,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(1.11,1.7/2-0.2,0.1),
                suspensionRestLength:0.25*2/3,
                maxSuspensionTravel:0.25*2/3,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            }
        ],
        Ai:false,
        AiTargetSpeed:0,
        AiAbidePer:0.5,                    //守法機率
        CanReset:false,					//是否會清除
        AiResetZOffset:0,               //重製時Z軸高度
        AiTargetLaneYOffsetMax:2,          //習慣偏移最大量
		InitSpeed:0,
		LinearDamping:0.01,
        AngularDamping:0.3,
        CameraOptions:{
            Default:{
                Position:new THREE.Vector3(10,5,2),     //+右-左，+上-下，+後-前
                SpeedAdd:new THREE.Vector3(0,0,0.5),    //速度影響，0~1，數字越大鏡頭位置阻尼越大
                SpeedPer:new THREE.Vector3(0,0,1),      //速度加成倍率
                RotationEffect:0.85                     //轉向影響，0~1，數字越小鏡頭旋轉越鎖定
            },
            LookBack:{
                Position:new THREE.Vector3(0,2,10)
            },
            LookLeft:{
                Position:new THREE.Vector3(5,2,0)
            },
            LookRight:{
                Position:new THREE.Vector3(-5,2,0)
            },
            FOV:{
                Position:new THREE.Vector3(0,0.8,-1),
                SpeedAdd:new THREE.Vector3(0,0,0.8),
                SpeedPer:new THREE.Vector3(0,0,0),
                RotationEffect:0
            },
            Ended:{
                Position:new THREE.Vector3(1.25,0.5,-4.5)
            },
        },
        HaveSound:false,
        SoundOptions:{
            ChangeGearVolumeDelay:30,       //換檔延遲
            ScreamPlaybackRate:[1,0.4],     //煞車聲設定
            Samples:[                       //引擎聲音設定[基礎pitch,拉轉增加的pitch]
                [1,0.3],
                [0.7,0.3],
                [0.7,0.5]
            ]
        },
        OnReady2ResetCallBack:function(){},
        Ready2ResetCallBack:function(){},
        OnResetCallBack:function(){},
        ResetCallBack:function(){},
        OnRunCallBack:function(){},
        RunCallBack:function(){},
        TakeBreak:function(){},
        UnTakeBreak:function(){},
        UserResetCallBack:function(){},
        ViewTypeChangeCallBack:function(){},
        ChangeGearCallBack:function(){},
    };

    Config=$.extend(Config,iConfig);

    //繼承BasicObj
    this.prototype=Object.create(BasicObj.prototype);
    BasicObj.call(this,Config);


    var ThisCar=this;
    this.BodySize=new CANNON.Vec3(4,1.5,10);    //預判物體大小
    this.Package=[];                //附加貨櫃或額外物體

    this.NeedReset=Config.CanReset; //是否需要回到重置池
    this.IsAi=Config.Ai;            //是否是AI
    this.AiAbide=true;              //是否守法
    var KeyUserOnReset=false;       //玩家按下重置
    this.UserOnReset=false;         //玩家要求重置中
    this.UserOnResetTime=0;         //玩家要求重置延遲
    this.Stay=Config.Stay;          //是否不能動
    var HaveSound=Config.HaveSound; //是否可以播放聲音
    var MasterVolume=0;             //主音量

    this.Speed=new CANNON.Vec3();   //車輛速度
    this.SpeedLength=0;             //移動向量距離
    this.MoveAngle=0;               //車輛移動角度

    var NowGear=0;                  //目前檔位
    this.BestGearPer=0;             //最佳升檔轉速百分比
    this.BestPervGearPer=0;         //最佳降檔轉速百分比
    var NowEngineSpeedPer=0;		//目前引擎轉速百分比
    var NowClutchPer=0;             //目前離合器百分比
    this.EngineOverRunning=false;   //引擎是否超轉中
    var EngineOverRunningDelayTime=0;   //引擎超轉時油門延遲
    var KeyUseN2O2=false;           //是否按下使用氮氣
    var UseN2O=false;               //是否使用氮氣
    var LastUseN2O=false;
    var UseN2OVolume=0;

    this.OnThrottleUp=false;        //是否踩油門
    var ThrottleUp=false;           //是否踩油門
    var LastThrottleState=false;    //上次油門狀態
    this.OnTakeBrake=false;         //是否踩煞車
    var TakeBrakePer=0;             //煞車量

    var TargetSteerVal=0;           //目標輪胎轉向
    var NowSteerVal=0;              //目前輪胎轉向

    this.Index=AllCar.length;       //編號
    this.ResetCount=0;              //重製次數

    var AutoGearDelayTime=0;
    var AutoGearDelayTimeMax=60;	//自動換檔延遲時間
    var KeyNextGear=false;          //玩家按下進檔
    var HadKeyNextGear=false;      //玩家曾經按下進檔
    var KeyPervGear=false;          //玩家按下退檔
    var HadKeyPervGear=false;      //玩家曾經按下退檔
    var ViewType=0;                 //視角
    var KeyChangeViewType=false;    //玩家按下更換視角
    var HadKeyChangeViewType=false; //玩家曾經按下更換視角
    var KeyLookBack=false;          //玩家看後方
    var LastKeyLookBackState=false; //玩家上次看後方的狀態
    var KeyLookLeft=false;          //玩家看左方
    var LastKeyLookLeftState=false; //玩家上次看左方的狀態
    var KeyLookRight=false;         //玩家看右方
    var LastKeyLookRightState=false;//玩家上次看右方的狀態
    var FOVSpeedAdd=new THREE.Vector3(); //FOV暫存

    var WheelSpeedMin=0;            //動力輪胎最低速度
    var WheelSpeedMax=0;            //動力輪胎最高速度

    this.NowO2N2=Config.O2N2Max;    //目前氮氣量
    this.O2N2Max=Config.O2N2Max;    //氮氣最高量

    var FrictionSlipMax=Config.WheelOptions.frictionSlip*1; //最大摩擦力
    this.WheelMashArray=[];          //輪胎物件(three.js)
    var wheelBodies = [];           //輪胎物件(cannon.js)
    this.OnDrift=false;             //是否甩尾中
    this.OnFly=false;               //是否飛行中
    var WheelRadiusFix=0;           //輪胎修正量

    this.MeshGroup=new THREE.Group();
    Config.Scene.add(this.MeshGroup);

    this.LOD=new THREE.LOD();
    this.MeshGroup.add(this.LOD);

    var ShowBackFireTime=0;         //顯示火焰時間
    var ShowBackFireTimeMax=5;      //顯示火焰最大時間
    this.OnBackFireVisible=false;   //是否正在顯示火焰
    this.OnBackBlueFireVisible=false;   //是否正在顯示氮氣火焰
    this.BackFireGroup=new THREE.Group();       //排氣管火焰
    this.BackBlueFireGroup=new THREE.Group();   //排氣管氮氣火焰
    this.MeshGroup.add(this.BackFireGroup);
    this.MeshGroup.add(this.BackBlueFireGroup);

    this.Camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.5,500);
    this.Camera.up=new THREE.Vector3(0,0,1);
    this.Camera.position.set(0,2,6);
    //this.MeshGroup.add(this.Camera);

    this.CameraCorrectionGroup=new THREE.Group();
    this.CameraCorrectionGroup.rotation.x=90*Math.PI/180;
    this.CameraCorrectionGroup.rotation.y=90*Math.PI/180;
    this.CameraCorrectionGroup.rotation.z=0*Math.PI/180;

    this.CameraRotateGruop=new THREE.Group();
    this.CameraRotateGruop.add(this.Camera);
    this.CameraCorrectionGroup.add(this.CameraRotateGruop);
    this.MeshGroup.add(this.CameraCorrectionGroup);

    var CameraDefaultRotation=0;        //鏡頭左右旋轉量
    var CameraShake=0;                  //鏡頭晃動量
    var CameraShakeDelay=0;             //鏡頭晃動
    var CameraShakeTarget=new THREE.Vector3();
    var CameraShakeOffect=new THREE.Vector3();
    
    //建立鋼體
    this.Body=new CANNON.Body({
        mass:Config.Mass,
        material:CarBodyMaterial
    });
    this.Body.linearDamping=Config.LinearDamping;
    this.Body.angularDamping=Config.AngularDamping;
    this.Body.position.x=Config.Position.x;
    this.Body.position.y=Config.Position.y;
    this.Body.position.z=Config.Position.z;

    // Create the vehicle
    this.Vehicle=new CANNON.RaycastVehicle({
        chassisBody: this.Body
    });
    this.Vehicle.addToWorld(Config.World);

    //建構車輪----------

    var DisplayWheelSize=Config.WheelOptions.radius*1;
    WheelRadiusFix=(Config.WheelOptions.radius-0.28);
    Config.WheelOptions.radius=0.28;

    for(var i=0,len=Config.Wheel.length;i<len;i++)
    {
        Config.WheelOptions.chassisConnectionPointLocal.set(Config.Wheel[i].Position.x,Config.Wheel[i].Position.y,Config.Wheel[i].Position.z);
        Config.WheelOptions.suspensionRestLength=Config.Wheel[i].suspensionRestLength;
        Config.WheelOptions.maxSuspensionTravel=Config.Wheel[i].maxSuspensionTravel;
        this.Vehicle.addWheel(Config.WheelOptions);
    }

    for(var i=0,len=this.Vehicle.wheelInfos.length; i<len; i++)
    {
        var Wheel = this.Vehicle.wheelInfos[i];
        Wheel.UserDataSpeed=0;

        //var cylinderShape = new CANNON.Cylinder(Wheel.radius, Wheel.radius, Wheel.radius / 2, 10);
        var cylinderShape = new CANNON.Cylinder(DisplayWheelSize, DisplayWheelSize, DisplayWheelSize / 2, 10);

        var WheelBody = new CANNON.Body({ mass: 5,materal:wheelMaterial });
        var q = new CANNON.Quaternion();

        WheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
        wheelBodies.push(WheelBody);

        var WheelLOD=new THREE.LOD();

        Geometry=new THREE.CylinderBufferGeometry(DisplayWheelSize,DisplayWheelSize,DisplayWheelSize / 2,10);
        Material=new THREE.MeshLambertMaterial({color:0x333333});
        var WheelMash=new THREE.Mesh(Geometry,Material);
        WheelLOD.addLevel(WheelMash,0);
        
        Geometry=new THREE.CylinderBufferGeometry(DisplayWheelSize,DisplayWheelSize,DisplayWheelSize / 2,5);
        Material=new THREE.MeshLambertMaterial({color:0x333333});
        var WheelMashL1=new THREE.Mesh(Geometry,Material);
        WheelLOD.addLevel(WheelMashL1,100);
        
        Geometry=new THREE.CylinderBufferGeometry(DisplayWheelSize,DisplayWheelSize,DisplayWheelSize / 2,3);
        Material=new THREE.MeshLambertMaterial({color:0x333333});
        var WheelMashL2=new THREE.Mesh(Geometry,Material);
        WheelLOD.addLevel(WheelMashL2,150);

        WheelLOD.addLevel(new THREE.Object3D(),300);

        WheelLOD.quaternion.copy(WheelBody.quaternion);
        WheelLOD.position.copy(WheelBody.position);

        this.WheelMashArray.push(WheelLOD);
        Config.Scene.add(WheelLOD);
    }

    var WheelScream=false;
    var ScreamSound=new THREE.PositionalAudio(MainListener);
    ScreamSound.setBuffer(DefaultScreamSoundBuffer);
    //ScreamSound.setLoop(true);
    //ScreamSound.setMaxDistance(5);
    ScreamSound.setRefDistance(0.4);
    this.MeshGroup.add(ScreamSound);
    //ScreamSound.setDistanceModel('linear');

    this.EngineSoundArray=[];

    //設定聲音
    this.SetHaveSound=function(Setting){
        HaveSound=Setting;
    };

    var LastSoundValue=0;
    var ChangeGearVolumeDelay=0;       //換檔引擎聲音延遲
    var ThrottleUpRateEffect=1,ThrottleUpEffectRateTarget=1;
    var ThrottleUpVolumeEffect=1,ThrottleUpEffectVolumeTarget=1;
    var BasNumber=1/(Config.SoundOptions.Samples.length-1);
    var ScreamSoundVolume=0;
    var ScreamSoundLastcurrentTime=0;
    var WheelScreamDelay=0;

    //更新音量
    this.UpdateSound=function(Value){

        if(InGarage)return;
        if(SystemGameOver)return;
        if(Config.Scene!=Scene)return;
        if(this.NeedReset)return;

        //if(Math.abs(this.MeshGroup.position.x)<20)
        {
            if(WheelScream && !ScreamSound.isPlaying)
            {
                ScreamSound.play();
                ScreamSound.gain.gain.exponentialRampToValueAtTime(
                    0.0001, 
                    ScreamSound.context.currentTime + 0.001
                );
            }
            

            if(WheelScream)
            {
                WheelScreamDelay=5;
            }
            else
            {
                if(WheelScreamDelay>0)WheelScreamDelay--;
            }
            

            if(WheelScreamDelay>0)
            {
                ScreamSoundVolume+=0.05; if(ScreamSoundVolume>0.99)ScreamSoundVolume=0.99;
                ScreamSound.setPlaybackRate(
                    Config.SoundOptions.ScreamPlaybackRate[0]
                    +RandF(Config.SoundOptions.ScreamPlaybackRate[1])
                );
            }
            else
            {
                ScreamSoundVolume-=0.1; if(ScreamSoundVolume<0)ScreamSoundVolume=0;
            }

            if(ScreamSound.context.currentTime-ScreamSoundLastcurrentTime>0.01)
            {
                ScreamSound.gain.gain.exponentialRampToValueAtTime(
                    0.0001+ScreamSoundVolume*MasterVolume*0.5, 
                    ScreamSound.context.currentTime + 0.01
                );

                ScreamSoundLastcurrentTime=ScreamSound.context.currentTime*1;
            }
        }

        //if(Math.abs(this.MeshGroup.position.x)<20)
        {
            for(var i=0;i<this.EngineSoundArray.length;i++)
                if(!this.EngineSoundArray[i].isPlaying)
                {
                    this.EngineSoundArray[i].play();
                    this.EngineSoundArray[i].gain.gain.exponentialRampToValueAtTime(
                        0.0001, 
                        this.EngineSoundArray[i].context.currentTime + 0.001
                    );
                }

            //踩油門時音量增加
            if(ChangeGearVolumeDelay>0)
            {
                ChangeGearVolumeDelay--; if(UseN2O)ChangeGearVolumeDelay-=2;
                ThrottleUpEffectRateTarget=0.85;
                ThrottleUpEffectVolumeTarget=0.3;
            }
            //沒踩油門時降低音量
            else if(!ThrottleUp)
            {
                ThrottleUpEffectRateTarget=0.7;
                ThrottleUpEffectVolumeTarget=0.3;
            }
            else
            {
                ThrottleUpEffectRateTarget=1;
                ThrottleUpEffectVolumeTarget=1;
            }

            //
            ThrottleUpRateEffect=ThrottleUpRateEffect*0.9+ThrottleUpEffectRateTarget*0.1;
            ThrottleUpVolumeEffect=ThrottleUpVolumeEffect*0.9+ThrottleUpEffectVolumeTarget*0.1;
            

            if(this.EngineSoundArray.length==1)
            {
                this.EngineSoundArray[0].setPlaybackRate((Config.SoundOptions.Samples[0][0]+Value*Config.SoundOptions.Samples[0][1])*ThrottleUpRateEffect);
                //this.EngineSoundArray[0].setVolume(1*ThrottleUpVolumeEffect*MasterVolume);
                this.EngineSoundArray[0].gain.gain.exponentialRampToValueAtTime(
                    0.0001+1*ThrottleUpVolumeEffect*MasterVolume, 
                    this.EngineSoundArray[0].context.currentTime + 0.001
                );
            }
            else
            {
                for(var i=0;i<this.EngineSoundArray.length;i++)
                {
                    this.EngineSoundArray[i].setPlaybackRate((Config.SoundOptions.Samples[i][0]+Value*Config.SoundOptions.Samples[i][1])*ThrottleUpRateEffect);

                    var Bas=BasNumber*i;

                    if(Math.abs(Bas-Value)>BasNumber)
                    {
                        //this.EngineSoundArray[i].setVolume(0);
                        this.EngineSoundArray[i].gain.gain.exponentialRampToValueAtTime(
                            0.0001, 
                            this.EngineSoundArray[i].context.currentTime + 0.001
                        );
                    }
                    else
                    {
                        this.EngineSoundArray[i].gain.gain.exponentialRampToValueAtTime(
                            0.0001+(1-Math.abs(Bas-Value)/BasNumber)*ThrottleUpVolumeEffect*MasterVolume, 
                            this.EngineSoundArray[i].context.currentTime + 0.001
                        );
                        //this.EngineSoundArray[i].setVolume((1-Math.abs(Bas-Value)/BasNumber)*ThrottleUpVolumeEffect*MasterVolume);
                    }
                }
            }
        }
    };

    //停止聲音
    this.StopAllSound=function(){

        if(ScreamSound.isPlaying)
        {
            ScreamSound.stop();
        }

        for(var i=0;i<this.EngineSoundArray.length;i++)
        {
            if(this.EngineSoundArray[i].isPlaying)
            {
                this.EngineSoundArray[i].stop();
            }
        }
    };

    //開啟聲音
    this.SoundUnDestroy=function(){

        //如果是玩家車輛 則設定聲音迴圈，避免中斷感
        if(MainFocusUnit==ThisCar)
        {
            ScreamSound.setLoop(true);

            for(var i=0;i<this.EngineSoundArray.length;i++)
            {
                this.EngineSoundArray[i].setLoop(true);
            }
        }

        SoundDestroyed=false;

        if(!ScreamSound.isPlaying)
        {
            ScreamSound.startTime=0;
            ScreamSound.play();
        }

        //if(!ScreamSound.isPlaying)
        {
            /*ScreamSound.context.currentTime=0;
            ScreamSound.play();*/
            

            ScreamSound.gain.gain.exponentialRampToValueAtTime(
                0.0001, 
                ScreamSound.context.currentTime + 0.001
            );
        }

        for(var i=0;i<this.EngineSoundArray.length;i++)
        {
            //if(!this.EngineSoundArray[i].isPlaying)
            {
                /*this.EngineSoundArray[i].context.currentTime=0;
                this.EngineSoundArray[i].play();*/
                

                this.EngineSoundArray[i].gain.gain.exponentialRampToValueAtTime(
                    0.0001, 
                    this.EngineSoundArray[i].context.currentTime + 0.001
                );
            }
        }
        
    };

    //關閉聲音
    var SoundDestroyed=false;
    this.SoundDestroy=function(){

        SoundDestroyed=true;

        if(ScreamSound.isPlaying)
        {
            ScreamSound.stop();
            //ScreamSound.context.currentTime=0;
            //ScreamSound.pause();

            ScreamSound.gain.gain.exponentialRampToValueAtTime(
                0.0001, 
                ScreamSound.context.currentTime + 0.001
            );
        }

        for(var i=0;i<this.EngineSoundArray.length;i++)
        {
            if(this.EngineSoundArray[i].isPlaying)
            {
                this.EngineSoundArray[i].stop();
                //this.EngineSoundArray[i].context.currentTime=0;
                //this.EngineSoundArray[i].pause();

                this.EngineSoundArray[i].gain.gain.exponentialRampToValueAtTime(
                    0.0001, 
                    this.EngineSoundArray[i].context.currentTime + 0.001
                );
            }
        }
    };

    //製造鏡頭搖晃
    this.MakeCameraShake=function(Value=5){

        if(Value>CameraShake)
        {
            CameraShake=Value*1;
            if(CameraShake>10)CameraShake=10;
        }
    };
    
    //Get UseN2O State
    this.GetUseN2O=function(){ return UseN2O; };

    //更新LOD
    this.LODUpdate=function(Camera){

        //車體LOD
        this.LOD.update(Camera);

        //輪胎LOD
        for(var i=0,j=this.WheelMashArray.length;i<j;i++)
        {
            this.WheelMashArray[i].update(Camera);
        }
    };

    //取得目前檔位
    this.GetNowGear=function(){ return NowGear; };

    //更新檔位
    this.ChangeGear=function(){

        for (var i = 0,j=this.Vehicle.wheelInfos.length; i < j; i++) {
            this.Vehicle.wheelInfos[i].customSlidingRotationalSpeed= -(Config.Gear[NowGear].TargetSpeed);
        }

        this.BestGearPer=1-(Config.Gear[NowGear].TorquePer*0.85);
        this.BestPervGearPer=0;

        if(NowGear==Config.Gear.length-1)
            this.BestGearPer=1;

        if(NowGear-1>=1)
            this.BestPervGearPer=1-(Config.Gear[NowGear-1].TorquePer);

        this.MathGearDashArray();

        Config.ChangeGearCallBack && Config.ChangeGearCallBack(ThisCar);
    };

    //進一檔
    this.NextGear=function(){

    	if(NowGear+1<Config.Gear.length)
    	{
            //消除提醒
            if(ThisCar==MainFocusUnit)
                NextGearRemindTimer=0;

    		NowGear++;
            this.ChangeGear();
            ChangeGearVolumeDelay=Config.SoundOptions.ChangeGearVolumeDelay;
    	}
    };

    //退一檔
    this.PervGear=function(){

    	if(NowGear>0)
    	{
            //消除提醒
            if(ThisCar==MainFocusUnit)
                PervGearRemindTimer=0;

    		NowGear--;
    		this.ChangeGear();
    	}
    };

    //設定檔位
    this.SetGear=function(NewGear,PowerReset=false){

        if(NewGear<0)NewGear=0;
        if(NewGear>Config.Gear.length-1)NewGear=Config.Gear.length-1;

        if(NowGear!=NewGear || PowerReset)
        {
            NowGear=NewGear*1;
            this.ChangeGear();
        }
    };

    //依照速度找到符合的檔位
    this.FindGear=function(TargetSpeed=0){

        var NewGear=1;
        for(var i=0;i<Config.Gear.length;i++)
        {
            if(Config.Gear[i].Reverse)
            {
                continue;
            }
            else if(TargetSpeed>Config.Gear[i].TargetSpeed)
            {
                NewGear=i;
                continue;
            }
            else
            {
                NewGear=i;
                break;
            }
        }
        return NewGear;
    };

    //計算RPM SVG
    this.RPMStrokeColor='#ffffff';
    this.RPMDashArrayData='0 '+HUDRPMLength+' 0';
    var LastRPMValue=0,RPMValue=0,RPMMin=0.2,RPMMax=0.85;
    this.MathPRMDashArray=function(){
        var RPM = NowEngineSpeedPer * (ThrottleUp?1:0.7);
        RPMValue=RPM*0.2+LastRPMValue*0.8;
        LastRPMValue=RPMValue*1;
        this.RPMDashArrayData='0 '+(HUDRPMLength*(1-(RPMValue*(RPMMax-RPMMin)+RPMMin)))+' '+(HUDRPMLength*(RPMValue*(RPMMax-RPMMin)+RPMMin));
        this.RPMStrokeColor=(RPMValue>=this.BestGearPer)?'#ff0000':'#ffffff';

        return RPMValue;
    };
    //this.MathPRMDashArray();

    this.O2N2DashArrayData='0 '+HUDO2N2Length+' 0';
    this.MathO2N2DashArray=function(){
        this.O2N2DashArrayData='0 '+(HUDO2N2Length*(1-this.GetO2N2Per()))+' '+(HUDO2N2Length*(this.GetO2N2Per()));
    };
    //this.MathO2N2DashArray();

    //計算HUD檔位SVG
    var ReverseGearCount=1;
    this.AllGearDashArrayData=HUDGearBarLength+' 0';    //所有檔位SVG
    this.NowGearDashArrayData=HUDGearBarLength+' 0';    //目前檔位SVG
    var GearDashArrayDataInterval=3;                    //間隔大小
    this.MathGearDashArray=function(){

        var Length=HUDGearBarLength*1;
        Length-=(Config.Gear.length-ReverseGearCount-1)*GearDashArrayDataInterval;

        Length/=(Config.Gear.length-ReverseGearCount);
        this.AllGearDashArrayData=Length+' '+GearDashArrayDataInterval;

        this.NowGearDashArrayData='';
        for(var i=Config.Gear.length-ReverseGearCount-1;i>=0;i--)
        {
            if(i<=NowGear-ReverseGearCount)
            {
                this.NowGearDashArrayData+=' '+Length+' '+GearDashArrayDataInterval;
            }
            else
            {
                this.NowGearDashArrayData+=' 0 '+(Length+GearDashArrayDataInterval);
            }
        }
    };
    this.MathGearDashArray();

    //顯示物件
    this.Show=function(){

        this.MeshGroup.visible=true;
			for(var i=0,j=this.WheelMashArray.length;i<j;i++)
                this.WheelMashArray[i].visible=true;
            
        this.Body.wakeUp();
		this.Body.collisionResponse=true;
    };

    //隱藏物件
    this.Hide=function(){
        
        this.MeshGroup.visible=false;
        for(var i=0,j=this.WheelMashArray.length;i<j;i++)
            this.WheelMashArray[i].visible=false;
        
        this.Body.position.set(this.Index*100,-999999,999999);
        this.Body.sleep();
        this.Body.collisionResponse=false;
    };

    //放入重置池，等待重置
    this.Ready2Reset=function(){

        Config.OnReady2ResetCallBack && Config.OnReady2ResetCallBack(ThisCar);

        this.NeedReset=true;
        this.AiTargetLane=null;
        this.AiChangeLaneTime=0;

        this.Hide();

        //console.log('need reset');
        DebugMeedResetCarCount++;

        Config.Ready2ResetCallBack && Config.Ready2ResetCallBack(ThisCar);

    };

    //重置
    this.Reset=function(){

        Config.OnResetCallBack && Config.OnResetCallBack(ThisCar);

        //隨機挑選一個車道
		var Njo=Rand(AllLane.length);  //Njo=1;
		var TargetLane=AllLane[Njo];

        //如果車道可以放置車輛
		if(TargetLane.CanPutCar)
		{
            //歸零
            this.Body.velocity.setZero();
            this.Body.angularVelocity.setZero();
            this.Body.force.setZero();
            this.Body.torque.setZero();
            this.Body.quaternion.set(0,0,0,1);
			this.AiTargetSpeed=TargetLane.TargetSpeed;

			//速度大於車道速度，放前面
			if(!TargetLane.Reverse && SystemRelativePosition.x - TargetLane.TargetSpeed/60/3.6>0)
			{
				this.Body.position.set(-SystemGameSize,TargetLane.Position.y+(RandF(0.5)-0.25),1+Config.AiResetZOffset);
				this.Body.quaternion.set(0,0,0,1);
				this.Body.velocity.x=-this.AiTargetSpeed*60/60/3.6;
				this.Body.velocity.y=0;
				this.Body.velocity.z=0;

				//console.log('put front')
			}

			//速度大於車道速度，放後面
			else if(!TargetLane.Reverse && SystemRelativePosition.x - TargetLane.TargetSpeed/60/3.6<0)
			{
				this.Body.position.set(SystemGameSize,TargetLane.Position.y+(RandF(0.5)-0.25),1+Config.AiResetZOffset);
				this.Body.quaternion.set(0,0,0,1);
				this.Body.velocity.x=-this.AiTargetSpeed*60/60/3.6;
				this.Body.velocity.y=0;
				this.Body.velocity.z=0;

				//console.log('put back')
			}
			//
			else if(TargetLane.Reverse && SystemRelativePosition.x + TargetLane.TargetSpeed/60/3.6>0)
			{
				this.Body.position.set(-SystemGameSize,TargetLane.Position.y+(RandF(0.5)-0.25),1+Config.AiResetZOffset);
				//this.Body.quaternion.set(0,0,0,1);
				this.Body.velocity.x=this.AiTargetSpeed*60/60/3.6;
				this.Body.velocity.y=0;
				this.Body.velocity.z=0;
				this.Body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),Math.PI);

				//console.log('put back')
			}
			else if(TargetLane.Reverse && SystemRelativePosition.x + TargetLane.TargetSpeed/60/3.6<0)
			{
				this.Body.position.set(SystemGameSize,TargetLane.Position.y+(RandF(0.5)-0.25),1+Config.AiResetZOffset);
				//this.Body.quaternion.set(0,0,0,1);
				this.Body.velocity.x=this.AiTargetSpeed*60/60/3.6;
				this.Body.velocity.y=0;
				this.Body.velocity.z=0;
				this.Body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),Math.PI);

				//console.log('put front')
            }

            //換檔至目標速度
            NowGear=this.FindGear(this.AiTargetSpeed);
            this.SetGear(NowGear,true);

            //隨機是否違規駕駛
            var Abide=RandF(1);
            this.AiAbide=(Abide<Config.AiAbidePer);

            this.Stay=false;
            this.AiHitDelay=60;
            this.AiTargetLane=TargetLane;
            this.AiTargetLaneYOffset=RandF(Config.AiTargetLaneYOffsetMax)-Config.AiTargetLaneYOffsetMax*0.5;
            this.AiChangeLaneTimeMax=(Rand(60*4)+60*6)*this.AiChangeLaneTimeMaxPer;
            this.AiChangeLaneTime=Math.floor(Rand(this.AiChangeLaneTimeMax)*0.8);
            this.NeedReset=false;
            this.AiHasCrack=false;
            this.AiHasCrackTime=0;
            this.AiNoMoveTime=0;

			this.Show();
			TargetLane.PutCar();
            TargetLane.Run();
            
            DebugMeedResetCarCount--;
            this.ResetCount++;
		}
		
        Config.ResetCallBack && Config.ResetCallBack(ThisCar);
    };

    //玩家要求重置
    this.UserReset=function(){

        //消除提醒
        if(ThisCar==MainFocusUnit)
            ResetRemindTimer=0;
        
        this.UserOnReset=true;
        this.Body.position.setZero();
        this.Body.position.y=3;
        this.Body.position.z=4;
        this.Body.velocity.setZero();
        this.Body.angularVelocity.setZero();
        this.Body.force.setZero();
        this.Body.torque.setZero();
        this.Body.quaternion.set(0,0,0,1);
        this.SetGear(1);
        this.UserOnResetTime=0;

        Config.UserResetCallBack && Config.UserResetCallBack(ThisCar);
    };

    //變換車道
    this.ChangeLane=function(){

        if(this.AiTargetLane==null)
            return;

        //鄰近車道只有一條
        if(this.AiTargetLane.Next.length==1)
        {
            TargetLane=AllLane[this.AiTargetLane.Index+this.AiTargetLane.Next[0]];
        }
        //鄰近車道有多條，則隨機選擇
        else
        {
            var Njo=this.AiTargetLane.Next[Rand(2)];
            TargetLane=AllLane[this.AiTargetLane.Index+Njo];
        }

        //變換
        if(TargetLane!=this.AiTargetLane)
        {
            this.AiTargetSpeed=TargetLane.TargetSpeed;
            this.AiTargetLane=TargetLane;
            this.AiTargetLaneYOffset=RandF(Config.AiTargetLaneYOffsetMax)-Config.AiTargetLaneYOffsetMax*0.5;
            this.AiChangeLaneTime=0;
            this.AiChangeLaneTimeMax=(Rand(60*4)+60*6)*this.AiChangeLaneTimeMaxPer;
        }

    };

    //取得目前氮氣量百分比
    this.GetO2N2Per=function(){
    	if(this.O2N2Max>0)
    		return this.NowO2N2/this.O2N2Max;
    	else
    		return 0;
    };

    //增加氮氣
    this.AddN2O2=function(Count=0){

        if(KeyUseN2O2)return;

        this.NowO2N2+=Count;
        if(this.NowO2N2>this.O2N2Max)
            this.NowO2N2=this.O2N2Max;
    };

    //取得目前引擎轉速百分比
    this.GetEngineSpeedPer=function(){
        return NowEngineSpeedPer;
    };

    //計算引擎轉速
    this.UpdateEngineSpeedPer=function(){

        NowClutchPer=0;

        //引擎超轉
        if(this.EngineOverRunning)
        {
            NowEngineSpeedPer=1;
        }
        //沒有超轉
        else
        {
            //輪胎轉速換算
            var Ratio = (WheelSpeedMax)*((Config.Gear[NowGear].Reverse)?-1:1) / (Config.Gear[NowGear].TargetSpeed);

            //引擎轉速加權
            NowEngineSpeedPer=NowEngineSpeedPer*(NowClutchPer) +Ratio*(1-NowClutchPer);

            if(NowEngineSpeedPer>1)NowEngineSpeedPer=1;
            else if(NowEngineSpeedPer<0)NowEngineSpeedPer=0;
        }

        //超轉則震動
        if(NowEngineSpeedPer>=0.98)
        {
            NowEngineSpeedPer-=RandF(0.05);
        }

    };

    //重置
    if(Config.CanReset)
    {
        this.Ready2Reset();
    }
    //不重置
    else
    {
        this.Body.position.set(Config.Position.x,Config.Position.y,Config.Position.z);
        this.Body.velocity.x=-Config.InitSpeed*30/60/3.6;

        //計算符合初始速度的檔位
        NowGear=this.FindGear(Config.InitSpeed);
        this.SetGear(NowGear,true);
    }


	this.Run=function(){

		Config.OnRunCallBack && Config.OnRunCallBack(ThisCar);
        
        //如果車禍超過時間或超過地圖外則放入重置池
        if(Config.CanReset && !this.NeedReset)
    	{
    		if(this.AiHasCrackTime>60*5 || this.Body.position.x<-SystemGameSize-10 || this.Body.position.x>SystemGameSize+10)
    		{
    			this.Ready2Reset();
    		}
        }

        //開啟或關閉聲音
        if(HaveSound && !this.NeedReset && !SystemGameOver)
        {
            MasterVolume+=0.1; if(MasterVolume>1)MasterVolume=1;
            if(MainFocusUnit==ThisCar)MasterVolume=0.5;
        }
        else 
        {
            MasterVolume-=0.2; if(MasterVolume<0)MasterVolume=0;
        }

        if((MasterVolume>0.1 || MainFocusUnit==ThisCar) && SoundDestroyed)
        {
            this.SoundUnDestroy();
        }
        else if(MasterVolume==0 && !SoundDestroyed)
        {
            this.SoundDestroy();
        }

        //更新音量
        this.UpdateSound(LastSoundValue*0.9+NowEngineSpeedPer*0.1);
        LastSoundValue=LastSoundValue*0.9+NowEngineSpeedPer*0.1;

    	if(this.NeedReset)
    		return ;

        //取得速度
    	this.Speed=this.Body.pointToLocalFrame(new CANNON.Vec3(
            this.Body.position.x+ this.Body.velocity.x/60,
            this.Body.position.y+ this.Body.velocity.y/60,
            this.Body.position.z+ this.Body.velocity.z/60
        ),new CANNON.Vec3(0,0,0));

        //移動向量距離
        this.SpeedLength=this.Speed.length();

        //取得移動角度
        this.MoveAngle=Angle3(this.Speed.x,0,0,0,this.Speed.x,this.Speed.y) * ((this.Speed.y<0)?1:-1);

        //取得輪胎速度
        WheelSpeedMin=99999999999999999;
        WheelSpeedMax=-999999999999999999;
        for (var i = 0,j=this.Vehicle.wheelInfos.length; i < j; i++) {
            
            this.Vehicle.wheelInfos[i].UserDataSpeed=GetWheelSpeed(this.Vehicle.wheelInfos[i]);

            if(Config.Wheel[i].Power)
            {
                WheelSpeedMin=Math.min(WheelSpeedMin,this.Vehicle.wheelInfos[i].UserDataSpeed);
                WheelSpeedMax=Math.max(WheelSpeedMax,this.Vehicle.wheelInfos[i].UserDataSpeed);
            }
        }

        //重新計算引擎轉速
        this.UpdateEngineSpeedPer();

        //是否使用氮氣
        KeyUseN2O2=false;
        UseN2O=false;
        if(!this.Stay && !this.IsAi && !SystemGameOver && KeyBoardPressArray[38])
            KeyUseN2O2=CheckKeyBoardPress(UserKeyboardSetting.N2O);

        //消耗氮氣
        if(KeyUseN2O2)
        {
            if(this.NowO2N2>=1*SystemStepPer)
            {
                this.NowO2N2-=1*SystemStepPer;
                UseN2O=true;

                if(this.NowO2N2<=0)
                {
                    this.NowO2N2=0;
                    UseN2O=false;
                }
            }
            else 
                UseN2O=false;
        }
        //依據車輛速度補充氮氣
        else
        {
            this.NowO2N2+=(this.Speed.x*this.Speed.x)*0.1;

            if(this.NowO2N2>this.O2N2Max)
                this.NowO2N2=this.O2N2Max;
        }


        //手排
    	if(!this.Stay && !this.IsAi && !Config.AutoGear && !SystemGameOver)
    	{
            KeyNextGear=CheckKeyBoardPress(UserKeyboardSetting.NextGear);
            KeyPervGear=CheckKeyBoardPress(UserKeyboardSetting.PervGear);

            //進檔
            if(!HadKeyNextGear && KeyNextGear)
            {
                HadKeyNextGear=true;
                this.NextGear();
                this.UpdateEngineSpeedPer();
            }
            else if(HadKeyNextGear && !KeyNextGear)
            {
                HadKeyNextGear=false;
            }

            //退檔
            if(!HadKeyPervGear && KeyPervGear)
            {
                HadKeyPervGear=true;
                this.PervGear();
                this.UpdateEngineSpeedPer();
            }
            else if(HadKeyPervGear && !KeyPervGear)
            {
                HadKeyPervGear=false;
            }
    	}
    	//自排
	    else
	    {
            //如果引擎低轉速則準備降檔
            if(NowGear-1>=1 && -this.Speed.x*60*3.6<Config.Gear[NowGear-1].TargetSpeed*0.8)
            {
                AutoGearDelayTime+=1*SystemStepPer;

                //降檔
                if(AutoGearDelayTime>AutoGearDelayTimeMax)
                {
                    AutoGearDelayTime=0;
                    this.PervGear();
                    this.UpdateEngineSpeedPer();
                }
            }
            //如果引擎高轉速則準備進檔
            else if(NowEngineSpeedPer>this.BestGearPer && !this.OnDrift && !this.OnFly)
            {
                AutoGearDelayTime+=1;

                if(UseN2O)
                    AutoGearDelayTime+=1;

                //進檔
                if(AutoGearDelayTime>AutoGearDelayTimeMax)
                {
                    AutoGearDelayTime=0;
                    this.NextGear();
                    this.UpdateEngineSpeedPer();
                }
            }
            else
            {
                AutoGearDelayTime--;

                if(AutoGearDelayTime<0)
                    AutoGearDelayTime=0;
            }
        }
        
        //玩家要求重置
        if(!this.Stay && !SystemGameOver)
        {
            KeyUserOnReset=CheckKeyBoardPress(UserKeyboardSetting.Reset);

            if(!this.IsAi && !this.UserOnReset && KeyUserOnReset)
            {
                this.UserReset();
            }
            else if(this.UserOnReset)
            {
                this.UserOnResetTime+=1*SystemStepPer;

                if(this.UserOnResetTime>60)
                {
                    this.UserOnReset=false;
                }
            }
        }

        //車輛歸零
    	this.Vehicle.setSteeringValue(0, 0);
        this.Vehicle.setSteeringValue(0, 1);

		for(var i=0,len=Config.Wheel.length;i<len;i++)
        {
            this.Vehicle.setBrake(0, i);

            if(Config.Wheel[i].Power)
            {
            	this.Vehicle.applyEngineForce(0, i);
            }
        }

        //玩家加速
		if(!this.IsAi && !InGarage && !SystemGameOver)
        {
            if(KeyBoardPressArray[38])
            {
                this.SpeedUp();
            }
            else
            {
                this.SpeedDown();
            }
	        	
	    }

        //自動離合器
        //if(MainFocusUnit==ThisCar)
        {
            if(NowEngineSpeedPer<0.5)
            {
                NowClutchPer=1-(NowEngineSpeedPer*2);
            }
            else
            {
                NowClutchPer=0;
            }

            if(ThrottleUp && NowClutchPer>0.95)
            {
                NowClutchPer=0.95;
            }
        }

        //加速
        //if(!this.Stay)
        {
            this.EngineOverRunning=false;

            //引擎超轉延遲
            if(EngineOverRunningDelayTime>0)
                EngineOverRunningDelayTime--;
            
            //超轉
            if(WheelSpeedMax*((Config.Gear[NowGear].Reverse)?-1:1)/Config.Gear[NowGear].TargetSpeed>1)
            {
                this.EngineOverRunning=true;

                //設定超轉延遲
                EngineOverRunningDelayTime=5;

                //車輛給力歸零且煞車
                for(var i=0,len=Config.Wheel.length;i<len;i++)
                {
                    this.Vehicle.setBrake(Config.BrakeForce, i);

                    if(Config.Wheel[i].Power)
                    {
                        this.Vehicle.applyEngineForce(
                            0,
                        i);
                    }
                }
            }
            //輪胎速度小於引擎目標速度
            else if(EngineOverRunningDelayTime<=0 && WheelSpeedMax*((Config.Gear[NowGear].Reverse)?-1:1)/Config.Gear[NowGear].TargetSpeed<=1)
            {
                var Value=0;

                //踩油門
                if(ThrottleUp)
                {
                    //計算
                    Value = (1-(WheelSpeedMax*((Config.Gear[NowGear].Reverse)?-1:1)/Config.Gear[NowGear].TargetSpeed));

                    //扭力轉換
                    if(Value>Config.Gear[NowGear].TorquePer)
                        Value=Config.Gear[NowGear].TorquePer;
                    else if(Value<0)
                        Value=0;

                    //倒退
                    if(Config.Gear[NowGear].Reverse)
                        Value*=-1;

                    Value *= Config.EngineForce;
                    //Value *= (1-NowClutchPer);
                    Value *= ((UseN2O)?5:1);
                }
                //沒踩油門
                else 
                    Value=0;
                
                //車輛給力
                for(var i=0,len=Config.Wheel.length;i<len;i++)
                {
                    this.Vehicle.setBrake(0, i);

                    if(/*this.Vehicle.wheelInfos[i].raycastResult.hasHit && */Config.Wheel[i].Power)
                    {
                        this.Vehicle.applyEngineForce(
                            Value,
                        i);
                    }
                }
            }
        }

        //玩家控制煞車或倒車
        if(!this.Stay && !this.IsAi && !SystemGameOver)
        {
        	if(KeyBoardPressArray[40] || CheckKeyBoardPress(UserKeyboardSetting.Brake))
			{
				this.TakeBrake();
			}
			else
			{
                this.UnTakeBrake();
			}
        }
        else if(this.Stay)
        {
            this.TakeBrake();
        }

        //設定煞車力度
		if(TakeBrakePer>0)
		{
			var BrakeForce=Config.BrakeForce*(-this.Speed.x*20);

			if(BrakeForce>Config.BrakeForce)
				BrakeForce=Config.BrakeForce;

            BrakeForce*=TakeBrakePer;

            for(var i=0,len=Config.Wheel.length;i<len;i++)
            {
                this.Vehicle.setBrake(BrakeForce, i);
            }

            Config.TakeBreak && Config.TakeBreak(ThisCar);
		}
		else
		{
            Config.UnTakeBreak && Config.UnTakeBreak(ThisCar);
        }
    
        //玩家控制轉彎
        if(!this.Stay && !this.IsAi && !SystemGameOver)
		{
			if(KeyBoardPressArray[39])
	        {
	        	this.TurnRight();
	        }
	        else if(KeyBoardPressArray[37])
	        {
	        	this.TurnLeft();
	        }
	        else 
	        {
	            TargetSteerVal=0;
	        }
        }
        
        //計算玩家控制所造成的輪胎轉向
        if(!this.Stay && !this.IsAi)
        {
            if(Math.abs(NowSteerVal-TargetSteerVal)<Config.SteerAdd)
            {
                NowSteerVal=TargetSteerVal;
            }
            else if(NowSteerVal>TargetSteerVal)
            {
                NowSteerVal-=Config.SteerAdd*SystemStepPer;
            }
            else if(NowSteerVal<TargetSteerVal)
            {
                NowSteerVal+=Config.SteerAdd*SystemStepPer;
            }
        }
        //計算AI轉向
        else
        {
            if(Math.abs(NowSteerVal-TargetSteerVal)<Config.AiSteerAdd)
            {
                NowSteerVal=TargetSteerVal;
            }
            else if(NowSteerVal>TargetSteerVal)
            {
                NowSteerVal-=Config.AiSteerAdd*SystemStepPer;
            }
            else if(NowSteerVal<TargetSteerVal)
            {
                NowSteerVal+=Config.AiSteerAdd*SystemStepPer;
            }
        }

        //限制
        if(NowSteerVal>Config.SteerMax)
        {
            NowSteerVal=Config.SteerMax;
        }
        else if(NowSteerVal<-Config.SteerMax)
        {
            NowSteerVal=-Config.SteerMax;
        }

        //玩家控制所造成的輪胎轉向做非線性調整
        var SteerPer=(NowSteerVal/Config.SteerMax)*(NowSteerVal/Config.SteerMax)*((NowSteerVal<0)?-1:1);

        //線性化調整
        if(!this.IsAi)
        {  
            SteerPer = SteerPer*(1-Config.SteerAddLinear) + (NowSteerVal/Config.SteerMax)*(Config.SteerAddLinear);
        }
        else
        {
            SteerPer = SteerPer*(1-Config.AiSteerAddLinear) + (NowSteerVal/Config.SteerMax)*(Config.AiSteerAddLinear);
        }

        //轉向橫移方向
        var ShiftAng=this.MoveAngle*1;
        var ShiftAngPer=this.SpeedLength;

        if(ShiftAngPer>0.5)ShiftAngPer=0.5;
        else if(ShiftAngPer<0)ShiftAngPer=0;

        //限制
        if(ShiftAng>Config.SteerMax)
            ShiftAng=Config.SteerMax;
        else if(ShiftAng<-Config.SteerMax)
            ShiftAng=-Config.SteerMax;
        

        //設定車輛輪胎轉向
        for(var i=0,len=Config.Wheel.length;i<len;i++)
        {
            if(Config.Wheel[i].Steer)
                this.Vehicle.setSteeringValue((SteerPer*Config.SteerMax*(1-ShiftAngPer) + ShiftAng*ShiftAngPer)*Math.PI/180, i);
        }

        //顯示排氣管火焰
        if(ThrottleUp==false && LastThrottleState==true)
        {
            ShowBackFireTime=ShowBackFireTimeMax*1;
        }
        LastThrottleState=ThrottleUp;

        if(ShowBackFireTime>0)
        {
            ShowBackFireTime--;
            this.BackFireGroup.visible=this.OnBackFireVisible=true;
        }
        else
        {
            this.BackFireGroup.visible=this.OnBackFireVisible=false;
        }

        //顯示排氣管氮氣火焰
        if(UseN2O)
        {
            this.BackBlueFireGroup.visible=this.OnBackBlueFireVisible=true;
        }
        else
        {
            this.BackBlueFireGroup.visible=this.OnBackBlueFireVisible=false;
        }

        //更新物件為置
		this.MeshGroup.position.copy(this.Body.position);
    	this.MeshGroup.quaternion.copy(this.Body.quaternion);

    	this.Position.x=this.MeshGroup.position.x*1;
		this.Position.y=this.MeshGroup.position.y*1;
        this.Position.z=this.MeshGroup.position.z*1;
        
        //更新位置資訊
        this.LastPosition.x+=SystemRelativePosition.x;
        this.UpdatePosition();

        //播放氮氣聲音
        if(!InGarage && MainFocusUnit==ThisCar && N2OSoundArray[0] && N2OSoundArray[1])
        {
            if(LastUseN2O!=UseN2O && UseN2O==true)
            {
                if(!N2OSoundArray[0].isPlaying)
                    N2OSoundArray[0].play();
            }

            N2OSoundArray[0].position.copy(this.MeshGroup.position);
            N2OSoundArray[1].position.copy(this.MeshGroup.position);

            if(UseN2O)
            {
                if(!N2OSoundArray[1].isPlaying)
                    N2OSoundArray[1].play();
                
                UseN2OVolume+=0.05;  if(UseN2OVolume>1)UseN2OVolume=1;
            }
            else
            {
                UseN2OVolume-=0.025;  if(UseN2OVolume<0)UseN2OVolume=0;

                if(UseN2OVolume==0 && N2OSoundArray[1].isPlaying)
                    N2OSoundArray[1].stop();
            }

            N2OSoundArray[1].setVolume(UseN2OVolume*0.1);

            LastUseN2O=UseN2O;
        }
       
        
        //更新輪胎位置
    	for (var i = 0,j=this.Vehicle.wheelInfos.length; i < j; i++) {
            this.Vehicle.updateWheelTransform(i);
            var t = this.Vehicle.wheelInfos[i].worldTransform;

            //fix worldTransform is NaN bug
            if(isNaN(t.quaternion.x) || isNaN(t.quaternion.y) || isNaN(t.quaternion.z) || isNaN(t.quaternion.w))
            {
                t.quaternion.x=0;
                t.quaternion.y=0;
                t.quaternion.z=0;
                t.quaternion.w=1;
            }

            var wheelBody = wheelBodies[i];
            wheelBody.position.copy(t.position);
            wheelBody.quaternion.copy(t.quaternion);

            this.WheelMashArray[i].position.copy(t.position);
            this.WheelMashArray[i].position.z+=WheelRadiusFix;
            this.WheelMashArray[i].quaternion.copy(t.quaternion);
        }

        //玩家車輛燒胎
        if(MainFocusUnit==ThisCar)
        {
            for (var i = 0,j=this.Vehicle.wheelInfos.length; i < j; i++)
            {
                Config.Wheel[i].LastCarTrackPosition.x += SystemRelativePosition.x;
            }

            var TyreBurnoutTimeMax=6-this.Speed.length()*3;
            if(TyreBurnoutTimeMax<1)TyreBurnoutTimeMax=1;

            TyreBurnoutTimeMax=1;
            //TyreBurnoutTimeMax=5;

            this.OnDrift=false;
            this.OnFly=true;
            WheelScream=false;
            for (var i = 0,j=this.Vehicle.wheelInfos.length; i < j; i++)
            {
                //是否打滑
                if(!this.OnDrift && 
                    Config.Wheel[i].Power && 
                    this.Vehicle.wheelInfos[i].skidInfo<1 && 
                    Math.abs(this.Speed.y)>0.05)
                this.OnDrift=true;

                //是否離地飛行
                if(this.OnFly && this.Vehicle.wheelInfos[i].raycastResult.hasHit)
                    this.OnFly=false;

                //當該輪胎接觸地面且不接觸草地
                if( Config.Wheel[i].Power && 
                    this.Vehicle.wheelInfos[i].raycastResult.hitPointWorld.z<0.1 && 
                    Math.abs(this.Vehicle.wheelInfos[i].raycastResult.hitPointWorld.y)>1.25 )
                {
                    //速度落差大於1 或踩煞車 則燒胎
                    if( (TakeBrakePer>0 && this.Speed.x<-0.05) || ((1-this.Vehicle.wheelInfos[i].skidInfo) * this.Vehicle.wheelInfos[i].UserDataSpeed > 1) )
                    {
                        WheelScream=true;
                        Config.Wheel[i].TyreBurnoutTime++;

                        if(MainFocusUnit==ThisCar)
                        if(Config.Wheel[i].TyreBurnoutTime>=TyreBurnoutTimeMax)
                        {
                            Config.Wheel[i].TyreBurnoutTime-=TyreBurnoutTimeMax;

                            //製造煙霧
                            for(var s=0;s<SmokeArray.length;s++)
                            {
                                if(!SmokeArray[s].Alive)
                                {
                                    SmokeArray[SmokeSetIndex].ReUse({
                                            Size:1,
                                            SizeAdd:0.02,
                                            AliveTime:120/2,
                                            Position:{
                                                x:this.Vehicle.wheelInfos[i].worldTransform.position.x,
                                                y:this.Vehicle.wheelInfos[i].worldTransform.position.y,
                                                z:this.Vehicle.wheelInfos[i].worldTransform.position.z
                                            },
                                            Direction:RandF(360),
                                            DirectionY:RandF(30),
                                            Speed:0.02*2,
                                            SpeedPer:1,
                                            BasicSpeedPer:0,
                                            EachSpeed:0,
                                            ColorPer:new THREE.Color(0.9,0.9,0.9)
                                        });

                                    SmokeSetIndex++;
                                    if(SmokeSetIndex>=SmokeArray.length)SmokeSetIndex=0;

                                    break;
                                }
                            }

                            //製造煞車痕
                            for(var s=0;s<CarTrackArray.length;s++)
                            {
                                if(!CarTrackArray[s].Alive)
                                {
                                    CarTrackArray[CarTrackSetIndex].ReUse({
                                            Size:0.2,
                                            Position:{
                                                x:this.Vehicle.wheelInfos[i].raycastResult.hitPointWorld.x + this.Vehicle.wheelInfos[i].raycastResult.hitNormalWorld.x*0.02,
                                                y:this.Vehicle.wheelInfos[i].raycastResult.hitPointWorld.y + this.Vehicle.wheelInfos[i].raycastResult.hitNormalWorld.y*0.02,
                                                z:this.Vehicle.wheelInfos[i].raycastResult.hitPointWorld.z + this.Vehicle.wheelInfos[i].raycastResult.hitNormalWorld.z*0.02
                                            },
                                            Position2:{
                                                x:Config.Wheel[i].LastCarTrackPosition.x,
                                                y:Config.Wheel[i].LastCarTrackPosition.y,
                                                z:Config.Wheel[i].LastCarTrackPosition.z
                                            },

                                            ColorPer:1
                                        });

                                    CarTrackSetIndex++;
                                    if(CarTrackSetIndex>=CarTrackArray.length)CarTrackSetIndex=0;

                                    break;
                                }
                            }

                            //紀錄燒胎位置
                            Config.Wheel[i].LastCarTrackPosition.x=this.Vehicle.wheelInfos[i].raycastResult.hitPointWorld.x + this.Vehicle.wheelInfos[i].raycastResult.hitNormalWorld.x*0.02;
                            Config.Wheel[i].LastCarTrackPosition.y=this.Vehicle.wheelInfos[i].raycastResult.hitPointWorld.y + this.Vehicle.wheelInfos[i].raycastResult.hitNormalWorld.y*0.02;
                            Config.Wheel[i].LastCarTrackPosition.z=this.Vehicle.wheelInfos[i].raycastResult.hitPointWorld.z + this.Vehicle.wheelInfos[i].raycastResult.hitNormalWorld.z*0.02;
                        }
                    }
                    else
                    {
                        //紀錄燒胎位置
                        Config.Wheel[i].LastCarTrackPosition.x=this.Vehicle.wheelInfos[i].raycastResult.hitPointWorld.x + this.Vehicle.wheelInfos[i].raycastResult.hitNormalWorld.x*0.02;
                        Config.Wheel[i].LastCarTrackPosition.y=this.Vehicle.wheelInfos[i].raycastResult.hitPointWorld.y + this.Vehicle.wheelInfos[i].raycastResult.hitNormalWorld.y*0.02;
                        Config.Wheel[i].LastCarTrackPosition.z=this.Vehicle.wheelInfos[i].raycastResult.hitPointWorld.z + this.Vehicle.wheelInfos[i].raycastResult.hitNormalWorld.z*0.02;

                    }
                }
            }
        }


        //草地打滑
        //if(MainFocusUnit==ThisCar)
        {
            var FrictionSlipValue=0;
            var SpeedAdd=this.SpeedLength+0.5;
            if(SpeedAdd>1)SpeedAdd=1;

            for(var i=0,len=Config.Wheel.length;i<len;i++)
            {
                //草地
                if(this.Vehicle.wheelInfos[i].raycastResult.hasHit && Math.abs(this.Vehicle.wheelInfos[i].raycastResult.hitPointWorld.y)<1.25)
                {
                    FrictionSlipValue=FrictionSlipMax*0.2*SpeedAdd;
                }
                //側滑
                else if(this.Vehicle.wheelInfos[i].raycastResult.hasHit && Math.abs(this.Speed.y)>Config.DriftLimit)
                {
                    if(Config.Wheel[i].Power)
                        FrictionSlipValue=FrictionSlipMax*1*SpeedAdd;
                    else 
                        FrictionSlipValue=FrictionSlipMax*1*Config.DriftControl*SpeedAdd;
                }
                else
                {
                    FrictionSlipValue=FrictionSlipMax*SpeedAdd;
                }

                this.Vehicle.wheelInfos[i].frictionSlip=FrictionSlipValue;
            }
        }


		Config.RunCallBack && Config.RunCallBack(ThisCar);

        //玩家按下切換視角
        KeyChangeViewType=CheckKeyBoardPress(UserKeyboardSetting.ChangeViewType);

        if(!HadKeyChangeViewType && KeyChangeViewType)
        {
            HadKeyChangeViewType=true;
            this.ViewTypeChange();
        }
        else if(HadKeyChangeViewType && !KeyChangeViewType)
        {
            HadKeyChangeViewType=false;
        }

        //更新Camera
		if(MainFocusUnit==ThisCar)
		{
            this.Camera.rotation.y=0;
            this.CameraRotateGruop.rotation.y=0;

            KeyLookBack=CheckKeyBoardPress(UserKeyboardSetting.LookBack);
            KeyLookLeft=CheckKeyBoardPress(UserKeyboardSetting.LookLeft);
            KeyLookRight=CheckKeyBoardPress(UserKeyboardSetting.LookRight);

            //是否剛取消看左看右看後
            var FirstChangeLook=false;
            if(!KeyLookBack && LastKeyLookBackState || !KeyLookLeft && LastKeyLookLeftState || !KeyLookRight && LastKeyLookRightState)
            {
                FirstChangeLook=true;
            }
            LastKeyLookBackState=KeyLookBack;
            LastKeyLookLeftState=KeyLookLeft;
            LastKeyLookRightState=KeyLookRight;

            //計算鏡頭搖晃
            if(CameraShakeDelay>0)CameraShakeDelay--;
            if(CameraShakeDelay<=0 && CameraShake>0)
            {
                CameraShake--;
                CameraShakeDelay=2;

                var Length=CameraShake*0.25; if(Length>3)Length=3;
                var Degree=RandF(360);
                var XYLength=Math.cos(Degree*Math.PI/180)*Length;
                CameraShakeTarget.z=Math.sin(Degree*Math.PI/180)*Length;
                Degree=RandF(360);
                CameraShakeTarget.x=Math.cos(Degree*Math.PI/180)*XYLength;
                CameraShakeTarget.y=Math.sin(Degree*Math.PI/180)*XYLength;
            }
            CameraShakeOffect.x=CameraShakeOffect.x*0.9+0.1*CameraShakeTarget.x;
            CameraShakeOffect.y=CameraShakeOffect.y*0.9+0.1*CameraShakeTarget.y;
            CameraShakeOffect.z=CameraShakeOffect.z*0.9+0.1*CameraShakeTarget.z;

            //遊戲結束
            if(ViewType==2 || SystemGameOver)
            {
                this.Camera.position.x=Config.CameraOptions.Ended.Position.x;
                this.Camera.position.y=Config.CameraOptions.Ended.Position.y;
                this.Camera.position.z=Config.CameraOptions.Ended.Position.z;
                this.Camera.rotation.y=90+20*Math.PI/180;
            }
            //預設視野
            else if(ViewType==0)
            {
                //看後面
                if(KeyLookBack)
                {
                    this.Camera.position.x=Config.CameraOptions.LookBack.Position.x;
                    this.Camera.position.y=Config.CameraOptions.LookBack.Position.y;
                    this.Camera.position.z=Config.CameraOptions.LookBack.Position.z;
                    
                    this.Camera.position.x+=CameraShakeOffect.x;
                    this.Camera.position.y+=CameraShakeOffect.y;
                    this.Camera.position.z+=CameraShakeOffect.z;

                    this.CameraRotateGruop.rotation.y=180*Math.PI/180;
                }
                //看右邊
                else if(KeyLookRight)
                {
                    this.Camera.position.x=Config.CameraOptions.LookRight.Position.x;
                    this.Camera.position.y=Config.CameraOptions.LookRight.Position.y;
                    this.Camera.position.z=Config.CameraOptions.LookRight.Position.z;
                    
                    this.Camera.position.x+=CameraShakeOffect.x;
                    this.Camera.position.y+=CameraShakeOffect.y;
                    this.Camera.position.z+=CameraShakeOffect.z;

                    this.CameraRotateGruop.rotation.y=-90*Math.PI/180;
                }
                //看左邊
                else if(KeyLookLeft)
                {
                    this.Camera.position.x=Config.CameraOptions.LookLeft.Position.x;
                    this.Camera.position.y=Config.CameraOptions.LookLeft.Position.y;
                    this.Camera.position.z=Config.CameraOptions.LookLeft.Position.z;
                    
                    this.Camera.position.x+=CameraShakeOffect.x;
                    this.Camera.position.y+=CameraShakeOffect.y;
                    this.Camera.position.z+=CameraShakeOffect.z;

                    this.CameraRotateGruop.rotation.y=90*Math.PI/180;
                }
                //預設視角
                else
                {
                    var SpeedLength=this.SpeedLength;
                    if(SpeedLength>1)SpeedLength=1;

                    CameraDefaultRotation=(CameraDefaultRotation*(1-Config.CameraOptions.Default.RotationEffect))+(this.MoveAngle*SpeedLength)*(Config.CameraOptions.Default.RotationEffect);

                    this.Camera.position.x=(this.Camera.position.x*Config.CameraOptions.Default.SpeedAdd.x) + (1-Config.CameraOptions.Default.SpeedAdd.x)*(Config.CameraOptions.Default.Position.x + (-this.Speed.y*Config.CameraOptions.Default.SpeedPer.x));
                    this.Camera.position.y=(this.Camera.position.y*Config.CameraOptions.Default.SpeedAdd.y) + (1-Config.CameraOptions.Default.SpeedAdd.y)*(Config.CameraOptions.Default.Position.y + (-this.Speed.z*Config.CameraOptions.Default.SpeedPer.y));
                    this.Camera.position.z=(this.Camera.position.z*Config.CameraOptions.Default.SpeedAdd.z) + (1-Config.CameraOptions.Default.SpeedAdd.z)*(Config.CameraOptions.Default.Position.z + (-this.Speed.x*Config.CameraOptions.Default.SpeedPer.z));
                    
                    this.Camera.position.x+=CameraShakeOffect.x;
                    this.Camera.position.y+=CameraShakeOffect.y;
                    this.Camera.position.z+=CameraShakeOffect.z;

                    this.CameraRotateGruop.rotation.y=CameraDefaultRotation*Math.PI/180;
                }
            }
            //車內第一人稱視野
            else if(ViewType==1)
            {
                //看後面
                if(KeyLookBack)
                {
                    this.Camera.position.x=Config.CameraOptions.LookBack.Position.x;
                    this.Camera.position.y=Config.CameraOptions.LookBack.Position.y;
                    this.Camera.position.z=Config.CameraOptions.LookBack.Position.z;

                    this.CameraRotateGruop.rotation.y=180*Math.PI/180;
                }
                //看右邊
                else if(KeyLookRight)
                {
                    this.Camera.position.x=Config.CameraOptions.FOV.Position.x;
                    this.Camera.position.y=Config.CameraOptions.FOV.Position.y;
                    this.Camera.position.z=Config.CameraOptions.FOV.Position.z;

                    this.Camera.rotation.y=-90*Math.PI/180;
                }
                //看左邊
                else if(KeyLookLeft)
                {
                    this.Camera.position.x=Config.CameraOptions.FOV.Position.x;
                    this.Camera.position.y=Config.CameraOptions.FOV.Position.y;
                    this.Camera.position.z=Config.CameraOptions.FOV.Position.z;

                    this.Camera.rotation.y=90*Math.PI/180;
                }
                //FOV
                else
                {
                    //如果剛取消看左看右看後，則直接設定攝影機位置
                    if(FirstChangeLook)
                    {
                        FOVSpeedAdd.x=0;
                        FOVSpeedAdd.y=0;
                        FOVSpeedAdd.z=0;
                    }
                    else
                    {
                        FOVSpeedAdd.x=Config.CameraOptions.FOV.SpeedAdd.x;
                        FOVSpeedAdd.y=Config.CameraOptions.FOV.SpeedAdd.y;
                        FOVSpeedAdd.z=Config.CameraOptions.FOV.SpeedAdd.z;
                    }

                    this.Camera.position.x=(this.Camera.position.x*FOVSpeedAdd.x) + (1-FOVSpeedAdd.x)*(Config.CameraOptions.FOV.Position.x + (-this.Speed.y*Config.CameraOptions.FOV.SpeedPer.x));
                    this.Camera.position.y=(this.Camera.position.y*FOVSpeedAdd.y) + (1-FOVSpeedAdd.y)*(Config.CameraOptions.FOV.Position.y + (-this.Speed.z*Config.CameraOptions.FOV.SpeedPer.y));
                    this.Camera.position.z=(this.Camera.position.z*FOVSpeedAdd.z) + (1-FOVSpeedAdd.z)*(Config.CameraOptions.FOV.Position.z + (-this.Speed.x*Config.CameraOptions.FOV.SpeedPer.z));
                    
                    this.Camera.rotation.y=0*Math.PI/180;
                }
            }
        }
    };

    //變換視角
    this.ViewTypeChange=function(){

        ViewType++;
        if(ViewType>=3)ViewType=0;

        Config.ViewTypeChangeCallBack && Config.ViewTypeChangeCallBack(ViewType,ThisCar);
    };

    //輪胎轉動變化量計算輪胎轉速
    function GetWheelSpeed(WheelInfo)
    {
        return -1*(WheelInfo.deltaRotation*180/Math.PI)/360 *(WheelInfo.radius*2*Math.PI) *60*3.6 / SystemStepPer;
    }

    //加速
    this.SpeedUp=function(){
        this.OnThrottleUp=true;
        ThrottleUp=true;
    };

    //減速
    this.SpeedDown=function(){
        this.OnThrottleUp=false;
        ThrottleUp=false;
    };

    //左轉
    this.TurnLeft=function(Per=1){

        if(Per>1)Per=1;
        if(Per<0)Per=0;

    	TargetSteerVal=Config.SteerMax*Per;
    };

    //右轉
    this.TurnRight=function(Per=1){

        if(Per>1)Per=1;
        if(Per<0)Per=0;

    	TargetSteerVal=-Config.SteerMax*Per;
    };

    //煞車
    this.TakeBrake=function(Per=1){

        if(Per>1)Per=1;
        if(Per<0)Per=0;

        this.OnTakeBrake=true;
        TakeBrakePer=Per;
    }

    //取消煞車
    this.UnTakeBrake=function(){
        
        this.OnTakeBrake=false;
        TakeBrakePer=0;
    }

    this.AiTargetLane=null;             //AI目標車道
    this.AiTargetLaneYOffset=0;         //開車習慣的車道偏移
    this.AiChangeLaneTime=0;            //切換車道延遲
    this.AiChangeLaneTimeMax=120;       //切換車道延遲最大值
    this.AiChangeLaneTimeMaxPer=1.2;    //切換車道延遲加權
    this.AiHasCrack=false;              //是否車禍
    this.AiHasCrackTime=0;              //車禍延遲
    this.AiNoMoveTime=0;                //車輛停止移動的時間
    this.AiPassPackageIndexArray=[];    //略過預警的Package物件
    this.AiTargetSpeed=Config.AiTargetSpeed;    //目標車速

    var AiTurnPerPID=new PID({          //轉向PID
        P:0.05*5/2,
        I:0,
        D:0.05*5/2
    });

    this.AiHitDelay=0;              //延遲接收預警資訊
    this.AiWillHitData={            //預警資訊
            /*Hit:false,
            FrontDistanceMin:0,
            FrontCenterHit:false,
            FrontCenterHitDistance:0,
            FrontCenterHitDistanceMax:0,
            FrontLeftHit:false,
            FrontLeftHitDistance:0,
            FrontLeftHitDistanceMax:0,
            FrontRightHit:false,
            FrontRightHitDistance:0,
            FrontRightHitDistanceMax:0,
            LeftHit:false,
            LeftHitDistance:0,
            LeftHitDistanceMax:0,
            RightHit:false,
            RightHitDistance:0,
            RightHitDistanceMax:0*/
            BrakeValue:0,
			SteerValue:0,
        };

    //接收預警資訊
    this.AiSetWillHitData=function(Data){

        //接收
        if(this.AiHitDelay<=0)
        {
            this.AiWillHitData=Data;
        }
        //延遲則不接收預警資訊
        else
        {
            this.AiWillHitData={
                /*Hit:false,
                FrontDistanceMin:0,
                FrontCenterHit:false,
                FrontCenterHitDistance:0,
                FrontCenterHitDistanceMax:0,
                FrontLeftHit:false,
                FrontLeftHitDistance:0,
                FrontLeftHitDistanceMax:0,
                FrontRightHit:false,
                FrontRightHitDistance:0,
                FrontRightHitDistanceMax:0,
                LeftHit:false,
                LeftHitDistance:0,
                LeftHitDistanceMax:0,
                RightHit:false,
                RightHitDistance:0,
                RightHitDistanceMax:0*/
                BrakeValue:0,
				SteerValue:0,
            };
        }

    };

    //AI
    this.Ai=function(){

    	if(!this.IsAi)
    		return;

        //延遲接收預警資訊
        if(this.AiHitDelay>0)
            this.AiHitDelay--;

        if(this.AiTargetLane!=null && !this.NeedReset)
        {
            //變換車道
            if(Math.abs(this.AiTargetLane.Position.y - this.Body.position.y + this.AiTargetLaneYOffset)<1)
            {
                this.AiChangeLaneTime+=1*SystemStepPer;
                if(this.AiChangeLaneTime>=this.AiChangeLaneTimeMax)
                {
                    this.AiChangeLaneTime=this.AiChangeLaneTimeMax*1;
                    this.ChangeLane();
                }
            }
        } 

        //如果時速小於20公里太久則判定重置
        if(!this.NeedReset && !this.AiHasCrack && this.Speed.length()*60*3.6<20)
        {
            this.AiNoMoveTime+=1*SystemStepPer;

            if(this.AiNoMoveTime>60*10)
            {
                this.AiHasCrack=true;
            }
        }

        //車禍了 靜置一段時間後回到重置池
        if(this.AiHasCrack && !this.NeedReset)
        {
            this.AiTargetSpeed=0;

            if(this.Speed.length()<0.1)
                this.AiHasCrackTime+=1*SystemStepPer;
            else
                this.AiHasCrackTime=0;
        }

        //轉向PID
        var TurnPIDValue = 0;
        if(this.AiTargetLane!=null)
        {
            AiTurnPerPID.SetTarget(0);
            AiTurnPerPID.AddSample((this.AiTargetLane.Position.y - this.Body.position.y + this.AiTargetLaneYOffset) * ((this.AiTargetLane.Reverse)?1:-1));
            TurnPIDValue = AiTurnPerPID.Process();
        }

        var SpeedValue=0;
        var BrakeValue=0;
        var SteerValue=0;

        //道路偏移
        //SpeedValue += Math.abs(1-TurnPIDValue);

        //速度差
        SpeedValue += ((this.AiTargetSpeed * ((!this.AiAbide)?1:1.1)) - (-this.Speed.x*60*3.6)) * 0.01;

        if(SpeedValue>0 && !this.AiHasCrack)
        {
            this.SpeedUp();
        }
        else
        {
            this.SpeedDown();
        }

        //碰撞預警煞車
        BrakeValue+=this.AiWillHitData.BrakeValue;

        if(BrakeValue>0 || this.AiHasCrack)
        {
            this.TakeBrake((this.AiHasCrack)?Config.BrakeForce:BrakeValue);
        }
        else
        {
            this.UnTakeBrake();
        }


        //道路偏移
        SteerValue += TurnPIDValue;

        //碰撞預警轉向
        SteerValue+=this.AiWillHitData.SteerValue;

        if(SteerValue<0)
        {
            this.TurnLeft(-SteerValue);
        }
        else
        {
            this.TurnRight(SteerValue);
        }
    };

    this.Body.addEventListener("collide",function(e){

        var relativeVelocity=e.contact.getImpactVelocityAlongNormal();

        //鏡頭搖晃        
        if(MainFocusUnit==ThisCar)
        {
            //找出最小質量
            var MassMin=Math.min(e.contact.bi.mass,e.contact.bj.mass);
            
            //如果是撞擊不可動體則使用自己的質量
            if(MassMin==0)
            {
                if(e.contact.bi==ThisCar.Body)
                    MassMin=ThisCar.Body.mass;
                else 
                    MassMin=ThisCar.Body.mass;
            }
            ThisCar.MakeCameraShake(Math.floor(Math.abs(relativeVelocity)*MassMin*0.0005));
        }

        

    });
}

//煞車痕
function CarTrack(iConfig)
{
    var Config={
        AliveTime:120,
        Size:0.3,       //寬度
        Position:new THREE.Vector3(0,0,-9999999),
        Position2:new THREE.Vector3(0,0,-9999999),
        ColorPer:1,    //顏色深度
        Texture:null
    };

    var Config=$.extend(Config,iConfig);

    var ThisCarTrack=this;
    this.Alive=false;
    var AliveTime=0;
    var AliveTimeMax=0;
    var Size=0;
    var Opacity=1;
    var ColorPer=1;

    var RotateGroup=new THREE.Group();
    this.MeshGroup=new THREE.Group();

    var Geometry=new THREE.PlaneBufferGeometry(1,1,1,1);  //長1寬1
    Geometry.translate(0.5,0,0);
    var Material=new THREE.MeshLambertMaterial({color:0x333333});
    var Mash=new THREE.Mesh(Geometry,Material);
    //var LWalldMash.receiveShadow=true;  //接收陰影
    RotateGroup.add(Mash);
    this.MeshGroup.add(RotateGroup);
    this.MeshGroup.visible=false;

    Scene.add(this.MeshGroup);

    this.ReUse=function(iConfig){

        Config=$.extend(Config,iConfig);

        this.Alive=true;
        AliveTime=0;
        AliveTimeMax=Config.AliveTime;
        Size=Config.Size;
        Opacity=1;
        ColorPer=Config.ColorPer;

        this.MeshGroup.visible=true;
        this.MeshGroup.position.set(Config.Position.x,Config.Position.y,Config.Position.z);

        var Distance=Distance3D(Config.Position,Config.Position2);

        Mash.scale.y=Size;
        Mash.scale.x=Distance;

        var Ang=Angle3(
            Config.Position.x+1,Config.Position.y,
            Config.Position.x,Config.Position.y,
            Config.Position2.x,Config.Position2.y
        );

        RotateGroup.rotation.z=Ang*Math.PI/180 * ((Config.Position.y>Config.Position2.y)?-1:1);
    };

    this.Dead=function(){
        this.Alive=false;
        this.MeshGroup.visible=false;
    };

    this.Run=function(){

        if(!this.Alive)
            return;

        AliveTime++;
        if(AliveTime>AliveTimeMax)
        {
            this.Dead();
        }

        if(this.MeshGroup.position.x>SystemGameSize || this.MeshGroup.position.x<-SystemGameSize)
        {
            this.Dead();
        }

    };
}