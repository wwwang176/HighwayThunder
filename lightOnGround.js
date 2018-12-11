function LightOnGround(iConfig)
{
    var Config={
        Size:2.5,
        Position:new THREE.Vector3(0,0,-9999999),
        Opacity:0.5,
    };
    Config=$.extend(Config,iConfig);

    this.Alive=false;
    this.Size=Config.Size;				    //尺寸
    this.Position=Config.Position;			//真實位置
    this.Opacity=Config.Opacity;			//透明度
    

    var geometry = new THREE.PlaneBufferGeometry(1,1,1,1);
    var material = new THREE.MeshBasicMaterial({
        map: LightOnGroundTexture, 
        color: 0xffffff, 
        transparent: true, 
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true
    });
    var LGroundLight = new THREE.Mesh(geometry, material);
    //LGroundLight.position.set(-5,0,0);
    //LGroundLight.scale.set(4,5,1);
    LGroundLight.rotation.z=90/180*Math.PI;
    //LGroundLight.material.opacity=0.5;
    this.MeshGroup.add(LGroundLight);

    Scene.add(this.MeshGroup);

    this.ReUse=function(iConfig){

        Config=$.extend(Config,iConfig);

        this.Alive=true;
        this.Size=Config.Size;				    //尺寸
        this.Position=Config.Position;			//真實位置
        this.Opacity=Config.Opacity;			//透明度

        LGroundLight.position.set(Config.P,0,0);

    };

}