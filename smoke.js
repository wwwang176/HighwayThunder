
function Spark(iConfig)
{
    var Config={
        AliveTime:30,
        Size:0.04,
        Count:5,
        Position:new THREE.Vector3(0,0,-9999999),
        MoveVector:new THREE.Vector3(0,0,0),
        Random:new THREE.Vector3(.15,.15,.15),
        ColorPer:new THREE.Color(1,1,0),    //顏色深度
        Texture:null
    };
    Config=$.extend(Config,iConfig);

	//繼承BasicObj
    this.prototype=Object.create(BasicObj.prototype);
    BasicObj.call(this,Config);

    this.Alive=false;
    this.Size=Config.Size;	//程度
    var ParticleCount=Config.Count;	//粒子數量
    var AliveTime=Config.AliveTime;
    this.Position=new THREE.Vector3(0,0,0);
    var GravityEffect=0.005/2;

    var Geometry = new THREE.BufferGeometry();
    var Material =new THREE.PointsMaterial({color:new THREE.Color(Config.ColorPer.r,Config.ColorPer.g,Config.ColorPer.b),size:this.Size,transparent:true});
    //Material.depthTest=false;
    Material.depthWrite=false;

    var ParticleArray=new Float32Array(ParticleCount*3);
    var EachPointMoveVector=[];
    for(p=0;p<ParticleCount;p++)
    {
        EachPointMoveVector[p]=new THREE.Vector4(0,0,0,0);
        
        ParticleArray[p*3+0]=0;
        ParticleArray[p*3+1]=0;
        ParticleArray[p*3+2]=0;
    }
    Geometry.addAttribute('position', new THREE.BufferAttribute(ParticleArray,3));

    this.ParticleSystem=new THREE.Points(Geometry,Material);
    this.ParticleSystem.sortParticles=true;
    this.ParticleSystem.visible=false;

    Scene.add(this.ParticleSystem);

    this.ReUse=function(iConfig)
    {
        if(Math.abs(iConfig.Position.x)>150)
            return;

        Config.ColorPer.r=1;
        Config.ColorPer.g=0.5+RandF(0.5);
        Config.ColorPer.b=0;
        
        Config=$.extend(Config,iConfig);

        this.Alive=true;
        AliveTime=Config.AliveTime*1;
        this.ParticleSystem.visible=true;

        this.Position=new THREE.Vector3(Config.Position.x,Config.Position.y,Config.Position.z);
        this.ParticleSystem.position.x=this.Position.x;
        this.ParticleSystem.position.y=this.Position.y;
        this.ParticleSystem.position.z=this.Position.z;

        Material.size=Config.Size;

        this.MoveVector=Config.MoveVector;
        this.MoveSpeed=Config.MoveSpeed;

        Material.color=new THREE.Color(Config.ColorPer.r,Config.ColorPer.g,Config.ColorPer.b);

        for(p=0;p<ParticleCount;p++)
        {
            EachPointMoveVector[p].x=/*this.MoveVector.x+*/RandF(Config.Random.x)-Config.Random.x/2;
            EachPointMoveVector[p].y=/*this.MoveVector.y+*/RandF(Config.Random.y)-Config.Random.y/2;
            EachPointMoveVector[p].z=/*this.MoveVector.z+*/RandF(Config.Random.z)-Config.Random.z/2;
            EachPointMoveVector[p].w=/*this.MoveVector.z+*/0;

            Geometry.attributes.position.array[p*3+0]=0;
            Geometry.attributes.position.array[p*3+1]=0;
            Geometry.attributes.position.array[p*3+2]=0;
        }
        Geometry.attributes.position.needsUpdate = true;
    };

    this.Crash=function()
    {
        this.Alive=false;
        this.ParticleSystem.visible=false;
    };

    this.Run=function()
    {
        AliveTime-=1*SystemStepPer;
        if(!this.Alive)return;
        if(AliveTime<=0){ this.Crash(); return; }
        
		for(i=0,l=ParticleCount;i<l;i++)
		{
            EachPointMoveVector[i].w-=GravityEffect;

            Geometry.attributes.position.array[i*3+0]+=(EachPointMoveVector[i].x*SystemStepPer);
            Geometry.attributes.position.array[i*3+1]+=(EachPointMoveVector[i].y*SystemStepPer);
            Geometry.attributes.position.array[i*3+2]+=(EachPointMoveVector[i].z*SystemStepPer)+EachPointMoveVector[i].w*SystemStepPer;

            if(Geometry.attributes.position.array[i*3+2]+this.Position.z<0)
            {
                Geometry.attributes.position.array[i*3+2]=0-this.Position.z;
                EachPointMoveVector[i].z*=-1;
                EachPointMoveVector[i].w=0;
            }
            // else if(Geometry.attributes.position.array[i*3+1]+this.Position.y>14)
            // {
            //     Geometry.attributes.position.array[i*3+1]=14-this.Position.y;
            //     EachPointMoveVector[i].y*=-1;
            // }
            // else if(Geometry.attributes.position.array[i*3+1]+this.Position.y<-14)
            // {
            //     Geometry.attributes.position.array[i*3+1]=-14-this.Position.y;
            //     EachPointMoveVector[i].y*=-1;
            // }

            EachPointMoveVector[i].x-=(EachPointMoveVector[i].x*0.02*SystemStepPer);
            EachPointMoveVector[i].y-=(EachPointMoveVector[i].y*0.02*SystemStepPer);
            EachPointMoveVector[i].z-=(EachPointMoveVector[i].z*0.02*SystemStepPer);
            
		}
        Geometry.attributes.position.needsUpdate = true;

        this.Position.x+=Config.MoveVector.x;
        this.Position.y+=Config.MoveVector.y;
        this.Position.z+=Config.MoveVector.z;
        

        this.ParticleSystem.position.x=this.Position.x/*+CamearRelativePosition.x*/;
        this.ParticleSystem.position.y=this.Position.y/*+CamearRelativePosition.x*/;
        this.ParticleSystem.position.z=this.Position.z/*+CamearRelativePosition.z*/;

        Config.MoveVector.x-=(Config.MoveVector.x*0.02*SystemStepPer);
        Config.MoveVector.y-=(Config.MoveVector.y*0.02*SystemStepPer);
        Config.MoveVector.z-=(Config.MoveVector.z*0.02*SystemStepPer);
        
    };
}

var p,i,l;
function Smoke(iConfig)
{
    var Config={
        AliveTime:133,
        Size:5,
        SizeAdd:0.1,
        Count:/*3*/2,
        Position:new THREE.Vector3(0,0,-9999999),
        Direction:0,    //水平方向
        DirectionY:90,  //垂直方向
        Speed:1.5,      //移動速度
        SpeedPer:5,     //初始加速
        BasicSpeedPer:0,
        EachSpeed:1,
        ColorPer:new THREE.Color(0.4,0.4,0.4),    //顏色深度
        Texture:null
    };
    Config=$.extend(Config,iConfig);

	//繼承BasicObj
    this.prototype=Object.create(BasicObj.prototype);
    BasicObj.call(this,Config);

    this.Size=Config.Size;	//程度
    var ParticleCount=Config.Count;	//粒子數量

    this.Alive=false;
    var OpcitySub=0.0075;
    //var ColorSub=0.0075;
    this.Position=new THREE.Vector3(Config.Position.x,Config.Position.y,Config.Position.z);
    this.Opacity=1;
    this.Direction=Config.Direction;	//方向
    this.DirectionY=Config.DirectionY;      //水平向上仰角
    this.Speed=Config.Speed;		//移動速度
    var SpeedPer=Config.SpeedPer;		//初始加速
    var BasicSpeedPer=Config.BasicSpeedPer;
    
    //var ColorPer=Config.ColorPer;
    var MoveVector=new THREE.Vector3(0,1,0);	//移動向量


    var Geometry = new THREE.BufferGeometry();
    var Material =new THREE.PointsMaterial({color:new THREE.Color(Config.ColorPer.r,Config.ColorPer.g,Config.ColorPer.b),size:this.Size*10,map:Config.Texture,blending:THREE.NormalBlending,transparent:true});
    //Material.depthTest=false;
    Material.depthWrite=false;

    var ParticleArray=new Float32Array(ParticleCount*3);
    var EachPointMoveVector=new Array();
    for(p=0;p<ParticleCount;p++)
    {
        EachPointMoveVector[p]=new THREE.Vector3(0,0,0);
        
        ParticleArray[p*3+0]=0;
        ParticleArray[p*3+1]=0;
        ParticleArray[p*3+2]=0;
    }
    Geometry.addAttribute('position', new THREE.BufferAttribute(ParticleArray,3));

    this.ParticleSystem=new THREE.Points(Geometry,Material);
    this.ParticleSystem.sortParticles=true;
    this.ParticleSystem.visible=false;

    Scene.add(this.ParticleSystem);
    this.ParticleSystem.position=new THREE.Vector3(0,0,-99999999);


    this.ReUse=function(iConfig)
    {
        Config=$.extend(Config,iConfig);

        this.Alive=true;

        if(Config.AliveTime>0)
        {
            OpcitySub=1/Config.AliveTime;
            //ColorSub=(1-Config.ColorPer.r)/Config.AliveTime;
        }
        else
        {
            OpcitySub=0.0075;
            //ColorSub=(1-Config.ColorPer.r)/133;
        }

        this.ParticleSystem.visible=true;
        Material.opacity=1;

        /*this.Opacity=1;
        ColorPer=0.4;

        iSize=iSize || 5;
        iPosition=iPosition || new THREE.Vector3(0,0,0);
        iDirection=iDirection || 0;
        iDirectionY=iDirectionY || 0;
        iSpeed=iSpeed || 1.5;
        iSpeedPer=iSpeedPer || 5;
        iColorPer=iColorPer || 0.4;*/



        /*this.Size=iSize;
        this.position=iPosition;
        this.Direction=iDirection;
        this.DirectionY=iDirectionY;
        this.Speed=iSpeed;
        SpeedPer=iSpeedPer;
        ColorPer=iColorPer;*/

        this.Position=new THREE.Vector3(Config.Position.x,Config.Position.y,Config.Position.z);
        Material.size=Config.Size;
        this.Opacity=1;

        this.Direction=Config.Direction;    //方向
        this.DirectionY=Config.DirectionY;      //水平向上仰角
        this.Speed=Config.Speed;        //移動速度
        SpeedPer=Config.SpeedPer;       //初始加速
        BasicSpeedPer=Config.BasicSpeedPer;


        MoveVector.z=this.Speed*Math.sin(this.DirectionY*Math.PI/180);
        var MoveVectorXY=this.Speed*Math.cos(this.DirectionY*Math.PI/180);
        MoveVector.x=MoveVectorXY*Math.cos(this.Direction*Math.PI/180);
        MoveVector.y=MoveVectorXY*Math.sin(this.Direction*Math.PI/180);

        Material.color=new THREE.Color(Config.ColorPer.r,Config.ColorPer.g,Config.ColorPer.b);

        for(p=0;p<ParticleCount;p++)
        {
            EachPointMoveVector[p].x=(RandF(Config.EachSpeed)-(Config.EachSpeed/2));
            EachPointMoveVector[p].y=(RandF(Config.EachSpeed)-(Config.EachSpeed/2));
            EachPointMoveVector[p].z=(RandF(Config.EachSpeed)-(Config.EachSpeed/2));

            Geometry.attributes.position.array[p*3+0]=0;
            Geometry.attributes.position.array[p*3+1]=0/*this.Position.y*/;
            Geometry.attributes.position.array[p*3+2]=0;

        }
    };

    this.Crash=function()
    {
        this.Alive=false;
        this.ParticleSystem.visible=false;
    };

    this.Run=function()
    {
        if(!this.Alive)return;
    	if(this.Opacity<=0){ this.Crash(); return; }

		for(i=0,l=ParticleCount;i<l;i++)
		{
            Geometry.attributes.position.array[i*3+0]+=(EachPointMoveVector[i].x);
            Geometry.attributes.position.array[i*3+1]+=(EachPointMoveVector[i].y);
            Geometry.attributes.position.array[i*3+2]+=(EachPointMoveVector[i].z+MoveVector.z);
		}
        Geometry.attributes.position.needsUpdate = true;

		Material.size+=Config.SizeAdd;
		Material.opacity=this.Opacity*0.5;
		this.Opacity-=(OpcitySub); //0.0075

    	this.Position.x+=MoveVector.x*SpeedPer;
    	this.Position.y+=MoveVector.y*SpeedPer;
    	this.Position.z+=MoveVector.z*SpeedPer;

    	SpeedPer=SpeedPer*0.9+BasicSpeedPer*0.1;

        //this.ParticleSystem.visible=this.IsVisible();

    	this.ParticleSystem.position.x=this.Position.x/*+CamearRelativePosition.x*/;
        this.ParticleSystem.position.y=this.Position.y/*+CamearRelativePosition.x*/;
        this.ParticleSystem.position.z=this.Position.z/*+CamearRelativePosition.z*/;

        //Material.color.r-=(ColorSub);
        //Material.color.g-=(ColorSub);
        //Material.color.b-=(ColorSub);

        //this.ParticleSystem.visible=this.InDrawSide(this.ParticleSystem.position.x,this.ParticleSystem.position.z);

    };

}