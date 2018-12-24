function TruckContainer(iConfig)
{
    var MassOffset=new THREE.Vector3(0,0,1);
    var Config={
        Scene:Scene,
        World:world,
        CanReset:true,
        Mass:30000,
        EngineForce:18000*2,
        BrakeForce:/*150*/200*2,			//煞車速度
        WheelOptions:{
            radius: 0.55 ,
            directionLocal: new CANNON.Vec3(0, 0, -1),
            suspensionStiffness: 30,
            //suspensionRestLength: 0.5,
            suspensionRestLength: 0.0,
            frictionSlip: 3*0.9*0.7*0.7*2/**1.5*/,
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
                Position:new THREE.Vector3(3.2,-2.495/2+0.1,-1.3+0.8),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:false,
                Steer:true,
                Position:new THREE.Vector3(3.2,2.495/2-0.1,-1.3+0.8),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(4.5,-2.495/2+0.1,-1.3+0.8),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:true,
                Steer:false,
                Position:new THREE.Vector3(4.5,2.495/2-0.1,-1.3+0.8),
                suspensionRestLength:0.4,
                maxSuspensionTravel:0.4,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            }
        ],
        CameraOptions:{
            Default:{
                Position:new THREE.Vector3(0,4,13),
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
        },
        Ready2ResetCallBack:Ready2ResetCallBack,
        ResetCallBack:ResetCallBack,
        OnRunCallBack:OnRunCallBack,
        RunCallBack:RunCallBack
    };

    Config=$.extend(Config,iConfig);

    for(var i=0;i<Config.Wheel.length;i++)
    {
        Config.Wheel[i].Position.x+=MassOffset.x;
        Config.Wheel[i].Position.y+=MassOffset.y;
        Config.Wheel[i].Position.z+=MassOffset.z;
    }

    //繼承Car
    this.prototype=Object.create(Package.prototype);
    Package.call(this,Config);

    var ThisContainer=this;
    this.Truck=null;            //連結的卡車
    this.BodySize=new CANNON.Vec3(12.2+2,2.5,10);

    //L1貨櫃
    var CarModelL1Group=new THREE.Group();
    var CarModelL2Group=new THREE.Group();
    var geometry = new THREE.BoxBufferGeometry(12.2,2.43,2.9);
	var material = new THREE.MeshLambertMaterial( {color: 0xDDDDDD} );
    var ContainerL1BodyCube = new THREE.Mesh( geometry, material );
    ContainerL1BodyCube.position.z=2.9/2;
    CarModelL1Group.add(ContainerL1BodyCube);

    //L2貨櫃
    var CarModelL2Group=new THREE.Group();
    var geometry = new THREE.BoxBufferGeometry(12.2,2.43,2.9);
	var material = new THREE.MeshLambertMaterial( {color: 0xDDDDDD} );
    var ContainerL2BodyCube = new THREE.Mesh( geometry, material );
    ContainerL2BodyCube.position.z=2.9/2;
    CarModelL2Group.add(ContainerL2BodyCube);

    //尾端燈號箱
    var geometry = new THREE.BoxBufferGeometry(0.3,2.43,0.75);
	var material = new THREE.MeshLambertMaterial( {color: 0x333333} );
    var LightBox = new THREE.Mesh( geometry, material );
    LightBox.position.set(6.1-0.3/2,0,-0.75/2);
    CarModelL1Group.add(LightBox);

    this.LOD.addLevel(CarModelL1Group,0);
    this.LOD.addLevel(CarModelL2Group,300);

    this.LOD.position.set(MassOffset.x,MassOffset.y,MassOffset.z);

    this.Body.addShape(new CANNON.Box(new CANNON.Vec3(12.2/2,2.43/2,2.9/2)),new CANNON.Vec3(0+MassOffset.x,0+MassOffset.y,2.9/2+MassOffset.z));
    this.Body.addShape(new CANNON.Box(new CANNON.Vec3(0.3/2,2.43/2,0.75/2)),new CANNON.Vec3(6.1-0.3/2+MassOffset.x,0+MassOffset.y,-0.75/2+MassOffset.z));
    

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
    BRLight.position.set(6.105+MassOffset.x,0.9+MassOffset.y,-0.325+MassOffset.z);
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
    BLLight.position.set(6.105+MassOffset.x,-0.9+MassOffset.y,-0.325+MassOffset.z);
    BLLight.scale.set(3,3,3);
    this.MeshGroup.add(BLLight);


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
    BRSignalLight.position.set(6.105+MassOffset.x,1.1+MassOffset.y,-0.325+MassOffset.z);
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
    BLSignalLight.position.set(6.105+MassOffset.x,-1.1+MassOffset.y,-0.325+MassOffset.z);
    BLSignalLight.scale.set(3,3,3);
    BLSignalLight.visible=false;
    this.MeshGroup.add(BLSignalLight);


    //移除Body
    Config.World.removeBody(this.Body);

    //重建車輛
    // Create the vehicle
    this.Vehicle=new CANNON.RaycastVehicle({
        chassisBody: this.Body
    });
    this.Vehicle.addToWorld(Config.World);

    var ThisVehicle=this.Vehicle;
    

    //建構車輪----------
    var WheelMashArray=[];          //Wheel Mesh Array
    var wheelBodies = [];           //CANNON Wheel Array

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
        WheelMash.castShadow=true;
        WheelMash.receiveShadow=true;
        
        WheelLOD.addLevel(WheelMash,0);
        
        Geometry=new THREE.CylinderBufferGeometry(Wheel.radius,Wheel.radius,Wheel.radius / 2,5);
        Material=new THREE.MeshLambertMaterial({color:0x333333});
        var WheelMash=new THREE.Mesh(Geometry,Material);
        WheelLOD.addLevel(WheelMash,100);
        
        Geometry=new THREE.CylinderBufferGeometry(Wheel.radius,Wheel.radius,Wheel.radius / 2,3);
        Material=new THREE.MeshLambertMaterial({color:0x333333});
        var WheelMash=new THREE.Mesh(Geometry,Material);
        WheelLOD.addLevel(WheelMash,150);
        
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

    function Ready2ResetCallBack(ThisContainer)
    {
        if(WheelMashArray)
            for(var i=0,j=WheelMashArray.length;i<j;i++)
            {
                WheelMashArray[i].visible=false;
            }

        if(ThisContainer.Truck!=null)
        {
            //斷開貨櫃
            ThisContainer.Truck.SetConstraint(false);
            if(!ThisContainer.Truck.NeedReset)
                ThisContainer.Truck.Ready2Reset();
        }
    }

    function OnRunCallBack(ThisContainer)
    {
        //ThisContainer.Body.position.x+=SystemRelativePosition.x;
    }

    var CarColor=[
        new THREE.Color(0xc60101),  //紅
        new THREE.Color(0x22cc00),  //綠
        new THREE.Color(0x001a84),  //藍
        new THREE.Color(0x353535),  //黑
        //new THREE.Color(0x191919),  //黑
        //new THREE.Color(0x303030),  //黑
        new THREE.Color(0xf7d600),  //黃
    ];
    function ResetCallBack(ThisContainer)
    {
        var NewColor=CarColor[Math.floor(Math.random()*CarColor.length)];
        ContainerL1BodyCube.material.color=NewColor; 
        ContainerL2BodyCube.material.color=NewColor; 

        if(WheelMashArray)
            for(var i=0,j=WheelMashArray.length;i<j;i++)
            {
                WheelMashArray[i].visible=true;
            }
    }

    function RunCallBack(ThisContainer)
    {
        for (var i = 0,j=ThisVehicle.wheelInfos.length; i < j; i++) {
            ThisVehicle.updateWheelTransform(i);
            var t = ThisVehicle.wheelInfos[i].worldTransform;
            var wheelBody = wheelBodies[i];
            wheelBody.position.copy(t.position);
            wheelBody.quaternion.copy(t.quaternion);

            WheelMashArray[i].position.copy(t.position);
            WheelMashArray[i].quaternion.copy(t.quaternion);

            //this.Vehicle.wheelInfos[i].UserDataSpeed=GetWheelSpeed(this.Vehicle.wheelInfos[i]);

            //console.log(this.Vehicle.wheelInfos[i].UserDataSpeed);
        }

        //console.log(WheelMashArray[0].position);

        /*for(var i=0,j=WheelMashArray.length;i<j;i++)
        {
            WheelMashArray[i].update(MainCamera);
        }*/
        
    }

    this.TakeBreak=function()
    {
        BRLight.scale.set(5,5,5);
        BLLight.scale.set(5,5,5);
    }

    this.UnTakeBreak=function()
    {
        BRLight.scale.set(2,2,2);
        BLLight.scale.set(2,2,2);
    }

    this.LSignalLightVisible=function(Visible){
        BLSignalLight.visible=Visible;
    };
    this.RSignalLightVisible=function(Visible){
        BRSignalLight.visible=Visible;
    };


    this.Body.addEventListener("collide",function(e){

        /*for(var i=0;i<SparkArray.length;i++)
        {
            if(!SparkArray[i].Alive)
            {
                SparkArray[i].ReUse({
                    AliveTime:10+Rand(20),
                    Position:new THREE.Vector3(
                        e.contact.bj.position.x + e.contact.rj.x,
                        e.contact.bj.position.y + e.contact.rj.y,
                        e.contact.bj.position.z + e.contact.rj.z
                    ),
                    MoveVector:new THREE.Vector3(
                        NowSpeed.x*1.2,
                        NowSpeed.y*1.2,
                        NowSpeed.z*1.2
                    )
                });

                SparkSetIndex++;
                if(SparkSetIndex>=SparkArray.length)SparkSetIndex=0;

                break;
            }
        }*/

        /*if(!ThisTrailerTruck.AiHasCrack)
        {
            //相對速度
            var relativeVelocity=e.contact.getImpactVelocityAlongNormal();
            var TheyMass=0;

            if(Math.abs(relativeVelocity)>10)
            {
                ThisTrailerTruck.AiHasCrack=true;
                ThisTrailerTruck.AiHasCrackTime=0;

                //斷開貨櫃
                //ThisTrailerTruck.ContainerConstraint.disable();
            }
                

            //console.log(relativeVelocity);
        }*/
    });
    
}