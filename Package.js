function Package(iConfig)
{
    var Config={
        Scene:Scene,
        World:world,
        Mass:2000,
        CanReset:true,					//是否會清除
        Position:new THREE.Vector3(0,0,-9999999),
		InitSpeed:0,
		LinearDamping:0.01,
        AngularDamping:0.5,
        CameraOptions:{
            Default:{
                Position:new THREE.Vector3(0,2,5),
                SpeedAdd:2,
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
                Position:new THREE.Vector3(0,0,0),
                SpeedAdd:0,
                SpeedPer:0
            },
        },
        OnReady2ResetCallBack:function(){},
        Ready2ResetCallBack:function(){},
        OnResetCallBack:function(){},
        ResetCallBack:function(){},
        OnRunCallBack:function(){},
        RunCallBack:function(){}
    };

    Config=$.extend(Config,iConfig);

    //繼承BasicObj
    this.prototype=Object.create(BasicObj.prototype);
    BasicObj.call(this,Config);

    this.Index=AllPackage.length;
    var ThisPackage=this;
    this.BodySize=new CANNON.Vec3(1,1,1);    //預判物體大小
    this.NeedReset=Config.CanReset;

    this.MeshGroup=new THREE.Group();
    Config.Scene.add(this.MeshGroup);

    this.LOD=new THREE.LOD();
    this.MeshGroup.add(this.LOD);

    this.Body=new CANNON.Body({
        mass:Config.Mass,
        material:CarBodyMaterial
    });
    this.Body.linearDamping=Config.LinearDamping;
    this.Body.angularDamping=Config.AngularDamping;
    this.Body.position.x=Config.Position.x;
    this.Body.position.y=Config.Position.y;
    this.Body.position.z=Config.Position.z;

    this.Body.velocity.x=-Config.InitSpeed*30/60/3.6;

    Config.World.addBody(this.Body);

    this.Show=function(){

        this.MeshGroup.visible=true;
        this.Body.wakeUp();
        this.Body.collisionResponse=true;
    };

    this.Hide=function(){
        
        this.MeshGroup.visible=false;
        this.Body.position.set(this.Index*100,9999999,999999);
        //this.Body.position.set(-100,0,50);
        this.Body.sleep();
        this.Body.collisionResponse=false;
    };

    //更新LOD
    this.LODUpdate=function(){
        this.LOD.update(MainCamera);
    };

    this.Ready2Reset=function(){

        Config.OnReady2ResetCallBack && Config.OnReady2ResetCallBack(ThisPackage);

        //console.log('ready2 reset');

        this.Body.velocity.setZero();
        this.Body.angularVelocity.setZero();
        this.Body.force.setZero();
        this.Body.torque.setZero();
        this.Body.quaternion.set(0,0,0,1);

        this.NeedReset=true;
        this.Hide();

        Config.Ready2ResetCallBack && Config.Ready2ResetCallBack(ThisPackage);

        //console.log('need reset');
    };

    this.Reset=function(){

        Config.OnResetCallBack && Config.OnResetCallBack(ThisPackage);

        //console.log('reset');

        this.NeedReset=false;
        this.AiHasCrack=false;
        this.AiHasCrackTime=0;
        this.AiNoMoveTime=0;

        this.Body.velocity.setZero();
        this.Body.angularVelocity.setZero();
        this.Body.force.setZero();
        this.Body.torque.setZero();
        this.Body.quaternion.set(0,0,0,1);

        /*this.Body.position.x=-15.5;
        this.Body.position.y=7.75;
        this.Body.position.z=10.5;*/

        /*var q = new CANNON.Quaternion();
        q.setFromAxisAngle(new CANNON.Vec3(0,0,1),Math.PI / 2/2/2);
        this.Body.quaternion=q;*/

        this.Show();

        Config.ResetCallBack && Config.ResetCallBack(ThisPackage);
    };

    if(this.NeedReset)
    {
        this.Ready2Reset();
    }

    this.Run=function(){

        Config.OnRunCallBack && Config.OnRunCallBack(ThisPackage);

        if(Config.CanReset && !this.NeedReset)
    	{
    		if(this.AiHasCrackTime>60*5 || this.Body.position.x<-SystemGameSize+10-20 || this.Body.position.x>SystemGameSize+10+20)
    		{
    			this.Ready2Reset();
    		}
        }

        this.MeshGroup.position.copy(this.Body.position);
        this.MeshGroup.quaternion.copy(this.Body.quaternion);
        
        if(this.NeedReset)
            return ;
            
        this.MeshGroup.position.copy(this.Body.position);
        this.MeshGroup.quaternion.copy(this.Body.quaternion);

        this.Position.x=this.MeshGroup.position.x*1;
        this.Position.y=this.MeshGroup.position.y*1;
        this.Position.z=this.MeshGroup.position.z*1;

        this.UpdatePosition();

        Config.RunCallBack && Config.RunCallBack(ThisPackage);

    };
}