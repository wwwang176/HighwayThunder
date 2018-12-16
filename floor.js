function Streetlight(iConfig)
{
    var Config={
        Position:new THREE.Vector3(0,0,-9999999)
    };
    Config=$.extend(Config,iConfig);

    this.Position=Config.Position;

    this.MeshGroup=new THREE.Group();
    this.L1MeshGroup=new THREE.Group();
    this.L2MeshGroup=new THREE.Group();
    this.LOD=new THREE.LOD();
    this.LOD.addLevel(this.L1MeshGroup,0);
    this.LOD.addLevel(this.L2MeshGroup,50);
    this.MeshGroup.add(this.LOD);

    //直柱子
    var geometry = new THREE.CylinderBufferGeometry(0.15,0.2,9,3,1,false);
    var material = new THREE.MeshPhongMaterial( {color: 0x666666} );
    var verticalCylinder = new THREE.Mesh( geometry, material );
    verticalCylinder.rotation.x=90*Math.PI/180;
    verticalCylinder.position.z=9/2;
    this.L1MeshGroup.add(verticalCylinder);

    //橫柱子
    var geometry = new THREE.CylinderBufferGeometry(0.1,0.15,3,3,1,false);
    var material = new THREE.MeshPhongMaterial( {color: 0x666666} );
    var horizontalCylinder = new THREE.Mesh( geometry, material );
    horizontalCylinder.rotation.x=180*Math.PI/180;
    horizontalCylinder.position.y=-1.5;
    horizontalCylinder.position.z=9;
    this.L1MeshGroup.add(horizontalCylinder);

    //直柱子L2
    var geometry = new THREE.PlaneBufferGeometry(0.2,9);
    var material = new THREE.MeshBasicMaterial( {color: 0x666666, side: THREE.DoubleSide} );
    var verticalCylinderL2 = new THREE.Mesh( geometry, material );
    verticalCylinderL2.rotation.x=90*Math.PI/180;
    verticalCylinderL2.rotation.y=45*Math.PI/180;
    verticalCylinderL2.position.z=9/2;
    this.L2MeshGroup.add(verticalCylinderL2);

    //橫柱子L2
    var geometry = new THREE.PlaneBufferGeometry(3,0.15);
    var material = new THREE.MeshBasicMaterial( {color: 0x666666, side: THREE.DoubleSide} );
    var horizontalCylinderL2 = new THREE.Mesh( geometry, material );
    horizontalCylinderL2.rotation.x=90*Math.PI/180;
    horizontalCylinderL2.rotation.y=90*Math.PI/180;
    horizontalCylinderL2.position.y=-1.5;
    horizontalCylinderL2.position.z=9;
    this.L2MeshGroup.add(horizontalCylinderL2);

    //光
    if(NightMode)
    {
        var material = new THREE.SpriteMaterial({
            map: StreetlightLightTexture, 
            color: 0xffffff, 
            transparent: true, 
            blending: THREE.NormalBlending,
            depthWrite: false,
            depthTest: true
        });
        var Light = new THREE.Sprite( material );
        Light.position.set(0,-3,9-0.1);
        Light.scale.set(10,10,10);
        this.L1MeshGroup.add(Light);

        //光L2
        var material = new THREE.SpriteMaterial({
            map: StreetlightLightTexture, 
            color: 0xffffff, 
            transparent: true, 
            blending: THREE.NormalBlending,
            depthWrite: false,
            depthTest: true
        });
        var LightL2 = new THREE.Sprite( material );
        LightL2.position.set(0,-3,9-0.1);
        LightL2.scale.set(10,10,10);
        this.L2MeshGroup.add(LightL2);
    }
    
    
    this.LODUpdate=function(){
        this.LOD.update(MainCamera);
    };
}

function Floor(iConfig)
{
	var Config={
        Position:new THREE.Vector3(0,0,-9999999),
        HaveLight:false,
        OnRunCallBack:function(){},
        RunCallBack:function(){}
    };
    Config=$.extend(Config,iConfig);

	//繼承BasicObj
    this.prototype=Object.create(BasicObj.prototype);
    BasicObj.call(this,Config);

    var ThisFloor=this;

    this.MeshGroup=new THREE.Group();

    //地面
    var RoadWidth=28;

    Geometry=new THREE.PlaneBufferGeometry(50,RoadWidth,1,1);  //長50公尺 寬60公尺
    Material=new THREE.MeshPhongMaterial({color:0xcccccc,map:RoadTexture});
    this.GroundMash=new THREE.Mesh(Geometry,Material);
    this.GroundMash.receiveShadow=true;  //接收陰影
    this.MeshGroup.add(this.GroundMash);

    //地面線條
    Geometry=new THREE.PlaneBufferGeometry(50,RoadWidth,1,1);  //長50公尺 寬60公尺
    Material=new THREE.MeshPhongMaterial({color:0xcccccc,map:LineTexture,transparent: true});
    this.LineMash=new THREE.Mesh(Geometry,Material);
    this.LineMash.receiveShadow=true;  //接收陰影
    this.MeshGroup.add(this.LineMash);

    //草地
    var GrassWidth=2.5;
    Geometry=new THREE.PlaneBufferGeometry(50,GrassWidth,1,1);  //長50公尺
    Material=new THREE.MeshPhongMaterial({color:0xcccccc,map:GrassTexture});
    this.GrassdMash=new THREE.Mesh(Geometry,Material);
    this.GrassdMash.position.z=0.0025;
    this.GrassdMash.receiveShadow=true;  //接收陰影
    this.MeshGroup.add(this.GrassdMash);
    

    var RightStreetlightObject=null;
    var LeftStreetlightObject=null;
    
    if(Config.HaveLight)
    {
        if(NightMode)
        {
            //光線
            var SpotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI/2);
            SpotLight.position.set(0,0,3*3);
            this.MeshGroup.add( SpotLight );
        }

        //右路燈物件
        RightStreetlightObject=new Streetlight({});
        this.MeshGroup.add(RightStreetlightObject.MeshGroup);
        RightStreetlightObject.MeshGroup.position.y=RoadWidth/2+0.5;

        //左路燈物件
        LeftStreetlightObject=new Streetlight({});
        this.MeshGroup.add(LeftStreetlightObject.MeshGroup);
        LeftStreetlightObject.MeshGroup.position.y=-RoadWidth/2-0.5;
        LeftStreetlightObject.MeshGroup.rotation.z=180*Math.PI/180;
    }
    

    this.MeshGroup.position.set(Config.Position.x,Config.Position.y,Config.Position.z);
    Scene.add(this.MeshGroup);

    if(NightMode && Config.HaveLight)
    {
        SpotLight.target=this.MeshGroup;
    }
    

    this.Run=function(){

    	if(this.MeshGroup.position.x<-500)
        {
            this.MeshGroup.position.x+=1000;
        }
        else if(this.MeshGroup.position.x>500)
        {
            this.MeshGroup.position.x-=1000;
        }

        if(Config.HaveLight)
        {
            RightStreetlightObject.LODUpdate();
            LeftStreetlightObject.LODUpdate();
        }
    };
}

function SafetyCamera(iConfig)
{
    var Config={
        Position:new THREE.Vector3(0,0,0),
        OnRunCallBack:function(){},
        RunCallBack:function(){}
    };
    Config=$.extend(Config,iConfig);

    this.Position=Config.Position;

    this.MeshGroup=new THREE.Group();
    this.L1MeshGroup=new THREE.Group();
    this.L2MeshGroup=new THREE.Group();
    this.LOD=new THREE.LOD();
    this.LOD.addLevel(this.L1MeshGroup,0);
    this.LOD.addLevel(this.L2MeshGroup,400);
    this.MeshGroup.add(this.LOD);
    Scene.add(this.MeshGroup);

    //直柱子
    var geometry = new THREE.CylinderGeometry(0.1,0.15,3,3,1,false);
    var material = new THREE.MeshBasicMaterial( {color: 0x666666,map:SafetyLineTexture} );
    var verticalCylinder = new THREE.Mesh( geometry, material );
    verticalCylinder.rotation.x=90*Math.PI/180;
    verticalCylinder.position.z=3/2;
    this.L1MeshGroup.add(verticalCylinder);

    //箱子
    var geometry = new THREE.BoxBufferGeometry(0.5,0.5,1);
    var material = new THREE.MeshBasicMaterial( {color: 0x666666} );
    var Cube = new THREE.Mesh( geometry, material );
    Cube.rotation.z=45*Math.PI/180;
    Cube.position.z=3;
    this.L1MeshGroup.add(Cube);

    //鏡頭
    var geometry = new THREE.BoxBufferGeometry(0.2,0.2,0.4);
    var material = new THREE.MeshBasicMaterial( {color: 0x111111} );
    var CamreaCube = new THREE.Mesh( geometry, material );
    CamreaCube.rotation.z=45*Math.PI/180;
    CamreaCube.position.x=-0.25;
    CamreaCube.position.z=3;
    this.L1MeshGroup.add(CamreaCube);

    this.MeshGroup.position.x=Config.Position.x;
    this.MeshGroup.position.y=Config.Position.y;
    this.MeshGroup.position.z=Config.Position.z;
}

function Billboard(iConfig)
{
    var Config={
		texture:null,
        Position:new THREE.Vector3(0,0,-9999999),
        OnRunCallBack:function(){},
        RunCallBack:function(){}
    };
    Config=$.extend(Config,iConfig);

	//繼承BasicObj
    this.prototype=Object.create(BasicObj.prototype);
    BasicObj.call(this,Config);

    var ThisBillboard=this;
    this.MeshGroup=new THREE.Group();
    Scene.add(this.MeshGroup);
    this.LOD=new THREE.LOD();
    this.MeshGroup.add(this.LOD);
    this.L0MeshGroup=new THREE.Group();

    this.MeshGroup.position.x=Config.Position.x;
    this.MeshGroup.position.y=Config.Position.y;
    this.MeshGroup.position.z=Config.Position.z;
    
    var Tal=11;

    //右直柱子
    var geometry = new THREE.CylinderGeometry(0.5,0.5,Tal,3,1,false);
    var material = new THREE.MeshPhongMaterial( {color: 0x666666} );
    var verticalCylinder = new THREE.Mesh( geometry, material );
    verticalCylinder.rotation.x=90*Math.PI/180;
    verticalCylinder.position.z=Tal/2;
    verticalCylinder.position.y=28/2+0.5;
    this.L0MeshGroup.add(verticalCylinder);

    //左直柱子
    var geometry = new THREE.CylinderGeometry(0.5,0.5,Tal,3,1,false);
    var material = new THREE.MeshPhongMaterial( {color: 0x666666} );
    var verticalCylinder = new THREE.Mesh( geometry, material );
    verticalCylinder.rotation.x=90*Math.PI/180;
    verticalCylinder.position.z=Tal/2;
    verticalCylinder.position.y=-28/2-0.5;
    this.L0MeshGroup.add(verticalCylinder);
    
    //前橫幅
    Geometry=new THREE.PlaneBufferGeometry(28,4,1,1);  //長50公尺 寬60公尺
    Material=new THREE.MeshBasicMaterial({color:0xcccccc, map:BillboardTexture, opacity:1, transparent:true});
    var BoradMash=new THREE.Mesh(Geometry,Material);
    BoradMash.rotation.y=90*Math.PI/180;
    BoradMash.rotation.z=90*Math.PI/180;
    BoradMash.position.z=9;
    BoradMash.position.x=0.2;
    this.L0MeshGroup.add(BoradMash);

    //後橫幅
    /*Geometry=new THREE.PlaneBufferGeometry(28,4,1,1);  //長50公尺 寬60公尺
    Material=new THREE.MeshPhongMaterial({color:0xcccccc, map:BillboardTexture, opacity:1, transparent:true});
    var BoradMash=new THREE.Mesh(Geometry,Material);
    BoradMash.rotation.y=90*Math.PI/180;
    BoradMash.rotation.z=90*Math.PI/180;
    BoradMash.position.z=10;
    BoradMash.position.x=0.2;
    this.L0MeshGroup.add(BoradMash);*/

    //上橫桿
    var geometry = new THREE.CylinderBufferGeometry(0.2,0.2,28,3,1,false);
    var material = new THREE.MeshPhongMaterial( {color: 0x666666} );
    var horizontalCylinder = new THREE.Mesh( geometry, material );
    horizontalCylinder.rotation.x=180*Math.PI/180;
    horizontalCylinder.position.z=9+1;
    this.L0MeshGroup.add(horizontalCylinder);

    //下橫桿
    var geometry = new THREE.CylinderBufferGeometry(0.2,0.2,28,3,1,false);
    var material = new THREE.MeshPhongMaterial( {color: 0x666666} );
    var horizontalCylinder = new THREE.Mesh( geometry, material );
    horizontalCylinder.rotation.x=180*Math.PI/180;
    horizontalCylinder.position.z=9-1;
    this.L0MeshGroup.add(horizontalCylinder);
    
    

    this.LOD.addLevel(this.L0MeshGroup,0);
    


    this.Run=function(){

        this.MeshGroup.visible=(Math.abs(this.Position.x)<1000);

        this.MeshGroup.position.x=this.Position.x;
        this.MeshGroup.position.y=this.Position.y;
        this.MeshGroup.position.z=this.Position.z;
    };
}