function Rock(iConfig)
{
	var Config={
        Position:new THREE.Vector3(0,0,0),
        OnRunCallBack:function(){},
        RunCallBack:function(){}
    };
    Config=$.extend(Config,iConfig);

    this.Position=new THREE.Vector3(Config.Position.x,Config.Position.y,Config.Position.z);

    this.MeshGroup=new THREE.Group();
    var geometry = new THREE.SphereGeometry(5.05,4,4);
	var material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
	var cube = new THREE.Mesh( geometry, material );
	this.MeshGroup.add(cube);
	Scene.add(this.MeshGroup);

    this.Body=new CANNON.Body({
    	mass: 0,
        material:groundMaterial
    });
    this.Body.addShape(new CANNON.Sphere(5.05));
    world.addBody(this.Body);

    this.Run=function(){

    	if(this.Position.x<-25)
        {
            this.Position.x+=50;
        }
        else if(this.Position.x>25)
        {
            this.Position.x-=50;
        }

        this.MeshGroup.position.x=this.Position.x;
	    this.MeshGroup.position.y=this.Position.y;
	    this.MeshGroup.position.z=this.Position.z;

    	this.Body.position.x=this.Position.x;
	    this.Body.position.y=this.Position.y;
	    this.Body.position.z=this.Position.z;

    };

	    


}