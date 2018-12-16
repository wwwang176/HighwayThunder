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
            suspensionStiffness: 30/4*2,
            //suspensionRestLength: 0.5,
            suspensionRestLength: 0.0,
            frictionSlip: 3*0.9*0.7*0.7/**1.5*/,
            dampingRelaxation: 2.3/3,
            dampingCompression: 4.4/3,
            maxSuspensionForce: 100000,
            rollInfluence:  /*0.01*/0.375,
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
        AngularDamping:0.5,
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
                Position:new THREE.Vector3(0,0.8,-1),
                SpeedAdd:0,
                SpeedPer:0
            },
            Ended:{
                Position:new THREE.Vector3(1.25,0.5,-4.5),
                SpeedAdd:0,
                SpeedPer:0
            },
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
    this.UserOnReset=false;         //玩家要求重置中
    this.UserOnResetTime=0;         //玩家要求重置延遲

    this.Speed=new CANNON.Vec3();   //車輛速度

    var NowGear=0;                  //目前檔位
    this.BestGearPer=0;             //最佳升檔轉速百分比
    this.BestPervGearPer=0;         //最佳降檔轉速百分比
    var NowEngineSpeedPer=0;		//目前引擎轉速百分比
    var NowClutchPer=0;             //目前離合器百分比
    var EngineOverRunningDelayTime=0;   //引擎超轉時油門延遲

    var ThrottleUp=false;           //是否踩油門
    var TakeBrakePer=0;             //煞車量

    var TargetSteerVal=0;           //目標輪胎轉向
    var NowSteerVal=0;              //目前輪胎轉向

    this.Index=AllCar.length;       //編號
    this.ResetCount=0;              //重製次數

    var AutoGearDelayTime=0;
    var AutoGearDelayTimeMax=60;	//自動換檔延遲時間
    var KeyNextGear=false;          //玩家按下進檔
    var KeyPervGear=false;          //玩家按下退檔
    var ViewType=0;                 //視角
    var KeyChangeViewType=false;    //玩家按下更換視角

    var WheelSpeedMin=0;            //動力輪胎最低速度
    var WheelSpeedMax=0;            //動力輪胎最高速度

    this.NowO2N2=Config.O2N2Max;    //目前氮氣量
    this.O2N2Max=Config.O2N2Max;    //氮氣最高量

    var WheelMashArray=[];          //輪胎物件(three.js)
    var wheelBodies = [];           //輪胎物件(cannon.js)
    this.OnDrift=false;             //是否甩尾中
    this.OnFly=false;               //是否飛行中

    this.MeshGroup=new THREE.Group();
    Config.Scene.add(this.MeshGroup);

    this.LOD=new THREE.LOD();
    this.MeshGroup.add(this.LOD);

    this.Camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.5,500);
    this.Camera.up=new THREE.Vector3(0,0,1);
    this.Camera.position.set(0,2,6);
    //this.Camera.position.set(0,3,-530);

    this.CameraGroup=new THREE.Group();
    this.CameraGroup.rotation.x=90*Math.PI/180;
    this.CameraGroup.rotation.y=90*Math.PI/180;
    this.CameraGroup.rotation.z=0*Math.PI/180;
    this.CameraGroup.add(this.Camera);
    this.MeshGroup.add(this.CameraGroup);
    
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

        var cylinderShape = new CANNON.Cylinder(Wheel.radius, Wheel.radius, Wheel.radius / 2, 10);

        var WheelBody = new CANNON.Body({ mass: 5,materal:wheelMaterial });
        var q = new CANNON.Quaternion();

        WheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
        wheelBodies.push(WheelBody);

        var WheelLOD=new THREE.LOD();

        Geometry=new THREE.CylinderBufferGeometry(Wheel.radius,Wheel.radius,Wheel.radius / 2,10);
        Material=new THREE.MeshLambertMaterial({color:0x333333});
        var WheelMash=new THREE.Mesh(Geometry,Material);
        WheelLOD.addLevel(WheelMash,0);
        
        Geometry=new THREE.CylinderBufferGeometry(Wheel.radius,Wheel.radius,Wheel.radius / 2,5);
        Material=new THREE.MeshLambertMaterial({color:0x333333});
        var WheelMashL1=new THREE.Mesh(Geometry,Material);
        WheelLOD.addLevel(WheelMashL1,100);
        
        Geometry=new THREE.CylinderBufferGeometry(Wheel.radius,Wheel.radius,Wheel.radius / 2,3);
        Material=new THREE.MeshLambertMaterial({color:0x333333});
        var WheelMashL2=new THREE.Mesh(Geometry,Material);
        WheelLOD.addLevel(WheelMashL2,150);

        WheelLOD.addLevel(new THREE.Object3D(),300);

        WheelLOD.quaternion.copy(WheelBody.quaternion);
        WheelLOD.position.copy(WheelBody.position);

        WheelMashArray.push(WheelLOD);
        Config.Scene.add(WheelLOD);
    }

    //更新LOD
    this.LODUpdate=function(Camera){

        //車體LOD
        this.LOD.update(Camera);

        //輪胎LOD
        for(var i=0,j=WheelMashArray.length;i<j;i++)
        {
            WheelMashArray[i].update(Camera);
        }
    };

    //取得目前檔位
    this.GetNowGear=function(){ return NowGear; };

    //更新檔位
    this.ChangeGear=function(){

        for (var i = 0,j=this.Vehicle.wheelInfos.length; i < j; i++) {
            this.Vehicle.wheelInfos[i].customSlidingRotationalSpeed= -(Config.Gear[NowGear].TargetSpeed/2.1384);
        }

        this.BestGearPer=1-(Config.Gear[NowGear].TorquePer*0.85);
        this.BestPervGearPer=0;

        if(NowGear-1>=1)
            this.BestPervGearPer=1-(Config.Gear[NowGear-1].TorquePer);

        this.MathGearDashArray();
    };

    //進一檔
    this.NextGear=function(){

    	if(NowGear+1<Config.Gear.length)
    	{
    		NowGear++;
    		this.ChangeGear();
    	}
    };

    //退一檔
    this.PervGear=function(){

    	if(NowGear>0)
    	{
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
			for(var i=0,j=WheelMashArray.length;i<j;i++)
                WheelMashArray[i].visible=true;
            
        this.Body.wakeUp();
		this.Body.collisionResponse=true;
    };

    //隱藏物件
    this.Hide=function(){
        
        this.MeshGroup.visible=false;
        for(var i=0,j=WheelMashArray.length;i<j;i++)
            WheelMashArray[i].visible=false;
        
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
				this.Body.velocity.x=-this.AiTargetSpeed*30/60/3.6;
				this.Body.velocity.y=0;
				this.Body.velocity.z=0;

				//console.log('put front')
			}

			//速度大於車道速度，放後面
			else if(!TargetLane.Reverse && SystemRelativePosition.x - TargetLane.TargetSpeed/60/3.6<0)
			{
				this.Body.position.set(SystemGameSize,TargetLane.Position.y+(RandF(0.5)-0.25),1+Config.AiResetZOffset);
				this.Body.quaternion.set(0,0,0,1);
				this.Body.velocity.x=-this.AiTargetSpeed*30/60/3.6;
				this.Body.velocity.y=0;
				this.Body.velocity.z=0;

				//console.log('put back')
			}
			//
			else if(TargetLane.Reverse && SystemRelativePosition.x + TargetLane.TargetSpeed/60/3.6>0)
			{
				this.Body.position.set(-SystemGameSize,TargetLane.Position.y+(RandF(0.5)-0.25),1+Config.AiResetZOffset);
				//this.Body.quaternion.set(0,0,0,1);
				this.Body.velocity.x=this.AiTargetSpeed*30/60/3.6;
				this.Body.velocity.y=0;
				this.Body.velocity.z=0;
				this.Body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),Math.PI);

				//console.log('put back')
			}
			else if(TargetLane.Reverse && SystemRelativePosition.x + TargetLane.TargetSpeed/60/3.6<0)
			{
				this.Body.position.set(SystemGameSize,TargetLane.Position.y+(RandF(0.5)-0.25),1+Config.AiResetZOffset);
				//this.Body.quaternion.set(0,0,0,1);
				this.Body.velocity.x=this.AiTargetSpeed*30/60/3.6;
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

    //取得目前引擎轉速百分比
    this.GetEngineSpeedPer=function(){
        return NowEngineSpeedPer;
    };

    //計算引擎轉速
    this.UpdateEngineSpeedPer=function(){

        NowClutchPer=0;

        //輪胎轉速換算
        var Ratio = (WheelSpeedMax)*((Config.Gear[NowGear].Reverse)?-1:1) / (Config.Gear[NowGear].TargetSpeed);

        //引擎轉速加權
        NowEngineSpeedPer=NowEngineSpeedPer*(NowClutchPer) +Ratio*(1-NowClutchPer);

        if(NowEngineSpeedPer>1)NowEngineSpeedPer=1;
        else if(NowEngineSpeedPer<0)NowEngineSpeedPer=0;

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

    	if(this.NeedReset)
    		return ;

        //取得速度
    	this.Speed=this.Body.pointToLocalFrame(new CANNON.Vec3(
                                                this.Body.position.x+ this.Body.velocity.x/30,
                                                this.Body.position.y+ this.Body.velocity.y/30,
                                                this.Body.position.z+ this.Body.velocity.z/30
                                            ),new CANNON.Vec3(0,0,0));
        

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
        var UseN2O=false;
        if(!Config.Stay && !this.IsAi && !SystemGameOver)
            UseN2O=CheckKeyBoardPress(UserKeyboardSetting.N2O);

        //消耗氮氣
        if(UseN2O)
        {
            this.NowO2N2-=1*SystemStepPer;
            if(this.NowO2N2<0)
            {
                this.NowO2N2=0;
                UseN2O=false;
            }
        }
        //依據車輛速度補充氮氣
        else
        {
            this.NowO2N2+=(this.Speed.x*this.Speed.x)*0.1;

            if(this.NowO2N2>this.O2N2Max)
                this.NowO2N2=this.O2N2Max;
        }


        //手排
    	if(!Config.Stay && !this.IsAi && !Config.AutoGear && !SystemGameOver)
    	{
            //進檔
            if(!KeyNextGear && CheckKeyBoardPress(UserKeyboardSetting.NextGear))
            {
                KeyNextGear=true;
                this.NextGear();
                this.UpdateEngineSpeedPer();
            }
            else if(KeyNextGear && !CheckKeyBoardPress(UserKeyboardSetting.NextGear))
            {
                KeyNextGear=false;
            }

            //退檔
            if(!KeyPervGear && CheckKeyBoardPress(UserKeyboardSetting.PervGear))
            {
                KeyPervGear=true;
                this.PervGear();
                this.UpdateEngineSpeedPer();
            }
            else if(KeyPervGear && !CheckKeyBoardPress(UserKeyboardSetting.PervGear))
            {
                KeyPervGear=false;
            }
    	}
    	//自排
	    else
	    {
            //如果引擎高轉速則準備進檔
            if(NowEngineSpeedPer>this.BestGearPer)
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
            //如果引擎低轉速則準備降檔
            else if(NowGear-1>=1 && -this.Speed.x*60*3.6<Config.Gear[NowGear-1].TargetSpeed*0.8)
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
            else
            {
                AutoGearDelayTime--;

                if(AutoGearDelayTime<0)
                    AutoGearDelayTime=0;
            }
        }
        
        //玩家要求重置
        if(!Config.Stay && !SystemGameOver)
        {
            if(!this.IsAi && !this.UserOnReset && CheckKeyBoardPress(UserKeyboardSetting.Reset))
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
		if(!this.IsAi && !SystemGameOver)
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
        if(!Config.Stay)
        {
            //引擎超轉延遲
            if(EngineOverRunningDelayTime>0)
                EngineOverRunningDelayTime--;
            
            //超轉
            if(WheelSpeedMax*((Config.Gear[NowGear].Reverse)?-1:1)/Config.Gear[NowGear].TargetSpeed>1)
            {
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
        if(!Config.Stay && !this.IsAi && !SystemGameOver)
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
        else if(Config.Stay)
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
        if(!Config.Stay && !this.IsAi && !SystemGameOver)
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
        if(!Config.Stay && !this.IsAi)
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
        var ShiftAng=Angle3(this.Speed.x,0,0,0,this.Speed.x,this.Speed.y) * ((this.Speed.y<0)?1:-1);
        var ShiftAngPer=this.Speed.length();

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

        //更新物件為置
		this.MeshGroup.position.copy(this.Body.position);
    	this.MeshGroup.quaternion.copy(this.Body.quaternion);

    	this.Position.x=this.MeshGroup.position.x*1;
		this.Position.y=this.MeshGroup.position.y*1;
		this.Position.z=this.MeshGroup.position.z*1;

        //更新位置資訊
        this.LastPosition.x+=SystemRelativePosition.x;
        this.UpdatePosition();

        
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

            WheelMashArray[i].position.copy(t.position);
            WheelMashArray[i].quaternion.copy(t.quaternion);
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
            for (var i = 0,j=this.Vehicle.wheelInfos.length; i < j; i++)
            {
                //是否打滑
                if(!this.OnDrift && 
                    Config.Wheel[i].Power && 
                    this.Vehicle.wheelInfos[i].skidInfo<1 && 
                    Math.abs(this.Speed.y)>0.125)
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
                        Config.Wheel[i].TyreBurnoutTime++;

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
            for(var i=0,len=Config.Wheel.length;i<len;i++)
            {
                if(this.Vehicle.wheelInfos[i].raycastResult.hasHit && Math.abs(this.Vehicle.wheelInfos[i].raycastResult.hitPointWorld.y)<1.25)
                {
                    this.Vehicle.wheelInfos[i].frictionSlip=0.2;
                }
                else
                {
                    this.Vehicle.wheelInfos[i].frictionSlip=3*0.9*0.7*0.7;
                }
            }
        }
        

		Config.RunCallBack && Config.RunCallBack(ThisCar);

        //玩家按下切換視角
        if(!KeyChangeViewType && CheckKeyBoardPress(UserKeyboardSetting.ChangeViewType))
        {
            KeyChangeViewType=true;
            this.ViewTypeChange();
        }
        else if(KeyChangeViewType && !CheckKeyBoardPress(UserKeyboardSetting.ChangeViewType))
        {
            KeyChangeViewType=false;
        }

        //更新Camera
		//if(MainFocusUnit==ThisCar)
		{
            //遊戲結束
            if(ViewType==2 || SystemGameOver)
            {
                this.Camera.position.x=Config.CameraOptions.Ended.Position.x;
                this.Camera.position.y=Config.CameraOptions.Ended.Position.y;
                this.Camera.position.z=Config.CameraOptions.Ended.Position.z;
                this.Camera.rotation.y=90+20*Math.PI/180;

                this.CameraGroup.position.x=0;
                this.CameraGroup.position.y=0;
                this.CameraGroup.position.z=0;
            }
            //預設視野
            else if(ViewType==0)
            {
                //看後面
                if(CheckKeyBoardPress(UserKeyboardSetting.LookBack))
                {
                    this.Camera.position.x=Config.CameraOptions.LookBack.Position.x;
                    this.Camera.position.y=Config.CameraOptions.LookBack.Position.y;
                    this.Camera.position.z=Config.CameraOptions.LookBack.Position.z;
                    this.Camera.rotation.y=180*Math.PI/180;

                    this.CameraGroup.position.x=0;
                    this.CameraGroup.position.y=0;
                    this.CameraGroup.position.z=0;
                }
                //看右邊
                else if(CheckKeyBoardPress(UserKeyboardSetting.LookRight))
                {
                    this.Camera.position.x=Config.CameraOptions.LookRight.Position.x;
                    this.Camera.position.y=Config.CameraOptions.LookRight.Position.y;
                    this.Camera.position.z=Config.CameraOptions.LookRight.Position.z;
                    this.Camera.rotation.y=-90*Math.PI/180;

                    this.CameraGroup.position.x=0;
                    this.CameraGroup.position.y=0;
                    this.CameraGroup.position.z=0;
                }
                //看左邊
                else if(CheckKeyBoardPress(UserKeyboardSetting.LookLeft))
                {
                    this.Camera.position.x=Config.CameraOptions.LookLeft.Position.x;
                    this.Camera.position.y=Config.CameraOptions.LookLeft.Position.y;
                    this.Camera.position.z=Config.CameraOptions.LookLeft.Position.z;
                    this.Camera.rotation.y=90*Math.PI/180;

                    this.CameraGroup.position.x=0;
                    this.CameraGroup.position.y=0;
                    this.CameraGroup.position.z=0;
                }
                //預設視角
                else
                {
                    this.Camera.position.x=Config.CameraOptions.Default.Position.x;
                    this.Camera.position.y=Config.CameraOptions.Default.Position.y;
                    this.Camera.position.z=Config.CameraOptions.Default.Position.z;
                    
                    this.Camera.rotation.y=0;

                    this.CameraGroup.position.x=(this.CameraGroup.position.x*Config.CameraOptions.Default.SpeedPer) + (-this.Speed.x*Config.CameraOptions.Default.SpeedAdd*(1-Config.CameraOptions.Default.SpeedPer));
                    this.CameraGroup.position.y=(this.CameraGroup.position.y*Config.CameraOptions.Default.SpeedPer) + (-this.Speed.y*Config.CameraOptions.Default.SpeedAdd*(1-Config.CameraOptions.Default.SpeedPer));
                    this.CameraGroup.position.z=(this.CameraGroup.position.z*Config.CameraOptions.Default.SpeedPer) + (-this.Speed.z*Config.CameraOptions.Default.SpeedAdd*(1-Config.CameraOptions.Default.SpeedPer));
                }
            }
            //車內第一人稱視野
            else if(ViewType==1)
            {
                //看後面
                if(CheckKeyBoardPress(UserKeyboardSetting.LookBack))
                {
                    this.Camera.position.x=Config.CameraOptions.LookBack.Position.x;
                    this.Camera.position.y=Config.CameraOptions.LookBack.Position.y;
                    this.Camera.position.z=Config.CameraOptions.LookBack.Position.z;
                    this.Camera.rotation.y=180*Math.PI/180;

                    this.CameraGroup.position.x=0;
                    this.CameraGroup.position.y=0;
                    this.CameraGroup.position.z=0;
                }
                //看右邊
                else if(CheckKeyBoardPress(UserKeyboardSetting.LookRight))
                {
                    this.Camera.position.x=Config.CameraOptions.FOV.Position.x;
                    this.Camera.position.y=Config.CameraOptions.FOV.Position.y;
                    this.Camera.position.z=Config.CameraOptions.FOV.Position.z;
                    this.Camera.rotation.y=-90*Math.PI/180;

                    this.CameraGroup.position.x=0;
                    this.CameraGroup.position.y=0;
                    this.CameraGroup.position.z=0;
                }
                //看左邊
                else if(CheckKeyBoardPress(UserKeyboardSetting.LookLeft))
                {
                    this.Camera.position.x=Config.CameraOptions.FOV.Position.x;
                    this.Camera.position.y=Config.CameraOptions.FOV.Position.y;
                    this.Camera.position.z=Config.CameraOptions.FOV.Position.z;
                    this.Camera.rotation.y=90*Math.PI/180;

                    this.CameraGroup.position.x=0;
                    this.CameraGroup.position.y=0;
                    this.CameraGroup.position.z=0;
                }
                //FOV
                else
                {
                    this.Camera.position.x=Config.CameraOptions.FOV.Position.x;
                    this.Camera.position.y=Config.CameraOptions.FOV.Position.y;
                    this.Camera.position.z=Config.CameraOptions.FOV.Position.z;
                    this.Camera.rotation.y=0;

                    this.CameraGroup.position.x=0;
                    this.CameraGroup.position.y=0;
                    this.CameraGroup.position.z=0;
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
        ThrottleUp=true;
    };

    //減速
    this.SpeedDown=function(){
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

        TakeBrakePer=Per;
    }

    //取消煞車
    this.UnTakeBrake=function(){
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

        if(SpeedValue>0)
        {
            this.SpeedUp();
        }
        else
        {
            this.SpeedDown();
        }

        //碰撞預警煞車
        BrakeValue+=this.AiWillHitData.BrakeValue;

        //Crack
        BrakeValue += (this.AiHasCrack)?99999999:0;

        if(BrakeValue>0)
        {
            this.TakeBrake(BrakeValue);
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