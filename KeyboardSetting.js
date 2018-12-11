function KeyboardSetting(iConfig)
{
    var Config={
        LookBack:['Q'.charCodeAt(),'q'.charCodeAt()],  //向後看按鍵
        LookLeft:['A'.charCodeAt(),'a'.charCodeAt()],  //向左看按鍵
        LookRight:['D'.charCodeAt(),'d'.charCodeAt()],  //向右看按鍵
        NextGear:['W'.charCodeAt(),'w'.charCodeAt()],  //升檔按鍵
        PervGear:['S'.charCodeAt(),'s'.charCodeAt()],  //升檔按鍵
        N2O:[16],  //氮氣按鍵
        Brake:[32],  //煞車按鍵
        Reset:['R'.charCodeAt(),'r'.charCodeAt()],  //重置按鍵
        ChangeViewType:['V'.charCodeAt(),'v'.charCodeAt()],  //設定視角按鍵
        Bright:['X'.charCodeAt(),'x'.charCodeAt()],     //遠光燈
    };

    Config=$.extend(Config,iConfig);

    this.LookBack=Config.LookBack;
    this.LookLeft=Config.LookLeft;
    this.LookRight=Config.LookRight;
    this.NextGear=Config.NextGear;
    this.PervGear=Config.PervGear;
    this.N2O=Config.N2O;
    this.Brake=Config.Brake;
    this.Reset=Config.Reset;
    this.ChangeViewType=Config.ChangeViewType;
    this.Bright=Config.Bright;
    
    
}