function BasicObj(iConfig)
{
	var Config={
        Team:0,
        Position:new THREE.Vector3(0,0,-9999999),
        Debug:false,
        OnRunCallBack:function(){},
        RunCallBack:function(){}
    };
    Config=$.extend(Config,iConfig);

    var ThisObj=this;
    this.Alive=true;
    this.Team=Config.Team;
    this.Position=Config.Position;				//真實位置
    this.LastPosition=new THREE.Vector3(0,0,0);	//上次位置
    this.MoveDiff=new THREE.Vector3(0,0,0);		//移動差距

	this.GetConfig=function(){
		return Config;
	};

    this.Distance=function(P)
	{
		return Math.sqrt(
			(this.Position.x-P.x)*(this.Position.x-P.x)+
			(this.Position.z-P.y)*(this.Position.z-P.y));
	}
    this.Distance3D=function(V)
	{
		return Math.sqrt(
			(this.Position.x-V.x)*(this.Position.x-V.x)+
			(this.Position.y-V.y)*(this.Position.y-V.y)+
			(this.Position.z-V.z)*(this.Position.z-V.z));
	}

	this.UpdatePosition=function(){

		//紀錄位置
		this.MoveDiff.x=this.Position.x-this.LastPosition.x;
		this.MoveDiff.y=this.Position.y-this.LastPosition.y;
		this.MoveDiff.z=this.Position.z-this.LastPosition.z;

		this.LastPosition.x=this.Position.x*1;
		this.LastPosition.y=this.Position.y*1;
		this.LastPosition.z=this.Position.z*1;
	};

	this.Run=function(){

		Config.OnRunCallBack && Config.OnRunCallBack(ThisObj);

		this.UpdatePosition();

		Config.RunCallBack && Config.RunCallBack(ThisObj);
	};
}

//計算三點夾角
function Angle3(x1,y1,x2,y2,x3,y3)
{
	var ma_x = x1 - x2;
	var ma_y = y1 - y2;
	var mb_x = x3 - x2;
	var mb_y = y3 - y2;

	var v1 = (ma_x * mb_x) + (ma_y * mb_y);
	var ma_val = Math.sqrt(ma_x * ma_x + ma_y * ma_y);
	var mb_val = Math.sqrt(mb_x * mb_x + mb_y * mb_y);
	var cosM = v1 / (ma_val * mb_val);

	if (cosM < -1) cosM = -1;
	if (cosM > 1) cosM = 1;

	var angleAMB = Math.acos(cosM) * 180 / Math.PI;
	return angleAMB;
}

function Distance(P1,P2)
{
	return Math.sqrt(
		(P1.x-P2.x)*(P1.x-P2.x)+
		(P1.y-P2.y)*(P1.y-P2.y));
}
function Distance3D(V1,V2)
{
	return Math.sqrt(
		(V1.x-V2.x)*(V1.x-V2.x)+
		(V1.y-V2.y)*(V1.y-V2.y)+
		(V1.z-V2.z)*(V1.z-V2.z));
}
function Rand(max)
{
	if(max>0)
		return Math.floor(Math.random()*max);
	else
		return -1;
}
function RandF(max)
{
	return Math.random()*max;
}

function PID(iConfig)
{
	var Config={
        P:1,
        I:0,
        D:0
    };
    Config=$.extend(Config,iConfig);

    var P=0,I=0,D=0;
    var Sample=0,LastSample=0,Target=0,Error=0,DeltaTime=0;

    this.Reset=function(iConfig){
    	Config=$.extend(Config,iConfig);

    	P=0;
    	I=0;
    	D=0;
    	Sample=0;
    	LastSample=0;
    };

    this.AddSample=function(iSample){
		Sample = iSample;
	}

	this.SetTarget=function(iTarget){
		Target=iTarget;
	};

	this.Process=function(){

		Error = Target - Sample; 
		DeltaTime=(1/30)*SystemStepPer;

		P = Error * Config.P;
		I += (Error * Config.I) * DeltaTime;
		D = (LastSample - Sample) * Config.D / DeltaTime;

		LastSample=Sample;
		if(I<-50)I=-50; if(I>50)I=50;

		return P + I + D;
	};
}