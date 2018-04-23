({
    doInit : function(cmp, evt, helper) {
        helper.initParams(cmp, evt, helper);
        helper.getAccount(cmp, evt, helper, function(){
            helper.getAllTransactions(cmp, evt, helper);
        });
        window.setInterval($A.getCallback(function(){
            if (cmp.isValid()){
                helper.reloadInit(cmp, evt, helper, true);
            }
        }), 10000);
    },
    btnReloadClicked : function(cmp, evt, helper) {
        helper.reloadInit(cmp, evt, helper, false);
    },
    btnSendClicked : function(cmp, evt, helper) {
        helper.changeModalClass(cmp, 'send');	
    },
    btnReceiveClicked : function(cmp, evt, helper) {
        helper.changeModalClass(cmp, 'receive');	
    },
    btnConfClicked : function(cmp, evt, helper) {
        helper.changeModalClass(cmp, 'conf');			
    },
    btnCloseClicked : function(cmp, evt, helper) {
        helper.changeModalClass(cmp, null);			
    },
    tabChanged : function(cmp, evt, helper) {
        var target = evt.getSource().get('v.id');
        helper.changeConfTab(cmp, target);        
    },
    tabChanged2 : function(cmp, evt, helper) {
        var target = evt.getSource().get('v.id');
        if (target == 'tab-received'){
            cmp.set('v.homeTabR', true);        
            cmp.set('v.homeTabS', false);
        } else {
            cmp.set('v.homeTabS', true);        
            cmp.set('v.homeTabR', false);    
        }
    },
    elmTranClicked : function(cmp, evt, helper){
        $A.get("e.force:navigateToURL").setParams({
            url: cmp.get('v.nem_explorer_url') + 
            evt.currentTarget.dataset.type + '/' +
            evt.currentTarget.dataset.id
        }).fire();
    },
    btnCreateWalletClicked : function(cmp, evt, helper){
        helper.createNewWallet(cmp, evt, helper);
    },
    inputSendTokenChanged : function(cmp, evt, helper){
        helper.calcSendFee(cmp, evt, helper);
    },
    btnCopyAddressClicked : function(cmp, evt, helper){
        $A.get("e.force:showToast").setParams({
            title : 'SUCCESS',
            message: 'Your NEM wallet address was copyed to clipboard.'
        }).fire();
    },
    sendTokenClicked : function(cmp, evt, helper){
        var tran = cmp.get("v.sendToken");
        if (tran.recipient && tran.recipient.length >= 40 && tran.amount >= 0){
            helper.sendToken(cmp, evt, helper);
        }
    },
})