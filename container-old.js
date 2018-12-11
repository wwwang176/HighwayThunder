function TruckContainer(iConfig)
{
    var Config={
        CanReset:true,
        InitSpeed:0,
        Position:new THREE.Vector3(5.5,0,5),
        LinearDamping:0.01,
        AngularDamping:0.5,
        WheelOptions:{
            radius: 0.55 ,
            directionLocal: new CANNON.Vec3(0, 0, -1),
            suspensionStiffness: 30/4,
            //suspensionRestLength: 0.5,
            suspensionRestLength: 0.0,
            frictionSlip: 3*0.9*0.7*0.7/**1.5*/,
            dampingRelaxation: 2.3/3*0.8,
            dampingCompression: 4.4/3*0.8,
            maxSuspensionForce: 100000,
            rollInfluence:  /*0.01*/0.25*1.5,
            axleLocal: new CANNON.Vec3(0, 1, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(0,0,0),
            maxSuspensionTravel: 0.0,
            customSlidingRotationalSpeed: -(60/2.1384),  //輪胎沒阻力的時候最高轉速
            useCustomSlidingRotationalSpeed: true
        },
        Wheel:[
            /*{
                Power:false,
                Steer:false,
                Position:new THREE.Vector3(3.4,-2.495/2+0.1,-1.3+0.8),
                suspensionRestLength:0.3,
                maxSuspensionTravel:0.3,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:false,
                Steer:false,
                Position:new THREE.Vector3(3.4,2.495/2-0.1,-1.3+0.8),
                suspensionRestLength:0.3,
                maxSuspensionTravel:0.3,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:false,
                Steer:false,
                Position:new THREE.Vector3(4.7,-2.495/2+0.1,-1.3+0.8),
                suspensionRestLength:0.3,
                maxSuspensionTravel:0.3,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            },
            {
                Power:false,
                Steer:false,
                Position:new THREE.Vector3(4.7,2.495/2-0.1,-1.3+0.8),
                suspensionRestLength:0.3,
                maxSuspensionTravel:0.3,
                TyreBurnoutTime:0,
                LastCarTrackPosition:new THREE.Vector3()
            }*/
        ]
    };

    Config=$.extend(Config,iConfig);

    this.NeedReset=Config.CanReset;
    this.AiHasCrack=false;
    this.AiHasCrackTime=0;
    this.AiNoMoveTime=0;
    this.PassCollideRaycaster=true;
    this.BodySize=new THREE.Vector3(12.2,2.43,10);
    var WheelMashArray=[];          //Wheel Mesh Array
    var wheelBodies = [];           //CANNON Wheel Array

    this.MeshGroup=new THREE.Group();
    Scene.add(this.MeshGroup);

    this.Body=new CANNON.Body({
        mass:25*1000,
        material:CarBodyMaterial
    });
    this.Body.linearDamping=Config.LinearDamping;
    this.Body.angularDamping=Config.AngularDamping;
    this.Body.position.x=Config.Position.x;
    this.Body.position.y=Config.Position.y;
    this.Body.position.z=Config.Position.z;
    this.Body.velocity.x=-Config.InitSpeed*30/60/3.6;

    var CarModelL1Group=new THREE.Group();
    var geometry = new THREE.BoxBufferGeometry(12.2,2.43,2.9);
	var material = new THREE.MeshLambertMaterial( {color: 0xDDDDDD} );
	var cube = new THREE.Mesh( geometry, material );
    CarModelL1Group.add(cube);
    CarModelL1Group.position.z=2.9/2;
    this.MeshGroup.add(CarModelL1Group);

    this.Body.addShape(new CANNON.Box(new CANNON.Vec3(12.2/2,2.43/2,2.9/2)),new CANNON.Vec3(0,0,2.9/2));

    // Create the vehicle
    this.Vehicle=new CANNON.RaycastVehicle({
        chassisBody: this.Body
    });
    this.Vehicle.addToWorld(world);

    //建構車輪
    for(var i=0,len=Config.Wheel.length;i<len;i++)
    {
        console.log(Config.Wheel[i]);
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
        WheelLOD.addLevel(WheelMash,200);

        WheelLOD.quaternion.copy(WheelBody.quaternion);
        WheelLOD.position.copy(WheelBody.position);

        WheelMashArray.push(WheelLOD);
        Scene.add(WheelLOD);
    }

    this.Ready2Reset=function(){

        this.NeedReset=true;

        this.MeshGroup.visible=false;
        for(var i=0,j=WheelMashArray.length;i<j;i++)
            WheelMashArray[i].visible=false;

        this.Body.position.set(0,0,999999);
        this.Body.sleep();
        this.Body.collisionResponse=false;
    };

    this.Reset=function(){

		this.Body.wakeUp();
		this.NeedReset=false;
        this.AiHasCrack=false;
        this.AiHasCrackTime=0;
        this.AiNoMoveTime=0;

        this.MeshGroup.visible=true;
        for(var i=0,j=WheelMashArray.length;i<j;i++)
            WheelMashArray[i].visible=true;
        this.Body.collisionResponse=true;
    };

    if(this.NeedReset)
    {
        this.Ready2Reset();
    }

    this.Run=function(){

        this.MeshGroup.position.copy(this.Body.position);
        this.MeshGroup.quaternion.copy(this.Body.quaternion);
        
        for(var i=0,j=WheelMashArray.length;i<j;i++)
        {
            WheelMashArray[i].update(MainCamera);
        }

        for (var i = 0,j=this.Vehicle.wheelInfos.length; i < j; i++) {
            this.Vehicle.updateWheelTransform(i);
            var t = this.Vehicle.wheelInfos[i].worldTransform;
            var wheelBody = wheelBodies[i];
            wheelBody.position.copy(t.position);
            wheelBody.quaternion.copy(t.quaternion);

            WheelMashArray[i].position.copy(t.position);
            WheelMashArray[i].quaternion.copy(t.quaternion);

            //this.Vehicle.wheelInfos[i].UserDataSpeed=GetWheelSpeed(this.Vehicle.wheelInfos[i]);

            //console.log(this.Vehicle.wheelInfos[i].UserDataSpeed);
        }

    	/*this.Position.x=this.MeshGroup.position.x*1;
		this.Position.y=this.MeshGroup.position.y*1;
		this.Position.z=this.MeshGroup.position.z*1;

		this.UpdateWorldPosition();
    	this.UpdatePosition();*/

    };
}