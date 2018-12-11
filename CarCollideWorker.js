
importScripts('javascripts/extend.js');
importScripts('javascripts/three.min.js');
importScripts('javascripts/cannon.min.js');

var AllCar=[];
var AllPackage=[];
var Scene = new THREE.Scene();

var DebugCount=0;

/*
var Geometry = new THREE.BoxBufferGeometry(12.2,10,10);
var Material = new THREE.MeshBasicMaterial({color: 0xCCCCCC,side:THREE.DoubleSide});
var BBB = new THREE.Mesh(Geometry, Material);
BBB.position.set(0,4.5,0);
Scene.add(BBB);*/

	
//牆面

var RoadWidth=28;
var WallHeight=5;
/*
Geometry=new THREE.PlaneBufferGeometry(5000,WallHeight,1,1);  //長50公尺
Material=new THREE.MeshPhongMaterial({color:0xcccccc});
var LWalldMash=new THREE.Mesh(Geometry,Material);
LWalldMash.position.set(0,-RoadWidth/2,WallHeight/2);
LWalldMash.rotation.x=-90*Math.PI/180;
Scene.add(LWalldMash);

Geometry=new THREE.PlaneBufferGeometry(5000,WallHeight,1,1);  //長50公尺
Material=new THREE.MeshPhongMaterial({color:0xcccccc});
var RWalldMash=new THREE.Mesh(Geometry,Material);
RWalldMash.position.set(0,RoadWidth/2,WallHeight/2);
RWalldMash.rotation.x=90*Math.PI/180;
Scene.add(RWalldMash);
*/

function FakePackage(iConfig)
{
	var Config={
		Pass:false,
		Position:new THREE.Vector3(0,0,0),
		Size:new THREE.Vector3(0,0,0),
		MoveVector:new THREE.Vector3(0,0,0),
		Quaternion:new CANNON.Quaternion()
	};
	Config=extend(Config,iConfig);

	this.Body=new CANNON.Body();

	this.Pass=Config.Pass;
	this.Position=new THREE.Vector3(Config.Position.x,Config.Position.y,Config.Position.z);
	this.Quaternion=new CANNON.Quaternion(Config.Quaternion.x,Config.Quaternion.y,Config.Quaternion.z,Config.Quaternion.w);
	this.Size=new THREE.Vector3(Config.Size.x,Config.Size.y,Config.Size.z);
	this.MoveVector=new THREE.Vector3(Config.MoveVector.x,Config.MoveVector.y,Config.MoveVector.z);
	this.Index=AllPackage.length;

	//Config.Size=new THREE.Vector3(12.2,6,10);

	var Geometry = new THREE.BoxBufferGeometry(Config.Size.x,Config.Size.y,Config.Size.z);
	var Material = new THREE.MeshBasicMaterial({color: 0xCCCCCC,side:THREE.DoubleSide});
	this.Cube = new THREE.Mesh(Geometry, Material);

	//this.Cube.visible=false;
	Scene.add(this.Cube);

	this.ReUse=function(iConfig){

		Config=extend(Config,iConfig);
			
		this.Pass=Config.Pass;
		//this.Position=Config.Position;
		//this.Quaternion=Config.Quaternion;
		//this.Size=Config.Size;
		//this.MoveVector=Config.MoveVector;

		if(this.Pass)
			this.Cube.visible=false;
		else
			this.Cube.visible=true;

		this.Position.x=Config.Position.x;
		this.Position.y=Config.Position.y;
		this.Position.z=Config.Position.z;
		
		this.Quaternion.x=Config.Quaternion._x;
		this.Quaternion.y=Config.Quaternion._y;
		this.Quaternion.z=Config.Quaternion._z;
		this.Quaternion.w=Config.Quaternion._w;

		this.Size.x=Config.Size.x;
		this.Size.y=Config.Size.y;
		this.Size.z=Config.Size.z;
		
		this.MoveVector.x=Config.MoveVector.x;
		this.MoveVector.y=Config.MoveVector.y;
		this.MoveVector.z=Config.MoveVector.z;
		
		//this.Cube.position.set(this.Position.x,this.Position.y,this.Position.z);
		this.Cube.position.x=this.Position.x;
		this.Cube.position.y=this.Position.y;
		this.Cube.position.z=this.Position.z;
		this.Cube.quaternion.set(this.Quaternion.x,this.Quaternion.y,this.Quaternion.z,this.Quaternion.w);
		

		this.Body.position.set(this.Position.x,this.Position.y,this.Position.z);
		this.Body.quaternion.set(this.Quaternion.x,this.Quaternion.y,this.Quaternion.z,this.Quaternion.w);

		this.Cube.updateMatrixWorld( true );
		
	};

}

function FakeCar(iConfig)
{
	var Config={
		Pass:false,
		Position:new THREE.Vector3(0,0,0),
		Size:new THREE.Vector3(0,0,0),
		MoveVector:new THREE.Vector3(0,0,0),
		Quaternion:new CANNON.Quaternion()
	};
	Config=extend(Config,iConfig);

	this.Body=new CANNON.Body();

	this.Pass=Config.Pass;
	this.Position=new THREE.Vector3(Config.Position.x,Config.Position.y,Config.Position.z);
	this.Quaternion=new CANNON.Quaternion(Config.Quaternion.x,Config.Quaternion.y,Config.Quaternion.z,Config.Quaternion.w);
	this.Size=new THREE.Vector3(Config.Size.x,Config.Size.y,Config.Size.z);
	this.MoveVector=new THREE.Vector3(Config.MoveVector.x,Config.MoveVector.y,Config.MoveVector.z);
	this.Index=AllCar.length;
	this.PassPackageIndex=Config.PassPackageIndex;

	this.FrontRaycaster=new THREE.Raycaster();
	this.FrontLeftRaycaster=new THREE.Raycaster();
	this.FrontRightaycaster=new THREE.Raycaster();
	this.LeftRaycaster=new THREE.Raycaster();
	this.RightRaycaster=new THREE.Raycaster();

	this.FrontWorldPosition=new THREE.Vector3();
	this.FrontLeftWorldPosition=new THREE.Vector3();
	this.FrontRightWorldPosition=new THREE.Vector3();
	this.LeftWorldPosition=new THREE.Vector3();
	this.RightWorldPosition=new THREE.Vector3();

	var Geometry = new THREE.BoxBufferGeometry(Config.Size.x,Config.Size.y,Config.Size.z);
	var Material = new THREE.MeshBasicMaterial({color: 0xCCCCCC,side:THREE.DoubleSide});
	this.Cube = new THREE.Mesh(Geometry, Material);
	Scene.add(this.Cube);

	this.CollisionData={
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
		RightHitDistanceMax:0,*/

		BrakeValue:0,
		SteerValue:0,
	};

	this.ResetCollisionData=function(){
		
		this.CollisionData={
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
			RightHitDistanceMax:0,*/
			
			BrakeValue:0,
			SteerValue:0,
		};
	};


	this.ResetCollisionData();

	this.ReUse=function(iConfig){

		Config=extend(Config,iConfig);
			
		this.Pass=Config.Pass;

		this.Position.x=Config.Position.x;
		this.Position.y=Config.Position.y;
		this.Position.z=Config.Position.z;

		this.Quaternion.x=Config.Quaternion._x;
		this.Quaternion.y=Config.Quaternion._y;
		this.Quaternion.z=Config.Quaternion._z;
		this.Quaternion.w=Config.Quaternion._w;

		this.Size.x=Config.Size.x;
		this.Size.y=Config.Size.y;
		this.Size.z=Config.Size.z;

		this.MoveVector.x=Config.MoveVector.x;
		this.MoveVector.y=Config.MoveVector.y;
		this.MoveVector.z=Config.MoveVector.z;

		this.Cube.visible=false;
		this.Cube.position.set(this.Position.x,this.Position.y,this.Position.z);
		this.Cube.quaternion.set(this.Quaternion.x,this.Quaternion.y,this.Quaternion.z,this.Quaternion.w);

		this.Body.position.set(this.Position.x,this.Position.y,this.Position.z);
		this.Body.quaternion.set(this.Quaternion.x,this.Quaternion.y,this.Quaternion.z,this.Quaternion.w);

		this.Cube.updateMatrixWorld( true );

		//console.log(this.Body.position);

		/*if(this.Index==0)
		{
			console.log(this.Pass);
			console.log(this.Cube.visible);
			console.log(this.Cube.position);
		}*/

		if(this.Pass)
		{
			return;
		}

		//暫時隱藏PassPackage
		for(var i=0;i<this.PassPackageIndex.length;i++)
		{
			if(!AllPackage[this.PassPackageIndex[i]].Pass)
			{
				AllPackage[this.PassPackageIndex[i]].Cube.visible=false;
			}
		}

		DebugCount++;

		this.FrontWorldPosition=this.Body.pointToWorldFrame(new CANNON.Vec3(-this.Size.x/2/*-0.01*-1*/,0,0),new CANNON.Vec3(0,0,0));
		//this.FrontLeftWorldPosition=this.Body.pointToWorldFrame(new CANNON.Vec3(-this.Size.x/2-0.01*-1,-this.Size.y/2-0.01*-1,0),new CANNON.Vec3(0,0,0));
		//this.FrontRightWorldPosition=this.Body.pointToWorldFrame(new CANNON.Vec3(-this.Size.x/2-0.01*-1,this.Size.y/2+0.01*-1,0),new CANNON.Vec3(0,0,0));
		this.FrontLeftWorldPosition=this.Body.pointToWorldFrame(new CANNON.Vec3(0,-this.Size.y/2,0),new CANNON.Vec3(0,0,0));
		this.FrontRightWorldPosition=this.Body.pointToWorldFrame(new CANNON.Vec3(0,this.Size.y/2,0),new CANNON.Vec3(0,0,0));
		
		this.LeftWorldPosition=this.Body.pointToWorldFrame(new CANNON.Vec3(0,-this.Size.y/2-0.01*-1,0),new CANNON.Vec3(0,0,0));
		this.RightWorldPosition=this.Body.pointToWorldFrame(new CANNON.Vec3(0,this.Size.y/2+0.01*-1,0),new CANNON.Vec3(0,0,0));

		var LocalMoveVector=this.Body.pointToLocalFrame(new CANNON.Vec3(
			this.Position.x + this.MoveVector.x,
			this.Position.y + this.MoveVector.y,
			this.Position.z + this.MoveVector.z
		));

		//Front
		var FrontCenterWillHit=false;
		this.FrontRaycaster.set(
				//new THREE.Vector3(this.FrontWorldPosition.x,this.FrontWorldPosition.y,this.FrontWorldPosition.z),
				new THREE.Vector3(this.Body.position.x,this.Body.position.y,this.Body.position.z),
                new THREE.Vector3(
                    /*this.FrontWorldPosition.x - this.Position.x,
                    this.FrontWorldPosition.y - this.Position.y,
					0)*/
					this.MoveVector.x,
					this.MoveVector.y,
					0)
                .normalize()
            );
        this.FrontRaycaster.far=this.Size.x/2 -LocalMoveVector.x*60*3.6*0.25+2 +10;
        var FrontCenterHitDistance=this.FrontRaycaster.far;

		if(this.MoveVector.length()>0)
		{
			var CollisionArray=this.FrontRaycaster.intersectObjects(Scene.children,true);
			if(CollisionArray.length>0)
			{
				FrontCenterWillHit=true;
				FrontCenterHitDistance=CollisionArray[0].distance;
			}
		}
		

        //Front Left
        var FrontLeftWillHit=false;
		this.FrontLeftRaycaster.set(
                new THREE.Vector3(this.FrontLeftWorldPosition.x,this.FrontLeftWorldPosition.y,this.FrontLeftWorldPosition.z),
				new THREE.Vector3(
                    /*this.FrontWorldPosition.x - this.Position.x,
                    this.FrontWorldPosition.y - this.Position.y,
					0)*/
					this.MoveVector.x,
					this.MoveVector.y,
					0)
                .normalize()
            );
        this.FrontLeftRaycaster.far=this.Size.x/2 -LocalMoveVector.x*60*3.6*0.15+1/*20*/;
		var FrontLeftHitDistance=this.FrontLeftRaycaster.far;
		
		if(this.MoveVector.length()>0)
		{
			var CollisionArray=this.FrontLeftRaycaster.intersectObjects(Scene.children,true);
			if(CollisionArray.length>0)
			{
				FrontLeftWillHit=true;
				FrontLeftHitDistance=CollisionArray[0].distance;
			}
		}


        //Front Right
		var FrontRightWillHit=false;
		this.FrontRightaycaster.set(
                new THREE.Vector3(this.FrontRightWorldPosition.x,this.FrontRightWorldPosition.y,this.FrontRightWorldPosition.z),
                new THREE.Vector3(
                    /*this.FrontWorldPosition.x - this.Position.x,
                    this.FrontWorldPosition.y - this.Position.y,
					0)*/
					this.MoveVector.x,
					this.MoveVector.y,
					0)
                .normalize()
            );

        this.FrontRightaycaster.far=this.Size.x/2 -LocalMoveVector.x*60*3.6*0.15+1/*20*/;
        var FrontRightHitDistance=this.FrontRightaycaster.far;

		if(this.MoveVector.length()>0)
		{
			var CollisionArray=this.FrontRightaycaster.intersectObjects(Scene.children,true);
			if(CollisionArray.length>0)
			{
				FrontRightWillHit=true;
				FrontRightHitDistance=CollisionArray[0].distance;
			}
		}

        //Left
        var LeftWillHit=false;
		this.LeftRaycaster.set(
                new THREE.Vector3(this.FrontLeftWorldPosition.x,this.FrontLeftWorldPosition.y,this.FrontLeftWorldPosition.z),
                //new THREE.Vector3(0,0,0),
                new THREE.Vector3(
                    this.LeftWorldPosition.x - this.Position.x,
                    this.LeftWorldPosition.y - this.Position.y,
                    0)
                .normalize()
            );

        this.LeftRaycaster.far=/*this.Size.y/2*/ +0.5;
        var LeftHitDistance=this.LeftRaycaster.far;

		if(this.MoveVector.length()>0)
		{
			var CollisionArray=this.LeftRaycaster.intersectObjects(Scene.children,true);
			if(CollisionArray.length>0)
			{
				LeftWillHit=true;
				LeftHitDistance=CollisionArray[0].distance;
			}
		}
			

        //Right
        var RightWillHit=false;
		this.RightRaycaster.set(
                new THREE.Vector3(this.FrontRightWorldPosition.x,this.FrontRightWorldPosition.y,this.FrontRightWorldPosition.z),
                //new THREE.Vector3(0,0,0),
                new THREE.Vector3(
                    this.RightWorldPosition.x - this.Position.x,
                    this.RightWorldPosition.y - this.Position.y,
                    0)
                .normalize()
            );

        this.RightRaycaster.far=/*this.Size.y/2*/ +0.5;
        var RightHitDistance=this.RightRaycaster.far;

		if(this.MoveVector.length()>0)
		{
			var CollisionArray=this.RightRaycaster.intersectObjects(Scene.children,true);
			if(CollisionArray.length>0)
			{
				RightWillHit=true;
				RightHitDistance=CollisionArray[0].distance;
			}
		}

		
		this.Cube.visible=true;

		//取消隱藏PassPackage
		for(var i=0;i<this.PassPackageIndex.length;i++)
		{
			if(!AllPackage[this.PassPackageIndex[i]].Pass)
			{
				AllPackage[this.PassPackageIndex[i]].Cube.visible=false;
			}
		}

		this.ResetCollisionData();
		
		/*if(this.Index==0)
		{
			console.log(FrontCenterWillHit);
			console.log(FrontCenterHitDistance);
			console.log(1.5 * (1-((FrontCenterHitDistance-Config.Size.x/2)/(this.FrontRaycaster.far-Config.Size.x/2))));
		}*/

		//Math
		var Hit=(FrontCenterWillHit || FrontLeftWillHit || FrontRightWillHit || LeftWillHit || RightWillHit);
		var BrakeValue=0;
		var SteerValue=0;
		
		if(Hit)
        {
            //前碰撞
            if(FrontCenterWillHit)
            {
				BrakeValue += 1.5 * (1-((FrontCenterHitDistance-Config.Size.x/2)/(this.FrontRaycaster.far-Config.Size.x/2)));
				SteerValue += (RandF(1)-0.5) * (1-(FrontCenterHitDistance/this.FrontRaycaster.far));
            }

            //前左碰撞
            if(FrontLeftWillHit)
            {
                BrakeValue += 1 * (1-((FrontLeftHitDistance-Config.Size.x/2)/(this.FrontLeftRaycaster.far-Config.Size.x/2)));
				SteerValue += 1 * (1-(FrontLeftHitDistance/this.FrontLeftRaycaster.far));
			}

            //前右碰撞
            if(FrontRightWillHit)
            {
                BrakeValue += 1 * (1-((FrontRightHitDistance-Config.Size.x/2)/(this.FrontRightaycaster.far-Config.Size.x/2)));
				SteerValue += -1 * (1-(FrontRightHitDistance/this.FrontRightaycaster.far));
			}

            //左碰撞
            if(LeftWillHit)
            {
				BrakeValue += 1 * (1-(LeftHitDistance/this.LeftRaycaster.far));
				SteerValue += 1 * (1-(LeftHitDistance/this.LeftRaycaster.far));
            }
            
            //右碰撞
            if(RightWillHit)
            {
				BrakeValue += 1 * (1-(RightHitDistance/this.RightRaycaster.far));
				SteerValue += -1 * (1-(RightHitDistance/this.RightRaycaster.far));
			}


        	var FrontHitDistanceMin=Math.min(FrontCenterHitDistance,FrontLeftHitDistance,FrontRightHitDistance);

        	this.CollisionData={
        		/*Hit:true,
        		FrontDistanceMin:FrontHitDistanceMin,

        		FrontCenterHit:FrontCenterWillHit,
        		FrontCenterHitDistance:FrontCenterHitDistance,
        		FrontCenterHitDistanceMax:this.FrontRaycaster.far,

        		FrontLeftHit:FrontLeftWillHit,
        		FrontLeftHitDistance:FrontLeftHitDistance,
        		FrontLeftHitDistanceMax:this.FrontLeftRaycaster.far,

        		FrontRightHit:FrontRightWillHit,
        		FrontRightHitDistance:FrontRightHitDistance,
        		FrontRightHitDistanceMax:this.FrontRightaycaster.far,

        		LeftHit:LeftWillHit,
	        	LeftHitDistance:LeftHitDistance,
	        	LeftHitDistanceMax:this.LeftRaycaster.far,

	        	RightHit:RightWillHit,
	        	RightHitDistance:RightHitDistance,
				RightHitDistanceMax:this.RightRaycaster.far,*/
				
				BrakeValue:BrakeValue,
				SteerValue:SteerValue,

	        };
        }
	};

}

var CarPostData=[];
//Message
self.onmessage = function(e){

	var Data=e.data;

	//console.log(Data);

	if(Data.Type=='Init')
	{
		for(var i=0;i<Data.PackageData.length;i++)
		{
			var NewPackage=new FakePackage(Data.PackageData[i]/*{
				Size:Data.PackageData[i].Size,
				Position:Data.PackageData[i].Position,
				Quaternion:Data.PackageData[i].Quaternion
			}*/);
			AllPackage.push(NewPackage);
		}
		for(var i=0;i<Data.CarData.length;i++)
		{
			var NewCar=new FakeCar(Data.CarData[i]);
			AllCar.push(NewCar);
		}

		self.postMessage({
	        Type:'Inited'
	    });
	}
	else if(Data.Type=='ReUse')
	{
		DebugCount=0;

		for(var i=0;i<Data.PackageData.length;i++)
		{
			AllPackage[i].ReUse(Data.PackageData[i]);
		}

		CarPostData.length=0;
		for(var i=0;i<Data.CarData.length;i++)
		{
			AllCar[i].ReUse(Data.CarData[i]);
			CarPostData.push(AllCar[i].CollisionData);
		}

		//console.log(DebugCount);

		self.postMessage({
	        Type:'OK',
			CarData:CarPostData
	    });
	}

};

function RandF(max)
{
	return Math.random()*max;
}